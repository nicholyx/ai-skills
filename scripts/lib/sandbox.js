"use strict";

/**
 * 一次性沙箱 —— 「调模型跑技能」类工具共用的那一层。目前的使用者只有
 * `scripts/run-evals.js`。
 *
 * **为什么必须隔离**：用例的 prompt 是「帮我提交一下」「帮我 push 到远程」这类 ——
 * 在真仓库里跑会**真的产生提交、真的推送**。这是
 * `.trellis/spec/maintenance/index.md`「验证会写文件的命令时，先隔离环境」的直接应用。
 *
 * 抽成独立一层，是因为**铺沙箱这件事只该有一份实现** —— 两处各写一遍，迟早有一处
 * 忘了挡 `.claude/`，而那种漂移是静默的。与 `lib/manifest.js` 存在的理由是同一个。
 *
 * > 曾有个 `run-triggers.js` 也用它，那个尝试**未能成立、已删除** —— 完整证据见
 * > `.trellis/spec/skills/index.md`「关于技能唤起的实测」。
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { REPO_ROOT } = require("./gitfiles");

const BASE_README =
  "# 演示仓库\n\n这个仓库由 scripts/ 下的跑手创建，只在一次运行期间存在。\n";

/** 沙箱里那个裸 origin 的相对路径。 */
const ORIGIN_REL = ".origin.git";

/**
 * 跑 `git`，失败就抛。沙箱里的 git 不该失败 —— 失败意味着沙箱没铺对。
 *
 * **一律带 `-c core.quotepath=false`。** 不设它的话，非 ASCII 文件名在 Linux 上会被
 * 输出成八进制转义（`"\345\267\262..."`），而 macOS 上不会 —— 同一份代码在两个平台上
 * 给出**不同的面**，断言就没法跨平台写，评测跑手的结果也不可复现。
 * 真实踩过：同一条单元测试本地（macOS）绿、CI（Ubuntu）红。
 */
