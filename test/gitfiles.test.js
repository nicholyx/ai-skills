#!/usr/bin/env node
"use strict";

/**
 * `scripts/lib/gitfiles.js` 的单元测试。
 *
 * 这一层的产物全部**取决于仓库当前的 git 索引**，所以断言分两类：
 *
 * 1. 与内容无关的**不变量**：排序稳定、无重复、忽略项不在目标集里、
 *    技能目录只认三个父目录的深度 1。
 * 2. 用**临时探针文件**验证语义：未追踪但未被忽略的文件要进目标集、
 *    非 ASCII 路径要能原样返回（`-z` 而不是默认输出的意义所在）。
 *    探针在 finally 里删除，仓库不留下痕迹。
 *
 * 探针文件名以 `.` 开头，避免被 `node --test` 之类的工具当成测试文件。
 *
 * 运行：node --test "test/*.test.js"（在仓库根执行）
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const {
  REPO_ROOT,
  SKILL_PARENTS,
  VENDOR_PREFIX,
  EXIT_OK,
  EXIT_FAIL,
  EXIT_ABORT,
  trackedFiles,
  trackedSet,
  trackedWithExt,
  trackedWithSuffix,
  tierOf,
  skillDirs,
  readTracked,
} = require("../scripts/lib/gitfiles");

/** 在仓库里造一个临时探针文件，跑完就删。 */
function withProbe(relPath, body, fn) {
  const abs = path.join(REPO_ROOT, relPath);
  fs.writeFileSync(abs, body, "utf8");
  try {
    return fn();
  } finally {
    fs.rmSync(abs, { force: true });
  }
}

/** 某个 SKILL.md 路径在它所属父目录下的深度：`x/SKILL.md` 是 2，更深的是 3。 */
function depthUnderParent(rel) {
  for (const parent of SKILL_PARENTS) {
    if (rel.startsWith(`${parent}/`)) {
      return rel.slice(parent.length + 1).split("/").length;
    }
  }
  return -1; // 三个父目录之外，不归 skillDirs 管
}

// ── 常量与模块定位 ────────────────────────────────────────────────────────

test("REPO_ROOT 指向仓库根（从 lib/ 往上两级）", () => {
  assert.equal(REPO_ROOT, path.resolve(__dirname, ".."));
  assert.ok(fs.existsSync(path.join(REPO_ROOT, ".git")), "仓库根下应有 .git");
});

test("退出码常量与全仓契约一致（0 通过 / 1 有 fail / 2 未能执行）", () => {
  assert.equal(EXIT_OK, 0);
  assert.equal(EXIT_FAIL, 1);
  assert.equal(EXIT_ABORT, 2);
});

test("技能父目录与上游前缀", () => {
  assert.deepEqual(SKILL_PARENTS, [".agents/skills", "custom/daily", "custom/projects"]);
  assert.equal(VENDOR_PREFIX, ".agents/");
  assert.equal(SKILL_PARENTS[0], VENDOR_PREFIX + "skills");
});

// ── tierOf ────────────────────────────────────────────────────────────────

test("tierOf：`.agents/` 之下是 vendor，其余是 self", () => {
  assert.equal(tierOf(".agents/skills/foo/SKILL.md"), "vendor");
  assert.equal(tierOf(".agents/anything"), "vendor");
  assert.equal(tierOf("custom/daily/foo/SKILL.md"), "self");
  assert.equal(tierOf("scripts/lib/gitfiles.js"), "self");
});

test("tierOf 的边界：前缀带斜杠，`.agents` 本身与 `.agentsfoo/` 都不算 vendor", () => {
  assert.equal(tierOf(".agents"), "self");
  assert.equal(tierOf(".agentsfoo/x.js"), "self");
  assert.equal(tierOf("custom/.agents/x.js"), "self");
});

// ── trackedFiles 与派生视图 ───────────────────────────────────────────────

test("目标集：稳定字典序、无重复、仓库相对路径", () => {
  const files = trackedFiles();

  assert.ok(files.length > 0, "目标集为空说明索引枚举坏了");
  assert.deepEqual([...files].sort(), files, "顺序应与默认 sort 一致（跨平台确定）");
  assert.equal(new Set(files).size, files.length, "不应有重复项");
  assert.ok(files.every((p) => typeof p === "string" && p.length > 0));
  assert.ok(!files.some((p) => p.startsWith("/")), "应为仓库相对路径");
});

test("目标集包含已追踪的关键文件", () => {
  const files = trackedFiles();

  for (const rel of ["README.md", "scripts/lib/gitfiles.js", ".gitignore"]) {
    assert.ok(files.includes(rel), `${rel} 应在目标集里`);
  }
});

test("被 .gitignore 排除的文件不在目标集里", () => {
  const files = trackedFiles();

  assert.ok(!files.includes(".DS_Store"), ".DS_Store 从未被追踪，不该进目标集");
  assert.ok(!files.some((p) => p.startsWith(".claude/")), ".claude/ 不进仓库");
  assert.ok(!files.some((p) => p.includes("__pycache__/")));
  // `.claude/` 只在跑过 trellis init 的工作区里存在，干净 clone 里没有 ——
  // 所以这里只断言它「不在目标集里」，不断言它存在。
});

