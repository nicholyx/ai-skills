#!/usr/bin/env node
"use strict";

/**
 * 断言文档里写的「数量」与事实一致。
 *
 * ## 为什么需要它
 *
 * 文档里的计数会**静默腐烂**。本仓库已经历过三次：
 *
 * | 计数 | 腐烂过程 |
 * | --- | --- |
 * | 检查项数 | 10 → 11（加分布面校验）→ 12（加技能目录校验）|
 * | CI job 数 | 13 → 14 |
 * | 自建技能数 | 12 → 14 → 15 |
 *
 * 每次都不是「写错了」，而是**写对之后事实变了**。这类旧值比明显的错误更难发现 ——
 * 它看起来是权威的，读者无从判断它是什么时候的数字。
 *
 * 已经有一处栽过跟头：`AGENTS.md` 写着「13 个技能」，而实际 15 个；
 * 是并行 agent 复核时才发现的。
 *
 * 用法：
 *   node scripts/checks/doc-counts.js        # 只报不改
 *   node scripts/checks/doc-counts.js --fix  # 就地改正（并列出改了什么）
 *
 * ## 设计取舍
 *
 * **只匹配本仓库实际使用的那几种措辞**，不做通用数字校验。宁可漏掉几个（人工 review
 * 兜底），也不要有误报 —— **一个会在正确状态下误报的检查，会让人不再相信输出**，
 * 那比没有检查更糟。
 *
 * 每种措辞对应哪个事实，写在下表里，不靠猜：
 *
 * | 文档里的措辞 | 事实来源 |
 * | --- | --- |
 * | `N 项检查` / `N 项静态检查` / `N 个静态检查 job` / `N 个静态 job` | `lint.sh --list` 的项数 |
 * | `N 个 job` | `ci.yml` 的 job 总数 |
 * | `N 个自建通用技能` | `custom/daily/` 下的技能数 |
 * | `N 个自建技能` | `custom/` 下的技能总数 |
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { Report } = require("../lib/report");
const { REPO_ROOT, skillDirs, trackedFiles } = require("../lib/gitfiles");

const report = new Report("文档计数校验");

/** 扫描范围：面向人的中文文档。英文文档的措辞不同，另行处理。 */
const DOCS = [
  "README.md",
  "CONTRIBUTING.md",
  "AGENTS.md",
  "docs/USAGE.md",
  "docs/ARCHITECTURE.md",
  "docs/MAINTAINER_GUIDE.md",
  "docs/TROUBLESHOOTING.md",
];

// ── 事实来源 ──────────────────────────────────────────────────────────────