function git(cwd, argvArgs) {
  const r = spawnSync("git", ["-c", "core.quotepath=false", ...argvArgs], {
    cwd,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    throw new Error(`git ${argvArgs.join(" ")} 失败：${(r.stderr || "").trim()}`);
  }
  return r.stdout;
}

/**
 * 铺一个一次性沙箱。
 *
 * @param {object} opts
 * @param {{name: string, dir: string}} opts.skill 要装进沙箱的技能
 * @param {Array<object>} [opts.files] 前置状态，见 `run-evals.js` 文件头；
 *        每一项还可以是 `{path, link}` —— 造一个软链，目标可以不存在（断链）
 * @param {boolean} [opts.withOrigin] 是否铺一个裸 origin（默认 true）
 * @param {boolean} [opts.withSkill] 是否把技能装进沙箱（默认 true）。
 *        `false` 用于**消融基线**：不装技能跑同一个用例，看它是否照样通过。
 * @param {string} [opts.prefix] 临时目录前缀，便于在 /tmp 里认出是谁留下的
 * @returns {{box: string, baseHead: string}}
 */
function makeSandbox({ skill, files = [], withOrigin = true, withSkill = true,
                       prefix = "skill-eval" }) {
  const box = fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}-${skill.name}-`));

  // 基准仓库
  git(box, ["init", "-q"]);
  git(box, ["config", "user.email", "runner@example.invalid"]);
  git(box, ["config", "user.name", "runner"]);
  fs.writeFileSync(path.join(box, "README.md"), BASE_README, "utf8");
  git(box, ["add", "README.md"]);
  git(box, ["commit", "-qm", "初始提交"]);

  if (withOrigin) {
    // 裸的 origin：否则「push 到远程」这类用例无从谈起
    const origin = path.join(box, ORIGIN_REL);
    spawnSync("git", ["init", "-q", "--bare", origin], { encoding: "utf8" });
    git(box, ["remote", "add", "origin", origin]);
  }

  // 技能本体：放到项目级技能目录，正是 Claude Code 会发现的位置。
  // `withSkill: false` 就是**消融基线** —— 不装技能再跑一遍同一个用例，
  // 用来回答「这个用例到底是在测技能，还是在测模型本来就会做」。
  if (withSkill) {
    fs.cpSync(path.join(REPO_ROOT, skill.dir), path.join(box, ".claude", "skills", skill.name), {
      recursive: true,
      // evals/ 不进沙箱：模型不需要看到判分标准
      filter: (src) => path.basename(src) !== "evals",
    });
  }

  // 把「不属于被测场景」的文件挡在 `git status` 之外：跑手自己铺的那些，**以及 HOME
  // 隔离带来的副产物**。两类都会以 `untracked:` 出现在结果面上，把模型引到
  // 「这两个文件要不要一起提交」上去 —— 实测跑 `git-commit` 用例时模型**真的**开始
  // 讨论要不要把 `.claude.json` 提交进去，而那与用例要测的东西毫无关系。
  //
  // `.claude.json` 不是跑手铺的，是 `claude` 自己写的：它把配置放在 `$HOME/.claude.json`
  // （已实测：把 HOME 指到一个空目录后跑一次 `claude -p`，那里会多出 `~/.claude/` 与
  // `~/.claude.json`）。而沙箱里 HOME 就是沙箱根（见 run-evals.js 的 `--no-isolate-home`），
  // 于是它落在仓库根、变成一个未跟踪文件。`/.claude/` 那条只匹配同名目录，挡不住它。
  fs.appendFileSync(
    path.join(box, ".git", "info", "exclude"),
    `\n# 跑手自己铺的，以及隔离 HOME 的副产物，都不属于被测场景\n` +
      `/.claude/\n/.claude.json\n/${ORIGIN_REL}/\n`
  );

  // 前置状态
  for (const f of files) {
    if (!f || typeof f.path !== "string") {
      throw new Error("files 里的每一项必须有 path");
    }
    const abs = path.join(box, f.path);
    fs.mkdirSync(path.dirname(abs), { recursive: true });

    // `link`：造一个软链。它可以指向不存在的目标 —— 那是「断链」这一类故障的全部
    // 意义所在，而普通的「写文件」表达不了它。
    if (typeof f.link === "string") {
      fs.symlinkSync(f.link, abs);
      continue;
    }
    if (typeof f.content !== "string") {
      throw new Error(`files 项 ${f.path} 既没有 content 也没有 link`);
    }
    fs.writeFileSync(abs, f.content, "utf8");
    if (f.executable) fs.chmodSync(abs, 0o755);
    if (f.commit) {
      git(box, ["add", "--", f.path]);
      git(box, ["commit", "-qm", `前置状态：${f.path}`]);
    } else if (f.stage) {
      git(box, ["add", "--", f.path]);
    }
  }

  // 记下铺完前置状态时的 HEAD：跑完之后据此算「模型新增了几个提交、动了哪些文件」
  return { box, baseHead: git(box, ["rev-parse", "HEAD"]).trim() };
}

/**
 * 把沙箱的**最终状态**摘要成一个可断言的面。
 *
 * 这是对「模型说了什么」的补充，而且是更硬的那种证据：模型可以嘴上说「我不会执行
 * git push」而实际推了，也可以什么都没说却把 .env 提交了。**断言应当尽量落在结果上。**
 *
 * 格式是扁平的 `key: value` 行，便于用 contains / not_contains 断言：
 *
 *   commits: 2              提交总数
 *   new-commits: 1          本次运行新增的提交数（0 = 什么都没提交）
 *   staged: src/a.js        暂存区里的文件（空则 `(空)`）
 *   committed-files: …      本次运行改动到的文件（相对基准 HEAD）
 *   untracked: …            未跟踪文件
 *   pushed: no              裸 origin 里有没有 ref（即「真的推上去了吗」）
 */
