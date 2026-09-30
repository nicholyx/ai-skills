#!/usr/bin/env node
"use strict";

/**
 * 创建一个新技能，按本仓库的约定生成骨架。
 *
 * 用法：
 *   node scripts/new-skill.js <名字> --tagline "一句话" --example "你可以这样说"
 *                              [--category 代码质量] [--desc "给模型的完整描述"]
 *                              [--projects]   # 生成到 custom/projects/ 而非 custom/daily/
 *
 * `<名字>` 必须是 kebab-case，且会成为目录名与 frontmatter 的 `name` ——
 * 这两者必须一致（`checks/frontmatter.js` 会 fail）。
 *
 * ## 它解决的三个具体问题
 *
 * 1. **frontmatter 契约**：六个允许键、name 的 kebab-case 与长度、description 不含尖括号……
 *    手写容易漏，生成骨架直接合规。
 * 2. **`metadata` 的约定**（`category` / `tagline` / `example`）—— 这是目录生成器的数据源。
 *    不填的话，新技能会以占位符出现在 `docs/SKILLS.md` 里，等于没被介绍给访客。
 * 3. **提醒重跑生成器**：新技能不会自动进目录，忘了这一步 CI 会红 ——
 *    与其等到 CI 报错，不如创建时就告诉你。
 *
 * ## 它不做的事
 *
 * **不写 `description` 的触发词。** 那是给模型看的、决定技能何时被唤起的关键内容，
 * 需要理解技能的真实行为才写得出来 —— 只能由人来。这里只放一个占位并说明要求。
 */

const fs = require("fs");
const path = require("path");
const { REPO_ROOT } = require("./lib/gitfiles");

const CATEGORIES = [
  "代码质量",
  "Git 与协作",
  "仓库与开源",
  "知识与记录",
  "环境与工具",
];

function usage(msg) {
  if (msg) process.stderr.write(`✗ ${msg}\n\n`);
  process.stderr.write(
    [
      "用法：node scripts/new-skill.js <名字> --tagline <一句话> --example <示例> [选项]",
      "",
      "必填：",
      "  <名字>            kebab-case，同时作为目录名与 frontmatter 的 name",
      "  --tagline <文本>  一句话说清能干什么（给人看，进目录）",
      "  --example <文本>  一句可以直接说出口的话（给人看，进目录）",
      "",
      "可选：",
      "  --category <分类> 默认「Git 与协作」；可选：" + CATEGORIES.join(" / "),
      "  --desc <文本>     给模型看的完整描述（含触发词）。不传则留占位。",
      "  --projects        生成到 custom/projects/（项目专用）而非 custom/daily/",
      "",
      "例：",
      '  node scripts/new-skill.js pr-describe \\',
      '    --tagline "根据分支差异生成 PR 描述" \\',
      '    --example "帮我写一下 PR 描述"',
      "",
    ].join("\n")
  );
  process.exit(1);
}

function parseArgs(argv) {
  const out = { name: "", projects: false };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i];
    if (a === "--projects") { out.projects = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = rest[i + 1];
      if (val === undefined || val.startsWith("--")) usage(`${a} 需要参数`);
      out[key] = val;
      i += 1;
      continue;
    }
    if (!out.name) { out.name = a; continue; }
    usage(`多余的参数：${a}`);
  }
  return out;
}

const args = parseArgs(process.argv);

if (!args.name) usage("缺少 <名字>");
if (!args.tagline) usage("缺少 --tagline");
if (!args.example) usage("缺少 --example");

const name = args.name;
if (!/^[a-z0-9-]+$/.test(name) || name.startsWith("-") || name.endsWith("-") || name.includes("--")) {
  usage(`名字「${name}」不合规：必须是小写字母/数字/连字符，不以连字符起止，不含连续连字符`);
}
if (name.length > 64) usage(`名字过长（${name.length} 字符，上限 64）`);

const category = args.category || "Git 与协作";
if (!CATEGORIES.includes(category) && category !== "项目专用") {
  process.stderr.write(`⚠ 分类「${category}」不在常用集合里（${CATEGORIES.join(" / ")}），仍会照写。\n`);
}

const parent = args.projects ? "custom/projects" : "custom/daily";
const dir = path.join(REPO_ROOT, parent, name);

if (fs.existsSync(dir)) {
  process.stderr.write(`✗ 目录已存在：${parent}/${name}\n`);
  process.exit(1);
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const description =
  args.desc ||
  "【待补】一句话说明这个技能做什么、什么时候触发。描述是**给模型看的**，" +
    "要写清触发词 —— 它决定技能何时被唤起。" +
    `其中必须原样包含「${args.example}」：目录会把它当作「你可以这样说」展示给访客，` +
    "不写进描述就等于这个承诺没有触发锚点（`skill-integrity` 会拦）。";

const skill = `---
name: ${name}
description: ${description}
license: MIT
metadata:
  category: ${category}
  tagline: "${esc(args.tagline)}"
  example: "${esc(args.example)}"
---

# ${args.tagline}

<!-- 在这里写这个技能做什么、按什么步骤做、有什么边界。 -->

## 什么时候用

- ${args.example}
<!-- 补上其它触发的说法。这些应当与 frontmatter 的 description 相互印证。 -->

## 怎么做

1.

## 边界

- 什么情况下**不该**用这个技能？
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "SKILL.md"), skill, "utf-8");

process.stdout.write(
  [
    `✓ 已创建 ${parent}/${name}/SKILL.md`,
    "",
    "接下来：",
    "  1. 补 frontmatter 的 description（写清触发词 —— 它决定技能何时被唤起）",
    `     注意：里面要**原样包含**「${args.example}」，否则 skill-integrity 会拦`,
    "  2. 补 SKILL.md 正文：做什么、怎么做、边界在哪",
    "  3. node scripts/gen-catalogue.js --write      # 让它进 docs/SKILLS.md",
    "  4. node scripts/checks/doc-counts.js --fix    # 新增技能会让文档里的技能数过期",
    "  5. ./scripts/lint.sh                           # 提交前自查",
    "",
    "第 3、4 步忘了都不会静默通过：CI 的「技能目录校验」与「文档计数校验」会拦住。",
    "**但它们是两个不同的检查** —— 补完目录别忘了计数，否则你会撞上一个跟",
    "自己技能毫无关系的失败。（这条是端到端验证抓出来的：原先提示里没有第 4 步。）",
    "",
  ].join("\n")
);