/** `lint.sh --list` 的项数 —— 不用 `--list` 的输出解析写死，直接问它。 */
function checkCount() {
  const out = execFileSync(path.join(REPO_ROOT, "scripts/lint.sh"), ["--list"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  return out.split("\n").filter((l) => l.trim()).length;
}

/**
 * `scripts/checks/` 下的检查器个数。
 *
 * 它与 `checkCount()` **不是一回事**：后者是 `lint.sh` 的项数（含 shellcheck 等外部工具），
 * 这里是纯 Node 检查器的个数。两者混用会把文档里的数字改成错的。
 * 目标集仍是 git 索引（见 AGENTS.md 红线）。
 */
function checkerCount() {
  return trackedFiles().filter((p) => /^scripts\/checks\/.+\.js$/.test(p)).length;
}

/** `ci.yml` 的 job 总数。 */
function jobCount() {
  const t = fs.readFileSync(path.join(REPO_ROOT, ".github/workflows/ci.yml"), "utf8");
  const body = t.split("\njobs:\n")[1] || "";
  return (body.match(/^ {2}[a-z][a-z0-9-]*:$/gm) || []).length;
}

const skills = skillDirs().filter((s) => s.tier === "self");
const dailyCount = skills.filter((s) => s.dir.startsWith("custom/daily/")).length;
const selfCount = skills.length;

// ── 措辞 → 事实 ───────────────────────────────────────────────────────────
//
// 顺序有意义：更具体的措辞必须排在更泛的前面（`个静态 job` 要在 `个 job` 之前匹配上）。
const RULES = [
  { re: /(\d+)\s*(?:项静态检查|项检查)/g, want: checkCount, name: "检查项数" },
  // 「N 个检查项」是「N 项检查」的另一种语序 —— 只收一种会漏（真实踩过）
  { re: /(\d+)\s*个检查项/g, want: checkCount, name: "检查项数" },
  // 「N 个检查器」是第三种语序，而且指的是**纯 Node 检查器**的个数，不是 lint.sh 的项数。
  // 真实踩过：docs/ARCHITECTURE.md 用**中文数字**写着「九个检查器」（实际 10 个），
  // 中文数字逃过了这套只匹配阿拉伯数字的规则 —— 改写成数字后由本条接住。
  { re: /(\d+)\s*个检查器/g, want: checkerCount, name: "检查器数" },
  { re: /(\d+)\s*个静态(?:检查)?\s*job/g, want: checkCount, name: "静态检查 job 数" },
  { re: /(\d+)\s*个\s*job/g, want: jobCount, name: "CI job 总数" },
  { re: /(\d+)\s*个自建通用技能/g, want: () => dailyCount, name: "自建通用技能数" },
  { re: /(\d+)\s*个自建技能/g, want: () => selfCount, name: "自建技能总数" },
];

const FIX = process.argv.includes("--fix");
const fixes = [];

let scanned = 0;
let hits = 0;

for (const rel of DOCS) {
  const abs = path.join(REPO_ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  scanned += 1;
  const lines = fs.readFileSync(abs, "utf8").split("\n");

  lines.forEach((line, idx) => {
    for (const { re, want, name } of RULES) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        hits += 1;
        const got = Number(m[1]);
        const expected = want();
        if (got !== expected) {
          if (FIX) {
            // 按「行」聚合，而不是按「命中」。**同一行可能有多处计数**
            // （如「10 个静态 job 与 10 个检查项」）—— 逐条基于原行改写会互相覆盖，
            // 只剩最后一条生效。这里记下每处的位置，最后从右往左一次性替换。
            let bucket = fixes.find((f) => f.rel === rel && f.line === idx);
            if (!bucket) {
              bucket = { rel, line: idx, from: line, edits: [] };
              fixes.push(bucket);
            }
            bucket.edits.push({ start: m.index, len: m[1].length, value: String(expected) });
          } else {
            report.fail(
              rel,
              idx + 1,
              `写的${name}是 ${got}，实际是 ${expected}（「${m[0]}」）`
            );
          }
        }
      }
    }
  });
}

if (FIX) {
  if (fixes.length === 0) {
    process.stdout.write("✓ 没有需要修正的计数\n");
    process.exit(0);
  }
  // 同一文件内从后往前写，避免行号偏移；同一行内也从右往左替换，避免列偏移
  const byFile = new Map();
  for (const f of fixes) {
    if (!byFile.has(f.rel)) byFile.set(f.rel, []);
    byFile.get(f.rel).push(f);
  }
  for (const [rel, list] of byFile) {
    const abs = path.join(REPO_ROOT, rel);
    const lines = fs.readFileSync(abs, "utf8").split("\n");
    for (const f of [...list].sort((a, b) => b.line - a.line)) {
      let s = lines[f.line];
      for (const e of [...f.edits].sort((a, b) => b.start - a.start)) {
        s = s.slice(0, e.start) + e.value + s.slice(e.start + e.len);
      }
      lines[f.line] = s;
      process.stdout.write(
        `✓ ${rel}:${f.line + 1}（改 ${f.edits.length} 处）\n    - ${f.from.trim()}\n    + ${s.trim()}\n`
      );
    }
    fs.writeFileSync(abs, lines.join("\n"));
  }
  process.stdout.write(`\n共修正 ${fixes.length} 处。请复查 diff 后再提交。\n`);
  process.exit(0);
}

report.info(
  `扫描 ${scanned} 份文档、${hits} 处计数声明；` +
    `事实：检查项 ${checkCount()}、CI job ${jobCount()}、` +
    `自建技能 ${selfCount}（通用 ${dailyCount}）。`
);

report.finish();