test("未追踪但未被忽略的文件进目标集，删除后立刻消失", () => {
  const rel = `test/.probe-untracked-${process.pid}`;

  withProbe(rel, "probe\n", () => {
    assert.ok(
      trackedFiles().includes(rel),
      "未追踪的文件也要查 —— 它就是 git add -A 之后 CI 会看到的那批"
    );
  });

  assert.ok(!trackedFiles().includes(rel), "探针删除后不该再出现在目标集里");
});

// 探针是未追踪文件，所以这条走的是 `--others` 那一半；但两半用的是同一个
// `run()`，把 `-z` 从任一处拿掉都会让这里报红（已实测）。仓库当前没有**已追踪**的
// 非 ASCII 路径，那一半只能靠这条间接覆盖。
test("非 ASCII 路径原样返回（用 -z，不受 core.quotePath 影响）", () => {
  const rel = `test/.探针-${process.pid}.md`;

  withProbe(rel, "中文文件名探针\n", () => {
    const files = trackedFiles();
    assert.ok(files.includes(rel), "中文路径应原样出现，而不是 \\344 那样的转义");
    assert.ok(!files.some((p) => p.includes("\\3")), "不该出现八进制转义的路径");
  });
});

test("trackedSet / trackedWithExt / trackedWithSuffix 与目标集一致", () => {
  const files = trackedFiles();

  const set = trackedSet();
  assert.equal(set.size, files.length);
  assert.ok(set.has("README.md"));

  const js = trackedWithExt(".js");
  assert.ok(js.length > 0);
  assert.ok(js.every((p) => p.endsWith(".js")));
  assert.deepEqual(js, files.filter((p) => p.endsWith(".js")));

  const skillMds = trackedWithSuffix("/SKILL.md");
  assert.ok(skillMds.length > 0);
  assert.ok(skillMds.every((p) => p.endsWith("/SKILL.md")));
  assert.deepEqual(skillMds, files.filter((p) => p.endsWith("/SKILL.md")));
});

// ── skillDirs ─────────────────────────────────────────────────────────────

test("技能目录的每条记录都自洽，且都在索引里", () => {
  const dirs = skillDirs();
  const set = trackedSet();

  assert.ok(dirs.length > 0, "一个技能都找不到说明枚举坏了");
  for (const s of dirs) {
    assert.ok(SKILL_PARENTS.includes(s.parent), `${s.dir} 的父目录不在三处之内`);
    assert.equal(s.dir, `${s.parent}/${s.name}`);
    assert.equal(s.skillMd, `${s.dir}/SKILL.md`);
    assert.equal(s.tier, tierOf(s.skillMd));
    assert.equal(s.tier, s.parent === ".agents/skills" ? "vendor" : "self");
    assert.ok(!s.name.includes("/"), `name 应是深度 1 的目录名，实际是 ${s.name}`);
    assert.ok(!s.name.startsWith("."), "隐藏目录不算技能");
    assert.ok(set.has(s.skillMd), `${s.skillMd} 不在目标集里，说明它不是「会被提交的技能」`);
  }
});

test("深度限制：恰好深度 1 的 SKILL.md 才算技能，更深的（模板资产）不算", () => {
  const dirs = skillDirs();
  const listed = new Set(dirs.map((s) => s.skillMd));

  let depth1 = 0;
  let deeper = 0;
  for (const rel of trackedWithSuffix("/SKILL.md")) {
    const depth = depthUnderParent(rel);
    if (depth === -1) continue;
    if (depth === 2) depth1 += 1;
    else deeper += 1;
    assert.equal(
      listed.has(rel),
      depth === 2,
      `${rel} 的深度是 ${depth}，是否计入技能应为 ${depth === 2}`
    );
  }

  assert.equal(depth1, dirs.length, "深度 1 的 SKILL.md 应一个不漏、一个不多");
  assert.ok(deeper > 0, "仓库里应有被深度限制挡掉的 SKILL.md（如 plugin-creator 的模板）");
});

test("自建技能与上游技能都各有一些（分级不是空集）", () => {
  const dirs = skillDirs();

  assert.ok(dirs.some((s) => s.tier === "vendor"), "上游技能一个都没有？");
  assert.ok(dirs.some((s) => s.tier === "self"), "自建技能一个都没有？");
  assert.ok(dirs.some((s) => s.parent === "custom/daily"));
});

// ── readTracked ───────────────────────────────────────────────────────────

test("readTracked：读到内容、读不到返回 null（含路径是目录的情况）", () => {
  const readme = readTracked("README.md");

  assert.equal(typeof readme, "string");
  assert.ok(readme.length > 0);
  assert.ok(readme.includes("#"));

  assert.equal(readTracked("no/such/file.md"), null);
  assert.equal(readTracked("scripts"), null, "目录会 EISDIR，按「读不到」处理");
});
