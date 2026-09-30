#!/usr/bin/env node
"use strict";

/**
 * 从各技能的 `SKILL.md` 生成两处**给人看**的技能展示面：
 *
 * 1. `docs/SKILLS.md` —— 整份技能目录（全文生成）
 * 2. `README.md` 里被标记围起来的两张技能表（**只生成标记之间的部分**）
 *
 * 用法：
 *   node scripts/gen-catalogue.js              # 打到 stdout，不落盘
 *   node scripts/gen-catalogue.js --write      # 两处都写回
 *
 * ## 为什么需要它
 *
 * `SKILL.md` 的 `description` 是**写给模型看的**：塞满触发词，本仓库实测 47～292 字符。
 * 人浏览时读不下去 —— 而「这仓库里有什么、我该装哪个、装完怎么用」正是陌生人
 * 最先问的三个问题。
 *
 * 所以展示面用的是 frontmatter 里 `metadata` 的三个字段，它们与 `description`
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
 * 两处展示面**都完全从技能本身生成**，没有第二份需要维护的清单。改技能 → 重跑生成器 →
 * 它们跟着变。`scripts/checks/catalogue.js` 断言生成物与源头一致，所以忘记重跑
 * 会被 CI 拦下（与 `local-skills.json` 是同一套模式）。
 *
 * ## README 的生成区怎么界定
 *
 * README 是**手写文档**，只把它里面那两张表交给生成器 —— 用一对 HTML 注释标记围出
 * 边界（`SKILLS-TABLE:START <组名>` / `SKILLS-TABLE:END <组名>`）。**标记之外的一个字
 * 都不属于生成器**，它可以自由改写、加段落、调顺序。
 *
 * 之所以不在生成器里复刻 README 的结构：那样每改一次排版都要改生成器，而且生成器
 * 一旦与文档脱节，报错信息会指向生成器而不是读者要看的那张表。**标记是契约** ——
 * 谁在标记之间写了东西，下一次生成就会把它冲掉，这一点由 `checks/catalogue.js` 明说。
 */

const fs = require("fs");
const path = require("path");
const { REPO_ROOT, skillDirs, trackedSet, readTracked } = require("./lib/gitfiles");
const { parseFrontmatter } = require("./lib/frontmatter");

const OUT_REL = "docs/SKILLS.md";
const README_REL = "README.md";

/**
 * README 里交给本脚本的两块生成区。
 *
 * `key` 是标记名（`SKILLS-TABLE:START <key>`），`parent` 是这一块收哪些技能目录，
 * `lead` 是摆在表格上方的**计数句**。
 *
 * ## 为什么计数句也在生成区里
 *
 * 它是**派生数据**（这一组有几个技能），手写必然漂移 —— 真实发生过：README 写着
 * 「这 14 个技能跨项目可用」，而 `custom/daily/` 实际有 15 个，`skills-doctor`
 * 压根没进表。数字与它下面那张表只隔一个空行，对不上时读者第一眼就会看见。
 *
 * 句子里的固定措辞是模板，数字从技能数来。**它是这一块的一部分，不是手写正文** ——
 * 所以标记必须把它围进去。标记之外的内容生成器一概不碰。
 */
const README_BLOCKS = [
  {
    key: "daily",
    parent: "custom/daily",
    lead: (n) =>
      `这 ${n} 个技能跨项目可用，是 \`npx skills add nicholyx/ai-skills\` 装到的主要内容。`,
  },
  {
    key: "projects",
    parent: "custom/projects",
    lead: null,
  },
];

