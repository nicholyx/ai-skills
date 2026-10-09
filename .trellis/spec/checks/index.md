# 检查器与 CI 规范

自动化检查分两层：`scripts/checks/*.js`（一组零依赖 Node 检查器）、
`scripts/lint.sh`（本地统一入口）、`.github/workflows/ci.yml`（CI）。

> 这里**不写检查器的个数**。原先写的是「六个」，而实际在长到十二个的过程中没人发现 ——
> 计数散落在散文里就会这样。要知道有哪些，跑 `./scripts/lint.sh --list`；
> 要防止别处的计数漂移，用 `scripts/checks/doc-counts.js`。

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

**这条规则对「文件模式」同样成立。** `checks/scripts.js` 检查入口脚本的可执行位，
它原先只遍历 `git ls-files -s` —— 而**新加**的入口脚本还没 `git add`，索引里查不到模式，
于是**本地静默通过、CI 才红**（真实踩过：`scripts/run-evals.js` 以 `100644` 提交）。
现在：已追踪的读索引模式（那才是会被提交的），未追踪的读工作区权限位（提交时会带上它）。

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

### `.claude-plugin/marketplace.json` 是承重件（2026-10-01 实测）

它明面上是第二条安装通道（`claude plugin marketplace add`），但它同时**决定技能发现面**。

同一个仓库、同一条命令 `npx skills add . --list`，换目录就换答案：

| 场景 | 无 marketplace.json | 有 |
| --- | --- | --- |
| 本机工作区（含未追踪文件） | **47** | 16 |
| `git clone` 出来的副本 | 16 | 16 |

多出来的 31 个全是 vendored 技能的**游离副本**。本机的来源已定位到
`.trellis/.backup-2026-09-30T17-53-28/` —— Trellis 留下的**全仓快照**（未被追踪，
里面含一份 `.agents/skills/`）。逐项二分过程：移走 `.claude/` → 仍 47；移走
`.agents/` → 仍 47；**移走 `.trellis/` → 16**。

两条教训：

- **「换个目录结论就变」不是玄学 —— 发现规则取决于工作区里有什么。** 报结论必须说清
  在哪个上下文量的（见 [maintenance/index.md](../maintenance/index.md)
  「报数字要说清口径」）。这次差一点就把「使用者会被装进 31 个上游技能」写进 README，
  而**用户克隆下来两种情况下都是 16** —— 那是句错话，且是「没实测就印在落地页上」那种。
- **有 marketplace.json 时发现面被钉死在声明的 16 个**，对工作区里的游离副本免疫
  （Trellis 快照、`.claude/worktrees/**` 下的 git worktree 副本 —— 每个都是全仓拷贝）。

`catalogue.js` 断言它存在且与生成器一致。**变异验证**：删掉该文件 → `catalogue.js` 报红
（已实测）。E2E 环节 6 另外独立验一次分发面。

## 技能目录校验：一致 **+ 覆盖**

`catalogue.js` 管的是**每个技能在访客面前露没露面**。三条断言：

1. `docs/SKILLS.md` 与技能源头一致
2. `README.md` 的生成区与源头一致（逐字节；且只替换标记之间那两段，手写正文永不判过时）
3. **覆盖** —— 每个自建技能都必须在某一块生成区的**渲染结果**里露面（2026-10-01 补）

### 第 3 条为什么必须有

前两条只覆盖 `README_BLOCKS` 里列出的那些 `parent`，而**那张表是手写的**。删掉一块、
或把某个 `parent` 写错，比对照样全绿 —— 而那一组技能就从 README 上消失了，
`docs/SKILLS.md` 与插件市场清单里却还有它。

> 同一件事在别处**有**人守：新增一个技能层级要同时改 `gitfiles.js` 的 `SKILL_PARENTS`
> 与 `distribution.js` 的 `ALLOWED_PREFIXES`，那两处漏改会红。**唯独 README 这一处
> 原先无人守。**

**变异验证**（维护者独立复跑，不是采信报告）：从 `README_BLOCKS` 删掉 `projects` 块 →

```
✗ README.md  技能 `prj-agent-platform-e2e-test`（custom/projects/…）没有进 README.md 的任何一块生成区。
   原因：它的父目录 `custom/projects` 不在 `README_BLOCKS` 的任何一块里。
✗ 未通过：1 处失败     exit=1
```

