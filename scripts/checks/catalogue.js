#!/usr/bin/env node
"use strict";

/**
 * 断言 `docs/SKILLS.md` 与技能源头一致。
 *
 * ## 为什么需要它
 *
 * 目录是**生成物**，源头是各技能的 `SKILL.md`。生成物与源头脱节的方式很隐蔽：
 * 改了 `metadata.tagline` 却忘了重跑生成器 —— 文件仍在、链接仍有效、格式仍正确，
 * **只是内容旧了**。没有任何自动检查能发现这种「旧」，除非专门断言。
 *
 * 这与 `local-skills.json` 是同一套模式：提交生成物，用 CI 断言它是最新的。
 *
 * ## 判据
 *
 * 内存里重新生成一份，与提交的版本**逐字节比对**。不等就报错并给出第一个差异行，
 * 「目录过时了」这句话本身没有可操作性 —— 读者需要知道差在哪。
 */

const { Report } = require("../lib/report");
const { readTracked } = require("../lib/gitfiles");
const { collect, render, OUT_REL } = require("../gen-catalogue");

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
