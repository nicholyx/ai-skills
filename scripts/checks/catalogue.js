#!/usr/bin/env node
"use strict";

/**
 * 断言三处技能展示面与技能源头一致：
 *
 * 1. `docs/SKILLS.md`（全文生成）
 * 2. `README.md` 里标记围出的两块技能表（只有标记之间是生成物）
 * 3. `.claude-plugin/marketplace.json`（全文生成，`claude plugin` 的安装通道读它）
 *
 * ## 为什么需要它
 *
 * 展示面是**生成物**，源头是各技能的 `SKILL.md`。生成物与源头脱节的方式很隐蔽：
 * 改了 `metadata.tagline` 却忘了重跑生成器 —— 文件仍在、链接仍有效、格式仍正确，
 * **只是内容旧了**。没有任何自动检查能发现这种「旧」，除非专门断言。
 *
 * 这与 `local-skills.json` 是同一套模式：提交生成物，用 CI 断言它是最新的。
 *
 * ## 判据
 *
 * 内存里重新生成一份，与提交的版本**逐字节比对**。不等就报错并给出第一个差异行，
 * 「目录过时了」这句话本身没有可操作性 —— 读者需要知道差在哪。
 *
 * README 那份的「重新生成」是**以已提交的 README 本身为底**、只替换标记之间那两段
 * （见 `applyReadmeBlocks`）—— 所以手写正文永远不会被这个检查判为「过时」，
 * 它唯一能红的原因是标记之间的内容与技能源头对不上。
 *
 * ## 除了「一致」，还断言「覆盖」
 *
 * 「已提交的 == 重新生成的」只说明那几块生成区内部没问题。它管不了**该有几块** ——
 * README 里收哪些技能目录由手写的 `README_BLOCKS` 决定，删掉一块、或把某块的
 * `parent` 写错，剩下的比对照样全绿，而那一组技能就从 README 上消失了。
 *
 * 所以本文件还有第三条断言：**每个自建技能都必须在某一块生成区的渲染结果里露面**。
 * 少了它，「新建一个技能层级 → 技能静默不进 README」是一条无人察觉的路径。
 */

const { Report } = require("../lib/report");
const { readTracked } = require("../lib/gitfiles");
const {
  collect,
  render,
  renderMarketplace,
  applyReadmeBlocks,
  renderReadmeBlock,
  README_BLOCKS,
  OUT_REL,
  README_REL,
  MARKETPLACE_REL,
} = require("../gen-catalogue");

const report = new Report("技能目录校验");

const skills = collect();
if (skills.length === 0) {
  report.abort(
    "一个自建技能都没收集到 —— 不是「目录没问题」，是源头出了状况。\n" +
      "  目录的全部内容都来自 custom/ 下的 SKILL.md 的 metadata。"
  );
}

const actual = readTracked(OUT_REL);
if (actual === null) {
  report.fail(OUT_REL, 0, "目录文件不存在 —— 运行 node scripts/gen-catalogue.js --write 生成");
  report.finish();
}

const expected = `${render(skills)}\n`;
if (actual !== expected) {
  report.fail(
    OUT_REL,
    0,
    "目录与技能源头不一致 —— 运行 node scripts/gen-catalogue.js --write 重新生成"
  );
  for (const line of describeFirstDiff(actual, expected)) report.info(line);
}

// ── README 里的生成区 ─────────────────────────────────────────────────────
//
// 与上面同源同判据，差别只在于「重新生成」的底稿是 README 自己。
// 手写正文因此不进比对范围 —— 这个检查**不可能**因为有人改了一句介绍文案而变红。

const readme = readTracked(README_REL);
if (readme === null) {
  report.fail(README_REL, 0, `${README_REL} 不存在`);
} else {
  let expectedReadme = null;
  try {
    expectedReadme = applyReadmeBlocks(readme, skills);
  } catch (err) {
    // 标记缺失：这是**结构**问题，不是「内容旧了」。信息里已带标记原文与位置。
    report.fail(README_REL, 0, err.message);
  }
  if (expectedReadme !== null && expectedReadme !== readme) {
    const keys = README_BLOCKS.map((b) => b.key).join("、");
    report.fail(
      README_REL,
      0,
      `标记（${keys}）围出的技能表与技能源头不一致 —— ` +
        "运行 node scripts/gen-catalogue.js --write 重新生成"
    );
    for (const line of describeFirstDiff(readme, expectedReadme)) report.info(line);
  }
}

