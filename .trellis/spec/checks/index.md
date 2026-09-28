# 检查器与 CI 规范

自动化检查分两层：`scripts/checks/*.js`（六个零依赖 Node 检查器）、
`scripts/lint.sh`（本地统一入口）、`.github/workflows/ci.yml`（CI）。

## 退出码语义（全仓统一，不可协商）

| 码 | 含义 | CI 行为 |
| --- | --- | --- |
| 0 | 检查执行完成，无 fail 级问题（可能有 warn） | success |
| 1 | 检查执行完成，存在 fail 级问题 | failure |
| 2 | **检查未能执行**（目标集为空 / 不在 git 仓库内 / 输入非法） | failure |

**2 单独成一类**：读者要能分清「你要改代码」和「你要装东西 / 换个目录再跑」。
CI 那边 1 和 2 都是红，一样不放过。`lint.sh` 把 2 单列为「以下检查未能执行
（多半是环境问题）」，与「以下检查未通过」分开显示。

## 分级：self fail / vendor warn

| tier | 范围 | 分级 |
| --- | --- | --- |
| `self` | 除 `.agents/` 之外的一切 | fail |
| `vendor` | `.agents/**` | warn（`VENDOR_STRICT=1` 可提升为 fail） |

**vendor 不设 fail**：任何自动修复都会在 `npx skills update` 时丢失，设成 fail
等于让 CI 永久红。

**vendor 也不排除**：排除等于看不见。上游下次引入「缺 `name`」或「description
含控制字符」的技能，恰恰会让它在 Claude Code 里加载失败 —— 而本仓库的唯一用途
就是「这些技能能被加载」。warn 的代价只是每次多 3 行输出。

本地与 CI 采用**同一套分级**，所以「本地绿 = CI 绿」在分级语义上仍然成立。

风格类检查（BOM、末尾换行）只对 self 生效：上游有 20 多处文件缺末尾换行、6 个
`.xsd` 带 BOM，每次运行都报一遍只会训练读者忽略输出。

同样的理由，`.trellis/.version` 与 `.trellis/.template-hashes.json` 也被豁免 ——
它们是 **trellis 自己写的记账文件**，会在 `trellis update` 时被重写。用本仓库的风格
约定约束它们，等于给未来的例行维护埋一个「CI 突然变红」。**只豁免风格检查**，
正确性检查（UTF-8、U+FFFD、JSON 可解析）照常执行。

## 目标集 = 「会被提交的文件」

目标集是 **`git ls-files` ∪ `git ls-files --others --exclude-standard`**
（已追踪 ∪ 未追踪但未被忽略），由 `scripts/lib/gitfiles.js` 的 `trackedFiles()` 统一提供。

**永远用它枚举，不要 `find` / `readdir` 递归。** 三个理由：

1. `.agents/skills/deep-research/.gitignore` 含 `*.json` + `!schemas/*.json`。
   递归扫描会看到 CI 的干净 clone 里根本不存在的文件 —— 必现的「本地红、CI 绿」
2. `custom/daily/skills-sync/.venv/` 与 `.DS_Store` 从未被追踪，不该进目标集
3. 判断「链接目标是否存在」必须查索引而非 `fs.existsSync`：后者在大小写不敏感的
   APFS 上会对 `Foo.md` 命中真实的 `foo.md`，在 Linux runner 上则不会

技能枚举还多一条：**只认三个父目录的深度 1 子目录**，不能用通配 pathspec 枚举
`SKILL.md`。`plugin-creator/assets/templates/skill/SKILL.md` 是一个**模板资产**，
它的 `name: skill-template` 与目录名 `skill` 不符，捞进来会制造无法修复的假失败。

### 为什么带上「未追踪」

此前只取 `git ls-files`（已追踪），留下一个**真实踩过的坑**：

`task.py` 生成了 `.trellis/tasks` 下每个任务的 `task.json`（末尾无换行），
**提交前**跑 `lint.sh` 得到全绿，提交推送后 CI 立刻变红 —— 新文件还没进索引，
检查器根本看不到它。

那破坏了这条命令存在的唯一理由。**「本地绿 CI 红」是最坏的组合**：它让你以为安全，
而其实不是。

而「未追踪但未被忽略」的文件，正是 `git add -A && commit && push` 之后 CI 会看到的
那一批。纳入它们，本地过才真的蕴含 CI 过（**本地集 ⊇ CI 集**）。

**代价是可能出现「本地红 CI 绿」**（那些文件如果最终没提交的话）。这个方向是保守的、
且自我纠正 —— 不想让某个文件被检查，就该把它写进 `.gitignore`，而不是让它悬在
「随时可能被提交」的状态。

> `--exclude-standard` 让 git 按 `.gitignore` 过滤，所以 `.venv/`、`.DS_Store`、
> `.claude/` 这些**永远不会进仓库**的东西仍然不在目标集里 —— 这一点没有变。

`lint.sh` 收尾会如实说明「本次目标集 N 个文件尚未 git add」，免得读者以为只查了
已提交的内容。

## 写一个新检查器

```js
#!/usr/bin/env node
"use strict";
const { Report } = require("../lib/report");
const { trackedFiles, tierOf } = require("../lib/gitfiles");

const report = new Report("检查项显示名");

const files = trackedFiles();
if (files.length === 0) report.abort("目标集为空，说明原因");  // 退出 2

for (const rel of files) {
  report.at(tierOf(rel), rel, 0, "问题描述");   // 按 tier 自动分级
}
report.info("扫描了 N 个文件。");               // 结尾的事实性说明
report.finish();                                // 0 或 1
```