复原后 exit=0，且 `gen-catalogue.js` 逐字节还原。

**为什么比对渲染结果**：渲染结果才是读者真正看到的东西。结构对得上、渲染器却漏掉了
某个技能（改了过滤条件之类），同样是「技能没进 README」。比对磁盘上的 README 原文则
是另一条断言（第 2 条）的职责，别混。

**已知未管**：某块的 `parent` 底下一个技能都没有时会渲染出只有表头的空表，目前没有断言。

## 技能自洽校验：断言「技能自己说的和有的对得上」

其余的检查器查的是**格式**（frontmatter 合不合规、目录与源头是否一致）。`skill-integrity.js`
查的是另一件事：**这个技能装上以后，能不能按说明用起来**。下列三类故障都看不出格式问题：

| 规则 | 症状 | 谁会撞上 |
| --- | --- | --- |
| A 指向本技能目录的路径必须存在 | 把 `reference/x.md` 改名，技能**静默失效** | 维护者 |
| B `metadata.example` 必须在 `description` 里 | 目录里教用户说的那句话，模型根本看不到 | 使用者 |
| C `description` 不得留脚手架占位符 | 技能带着一句「【待补】…」上线 | 使用者 |

### 规则 A 的判据：怎么区分「本技能的文件」和「别的仓库的文件」

不能把所有相对路径都当本地 —— 实测会误报。仓库里就有反例：`maintain-loop` 引用的
`./scripts/lint.sh` 是**目标仓库**的脚本（它是通用技能），`obsidian-note-workflow` 引用的
`_metadata_/tag-rules.md` 是**用户 vault** 的结构。

判据取路径的**第一段**：那一段在技能目录里存在 → 本技能的文件，整条路径必须解析得到；
不存在 → 外部引用，跳过。引入时对全仓零误报（`repo-analyzer` 的 11 处 `reference/**`
判为本地，5 处外部引用判为跳过）。

**已知的漏网**：不含 `/` 的裸文件名（`package.json`、`bug-analyzer.md`）不检查 —— 无法
可靠区分本地与目标仓库。`repo-analyzer` 提的 `package.json` 是被分析仓库的，
`bug-analyzer-agent` 提的 `bug-analyzer.md` 却是自己的。放宽就会立刻误报，所以宁可漏。

### 规则 B 为什么盯的是 `description` 而不是正文

第一版写的是「示例必须出现在正文里」。实测把它推翻了，两处都值得记下来：

1. **正文管不了触发。** 正文是技能被唤起**之后**才加载的，所以断言不该落在正文上。
2. **第一版的度量是恒真的。** 它取的是 `parseFrontmatter()` 的 `body` 字段 —— 那是
   **frontmatter 内部**的行，而 `metadata.example` 恰恰就写在那里，于是断言永远成立
   （15/15）。**是变异测试把它揭出来的**：真正的正文命中率只有 2/15。

这条教训写进了 `lib/frontmatter.js`：**文档正文用 `docBody`，别用 `body`**。

### 变异验证（每条都实际跑过）

| 变异 | 结果 |
| --- | --- |
| 改名 `repo-analyzer/reference/quality-standards.md` | 抓到（2 处，带行号）|
| 把 `metadata.example` 换成描述里没有的话 | 抓到 |
| 从 `description` 里删掉触发说法 | 抓到 |
| 隔离副本里跑 `new-skill.js` 后不补描述 | 抓到（规则 C）|

## 锚点校验：vendor 而不是手写

`anchors.js` 查的是**自建 Markdown 里带 #fragment 的链接**（纯锚点与相对链接
带锚点）在目标文件里有没有对应的 heading。在此之前锚点没有任何检查——
SUPPORT.md 的死锚点是手工发现的。

### 为什么必须 vendor github-slugger

GitHub 生成锚点的算法不在 Markdown 规范里，行为是一堆实测事实：`：`、`「」`、
`（）`等中文标点与反引号、句点、斜杠都被删；`-` 与 `_` 保留；**连续横线不
合并**；重复 heading 按已生成过的 slug 计数加 -1/-2 后缀。

