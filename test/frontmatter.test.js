#!/usr/bin/env node
"use strict";

/**
 * `scripts/lib/frontmatter.js` 的单元测试。
 *
 * 断言的是**代码当前的行为**，包括几处刻意不做完整 YAML 的宽松处理
 * （块标量保留换行与缩进、行内 `#` 不当注释、带点的键整行忽略）。
 * 这些不是 bug —— 文件头写明了「这里不实现 YAML」，只做官方 validator
 * 需要的那些事；把它们钉住是为了**先于读者发现行为变了**。
 *
 * 运行：node --test "test/*.test.js"（在仓库根执行）
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  ALLOWED_PROPERTIES,
  NAME_MAX,
  DESCRIPTION_MAX,
  COMPATIBILITY_MAX,
  parseFrontmatter,
  validateFrontmatter,
} = require("../scripts/lib/frontmatter");
const { skillDirs, readTracked } = require("../scripts/lib/gitfiles");

/** 把行数组拼成文件全文，省得每处都写 `\n`。 */
const doc = (...lines) => lines.join("\n");

/** 一份最小合法 frontmatter，末尾带一行正文。 */
const BASIC = doc("---", "name: my-skill", "description: 一句话描述", "---", "正文第一行", "");

/**
 * 在结论列表里找一条 message 含 `substr` 的。找不到就断言失败 —— 并把**实际的**
 * 全部 message 打出来，否则失败信息只会说「期望 true」，无从知道解析出了什么。
 */
function mustFind(findings, substr) {
  const hit = findings.find((f) => f.message.includes(substr));
  assert.ok(
    hit,
    `没有含「${substr}」的结论，实际是：${JSON.stringify(findings.map((f) => f.message))}`
  );
  return hit;
}

/** 用给定 frontmatter 行构造文件并校验，返回结论列表。 */
function check(lines, ctx) {
  return validateFrontmatter(parseFrontmatter(doc("---", ...lines, "---")), ctx);
}

// ── parseFrontmatter：编码与切分 ──────────────────────────────────────────

test("解析基本 frontmatter：键、值、body 与 docBody 的切分", () => {
  const p = parseFrontmatter(BASIC);

  assert.equal(p.ok, true);
  assert.deepEqual(p.keys, ["name", "description"]);
  assert.equal(p.values.get("name"), "my-skill");
  assert.equal(p.values.get("description"), "一句话描述");
  assert.equal(p.startLine, 1);
  // endLine 是闭合 `---` 的 1 基行号（本文件第 4 行）
  assert.equal(p.endLine, 4);
  assert.equal(p.bom, false);
  assert.equal(p.crlf, false);
  assert.deepEqual(p.duplicates, []);

  // body 是 frontmatter 内部的行；docBody 是闭合 `---` 之后的正文。
  // 二者混淆过一次（断言写成了恒真），所以两条都钉住。
  assert.equal(p.body, doc("name: my-skill", "description: 一句话描述"));
  assert.equal(p.docBody, "正文第一行\n");
  assert.ok(p.body.includes("name: my-skill"));
  assert.ok(!p.docBody.includes("name: my-skill"));
});

test("BOM：剥离后仍能认出首行 `---` 并解析出键值", () => {
  const p = parseFrontmatter("﻿" + BASIC);

  assert.equal(p.bom, true);
  assert.equal(p.ok, true, "带 BOM 时不应该报「开头没有 frontmatter」");
  assert.equal(p.values.get("name"), "my-skill");
  assert.deepEqual(p.keys, ["name", "description"]);
  assert.equal(p.docBody, "正文第一行\n");
});

test("CRLF：归一化后解析结果与 LF 版一致，crlf 标记为 true", () => {
  const p = parseFrontmatter(BASIC.replace(/\n/g, "\r\n"));

  assert.equal(p.crlf, true);
  assert.equal(p.bom, false);
  assert.equal(p.ok, true);
  assert.deepEqual(p.keys, ["name", "description"]);
  assert.equal(p.values.get("name"), "my-skill");
  assert.equal(p.docBody, "正文第一行\n");
});

test("BOM 与 CRLF 可以同时出现", () => {
  const p = parseFrontmatter("﻿" + BASIC.replace(/\n/g, "\r\n"));

  assert.equal(p.bom, true);
  assert.equal(p.crlf, true);
  assert.equal(p.values.get("description"), "一句话描述");
});

// ── parseFrontmatter：失败路径 ────────────────────────────────────────────

