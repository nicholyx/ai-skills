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
 * | 徽章 URL 里百分号编码的 `静态检查-N 项` | 同上 |
 * | `N 个 job` | `ci.yml` 的 job 总数 |
 * | `N 个自建通用技能` | `custom/daily/` 下的技能数 |
 * | `N 个自建技能` | `custom/` 下的技能总数 |
 * | 英文：`N checks` / `N self-maintained general-purpose skills` 等（见 `RULES`）| 同上 |
 *
 * ## 英文文档也要查（2026-10-01 补）
 *
 * `README.en.md` 原先**不在 `DOCS` 里**，而它是一样会被读的落地页。后果真实发生过一次：
 * `skills-doctor` 那一行从来没进过它的技能表，表头的数字是旧的（14）—— 看着只像
 * 「没同步」，实际是**整个技能在英文入口上不存在**，而没有任何检查会红。
 *
 * 纳入时不需要新写徽章规则：两处徽章**逐字节相同**（实测 `diff` 无输出、md5 一致），
 * 那条 `%E9%9D%99…` 规则原样就能校验英文那枚。
 *
 * 但**计数规则管不了「少了一行」**：把一行删掉、表头的数字不改，所有计数仍然自洽。
 * 所以另外加了一条**覆盖断言** —— 每个自建技能都必须在 `README.en.md` 的技能表里露面。
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { Report } = require("../lib/report");
const { REPO_ROOT, skillDirs, trackedFiles } = require("../lib/gitfiles");

const report = new Report("文档计数校验");

