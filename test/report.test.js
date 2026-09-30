#!/usr/bin/env node
"use strict";

/**
 * `scripts/lib/report.js` 的单元测试。
 *
 * 退出码与分级是全仓契约（`lint.sh` 与 CI 都依赖它），所以断言落在**子进程的
 * 退出码与输出文本**上：`finish()` 会 `process.exit()`，在同进程里测不了。
 * 子进程用 `node -e ... -- <额外参数>` 起（`--` 之前是 node 的选项，之后才是
 * `process.argv` 里的内容，`--strict-vendor` 必须放在 `--` 后面）。
 *
 * 子进程的 stdout 是管道，`process.stdout.isTTY` 为 undefined，配色自然关闭；
 * 仍然显式给 `NO_COLOR=1`，免得断言依赖运行环境。
 *
 * 运行：node --test "test/*.test.js"（在仓库根执行）
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { spawnSync } = require("node:child_process");

const {
  Report,
  useColor,
  C,
  EXIT_OK,
  EXIT_FAIL,
  EXIT_ABORT,
} = require("../scripts/lib/report");

const REPORT_PATH = path.resolve(__dirname, "..", "scripts", "lib", "report.js");

/**
 * 在一个干净的子进程里跑一段用到 Report 的代码，回收退出码与输出。
 *
 * @param {string} code 用到 `Report` 的代码（前置已 require 好）
 * @param {{env?: object, argv?: string[]}} [opts]
 */
function run(code, { env = {}, argv = [] } = {}) {
  const prelude = `const { Report } = require(${JSON.stringify(REPORT_PATH)});\n`;
  const res = spawnSync(process.execPath, ["-e", prelude + code, "--", ...argv], {
    encoding: "utf8",
    env: {
      ...process.env,
      NO_COLOR: "1",
      LINT_QUIET: "",
      VENDOR_STRICT: "",
      CI: "",
      ...env,
    },
  });
  return { status: res.status, stdout: res.stdout, stderr: res.stderr };
}

/** 断言输出里有某一行（含前导两空格），失败时把整个输出打出来。 */
function mustHave(out, line) {
  assert.ok(out.includes(line), `输出里没有「${line}」：\n${out}`);
}

// ── 退出码 ────────────────────────────────────────────────────────────────

test("退出码常量就是 finish()/abort() 实际退出的值（不是两份各写一遍）", () => {
  // 这三种场景分别覆盖 EXIT_OK / EXIT_FAIL / EXIT_ABORT 三个常量。断言里用常量
  // 而不是字面量 —— 谁把 finish() 的返回码改成别的数、或把某个常量的值改了，
  // 这里就会红。此前 finish()/abort() 写的是字面量，常量没有任何使用者，
  // 「0/1/2 的语义」在代码里没有一处耦合。
  assert.equal(EXIT_OK, 0);
  assert.equal(EXIT_FAIL, 1);
  assert.equal(EXIT_ABORT, 2);

  const ok = run('new Report("x").finish();');
  const failed = run('const q = new Report("x"); q.fail("a", 0, "m"); q.finish();');
  const aborted = run('new Report("x").abort("boom");');

  assert.equal(ok.status, EXIT_OK);
  assert.equal(failed.status, EXIT_FAIL);
  assert.equal(aborted.status, EXIT_ABORT);
  assert.equal(new Set([ok.status, failed.status, aborted.status]).size, 3, "三个码必须互不相同");
});

test("没有结论时退出 0，打「✓ 通过」", () => {
  const r = run('new Report("用例检查项").finish();');

  assert.equal(r.status, 0);
  mustHave(r.stdout, "▶ 用例检查项");
  mustHave(r.stdout, "  ✓ 通过");
  assert.ok(!r.stdout.includes("✗"), r.stdout);
});

test("self 的 fail 退出 1，且**不能**同时打「✓ 通过」（回归）", () => {
  const r = run('const q = new Report("x"); q.at("self", "a.txt", 3, "自建问题"); q.finish();');

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ a.txt:3  自建问题");
  mustHave(r.stdout, "  ✗ 未通过：1 处失败");
  // 曾经这里只看 warns，于是「有失败但无警告」会打出「✗ …」紧跟「✓ 通过」
  assert.ok(!r.stdout.includes("✓ 通过"), `有失败时不该出现「✓ 通过」：\n${r.stdout}`);
});