test("首行不是 `---` 或文件为空时，报「开头没有 frontmatter」且行号为 1", () => {
  for (const text of ["", "name: a\n---\n", "# 注释\n---\n", "\n---\n"]) {
    const p = parseFrontmatter(text);
    assert.equal(p.ok, false, `「${JSON.stringify(text)}」不该解析成功`);
    assert.match(p.reason, /文件开头没有 YAML frontmatter/);
    assert.equal(p.line, 1);
  }
});

test("找不到第二个 `---` 时报「没有闭合」", () => {
  const p = parseFrontmatter("---\nname: a\ndescription: b\n");

  assert.equal(p.ok, false);
  assert.match(p.reason, /frontmatter 没有闭合/);
  assert.equal(p.line, 1);
});

test("只有一对 `---`（空 frontmatter）是合法解析，键为空", () => {
  const p = parseFrontmatter("---\n---\n正文\n");

  assert.equal(p.ok, true);
  assert.deepEqual(p.keys, []);
  assert.equal(p.body, "");
  assert.equal(p.endLine, 2);
  assert.equal(p.docBody, "正文\n");
});

// ── parseFrontmatter：行级规则 ────────────────────────────────────────────

test("缩进的 `---` 不闭合 frontmatter（判定用 trimEnd 而非 trim）", () => {
  const p = parseFrontmatter(doc("---", "name: a", "description: |", "  ---", "---", "正文"));

  assert.equal(p.endLine, 5, "闭合行应是最后一行的顶格 `---`，不是块标量里的 `  ---`");
  assert.equal(p.values.get("description"), "---");
  assert.equal(p.docBody, "正文");
});

test("注释行、空行、缩进行都不算顶层键", () => {
  const p = parseFrontmatter(
    doc("---", "# 顶层注释", "", "name: a", "  # 缩进注释", "  indented: 1", "description: b", "---")
  );

  assert.deepEqual(p.keys, ["name", "description"]);
});

test("带 `.` 的键整行被忽略（不做额外键校验）", () => {
  const p = parseFrontmatter(doc("---", "name: a", "description: b", "foo.bar: 1", "---"));

  assert.deepEqual(p.keys, ["name", "description"]);
  // 它连 keys 都进不去，因此也不会触发「额外的键」那条结论 —— 已知的漏网
  assert.deepEqual(validateFrontmatter(p, { dirName: "a" }), []);
});

test("重复顶层键被记录下来，值取后者", () => {
  const p = parseFrontmatter(doc("---", "name: a", "name: b", "description: c", "---"));

  assert.deepEqual(p.duplicates, ["name"]);
  assert.deepEqual(p.keys, ["name", "name", "description"]);
  assert.equal(p.values.get("name"), "b");
});

test("空值：后面没有更深缩进时值为空串", () => {
  const p = parseFrontmatter(doc("---", "name: a", "description: b", "license:", "---"));

  assert.equal(p.values.get("license"), "");
  assert.equal(p.values.has("license"), true);
});

test("成对引号被剥离，不成对的保留原样", () => {
  const quoted = parseFrontmatter(
    doc("---", 'name: "a-b"', "description: b", "license: 'MIT'", "---")
  );
  assert.equal(quoted.values.get("name"), "a-b");
  assert.equal(quoted.values.get("license"), "MIT");

  const broken = parseFrontmatter(doc("---", "name: a", 'description: "未闭合', "---"));
  assert.equal(broken.values.get("description"), '"未闭合');
});

test("行内 `#` 不当注释剥离", () => {
  const p = parseFrontmatter(doc("---", "name: a", "description: 说明 # 注释", "---"));

  assert.equal(p.values.get("description"), "说明 # 注释");
});

// ── parseFrontmatter：块标量 ──────────────────────────────────────────────

test("块标量 `>-` 收集续行；不是 YAML 的折叠语义（换行与续行缩进原样保留）", () => {
  const p = parseFrontmatter(
    doc("---", "name: a", "description: >-", "  第一行", "  第二行", "---", "正文")
  );

  // 首行缩进被 trim 掉，后续行的缩进留在值里 —— 于是 description 里带一个换行。
  // 这是刻意的宽松处理：校验只关心「它非空」，不还原 YAML 的折叠规则。
  assert.equal(p.values.get("description"), "第一行\n  第二行");
  assert.equal(p.docBody, "正文");
});

