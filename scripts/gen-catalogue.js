#!/usr/bin/env node
"use strict";

/**
 * 从各技能的 `SKILL.md` 生成 `docs/SKILLS.md` —— 给人看的技能目录。
 *
 * 用法：
 *   node scripts/gen-catalogue.js              # 打到 stdout，不落盘
 *   node scripts/gen-catalogue.js --write      # 写回 docs/SKILLS.md
 *
 * ## 为什么需要它
 *
 * `SKILL.md` 的 `description` 是**写给模型看的**：塞满触发词，动辄 400～480 字符。
 * 人浏览时读不下去 —— 而「这仓库里有什么、我该装哪个、装完怎么用」正是陌生人
 * 最先问的三个问题。
 *
 * 所以目录用的是 frontmatter 里 `metadata` 的三个字段，它们与 `description`
 * **各司其职**：
 *
 * | 字段 | 给谁看 | 要求 |
 * | --- | --- | --- |
 * | `description` | 模型 | 塞触发词，越长越准 |
 * | `metadata.tagline` | 人 | 一句话说清能干什么 |
 * | `metadata.example` | 人 | 一句**可以直接说出口**的话 |
 * | `metadata.category` | 人 | 归到哪个场景 |
 *
 * ## 单一事实来源
 *
 * 目录**完全从技能本身生成**，没有第二份需要维护的清单。改技能 → 重跑生成器 →
 * 目录跟着变。`scripts/checks/catalogue.js` 断言生成物与源头一致，所以忘记重跑
 * 会被 CI 拦下（与 `local-skills.json` 是同一套模式）。
 */

const fs = require("fs");
const path = require("path");
const { REPO_ROOT, skillDirs, trackedSet, readTracked } = require("./lib/gitfiles");
const { parseFrontmatter } = require("./lib/frontmatter");

const OUT_REL = "docs/SKILLS.md";

/** 分类的展示顺序。未列出的分类排在最后。 */
const CATEGORY_ORDER = [
  "代码质量",
  "Git 与协作",
  "仓库与开源",
  "知识与记录",
  "环境与工具",
  "项目专用",
];

/** 分类的适用性提示 —— 让人知道这一类该不该装。 */
const CATEGORY_NOTE = {
  项目专用: "> ⚠️ 这一类**假设你手上就是那个项目**，装在别处只会变成噪音。",
};

/**
 * 收集所有自建技能及其元数据。
 * 缺 `metadata` 的技能不会让生成失败，但会被如实标出来 —— 目录的价值就在于完整。
 */
