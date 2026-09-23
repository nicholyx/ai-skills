#!/usr/bin/env node
"use strict";

/**
 * 相对链接有效性校验。
 *
 * ## 范围
 *
 * 只查自建内容：`custom/**`、`README*.md`、`docs/**`、`.github/**` 下的 Markdown。
 *
 * **不查 `.agents/**`**：上游有 60 处失效相对链接，其中 20 处集中在
 * `extension-dev-skill/resources/references/_index.md` —— 那是上游资源索引的
 * 结构性产物，修了会在 `npx skills update` 时全部丢失。
 *
 * ## 不探外链
 *
 * HTTP(S) 一律不看。探网会让 CI 因对方限流或改版而假红，而这条检查的价值
 * 抵不上那种不稳定。lint.sh 的「不覆盖」里也声明了这一点。
 *
 * ## 用 git 索引判存在，不用 fs.existsSync
 *
 * `fs.existsSync("Foo.md")` 在大小写不敏感的 APFS 上会对真实的 `foo.md` 返回
 * true，在大小写敏感的 Linux runner 上返回 false —— 天然的「本地绿、CI 红」。
 */

const path = require("path");
const { Report } = require("../lib/report");
const { trackedFiles, trackedSet, readTracked, tierOf } = require("../lib/gitfiles");

const report = new Report("相对链接校验");

const tracked = new Set(trackedFiles());

/** 目标集：只看自建 Markdown。 */
function inScope(rel) {
  if (!rel.endsWith(".md")) return false;
  if (rel.startsWith(".agents/")) return false;
  return (
    rel.startsWith("custom/") ||
    rel.startsWith("docs/") ||
    rel.startsWith(".github/") ||
    !rel.includes("/") // 根目录下的 README.md 等
  );
}

/** 不值得检查的目标。 */
function isExempt(target) {
  if (target === "") return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return true; // http:, mailto:, data:, tel:
  if (target.startsWith("#")) return true; // 纯锚点
  if (target.startsWith("/")) return true; // 仓库绝对路径，语义不明确
  return false;
}

const INLINE_RE = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const REF_DEF_RE = /^\[[^\]]+\]:\s*(\S+)/;

const targets = trackedFiles().filter(inScope);
if (targets.length === 0) {
  report.abort("没有找到任何自建 Markdown 文件（custom/、docs/、.github/、根目录）。");
}

let linkCount = 0;
let fileCount = 0;

for (const rel of targets) {
  const text = readTracked(rel);
  if (text === null) continue;
  fileCount += 1;

  const dir = path.posix.dirname(rel);
  const found = [];

  for (const m of text.matchAll(INLINE_RE)) found.push(m[1]);
  for (const line of text.split("\n")) {
    const m = REF_DEF_RE.exec(line);
    if (m) found.push(m[1]);
  }

  for (const raw of found) {
    if (isExempt(raw)) continue;

    let target = raw;
    try {
      target = decodeURIComponent(raw);
    } catch {
      // 解码失败就按原样处理
    }
    target = target.split("#")[0].split("?")[0];
    if (target === "") continue;

    linkCount += 1;

    const resolved = path.posix.normalize(path.posix.join(dir, target));
    if (!tracked.has(resolved)) {
      report.at(
        tierOf(rel),
        rel,
        0,
        `链接目标不在 git 索引里：${raw} → ${resolved}`
      );
    }
  }
}

report.info(`检查了 ${fileCount} 个文件里的 ${linkCount} 条相对链接。`);

report.finish();