test("行号为 0 时只打文件路径，不打 `:0`", () => {
  const r = run('const q = new Report("x"); q.fail("a.txt", 0, "无行号问题"); q.finish();');

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ a.txt  无行号问题");
  assert.ok(!r.stdout.includes("a.txt:0"), r.stdout);
});

test("vendor 只 warn：退出 0，结论里注明上游、不阻塞", () => {
  const r = run('const q = new Report("x"); q.at("vendor", ".agents/skills/a/SKILL.md", 1, "上游问题"); q.finish();');

  assert.equal(r.status, 0);
  mustHave(r.stdout, "  ⚠ .agents/skills/a/SKILL.md:1  上游问题（上游 vendored，不阻塞）");
  mustHave(r.stdout, "  ✓ 通过（1 处上游遗留（不计入退出码））");
  // 「不阻塞」必须每次都说清楚，否则读者会以为上游已经修好了
  mustHave(r.stdout, "上游 vendored 技能的问题不计入退出码：修复会在 npx skills update 时丢失。");
  mustHave(r.stdout, "需要严格检查时用 VENDOR_STRICT=1。");
});

test("self 的 warn：退出 0，措辞是「待处理」而不是「上游遗留」", () => {
  const r = run('const q = new Report("x"); q.warn("doc.md", 2, "BOM 提示"); q.finish();');

  assert.equal(r.status, 0);
  mustHave(r.stdout, "  ⚠ doc.md:2  BOM 提示");
  mustHave(r.stdout, "  ✓ 通过（1 处提示（待处理））");
  assert.ok(!r.stdout.includes("上游 vendored 技能的问题不计入退出码"), r.stdout);
});

test("warn() 带上游 tier：算「上游遗留」而不是「待处理」（回归）", () => {
  // 曾经 warn() 把 tier 写死成 "self"，于是 `.agents/**` 里一个 CRLF 文件会以
  // 「自建内容的待办」出现在汇总里 —— 分类是错的（我们无权修上游）。
  const r = run(
    'const q = new Report("x"); q.warn(".agents/skills/a/SKILL.md", 1, "CRLF 提示", "vendor"); q.finish();'
  );

  assert.equal(r.status, 0, "上游的风格提示不该影响退出码");
  mustHave(r.stdout, "  ⚠ .agents/skills/a/SKILL.md:1  CRLF 提示（上游 vendored，不阻塞）");
  mustHave(r.stdout, "  ✓ 通过（1 处上游遗留（不计入退出码））");
  assert.ok(!r.stdout.includes("待处理"), `上游的提示不该说「待处理」：\n${r.stdout}`);
});

test("VENDOR_STRICT=1 把 vendor 的 warn 提升为 fail（退出 1）", () => {
  const r = run(
    'const q = new Report("x"); q.at("vendor", ".agents/skills/a/SKILL.md", 1, "上游问题"); q.finish();',
    { env: { VENDOR_STRICT: "1" } }
  );

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ .agents/skills/a/SKILL.md:1  上游问题");
  mustHave(r.stdout, "  ✗ 未通过：1 处上游失败");
  assert.ok(!r.stdout.includes("不阻塞"), "严格模式下不该再说「不阻塞」");
  assert.ok(!r.stdout.includes("✓ 通过"), r.stdout);
});

test("命令行参数 --strict-vendor 与 VENDOR_STRICT=1 等效", () => {
  const r = run(
    'const q = new Report("x"); q.at("vendor", "a", 1, "上游问题"); q.finish();',
    { argv: ["--strict-vendor"] }
  );

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ 未通过：1 处上游失败");
});

test("混合分级：self fail 与 vendor warn 分开计数，退出 1", () => {
  const r = run(
    [
      'const q = new Report("x");',
      'q.at("self", "a", 1, "自建问题");',
      'q.at("vendor", "b", 2, "上游问题");',
      "q.finish();",
    ].join("\n")
  );

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ 未通过：1 处失败");
  assert.ok(!r.stdout.includes("上游失败"), "未提升时上游不计入失败数");
  assert.ok(!r.stdout.includes("✓ 通过"), r.stdout);
});

