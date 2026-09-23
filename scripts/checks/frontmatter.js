#!/usr/bin/env node
"use strict";

/**
 * SKILL.md frontmatter 校验。
 *
 * 规则来自官方 validator `.agents/skills/skill-creator/scripts/quick_validate.py`
 * 的 `ALLOWED_PROPERTIES` 与各项长度/命名约束（那个脚本依赖 PyYAML，本机跑不了，
 * 所以在此用 Node 复刻），外加本仓库自有的一条：**name 必须等于所在目录名**。
 *
 * 分级：`custom/**` fail，`.agents/**` warn。理由见 lib/report.js。
 */

const { Report } = require("../lib/report");
const { skillDirs, readTracked } = require("../lib/gitfiles");
const { parseFrontmatter, validateFrontmatter } = require("../lib/frontmatter");

const report = new Report("技能 frontmatter 校验");

const skills = skillDirs();

if (skills.length === 0) {
  report.abort(
    "没有找到任何技能目录。\n" +
      "  技能 = .agents/skills、custom/daily、custom/projects 的**深度 1** 子目录，\n" +
      "  且该目录下有一个已被 git 追踪的 SKILL.md。"
  );
}

let selfSkills = 0;
let vendorSkills = 0;
let selfFails = 0;
let vendorFails = 0;

for (const skill of skills) {
  const text = readTracked(skill.skillMd);
  if (text === null) {
    report.at(skill.tier, skill.skillMd, 0, "文件在 git 索引里，但不在工作区");
    if (skill.tier === "vendor") vendorFails += 1;
    else selfFails += 1;
    continue;
  }

  const parsed = parseFrontmatter(text);
  const violations = validateFrontmatter(parsed, {
    dirName: skill.name,
    tier: skill.tier,
  });

  const fails = violations.filter((v) => v.level === "fail").length;
  if (skill.tier === "vendor") {
    vendorSkills += 1;
    vendorFails += fails;
  } else {
    selfSkills += 1;
    selfFails += fails;
  }

  for (const v of violations) {
    // level 只区分「规则本身有多硬」（BOM/CRLF 是风格提示），
    // 是否阻塞由 tier 决定 —— 见 lib/report.js 的 at()。
    if (v.level === "fail") {
      report.at(skill.tier, skill.skillMd, v.line, v.message);
    } else {
      report.warn(skill.skillMd, v.line, v.message);
    }
  }
}

const selfPart =
  selfFails === 0 ? "全部通过" : `${selfFails} 处问题`;
const vendorPart =
  vendorFails === 0 ? "全部通过" : `${vendorFails} 处上游遗留（不计入退出码）`;

report.info(`自建 ${selfSkills} 个技能，${selfPart}；上游 ${vendorSkills} 个技能，${vendorPart}。`);

report.finish();
