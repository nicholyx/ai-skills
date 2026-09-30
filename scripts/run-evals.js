#!/usr/bin/env node
"use strict";

/**
 * 跑一个技能的 `evals/evals.json` —— 让 `docs/SKILLS.md` 里的 ✅ 有兑现机制。
 *
 * 用法：
 *   node scripts/run-evals.js --skill git-commit              # 跑该技能的全部用例
 *   node scripts/run-evals.js --skill git-commit --eval 1,2   # 只跑指定的几条
 *   node scripts/run-evals.js --skill git-commit --dry-run    # 只列出会执行什么，不调模型
 *
 * 选项：
 *   --model <id>      传给 claude 的模型（默认跟随本机 Claude Code 配置）
 *   --allowed <tools> 覆盖工具白名单（默认 Bash,Read,Write,Edit,Grep,Glob）
 *   --timeout <秒>    单条用例的上限，默认 300
 *   --keep            保留沙箱目录，并把原始 transcript 写进 <沙箱>/transcript.jsonl
 *                     （排错用 —— 用法例通过与否去反推原因，等于猜）
 *   --no-isolate-home 不隔离 HOME（默认隔离：用例不该依赖运行者的机器状态）
 *   --ablate          同时跑「不装技能」的**消融基线**。见文件头「一个通过不等于有用」
 *   --ablate-repeats <n>  基线跑 n 轮（默认 1）。**基线结果会翻**，单次不足以下结论 ——
 *                     要写进用例的「有没有区分度」时，至少 3 轮
 *   --json            机器可读输出
 *
 * ## 为什么它不进 CI
 *
 * 实测单条用例约 **$0.24 / 40 秒**。22 条用例一轮约 $5 —— 成本与时长都不适合每次 PR。
 * 它是**维护者工具**：改完技能之后手动跑一遍，确认它还是照说明干活。
 *
 * ## 一个通过不等于有用：消融基线（`--ablate`）
 *
 * **一个用例通过，不等于它在测这个技能。** 实测踩到过：给 `skills-doctor` 写的
 * 「找出断链」用例，把技能里**整整一步「检查软链」删掉**之后**照样通过**；把技能
 * **完全不装进沙箱**，模型自己 `ls` + `readlink` 也把断链找出来了 —— 那条用例测的是
 * **模型本来就会做的事**。
 *
 * 所以 `--ablate` 会把每个用例**不装技能**再跑一遍，两者一比才说明问题：
 *
 * | 装了 | 不装 | 说明 |
 * | --- | --- | --- |
 * | ✓ | ✗ | **有区分度** —— 技能确实带来了东西 |
 * | ✓ | ✓ | **无区分度** —— 用例在测模型，不在测技能 |
 * | ✗ | ✗ | 用例本身有问题（或技能确实没用）|
 *
 * **它只报不判红**：无区分度是「用例写得不够具体」，是待改进项，不是技能坏了。
 * 设成失败会让工具长期红着，而那正是「训练人忽略输出」。
 *
 * 代价是**跑一轮的钱翻倍**，所以默认不开。
 *
 * ## 安全边界：每个用例一个一次性沙箱
 *
 * 用例的 prompt 是「帮我提交一下」「帮我 push 到远程」这类 —— **在真仓库里跑会真的
 * 产生提交、真的推送**。所以每条用例都在 `mktemp -d` 出来的独立目录里执行，
 * 那里自成一个 git 仓库、自带一个裸的 `origin`。跑完即删（`--keep` 可留）。
 *
 * 这是 `.trellis/spec/maintenance/index.md`「验证会写文件的命令时，先隔离环境」
 * 那条规则的直接应用。
 *
 * **绝不用 `--dangerously-skip-permissions`。** 工具白名单显式给出，靠沙箱兜底。
 *
 * ## 前置状态：`files`
 *
 * 断言「暂存区为空时先询问」的用例，前提是**暂存区真的是空的**；断言「拒绝把 .env
 * 纳入提交」的用例，前提是**真的有个 .env**。所以 `evals.json` 的 `files` 不是装饰，
 * 它是这条用例的**前置状态**，由跑手在沙箱里铺好：
 *
 *   "files": [
 *     { "path": "README.md", "content": "…", "stage": true },
 *     { "path": ".env", "content": "API_KEY=…" },
 *     { "path": ".git/hooks/pre-commit", "content": "#!/bin/sh\nexit 1\n", "executable": true },
 *     { "path": "src/x.js", "content": "旧版本", "commit": true },
 *     { "path": "src/x.js", "content": "新版本", "stage": true }
 *   ]
 *
 * 条目按顺序处理。`commit: true` 表示把它作为**基准状态**提交进去 ——
 * 它存在的意义是让**后面**的条目能改它：修 bug 型的 diff 必须先有个旧版本，
 * 否则 `git diff` 里只有新增、看不出「改了什么」。
 *
 * 跑手另外会给每个沙箱铺一个基准仓库：`git init` + 一个提交过的 `README.md` +
 * 一个裸的 `origin`。所以「已暂存的改动」需要 `stage: true` 显式声明 ——
 * **`files: []` 的含义是「什么都不动」，不是「不需要前置状态」**。
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { skillDirs, readTracked } = require("./lib/gitfiles");
const { Report } = require("./lib/report");
// 沙箱与作用面的实现只有一份，两个跑手共用 —— 见该文件的说明
const { makeSandbox, repoSurface, collectSurfaces } = require("./lib/sandbox");

const DEFAULT_ALLOWED = "Bash,Read,Write,Edit,Grep,Glob";

// ── 参数 ──────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = { skill: "", evals: null, keep: false, json: false, dryRun: false,
                timeout: 300, model: "", allowed: DEFAULT_ALLOWED, isolateHome: true,
                ablate: false, ablateRepeats: 1 };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i];
    const next = () => {
      const v = rest[i + 1];
      if (v === undefined || v.startsWith("--")) fatal(`${a} 需要参数`);
      i += 1;
      return v;
    };
    switch (a) {
      case "--skill": out.skill = next(); break;
      case "--eval": out.evals = next().split(",").map((s) => Number(s.trim())); break;
      case "--model": out.model = next(); break;
      case "--allowed": out.allowed = next(); break;
      case "--timeout": out.timeout = Number(next()); break;
      case "--keep": out.keep = true; break;
      case "--no-isolate-home": out.isolateHome = false; break;
      case "--ablate": out.ablate = true; break;
      case "--ablate-repeats": out.ablateRepeats = Number(next()); break;
      case "--json": out.json = true; break;
      case "--dry-run": out.dryRun = true; break;
      default: fatal(`不认识的参数：${a}`);
    }
  }
  return out;
}

function fatal(msg) {
  process.stderr.write(`✗ ${msg}\n`);
  process.exit(2);
}

const args = parseArgs(process.argv);
const report = new Report("技能评测");

if (!args.skill) {
  fatal("必须用 --skill <名字> 指定一个技能 —— 不做「一键全跑」，那是 22 次模型调用");
}
if (!Number.isFinite(args.timeout) || args.timeout <= 0) fatal("--timeout 必须是正数");
if (!Number.isInteger(args.ablateRepeats) || args.ablateRepeats < 1) {
  fatal("--ablate-repeats 必须是正整数");
}

// ── 定位技能与用例 ────────────────────────────────────────────────────────

const skill = skillDirs().find((s) => s.name === args.skill && s.tier === "self");
if (!skill) {
  fatal(`找不到自建技能「${args.skill}」（用 --skill <名字>；可用者见 docs/SKILLS.md）`);
}

const evalsRel = `${skill.dir}/evals/evals.json`;
const raw = readTracked(evalsRel);
if (raw === null) fatal(`${evalsRel} 不在工作区 —— 这个技能还没有评测用例`);

let suite;
try {
  suite = JSON.parse(raw);
} catch (err) {
  fatal(`${evalsRel} 不是合法 JSON：${err.message}`);
}

const picked = (suite.evals || []).filter(
  (e) => args.evals === null || args.evals.includes(e.id)
);
if (picked.length === 0) fatal(`没有匹配的用例（--eval ${args.evals}）`);

function runOne(item, withSkill = true) {
  const { box, baseHead } = makeSandbox({ skill, files: item.files, withSkill });

  const argvArgs = ["-p", item.prompt, "--output-format", "stream-json", "--verbose",
                    "--allowedTools", args.allowed];
  if (args.model) argvArgs.push("--model", args.model);

  const started = Date.now();
  const r = spawnSync("claude", argvArgs, {
    cwd: box,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: args.timeout * 1000,
    // HOME 也指向沙箱：**用例不该依赖运行者的机器状态**。不隔离的话，`~/.claude/skills`
    // 里你装的其他技能、`~/.claude/settings.json` 里的 hook、以及 `~/.claude.json` 都会
    // 渗进被测场景 —— 而「诊断类技能」会被自己的机器状态污染得更明显。
    // 认证不受影响（走环境变量）。顺带消掉一个真实副作用：CLI 本来会往你**真实的**
    // `~/.claude.json` 里写东西。
    env: args.isolateHome ? { ...process.env, HOME: box } : process.env,
  });

  // 结果面必须在删沙箱**之前**取
  const repoText = repoSurface(box, baseHead);

  // `--keep` 时把原始 transcript 一并留在沙箱里：判「是技能没写清还是模型没照做」
  // 只能靠它。用法例通过与否去反推原因，等于猜。
  if (args.keep) {
    fs.writeFileSync(path.join(box, "transcript.jsonl"), r.stdout || "", "utf8");
  } else {
    fs.rmSync(box, { recursive: true, force: true });
  }

  // 超时要在「调用失败」之前判：spawnSync 超时也是通过 error 报出来的，
  // 先判 error 会把「超时」说成「调用失败」，排错时指向完全错误的方向。
  if (r.error?.code === "ETIMEDOUT" || r.signal === "SIGTERM") {
    throw new Error(`超过 ${args.timeout} 秒未结束（用 --timeout 放宽）`);
  }
  if (r.error) throw new Error(`调用 claude 失败：${r.error.message}`);

  const surfaces = collectSurfaces(r.stdout || "", repoText);

  const results = (item.assertions || []).map((a) => {
    const target = a.target || "transcript";
    // 不认识的面必须报错，不能退化成空串：对 contains 是恒假，对 not_contains
    // 是**恒真** —— 后者会变成一次假通过，比失败更难发现。
    if (!(target in surfaces)) {
      return { ...a, target, error: `跑手不认识的面「${target}」`, ok: false };
    }
    const haystack = surfaces[target].join("\n");
    let hit;
    try {
      hit = new RegExp(a.value).test(haystack);
    } catch (err) {
      return { ...a, target, error: `不是合法正则：${err.message}`, ok: false };
    }
    return { ...a, target, hit, ok: a.type === "not_contains" ? !hit : hit };
  });

  return {
    id: item.id,
    name: item.name || "",
    elapsedMs: Date.now() - started,
    costUsd: surfaces.costUsd || 0,
    results,
    ok: results.length > 0 && results.every((r2) => r2.ok),
    empty: results.length === 0,
  };
}

// ── 主流程 ────────────────────────────────────────────────────────────────

if (!args.dryRun) {
  const probe = spawnSync("claude", ["--version"], { encoding: "utf8" });
  if (probe.error) {
    report.abort(
      "找不到 `claude` 命令 —— 这个跑手要调用 Claude Code。" +
        "它是维护者工具，不参与 CI（见文件头）。"
    );
  }
}

if (!args.json) {
  process.stdout.write(
    `\n▶ 技能评测：${skill.name}（${picked.length} 条用例）\n` +
      `  沙箱：每个用例一个一次性 git 仓库，跑完即删\n` +
      `  工具白名单：${args.allowed}\n` +
      (args.dryRun ? "" : `  提示：每条约 $0.24 / 40 秒，本轮约 $${(picked.length * 0.24).toFixed(2)}\n`) +
      "\n"
  );
}

if (args.dryRun) {
  for (const item of picked) {
    process.stdout.write(`  #${item.id}  ${item.name}\n`);
    process.stdout.write(`        prompt: ${item.prompt}\n`);
    process.stdout.write(
      `        前置状态: ${(item.files || []).length === 0 ? "（无，基准仓库原样）" : ""}\n`
    );
    for (const f of item.files || []) {
      process.stdout.write(
        `          - ${f.path}` +
          (f.link !== undefined ? `（软链 → ${f.link}）` : "") +
          (f.stage ? "（已暂存）" : "") +
          (f.executable ? "（可执行）" : "") +
          "\n"
      );
    }
    for (const a of item.assertions || []) {
      process.stdout.write(`        断言: ${a.type} [${a.target || "transcript"}] ${a.value}\n`);
    }
  }
  process.stdout.write("\n");
  process.exit(0);
}

/** 单条用例的结果**跑完就报**，不要攒到最后 —— 一轮几分钟，攒着等于全程黑箱。 */
function printOutcome(o) {
  if (args.json) return;
  const icon = o.ok ? "✓" : "✗";
  process.stdout.write(
    `  ${icon} #${o.id} ${o.name}` +
      (o.elapsedMs ? `（${(o.elapsedMs / 1000).toFixed(0)}s，$${(o.costUsd || 0).toFixed(3)}）` : "") +
      "\n"
  );
  for (const r2 of o.results) {
    if (r2.ok) continue;
    const why = r2.error
      ? r2.error
      : r2.hit
        ? `不该命中，但在「${r2.target}」里命中了`
        : `应当在「${r2.target}」里出现，但没找到`;
    process.stdout.write(`      ✗ ${r2.type} [${r2.target}] ${r2.value}\n          ${why}\n`);
  }
  if (o.empty) process.stdout.write("      ⚠ 这条用例没有断言，跑完也判不了对错\n");

  if (o.baselineRuns !== undefined) {
    const tally = `不装技能时 ${o.baselineRuns} 轮里过了 ${o.baselinePassed} 轮`;
    if (!o.ok) {
      // 装了都不（总是）过，就谈不上「技能有没有带来东西」—— 先修用例。
      // 把它说成「无区分度」会指向完全错误的方向（去改用例的断言，而问题在别处）。
      process.stdout.write(
        `      ⚠ 这一轮**用例本身没过**（${tally}）—— 区分度无从谈起，先看上面的失败原因\n`
      );
    } else {
      process.stdout.write(
        o.discriminating
          ? `      ○ 有区分度（${tally}）\n`
          : `      ⚠ **无区分度**（${tally}）—— 这条测的是模型本来就会做，不是技能带来了什么\n`
      );
    }
    if (!o.baselineStable) {
      process.stdout.write(
        "      ⚠ **基线不稳定**：同一条用例的基线结果会翻。单次观测不足以给这条用例" +
          "下「有没有区分度」的结论 —— 加 --ablate-repeats 多跑几轮再定\n"
      );
    }
  }
}

