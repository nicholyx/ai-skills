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

/** 跑 `git`，失败就抛。沙箱里的 git 不该失败 —— 失败意味着沙箱没铺对。 */
function git(cwd, argvArgs) {
  const r = spawnSync("git", argvArgs, { cwd, encoding: "utf8" });
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

  // 把跑手自己铺的东西挡在 `git status` 之外。
  // 否则「暂存区为空」这类用例会变成「有两个未跟踪目录该怎么办」—— 实测模型就被带偏了，
  // 开始讨论要不要提交 `.claude/`，而那与这条用例要测的东西毫无关系。
  fs.appendFileSync(
    path.join(box, ".git", "info", "exclude"),
    `\n# 跑手自己铺的，不属于被测场景\n/.claude/\n/${ORIGIN_REL}/\n`
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

module.exports = { git, makeSandbox, repoSurface, collectSurfaces, BASE_README };
