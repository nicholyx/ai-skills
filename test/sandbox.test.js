#!/usr/bin/env node
"use strict";

/**
 * `scripts/lib/sandbox.js` 的单元测试。
 *
 * 分两块：
 *
 * - `collectSurfaces` 是纯函数（解析 `claude --output-format stream-json` 的输出），
 *   直接喂字符串断言。
 * - `makeSandbox` / `repoSurface` / `git` 会**真的动 git**，所以都在
 *   `os.tmpdir()` 里造临时仓库，测完删掉；仓库本身只读（技能目录是复制进去的）。
 *
 * `makeSandbox` 的入参校验会抛在临时目录建好之后，那时拿不到路径 —— 那两条用例
 * 用可预测的 prefix 造沙箱，再按前缀把抛错前建出来的目录收掉。
 *
 * 运行：node --test "test/*.test.js"（在仓库根执行）
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const { git, makeSandbox, repoSurface, collectSurfaces, baselineHits, BASE_README } = require("../scripts/lib/sandbox");

/** 造一个基准仓库：一次提交，返回 {box, baseHead}。 */
function tmpRepo() {
  const box = fs.mkdtempSync(path.join(os.tmpdir(), "au-sandbox-test-"));
  runGit(box, ["init", "-q"]);
  runGit(box, ["config", "user.email", "test@example.invalid"]);
  runGit(box, ["config", "user.name", "test"]);
  fs.writeFileSync(path.join(box, "README.md"), "# 测试仓库\n", "utf8");
  runGit(box, ["add", "README.md"]);
  runGit(box, ["commit", "-qm", "初始提交"]);
  const baseHead = runGit(box, ["rev-parse", "HEAD"]).trim();
  return { box, baseHead };
}

/**
 * 跑一条必须成功的 git 命令。
 *
 * 与 `lib/sandbox.js` 的 `git()` 一样带 `-c core.quotepath=false`：不带的话，
 * 非 ASCII 文件名在 Linux 上被输出成八进制转义、macOS 上不会 —— 同一份测试两个平台
 * 两种结果（真实踩过：本地绿、CI 红）。
 */
function runGit(cwd, args) {
  const r = spawnSync("git", ["-c", "core.quotepath=false", ...args], { cwd, encoding: "utf8" });
  assert.equal(r.status, 0, `git ${args.join(" ")} 失败：${r.stderr}`);
  return r.stdout;
}

/** 把 tmpRepo 造出来的目录删掉。 */
function cleanup(box) {
  fs.rmSync(box, { recursive: true, force: true });
}

/** 一份用于 makeSandbox 的真实技能（它带 evals/，正好验证过滤）。 */
const SKILL = { name: "git-commit", dir: "custom/daily/git-commit" };

// ── collectSurfaces ───────────────────────────────────────────────────────

/** 一段典型的 stream-json：非 JSON 行、非 assistant 事件、两次 result 花费。 */
const STREAM = [
  "不认识的横幅行",
  "  " + JSON.stringify({ type: "system", subtype: "init" }),
  JSON.stringify({
    type: "assistant",
    message: {
      content: [
        { type: "text", text: "我来看一下当前状态" },
        { type: "tool_use", name: "Bash", input: { command: "git status" } },
      ],
    },
  }),
  "{ 这不是合法 JSON",
  JSON.stringify({ type: "assistant", message: { content: [{ type: "tool_use", name: "Bash", input: {} }] } }),
  JSON.stringify({ type: "result", total_cost_usd: 0.01 }),
  JSON.stringify({ type: "result", total_cost_usd: 0.02 }),
  JSON.stringify({ type: "result" }),
  "",
].join("\n");

test("collectSurfaces：抽出模型输出与工具调用（工具名 + 入参 JSON）", () => {
  const s = collectSurfaces(STREAM);

  assert.deepEqual(s.output, ["我来看一下当前状态"]);
  assert.deepEqual(s.tools, ['Bash {"command":"git status"}', "Bash {}"]);
});

test("collectSurfaces：transcript 是「工具调用 + 模型输出」，顺序固定", () => {
  const s = collectSurfaces(STREAM);

  assert.deepEqual(s.transcript, [...s.tools, ...s.output]);
  assert.equal(s.transcript.length, 3);
});

test("collectSurfaces：累加 result 事件里报出的真实花费；没有则不带这个字段", () => {
  const s = collectSurfaces(STREAM);

  assert.equal(Math.round(s.costUsd * 100), 3, "0.01 + 0.02 应累加为 0.03");
  assert.ok(!("costUsd" in collectSurfaces('{"type":"assistant"}')), "没有 result 事件时不该凭空有个 0");
});