// ── 覆盖性：每个自建技能都得进 README 的某一块生成区 ───────────────────────
//
// 上面那条比对的是「生成区的内容与源头是否一致」。它有一个盲点：只覆盖
// `README_BLOCKS` 里列出的 parent，而那张表是**手写**的 —— 多一块、少一块、
// 或者某个 `parent` 写错一个字，都不会让任何断言变红。
//
// 于是下面这件事会**静默发生**：谁新建了 `custom/foo` 这个层级（现在的层级只有
// `custom/daily` 与 `custom/projects`），或者把某一块的 `parent` 改到了别处 ——
// 那里的技能就不出现在 README 里了。`docs/SKILLS.md` 有它、插件市场清单有它、
// 访客在 README 上却看不到它，而检查照常全绿。
//
// 这与 `.trellis/spec/checks/index.md` 里 `distribution.js` 那段是同一类问题：
// 「仓库在别人眼里长什么样」不会进任何 diff。所以这里断言的是**覆盖**：
// 每个自建技能都必须在生成区的**渲染结果**里露面。
//
// 为什么比对渲染结果而不是 `parent` 与 `README_BLOCKS` 的结构：渲染结果才是
// 读者真正看到的东西。结构对得上、渲染器却漏掉了某个技能（改了过滤条件之类），
// 同样是「技能没进 README」—— 那种失效不该被放行。

const renderedBlocks = README_BLOCKS.map((b) => renderReadmeBlock(b, skills)).join("\n");
const coveredParents = new Set(README_BLOCKS.map((b) => b.parent));
const notInReadme = skills.filter((s) => !renderedBlocks.includes(`\`${s.name}\``));

for (const s of notInReadme) {
  report.fail(
    README_REL,
    0,
    `技能 \`${s.name}\`（${s.dir}）没有进 ${README_REL} 的任何一块生成区。` +
      (coveredParents.has(s.parent)
        ? ` 它的父目录 \`${s.parent}\` 有对应的生成区，但这个技能没被渲染进去。`
        : ` 原因：它的父目录 \`${s.parent}\` 不在 \`README_BLOCKS\` 的任何一块里。`) +
      ` 结果是访客在 README 上看不到它 —— 而 ${OUT_REL} 与 ${MARKETPLACE_REL} 里都有它。\n` +
      `      修法：在 scripts/gen-catalogue.js 的 \`README_BLOCKS\` 里给 \`${s.parent}\` 加一块` +
      "（并在 README 里补上成对的 `SKILLS-TABLE:START/END` 标记），" +
      "或者把这个技能挪进已经有生成区的一块。"
  );
}

// ── Claude Code 插件市场的清单 ────────────────────────────────────────────
//
// 它和上面两处是同一种东西：**技能清单的生成物**。只是读的人不是访客而是
// `claude plugin marketplace add` —— 清单里少一个技能，那条安装通道就少装一个，
// 而 JSON 仍然合法、市场仍然能用，没有别的东西会发现。

const actualMarketplace = readTracked(MARKETPLACE_REL);
if (actualMarketplace === null) {
  report.fail(
    MARKETPLACE_REL,
    0,
    "插件市场清单不存在 —— 它就是 `claude plugin marketplace add` 读的那个文件，" +
      "删掉等于少一条安装通道。运行 node scripts/gen-catalogue.js --write 生成。"
  );
} else {
  const expectedMarketplace = renderMarketplace(skills);
  if (actualMarketplace !== expectedMarketplace) {
    report.fail(
      MARKETPLACE_REL,
      0,
      "插件市场清单与技能源头不一致 —— 运行 node scripts/gen-catalogue.js --write 重新生成"
    );
    for (const line of describeFirstDiff(actualMarketplace, expectedMarketplace)) {
      report.info(line);
    }
  }
}

const missing = skills.filter((s) => !s.tagline || !s.example);
if (missing.length > 0) {
  // 只提示不判错：补齐元数据是人的工作，机器只负责把它摆在明处。
  // 但**必须可见** —— 目录里那块「待补元数据」占了位置，读者会看到占位符。
  report.info(
    `${missing.length} 个技能缺 tagline/example（目录里以占位符显示）：` +
      missing.map((s) => s.name).join(", ")
  );
}

report.info(
  `目录覆盖 ${skills.length} 个技能、${new Set(skills.map((s) => s.category)).size} 个场景；` +
    `其中 ${skills.filter((s) => s.hasEvals).length} 个有评测用例。`
);
// 措辞只描述**比对范围**，不描述结果 —— 它是常量，失败时也照打。
// 写成「已与源头一致」会在失败的运行里读成「它们是对的」，正好相反。
report.info(
  `比对范围：${OUT_REL} 全文 + ${README_REL} 里 ${README_BLOCKS.length} 块生成区` +
    `（${README_BLOCKS.map((b) => b.key).join("、")}）+ ${MARKETPLACE_REL} 全文。`
);
report.info(
  `覆盖要求：${skills.length} 个自建技能，逐个都必须在 ${README_REL} 的生成区里露面。`
);

report.finish();

/** 找出两段文本的第一处差异并按行展示。 */
function describeFirstDiff(actualText, expectedText) {
  const a = actualText.split("\n");
  const b = expectedText.split("\n");
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i += 1) {
    if (a[i] !== b[i]) {
      return [
        `第一个差异在第 ${i + 1} 行：`,
        `  - 已提交：${a[i] === undefined ? "(缺行)" : a[i]}`,
        `  + 期望值：${b[i] === undefined ? "(缺行)" : b[i]}`,
      ];
    }
  }
  return ["两段文本的行完全相同，但字节不同（多半是行尾或末尾换行差异）"];
}