test("块标量里的空行保留为空行", () => {
  const p = parseFrontmatter(
    doc("---", "name: a", "description: |", "  第一行", "", "  第二行", "---")
  );

  assert.equal(p.values.get("description"), "第一行\n\n  第二行");
});

test("块标量遇到下一个顶层键就停止收集", () => {
  const p = parseFrontmatter(
    doc("---", "name: a", "description: >-", "  描述", "license: MIT", "---")
  );

  assert.equal(p.values.get("description"), "描述");
  assert.equal(p.values.get("license"), "MIT");
});

// ── parseFrontmatter：嵌套结构 ────────────────────────────────────────────

test("嵌套映射：顶层键值为 undefined，子键收一层标量", () => {
  const p = parseFrontmatter(
    doc("---", "name: a", "description: b", "metadata:", "  category: dev", '  tagline: "一句话"', "---")
  );

  // has 为 true / get 为 undefined —— 「有键但值不在此处」的表达方式
  assert.equal(p.values.has("metadata"), true);
  assert.equal(p.values.get("metadata"), undefined);
  assert.deepEqual([...p.nested.get("metadata")], [
    ["category", "dev"],
    ["tagline", "一句话"],
  ]);
});

test("嵌套里只有更深结构时，不产生子键表", () => {
  const p = parseFrontmatter(
    doc("---", "name: a", "description: b", "compatibility:", "  platforms:", "    - linux", "---")
  );

  assert.equal(p.values.has("compatibility"), true);
  assert.equal(p.values.get("compatibility"), undefined);
  assert.equal(p.nested.has("compatibility"), false);
});

// ── validateFrontmatter ───────────────────────────────────────────────────

test("合法的自建技能不产生任何结论", () => {
  const out = validateFrontmatter(parseFrontmatter(BASIC), { dirName: "my-skill", tier: "self" });

  assert.deepEqual(out, []);
});

test("解析失败时只返回那一条 fail，行号取解析器给的", () => {
  const out = validateFrontmatter(parseFrontmatter("nope"), { dirName: "x" });

  assert.equal(out.length, 1);
  assert.equal(out[0].level, "fail");
  assert.equal(out[0].line, 1);
  assert.match(out[0].message, /文件开头没有 YAML frontmatter/);
});

test("BOM 与 CRLF 只报 warn，不影响后续字段校验", () => {
  const parsed = parseFrontmatter("﻿" + BASIC.replace(/\n/g, "\r\n"));
  const out = validateFrontmatter(parsed, { dirName: "my-skill" });

  assert.deepEqual(out.map((f) => f.level), ["warn", "warn"]);
  mustFind(out, "BOM");
  mustFind(out, "CRLF");
});

test("重复顶层键是 fail", () => {
  const out = check(["name: a", "name: b", "description: c"], { dirName: "b" });

  assert.equal(mustFind(out, "重复的顶层键：name").level, "fail");
});

test("白名单外的键是 fail，且把允许的键列出来", () => {
  const out = check(["name: a", "description: b", "foo: 1", "bar: 2"], { dirName: "a" });

  mustFind(out, "额外键：foo, bar");
  mustFind(out, ALLOWED_PROPERTIES.join(", "));
});

test("缺少必填字段", () => {
  const out = check(["license: MIT"], { dirName: "x" });

  mustFind(out, "缺少必填字段 name");
  mustFind(out, "缺少必填字段 description");
  assert.equal(out.length, 2);
});

test("name 为空（空值或空串）都是 fail", () => {
  assert.equal(mustFind(check(["name:", "description: b"], { dirName: "a" }), "name 不能为空").level, "fail");
  assert.equal(mustFind(check(['name: ""', "description: b"], { dirName: "a" }), "name 不能为空").level, "fail");
});

test("name 必须 kebab-case，且不能以连字符开头/结尾或含连续连字符", () => {
  mustFind(check(["name: My-Skill", "description: b"], { dirName: "My-Skill" }), "应为 kebab-case");
  mustFind(check(["name: -a", "description: b"], { dirName: "-a" }), "不能以连字符开头/结尾");
  mustFind(check(["name: a-", "description: b"], { dirName: "a-" }), "不能以连字符开头/结尾");
  mustFind(check(["name: a--b", "description: b"], { dirName: "a--b" }), "不能含连续连字符");
});

test("name 长度上限是 64：64 通过，65 报错（边界）", () => {
  const n64 = "a".repeat(NAME_MAX);
  const n65 = "a".repeat(NAME_MAX + 1);

  assert.deepEqual(check([`name: ${n64}`, "description: b"], { dirName: n64 }), []);
  mustFind(check([`name: ${n65}`, "description: b"], { dirName: n65 }), `name 过长（65 字符，上限 64）`);
});