/** 生成区标记。HTML 注释在 GitHub 上不渲染，读者只看到表格。 */
function markerStart(key) {
  return `<!-- SKILLS-TABLE:START ${key} -->`;
}
function markerEnd(key) {
  return `<!-- SKILLS-TABLE:END ${key} -->`;
}

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
        // README 的生成区按父目录分组（custom/daily、custom/projects），
        // 所以这里必须带上它 —— 否则 README 只能自己再算一遍，那就是第二份来源。
        parent: s.parent,
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
    "它会生成一段可直接粘贴给 AI 的提示词 —— **不安装、不改任何配置**，试完随时走开。"
  );
  out.push("");
  out.push("觉得好用再装：");
  out.push("");
  out.push("```bash");
  // 数字从技能数来：此前这里硬编码「全部 15 个」，而同一份文件开头已经写着
  // 「共 16 个自建技能」—— 同一页自相矛盾，正是「手写计数必然漂移」的又一例。
  out.push(`npx skills add nicholyx/ai-skills          # 全部 ${skills.length} 个`);
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
  out.push(
    "- **技能名后的 ✅** 表示它附带评测用例（`evals/evals.json`），其**结构**由 CI 校验" +
      "（字段齐不齐、`skill_name` 与目录名是否一致）。"
  );
  out.push(
    "  ⚠️ 它们**不会自动执行**（跑一轮要调用模型），所以 ✅ **不等于**「已经验过它能干活」——" +
      "它只代表这套用例**可以跑**：`node scripts/run-evals.js --skill <技能名>`。" +
      "没有 ✅ 的技能更不代表不能用 —— 它只说明还没有**能说明问题**的用例：" +
      "要么没写，要么写了但实测「不装技能也能过」。"
  );
  out.push(
    "- **「你可以这样说」不是编的。** 它取自技能的 `metadata.example`，且 CI 的" +
      "「技能自洽校验」会断言**这句话原样出现在该技能的 `description` 里** —— " +
      "两者对不上就说明目录里这句话是另编的，不是技能自己的说法。"
  );
  out.push(
    "- 每个技能的完整触发条件与执行流程，在它自己的 `SKILL.md` 里（点技能名即可）。"
  );
  out.push("");

  out.push(
    "> `.agents/skills/` 下那 31 个上游技能**不在这张表里** —— 它们不在安装面内，" +
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

// ── README 的生成区 ───────────────────────────────────────────────────────

/**
 * 渲染一块 README 生成区的**内容**（不含标记行本身）。
 *
 * 与 `docs/SKILLS.md` 的表格同源同形，差别只有两处，都是为了 README 的定位：
 * 技能名不带链接（README 是给人快速扫读的简表，详情由 `docs/SKILLS.md` 承接），
 * 也不带 ✅（那个记号的含义写在 `docs/SKILLS.md` 里，单独拿到这里会变成噪音）。
 */
function renderReadmeBlock(block, skills) {
  const list = skills.filter((s) => s.parent === block.parent);
  const out = [];
  if (block.lead) {
    out.push(block.lead(list.length));
    out.push("");
  }
  out.push("| 技能 | 它能做什么 | 你可以这样说 |");
  out.push("| --- | --- | --- |");
  for (const s of list) {
    const tagline = s.tagline ? cell(s.tagline) : "_(待补 `metadata.tagline`)_";
    const example = s.example ? `「${cell(s.example)}」` : "_(待补 `metadata.example`)_";
    out.push(`| \`${s.name}\` | ${tagline} | ${example} |`);
  }
  return out.join("\n");
}

/**
 * 把 `readmeText` 里每一块生成区替换成当前技能算出来的内容，返回新全文。
 *
 * **标记之外一个字节都不动** —— 手写的正文、标题、注释原样保留。也正因为如此，
 * 这个函数是**幂等**的：对生成过一次的文件再跑，结果逐字节相同（`scripts/e2e.js`
 * 环节 2 就是靠这一点断言「生成器是确定的」）。
 *
 * 标记缺失时抛错而不是静默跳过：静默跳过等于「README 里的技能表悄悄不再受源头约束」，
 * 那正是本项目最想避免的一类失效。错误信息里带上标记原文，读者可以直接搜。
 */
function applyReadmeBlocks(readmeText, skills) {
  let out = readmeText;
  for (const block of README_BLOCKS) {
    const start = markerStart(block.key);
    const end = markerEnd(block.key);
    const i = out.indexOf(start);
    const j = out.indexOf(end);
    if (i === -1 || j === -1 || j < i) {
      throw new Error(
        `${README_REL} 里找不到成对的生成区标记：\n` +
          `  需要 ${start} 与 ${end}\n` +
          `  这一对标记是「技能表由技能元数据生成」的锚点，删掉它等于让表失去源头。` +
          `请把标记补回去（位置：技能清单的两个小节里，表格的上下各一行）。`
      );
    }
    const body = renderReadmeBlock(block, skills);
    out = `${out.slice(0, i + start.length)}\n${body}\n${out.slice(j)}`;
  }
  return out;
}

// ── CLI ──
//
// **必须判入口**：`scripts/checks/catalogue.js` 会 require 本模块拿 collect/render，
// 不判的话每次校验都会把整份目录打到 stdout（CI 日志会被刷屏）。
if (require.main === module && (process.argv.includes("--help") || process.argv.includes("-h"))) {
  process.stdout.write(
    "用法：node scripts/gen-catalogue.js [--write]\n" +
      `  ${OUT_REL} 全文生成；${README_REL} 只生成标记之间的两块技能表。\n` +
      "  默认打到 stdout（只有目录），不落盘。\n"
  );
  process.exit(0);
}

if (require.main !== module) {
  module.exports = {
    collect,
    render,
    renderReadmeBlock,
    applyReadmeBlocks,
    README_BLOCKS,
    markerStart,
    markerEnd,
    OUT_REL,
    README_REL,
  };
  return;
}

const skills = collect();
const md = `${render(skills)}\n`;

// README 的期望内容：**以磁盘上那一份为底**，只换掉标记之间的部分。
// 这样手写内容不需要在生成器里复刻一份，也就不会与文档脱节。
let mdReadme;
try {
  mdReadme = applyReadmeBlocks(fs.readFileSync(path.join(REPO_ROOT, README_REL), "utf8"), skills);
} catch (err) {
  process.stderr.write(`✗ ${err.message}\n`);
  process.exit(1);
}

if (process.argv.includes("--write")) {
  for (const [rel, text] of [
    [OUT_REL, md],
    [README_REL, mdReadme],
  ]) {
    const abs = path.join(REPO_ROOT, rel);
    const before = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
    fs.writeFileSync(abs, text);
    process.stderr.write(
      before === text ? `= ${rel}（无变化）\n` : `✓ 已写入 ${rel}\n`
    );
  }
} else {
  process.stdout.write(md);
  // README 的全文不往 stdout 打（它是一整份文档，刷屏且没人要读）；
  // 但「它落后了」这件事必须让人看见。
  const current = fs.readFileSync(path.join(REPO_ROOT, README_REL), "utf8");
  process.stderr.write(
    current === mdReadme
      ? `= ${README_REL} 的生成区已是最新\n`
      : `! ${README_REL} 的生成区落后于技能源头 —— 用 --write 重写\n`
  );
}

process.stderr.write(
  `  ${skills.length} 个技能，${skills.filter((s) => s.hasEvals).length} 个有评测用例\n`
);

module.exports = {
  collect,
  render,
  renderReadmeBlock,
  applyReadmeBlocks,
  README_BLOCKS,
  markerStart,
  markerEnd,
  OUT_REL,
  README_REL,
};
