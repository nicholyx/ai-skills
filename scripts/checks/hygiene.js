#!/usr/bin/env node
"use strict";

/**
 * 文件「能不能被工具正确读出来」的检查：编码 + JSON 语法。
 *
 * 两项**正确性**检查（全仓，含上游）：
 *   - UTF-8 合法性（非法字节序列）
 *   - U+FFFD 替换字符（中文内容被写坏时留下的化石）
 *
 * 两项**风格**检查（仅自建内容）：
 *   - BOM
 *   - 末尾换行（见 .editorconfig）
 *
 * 外加全部已追踪 `.json` 的可解析性。
 *
 * ## 为什么风格检查不对上游生效
 *
 * 上游 vendored 区里 20 多处文件缺少末尾换行、6 个 `.xsd` 带 BOM，都是上游的
 * 既有风格 —— 我们既无权改（改了会在 `npx skills update` 时丢失），也就没有
 * 理由每次运行都报一遍。**每次 20 多条永远修不掉的告警，作用只是训练读者
 * 忽略输出。** 正确性检查则相反：上游一旦引入非法 UTF-8 或坏 JSON，技能会
 * 直接加载失败，那必须看得见。
 *
 * ## 不要用 iconv 做 UTF-8 检查
 *
 * 实测本机 `iconv` 对**合法**的 UTF-8 文件也报 `Inappropriate ioctl for device`，
 * 一次误报 41 个文件（含 10 个自建文件）。Node 的 `TextDecoder({fatal:true})`
 * 干净且跨平台。
 *
 * ## U+FFFD 与 UTF-8 合法性是两回事
 *
 * 合法 UTF-8 里出现 U+FFFD 是完全合法的字节序列 —— 它通常意味着**上一轮**编码
 * 转换已经损坏过。所以两者必须分别检查。
 */

const fs = require("fs");
const path = require("path");
const { Report } = require("../lib/report");
const { REPO_ROOT, trackedFiles, tierOf } = require("../lib/gitfiles");

/**
 * Trellis 自己的记账文件：由 trellis 写入，我们不该手改，也不该拿本仓库的风格
 * 约定去约束它们 —— 否则一次例行的 `trellis update` 就会让 CI 突然变红。
 *
 * 它们**不在** `.trellis/.template-hashes.json` 里（那份清单是 trellis 用来追踪
 * 它生成的其他文件的），所以只能显式列出。按同样理由排除的还有上游 `.agents/**`
 * （见 lib/report.js 的分级说明）。
 *
 * 只豁免**风格**检查（末尾换行、BOM）；正确性检查（UTF-8 合法性、U+FFFD、JSON
 * 可解析）照常执行 —— 那些坏了是真的坏了。
 */
const TRELLIS_BOOKKEEPING = new Set([
  ".trellis/.version",
  ".trellis/.template-hashes.json",
]);

const report = new Report("编码与 JSON 校验");

const files = trackedFiles();
if (files.length === 0) {
  report.abort("git 索引里没有任何文件 —— 这是空的仓库，还是不在仓库里？");
}

const decoder = new TextDecoder("utf-8", { fatal: true });

let textCount = 0;
let binaryCount = 0;
let jsonCount = 0;

for (const rel of files) {
  let buf;
  try {
    buf = fs.readFileSync(path.join(REPO_ROOT, rel));
  } catch {
    report.at(tierOf(rel), rel, 0, "文件在 git 索引里，但不在工作区");
    continue;
  }

  // 二进制判定：前 8KB 出现 NUL 就当作二进制（git 用的是同一套启发式）
  if (buf.subarray(0, 8192).includes(0)) {
    binaryCount += 1;
    continue;
  }

  const tier = tierOf(rel);

  // BOM 要在解码前判：TextDecoder 默认会把 BOM 吃掉。
  // 风格问题，只对自建内容报（SKILL.md 上的 BOM 由 frontmatter 检查器另行覆盖）。
  if (
    tier === "self" &&
    !TRELLIS_BOOKKEEPING.has(rel) &&
    buf.length >= 3 &&
    buf[0] === 0xef &&
    buf[1] === 0xbb &&
    buf[2] === 0xbf
  ) {
    report.warn(rel, 1, "文件带 UTF-8 BOM，建议去掉");
  }

  let text;
  try {
    text = decoder.decode(buf);
  } catch {
    report.at(tier, rel, 0, "不是合法的 UTF-8 字节序列");
    continue;
  }

  textCount += 1;

  // U+FFFD
  const lines = text.split("\n");
  lines.forEach((line, idx) => {
    // 用转义而不是字面量：本文件自己也在检查范围内，
    // 写一个字面的 U+FFFD 会让这个检查器把自己报成违规。
    const at = line.indexOf("\uFFFD");
    if (at === -1) return;
    // 内容在终端里就是乱码，帮不上忙；打该行的 UTF-8 十六进制才能定位原始字节
    const bytes = Buffer.from(line, "utf8").toString("hex").match(/.{1,2}/g) || [];
    report.at(tier, rel, idx + 1, `含 U+FFFD 替换字符。该行字节：${bytes.join(" ")}`);
  });

  // 末尾换行：风格问题，只对自建内容报。判 fail 而非 warn —— .editorconfig 已经
  // 声明了 insert_final_newline，遵守它的编辑器会自动补上；这里报错说明有人绕过了
  // 编辑器配置，而修复成本是零。既然规则写下来了，就不该只提示不拦。
  if (tier === "self" && !TRELLIS_BOOKKEEPING.has(rel) && text.length > 0 && !text.endsWith("\n")) {
    report.fail(rel, lines.length, "文件末尾缺少换行（见 .editorconfig）");
  }

  // JSON 可解析
  if (rel.endsWith(".json")) {
    jsonCount += 1;
    try {
      JSON.parse(text);
    } catch (err) {
      // 语法错误没有「上游风格」的解释空间，vendor 也一样 fail
      report.fail(rel, 0, `不是合法 JSON：${err.message}`);
    }
  }
}

report.info(
  `扫描 ${files.length} 个已追踪文件（文本 ${textCount}、二进制 ${binaryCount}），` +
    `其中 JSON ${jsonCount} 个。`
);

report.finish();
