#!/usr/bin/env node
"use strict";

/**
 * 生成 `local-skills.json` —— 上游已安装技能的人读清单。
 *
 * 用法：
 *   node scripts/gen-local-skills.js              # 打到 stdout，不落盘
 *   node scripts/gen-local-skills.js --write      # 写回 local-skills.json
 *   node scripts/gen-local-skills.js --out /tmp/x.json
 *
 * **默认不落盘**：这个脚本原来是「生成器 + 校验器」两个身份，于是一个想写、
 * 一个永远 exit 0，互相破坏。现在职责分开 —— 这里只管写，一致性由
 * `scripts/checks/vendor-lock.js` 管。
 *
 * 内容里没有时间戳，所以对同一份工作区，输出是逐字节确定的，可以直接
 * 用 `git diff --exit-code` 判断是否过期（旧版的 `generatedAt` 让它永远不成立）。
 */

const fs = require("fs");
const path = require("path");
const { REPO_ROOT } = require("./lib/gitfiles");
const { buildManifest, serializeManifest } = require("./lib/manifest");

const shouldWrite = process.argv.includes("--write");
const outIndex = process.argv.indexOf("--out");
const outRel = outIndex !== -1 ? process.argv[outIndex + 1] : "local-skills.json";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(
    "用法：node scripts/gen-local-skills.js [--write] [--out <路径>]\n" +
      "  默认打到 stdout，不落盘。--write 才会写回仓库。\n"
  );
  process.exit(0);
}

let manifest;
try {
  manifest = buildManifest();
} catch (err) {
  process.stderr.write(`✗ 无法构建清单：${err.message}\n`);
  process.exit(2);
}

const text = serializeManifest(manifest);

if (shouldWrite) {
  const abs = path.isAbsolute(outRel) ? outRel : path.join(REPO_ROOT, outRel);
  fs.writeFileSync(abs, text);
  process.stderr.write(`✓ 已写入 ${outRel}\n`);
} else {
  process.stdout.write(text);
}

// 汇总走 stderr：stdout 保持是纯粹的 JSON，可以安全地重定向或管道。
process.stderr.write(
  `  本地技能 ${manifest.totalLocalSkills} 个，` +
    `lock 记录 ${manifest.totalLockedSkills} 条，` +
    `仅本地 ${manifest.localOnlyCount} 个\n`
);