const outcomes = [];
for (const item of picked) {
  process.stdout.write(`  ⏳ #${item.id} ${item.name} …\n`);
  let o;
  try {
    o = runOne(item, true);

    // 消融基线：同一个用例，**不装技能**再跑一遍。
    // 只有「装了过、不装挂」才说明这条用例真的在测技能。
    if (args.ablate && o.results.length > 0) {
      // **基线要跑多轮。** 实测：同一条用例的基线结果**会翻**（#2 两轮「不装也过」、
      // 一轮「不装就挂」；#4 反之）。模型本身有随机性，单次基线不足以下结论 ——
      // 而「有区分度/无区分度」是个布尔值，用一次观测去填它就是在制造假确定性。
      const runs = [];
      for (let k = 0; k < args.ablateRepeats; k += 1) {
        process.stdout.write(
          `      ↳ 消融基线（不装技能）${args.ablateRepeats > 1 ? ` ${k + 1}/${args.ablateRepeats}` : ""}…\n`
        );
        const base = runOne(item, false);
        runs.push(base.ok);
        o.costUsd = (o.costUsd || 0) + (base.costUsd || 0);
      }
      o.baselineRuns = runs.length;
      o.baselinePassed = runs.filter(Boolean).length;
      // 只有「装了过」才谈得上区分度：装了都不过，说明用例或技能本身有问题
      o.discriminating = o.ok && o.baselinePassed < runs.length;
      o.baselineStable = o.baselinePassed === 0 || o.baselinePassed === runs.length;
    }
  } catch (err) {
    report.fail(`${skill.dir}/evals/evals.json`, 0, `用例 #${item.id} 未能执行：${err.message}`);
    o = { id: item.id, name: item.name, ok: false, error: err.message, results: [] };
  }
  outcomes.push(o);
  printOutcome(o);
}