test("collectSurfaces：repo 面默认是「(未采集)」，可传入", () => {
  assert.deepEqual(collectSurfaces("").repo, ["(未采集)"]);
  assert.deepEqual(collectSurfaces("", "commits: 1").repo, ["commits: 1"]);
});

test("collectSurfaces：非 JSON、非 assistant、缺 content 的行都不炸也不产出", () => {
  const s = collectSurfaces(
    [
      "随便一行",
      '{"type":"assistant"}',
      '{"type":"assistant","message":{"content":[{"type":"thinking","thinking":"x"}]}}',
      '{"type":"assistant","message":{"content":[{"type":"text","text":123}]}}',
      '{"type":"user","message":{"content":[{"type":"text","text":"用户说的话"}]}}',
      '{"type":"result","total_cost_usd":"0.5"}',
      "42",
      '{"type":"assistant","message":{"content":[{"type":"text","text":"唯一的输出"}]}}',
    ].join("\n")
  );

  assert.deepEqual(s.output, ["唯一的输出"], "只有 assistant 的字符串 text 才算输出");
  assert.deepEqual(s.tools, []);
  assert.ok(!("costUsd" in s), "花费不是数字时不参与累加");
});

// ── git / repoSurface ─────────────────────────────────────────────────────

test("git()：成功返回 stdout，失败抛出并带上 git 的报错", () => {
  const { box, baseHead } = tmpRepo();
  try {
    assert.equal(git(box, ["rev-parse", "HEAD"]).trim(), baseHead);
    assert.throws(() => git(box, ["rev-parse", "no-such-ref"]), /git rev-parse no-such-ref 失败：/);
  } finally {
    cleanup(box);
  }
});

test("repoSurface：基准状态下六个面都是空的", () => {
  const { box, baseHead } = tmpRepo();
  try {
    assert.equal(
      repoSurface(box, baseHead),
      [
        "commits: 1",
        "new-commits: 0",
        "staged: (空)",
        "committed-files: (空)",
        "untracked: (空)",
        "pushed: no",
      ].join("\n")
    );
  } finally {
    cleanup(box);
  }
});

test("repoSurface：暂存、未追踪、新提交分别落到各自的面", () => {
  const { box, baseHead } = tmpRepo();
  try {
    fs.mkdirSync(path.join(box, "src"), { recursive: true });
    fs.writeFileSync(path.join(box, "src", "a.js"), "a\n", "utf8");
    runGit(box, ["add", "--", "src/a.js"]);

    let s = repoSurface(box, baseHead);
    assert.ok(s.includes("staged: src/a.js"), s);
    assert.ok(s.includes("new-commits: 0"), s);
    assert.ok(s.includes("untracked: (空)"), "已暂存的文件不算未追踪");

    fs.writeFileSync(path.join(box, "b.txt"), "b\n", "utf8");
    runGit(box, ["commit", "-qm", "加一个文件"]);

    s = repoSurface(box, baseHead);
    assert.ok(s.includes("commits: 2"), s);
    assert.ok(s.includes("new-commits: 1"), s);
    assert.ok(s.includes("staged: (空)"), s);
    assert.ok(s.includes("committed-files: src/a.js"), s);
    assert.ok(s.includes("untracked: b.txt"), s);
  } finally {
    cleanup(box);
  }
});

test("repoSurface：多个文件用空格连成一行", () => {
  const { box, baseHead } = tmpRepo();
  try {
    for (const name of ["a.txt", "c.txt"]) {
      fs.writeFileSync(path.join(box, name), "x\n", "utf8");
      runGit(box, ["add", "--", name]);
    }
    runGit(box, ["commit", "-qm", "两个文件"]);

    assert.ok(repoSurface(box, baseHead).includes("committed-files: a.txt c.txt"));
  } finally {
    cleanup(box);
  }
});

test("repoSurface：pushed 由裸 origin 里有没有 ref 决定", () => {
  const { box, baseHead } = tmpRepo();
  try {
    const origin = path.join(box, ".origin.git");
    spawnSync("git", ["init", "-q", "--bare", origin], { encoding: "utf8" });
    runGit(box, ["remote", "add", "origin", origin]);

    assert.ok(repoSurface(box, baseHead).includes("pushed: no"), "铺了 origin 但没推过");

    runGit(box, ["push", "-q", "origin", "HEAD"]);
    assert.ok(repoSurface(box, baseHead).includes("pushed: yes"), "推过之后应为 yes");
  } finally {
    cleanup(box);
  }
});