function repoSurface(box, baseHead) {
  const log = git(box, ["log", "--oneline"]).trim();
  const staged = git(box, ["diff", "--cached", "--name-only"]).trim();
  const committed = git(box, ["diff", "--name-only", baseHead, "HEAD"]).trim();
  const untracked = git(box, ["status", "--porcelain"])
    .split("\n")
    .filter((l) => l.startsWith("??"))
    .map((l) => l.slice(3).trim())
    .filter(Boolean)
    .join(" ");

  // 基准状态时 origin 是空的，所以「有没有 ref」就等于「有没有推过」
  let pushed = "no";
  if (fs.existsSync(path.join(box, ORIGIN_REL))) {
    try {
      if (git(box, ["ls-remote", "origin"]).trim() !== "") pushed = "yes";
    } catch {
      pushed = "(origin 不可达)";
    }
  }

  const list = (s) => (s === "" ? "(空)" : s.split("\n").join(" "));

  return [
    `commits: ${log === "" ? 0 : log.split("\n").length}`,
    `new-commits: ${git(box, ["rev-list", "--count", `${baseHead}..HEAD`]).trim()}`,
    `staged: ${list(staged)}`,
    `committed-files: ${list(committed)}`,
    `untracked: ${untracked === "" ? "(空)" : untracked}`,
    `pushed: ${pushed}`,
  ].join("\n");
}

/**
 * 解析 `claude --output-format stream-json` 的逐行输出，归类成各个作用面。
 * 见 `evals.json` 的 `target` 文档。纯函数，不碰文件系统。
 */
function collectSurfaces(stdout, repoText = "(未采集)") {
  const surfaces = { tools: [], output: [], transcript: [], repo: [repoText] };

  for (const line of stdout.split("\n")) {
    const s = line.trim();
    if (!s.startsWith("{")) continue;
    let ev;
    try {
      ev = JSON.parse(s);
    } catch {
      continue;
    }
    // 这个跑手的前提就是「它会花钱」，所以把真实花费报出来，而不是只给个预估值
    if (ev.type === "result" && typeof ev.total_cost_usd === "number") {
      surfaces.costUsd = (surfaces.costUsd || 0) + ev.total_cost_usd;
    }
    if (ev.type !== "assistant") continue;
    for (const block of ev.message?.content || []) {
      if (block.type === "text" && typeof block.text === "string") {
        surfaces.output.push(block.text);
      } else if (block.type === "tool_use") {
        // 工具名 + 入参一起进：命令在入参里，名字本身也是信号
        surfaces.tools.push(`${block.name} ${JSON.stringify(block.input ?? {})}`);
      }
    }
  }

  // 全文 = 工具调用 + 模型输出。顺序无关紧要，断言只做包含判断。
  surfaces.transcript = [...surfaces.tools, ...surfaces.output];
  return surfaces;
}

/**
 * 汇总**消融基线**每轮的逐条断言结果 —— 回答「不装技能时，究竟是哪几条断言照样过」。
 *
 * 为什么需要它：只留一个「这轮过没过」的布尔值时，基线一旦不是全挂，读者只知道
 * 「有问题」，不知道**是哪一条断言在漏** —— 而那才是下一步要改的东西。一条用例里
 * 只要有一条断言在「不装技能」时恒过，这条用例就在那一条上测模型而不是测技能。
 *
 * 计数按「轮」不按「用例」：`--ablate-repeats` 大于 1 时同一个断言会在多轮里出现，
 * `passed / total` 正好把「基线会翻」这件事如实带出来（见测试规范「消融结果本身有噪声」）。
 *
 * @param {Array<Array<{type: string, target: string, value: any, ok: boolean}>>} baselineResults
 *        基线**每轮**的断言结果（外层是轮，内层是断言）
 * @returns {Array<{key: string, passed: number, total: number}>}
 *        至少通过过一轮的断言，按首次出现顺序；`total` 是它出现过的轮数
 */
function baselineHits(baselineResults) {
  const byKey = new Map();
  for (const results of baselineResults || []) {
    for (const r of results || []) {
      const key = `${r.type} [${r.target || "transcript"}] ${r.value}`;
      const entry = byKey.get(key) || { key, passed: 0, total: 0 };
      entry.total += 1;
      if (r.ok) entry.passed += 1;
      byKey.set(key, entry);
    }
  }
  // 只留下真的命中过的：全挂的断言列出来只会淹没信号
  return [...byKey.values()].filter((e) => e.passed > 0);
}

module.exports = { git, makeSandbox, repoSurface, collectSurfaces, baselineHits, BASE_README };
