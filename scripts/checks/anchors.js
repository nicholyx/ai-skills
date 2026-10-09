#!/usr/bin/env node
"use strict";

/**
 * 锚点校验：自建 Markdown 里带 #fragment 的链接（纯锚点与相对链接带锚点），
 * 必须在目标文件里有对应的 heading。
 *
 * ## 背景
 *
 * 在这之前锚点没有任何检查，SUPPORT.md 的死锚点是手工发现的。而「加一个
 * 会误报的检查比没有更糟」：手写简化版 slug 算法曾把 USAGE.md 里
 * skills-sync同步到-claude-code--codebuddy 这个真实锚点判成 DEAD（简化版
 * 合并了连续横线，GitHub 不合并），所以这里用 vendor 来的原版算法
 * （scripts/lib/slug.js），不用手写简化版。
 *
 * ## 范围与分工
 *
 * 与 links.js 完全一致：custom/、docs/、.github/ 与根目录下的自建 Markdown，
 * 不含 .agents/。links.js 管「目标文件存不存在」，本检查器管「锚点指的
 * heading 存不存在」；目标不是 .md（如图片）、或解析后不在自建范围内
 * （上游内容、仓库外）的一律跳过，不重复报。
 *
 * ## 口径
 *
 * - 只认 ATX 标题（1-6 个 # 跟空格）。GFM 允许行首**至多 3 个空格**的缩进，
 *   GitHub 会为缩进标题照常生成锚点，所以缩进的也认；4 个及以上空格是
 *   缩进代码块，不认（与 fence 正则的 0-3 空格口径一致）。剥掉行尾关闭序列
 *   （## foo ## 取 foo）。setext 标题不认 —— 本仓库没有
 * - frontmatter（首行 --- 到下一个 ---）与 fenced code block（``` 与 ~~~，
 *   按同种字符配对开闭）里的 # 行不算标题，否则会给重复计数掺水
 * - heading 先剥行内 markdown 再算 slug：GitHub 是对**渲染后**的文本算的。
 *   顺序：先链接（文本里可能还有强调），后强调，最后 code 定界符与 HTML 标签
 * - 每个文件独立的 BananaSlug 实例：重复标题的 -1/-2 后缀**不跨文件**
 * - fragment 先按字面匹配，再按 decodeURIComponent 解码后匹配（链接里写的
 *   可能是百分号编码）；解码抛异常（坏编码如 %zz）直接判死锚点，不让检查器崩
 */

const path = require("path");
const { Report } = require("../lib/report");
const { trackedFiles, readTracked, tierOf } = require("../lib/gitfiles");
const { BananaSlug } = require("../lib/slug");

const report = new Report("锚点校验");

/** 目标集：与 links.js 完全一致，只看自建 Markdown。 */
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

const INLINE_RE = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const REF_DEF_RE = /^\[[^\]]+\]:\s*(\S+)/;

/**
 * 剥掉 heading 文本里的行内 markdown，得到渲染后的可见文本。
 * 用正则近似即可，但要守住三条实测过的坑：
 * - 链接必须在强调**之前**剥（`[**粗体**](url)` 的文本里还有强调）
 * - 图片**整个剥掉、alt 不留**：GitHub/rehype-slug 对渲染后的 textContent
 *   算 slug，img 对文本没有贡献（`![alt](url)` 剥离后是空串）
 * - `_` 的强调必须带词边界：GitHub 不把词内下划线当强调（skills_sync_mode
 *   原样保留），不带边界会把真实锚点剥坏
 */
function stripInline(s) {
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, ""); // 图片：整个剥掉，alt 不进 slug
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // 行内链接：留文本
  s = s.replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1"); // 引用式链接：留文本
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/(^|[^\w_])__([^_]+)__(?!\w)/g, "$1$2");
  s = s.replace(/(^|[^\w_])_([^_]+)_(?!\w)/g, "$1$2");
  s = s.replace(/`+([^`]*)`+/g, "$1"); // code：去掉定界反引号
  s = s.replace(/<[^>]+>/g, ""); // HTML 标签整个去掉，留内容
  return s;
}

/**
 * 提取一个文件的全部 heading slug（Set，含重复计数的 -1/-2 后缀）。
 * 每个文件一个独立的 BananaSlug 实例。
 */
function headingSlugs(text) {
  const slugger = new BananaSlug();
  const slugs = new Set();
  const lines = text.split("\n");
  let inFrontmatter = false;
  let fenceChar = null; // 当前开着的 fence 字符；null = 不在代码块里

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // frontmatter：只在首行是 --- 时进入，到下一个 --- 或 ... 出来
    if (i === 0 && line === "---") {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (line === "---" || line === "...") inFrontmatter = false;
      continue;
    }

    // fenced code block：开栏可以带 info string（如 ```js），闭栏必须只有栏本身
    const fence = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      const ch = fence[1][0];
      if (fenceChar === null) {
        fenceChar = ch;
      } else if (fenceChar === ch && fence[2].trim() === "") {
        fenceChar = null;
      }
      continue;
    }
    if (fenceChar !== null) continue;

    const heading = /^ {0,3}(#{1,6})[ \t]+(.*)$/.exec(line);
    if (!heading) continue;

    let title = heading[2].trim();
    // 尾部关闭序列：## foo ## 的 slug 是 foo（关闭序列前必须有空白）
    title = title.replace(/(^|[ \t])#+[ \t]*$/, "").trim();
    if (title === "") continue;
    slugs.add(slugger.slug(stripInline(title)));
  }
  return slugs;
}

