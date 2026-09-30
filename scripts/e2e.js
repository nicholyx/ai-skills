#!/usr/bin/env node
"use strict";

/**
 * 端到端验证 —— 在**干净副本**里，把使用者与贡献者真正会敲的命令全跑一遍。
 *
 * 用法：
 *   node scripts/e2e.js              # 全跑
 *   node scripts/e2e.js --offline    # 跳过需要网络的环节
 *
 * ## 它比 lint 多验了什么
 *
 * `./scripts/lint.sh` 是在**当前工作区**里跑静态检查。它能发现格式问题，但发现不了
 * 这三类：
 *
 * | 问题 | 为什么 lint 看不见 |
 * | --- | --- |
 * | **依赖了本机状态** | 你的工作区里有本地文件、有未提交改动、有缓存 —— lint 照常绿，别人克隆下来却红 |
 * | **生成物与源头不一致** | `docs/SKILLS.md` 是生成物；lint 只断言「已提交的那份与源头一致」，不验「重新生成之后还是它」 |
 * | **脚手架与流程脱节** | 新技能脚手架跑出来的东西能不能过检查、能不能进目录，只有真跑一遍才知道 |
 *
 * 所以这个脚本把仓库复制到临时目录、**自成 git 仓库**（检查器以 git 索引为目标集，
 * 没有 `.git` 的副本会让每个检查器直接 exit 2 —— 那样测的是「没有 .git」而不是被测的东西），
 * 然后在里面跑真实命令。
 *
 * ## 为什么不跑评测跑手
 *
 * `run-evals.js` 要调模型（约 $0.24/条）。这里只验它的**接线**（`--dry-run`），
 * 不花钱。
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const { Report } = require("./lib/report");
const { REPO_ROOT, skillDirs } = require("./lib/gitfiles");

const offline = process.argv.includes("--offline");
const report = new Report("端到端验证");

const selfCount = skillDirs().filter((s) => s.tier === "self").length;

// ── 干净副本 ──────────────────────────────────────────────────────────────

const box = fs.mkdtempSync(path.join(os.tmpdir(), "ai-skills-e2e-"));
const keep = process.argv.includes("--keep");

function run(argvArgs, { allowFail = false, cwd = box } = {}) {
  const r = spawnSync(argvArgs[0], argvArgs.slice(1), {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 600000,
  });
  const out = `${r.stdout || ""}${r.stderr || ""}`;
  if (r.status !== 0 && !allowFail) {
    throw new Error(`\`${argvArgs.join(" ")}\` 退出码 ${r.status}\n${out.slice(-1500)}`);
  }
  return { status: r.status, out };
}

try {
  // 用 git archive 复制「已提交的内容」：这正是别人克隆会拿到的东西。
  // 直接 cp 会把工作区的本地残留也带进去，那就不叫干净副本了。
  const tar = execFileSync("git", ["archive", "HEAD"], { cwd: REPO_ROOT, maxBuffer: 64 * 1024 * 1024 });
  execFileSync("tar", ["-x", "-C", box], { input: tar, maxBuffer: 64 * 1024 * 1024 });
  run(["git", "init", "-q"]);
  run(["git", "config", "user.email", "e2e@example.invalid"]);
  run(["git", "config", "user.name", "e2e"]);
  run(["git", "add", "-A"]);
  run(["git", "commit", "-qm", "e2e 基线"]);

  const fileCount = execFileSync("git", ["ls-files"], { cwd: box, encoding: "utf8" })
    .split("\n")
    .filter(Boolean).length;
  report.info(`干净副本：HEAD 的 ${fileCount} 个文件，自成 git 仓库。`);

  // ── 环节 1：全部静态检查在干净副本里也得绿 ──────────────────────────────
  // 这一步验的是「不依赖本机状态」。本地绿而这里红，说明有东西没跟着提交。

  // **必须 `--skip e2e`**：这个脚本自己也是 lint.sh 的一个检查项，不跳过就会
  // 「lint 跑 e2e → e2e 在副本里跑 lint → 又跑 e2e」无限递归下去。
  const lint = run(["./scripts/lint.sh", "--skip", "e2e"]);
  const green = /通过 (\d+) · 失败 (\d+) · 跳过 (\d+)/.exec(lint.out);
  if (!green || green[2] !== "0") {
    report.fail("scripts/lint.sh", 0, `干净副本里 lint 没全绿：\n${lint.out.slice(-1200)}`);
  } else {
    report.info(
      `环节 1 ✓ 干净副本里 ${green[1]} 项静态检查全绿（跳过 e2e 自己，否则无限递归）。`
    );
  }

  // ── 环节 2：生成物确实由源头生成 ────────────────────────────────────────
  // lint 里的 catalogue 检查断言「已提交的 docs/SKILLS.md 与源头一致」；
  // 这里再验一次「重新生成之后还是它」—— 两者都过才说明生成器是确定的。

  run(["node", "scripts/gen-catalogue.js", "--write"]);
  const diff = run(["git", "diff", "--exit-code", "--stat"], { allowFail: true });
  if (diff.status !== 0) {
    report.fail("docs/SKILLS.md", 0, `重新生成后与已提交的不一致：\n${diff.out.slice(0, 600)}`);
  } else {
    report.info("环节 2 ✓ 重新生成目录后与已提交的内容逐字节一致（生成器是确定的）。");
  }

  // ── 环节 3：脚手架跑出来的技能，能不能过检查、能不能进目录 ───────────────
  // 这是「新技能上手路径」的回归测试：脚手架、frontmatter 契约、自洽校验、
  // 目录生成器、文档计数 —— 五者必须仍然对得上。

  run(["node", "scripts/new-skill.js", "e2e-probe", "--tagline", "端到端探针",
       "--example", "帮我跑一下端到端探针"]);
  run(["node", "scripts/gen-catalogue.js", "--write"]);
  // 新增技能会让文档里的技能数过期 —— 这正是脚手架第 4 步要做的。
  // 少了这一步，新贡献者会撞上一个跟自己技能毫无关系的失败（这条是本脚本抓出来的）。
  run(["node", "scripts/checks/doc-counts.js", "--fix"]);
  run(["git", "add", "-A"]);

  const probeLint = run(["./scripts/lint.sh", "--skip", "e2e"], { allowFail: true });
  // 脚手架留的占位符会被 skill-integrity 拦下 —— 那正是它该做的。
  // 所以这里只要求「**恰好一条**失败，且它说的是占位符」：其余检查都得认这个骨架。
  //
  // 用 lint 自己的计数器判，不要数 `✗` 开头的行 —— 汇总行（`✗ 失败`、
  // `✗ 未通过：N 处失败`）也会匹配，那样会把 1 条失败数成 2 条。
  const counter = /通过 (\d+) · 失败 (\d+) · 跳过 (\d+)/.exec(probeLint.out);
  const alsoSaysPlaceholder = probeLint.out
    .split("\n")
    .some((l) => /^\s+✗ /.test(l) && l.includes("占位符"));
  if (!counter || counter[2] !== "1" || !alsoSaysPlaceholder) {
    report.fail(
      "scripts/new-skill.js",
      0,
      "新建的技能应当**只**被「占位符未补」这一条拦住（那说明其余检查都认这个骨架），" +
        `实际计数：${counter ? counter[0] : "（读不到）"}\n` +
        probeLint.out.split("\n").filter((l) => /^\s+✗ /.test(l)).join("\n").slice(0, 900)
    );
  } else {
    report.info("环节 3 ✓ 骨架能过其余检查，只被「占位符未补」拦下（符合预期）。");
  }

  // 补完描述后应当完全绿 —— 验证「补一步就能用」这条上手路径真的成立
  const probeSkill = path.join(box, "custom/daily/e2e-probe/SKILL.md");
  fs.writeFileSync(
    probeSkill,
    fs.readFileSync(probeSkill, "utf8").replace(/description: .*/, (m) =>
      m.replace(/【待补】[^。]*。?/, "端到端探针，只用于验证脚手架路径。当用户说「帮我跑一下端到端探针」时使用。")
    )
  );
  run(["git", "add", "-A"]);
  const afterFix = run(["./scripts/lint.sh", "--skip", "e2e"], { allowFail: true });
  if (afterFix.status !== 0) {
    report.fail("scripts/new-skill.js", 0, `补完描述后仍不绿：\n${afterFix.out.slice(-1200)}`);
  } else {
    report.info("环节 3b ✓ 补上 description 之后全绿 —— 「脚手架 → 补一句 → 可用」这条路径成立。");
  }

  // ── 环节 4：提交信息校验（贡献者提交前会撞到的那道门）────────────────────

  const good = run(["./scripts/check-commit-msg.sh", "--message", "feat(custom): 新增端到端探针"], { allowFail: true });
  const bad = run(["./scripts/check-commit-msg.sh", "--message", "随便写的标题"], { allowFail: true });
  if (good.status !== 0) {
    report.fail("scripts/check-commit-msg.sh", 0, "合法的约定式提交信息被拒了");
  } else if (bad.status === 0) {
    report.fail("scripts/check-commit-msg.sh", 0, "不合法提交信息**没有**被拒 —— 这道门形同虚设");
  } else {
    report.info("环节 4 ✓ 提交信息校验：合法的放行、不合法的拦下（两个方向都验了）。");
  }

  // ── 环节 5：评测跑手的接线通不通（不花钱）────────────────────────────────

  const dry = run(["node", "scripts/run-evals.js", "--skill", "git-commit", "--dry-run"], { allowFail: true });
  if (dry.status !== 0 || !/断言:/.test(dry.out)) {
    report.fail("scripts/run-evals.js", 0, `--dry-run 没跑通：\n${dry.out.slice(-800)}`);
  } else {
    report.info("环节 5 ✓ 评测跑手接线正常（--dry-run，不调模型）。");
  }

  // ── 环节 6：分发面 —— 别人 `npx skills add` 到底装到几个技能 ──────────────
  // 需要网络（要 clone 仓库）。离线时跳过并**如实说明**，不假装验过。

  if (offline) {
    report.info("环节 6 跳过（--offline）：分发面要 clone 远端仓库。");
  } else {
    const listed = run(["npx", "-y", "skills", "add", "nicholyx/ai-skills", "--list"],
                       { allowFail: true, cwd: os.tmpdir() });
    const found = /Found (\d+) skills/.exec(listed.out);
    if (!found) {
      report.info(
        "环节 6 跳过：`npx skills add --list` 没给出结果（多半是网络）。" +
          "**这不算通过** —— 需要时重跑。"
      );
    } else if (Number(found[1]) !== selfCount) {
      report.fail(
        "分发面",
        0,
        `\`npx skills add\` 报 ${found[1]} 个技能，仓库里有 ${selfCount} 个自建技能`
      );
    } else {
      report.info(`环节 6 ✓ 分发面正确：\`npx skills add\` 报 ${found[1]} 个，与仓库自建的 ${selfCount} 个一致。`);
    }
  }
} catch (err) {
  report.fail("e2e", 0, err.message);
} finally {
  if (keep) {
    report.info(`沙箱保留在：${box}`);
  } else {
    fs.rmSync(box, { recursive: true, force: true });
  }
}

report.finish();
