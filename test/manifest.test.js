#!/usr/bin/env node
"use strict";

/**
 * `scripts/lib/manifest.js` 的单元测试。
 *
 * 这个模块的全部价值是**确定性**：同一份工作区必须逐字节产出同一份清单
 * （否则 `git diff --exit-code` 不可用，生成物与生成器的一致性就没法验）。
 * 所以下面的重点是「两次调用相等」和「与提交进仓库的那份逐字节相等」。
 *
 * 依赖仓库当前内容的部分（技能清单、锁文件）由 git 索引决定，是集成性质的断言 ——
 * 它们正是这个模块存在的意义，值得钉住。
 *
 * 运行：node --test "test/*.test.js"（在仓库根执行）
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  VENDOR_SKILLS_PARENT,
  buildManifest,
  serializeManifest,
  trackedUnder,
} = require("../scripts/lib/manifest");
const { skillDirs, readTracked, trackedFiles } = require("../scripts/lib/gitfiles");

/** 锁文件里声明的技能（这份清单是 local-skills.json 的上游事实来源）。 */
function lockSkills() {
  return JSON.parse(readTracked("skills-lock.json")).skills || {};
}

// ── 确定性与序列化 ────────────────────────────────────────────────────────

test("字段恰好是这五个（回归：不再写 generatedAt）", () => {
  const m = buildManifest();

  assert.deepEqual(Object.keys(m).sort(), [
    "githubSkills",
    "localOnlyCount",
    "localOnlySkills",
    "totalLocalSkills",
    "totalLockedSkills",
  ]);
});

test("同一份工作区两次构建深相等，序列化结果逐字节相同", () => {
  const a = buildManifest();
  const b = buildManifest();

  assert.deepEqual(a, b);
  assert.equal(serializeManifest(a), serializeManifest(b));
});

test("serializeManifest：2 空格缩进、末尾换行、可原样解析回来", () => {
  const m = buildManifest();
  const text = serializeManifest(m);

  assert.ok(text.endsWith("\n"), "末尾要有换行（.editorconfig 的 insert_final_newline）");
  assert.ok(!text.includes("\r"), "不该有 CR");
  assert.ok(text.includes('\n  "totalLocalSkills"'), "应为 2 空格缩进");
  assert.deepEqual(JSON.parse(text), m);
});

test("生成物与提交进仓库的 local-skills.json 逐字节一致", () => {
  const committed = readTracked("local-skills.json");

  assert.notEqual(committed, null, "local-skills.json 应在索引里");
  assert.equal(
    serializeManifest(buildManifest()),
    committed,
    "local-skills.json 过期了 —— 重跑 node scripts/gen-local-skills.js"
  );
});

// ── 计数 ──────────────────────────────────────────────────────────────────

test("计数与事实来源对得上", () => {
  const m = buildManifest();
  const lock = lockSkills();
  const vendorSkills = skillDirs().filter((s) => s.parent === VENDOR_SKILLS_PARENT);

  assert.equal(VENDOR_SKILLS_PARENT, ".agents/skills");
  assert.equal(m.totalLocalSkills, vendorSkills.length);
  assert.equal(m.totalLockedSkills, Object.keys(lock).length);
  assert.equal(m.localOnlyCount, m.localOnlySkills.length);
  assert.equal(
    m.githubSkills.length + m.localOnlySkills.length,
    m.totalLocalSkills,
    "每个上游技能要么在锁里、要么是 local-only，不该有第三种"
  );
});

// ── githubSkills ──────────────────────────────────────────────────────────

test("githubSkills：名字都在锁里，githubUrl 只在 sourceType 为 github 时有值", () => {
  const m = buildManifest();
  const lock = lockSkills();

  assert.ok(m.githubSkills.length > 0);
  for (const g of m.githubSkills) {
    assert.ok(Object.hasOwn(lock, g.name), `${g.name} 不在 skills-lock.json 里`);
    const info = lock[g.name];
    assert.equal(g.source, info.source);
    assert.equal(g.sourceType, info.sourceType);
    assert.equal(g.skillPath, info.skillPath);
    assert.equal(
      g.githubUrl,
      info.sourceType === "github" ? `https://github.com/${info.source}` : null,
      `${g.name} 的 githubUrl 与 sourceType 不匹配`
    );
  }
});

test("githubSkills 与 localOnlySkills 不重叠，且合起来就是上游技能全集", () => {
  const m = buildManifest();
  const names = new Set(m.githubSkills.map((g) => g.name));

  for (const s of m.localOnlySkills) {
    assert.ok(!names.has(s.name), `${s.name} 同时出现在两份清单里`);
  }

  const all = [...m.githubSkills.map((g) => g.name), ...m.localOnlySkills.map((s) => s.name)].sort();
  assert.deepEqual(all, skillDirs().filter((s) => s.parent === VENDOR_SKILLS_PARENT).map((s) => s.name).sort());
});

// ── localOnlySkills ───────────────────────────────────────────────────────

test("localOnlySkills：files 是技能目录内的相对路径，能拼回目标集里的真实文件", () => {
  const m = buildManifest();
  const lock = lockSkills();
  const files = new Set(trackedFiles());

  for (const s of m.localOnlySkills) {
    assert.ok(!Object.hasOwn(lock, s.name), `${s.name} 在锁里，不该算 local-only`);
    for (const rel of s.files) {
      assert.ok(!rel.startsWith("/") && !rel.startsWith("../"), `路径应相对技能目录：${rel}`);
      assert.ok(
        files.has(`${VENDOR_SKILLS_PARENT}/${s.name}/${rel}`),
        `${s.name}/${rel} 拼回去不在目标集里`
      );
    }
    assert.ok(s.files.length > 0, `${s.name} 一个文件都没有？`);
  }
});

test("files 的切片规则（用索引里的真实技能验证，不依赖 local-only 是否存在）", () => {
  const target = skillDirs().find((s) => s.parent === VENDOR_SKILLS_PARENT);
  assert.ok(target, "上游技能一个都没有？");

  const under = trackedUnder(target.dir);
  assert.ok(under.length > 0, `${target.dir} 在索引里一个文件都没有？`);

  const rel = under.map((p) => p.slice(`${target.dir}/`.length));
  for (const r of rel) {
    assert.ok(!r.startsWith("/") && !r.startsWith("../"), `切片结果应是相对路径：${r}`);
    assert.ok(under.includes(`${target.dir}/${r}`), `${r} 拼不回原路径`);
  }
  assert.ok(rel.includes("SKILL.md"), "技能目录下一定有 SKILL.md");
});

// ── trackedUnder ──────────────────────────────────────────────────────────

test("trackedUnder 只收该目录之下的文件", () => {
  const libs = trackedUnder("scripts/lib");

  assert.ok(libs.length > 0);
  assert.ok(libs.every((p) => p.startsWith("scripts/lib/")));
  assert.ok(libs.includes("scripts/lib/report.js"));
  assert.ok(!libs.includes("scripts/lint.sh"), "同名前缀但不是子路径的不该进来");
  assert.deepEqual(trackedUnder("no/such/dir"), []);
});
