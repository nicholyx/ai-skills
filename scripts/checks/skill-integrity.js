#!/usr/bin/env node
"use strict";

/**
 * 技能自洽校验 —— 一个技能「自己说的」与「自己有的」必须对得上。
 *
 * 两条规则，都不需要跑模型：
 *
 * | 规则 | 症状 | 谁会撞上 |
 * | --- | --- | --- |
 * | A 指向本技能目录的路径必须存在 | 改名 `reference/x.md` 后技能**静默失效** | 维护者 |
 * | B `metadata.example` 必须原样出现在 `description` 里 | 目录里教你说的那句话，模型根本看不到 | 使用者 |
 * | C `description` 不得留脚手架占位符 | 技能带着一句「【待补】…」上线 | 使用者 |
 *
 * ## 为什么是这两条
 *
 * 本仓库已有的检查覆盖了**格式**（frontmatter、evals 结构、目录一致、文档计数），
 * 唯独没有覆盖**「这个技能装上以后能不能按说明用起来」**。而那正是用户实际会遇到的
 * 两类故障，且都无法从格式上看出来：
 *
 * - **技能坏了但没人知道**：`SKILL.md` 里写着「按 `reference/quality-standards.md`
 *   的标准打分」，有人把那个文件改名成 `quality.md` —— frontmatter 全合规、目录
 *   照常生成、链接检查器也看不见（它是反引号里的路径，不是 Markdown 链接）。
 *   于是技能照常安装，只在真正跑到那一步时才出问题。
 * - **技能不触发**：`docs/SKILLS.md` 告诉访客「你可以这样说：『把这段内容记到我的
 *   Obsidian 里』」。而模型决定要不要唤起一个技能，依据是它的 `description` ——
 *   这句话若不在这段描述里，那它就是**编出来给人看的**，用户照着说了，什么都没发生。
 *
 * ## 规则 B 为什么盯的是 `description` 而不是正文
 *
 * 第一版写的是「示例必须出现在正文里」，理由是「技能自己的文档得提过这句话」。
 * 实测发现两件事，把这个设计推翻了：
 *
 * 1. **正文管不了触发。** 模型先读 `description` 决定唤不唤起，正文是唤起**之后**
 *    才加载的。示例不在描述里，就等于目录对用户做的承诺没有任何兑现机制。
 * 2. **第一版的度量方式恒真。** 它取的是 `parseFrontmatter()` 的 `body` 字段 ——
 *    那是 **frontmatter 内部**的行，而 `metadata.example` 恰恰就写在那里，于是
 *    断言永远成立（15/15）。变异测试才把它揭出来：真正的正文命中率是 **2/15**。
 *
 * 现在这条是可证伪的：改掉示例、或从描述里删掉那句话，检查立刻报红。
 *
 * ## 规则 A 的判据：怎么区分「本技能的文件」和「别的仓库的文件」
 *
 * 不能简单地把所有相对路径都当本地 —— 实测会误报。本仓库里就有反例：
 *
 * | 技能 | 引用 | 实际指向 |
 * | --- | --- | --- |
 * | `maintain-loop` | `./scripts/lint.sh` | **目标仓库**的脚本（它是通用技能）|
 * | `obsidian-note-workflow` | `_metadata_/tag-rules.md` | **用户 vault** 的结构 |
 *
 * 判据取路径的**第一段**：那一段在技能目录里存在 → 是本技能的文件，整条路径必须
 * 解析得到；不存在 → 是外部引用，跳过。
 *
 * 这个判据在引入时对全仓零误报（`repo-analyzer` 的 11 处 `reference/**` 判为本地，
 * 上面 5 处外部引用判为跳过）。**一个会在正确状态下误报的检查会训练读者忽略输出**，
 * 那比没有检查更糟 —— 所以宁可漏，不可误报。
 *
 * ## 已知的漏网：裸文件名
 *
 * 不含 `/` 的引用（`package.json`、`bug-analyzer.md`）**不检查**。因为无法可靠区分
 * 「本技能的文件」与「目标仓库的文件」：`repo-analyzer` 提到的 `package.json` 是
 * 被分析仓库的，`bug-analyzer-agent` 提到的 `bug-analyzer.md` 却是自己的。放宽到
 * 裸文件名会立刻产生误报。代价是**重命名裸文件名引用的本地文件不会被这里拦住** ——
 * 这是明知故漏，登记在此以免被误以为已覆盖。
 *
 * ## 为什么不对 `.agents/**` 生效
 *
 * 上游 vendored 区不归我们管（改了会在 `npx skills update` 时丢失）。已有的
 * 79 处失效 Markdown 链接就是前车之鉴 —— 再加一类永远修不掉的告警，作用只是
 * 训练读者忽略这个检查器的输出。与 `lib/report.js` 里的分级原则一致。
 */

const fs = require("fs");
const path = require("path");
const { Report } = require("../lib/report");
const { REPO_ROOT, skillDirs, readTracked } = require("../lib/gitfiles");
const { parseFrontmatter } = require("../lib/frontmatter");

const report = new Report("技能自洽校验");