手写简化版**已被证明会误报**：曾把 docs/USAGE.md 里
`skills-sync同步到-claude-code--codebuddy` 这个真实锚点判成 DEAD——简化版合并
了连续横线，而标题「…Claude Code / CodeBuddy」里斜杠被删、两侧空格各成一条
横线，**双横线才是正确结果**。会误报的检查比没有检查更糟，所以
`scripts/lib/slug.js` 逐字节照搬了 github-slugger v2.0.0（MIT）的 regex 与
BananaSlug 类，仅做 CommonJS 化。**regex 一个字符都不要改**——变异验证表里的
「退化版」一行守着这一点。

去重按「已生成过的 slug 集合」计数，不是按 heading 文本排（上游 fixtures 的
实例：`echo` → `echo`；再一个 `echo` → `echo-1`；`echo 1` → `echo-1-1`；
`echo-1` → `echo-1-2`；第三个 `echo` → `echo-2`）。vendored 的 while 循环天然
就是这个行为，别简化成按文本计数。

### 口径

- 范围与 `links.js` 完全一致：自建 md，不含上游。`links.js` 管目标文件的
  存在性，这里管 heading 的存在性，不重复报
- 只认 ATX 标题；GFM 允许行首**至多 3 个空格**的缩进、GitHub 为缩进标题照常
  生成锚点，所以缩进的也认（验收 V2 抓到过这个缺口：不支持会把合法缩进
  标题的链接误报成死锚点）。4 个及以上空格是缩进代码块，不认。setext 标题
  不认（本仓库没有）；frontmatter 与 fenced code block（三个反引号或三个
  波浪线的围栏，按同种字符配对）跳过
- heading 剥行内 markdown 后再算 slug（GitHub 对**渲染后**的文本算）：图片
  **整个剥掉、alt 不进 slug**（img 对 textContent 无贡献）；链接留文本且先于
  强调剥；`_` 强调带词边界（词内下划线不是强调，`skills_sync_mode` 原样保留）
- 每个文件独立的 BananaSlug 实例，重复计数不跨文件
- fragment 先按字面、再按 `decodeURIComponent` 解码后匹配（链接里写的可能是
  百分号编码）；坏编码（如 `%zz`）判死锚点，不让检查器崩

### 变异验证（每条都实际跑过，2026-10-10）

| 变异 / 探针 | 结果 |
| --- | --- |
| README.md 活锚点改坏一个字（技能清单 → 技能清单X） | 抓到（README.md:13，exit 1） |
| 改名 CONTRIBUTING.md 的 `## 本地验证工作流`，链接不动 | 抓到（同文件 TOC 与 SUPPORT.md 跨文件各一处） |
| 加指向 `-1` 后缀的链接，后缀尚不存在 | 抓到；复制同名 heading 后转绿（重复计数生效） |
| fenced 块里放与真 heading 同名的 `#` 行，且置于真 heading 之前 | 不误报，标题数不变（787）——若围栏失效，真 heading 会被挤成 `-1` 而报死 |
| slug 换成「合并连续横线」的退化版 | 抓到：两条指向 `code--codebuddy` 的链接双双报红（正是历史误报的形状） |
| 新 heading `## [虚拟标题](https://example.com)` + 链接 `#虚拟标题` | 判活（行内链接语法剥离正确） |
| heading 含 `![替代文本](x.png)`，链接指向剥离后文本 | 判活（alt 不进 slug） |
| echo 序列（上游 fixtures）：echo / echo / echo 1 / echo-1 / echo | 生成 echo、echo-1、echo-1-1、echo-1-2、echo-2，逐一对上 |
| heading 缩进 3 空格（GFM 合法），链接不动 | 修复前误报死锚点（验收 V2 抓到的缺口）；支持缩进后判活，标题数恢复 |
| heading 缩进 4 空格（缩进代码块），链接不动 | 报死锚点——GitHub 不为它生成锚点，这是正确方向，不是误报 |

基线：44 个自建 md、97 条带锚点链接、0 死锚点；`./scripts/lint.sh` 19 项全绿。

## 供应链基线

`zizmor` 基线 0 findings，豁免集中在 `.github/zizmor.yml`，**每条豁免必须写明可
验证的安全依据**。新增 `uses:` 引用必须 pin 到 commit SHA + 注释版本号；所有
checkout 保持 `persist-credentials: false`。慎用 `pull_request_target` —— 只有在
**不 checkout PR 代码**时才可接受，且必须在 `.github/zizmor.yml` 里说明理由。