function collect() {
  const tracked = trackedSet();
  return skillDirs()
    .filter((s) => s.tier === "self")
    .map((s) => {
      const raw = readTracked(s.skillMd);
      if (raw === null) return null;
      const parsed = parseFrontmatter(raw);
      if (!parsed.ok) return null;

      const meta = parsed.nested.get("metadata") || new Map();
      return {
        name: s.name,
        dir: s.dir,
        skillMd: s.skillMd,
        tagline: meta.get("tagline") || "",
        example: meta.get("example") || "",
        category: meta.get("category") || "未分类",
        hasEvals: tracked.has(`${s.dir}/evals/evals.json`),
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/** 表格单元格里的 `|` 会破坏表格结构，必须转义。 */
function cell(text) {
  return text.replace(/\|/g, "\\|");
}

function render(skills) {
  const byCat = new Map();
  for (const s of skills) {
    if (!byCat.has(s.category)) byCat.set(s.category, []);
    byCat.get(s.category).push(s);
  }
  const cats = [...byCat.keys()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });

  const withEvals = skills.filter((s) => s.hasEvals).length;
  const missingMeta = skills.filter((s) => !s.tagline || !s.example);

  const out = [];
  out.push("# 技能目录");
  out.push("");
  out.push(
    "> 🤖 **本文件由 [`scripts/gen-catalogue.js`](../scripts/gen-catalogue.js) 生成，不要手改。**"
  );
  out.push(
    "> 它从每个技能的 `SKILL.md` 里读 `metadata`，改技能后重跑生成器即可 ——" +
      "CI 会断言这里与源头一致。"
  );
  out.push("");
  out.push(
    `共 **${skills.length}** 个自建技能，分布在 ${cats.length} 个场景。` +
      `其中 **${withEvals}** 个附带可验证的评测用例（\`evals/evals.json\`）。`
  );
  out.push("");

  // ── 先试再装 ──
  out.push("## 先试再装");
  out.push("");
  out.push(
    "**不确定要不要装？任何一个技能都可以不安装先试。** 把技能名换成下表里的名字："
  );
  out.push("");
  out.push("```bash");
  out.push("npx skills use nicholyx/ai-skills@<技能名>");
  out.push("```");
  out.push("");
  out.push(
    "它会生成一段可直接粘贴给 AI 的提示词 —— 不写文件、不动配置，试完不满意没有任何残留。"
  );
  out.push("");
  out.push("觉得好用再装：");
  out.push("");
  out.push("```bash");
  out.push("npx skills add nicholyx/ai-skills          # 全部 15 个");
  out.push("npx skills add nicholyx/ai-skills/custom/daily   # 只装通用技能");
  out.push("```");
  out.push("");

  // ── 一览 ──
  out.push("## 一览");
  out.push("");
  out.push("| 场景 | 技能 |");
  out.push("| --- | --- |");
  for (const c of cats) {
    const names = byCat.get(c).map((s) => `\`${s.name}\``).join(" · ");
    out.push(`| **${c}** | ${names} |`);
  }
  out.push("");
  out.push("---");
  out.push("");

  // ── 逐个场景 ──
  for (const c of cats) {
    const list = byCat.get(c);
    out.push(`## ${c}（${list.length}）`);
    out.push("");
    if (CATEGORY_NOTE[c]) {
      out.push(CATEGORY_NOTE[c]);
      out.push("");
    }
    out.push("| 技能 | 它能做什么 | 你可以这样说 |");
    out.push("| --- | --- | --- |");
    for (const s of list) {
      const name = `[\`${s.name}\`](../${s.dir}/SKILL.md)${s.hasEvals ? " ✅" : ""}`;
      out.push(`| ${name} | ${cell(s.tagline) || "_(待补 `metadata.tagline`)_"} | ${
        s.example ? `「${cell(s.example)}」` : "_(待补 `metadata.example`)_"
      } |`);
    }
    out.push("");
  }

  out.push("---");
  out.push("");
  out.push("## 关于这张表");
  out.push("");
  out.push("- **技能名后的 ✅** 表示它附带可验证的评测用例（`evals/evals.json`）。");
  out.push(
    "  没有 ✅ 不代表不能用，只表示「它能干活」这件事还没有机器可验证的证据。"
  );
  out.push(
    "- **「你可以这样说」是从 `metadata.example` 读的**，不是自动摘的 —— " +
      "触发词在 `description` 里，这里是给人看的示例。"
  );
  out.push(
    "- 每个技能的完整触发条件与执行流程，在它自己的 `SKILL.md` 里（点技能名即可）。"
  );
  out.push("");
  out.push(
    "> `.agents/skills/` 下那 31 个上游技能**不在这张表里** —— 它们不随本仓库分发，" +
      "要用请从各自的源仓库装（来源记在 `skills-lock.json`）。"
  );
  out.push("");

  if (missingMeta.length > 0) {
    out.push("## 待补元数据");
    out.push("");
    out.push(
      "以下技能缺 `metadata.tagline` 或 `metadata.example`，" +
        "所以上表里有占位符 —— 补上它才能被访客看懂："
    );
    out.push("");
    for (const s of missingMeta) out.push(`- \`${s.name}\``);
    out.push("");
  }

  return out.join("\n");
}

// ── CLI ──
//
// **必须判入口**：`scripts/checks/catalogue.js` 会 require 本模块拿 collect/render，
// 不判的话每次校验都会把整份目录打到 stdout（CI 日志会被刷屏）。
if (require.main === module && (process.argv.includes("--help") || process.argv.includes("-h"))) {
  process.stdout.write(
    "用法：node scripts/gen-catalogue.js [--write]\n  默认打到 stdout，不落盘。\n"
  );
  process.exit(0);
}

if (require.main !== module) {
  module.exports = { collect, render, OUT_REL };
  return;
}

const md = `${render(collect())}\n`;

if (process.argv.includes("--write")) {
  fs.writeFileSync(path.join(REPO_ROOT, OUT_REL), md);
  process.stderr.write(`✓ 已写入 ${OUT_REL}\n`);
} else {
  process.stdout.write(md);
}

const skills = collect();
process.stderr.write(
  `  ${skills.length} 个技能，${skills.filter((s) => s.hasEvals).length} 个有评测用例\n`
);

module.exports = { collect, render, OUT_REL };
