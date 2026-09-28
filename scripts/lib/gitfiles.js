"use strict";

/**
 * 目标集枚举的唯一入口。
 *
 * **一切都基于 git 索引，绝不递归扫描文件系统。** 这一条同时解决三类问题：
 *
 * 1. `.agents/skills/deep-research/.gitignore` 含 `*.json` + `!schemas/*.json`。
 *    递归扫描会看到将来被忽略的新 JSON，而 CI 的干净 clone 里根本没有它 ——
 *    那是一个必现的「本地红、CI 绿」。
 * 2. `custom/daily/skills-sync/.venv/` 与 `.DS_Store` 从未被追踪，不该进目标集。
 * 3. 判断「链接目标是否存在」必须查索引而不是 `fs.existsSync`：后者在大小写不
 *    敏感的 APFS 上对 `Foo.md` 会命中真实的 `foo.md`，在大小写敏感的 Linux
 *    runner 上则不会 —— 又一个天然的「本地绿、CI 红」。
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");

/** 技能目录的三个父目录。只认这三处的**深度 1** 子目录。 */
const SKILL_PARENTS = [".agents/skills", "custom/daily", "custom/projects"];

/** 上游 vendored 区。这里的违规一律只 warn，见各检查器的分级说明。 */
const VENDOR_PREFIX = ".agents/";

const EXIT_OK = 0;
const EXIT_FAIL = 1;
const EXIT_ABORT = 2;

/** 不在 git 仓库里时，所有检查都无从谈起。明确报错退出 2，而不是崩栈。 */
function requireRepo() {
  try {
    execFileSync("git", ["rev-parse", "--git-dir"], {
      cwd: REPO_ROOT,
      stdio: ["ignore", "ignore", "ignore"],
    });
  } catch {
    process.stderr.write(
      "✗ 本仓库的检查器以 git 索引为目标集，必须在克隆出来的仓库里运行。\n" +
        "  当前目录（或它的上级）没有 .git —— 从 GitHub 的 source tarball\n" +
        "  解压出来的目录就会是这样。请改用 git clone。\n"
    );
    process.exit(EXIT_ABORT);
  }
}

/**
 * 目标集：**会被提交的文件** = 已追踪 ∪ 未追踪但未被忽略。
 *
 * ## 为什么要带上「未追踪」
 *
 * 此前只取 `git ls-files`（已追踪）。这留下一个真实踩过的坑：
 * `task.py` 生成了 `.trellis/tasks` 下每个任务的 `task.json`，**提交前**跑 `lint.sh` 得到全绿，
 * 提交推送后 CI 立刻变红 —— 因为新文件还没进索引，检查器根本看不到它。
 *
 * 那破坏了这条命令存在的唯一理由（「本地过 = CI 过」）：**本地绿 CI 红是最坏的组合**，
 * 它让你以为安全，而其实不是。
 *
 * 而「未追踪但未被忽略」的文件，正是 `git add -A && commit && push` 之后 CI 会看到的
 * 那一批。把它们纳入，本地过才真的蕴含 CI 过（本地集 ⊇ CI 集）。
 *
 * 代价是可能出现「本地红 CI 绿」（那些文件如果最终没提交的话）。这个方向是**保守**的，
 * 而且自我纠正 —— 不想让某个文件被检查，就该把它写进 `.gitignore`，而不是让它悬在
 * 「随时可能被提交」的状态。
 *
 * ## 两个实现细节
 *
 * - 用 `-z` 而不是默认输出：`-z` 给出的是**未经引号转义的原始字节**，非 ASCII 路径
 *   （本仓库有中文文件名）可以直接用。默认输出受 `core.quotePath` 影响，中文会变成
 *   `\344\275\240` 这种形式，无法与真实路径比对。
 * - `--exclude-standard` 让 git 按 `.gitignore` 过滤，所以 `.venv/`、`.DS_Store`、
 *   `.claude/` 这些**永远不会进仓库**的东西仍然不在目标集里 —— 这一点没有变。
 */
function trackedFiles() {
  requireRepo();
  const run = (args) =>
    execFileSync("git", args, {
      cwd: REPO_ROOT,
      encoding: "buffer",
      maxBuffer: 64 * 1024 * 1024,
    })
      .toString("utf8")
      .split("\0")
      .filter((p) => p.length > 0);

  const tracked = run(["ls-files", "-z"]);
  const untracked = run(["ls-files", "-z", "--others", "--exclude-standard"]);
  // 去重并保持稳定顺序，保证输出可复现
  return [...new Set([...tracked, ...untracked])].sort();
}

/** 当前有多少未追踪但未被忽略的文件 —— 用于在 lint 收尾如实说明覆盖范围的边界。 */
function untrackedCount() {
  requireRepo();
  return execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\n")
    .filter((p) => p.length > 0).length;
}

/** 目标集的 Set 形式，用于 O(1) 的「这个路径在索引里吗」。 */
function trackedSet() {
  return new Set(trackedFiles());
}

/** 按扩展名筛选目标集（会被提交的文件）。 */
function trackedWithExt(ext) {
  return trackedFiles().filter((p) => p.endsWith(ext));
}

/** 按 glob 后缀筛选（如 `/SKILL.md`）。 */
function trackedWithSuffix(suffix) {
  return trackedFiles().filter((p) => p.endsWith(suffix));
}

/** `.agents/` 下的一律是上游 vendored 内容。 */
function tierOf(relPath) {
  return relPath.startsWith(VENDOR_PREFIX) ? "vendor" : "self";
}

/** 稳定的字典序，不依赖 readdirSync 的返回顺序。 */
function byName(a, b) {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * 真实技能目录。
 *
 * 技能 = `.agents/skills/`、`custom/daily/`、`custom/projects/` 的**深度 1**
 * 子目录，且该目录下有一个会随提交进入仓库的 `SKILL.md`。
 *
 * 深度限制是必须的，不是保守：plugin-creator 的 assets/templates 下有一个
 * 嵌套更深的 SKILL.md，它是一个**模板资产**而非技能，其 `name: skill-template`
 * 与所在目录名 `skill` 不符。用 git 的通配 pathspec 枚举 SKILL.md 会把它一并
 * 捞进来（pathspec 的 `*` 会跨目录分隔符匹配），制造一个无法修复的假失败。
 */
function skillDirs() {
  const tracked = trackedSet();
  const found = [];

  for (const parent of SKILL_PARENTS) {
    const absParent = path.join(REPO_ROOT, parent);
    if (!fs.existsSync(absParent)) continue;

    const entries = fs
      .readdirSync(absParent, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("."))
      .sort(byName);

    for (const ent of entries) {
      const rel = `${parent}/${ent.name}/SKILL.md`;
      if (!tracked.has(rel)) continue;
      found.push({
        name: ent.name,
        parent,
        dir: `${parent}/${ent.name}`,
        skillMd: rel,
        tier: tierOf(rel),
      });
    }
  }

  return found;
}

/** 读一个目标文件的内容。文件不在磁盘上时返回 null。 */
function readTracked(relPath) {
  try {
    return fs.readFileSync(path.join(REPO_ROOT, relPath), "utf8");
  } catch {
    return null;
  }
}

module.exports = {
  REPO_ROOT,
  SKILL_PARENTS,
  VENDOR_PREFIX,
  EXIT_OK,
  EXIT_FAIL,
  EXIT_ABORT,
  requireRepo,
  trackedFiles,
  untrackedCount,
  trackedSet,
  trackedWithExt,
  trackedWithSuffix,
  tierOf,
  skillDirs,
  readTracked,
};
