#!/usr/bin/env node
"use strict";

/**
 * 上游技能的 lock 一致性 + 清单可复现性。
 *
 * 三件事：
 *   1. lock → 磁盘：`skills-lock.json` 的每个 key 都应有对应的 SKILL.md
 *   2. 磁盘 → lock：`.agents/skills` 下每个技能都应出现在 lock 里
 *      （旧版 check-local-skills.js **永远 exit 0**，这一条是它放过的缺陷）
 *   3. 清单可复现：内存里重建的 local-skills.json 必须与提交的版本逐字节一致
 *
 * 第 2 条是本仓库最实际的一种漂移：`npx skills add` 装进来、忘了提交 lock。
 */

const { Report } = require("../lib/report");
const { trackedSet, readTracked } = require("../lib/gitfiles");
const {
  VENDOR_SKILLS_PARENT,
  buildManifest,
  serializeManifest,
} = require("../lib/manifest");

const LOCK_FILE = "skills-lock.json";
const MANIFEST_FILE = "local-skills.json";

const report = new Report("上游技能 lock 一致性");

const tracked = trackedSet();

const lockRaw = readTracked(LOCK_FILE);
if (lockRaw === null) {
  report.abort(`${LOCK_FILE} 不在 git 索引里（或已从工作区删除）。`);
}

let lock;
try {
  lock = JSON.parse(lockRaw);
} catch (err) {
  report.abort(`${LOCK_FILE} 不是合法 JSON：${err.message}`);
}

const lockSkills = lock.skills || {};
const lockedNames = Object.keys(lockSkills).sort();

// --- 1. lock → 磁盘 ---------------------------------------------------------
const missingOnDisk = [];
for (const name of lockedNames) {
  if (!tracked.has(`${VENDOR_SKILLS_PARENT}/${name}/SKILL.md`)) {
    missingOnDisk.push(name);
  }
}
for (const name of missingOnDisk) {
  report.fail(
    LOCK_FILE,
    0,
    `lock 里有「${name}」，但 ${VENDOR_SKILLS_PARENT}/${name}/SKILL.md 不在 git 索引里`
  );
}

// --- 2. 磁盘 → lock ---------------------------------------------------------
let manifest;
try {
  manifest = buildManifest();
} catch (err) {
  report.abort(`无法构建清单：${err.message}`);
}

for (const skill of manifest.localOnlySkills) {
  report.fail(
    `${VENDOR_SKILLS_PARENT}/${skill.name}`,
    0,
    `技能在仓库里，但不在 ${LOCK_FILE} 中 —— 用 npx skills add 安装，或手工补进 lock`
  );
}

// --- 3. 清单可复现 ----------------------------------------------------------
const manifestRaw = readTracked(MANIFEST_FILE);
if (manifestRaw === null) {
  report.fail(MANIFEST_FILE, 0, "清单文件不在 git 索引里（或已从工作区删除）");
} else {
  const expected = serializeManifest(manifest);
  if (manifestRaw !== expected) {
    report.fail(
      MANIFEST_FILE,
      0,
      "清单与仓库当前状态不一致 —— 运行 node scripts/gen-local-skills.js --write 更新"
    );
    for (const line of describeFirstDiff(manifestRaw, expected)) {
      report.info(line);
    }
  }
}

report.info(
  `lock ${lockedNames.length} 条 ↔ 磁盘 ${manifest.totalLocalSkills} 个技能；` +
    `仅本地 ${manifest.localOnlyCount} 个。`
);

report.finish();

/**
 * 找出两段文本的第一处差异并按行展示。
 * 「清单过时」这句话本身没有可操作性，读者需要知道差在哪一行。
 */
function describeFirstDiff(actual, expected) {
  const a = actual.split("\n");
  const b = expected.split("\n");
  const max = Math.max(a.length, b.length);

  for (let i = 0; i < max; i += 1) {
    if (a[i] !== b[i]) {
      const ctx = [];
      ctx.push(`第一个差异在第 ${i + 1} 行：`);
      ctx.push(`  - 已提交：${a[i] === undefined ? "(缺行)" : a[i]}`);
      ctx.push(`  + 期望值：${b[i] === undefined ? "(缺行)" : b[i]}`);
      return ctx;
    }
  }
  return ["两段文本的行完全相同，但字节不同（多半是行尾或末尾换行差异）"];
}