/** 从一行里抽出全部链接目标（行内 + 引用式定义），行号由调用方提供。 */
function targetsInLine(line) {
  const found = [];
  INLINE_RE.lastIndex = 0;
  for (const m of line.matchAll(INLINE_RE)) found.push(m[1]);
  const rd = REF_DEF_RE.exec(line);
  if (rd) found.push(rd[1]);
  return found;
}

const targets = trackedFiles().filter(inScope);
if (targets.length === 0) {
  report.abort("没有找到任何自建 Markdown 文件（custom/、docs/、.github/、根目录）。");
}

// 先给每个目标文件算好 heading slug 集（每个文件独立计数重复标题）
const headings = new Map(); // rel -> Set<slug>
let headingTotal = 0;
for (const rel of targets) {
  const text = readTracked(rel);
  if (text === null) continue;
  const set = headingSlugs(text);
  headings.set(rel, set);
  headingTotal += set.size;
}

/** 校验一个 fragment：字面或解码后能对上目标文件的某个 slug 即活。 */
function checkFragment(fromRel, toRel, frag, raw, lineNo, set) {
  let decoded;
  try {
    decoded = decodeURIComponent(frag);
  } catch {
    report.at(
      tierOf(fromRel),
      fromRel,
      lineNo,
      `死锚点：${raw} —— fragment 是坏的百分号编码，无法解码；` +
        `目标 ${toRel} 共 ${set.size} 个标题`
    );
    return;
  }
  if (set.has(frag) || set.has(decoded)) return;
  report.at(
    tierOf(fromRel),
    fromRel,
    lineNo,
    `死锚点：${raw} —— 目标 ${toRel} 共 ${set.size} 个标题，` +
      `没有一个的 slug 是「${decoded}」`
  );
}

let anchorLinks = 0;
let fileCount = 0;

for (const rel of targets) {
  const text = readTracked(rel);
  if (text === null) continue;
  fileCount += 1;

  const dir = path.posix.dirname(rel);
  const ownSlugs = headings.get(rel);
  const lines = text.split("\n");

  lines.forEach((line, idx) => {
    for (const raw of targetsInLine(line)) {
      if (raw.startsWith("#")) {
        const frag = raw.slice(1);
        if (frag === "") continue; // [x](#) 是「回到页首」，永远有效
        anchorLinks += 1;
        checkFragment(rel, rel, frag, raw, idx + 1, ownSlugs);
        continue;
      }

      if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) continue; // http: mailto: data: 等
      if (raw.startsWith("/")) continue; // 仓库绝对路径，语义不明确
      const hashAt = raw.indexOf("#");
      if (hashAt === -1) continue;
      const frag = raw.slice(hashAt + 1);
      if (frag === "") continue;

      let targetPath = raw.slice(0, hashAt).split("?")[0];
      try {
        targetPath = decodeURIComponent(targetPath);
      } catch {
        // 路径解码失败就按原样处理
      }
      if (!targetPath.endsWith(".md")) continue; // 图片等，links.js 管存在性

      const resolved = path.posix.normalize(path.posix.join(dir, targetPath));
      if (!inScope(resolved)) continue; // .agents/ 或仓库外，不重复报
      const set = headings.get(resolved);
      if (!set) continue; // 不在目标集里（未追踪/读不到），links.js 会报存在性

      anchorLinks += 1;
      checkFragment(rel, resolved, frag, raw, idx + 1, set);
    }
  });
}

report.info(
  `检查了 ${fileCount} 个文件里的 ${anchorLinks} 条带锚点链接` +
    `（共 ${headingTotal} 个标题）。`
);

report.finish();