/** 反引号里的内容。用 `[^`\n]` 限制在同一行内，避免跨行误匹配。 */
const CODE_SPAN = /`([^`\n]+)`/g;

/**
 * `scripts/new-skill.js` 留下的占位符。脚手架会把它塞进 `description`，作者不补完
 * 就提交的话，**模型看到的就是这句话** —— 技能照样装得上，只是永远唤不起来。
 */
const PLACEHOLDER = "【待补】";

/** 明显不是文件路径的前缀（外层协议、锚点、绝对路径）。 */
const NOT_A_PATH = /^(?:https?:|mailto:|#|\/|~|\$|\{)/;

/**
 * 收尾字符：反引号里常带标点，如 `` `reference/x.md`。 `` 里的句号。
 * 只从**右端**剥，且不剥成空串 —— 左侧的 `./` 反而要保留（由 normalize 处理）。
 */
function trimTrailing(token) {
  let t = token.trim();
  while (t.length > 1 && /[。，、；：,.;:（(「」"']$/.test(t)) t = t.slice(0, -1);
  return t;
}

/** `./a/b` → `a/b`。只剥一层前导 `./`，不碰 `../`（那指向技能目录之外）。 */
function normalize(token) {
  return token.startsWith("./") ? token.slice(2) : token;
}

const skills = skillDirs().filter((s) => s.tier === "self");

if (skills.length === 0) {
  report.abort("一个自建技能都没找到 —— 是目录结构变了，还是不在仓库根目录运行？");
}

/** 归一化：去空白与常见标点。用于规则 B 的原样比对。 */
function norm(text) {
  return text.replace(/\s+/g, "").replace(/[「」“”"'’。，、！!？?；;：:,.]/g, "");
}

let localRefs = 0;
let externalRefs = 0;
let promises = 0;
let scanned = 0;

for (const skill of skills) {
  const raw = readTracked(skill.skillMd);
  if (raw === null) {
    report.fail(skill.skillMd, 0, "在 git 索引里，但不在工作区");
    continue;
  }
  const parsed = parseFrontmatter(raw);
  if (!parsed.ok) {
    // frontmatter 的问题由 frontmatter 检查器专责报出，这里不重复刷屏
    continue;
  }
  scanned += 1;

  // ── 规则 A：指向本技能目录的路径必须存在 ──────────────────────────────
  const dirAbs = path.join(REPO_ROOT, skill.dir);
  let entries;
  try {
    entries = new Set(fs.readdirSync(dirAbs));
  } catch {
    report.fail(skill.skillMd, 0, `技能目录读不出来：${skill.dir}`);
    continue;
  }

  CODE_SPAN.lastIndex = 0;
  let m;
  while ((m = CODE_SPAN.exec(raw)) !== null) {
    const token = normalize(trimTrailing(m[1]));
    if (!token.includes("/") || NOT_A_PATH.test(token)) continue;

    const first = token.split("/")[0];
    // 第一段不在本技能目录里 → 指向别处（目标仓库、用户 vault），不归这里管
    if (!entries.has(first)) {
      externalRefs += 1;
      continue;
    }
    localRefs += 1;

    if (!fs.existsSync(path.join(dirAbs, token))) {
      const line = raw.slice(0, m.index).split("\n").length;
      report.fail(
        skill.skillMd,
        line,
        `\`${token}\` 不存在。目录里既然有 \`${first}/\`，这就是本技能的引用 —— ` +
          "多半是文件改名后忘了同步 SKILL.md（这种失效不会让技能加载报错，只会在执行到那一步时才暴露）"
      );
    }
  }

  // ── 规则 B：目录承诺的那句话，description 里必须有 ────────────────────
  const meta = parsed.nested.get("metadata") || new Map();
  const example = (meta.get("example") || "").trim();

  if (!example) {
    report.fail(
      skill.skillMd,
      0,
      "缺 `metadata.example`。它是 docs/SKILLS.md 里「你可以这样说」那一列的唯一来源，" +
        "缺了访客看到的就是占位符（创建技能时用 scripts/new-skill.js 会自动带上）"
    );
    continue;
  }

  promises += 1;
  const description = parsed.values.get("description") || "";
  // `body` 是 frontmatter 内部的行，`description:` 在第 2 行，故下标 +2
  const fmLines = parsed.body.split("\n");
  const descIdx = fmLines.findIndex((l) => /^description\s*:/.test(l));
  const descLine = descIdx === -1 ? 0 : descIdx + 2;

  if (!norm(description).includes(norm(example))) {
    report.fail(
      skill.skillMd,
      descLine,
      `目录拿「${example}」当「你可以这样说」给访客看，` +
        "但这句话不在 `description` 里 —— 模型据此决定唤不唤起，不在描述里就没有触发锚点"
    );
  }

  // ── 规则 C：描述不能还是脚手架留下的占位符 ─────────────────────────────
  if (description.includes(PLACEHOLDER)) {
    report.fail(
      skill.skillMd,
      descLine,
      `\`description\` 还是 new-skill.js 留下的占位符（含 \`${PLACEHOLDER}\`）。` +
        "技能装得上，但模型看到的就是这句话 —— 永远唤不起来"
    );
  }
}

report.info(
  `扫描 ${scanned} 个自建技能：本地路径引用 ${localRefs} 处（外部引用 ${externalRefs} 处已跳过）、` +
    `目录承诺 ${promises} 条。`
);

report.finish();