/** 扫描范围：面向人的文档 —— 中文是主体，**英文入口也算**（见文件头「英文文档也要查」）。 */
const DOCS = [
  "README.md",
  "CONTRIBUTING.md",
  "AGENTS.md",
  "docs/USAGE.md",
  "docs/ARCHITECTURE.md",
  "docs/MAINTAINER_GUIDE.md",
  "docs/TROUBLESHOOTING.md",
  // spec 也要查：它此前不在扫描范围内，于是「13 个技能」「10 项检查」烂了很久没人发现
  ".trellis/spec/index.md",
  ".trellis/spec/testing/index.md",
  // 英文入口。措辞与中文完全不同，所以下面 RULES 里另有一套英文规则 ——
  // 「两个文件都进了扫描范围、却只有一半的措辞被接住」等于没覆盖。
  "README.en.md",
  "docs/USAGE.en.md",
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
const projectCount = skills.filter((s) => s.dir.startsWith("custom/projects/")).length;
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
  // README 顶上那枚「静态检查」徽章把项数**写死在 shields 的静态徽章 URL 里**：URL 中
  // 文与空格都是百分号编码，读作「静态检查-18 项」，所以上面按中文措辞写的规则接不住它。
  // 数字写错了徽章照样渲染、CI 也照样绿，只是显示了一个旧数字 —— 正是本文档要防的那种腐烂。
  { re: /%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5-(\d+)%20%E9%A1%B9/g, want: checkCount, name: "徽章里的检查项数" },
  { re: /(\d+)\s*个自建通用技能/g, want: () => dailyCount, name: "自建通用技能数" },
  { re: /(\d+)\s*个自建技能/g, want: () => selfCount, name: "自建技能总数" },

  // ── 英文文档（README.en.md 与 docs/USAGE.en.md）─────────────────────────
  //
  // 英文措辞与中文没有一处重合，所以要另立一套。**不收宽泛的 `N skills`**：
  // README.en.md 里「31 skills under `.agents/skills/`」指的是上游技能数，
  // 而这里的事实是自建技能数 —— 一条宽规则会立刻误报，而误报比漏报更糟（见文件头）。
  // 每条都锚定英文文档里**实际出现**的写法，宁可漏掉几个由人工 review 兜底。
  { re: /(\d+)\s*checks?\b/g, want: checkCount, name: "检查项数" },
  // 首屏那句：「15 self-maintained general-purpose skills, 1 project-specific skill」
  { re: /(\d+)\s*self-maintained general-purpose skills/g, want: () => dailyCount,
    name: "自建通用技能数" },
  { re: /(\d+)\s*project-specific skill\b/g, want: () => projectCount, name: "项目专用技能数" },
  // 技能表的小标题：「### General-purpose (`custom/daily/`, 15)」—— 真实腐烂过的那一处
  { re: /`custom\/daily\/`,\s*(\d+)/g, want: () => dailyCount, name: "自建通用技能数" },
  { re: /`custom\/projects\/`,\s*(\d+)/g, want: () => projectCount, name: "项目专用技能数" },
  { re: /Self-maintained general skills \((\d+)\)/g, want: () => dailyCount,
    name: "自建通用技能数" },
  { re: /Self-maintained project skills \((\d+)/g, want: () => projectCount,
    name: "项目专用技能数" },
  { re: /self-maintained general,\s*(\d+)/g, want: () => dailyCount, name: "自建通用技能数" },
  { re: /self-maintained project-specific,\s*(\d+)/g, want: () => projectCount,
    name: "项目专用技能数" },
  { re: /general-purpose skills \((\d+)\)/g, want: () => dailyCount, name: "自建通用技能数" },
  // 安装面那句「本仓库一共装几个」——三种写法都出现过
  { re: /exactly the same (\d+) skills/g, want: () => selfCount, name: "自建技能总数" },
  { re: /(\d+)\s*skills this repository ships/g, want: () => selfCount, name: "自建技能总数" },
  { re: /Everything \((\d+) skills\)/g, want: () => selfCount, name: "自建技能总数" },
  // 插件通道那句：`claude plugin details ai-skills` 列出 `Skills (16)`。
  // **必须排在 `Self-maintained general skills (15)` 之后** —— 更具体的措辞先匹配。
  { re: /Skills \((\d+)\)/g, want: () => selfCount, name: "自建技能总数" },
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
      // `d` 标志（hasIndices）：--fix 需要捕获组的精确下标，见下面写入 edits 的地方
      const dre = re.flags.includes("d") ? re : new RegExp(re.source, `${re.flags}d`);
      dre.lastIndex = 0;
      let m;
      while ((m = dre.exec(line)) !== null) {
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
            // **替换位置必须用捕获组的真实下标。** 对「数字在开头」的规则（如
            // `(\d+) 项检查`）用 `m.index` 恰好也对，所以这个 bug 藏了很久；徽章那条
            // 规则的数字在**结尾**（`%E9…-18%20%E9%A1%B9`），用 `m.index` 会把编码串的
            // 前半段覆盖掉 —— 实测把一个好好的徽章改成了乱码。
            //
            // 而且**不能用 `m[0].indexOf(m[1])`** 去找位置：那段编码串里就有别的 `3`
            // （`%A3`），indexOf 会命中它。用正则的 `d` 标志拿捕获组的精确下标才可靠。
            bucket.edits.push({
              start: m.indices[1][0],
              end: m.indices[1][1],
              value: String(expected),
            });
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
        s = s.slice(0, e.start) + e.value + s.slice(e.end);
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

// ── 覆盖：每个自建技能都得在英文技能表里有一行 ──────────────────────────────
//
// 上面那套规则查的是「写出来的数字对不对」。它有一个盲点：**把一整行删掉、表头的
// 数字也不改，所有计数仍然自洽** —— 而那一行所代表的技能就从英文入口上消失了，
// 与「数字写错」相比，这才是更难发现、后果更重的那一种。
//
// 真实发生过：`skills-doctor` 那一行从来没进过 `README.en.md` 的技能表（表头写着 14）。
// 这不是假设 —— 是本次改动要堵的那个洞。
//
// `checks/catalogue.js` 的第三条断言（每个自建技能都得进 README.md 的生成区）管的是
// **中文**那两块生成物；英文这版是**手写**的，不在它的比对范围内，所以缺口只在这里。
//
// 判据取 ⊇（每个自建技能都在表里露面），**不取相等**：`README.en.md` 里还有别的表格，
// 首列同样写作 `` | `name` | ``（frontmatter 契约表就是），要求集合相等会立刻误报。
// 「多出一行」不该由这里管，「少了一行」才是要防的那一种失效。

/** `README.en.md` 技能表首列的技能名 —— 形如 `` | `daily-report` | … `` 的行。 */
function enTableSkillNames() {
  const abs = path.join(REPO_ROOT, "README.en.md");
  if (!fs.existsSync(abs)) return null;
  const names = new Set();
  for (const line of fs.readFileSync(abs, "utf8").split("\n")) {
    const m = /^\|\s*`([A-Za-z0-9][A-Za-z0-9-]*)`\s*\|/.exec(line);
    if (m) names.add(m[1]);
  }
  return names;
}

const EN_README = "README.en.md";
const enNames = enTableSkillNames();
if (enNames === null) {
  report.fail(EN_README, 0, `${EN_README} 不存在 —— 它是英文入口，删掉等于没有英文页`);
} else {
  const missingEn = skills.filter((s) => !enNames.has(s.name));
  for (const s of missingEn) {
    report.fail(
      EN_README,
      0,
      `技能 \`${s.name}\`（${s.dir}）不在 ${EN_README} 的技能表里 —— ` +
        "英文入口上访客看不到这个技能（中文 README 与 docs/SKILLS.md 里都有它）。" +
        " 修法：在对应的小节（`### General-purpose …` / `### Project-specific …`）" +
        "的技能表里补一行。**这张表是手写的，`--fix` 补不了**。"
    );
  }
  report.info(
    `覆盖要求：${skills.length} 个自建技能，逐个都必须在 ${EN_README} 的技能表里露面` +
      `（表里共认出 ${enNames.size} 个技能名）。`
  );
}

report.info(
  `扫描 ${scanned} 份文档、${hits} 处计数声明；` +
    `事实：检查项 ${checkCount()}、CI job ${jobCount()}、` +
    `自建技能 ${selfCount}（通用 ${dailyCount}）。`
);

report.finish();
