# 排错手册

这里收录的都是**真实遇到过**的问题。每一条按「现象 / 原因 / 解决」写，
报错原文保留原样 —— 你可以直接拿它去搜。

每条末尾都有一句**「什么情况下不该用这个方案」**：排错手册最容易帮倒忙的地方，
是让人用错方法把问题「消掉」而不是解决。

> 💡 这里没有你要的问题？先跑 `./scripts/lint.sh` —— 大部分问题它会直接告诉你。
> 仍然解决不了就开 issue，附上完整的报错输出。

---

## 快速定位

| 你看到的 | 跳到 |
| --- | --- |
| `本仓库的检查器以 git 索引为目标集` | [lint.sh 报「以 git 索引为目标集」](#lintsh-报以-git-索引为目标集) |
| 技能装上了，但 AI 完全不理它 | [技能装了但不生效](#技能装了但不生效) |
| `⚠ 跳过（目标已存在且不是软链接）` | [技能装了但不生效](#技能装了但不生效) |
| 我的改动在 `npx skills update` 之后没了 | [npx skills update 之后本地对 .agents/ 的改动消失](#npx-skills-update-之后本地对-agents-的改动消失) |
| `CI 总览` 红了，但点进去看不出哪一项失败 | [CI 总览报红但看不出哪一项失败](#ci-总览报红但看不出哪一项失败) |
| CI 说「提交信息规范」失败 | [提交信息被 CI 拒绝](#提交信息被-ci-拒绝) |
| `name「x」与所在目录名「y」不一致` | [name 与目录名不一致](#name-与目录名不一致) |
| `清单与仓库当前状态不一致` | [local-skills.json 与仓库不一致](#local-skillsjson-与仓库不一致) |
| `未安装 docker，本机也没有 zizmor` | [跳过 zizmor](#跳过-zizmor) |

---

## lint.sh 报「以 git 索引为目标集」

### 现象

在某个目录里跑 `./scripts/lint.sh`，所有检查器一起失败：

```text
✗ 本仓库的检查器以 git 索引为目标集，必须在克隆出来的仓库里运行。
  当前目录（或它的上级）没有 .git —— 从 GitHub 的 source tarball
  解压出来的目录就会是这样。请改用 git clone。
```

收尾还会有一行：

```text
以下检查未能执行（多半是环境问题，不是代码问题）：
  • 技能 frontmatter 校验
  • ...
  上述检查器以 git 索引为目标集，请确认在克隆出来的仓库里运行。
```

退出码是 **2**（「未能执行」），不是 1。

### 原因

所有检查器都以 `git ls-files` 的输出当目标集，而不是递归扫描文件系统 ——
理由见[架构与原理](ARCHITECTURE.md#为什么检查器以-git-索引为目标集而不是-find)。

从 GitHub 的 **source tarball**（`https://github.com/nicholyx/ai-skills/archive/refs/heads/main.tar.gz`）
解压出来的目录**没有 `.git`**，所以检查器拒绝执行。

> ⚠️ 注意这和「崩溃」是两回事。报错是明确写好的、指向原因的一句话；
> 崩溃会甩一段 `at Object.<anonymous>` 的栈。CI 里有一条断言专门区分这两者。

### 解决

```bash
# 换成 clone
git clone https://github.com/nicholyx/ai-skills.git
cd ai-skills
./scripts/lint.sh
```

如果你只是**想看看技能文件**而不是改它，用 tarball 完全可以 —— 只是别在那里跑检查器。

### 什么情况下不该用这个方案

- **不要为了让它跑起来而 `git init` 一个空仓库。** 那样索引是空的，
  每个检查器都会因为「目标集为空」而 exit 2，看起来还是失败 ——
  而且失败原因会变成「索引里没有文件」，比原来更难懂。
  真要用 tarball 的内容，就 `git init` + `git add -A` + 提交一次（CI 的
  `lint-selftest` 就是这么造沙箱的），否则「检查通过」这个结论毫无意义。
- **不要在 `scripts/` 之外的目录里跑 `lint.sh`。** 它会 `cd` 到脚本上一级
  （即仓库根），所以在仓库里任何位置跑都行；但在**仓库外面**直接调用它，
  `cd` 到的仍然是被调用的那个仓库。

---

## 技能装了但不生效

### 现象

技能确实装了（在 `~/.claude/skills/` 里看得到），但对 AI 说触发它的话，AI 完全没反应，
或者只是自己乱做一通。

如果是 `skills-sync` 装的，运行输出里会有这么一行：

```text
⚠ 跳过（目标已存在且不是软链接）: /Users/you/.claude/skills/my-skill
```

而脚本最终**仍然以退出码 0 结束**，汇总里「失败: 0」。

### 原因

两个独立的原因，先分清楚是哪一个：

**原因 A：目标位置有真实文件/目录，软链接根本没建起来。**

`skills-sync` 的规则是「**只创建不存在的软链接**」（`sync.py` 的 `create_symlink`）：
目标已存在、且**不是**软链接时，它打印 `⚠ 跳过` 就返回了 —— 不覆盖、不报错。
「跳过」不计入 `failed`，所以脚本会成功退出。

这种情形很常见：你以前手工把技能复制进 `~/.claude/skills/`，
现在改用 `skills-sync`，于是那份**副本**原地不动，链接永远建不上。
而那份副本可能是几个月前的旧版本 —— 技能「生效」了，但生效的是旧内容。

**原因 B：技能本身没被 AI 选中。**

技能靠 `SKILL.md` frontmatter 里的 `description` 触发。
`description` 写得含糊（「帮助处理代码相关任务」），或者你的措辞和它差太远，
AI 就不会选它。这不是装错了。

### 解决

**先确认到底是哪个**：

```bash
# 看它是软链接还是真实目录
ls -l ~/.claude/skills/my-skill

# 如果是软链接，看它指向哪、目标还在不在
readlink ~/.claude/skills/my-skill
```

- 输出以 `l` 开头且箭头指向 `~/.agents/skills/my-skill` → 是原因 B
- 输出是普通目录（`d` 开头，无箭头）→ 是原因 A

**原因 A**：把那份副本挪走，再跑一次同步：

```bash
# 先备份，确认新链接工作正常后再删
mv ~/.claude/skills/my-skill /tmp/my-skill.bak

uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type skills

# 确认现在是链接
ls -l ~/.claude/skills/my-skill
```

**原因 B**：看技能的 `description`，照着它的措辞再说一遍；或者改 `description`
让它更容易被选中（改完记得跑 `./scripts/lint.sh --only frontmatter`）。

### 什么情况下不该用这个方案

- **不要用 `rm -rf ~/.claude/skills/<名字>` 直接删。** 如果那是你唯一的一份本地改动，
  删了就没了；而且如果它本身是软链接，`rm -rf` 在某些 shell 下会顺着链接删到源目录。
  先 `mv` 到 `/tmp` 备份。
- **不要为了让链接建上而给 `sync.py` 加 `--force`**（它没有这个参数）。
  「不覆盖真实文件」是刻意的安全设计：那个真实文件可能是使用者手工维护的东西，
  静默覆盖比跳过坏得多。
- **不要因为「`⚠ 跳过` 不报错」就以为同步成功了。** 脚本退出码 0 只说明
  「没有失败」，不说明「全部接上了」—— 去看那几个计数。

---

## npx skills update 之后本地对 .agents/ 的改动消失

### 现象

你改了 `.agents/skills/<某个技能>/SKILL.md`（修了个错别字、补了条规则），
提交了，本地一切正常。某天跑了：

```bash
npx skills update
```

再 `git status`，改动没了 —— 文件回到了上游的版本。

### 原因

**这是设计，不是 bug。**

`.agents/skills/` 是 vendor 区，由 `skills-lock.json` 追踪，
`npx skills update` 按 lock **全量替换**这个目录。任何落在里面的本地修改
都只是延迟消失，而且消失时不会有任何提示。

同一个原因也解释了另一件事：CI 对 `.agents/**` 的违规只 warn 不 fail ——
因为那些问题**修了也会丢**。

### 解决

先判断这次修改属于哪一种：

| 你的修改是 | 正确做法 |
| --- | --- |
| 纯粹想同步上游最新版 | 什么都不用做，接受它 |
| 修一个上游的 bug，别人也该受益 | fork 上游仓库，改那边，给上游提 PR |
| 只为自己用，想长期保留 | 复制到 `custom/daily/<技能名>/`，在那边维护 |
| 想临时试一下 | 改完当天用完就还原，别提交 |

复制到 `custom/` 时记得改 frontmatter 的 `name` 让它和**新目录名**一致，
否则 `frontmatter` 检查器会失败：

```bash
cp -r .agents/skills/some-skill custom/daily/some-skill
# 然后把 custom/daily/some-skill/SKILL.md 里的 name 改成 some-skill
./scripts/lint.sh --only frontmatter
```

### 什么情况下不该用这个方案

- **不要试图通过 `.gitattributes` 或 `.gitignore` 保护 `.agents/` 的改动** ——
  那些机制管的是 git 的行为，而 `npx skills update` 是直接写文件系统，
  根本不看 git。
- **不要为了留住改动而把整个 `.agents/` 复制一份到 `custom/`。** 那是 7.7 MB、
  31 个技能，你会立刻背上「上游更新与我无关」的维护成本 ——
  而 `custom/` 的技能是**不会被 update 的**，等于你自己接管了它们的全部维护。
- **复制到 `custom/` 之前想清楚**：如果你的改动只有一行，而上游每天都在动，
  维护成本会比收益高。这类改动更适合提给上游。

---

## CI 总览报红但看不出哪一项失败

### 现象

PR 的检查列表里，`CI 总览` 是红的（它是唯一挂了分支保护的 check），
但点进去只看到一张表：

```markdown
## CI 检查结果

| 检查项 | 结果 |
| --- | :---: |
| 技能 frontmatter 校验 | ✅ |
| ... | ✅ |
| 相对链接校验 | ❌ |
| ... | |
```

或者更糟：表里某一行显示 `⚠️ 未纳入判据` / `⚠️ 意外跳过`，
而你不知道那是什么意思。

### 原因

`CI 总览`（job id `ci-summary`）**本身不跑任何检查**，它只汇总其它 job 的结果。
它的红只有三种来源：

| 表里的图标 | 含义 | 真正的问题在哪 |
| --- | :---: | --- |
| `❌` | 那个 job 失败了 | 点表里对应行的 job 名字，看它的日志 |
| `⚠️ 未纳入判据` | 那个 id 进了 `needs`，但汇总脚本里没有对应的 env 变量 | `ci.yml` 的 `ci-summary` 少了 `R_<ID>` env —— 配置错误，不是代码问题 |
| `⚠️ 意外跳过` | 非 `commit-messages` 的 job 出现了 `skipped` | 那个 job 的 `if` 条件写错了，不能当通过 |

后两种是**刻意设计成失败**的：`skipped` 被当成通过，等于把配置错误伪装成成功；
而「子 job 失败、汇总仍报成功」正是这套机制要防的那个缺陷
（见[架构与原理](ARCHITECTURE.md#为什么-ci-汇总表是派生出来的而不是手写三份)）。

### 解决

1. 打开 PR 的 **Checks** 页，或在 Actions 里打开这次运行
2. 看 `CI 总览` 的 **Summary**（那张表在 Step Summary 里，
   不在日志正文 —— 日志正文只会有一行 `::error::CI 未能全部通过`）
3. 找到标红的那一行，**点它的 job 名字**（不是 `CI 总览`），看那个 job 的日志
4. 本地复现那**一项**：

```bash
# 表里写「相对链接校验」，就用它的 id
./scripts/lint.sh --only links

# 表里写「提交信息规范」，本地只能补一半（见下一条）
./scripts/lint.sh --commits origin/main..HEAD
```

id 与显示名的对应关系：

```bash
./scripts/lint.sh --list
```

### 什么情况下不该用这个方案

- **不要直接重跑 `CI 总览`。** 它只是汇总，重跑它不会改变任何结果，
  只会浪费一轮 runner。
- **不要把 `⚠️ 意外跳过` 当成「无所谓」。** 那个 job 这一次什么都没检查。
- **不要在本地 `lint.sh` 全绿时就坚信 CI 会绿。** 有两项是本地覆盖不了的：
  **PR 标题**，以及需要 docker 的 `zizmor`（本机没装 docker 时它会被跳过，
  而 CI 里是会实跑的）。`lint.sh` 收尾会如实打印这两类差别 —— 请读那几行。

---

## 提交信息被 CI 拒绝

### 现象

CI 的 `提交信息规范` job 失败，日志里能看到逐条判定：

```text
校验提交信息
  ✓ feat(custom): 新增并接入 oss-bootstrap 技能
  ✗ Feat(custom): 新增技能
      → 类型必须小写，应写作「feat」。
  ✗ 优化了一下代码
      → 缺少类型前缀。
        允许的类型：feat fix docs ci chore refactor perf test style revert build

2 条不合规（共检查 3 条）
```

或者失败在 **PR 标题** 上 —— 提交信息全是好的，但标题是「修复一些bug」。

### 原因

这个 job 校验两样东西：

1. PR 里的**每一个提交**的信息（区间 `base.sha..head.sha`）
2. **PR 标题**

第 2 条的理由是 squash 合并后 PR 标题会成为提交信息。格式要求是约定式提交：

```text
<类型>(<范围>): <描述>
```

范围可省略；`!` 表示破坏性变更。类型必须小写，冒号后面必须有一个空格。

**本地 `lint.sh` 验不了这个**：PR 标题在 PR 建立之前根本不存在。
`--commits <区间>` 只能补齐「提交信息」那半段。

### 解决

```bash
# 看本地这段区间里有没有不合规的提交
./scripts/lint.sh --commits origin/main..HEAD

# 单独校验一条信息（改 PR 标题前先验一下）
./scripts/check-commit-msg.sh --message "docs: 建立文档体系与更新日志"

# 校验最近一次提交
./scripts/check-commit-msg.sh --last
```

如果只是**信息写错**（内容没问题）：

```bash
# 改最近一条
git commit --amend

# 改中间某一条（区间起始的提交）
git rebase -i origin/main
# 或者直接改 PR 标题 —— 如果标题是唯一的问题
```

以下这些不需要合规，会被自动放行：`Merge ...`、`Revert ...`、
`fixup!...`、`squash!...`、以 `#` 开头的注释行。

### 什么情况下不该用这个方案

- **不要用 `git rebase` 改写已经有人评审过的公共分支。** 这个仓库是一个人维护的，
  改 PR 分支没问题；但如果你是从别人的分支上协作，改写历史会让评审评论错位。
  那种情况直接改 PR 标题、或追加一个新提交说明。
- **不要为了绕过检查而把类型写成 `chore`。** `chore` 在列表里，
  但「用 `chore` 蒙过类型检查」会让 `git log` 失去意义 ——
  真正的问题是这条改动不知道该归哪类，那说明它该拆成两个提交。
- **不要因为「区间里没有提交」就以为校验过了。** 区间为空时退出码是 0，
  输出会明确写「没有可校验的内容」—— 那是「什么都没验」，不是「验过了」。

---

## name 与目录名不一致

### 现象

```text
✗ custom/daily/my-skill/SKILL.md:1  name「my_skill」与所在目录名「my-skill」不一致
```

### 原因

`name` 必须是 kebab-case（小写字母、数字、连字符），且**必须等于所在目录名**。
这条是本仓库自有的约定（官方校验器不查），全仓技能 100% 满足，所以可以锁死。

不一致通常来自：复制技能后忘了改名、用了下划线、或者技能改名时只改了目录。

### 解决

```bash
# 两个地方对齐：目录名，或 frontmatter 里的 name
./scripts/lint.sh --only frontmatter
```

改 `name` 时注意同步影响：`evals/evals.json` 里的 `skill_name` 也必须等于目录名
（`evals` 检查器会查）。

### 什么情况下不该用这个方案

- **不要为了「省事」把目录改成带下划线的名字。** kebab-case 是硬约束，
  下划线一样会失败。
- **不要重命名 `.agents/skills/` 下的技能目录来对齐 name。** 那是 vendor 区，
  `npx skills update` 会按 lock 恢复原状，你会得到一个改了又变回来的目录。
  上游的 name 与目录名不一致时，检查器只给 warn，不去动它。

---

## local-skills.json 与仓库不一致

### 现象

```text
✗ local-skills.json:0  清单与仓库当前状态不一致 —— 运行 node scripts/gen-local-skills.js --write 更新
  ⓘ 第一个差异在第 12 行：
    - 已提交：    "source": "old-owner/old-repo",
    + 期望值：    "source": "new-owner/new-repo",
```

### 原因

`local-skills.json` 是**生成物**，由 `skills-lock.json` + 磁盘上的技能共同决定。
它不会自己更新 —— 你 `npx skills add` / `npx skills update` 之后必须重新生成并提交。

`checks/vendor-lock.js` 会重建一份清单和提交的版本逐字节比对，
输出还刻意定位到**第一个差异所在的行** —— 「清单过时」这句话本身没有可操作性。

### 解决

```bash
node scripts/gen-local-skills.js --write
./scripts/lint.sh --only vendor-lock
git add local-skills.json
```

顺便确认一下 `skills-lock.json` 也提交了 —— lock 里有、磁盘上没有，
或者磁盘上有、lock 里没有，都会是 fail：

```text
✗ skills-lock.json:0  lock 里有「some-skill」，但 .agents/skills/some-skill/SKILL.md 不在 git 索引里
✗ .agents/skills/some-skill:0  技能在仓库里，但不在 skills-lock.json 中 —— 用 npx skills add 安装，或手工补进 lock
```

### 什么情况下不该用这个方案

- **不要手工编辑 `local-skills.json`。** 它是逐字节比对的生成物，
  手改的内容会在下一次生成时消失，而且中间这段时间检查器一直是红的。
- **不要为了让它过一次而把生成的文件从 `git add` 里去掉。**
  检查的是**索引里的版本**，不提交等于这项检查永远失败。

---

## 跳过 zizmor

### 现象

```text
▶ zizmor（工作流安全扫描）
  ⚠ 已跳过：未安装 docker，本机也没有 zizmor
  安装方式：安装 Docker（CI 就是用 docker 跑 zizmor），或 brew install zizmor
```

或者装了本机 zizmor 时会看到：

```text
  ⓘ 本机没有 docker，退而用本机 zizmor（zizmor 1.30.1）；CI pin 的是 ghcr.io/zizmorcore/zizmor:1.30.1。
```

收尾的 `本次有 N 项不是 CI 同源` 里也会出现它。

### 原因

`zizmor` 这一项的设计前提是**与 CI 同源**：CI 用
`docker run --rm -v "$PWD":/repo:ro ghcr.io/zizmorcore/zizmor:<pin> /repo --no-online-audits`，
`lint.sh` 优先跑完全相同的命令。没有 docker 时会退化成本机 zizmor，
并如实把这个差别打印出来 —— 因为「本机 zizmor 通过」和「CI 的 zizmor 通过」
可信度不同。

### 解决

```bash
# 方案一：装 Docker（推荐，这样本地与 CI 同源）
# 方案二：装本机 zizmor，接受它可能与 CI 版本不同
brew install zizmor

# 方案三：明确跳过它（本机没有 docker 时，它本来也会被跳过）
./scripts/lint.sh --skip zizmor
```

### 什么情况下不该用这个方案

- **不要因为本地跳过了就认为 CI 那一项会绿。** 它是**独立的一个 CI job**，
  本地跳过不会让它消失 —— 工作流安全问题只会在 CI 上暴露。
- **不要长期用 `--skip zizmor` 当默认。** 它是唯一一个在本地经常被跳过的项，
  也正因为如此，它是最容易积累未发现问题的那一项。
- **不要为了「版本一致」而在本地随意拉一个 zizmor 镜像。**
  版本 pin 的唯一真源是 `.github/workflows/ci.yml` 的 `env:`，
  `lint.sh` 从那里读，手动指定别的版本只会让结果更不可比。

---

## 还是没解决？

开 issue 时请附上：

1. **完整的命令** —— 你敲的那一行（`--only` / `--skip` 都算关键信息）
2. **完整的输出** —— 从第一行到最后一行，别只截报错那句；
   `lint.sh` 的收尾汇总（通过 / 失败 / 跳过 / 不同源）本身就是诊断信息
3. **环境** —— 操作系统、`node --version`；如果涉及外部工具，
  `shellcheck --version`、`actionlint --version` 之类的输出
4. **技能相关** —— 出问题那个技能的目录路径和它的 `SKILL.md` frontmatter

大部分情况下，第 1 和第 2 项就够定位了。