// ── 输出 ──────────────────────────────────────────────────────────────────

if (args.json) {
  process.stdout.write(`${JSON.stringify({ skill: skill.name, outcomes }, null, 2)}\n`);
} else {
  process.stdout.write("\n");
}

const passed = outcomes.filter((o) => o.ok).length;

// 消融结果**只报不判红**：无区分度说明「这条用例写得不够具体」，是待改进项，
// 而不是技能坏了。把它设成失败会让这个工具长期红着 —— 那正是「训练人忽略输出」。
if (args.ablate && !args.json) {
  const probed = outcomes.filter((o) => o.baselineRuns !== undefined);
  const good = probed.filter((o) => o.discriminating).length;
  const noSkill = probed.filter((o) => o.ok && !o.discriminating).length;
  const evalFailed = probed.filter((o) => !o.ok).length;
  const unstable = probed.filter((o) => !o.baselineStable).length;
  const parts = [`${probed.length} 条里 **${good} 条有区分度**（装了过、不装挂）`];
  if (noSkill > 0) parts.push(`${noSkill} 条**不装技能也能过**（没在测技能）`);
  if (evalFailed > 0) parts.push(`${evalFailed} 条**用例本身没过**（先修用例）`);
  report.info(`消融基线：${parts.join("；")}。`);
  if (unstable > 0) {
    report.info(
      `⚠ ${unstable} 条的**基线结果会翻** —— 单次观测不足以给它们下结论，` +
        "加 --ablate-repeats 多跑几轮再写进数据。"
    );
  }
}
const spent = outcomes.reduce((a, o) => a + (o.costUsd || 0), 0);
report.info(
  `通过 ${passed}/${outcomes.length} 条用例，实际花费 $${spent.toFixed(3)}` +
    `（预估 $${(outcomes.length * 0.24).toFixed(2)}）。`
);

if (passed < outcomes.length) {
  report.fail(
    `${skill.dir}/evals/evals.json`,
    0,
    `${outcomes.length - passed} 条用例未通过 —— 「它能干活」这条声明目前**不成立**`
  );
}

report.finish();
