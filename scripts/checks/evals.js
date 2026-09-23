#!/usr/bin/env node
"use strict";

/**
 * `evals/evals.json` 结构校验。
 *
 * 只查结构与命名一致性，**不跑断言** —— 断言写得对不对，机器判不了。
 *
 * 契约：
 *   { "skill_name": "<技能目录名>",
 *     "evals": [ { "id": 1, "prompt": "...", "expected_output": "...",
 *                  "files": [], "assertions": [ {"type": "...", "value": "..."} ] } ] }
 *
 * `skill_name` 必须等于所在技能目录名：技能改名后这里最容易漏改，
 * 而它一旦不符，按名字索引 eval 用例的工具就会找不到它们。
 */

const { Report } = require("../lib/report");
const { skillDirs, trackedFiles, readTracked } = require("../lib/gitfiles");

const report = new Report("evals.json 结构校验");

const skills = skillDirs();
const tracked = new Set(trackedFiles());

if (skills.length === 0) {
  report.abort("没有找到任何技能目录（见 frontmatter 检查器的说明）。");
}

let checked = 0;

for (const skill of skills) {
  const evalsPath = `${skill.dir}/evals/evals.json`;
  const evalsDirPrefix = `${skill.dir}/evals/`;

  const hasEvalsDir = [...tracked].some((p) => p.startsWith(evalsDirPrefix));

  if (!tracked.has(evalsPath)) {
    if (hasEvalsDir) {
      report.at(
        skill.tier,
        skill.dir,
        0,
        "存在 evals/ 目录但没有 evals.json"
      );
    }
    continue;
  }

  checked += 1;

  const raw = readTracked(evalsPath);
  if (raw === null) {
    report.at(skill.tier, evalsPath, 0, "文件在 git 索引里，但不在工作区");
    continue;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    report.at(skill.tier, evalsPath, 0, `不是合法 JSON：${err.message}`);
    continue;
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    report.at(skill.tier, evalsPath, 1, "顶层应为 JSON 对象");
    continue;
  }

  // skill_name
  const skillName = data.skill_name;
  if (typeof skillName !== "string" || skillName.trim() === "") {
    report.at(skill.tier, evalsPath, 1, "顶层缺少非空的 skill_name");
  } else if (skillName !== skill.name) {
    report.at(
      skill.tier,
      evalsPath,
      2,
      `skill_name「${skillName}」与所在目录名「${skill.name}」不一致`
    );
  }

  // evals[]
  if (!Array.isArray(data.evals) || data.evals.length === 0) {
    report.at(skill.tier, evalsPath, 1, "顶层缺少非空的 evals 数组");
    continue;
  }

  // 可补齐的字段。缺失只提示不判错 —— 它们不破坏结构，
  // 而且「这个用例该断言什么」是人的判断，机器不该替他决定。
  // 按字段汇总成一条，而不是每条用例各报一次：6 条写坏的用例不该产生 6 行输出。
  const optionalFields = ["expected_output", "files", "assertions", "name"];
  const missing = new Map(optionalFields.map((f) => [f, 0]));

  data.evals.forEach((item, idx) => {
    const where = `evals[${idx}]`;
    if (typeof item !== "object" || item === null) {
      report.at(skill.tier, evalsPath, 0, `${where} 应为对象`);
      return;
    }
    if (typeof item.id !== "number") {
      report.at(skill.tier, evalsPath, 0, `${where} 缺少数字类型的 id`);
    }
    if (typeof item.prompt !== "string" || item.prompt.trim() === "") {
      report.at(skill.tier, evalsPath, 0, `${where} 缺少非空的 prompt`);
    }

    for (const field of optionalFields) {
      const value = item[field];
      const present =
        field === "expected_output" || field === "name"
          ? typeof value === "string" && value.trim() !== ""
          : Array.isArray(value);
      if (!present) missing.set(field, missing.get(field) + 1);
    }
  });

  const gaps = [...missing.entries()]
    .filter(([, n]) => n > 0)
    .map(([field, n]) => `${field}（${n}/${data.evals.length} 条缺失）`);

  if (gaps.length > 0) {
    report.warn(evalsPath, 0, `用例字段不完整：${gaps.join("、")}`);
  }
}

report.info(`检查了 ${checked} 个 evals.json（全仓技能共 ${skills.length} 个）。`);

report.finish();
