#!/usr/bin/env node
"use strict";

/**
 * 脚本语法检查：JS / Shell / Python 的**语法**，以及入口脚本的可执行位。
 *
 * 一个检查器跑三类语言，而不是每种各开一个 CI job —— 它们都是亚秒级的纯粹
 * 语法解析，拆开只会多几次 runner 启动。
 *
 * ## 两个刻意的选择
 *
 * - **Shell 方言从 shebang 推断**，`sh` 与 `bash` 分开。本仓库的 `.sh` 里两者都有
 *   （自建的是 bash，上游带进来几个 `#!/bin/sh`）；一律按 bash 检查会漏掉 sh 特有的
 *   问题。显式传 `-s <方言>` 而不是让 shellcheck 自己猜 —— 猜错时是静默的。
 *
 *   这里刻意不写具体数目：注释里的硬编码计数会随仓库演进而腐烂，而读者无从判断
 *   它是什么时候的数字。要一个准确的当下数字，跑 `./scripts/lint.sh --only scripts`。
 * - **Python 用 `ast.parse` 而不是 `py_compile`**：后者会写 `__pycache__/`，
 *   而一个只读的校验器不该在工作区里产生任何文件（在 CI 里更是垃圾）。
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { Report } = require("../lib/report");
const { REPO_ROOT, trackedFiles, tierOf } = require("../lib/gitfiles");

const report = new Report("脚本语法检查");

const files = trackedFiles();

const jsFiles = files.filter((p) => p.endsWith(".js") || p.endsWith(".mjs"));
const shFiles = files.filter((p) => p.endsWith(".sh"));
const pyFiles = files.filter((p) => p.endsWith(".py"));

if (jsFiles.length + shFiles.length + pyFiles.length === 0) {
  report.abort("git 索引里没有任何 .js / .sh / .py 文件。");
}

function run(cmd, args) {
  try {
    execFileSync(cmd, args, { cwd: REPO_ROOT, stdio: ["ignore", "pipe", "pipe"] });
    return { ok: true, output: "" };
  } catch (err) {
    const out = `${err.stdout || ""}${err.stderr || ""}`.toString().trim();
    return { ok: false, output: out };
  }
}

/** 按 shebang 判断 shell 方言。 */
function shellDialect(absPath) {
  let firstLine = "";
  try {
    firstLine = fs.readFileSync(absPath, "utf8").split("\n")[0];
  } catch {
    return "bash";
  }
  if (/^#!.*\bsh\b(?!.*bash)/.test(firstLine)) return "sh";
  return "bash";
}

let checked = 0;

// --- JavaScript -------------------------------------------------------------
for (const rel of jsFiles) {
  checked += 1;
  const res = run("node", ["--check", path.join(REPO_ROOT, rel)]);
  if (!res.ok) report.at(tierOf(rel), rel, 0, `node --check 失败：${res.output}`);
}

// --- Shell ------------------------------------------------------------------
for (const rel of shFiles) {
  checked += 1;
  const abs = path.join(REPO_ROOT, rel);
  const dialect = shellDialect(abs);
  const res = run(dialect, ["-n", abs]);
  if (!res.ok) {
    report.at(tierOf(rel), rel, 0, `${dialect} -n 失败：${res.output}`);
  }
}

// --- Python -----------------------------------------------------------------
// python3 缺失时跳过这一族，而不是把整个检查器判失败。
let pythonAvailable = true;
try {
  execFileSync("python3", ["--version"], { stdio: ["ignore", "ignore", "ignore"] });
} catch {
  pythonAvailable = false;
}

if (!pythonAvailable) {
  report.info("未找到 python3，已跳过 Python 语法检查。");
} else {
  const astScript =
    'import ast,sys; ast.parse(open(sys.argv[1],encoding="utf-8").read(), sys.argv[1])';
  for (const rel of pyFiles) {
    checked += 1;
    const res = run("python3", ["-c", astScript, path.join(REPO_ROOT, rel)]);
    if (!res.ok) report.at(tierOf(rel), rel, 0, `Python 语法错误：${res.output}`);
  }
}

// --- 可执行位 ----------------------------------------------------------------
// 入口脚本必须可执行，否则 ./scripts/lint.sh 这类调用会以「权限不足」失败。
let modeOutput = "";
try {
  modeOutput = execFileSync("git", ["ls-files", "-s"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
} catch {
  report.info("无法读取 git 索引的文件模式，已跳过可执行位检查。");
}

if (modeOutput) {
  for (const line of modeOutput.split("\n")) {
    if (line === "") continue;
    const m = /^(\d{6})\s+\S+\s+\d+\t(.+)$/.exec(line);
    if (!m) continue;
    const [, mode, rel] = m;
    if (!/^scripts\/[^/]+\.(sh|js)$/.test(rel)) continue;
    if (mode !== "100755") {
      report.fail(rel, 0, `入口脚本应为可执行（当前模式 ${mode}）——运行 chmod +x ${rel}`);
    }
  }
}

report.info(
  `检查了 ${checked} 个脚本（JS ${jsFiles.length}、Shell ${shFiles.length}、Python ${pyFiles.length}）。`
);

report.finish();
