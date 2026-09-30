#!/usr/bin/env node
"use strict";

/**
 * 技能里嵌的 shell 命令，语法必须是合法的。
 *
 * ## 为什么这是「测技能」的一条真检查
 *
 * 技能很大程度上就是**一份让模型照着敲的命令清单**。命令写坏了，技能在运行期才炸 ——
 * 而且往往炸得不明显（模型会自己绕过去，或者报一个跟技能内容无关的错）。
 * 本仓库就写过一条在 zsh 下会中断整条命令的 `for f in .claude/skills/*`，
 * 而它是靠人工实测才发现的。
 *
 * `bash -n` 只做**语法解析**，不执行任何东西 —— 所以它安全、免费、可以进 CI。
 * 它抓不出的东西也要说清楚：**语义错误**（命令合法但行为不对）它一概看不见，
 * 那种只能靠 `run-evals.js` 的评测用例。
 *
 * ## 两类必须放行的情况
 *
 * 1. **占位符**：`git add <resolved-file>`、`npx skills use …@<技能名>` ——
 *    bash 会把 `<` 当重定向，报 syntax error。但这是**合理的文档写法**，
 *    不处理就会产生 6 处误报。所以先把 `<…>` 换成普通词再解析。
 * 2. **故意写坏的反例**：`maintain-loop` 里有一块专门演示「✗ 这样写会错」，
 *    那段本来就不该能跑。作者在块内任意一行写 `# skill-check: ignore` 即可豁免，
 *    **并且要在同一行说明为什么** —— 豁免必须带理由，否则它会变成万能挡箭牌。
 */

const fs = require("fs");
const { spawnSync } = require("child_process");
const { Report } = require("../lib/report");
const { skillDirs, readTracked } = require("../lib/gitfiles");

const report = new Report("技能命令校验");

/** 围栏：```bash / ```sh / ```shell。`zsh` 也收 —— 它同样是 shell。 */
const FENCE = /^```(?:bash|sh|shell|zsh)\n([\s\S]*?)```/gm;

const IGNORE = /^[ \t]*#[ \t]*skill-check:[ \t]*ignore\b[ \t]*(.*)$/m;

/**
 * 把 `<占位符>` 换成普通词，让 `bash -n` 能解析。
 * 只换**成对**的 `<…>`（不成对的 `<` 是真重定向，不能动），
 * 且限制长度 —— 长跨度的 `<` `>` 多半是两条无关的命令。
 */
function neutralisePlaceholders(code) {
  return code.replace(/<[^<>\n]{1,48}>/g, "PLACEHOLDER");
}

const skills = skillDirs().filter((s) => s.tier === "self");
let blocks = 0;
let ignored = 0;

for (const skill of skills) {
  const md = readTracked(skill.skillMd);
  if (md === null) continue;

  FENCE.lastIndex = 0;
  let m;
  while ((m = FENCE.exec(md)) !== null) {
    const code = m[1];
    const startLine = md.slice(0, m.index).split("\n").length;

    const opt = IGNORE.exec(code);
    if (opt) {
      if (opt[1].trim() === "") {
        report.fail(
          skill.skillMd,
          startLine,
          "`# skill-check: ignore` 必须**在同一行写出理由** —— 豁免不带理由是万能挡箭牌，下一个人无从判断它还算不算数"
        );
      } else {
        ignored += 1;
      }
      continue;
    }

    blocks += 1;
    const r = spawnSync("bash", ["-n"], {
      input: neutralisePlaceholders(code),
      encoding: "utf8",
    });
    if (r.status !== 0) {
      const err = (r.stderr || "").trim().split("\n")[0] || "（bash -n 失败，但没有输出）";
      // bash 的行号是相对代码块的，换算成文件里的行号方便定位
      const rel = /line (\d+)/.exec(err);
      const line = rel ? startLine + Number(rel[1]) : startLine;
      report.fail(
        skill.skillMd,
        line,
        `shell 代码块语法不通过：${err} —— 技能是让模型照着敲的，命令写坏了它运行期才炸`
      );
    }
  }
}

report.info(
  `${skills.length} 个自建技能：检查了 ${blocks} 个 shell 代码块` +
    (ignored > 0 ? `，另有 ${ignored} 个显式豁免` : "") +
    "。只做语法解析（bash -n），不执行。"
);
report.info(
  "它抓不出语义错误 —— 命令合法但行为不对的那种，只能靠 run-evals.js 的评测用例。"
);

report.finish();