test("严格模式下两类失败一起计数：`1 处失败，1 处上游失败`", () => {
  const r = run(
    [
      'const q = new Report("x");',
      'q.at("self", "a", 1, "自建问题");',
      'q.at("vendor", "b", 2, "上游问题");',
      "q.finish();",
    ].join("\n"),
    { env: { VENDOR_STRICT: "1" } }
  );

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ 未通过：1 处失败，1 处上游失败");
});

test("info 打「ⓘ」且不影响退出码", () => {
  const r = run('const q = new Report("x"); q.info("扫描了 3 个文件。"); q.finish();');

  assert.equal(r.status, 0);
  mustHave(r.stdout, "  ⓘ 扫描了 3 个文件。");
  mustHave(r.stdout, "  ✓ 通过");
});

test("LINT_QUIET=1 时不打标题与结果行（由 lint.sh 统一打），结论行照旧", () => {
  const r = run(
    'const q = new Report("x"); q.at("self", "a", 1, "自建问题"); q.finish();',
    { env: { LINT_QUIET: "1" } }
  );

  assert.equal(r.status, 1);
  mustHave(r.stdout, "  ✗ a:1  自建问题");
  assert.ok(!r.stdout.includes("▶ x"), r.stdout);
  assert.ok(!r.stdout.includes("未通过"), "结果行交给 lint.sh 打，避免出现两个「通过」");
  assert.ok(!r.stdout.includes("✓ 通过"), r.stdout);
});

test("abort：退出 2，说明写到 stderr，stdout 干净", () => {
  const r = run('new Report("用例检查项").abort("目标集为空，说明原因");');

  assert.equal(r.status, 2);
  assert.equal(r.stdout, "");
  mustHave(r.stderr, "✗ 用例检查项：未能执行");
  mustHave(r.stderr, "  目标集为空，说明原因");
});

// ── 分级（同进程，直接看 findings） ───────────────────────────────────────

test("at() 按 tier 分级，且把 tier 原样记下来", () => {
  const saved = process.env.VENDOR_STRICT;
  process.env.VENDOR_STRICT = "0";
  try {
    const q = new Report("x");
    assert.equal(q.strictVendor, false, "VENDOR_STRICT=0 不应开启严格模式");

    q.at("self", "a", 1, "m");
    q.at("vendor", "b", 2, "m");
    assert.deepEqual(q.findings.map((f) => [f.tier, f.level]), [
      ["self", "fail"],
      ["vendor", "warn"],
    ]);
  } finally {
    if (saved === undefined) delete process.env.VENDOR_STRICT;
    else process.env.VENDOR_STRICT = saved;
  }
});

test("VENDOR_STRICT=1 时构造函数就把它读进来，vendor 变 fail", () => {
  const saved = process.env.VENDOR_STRICT;
  process.env.VENDOR_STRICT = "1";
  try {
    const q = new Report("x");
    assert.equal(q.strictVendor, true);
    q.at("vendor", "b", 2, "m");
    assert.equal(q.findings[0].level, "fail");
  } finally {
    if (saved === undefined) delete process.env.VENDOR_STRICT;
    else process.env.VENDOR_STRICT = saved;
  }
});

test("warn() / fail() 的级别固定，tier 只决定分类（默认 self）", () => {
  const q = new Report("x");
  q.warn("a", 1, "w");
  q.fail("b", 2, "f");
  q.warn("c", 3, "w", "vendor");

  assert.deepEqual(q.findings.map((f) => [f.tier, f.level]), [
    ["self", "warn"],
    ["self", "fail"],
    ["vendor", "warn"],
  ]);
});

test("useColor 与配色表一致（非 TTY 时不出转义码）", () => {
  assert.equal(typeof useColor, "boolean");
  if (useColor) {
    assert.equal(C.red, "\u001b[31m");
    assert.equal(C.reset, "\u001b[0m");
  } else {
    assert.deepEqual(C, { red: "", green: "", yellow: "", blue: "", bold: "", dim: "", reset: "" });
  }
});
