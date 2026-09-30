#!/usr/bin/env node
"use strict";

/**
 * `CLAUDE.md` → `AGENTS.md` 的导入链。
 *
 * ## 它守的是什么
 *
 * 本仓库的规则只有一份，在 `AGENTS.md`。但 **Claude Code 不会自动读它** —— 靠
 * `CLAUDE.md` 里那行 **`@AGENTS.md` 导入语法**把全文拉进每次会话的上下文。
 *
 * **那行掉了，规则就静默不再加载。** 没有报错、没有警告，只是之后每一个会话都不知道
 * 这个仓库的规矩 —— 而人不会立刻发现，因为会话照样能干活，只是干得不对。
 *
 * 这个失效**实测过**：只放一个普通的 markdown 链接（`[AGENTS.md](AGENTS.md)`）时，
 * 新会话明确回答「我没有读过 AGENTS.md」，并且只能从 git 提交历史里去猜流程。
 *
 * ## 为什么值得单独一个检查器
 *
 * 它守的是一条**一行文本**。一行文本看起来不值得检查 —— 但正是这种「看起来显然、
 * 坏了又没人知道」的东西最需要断言。这与本仓库其它检查器的判断标准一致：
 * **会静默失效的，就要有东西盯着。**
 *
 * 注意 `links.js` 管不到这件事：它只校验「链接目标存在」，而那行**整个删掉**之后，
 * 它没有任何东西可校验 —— 照样通过。所以必须有针对这条链本身的断言。
 */

const fs = require("fs");
const path = require("path");
const { Report } = require("../lib/report");
const { REPO_ROOT, trackedSet } = require("../lib/gitfiles");

const report = new Report("规则导入链校验");

const CLAUDE = "CLAUDE.md";
const SPEC_PREFIX = ".trellis/spec/";
const AGENTS = "AGENTS.md";
const IMPORT = /^@AGENTS\.md\s*$/m;

const tracked = trackedSet();

for (const rel of [CLAUDE, AGENTS]) {
  if (!tracked.has(rel)) {
    report.fail(rel, 0, `不在 git 索引里 —— 规则文件必须随仓库分发`);
  }
}

const claudePath = path.join(REPO_ROOT, CLAUDE);
if (tracked.has(CLAUDE) && !fs.existsSync(claudePath)) {
  report.fail(CLAUDE, 0, "在 git 索引里，但不在工作区");
} else if (fs.existsSync(claudePath)) {
  const text = fs.readFileSync(claudePath, "utf8");

  if (!IMPORT.test(text)) {
    const line = text.split("\n").findIndex((l) => l.includes("AGENTS.md")) + 1;
    report.fail(
      CLAUDE,
      line > 0 ? line : 0,
      `找不到单独成行的 \`@AGENTS.md\` 导入。**只写一个普通链接不够** —— ` +
        "Claude Code 不会因此加载它，新会话就看不到规则（实测过）。" +
        "修法：单独一行写 `@AGENTS.md`"
    );
  }

  // 导入语法必须独占一行：混在文字里不生效，而这是最容易在改写时踩到的。
  // 先把行内代码（反引号包起来的部分）去掉再判 —— 说明文字里会引用 `@AGENTS.md`，
  // 那不是导入行，不该误报。
  for (const [idx, l] of text.split("\n").entries()) {
    const withoutCode = l.replace(/`[^`]*`/g, "");
    if (withoutCode.includes("@AGENTS.md") && !/^@AGENTS\.md\s*$/.test(l)) {
      report.fail(
        CLAUDE,
        idx + 1,
        "`@AGENTS.md` 必须**单独占一行**，前后不能有别的字符 —— 混在句子或列表里不会生效"
      );
    }
  }
}

// ── 第二环：AGENTS.md 必须仍然指着 `.trellis/spec/` ────────────────────────
//
// 上面那条守的是「规则文件会不会被加载」。这条守的是**加载进来之后，里面还有没有
// 通往规范的入口** —— 两者都会以同一种方式失败：新会话不知道这个仓库有规范。
//
// 缺口真实存在，而且是**验过的**：把 AGENTS.md 手写块里「动手前必读」那一段整块删掉
// （五条指向 `.trellis/spec/**` 的链接全没了），**所有检查全绿**。`links.js` 管不到它：
// 它只验「存在的链接有没有坏」，不验「该有的链接还在不在」—— 与
// `checks/catalogue.js` 那条「覆盖」断言是同一类问题（只验一致、不验存在）。
//
// 判据故意**不钉死任何一句话或某一个文件名**（本仓库反对脆断言）：AGENTS.md 正文里
// 至少要有一条指向 `.trellis/spec/` 下**真实存在**文件的链接。链接目标按 git 索引判
// 存在（`links.js` 的同一判据，见 `.trellis/spec/checks/index.md`）——
// `fs.existsSync` 在大小写不敏感的 APFS 上会给出与 Linux runner 不同的答案。
//
// 只要求「至少一条」：具体有哪几页、怎么组织，是维护者的事，机器不替它做决定。

const agentsPath = path.join(REPO_ROOT, AGENTS);
if (tracked.has(AGENTS) && !fs.existsSync(agentsPath)) {
  report.fail(AGENTS, 0, "在 git 索引里，但不在工作区");
} else if (fs.existsSync(agentsPath)) {
  const text = fs.readFileSync(agentsPath, "utf8");
  const specLinks = [];
  for (const [idx, line] of text.split("\n").entries()) {
    for (const m of line.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const resolved = path.posix.normalize(m[1].split("#")[0].split("?")[0]);
      if (!resolved.startsWith(SPEC_PREFIX)) continue;
      specLinks.push({ line: idx + 1, raw: m[1], resolved, exists: tracked.has(resolved) });
    }
  }
  const live = specLinks.filter((l) => l.exists);
  if (live.length === 0) {
    report.fail(
      AGENTS,
      specLinks.length > 0 ? specLinks[0].line : 0,
      `找不到任何指向 \`.trellis/spec/\` 下**存在文件**的链接 —— ` +
        "**新会话会因此看不到本项目的开发规范**（AGENTS.md 是唯一被拉进上下文的规则文件，" +
        "而规范在 `.trellis/spec/` 下；入口没了，之后就只按通用常识干活，没有报错）。" +
        (specLinks.length > 0
          ? ` 现在有 ${specLinks.length} 条指向该目录的链接，但目标都不在 git 索引里：` +
            specLinks.map((l) => `${l.raw}（第 ${l.line} 行）`).join("、")
          : " AGENTS.md 里连一条这样的链接都没有 —— 大概率是被整段删掉了。") +
        " 修法：在「动手前必读」一类的小节里，把通往 `.trellis/spec/**` 的入口补回来。"
    );
  } else {
    report.info(
      `AGENTS.md 有 ${live.length} 条通往 ${SPEC_PREFIX} 的链接（目标都在索引里），` +
        `规范的入口还在（第 ${live.map((l) => l.line).join("、")} 行）。`
    );
  }
}

report.info(
  `检查 ${CLAUDE} → ${AGENTS} 的导入链：规则只有一份，靠这一行把它拉进每次会话的上下文。`
);

report.finish();
