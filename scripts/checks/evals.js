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
 *                  "files": [],
 *                  "assertions": [ {"type": "...", "target": "...", "value": "..."} ] } ] }
 *
 * `skill_name` 必须等于所在技能目录名：技能改名后这里最容易漏改，
 * 而它一旦不符，按名字索引 eval 用例的工具就会找不到它们。
 *
 * ## 断言的 `target`：它在看什么
 *
 * 一条断言必须说清它检查的是**模型说了什么**还是**模型做了什么** —— 否则无法执行：
 *
 * | target | 看的是 | 例 |
 * | --- | --- | --- |
 * | `transcript`（默认）| 全文（工具调用 + 模型输出），最宽松 | 正向断言用它够用 |
 * | `tools` | 模型实际执行的工具调用 | 「不许执行 `git push`」|
 * | `output` | 模型的输出文本 | 「不许问『是否继续』」|
 * | `repo` | 沙箱**最终状态**的摘要（提交数、暂存区、已提交文件、origin 有没有 ref）| 「什么都没提交」「真的推上去了」|
 *
 * **能落在 `repo` 上的断言就落在 `repo` 上** —— 它比前三个都硬。模型可以嘴上说
 * 「我不会执行 git push」而实际推了，也可以什么都没说却把 `.env` 提交了。
 * 前三个面测的是它**怎么说**，`repo` 测的是它**做成了什么**。
 *
 * **`not_contains` 必须显式给 `target`**（判错，不是提示）。因为默认的 `transcript`
 * 是全文匹配，而否定断言在全文下几乎必然误伤：模型只要说一句「我不会执行 `git push`」，
 * 就会命中 `not_contains "git push"` —— 行为完全正确，断言却红了。这类**假失败**比漏检
 * 更糟：它会让人不再相信这套用例。
 *
 * 正向断言（`contains`）不强制：`transcript` 是超集，最坏只是约束偏松，不会误伤。
 */

const { Report } = require("../lib/report");
const { skillDirs, trackedFiles, readTracked } = require("../lib/gitfiles");

/** 断言的比较方式。写错的类型不会被任何跑手匹配 —— 用例会静默失效。 */
const ASSERTION_TYPES = ["contains", "not_contains"];

/** 断言的作用面。见文件头。 */
const ASSERTION_TARGETS = ["transcript", "output", "tools", "repo"];

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

    // 断言的内容校验：只管「写错了会静默失效或假失败」的几项，
    // 不管「该断言什么」—— 那是人的判断。
    if (Array.isArray(item.assertions)) {
      item.assertions.forEach((a, ai) => {
        const at = `${where}.assertions[${ai}]`;
        if (typeof a !== "object" || a === null) {
          report.at(skill.tier, evalsPath, 0, `${at} 应为对象`);
          return;
        }
        if (!ASSERTION_TYPES.includes(a.type)) {
          report.at(
            skill.tier,
            evalsPath,
            0,
            `${at} 的 type「${a.type}」不认识（允许：${ASSERTION_TYPES.join("、")}）` +
              " —— 不认识的类型不会被任何跑手匹配，用例会静默失效"
          );
          return;
        }
        if (typeof a.value !== "string" || a.value === "") {
          report.at(skill.tier, evalsPath, 0, `${at} 缺少非空的 value`);
          return;
        }
        if (a.target !== undefined && !ASSERTION_TARGETS.includes(a.target)) {
          report.at(
            skill.tier,
            evalsPath,
            0,
            `${at} 的 target「${a.target}」不认识（允许：${ASSERTION_TARGETS.join("、")}）`
          );
          return;
        }
        if (a.type === "not_contains" && a.target === undefined) {
          report.at(
            skill.tier,
            evalsPath,
            0,
            `${at} 是否定断言但没写 target —— 默认的 transcript 是全文匹配，` +
              "模型只要说一句「我不会执行它」就会命中、假失败。" +
              "请显式写 tools（不该做的动作）或 output（不该说的话）"
          );
        }
      });
    }

    // `ablation`：记录「这条用例有没有区分度」的消融观测。可选，但一旦出现就必须
    // **结构完整且自洽** —— 本仓库吃过「布尔值被单次观测填死」的亏：同一个用例的
    // 基线结果会翻，写 `discriminating: true/false` 而不记观测轮数就是在制造假确定性。
    if (item.ablation !== undefined) {
      const ab = item.ablation;
      const at = `${where}.ablation`;
      const bad = (msg) => report.at(skill.tier, evalsPath, 0, `${at} ${msg}`);
      if (typeof ab !== "object" || ab === null || Array.isArray(ab)) {
        bad("应为对象");
      } else if (
        typeof ab.observations !== "number" ||
        !Number.isInteger(ab.observations) ||
        ab.observations < 1
      ) {
        bad("缺 `observations`（观测轮数，正整数）—— 单次观测不足以下结论，必须记轮数");
      } else if (
        typeof ab.discriminating !== "number" ||
        ab.discriminating < 0 ||
        ab.discriminating > ab.observations
      ) {
        bad("`discriminating`（有几轮「装了过、不装挂」）必须是 0..observations 的整数");
      } else if (!["stable", "unstable", "none"].includes(ab.conclusion)) {
        bad("`conclusion` 必须是 stable / unstable / none");
      } else {
        const { conclusion, discriminating: d, observations: n } = ab;
        const selfConsistent =
          (conclusion === "stable" && d === n) ||
          (conclusion === "unstable" && d > 0 && d < n) ||
          (conclusion === "none" && d === 0);
        if (!selfConsistent) {
          bad(
            `\`conclusion: ${conclusion}\` 与计数对不上（${d}/${n}）—— ` +
              "stable 要求每轮都有区分度、unstable 要求两种结果都出现过、none 要求一轮都没有"
          );
        } else if (typeof ab.note !== "string" || ab.note.trim() === "") {
          bad("缺 `note` —— 结论必须带理由，否则下一个人无从判断它还算不算数");
        }
      }
    }
  });

  const gaps = [...missing.entries()]
    .filter(([, n]) => n > 0)
    .map(([field, n]) => `${field}（${n}/${data.evals.length} 条缺失）`);

  if (gaps.length > 0) {
    // 带 skill.tier：上游 evals.json 的字段缺失是「上游遗留」，不是自建的待办。
    report.warn(evalsPath, 0, `用例字段不完整：${gaps.join("、")}`, skill.tier);
  }
}

report.info(`检查了 ${checked} 个 evals.json（全仓技能共 ${skills.length} 个）。`);

report.finish();