test("name 与目录名不符是 fail；dirName 缺失或为空时跳过这一条", () => {
  assert.equal(mustFind(check(["name: a", "description: b"], { dirName: "b" }), "与所在目录名「b」不一致").level, "fail");
  assert.deepEqual(check(["name: a", "description: b"], { dirName: "" }), []);
  assert.deepEqual(check(["name: a", "description: b"], {}), []);
  assert.deepEqual(validateFrontmatter(parseFrontmatter(BASIC)), []);
});

test("description 不能含尖括号、不能过长（1024 通过，1025 报错）", () => {
  mustFind(check(["name: a", "description: 用 <foo> 描述"], { dirName: "a" }), "不能含尖括号");

  const d1024 = "a".repeat(DESCRIPTION_MAX);
  const d1025 = "a".repeat(DESCRIPTION_MAX + 1);
  assert.deepEqual(check(["name: a", `description: ${d1024}`], { dirName: "a" }), []);
  mustFind(check(["name: a", `description: ${d1025}`], { dirName: "a" }), "description 过长（1025 字符，上限 1024）");
});

test("description 为空（空值或空串）是 fail", () => {
  mustFind(check(["name: a", "description:"], { dirName: "a" }), "description 不能为空");
  mustFind(check(["name: a", 'description: ""'], { dirName: "a" }), "description 不能为空");
});

test("compatibility 可选：缺失、空串、嵌套结构都不报；上限 500", () => {
  assert.deepEqual(check(["name: a", "description: b"], { dirName: "a" }), []);
  assert.deepEqual(check(["name: a", "description: b", 'compatibility: ""'], { dirName: "a" }), []);
  assert.deepEqual(
    check(["name: a", "description: b", "compatibility:", "  platforms:", "    - linux"], { dirName: "a" }),
    []
  );

  const ok = "a".repeat(COMPATIBILITY_MAX);
  const tooLong = "a".repeat(COMPATIBILITY_MAX + 1);
  assert.deepEqual(check(["name: a", "description: b", `compatibility: ${ok}`], { dirName: "a" }), []);
  mustFind(
    check(["name: a", "description: b", `compatibility: ${tooLong}`], { dirName: "a" }),
    "compatibility 过长（501 字符，上限 500）"
  );
});

test("validateFrontmatter 不看 ctx.tier：分级由调用方的 report.at 负责", () => {
  const out = check(["name: My-Skill", "description: b"], { tier: "vendor" });

  assert.equal(out[0].level, "fail");
});

test("导出的常量与官方白名单一致", () => {
  assert.deepEqual(ALLOWED_PROPERTIES, [
    "name",
    "description",
    "license",
    "allowed-tools",
    "metadata",
    "compatibility",
  ]);
  assert.equal(NAME_MAX, 64);
  assert.equal(DESCRIPTION_MAX, 1024);
  assert.equal(COMPATIBILITY_MAX, 500);
});

// ── 对真实内容的零误报 ────────────────────────────────────────────────────
//
// 这个模块存在的理由就是「44 个真实技能零误报」。用仓库当前的真实技能跑一遍：
// 全部分析成功，且自建技能一条 fail 都没有。上游有几个已知的额外键（warn），
// 所以只对 self 断言「无 fail」。

test("仓库里每一个真实 SKILL.md 都能解析成功（解析不回归）", () => {
  const skills = skillDirs();
  assert.ok(skills.length > 0, "技能目录为空，说明目标集枚举坏了");

  const broken = [];
  for (const s of skills) {
    const text = readTracked(s.skillMd);
    assert.notEqual(text, null, `${s.skillMd} 在索引里但读不到`);
    const p = parseFrontmatter(text);
    if (!p.ok) broken.push(`${s.skillMd}：${p.reason}`);
  }
  assert.deepEqual(broken, []);
});

test("自建技能的 frontmatter 零 fail（零误报）", () => {
  const bad = [];
  for (const s of skillDirs().filter((x) => x.tier === "self")) {
    const out = validateFrontmatter(parseFrontmatter(readTracked(s.skillMd)), {
      dirName: s.name,
      tier: s.tier,
    }).filter((f) => f.level === "fail");
    if (out.length > 0) bad.push([s.skillMd, out.map((f) => f.message)]);
  }
  assert.deepEqual(bad, []);
});