test("repoSurface：origin 存在但不可达时如实标注", () => {
  const { box, baseHead } = tmpRepo();
  try {
    // 目录在，但它不是仓库、也没配 remote —— ls-remote 会失败
    fs.mkdirSync(path.join(box, ".origin.git"));

    assert.ok(repoSurface(box, baseHead).includes("pushed: (origin 不可达)"));
  } finally {
    cleanup(box);
  }
});

// ── makeSandbox ───────────────────────────────────────────────────────────

test("makeSandbox：铺出基准仓库、技能本体与裸 origin，且 git 视角是干净的", () => {
  const { box, baseHead } = makeSandbox({ skill: SKILL });
  try {
    assert.match(path.basename(box), /^skill-eval-git-commit-/);
    assert.match(baseHead, /^[0-9a-f]{40}$/);
    assert.equal(fs.readFileSync(path.join(box, "README.md"), "utf8"), BASE_README);
    assert.equal(runGit(box, ["log", "--oneline"]).trim().split("\n").length, 1);

    // 技能装在 Claude Code 会发现的位置，但 evals/ 不进去（模型不该看到判分标准）
    assert.ok(fs.existsSync(path.join(box, ".claude", "skills", "git-commit", "SKILL.md")));
    assert.ok(!fs.existsSync(path.join(box, ".claude", "skills", "git-commit", "evals")));

    // 裸 origin
    assert.ok(fs.existsSync(path.join(box, ".origin.git")));
    assert.ok(runGit(box, ["remote", "get-url", "origin"]).trim().length > 0);

    // 跑手自己铺的都挡在 git 之外：于是「基准状态」就是空的面
    const exclude = fs.readFileSync(path.join(box, ".git", "info", "exclude"), "utf8");
    assert.ok(exclude.includes("/.claude/"));
    assert.ok(exclude.includes("/.origin.git/"));
    assert.equal(repoSurface(box, baseHead).split("\n").slice(2).join("\n"), "staged: (空)\ncommitted-files: (空)\nuntracked: (空)\npushed: no");

    // HOME 隔离的**副产物**不在上面那批里：`claude` 会把配置写到 `$HOME/.claude.json`，
    // 而沙箱里 HOME 就是沙箱根（实测：把 HOME 指到一个空目录跑一次 `claude -p`，
    // 那里会多出 `~/.claude/` 与 `~/.claude.json`）。漏掉它就会以
    // `untracked: .claude.json` 出现在结果面上 —— 实测模型为此**真的**开始讨论
    // 要不要把它提交进去，而那与用例要测的东西毫无关系。
    // 这里直接写出那个文件来模拟副作用（不必真调一次模型），再确认它对结果面不可见。
    fs.writeFileSync(path.join(box, ".claude.json"), "{}\n", "utf8");
    assert.ok(exclude.includes("/.claude.json"), "exclude 里必须有这一条");
    assert.ok(
      repoSurface(box, baseHead).includes("untracked: (空)"),
      "CLI 写出的 .claude.json 不该出现在 untracked 面上"
    );
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：withSkill=false 是消融基线（技能不装进沙箱）", () => {
  const { box } = makeSandbox({ skill: SKILL, withSkill: false });
  try {
    assert.ok(!fs.existsSync(path.join(box, ".claude")));
    assert.ok(fs.existsSync(path.join(box, "README.md")), "基准仓库照常");
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：withOrigin=false 时不铺 origin", () => {
  const { box } = makeSandbox({ skill: SKILL, withOrigin: false });
  try {
    assert.ok(!fs.existsSync(path.join(box, ".origin.git")));
    const remotes = spawnSync("git", ["remote"], { cwd: box, encoding: "utf8" }).stdout.trim();
    assert.equal(remotes, "");
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：prefix 只影响临时目录名", () => {
  const { box } = makeSandbox({ skill: SKILL, prefix: "自定义前缀" });
  try {
    assert.match(path.basename(box), /^自定义前缀-git-commit-/);
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：前置状态可以提交、可以只暂存、可以只写在工作区", () => {
  const { box, baseHead } = makeSandbox({
    skill: SKILL,
    files: [
      { path: "已提交.txt", content: "一\n", commit: true },
      { path: "已暂存.txt", content: "二\n", stage: true },
      { path: "未跟踪.txt", content: "三\n" },
    ],
  });
  try {
    // baseHead 是**铺完前置状态之后**的 HEAD，所以此刻的「新增提交」是 0
    assert.equal(runGit(box, ["rev-list", "--count", `${baseHead}..HEAD`]).trim(), "0");
    assert.equal(runGit(box, ["log", "--oneline"]).trim().split("\n").length, 2, "初始提交 + 前置状态");
    assert.equal(
      runGit(box, ["show", "--name-only", "--format=", "HEAD"]).trim(),
      "已提交.txt",
      "只有标了 commit 的才进提交"
    );
    assert.equal(runGit(box, ["diff", "--cached", "--name-only"]).trim(), "已暂存.txt");
    assert.ok(
      runGit(box, ["status", "--porcelain", "--", "未跟踪.txt"]).startsWith("??"),
      "没标 commit/stage 的留在工作区"
    );

    const s = repoSurface(box, baseHead);
    assert.ok(s.includes("commits: 2"), s);
    assert.ok(s.includes("new-commits: 0"), s);
    assert.ok(s.includes("committed-files: (空)"), s);
    assert.ok(s.includes("staged: 已暂存.txt"), s);
    assert.ok(s.includes("untracked: 未跟踪.txt"), s);
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：executable 会带上可执行位", () => {
  const { box } = makeSandbox({
    skill: SKILL,
    files: [{ path: "run.sh", content: "#!/bin/sh\necho hi\n", executable: true }],
  });
  try {
    assert.equal(fs.statSync(path.join(box, "run.sh")).mode & 0o111, 0o111);
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：link 可以造出**断链**（目标不存在正是它的意义）", () => {
  const { box } = makeSandbox({
    skill: SKILL,
    files: [{ path: "dir/断链.conf", link: "不存在的目标" }],
  });
  try {
    const abs = path.join(box, "dir", "断链.conf");
    assert.ok(fs.lstatSync(abs).isSymbolicLink());
    assert.equal(fs.readlinkSync(abs), "不存在的目标");
    assert.ok(!fs.existsSync(abs), "断链：existsSync 应为 false");
  } finally {
    cleanup(box);
  }
});

test("makeSandbox：files 的入参校验（缺 path / 既没有 content 也没有 link）", () => {
  // 校验发生在临时目录建好之后，抛错时拿不到路径 —— 用可预测的 prefix 认领残留
  const prefix = `au-invalid-${process.pid}`;
  try {
    assert.throws(() => makeSandbox({ skill: SKILL, files: [{}], prefix }), /files 里的每一项必须有 path/);
    assert.throws(
      () => makeSandbox({ skill: SKILL, files: [{ path: "x.txt" }], prefix }),
      /files 项 x\.txt 既没有 content 也没有 link/
    );
  } finally {
    for (const dir of fs.readdirSync(os.tmpdir())) {
      if (dir.startsWith(`${prefix}-`)) {
        fs.rmSync(path.join(os.tmpdir(), dir), { recursive: true, force: true });
      }
    }
  }
});

// ── baselineHits ──────────────────────────────────────────────────────────

/** 造一条断言结果，字段与 `runOne` 产出的保持一致。 */
function hit(type, value, ok, target = "transcript") {
  return { type, target, value, ok };
}

test("baselineHits：只留下「至少过了一轮」的断言", () => {
  const hits = baselineHits([[hit("contains", "A", false), hit("contains", "B", true)]]);

  assert.deepEqual(hits, [{ key: "contains [transcript] B", passed: 1, total: 1 }]);
});

test("baselineHits：多轮时按轮计数 —— passed/total 把「基线会翻」如实带出来", () => {
  const hits = baselineHits([
    [hit("contains", "翻", true)],
    [hit("contains", "翻", false)],
    [hit("contains", "翻", true)],
  ]);

  assert.deepEqual(hits, [{ key: "contains [transcript] 翻", passed: 2, total: 3 }]);
});

test("baselineHits：全挂的断言不出现（列出来只会淹没信号）", () => {
  const hits = baselineHits([[hit("contains", "恒挂", false)], [hit("contains", "恒挂", false)]]);

  assert.deepEqual(hits, []);
});

test("baselineHits：断言按首次出现顺序，键带上 type 与 target", () => {
  const hits = baselineHits([
    [hit("not_contains", "x", true, "repo"), hit("contains", "y", true, "repo")],
    [hit("contains", "y", true, "repo")],
  ]);

  assert.deepEqual(hits.map((h) => h.key), [
    "not_contains [repo] x",
    "contains [repo] y",
  ]);
});

test("baselineHits：没有跑过基线（undefined / 空数组）时返回空，不炸", () => {
  assert.deepEqual(baselineHits(undefined), []);
  assert.deepEqual(baselineHits([]), []);
  assert.deepEqual(baselineHits([[]]), []);
});
