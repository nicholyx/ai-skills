#!/usr/bin/env node
"use strict";

/**
 * `scripts/run-evals.js --json` 的输出契约：**stdout 上只有那一份 JSON**。
 *
 * ## 为什么这条断言值得单独一个文件
 *
 * 这个旗标原先只把**结果**写成 JSON，进度行（`⏳ #1 …`）与 `report.info` 的汇总仍然
 * 打在 stdout 上。后果是 `JSON.parse(stdout)` 直接抛 `Unexpected token '⏳'` —— 想读那份
 * 结果只能靠 `raw_decode` 之类的手法把中间那段抠出来，**机器可读输出实际不可直接读**。
 * 没有任何检查会红：跑手跑得完、JSON 也在里面，只是被包住了。
 *
 * ## 为什么可以不花钱地测
 *
 * 要触发这个污染，必须跑到「用例执行 + 汇总打印」那一段，而真跑要调模型
 * （实测约 $0.24/条）。所以这里往 PATH 最前面放**一个假 `claude`**：它只输出一段固定的
 * stream-json。断言的落点是**输出通道的分工**，不是模型干得对不对 —— 用例断言本身全挂
 * 也无所谓（那正是 `report.finish()` 会打印汇总、最容易污染 stdout 的情形）。
 *
 * 假 CLI 建在自己的临时目录里，用完即删，绝不留在 PATH 上。
 *
 * 运行：node --test "test/*.test.js"（在仓库根执行）
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const RUNNER = path.join(REPO_ROOT, "scripts", "run-evals.js");

/**
 * 假 `claude`。只回一段固定的 stream-json —— 与真 CLI 的差别仅在于「不说人话也不干活」，
 * 而跑手关心的是它**输出到哪个通道**，不是它说了什么。
 */
const FAKE_CLI = [
  "#!/bin/sh",
  "# 只为测试 run-evals.js 的输出通道分工，绝不调用模型。",
  'if [ "$1" = "--version" ]; then',
  '  echo "0.0.0 (fake-cli for output-contract test)"',
  "  exit 0",
  "fi",
  "cat <<'JSON'",
  '{"type":"assistant","message":{"content":[{"type":"text","text":"假 CLI 的固定输出。"}]}}',
  '{"type":"result","subtype":"success","is_error":false,"total_cost_usd":0.001}',
  "JSON",
  "exit 0",
  "",
].join("\n");

/** 建一个只在本次测试里存在的假 CLI 目录。调用方负责 `cleanup()`。 */
function fakeCliDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fake-claude-"));
  const bin = path.join(dir, "bin");
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "claude"), FAKE_CLI, { mode: 0o755 });
  return { bin, cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

function runRunner(args, { extraPath = "" } = {}) {
  const env = { ...process.env, NO_COLOR: "1", CI: "" };
  if (extraPath) env.PATH = `${extraPath}${path.delimiter}${env.PATH}`;
  const r = spawnSync(process.execPath, [RUNNER, ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 120000,
    env,
  });
  if (r.error) throw r.error;
  return { status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}

test("--json：stdout 是一份可直接 JSON.parse 的文档", () => {
  const fake = fakeCliDir();
  try {
    const r = runRunner(["--skill", "git-commit", "--eval", "1", "--json"], {
      extraPath: fake.bin,
    });

    // **这条断言在修复前是红的**（实测）：stdout 顶上是 `  ⏳ #1 …`，底下是
    // `▶ 技能评测` 那一块汇总，JSON.parse 抛 `Unexpected token '⏳'`。
    let doc = null;
    try {
      doc = JSON.parse(r.stdout);
    } catch (err) {
      assert.fail(
        `\`--json\` 的 stdout 不是纯 JSON（${err.message}）—— \n` +
          `它必须只包含那一份文档，进度与汇总要走 stderr。实际内容：\n${r.stdout.slice(0, 600)}`
      );
    }
    assert.equal(doc.skill, "git-commit");
    assert.equal(doc.outcomes.length, 1);
    assert.equal(doc.outcomes[0].id, 1);

    // 人读的信息**没有消失，只是换了去向**：删掉进度行是另一种倒退。
    assert.match(r.stderr, /⏳ #1 /, "stderr 里应当还有进度行 —— 它不该被顺手删掉");
    assert.match(r.stderr, /▶ 技能评测/, "stderr 里应当还有 report 的汇总块");
  } finally {
    fake.cleanup();
  }
});

test("--json：dry-run 也给一份 JSON，不留「stdout 是人读文本」的空档", () => {
  const r = runRunner(["--skill", "git-commit", "--dry-run", "--json"]);
  assert.equal(r.status, 0);
  const doc = JSON.parse(r.stdout);
  assert.equal(doc.dryRun, true);
  assert.equal(doc.skill, "git-commit");
  assert.ok(doc.evals.length > 0);
  assert.equal(typeof doc.evals[0].prompt, "string");
});

test("--json 缺席时的人类可读输出照旧（进度与断言都还在 stdout 上）", () => {
  const r = runRunner(["--skill", "git-commit", "--dry-run"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /#1\s/, "dry-run 的用例列表应当在 stdout 上");
  assert.match(r.stdout, /断言: /, "dry-run 的断言列表应当在 stdout 上");
  assert.equal(r.stderr, "", "--json 缺席时不该有任何东西跑到 stderr 上");
});
