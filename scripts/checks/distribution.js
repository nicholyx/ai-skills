#!/usr/bin/env node
"use strict";

/**
 * 分布面校验：仓库里**能被当成技能来源**的目录，只能是预期的那几个。
 *
 * ## 这个检查守的是什么
 *
 * 本仓库有两个身份：**分发的产品**（`custom/` 下的技能，别人用 `npx skills add` 装）
 * 与**维护它的工具**（Trellis 等）。工具层一旦在仓库里留下技能目录，就会把产品
 * 顶掉 —— 真实发生过：接入 Trellis 后 `.claude/skills/` 让默认安装命令装出 9 个
 * Trellis 内部 meta-skill，一个本仓库的技能都没有。
 *
 * 那类缺陷**不在任何 diff 里**，也不会让任何一项检查变红 —— 它是「仓库在别人眼里
 * 长什么样」的问题，而其余检查查的全是「仓库内部是否自洽」。所以需要这一条。
 *
 * ## 为什么断言结构，而不是直接跑 `npx skills --list`
 *
 * 实测过 CLI 的发现规则，它比想象的复杂，且**不是**「任何含 SKILL.md 的目录」：
 *
 *   custom/daily/x                     → 默认发现 ✓
 *   .agents/skills/x                   → 默认发现 ✓
 *   .claude/skills/x                   → 默认发现 ✓
 *   custom/daily/x + .agents/skills/y  → 默认**只**发现 y（custom 被顶掉）
 *   三者共存                            → 默认发现 y 与 .claude 的，custom 仍被顶掉
 *
 * 规则还受 `--full-depth` 影响，且在真实仓库（带 `skills-lock.json`）里表现又不同。
 * **复刻这条规则写出来的断言会跟着一起错**，而断言的失效是静默的。
 *
 * 所以这里断言一个**不依赖 CLI 优先级**的不变量：让「多个来源」这件事根本
 * 不发生。这比复刻规则更保守，也更能挡住没预料到的新来源。
 */

const { Report } = require("../lib/report");
const { trackedWithSuffix, skillDirs } = require("../lib/gitfiles");

const report = new Report("分布面校验");

/**
 * 允许出现 `SKILL.md` 的目录前缀。
 *
 * - `.agents/skills/` —— 上游 vendored 内容。它是 `npx skills` 的**安装目标**，
 *   不是本仓库的分发来源，所以留在这里是正常的。
 * - `custom/daily/`、`custom/projects/` —— 本仓库的产品。
 */
const ALLOWED_PREFIXES = [
  ".agents/skills/",
  "custom/daily/",
  "custom/projects/",
];

const skillMdFiles = trackedWithSuffix("/SKILL.md");

if (skillMdFiles.length === 0) {
  report.abort(
    "仓库里一个 SKILL.md 都没有 —— 这不是「检查通过」，是「检查没东西可查」。\n" +
      "  本仓库的全部价值就是这些技能，一个都没有说明仓库状态本身是错的。"
  );
}

// 每个 SKILL.md 的「技能目录」= 它的父目录
const unexpected = [];
for (const file of skillMdFiles) {
  const dir = file.slice(0, -"/SKILL.md".length);
  if (!ALLOWED_PREFIXES.some((p) => file.startsWith(p))) {
    unexpected.push({ file, dir });
  }
}

for (const { file, dir } of unexpected) {
  report.fail(
    file,
    0,
    `技能目录不在允许的分发面内：${dir}/ —— 它会被当成技能来源，把 custom/ 顶掉。` +
      `若确实要分发，请加进 scripts/checks/distribution.js 的 ALLOWED_PREFIXES 并说明理由；` +
      `若是工具层产物（如 .claude/），应加入 .gitignore。`
  );
}

// 交叉验证：产品面必须与 frontmatter 检查器认定的「自建技能」完全一致。
// 两个检查器对「什么是本仓库的技能」必须给出同一个答案。
const productSkillDirs = skillDirs().filter((s) => s.tier === "self");
const fromFiles = skillMdFiles
  .filter((f) => f.startsWith("custom/"))
  .map((f) => f.slice(0, -"/SKILL.md".length))
  .sort();
const fromSkillDirs = productSkillDirs.map((s) => s.dir).sort();

if (fromFiles.join("\n") !== fromSkillDirs.join("\n")) {
  report.fail(
    "custom/",
    0,
    "两个检查器对「本仓库有哪些技能」给出了不同答案：\n" +
      `      按 SKILL.md 枚举：${fromFiles.length} 个\n` +
      `      按 skillDirs() ：${fromSkillDirs.length} 个\n` +
      "      差异：只在文件里的 " +
      JSON.stringify(fromFiles.filter((d) => !fromSkillDirs.includes(d))) +
      "；只在 skillDirs 里的 " +
      JSON.stringify(fromSkillDirs.filter((d) => !fromFiles.includes(d)))
  );
}

// 产品面为空是退化状态：`.agents/skills/` 还有内容，所以上面那个「一个都没有」的
// 判断不会触发，而 fromFiles === fromSkillDirs 也会同时成立（两边都是空）。
// 实测确认过这个口子：删光 custom/ 之后本检查会静默通过。
if (fromFiles.length === 0) {
  report.fail(
    "custom/",
    0,
    "产品面为空 —— custom/ 下一个技能都没有。\n" +
      "      这不可能是「检查通过」：本仓库分发的就是这些技能，用户装到的东西会是空的。\n" +
      "      若确实要清空，请同时改这条断言并说明理由，而不是让它静默通过。"
  );
}

report.info(
  `已追踪 SKILL.md ${skillMdFiles.length} 个：产品面 ${fromFiles.length} 个（custom/）、` +
    `上游 vendored ${skillMdFiles.length - fromFiles.length} 个（.agents/skills/）；` +
    `允许的目录前缀 ${ALLOWED_PREFIXES.length} 个。`
);

report.finish();
