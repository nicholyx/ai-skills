"use strict";

/**
 * `local-skills.json` 的构建逻辑。
 *
 * 生成器（gen-local-skills.js）与校验器（checks/vendor-lock.js）共用这一份，
 * 两处各写一遍迟早会漂移 —— 而「生成物与生成器一致」正是校验要验的东西。
 *
 * ## 相对旧版 check-local-skills.js 的三处修正
 *
 * 1. **不再写 `generatedAt`。** 它是 `git diff --exit-code` 不可用的唯一原因
 *    （实测重跑后整个文件恰好差这 1 行）。改成别的形式都不稳：用「本文件最后
 *    一次提交时间」是自引用循环，用 `SOURCE_DATE_EPOCH` 又要求 CI 与本地同源。
 *    它本来就是冗余的 —— 这份文件什么时候生成的，`git log` 已经记着了。
 * 2. **显式排序。** `readdirSync` 的顺序不保证（APFS 上恰好是字典序，ext4 上不是）。
 *    用默认 `.sort()`（按 UTF-16 码元比较，跨平台确定），不用 `localeCompare`
 *    —— 后者受 locale 影响。
 * 3. **目标集来自 git 索引**，与其余检查器一致。见 lib/gitfiles.js 的说明。
 */

const { SKILL_PARENTS, skillDirs, readTracked, trackedFiles } = require("./gitfiles");

const VENDOR_SKILLS_PARENT = SKILL_PARENTS[0]; // ".agents/skills"

/** 某个仓库相对目录下的全部已追踪文件。 */
function trackedUnder(prefix) {
  return trackedFiles().filter((p) => p.startsWith(`${prefix}/`));
}

/**
 * 构建清单对象。**不含时间戳**，因此对同一份工作区是逐字节确定的。
 *
 * @returns {{totalLocalSkills: number, totalLockedSkills: number,
 *            githubSkills: Array<object>, localOnlySkills: Array<object>,
 *            localOnlyCount: number}}
 */
function buildManifest() {
  const lockRaw = readTracked("skills-lock.json");
  if (lockRaw === null) {
    throw new Error("skills-lock.json 不在 git 索引里（或已从工作区删除）");
  }

  let lock;
  try {
    lock = JSON.parse(lockRaw);
  } catch (err) {
    throw new Error(`skills-lock.json 不是合法 JSON：${err.message}`);
  }

  const lockSkills = lock.skills || {};
  const lockedNames = Object.keys(lockSkills);

  // 磁盘上的上游技能：限定 .agents/skills 的深度 1 子目录，且 SKILL.md 已追踪
  const vendorSkills = skillDirs()
    .filter((s) => s.parent === VENDOR_SKILLS_PARENT)
    .map((s) => s.name)
    .sort();

  const lockedSet = new Set(lockedNames);

  const githubSkills = vendorSkills
    .filter((name) => lockedSet.has(name))
    .map((name) => {
      const info = lockSkills[name] || {};
      return {
        name,
        source: info.source,
        sourceType: info.sourceType,
        githubUrl:
          info.sourceType === "github" ? `https://github.com/${info.source}` : null,
        skillPath: info.skillPath,
      };
    });

  const localOnlySkills = vendorSkills
    .filter((name) => !lockedSet.has(name))
    .map((name) => ({
      name,
      files: trackedUnder(`${VENDOR_SKILLS_PARENT}/${name}`).map((p) =>
        p.slice(`${VENDOR_SKILLS_PARENT}/${name}/`.length)
      ),
    }));

  return {
    totalLocalSkills: vendorSkills.length,
    totalLockedSkills: lockedNames.length,
    githubSkills,
    localOnlySkills,
    localOnlyCount: localOnlySkills.length,
  };
}

/** 与提交进仓库的 local-skills.json 完全一致的序列化形式。 */
function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

module.exports = {
  VENDOR_SKILLS_PARENT,
  buildManifest,
  serializeManifest,
  trackedUnder,
};