- 复用 `scripts/lib/` 的 `gitfiles` / `report` / `frontmatter` / `manifest`，
  **不要各写一份**
- 用 `report.at(tier, ...)` 让分级由 tier 决定；`report.warn` / `report.fail` 只在
  「与 tier 无关」时用（如 JSON 语法错误没有「上游风格」的解释空间）
- 新检查器要被 `lint.sh` 的 `CHECKS` 数组收录，**并在 `ci.yml` 里有一个同名 job**
  —— `lint-selftest` 会断言两者集合相同，防止「加了本地检查却忘了接进 CI」

## lint.sh 与 CI 的关系

- `lint.sh --list` 输出的 id 与 `ci.yml` 各 job 的 id **逐字对应**
- 工具版本 pin 的**唯一真源**是 `ci.yml` 的 `env:`，`lint.sh` 用 `ci_env()` 抽取，
  不写第二份。本机版本与 pin 不一致时记入「非 CI 同源」清单并在结尾单列 ——
  那不是失败，而是「这个通过的可信度与 CI 的不同」
- **它不覆盖 PR 标题**。CI 的 `commit-messages` job 校验 PR 里的提交与 PR 标题，
  而标题在 PR 建立之前不存在。`--commits <区间>` 只补齐前半段

## 中文内容的坑（都真实踩过）

**每次编辑中文内容后必须全仓扫描 U+FFFD**：

```bash
python3 -c "
import pathlib
bad=[str(p) for p in pathlib.Path('.').rglob('*') if p.is_file() and '.git' not in p.parts
     and chr(0xfffd) in p.read_text(encoding='utf-8', errors='ignore')]
print(bad if bad else 'OK')
"
```

- **不要在会被检查的文件里写 U+FFFD 的字面量**。`hygiene.js` 检测替换字符时用的是
  `"\uFFFD"` 转义 —— 写字面量会让这个检查器把自己报成违规
- **块注释里不要出现 `*/` 的字节序列** —— 它会提前闭合注释。最容易中招的是写路径通配，
  比如 `**/` 里就含 `*/`（**已踩过两次**，两次都把整个文件变成语法错误）。改成
  「tasks 目录下的 task.json」这样的措辞。
- **注释里不要出现 shellcheck 指令字样**。它会被当成真指令解析，触发莫名的
  SC1072/SC1073（已踩过一次）
- **批量改中文文档用「按行索引」，别用长中文串做匹配锚点**：长句里混入一个替换
  字符就会静默匹配失败或错位
- **`sed 's/x/y\nz/'` 的 `\n` 在 GNU sed 里是换行、在 BSD sed 里是字面的 n。**
  需要插入行时用 `{ head -n 1 f; echo ...; tail -n +2 f; } > tmp && mv tmp f`，
  否则本地静默不生效、断言变成恒真

## 分布面校验：断言「仓库在别人眼里长什么样」

多数检查器查的是**仓库内部是否自洽**（格式、链接、编码）。`distribution.js` 查的是
另一件事：**仓库对外分发的技能集合**。

起因是一个真实缺陷：接入 Trellis 后 `.claude/skills/`（9 个 Trellis meta-skill）把
`custom/` 顶掉了，`npx skills add nicholyx/ai-skills` 装出来的是 9 个 Trellis 内部
技能。**它不在任何 diff 里，也不会让任何一项检查变红。**

### 为什么断言结构，而不是跑 `npx skills --list`

实测过 CLI 的发现规则，它比想象的复杂，且**不是**「任何含 SKILL.md 的目录」：

| 仓库结构 | 默认 `--list` |
| --- | --- |
| 只有 `custom/daily/x` | 发现 x |
| 只有 `.agents/skills/x` | 发现 x |
| 只有 `.claude/skills/x` | 发现 x |
| `custom/daily/x` + `.agents/skills/y` | **只**发现 y |
| 三者共存 | 发现 y 与 `.claude` 的，`custom` 仍被顶掉 |

规则还受 `--full-depth`、以及仓库是否存在 `skills-lock.json` 影响。
**复刻这条规则写出来的断言会跟着一起错**，而断言的失效是静默的。

所以断言的是一个**不依赖 CLI 优先级**的结构不变量：让「多个来源」这件事根本不发生 ——
仓库里只允许 `custom/daily/`、`custom/projects/`、`.agents/skills/` 三处出现 SKILL.md。

### 它抓什么、不抓什么

**变异验证**（每条都实际跑过）：

| 变异 | 结果 |
| --- | --- |
| `.claude/skills/` 被强制追踪 | 抓到 |
| 新增一个**未预料到**的工具目录 `tool-x/skills/` | 抓到 ← 复刻规则做不到这个 |
| 删光 `custom/`（产品面为空） | 抓到 |
| 仓库根放一个技能目录 | 抓到 |

**两道防线的关系**：`.gitignore` 里 `.claude/` 是第一道（`git add -A` 不会带上它），
这个检查器是第二道（万一有人 `-f` 强加、或新增了别的工具目录）。

> **`.gitignore` 不是断言。** 它挡住的是常规操作，挡不住 `git add -f`、
> 也挡不住「另一个工具往别处写技能目录」。所以两层都要有。

## 供应链基线

`zizmor` 基线 0 findings，豁免集中在 `.github/zizmor.yml`，**每条豁免必须写明可
验证的安全依据**。新增 `uses:` 引用必须 pin 到 commit SHA + 注释版本号；所有
checkout 保持 `persist-credentials: false`。慎用 `pull_request_target` —— 只有在
**不 checkout PR 代码**时才可接受，且必须在 `.github/zizmor.yml` 里说明理由。
