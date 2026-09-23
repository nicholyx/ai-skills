# 架构与原理

这篇写给**想改这个仓库的人**。它不教你怎么用技能（那是[使用指南](USAGE.md)的事），
只回答一个问题：**为什么这里的东西长这样。**

每个设计决策下面都记着被否掉的方案 —— 那些方案大多看起来更简单，
而它们被否掉的原因往往不是「不好看」，是某次实测里它们真的错了。

---

## 目录

- [这个仓库解决什么问题](#这个仓库解决什么问题)
- [整体结构](#整体结构)
- [一次改动的完整流程](#一次改动的完整流程)
- [检查器的工作方式](#检查器的工作方式)
- [关键设计决策](#关键设计决策)
- [scripts/ 各文件职责](#scripts-各文件职责)
- [CI 结构](#ci-结构)
- [被否掉的方案一览](#被否掉的方案一览)
- [安全模型](#安全模型)

---

## 这个仓库解决什么问题

一个技能仓库的全部价值，就是「**这些技能能被 AI 工具正确加载**」。
而「能不能加载」取决于一堆看不见的格式契约：

- `SKILL.md` 的 frontmatter 能不能被解析（键在白名单里吗？`name` 和目录名一致吗？）
- 文件编码对不对（有没有 BOM？是不是合法 UTF-8？中文有没有被写坏？）
- 换行符对不对（带 CRLF 的 shebang 会让脚本直接执行失败）
- 文档里的相对链接还指得到东西吗？
- `skills-lock.json` 和磁盘上的技能还对得上吗？

这些都不难查，但**没有一条会自己暴露**：技能写坏了，编辑器不会报错，
`git commit` 不会报错，装上之后 AI 工具只是「没反应」。等到发现的时候，
可能已经过了几个月，而且不知道是哪次改动弄坏的。

所以这个仓库自带的不是「功能」，是一层**静态检查**：把这些契约写成可执行的断言，
在合并前跑一遍。

---

## 整体结构

```text
ai-skills/
├── .agents/skills/          # ← 上游 vendor 区，31 个技能，只读
│   └── <skill>/SKILL.md
├── custom/
│   ├── daily/               # ← 自建通用区，12 个技能
│   │   └── <skill>/SKILL.md
│   └── projects/            # ← 自建项目专用区，1 个技能
│       └── prj-<...>/SKILL.md
├── docs/                    # 本目录
├── scripts/
│   ├── lint.sh              # 本地统一校验入口
│   ├── check-commit-msg.sh  # 约定式提交校验
│   ├── checks/*.js          # 六个检查器
│   ├── lib/*.js             # 检查器共用层
│   └── gen-local-skills.js  # local-skills.json 生成器
├── skills-lock.json         # 上游技能的来源与版本
└── local-skills.json        # 上游技能的人读清单（生成物）
```

三个技能父目录是**互不相同的信任级别**，这是整个仓库最重要的一条分界线：

| 父目录 | 信任级别 | 违规后果 |
| --- | --- | --- |
| `.agents/skills/` | vendor（别人的） | 只 warn，不阻塞 CI |
| `custom/daily/` | self（我们的） | fail，阻塞 CI |
| `custom/projects/` | self（我们的） | fail，阻塞 CI |

判定只看路径前缀（`lib/gitfiles.js` 的 `tierOf`）：`.agents/` 开头即 vendor，其余 self。

---

## 一次改动的完整流程

```text
改技能 / 改脚本
      │
      ▼
./scripts/lint.sh            ← 本地 10 项静态检查
      │                        exit 0 才继续
      ▼
git commit                   ← 提交信息走约定式提交
      │
      ▼
git push + 开 PR
      │
      ▼
CI：10 个静态检查 job
    + 提交信息规范（含 PR 标题）
    + lint.sh 自测
      │
      ▼
CI 总览（唯一挂了分支保护的那个 check）
      │
      ▼
合并
```

关键点：CI 里的 10 个静态 job 与 `./scripts/lint.sh` 的 10 个检查项**逐字对应**，
`lint-selftest` job 会断言这一点。所以「本地过 = CI 过」不是口号，是有断言守着的性质。

---

## 检查器的工作方式

### 目标集来自 git 索引

所有检查器都不递归扫描文件系统，而是拿 `git ls-files -z` 的输出当目标集
（`lib/gitfiles.js` 的 `trackedFiles()`）。这一条同时解决三类问题，详见
[为什么检查器以 git 索引为目标集](#为什么检查器以-git-索引为目标集而不是-find)。

用 `-z` 而不是默认输出也有原因：`-z` 给出的是**未经引号转义的原始字节**，
本仓库有中文文件名，默认输出会把它们变成 `\344\275\240` 之类的转义形式，无法与真实路径比对。

### 退出码语义

| 码 | 含义 | CI 行为 |
| --- | --- | --- |
| 0 | 检查执行完成，无 fail 级问题（可能有 warn） | success |
| 1 | 检查执行完成，存在 fail 级问题 | failure |
| 2 | **检查未能执行**（目标集为空 / 不在 git 仓库内 / 输入非法） | failure |

把 2 从 1 里分出来，是为了让读者分得清「**你要改代码**」和「**你要装东西 / 换个目录再跑**」。
CI 那边 1 和 2 都是红，一样不放过。

`lint.sh` 还会把这三类分开计数（通过 / 失败 / 跳过），并额外记一笔
`NONSYNC_NOTES` —— 「跑了，但不是 CI 同源」（多半是本机工具版本与 CI pin 不一致）。
理由：那种「通过」和 CI 的「通过」可信度不同，而三计数分不出这个区别。

### 分级由 tier 决定，不由规则决定

规则本身只标「有多硬」（BOM、CRLF 是风格提示；缺 `name` 是硬失败），
**是否阻塞由 tier 决定**（`lib/report.js` 的 `at()`）：

```text
self   → fail
vendor → warn（加 VENDOR_STRICT=1 或 --strict-vendor 时升为 fail）
```

有两个无条件 fail 的例外，与 tier 无关：JSON 语法错误（没有「上游风格」的解释空间），
以及自建文件缺末尾换行（`.editorconfig` 已经声明了 `insert_final_newline`，
遵守它的编辑器会自动补上；这里报错说明有人绕过了编辑器配置，而修复成本是零）。

---

## 关键设计决策

### 为什么 `.agents/` 是只读 vendor 区

`.agents/skills/` 里的 31 个技能是 `npx skills add` 从上游仓库装来的，
由 `skills-lock.json` 追踪，`npx skills update` 按 lock **全量替换**。

既然会被替换，任何落在里面的本地修改都只是**延迟消失**：今天修好了，
下次 `npx skills update` 之后它连同这次修改一起不见，而没有任何东西会提醒你。
更糟的是修的人和用的人往往不是同一个人 —— 你在 CI 里看到它绿了，以为问题解决了。

所以这里的规则是：

- **不改 `.agents/**`**。发现问题就 fork 上游、给上游提 PR，或者把技能复制进
  `custom/` 自己维护。
- `.agents/` 占仓库约 97% 的体积（7.7 MB / 8.0 MB），但它**不是**这个仓库的作品 ——
  它是被追踪的第三方内容，`local-skills.json` 的唯一作用就是让人一眼看清里面有什么、
  分别从哪来。

> 💡 一个副作用：`npx skills update` 之后 `git status` 会显示大量改动，那是正常的，
> 那也是唯一需要提交 `.agents/` 改动的时刻。

### 为什么上游的违规只 warn 而不 fail，但也不排除

这是本仓库最容易被质疑的一条：既然不改上游，为什么不干脆**把 `.agents/**` 从检查范围里排除**？

**因为排除等于看不见。**

上游下次引入一个「缺 `name`」或「`description` 含控制字符」的技能，恰恰会让它在
AI 工具里**加载失败** —— 而这个仓库的唯一用途就是「这些技能能被加载」。
把 vendor 区排除掉，就等于在最要紧的地方装了个盲区：CI 全绿，技能却装不上。

warn 的代价只是每次多几行输出，而被否掉的方案（排除）的代价是看不见真实故障。

当前 44 个技能里，上游有 3 处 frontmatter 额外键（`hidden`、`tags`、`user-invocable`/`hooks`），
每次 lint 都会如实打印并注明「上游 vendored，不阻塞」。**本地全绿时它们仍然在，
这是设计，不是漏检。**

上游修好之后要收紧，不必改代码：

```bash
# 整轮检查都按严格模式跑
VENDOR_STRICT=1 ./scripts/lint.sh

# 只对某一个检查器严格
node scripts/checks/frontmatter.js --strict-vendor
```

**被否掉的方案**：

- **把 `.agents/**` 从目标集里排除** —— 等于看不见，见上。
- **把 vendor 违规设成 fail** —— 上游的既有违规会让 CI 永久红，
  而红着的 CI 和不存在的 CI 一样没用。
- **提供 `--fix` 自动修复 vendor 违规** —— 修完会在 `npx skills update` 时全部丢失，
  是个会骗人的功能。

### 为什么检查器以 git 索引为目标集，而不是 `find`

三个各自独立的、实测过的理由：

**1. 递归扫描会看到不该看到的东西。**
`.agents/skills/deep-research/.gitignore` 里含 `*.json` + `!schemas/*.json`。
递归扫描会看到将来被忽略的新 JSON，而 CI 的干净 clone 里**根本没有这个文件**
（它没被追踪）—— 那是一个必现的「本地红、CI 绿」，而且永远修不好。

**2. 有些目录从未被追踪，不该进目标集。**
`custom/daily/skills-sync/.venv/`、`.DS_Store` 都在此列。
本仓库的 `.gitignore` 之前是缺失的，靠使用者本机的 `~/.gitignore_global` 兜着；
换台机器它们就会出现在 `git status` 里。现在 `.gitignore` 补上了，
但检查器仍然以索引为准 —— 那是更硬的保证。

**3. 判「链接目标是否存在」必须查索引，不能用 `fs.existsSync`。**
`fs.existsSync("Foo.md")` 在大小写不敏感的 APFS 上会对真实的 `foo.md` 返回 `true`，
在大小写敏感的 Linux runner 上返回 `false`。这是一条**天然的「本地绿、CI 红」**：
写链接的人在自己机器上永远看不到问题。

**被否掉的方案**：

- **`find` + `.gitignore` 解析** —— 要自己实现一套 gitignore 语义（`!` 取反、`**`、
  目录锚定），等于重新发明 `git ls-files`，而且一定会有出入。
- **用 `fs.existsSync` 判链接目标** —— 见第 3 点。
- **用 Node 的 `fs.readdirSync` 递归枚举技能并在运行时过滤** ——
  `readdirSync` 的返回顺序不保证（APFS 上恰好是字典序，ext4 上不是），
  所以任何依赖顺序的输出都不可复现；顺序由 `lib/manifest.js` 显式 `.sort()` 固定。

### 为什么 `.gitattributes` 的规则全部锚定到仓库根

`.gitattributes` 里的每一条规则都以 `/` 开头（`/scripts/**`、`/custom/**`、`/*.md`……），
**没有任何一条匹配 `.agents/**`**。这不是忘了写，是刻意避开。

上游 `.agents/**` 里有 **17 个文件的工作区副本是 CRLF、而 index 里是 LF**。
这是 `core.autocrlf=input` 的正常结果（提交时归一化成 LF，检出时不改），
git 因此认为这些文件是干净的。

**任何匹配到 `.agents/**` 的规则都会打破这一点。** 实测：加上 `.agents/** -text`
之后，一旦改动某个 vendor 的 CRLF 文件，git 不再做归一化，
于是出现「**整文件都变了**」的假 diff —— 比不加 `.gitattributes` 还糟。

所以这里的策略是：只给自建内容锚定 LF，让 vendor 区继续由 `core.autocrlf` 决定，
与加这个文件之前完全一致。

锚定同时带来第二个好处：`/custom/**` 不会意外波及同名但更深的路径。

**被否掉的方案**：

- **`.agents/** -text`** —— 见上，它会关掉归一化，制造整文件假 diff。
- **`* text=auto`（不锚定）** —— 会匹配到 `.agents/**`，同一条坑。
- **干脆不写 `.gitattributes`** —— 那么 Windows 贡献者提交 CRLF 会造成无意义 diff，
  而且 CRLF 混进 `.sh` 是**缺陷不是风格问题**：带 CRLF 的 shebang 会让脚本直接执行失败。

### 为什么用 Node 自研 frontmatter 解析器，而不是 PyYAML

官方校验器在 `.agents/skills/skill-creator/scripts/quick_validate.py`，它 `import yaml`。
本机 `python3 -c "import yaml"` 直接 `ModuleNotFoundError: No module named 'yaml'`
—— 那个脚本在这里根本跑不起来。

即便如此也不该直接引 PyYAML：那要求每个贡献者（以及 CI）多装一个 Python 包，
只为校验 44 个文件里的一小段键值对。

那引 `package.json` + `yaml` 呢？那会把一个**零依赖的纯数据仓库**变成
「有 `node_modules`、CI 要跑 `npm ci`」的仓库。对近 850 个已追踪文件来说是过度工程 ——
而且它解决的是「解析 YAML」，而这里真正要做的只是「找出顶层键、取标量值、跳过嵌套结构」。

所以 `scripts/lib/frontmatter.js` 是一个**受限**解析器，明确不实现 YAML 的
多文档、锚点、别名、流式集合、复杂键。这个边界对 44 个真实技能零误报。

**相对官方实现补的四处**（每一处都对应官方脚本的一个真实缺口）：

| 补强 | 理由 |
| --- | --- |
| CRLF 归一化 | 官方用 `^---\n` 匹配，CRLF 下首行是 `---\r\n`，会误报「格式非法」 |
| BOM 剥离 | 带 BOM 时 `content.startswith('---')` 为假，官方报「未找到 frontmatter」，诊断方向完全错 |
| 块标量（`\|` `>`）支持 | 有技能用 `description: >-` 写多行；受限解析器不处理会把 description 判成空 |
| 重复顶层键检测 | YAML 里重复键是未定义行为，解析器静默取后者，官方校验器漏检 |

另外官方用非贪婪的 `(.*?)\n---` 找闭合，正文里出现 `---` 分隔线时会**截错**；
这里改成「从第 2 行起找第一个恰好是 `---` 的行」。

**被否掉的方案**：

- **引 PyYAML 跑官方脚本** —— 本机没有，且为一个 44 文件的校验引入 Python 依赖。
- **引 `package.json` + `yaml`** —— 零依赖仓库变 npm 仓库，过度工程。
- **正则一把梭（不做解析）** —— 无法处理嵌套结构与块标量，
  且无法给出「第几行、哪个键」这种可操作的报错。

### 为什么技能目录只认深度 1

技能 = `.agents/skills`、`custom/daily`、`custom/projects` 的**深度 1** 子目录，
且里面有**已被追踪**的 `SKILL.md`。

深度限制不是保守，是必须的：上游 `plugin-creator` 的 `assets/templates/` 下有一个
嵌套更深的 `SKILL.md`，它是一个**模板资产**而不是技能，它的 `name: skill-template`
与所在目录名不符。用 git 的通配 pathspec 去枚举 `SKILL.md` 会把它一并捞进来
（pathspec 的 `*` 会跨目录分隔符匹配），制造一个**无法修复的假失败** ——
它在 vendor 区，改了也会被冲掉。

**被否掉的方案**：

- **`git ls-files '**/SKILL.md'`** —— 见上，pathspec 的 `*` 跨目录匹配。
- **递归 `find` 全仓找 `SKILL.md`** —— 同上，而且还会看到未追踪文件。

### 为什么 `local-skills.json` 里没有时间戳

旧版生成器会写一个 `generatedAt` 字段，它是 `git diff --exit-code` 不可用的唯一原因
—— 实测重跑后整个文件恰好差这 1 行。改成别的形式都不稳：

- 用「本文件的最后一次提交时间」是自引用循环
- 用 `SOURCE_DATE_EPOCH` 要求 CI 与本地同源

而且它本来就是冗余的：这份文件什么时候生成的，`git log` 已经记着了。

去掉时间戳之后，同一份工作区跑两次的输出是**逐字节确定的**，
`checks/vendor-lock.js` 因此可以直接断言「内存里重建的清单 == 提交的清单」。
CI 的 `lint-selftest` job 还有一条断言专门守着这个性质（同一份工作区跑两次，
`hygiene` 的输出必须相同）—— 这类不确定性会让任何基于 diff 的判据失效。

### 为什么 shellcheck 只跑 `scripts/` 下的脚本

上游 `.agents/**` 里有 5 个 `.sh`（全在 `planning-with-files/scripts/` 下），其中 3 个是 `#!/bin/sh`。方言不一，
而且它们的告警**我们无权修**（会在 `npx skills update` 时丢失）。
每次运行报一堆永远修不掉的告警，作用只是训练读者忽略输出。

但它们的**语法**仍然要查 —— 那由 `scripts/checks/scripts.js` 覆盖，
按 shebang 选方言（`sh` 与 `bash` 分开）。一律按 bash 检查会漏掉 sh 特有的问题；
让 shellcheck 自己猜则是**静默的**：猜错时它不会告诉你。

### 为什么 `hygiene` 不用 `iconv` 做 UTF-8 检查

实测本机 `iconv` 对**合法**的 UTF-8 文件也报 `Inappropriate ioctl for device`，
一次误报 41 个文件（含 10 个自建文件）。Node 的 `TextDecoder({fatal: true})`
干净且跨平台。

另外，**U+FFFD 与 UTF-8 合法性是两回事**：合法 UTF-8 里出现 U+FFFD 是完全合法的
字节序列 —— 它通常意味着**上一轮**编码转换已经损坏过。所以两者必须分别检查。

> 💡 中文内容被写坏时留下的就是 U+FFFD。这个仓库的检查器把它当 fail 级问题
> （正确性检查，对 vendor 也生效），并且会打印**该行的十六进制字节** ——
> 因为损坏的内容在终端里就是乱码，帮不上定位的忙。

### 为什么 CI 汇总表是派生出来的，而不是手写三份

`ci-summary` job 里的 `jobs` 数组和 env 变量都由 job id **机械推导**：
`R_$(echo $id | tr 'a-z-' 'A-Z_')`，不维护第二份平行列表。

原因是有过真实缺陷：参考实现里 `needs` / `names` / `results` 三份手写列表
曾漏掉一项，导致**子 job 失败而汇总仍报成功** —— 而汇总挂了分支保护，
于是「唯一被信任的那个 check」在最需要它的场景下失灵了。

现在的三条断言：

1. `jobs` 数组与 `needs: [...]` 必须是同一个集合（比排序后的完整集合，
   只比数量会漏掉同长度互换）
2. 每个 id 必须有对应的 env 变量 —— 缺了就是「进了 needs 但没进判据」，
   直接报 `::error::` 并计为失败
3. 非 `commit-messages` 的 job 出现 `skipped` 一律算失败并标注「⚠️ 意外跳过」

第 3 条尤其要紧：`skipped` 只在「那个 job 的 `if` 条件写错了」时出现，
把「意外跳过」渲染成通过，等于把配置错误伪装成成功。

### 为什么 `commit-messages` 覆盖 PR 标题

CI 的 `commit-messages` job 校验两件事：PR 里的每个提交信息，**以及 PR 标题**。
后者是因为 squash 合并后 PR 标题会成为提交信息 —— 只查提交，标题那关就漏了。

这里有一个**本地无法弥补的缺口**：PR 标题在 PR 建立之前根本不存在，
所以 `./scripts/lint.sh` 全绿**不等于** `commit-messages` 会绿。
`--commits <区间>` 只能补齐「提交信息」那半段，标题那半段只能靠人写规范。

`lint.sh` 在收尾时会显式打印这条提醒 —— 一个「全绿」的结论如果暗示了它覆盖不到的范围，
那比红着更危险。

其他值得记的细节：

- 只在 `pull_request` 事件上跑（推到 main 的提交已经过过一次 PR）
- `fetch-depth: 0`：区间校验需要祖先提交，浅克隆拿不到
- 区间校验用**命令替换的退出码**而不是进程替换：实测 ref 不存在返回 128、
  区间有效但为空返回 0。不分开就会把「区间无效」静默放行成「没有可校验的内容」
- `Revert` / `Merge` / `fixup!` / `squash!` / 以 `#` 开头的行直接放行

---

## scripts/ 各文件职责

```text
scripts/
├── lint.sh                   # 本地统一入口：调度 10 项检查、汇总、给安装提示
├── check-commit-msg.sh       # 约定式提交校验（CI 与本地 hook 共用）
├── gen-local-skills.js       # 生成 local-skills.json
├── checks/
│   ├── frontmatter.js        # 技能 frontmatter 校验
│   ├── evals.js              # evals/evals.json 结构校验
│   ├── vendor-lock.js        # 上游 lock 一致性 + 清单可复现性
│   ├── hygiene.js            # 编码（UTF-8 / U+FFFD / BOM）+ 末尾换行 + JSON 语法
│   ├── links.js              # 自建 Markdown 的相对链接有效性
│   └── scripts.js            # JS / Shell / Python 语法 + 入口脚本可执行位
└── lib/
    ├── gitfiles.js           # 目标集枚举的唯一入口（git 索引）+ tier 判定
    ├── frontmatter.js        # 受限 frontmatter 解析与校验规则
    ├── manifest.js           # local-skills.json 的构建与序列化
    └── report.js             # 结果收集、分级、输出格式、退出码
```

### `lint.sh` —— 本地统一入口

```bash
./scripts/lint.sh                    # 跑全部检查
./scripts/lint.sh --list             # 只列检查项 id 与显示名
./scripts/lint.sh --only links,hygiene
./scripts/lint.sh --skip zizmor      # 需要 docker 的那项可以跳过
./scripts/lint.sh --commits origin/main..HEAD   # 追加提交信息校验
```

它管的十项检查：`frontmatter` `evals` `vendor-lock` `hygiene` `links` `scripts`
（以上六项纯 Node）+ `shellcheck` `actionlint` `yamllint` `zizmor`（四项外部工具）。

几条刻意的设计：

- **工具版本 pin 的唯一真源是 `.github/workflows/ci.yml` 的 `env:`。**
  `lint.sh` 用 `ci_env()` 从那里 sed 出来，不写第二份 —— 写死两份会在升级时静默漂移，
  而这一项的全部价值正是「本地过 = CI 过」。本机版本与 pin 不一致时记进
  `NONSYNC_NOTES` 并如实打印。
- **工具缺失是「跳过」，不是「通过」。** 跳过项一律显式列出并给出安装方式，
  不计入通过数。**工具在、但检查跑不起来**（退出码 2）算失败不算跳过 ——
  静默跳过与通过无法区分。
- **`--only` / `--skip` 的 id 会被校验。** 写错一个字母会让整轮检查静默少跑，
  必须拦下。
- **zizmor 优先走 docker**，与 CI 跑同一条命令、同一个 pin 镜像；
  没有 docker 时退化为本机 zizmor 并如实记进 `NONSYNC_NOTES`（不再假装同源）。

`lint.sh` 的「不覆盖」清单写在文件头里，其中最重要的一条是 **PR 标题**，
其次是**外链可达性**（只查相对链接，http/https 一律不探网）和**技能的行为正确性**
（`evals.json` 只查结构，不跑断言）。

### `check-commit-msg.sh` —— 提交信息校验

```bash
./scripts/check-commit-msg.sh --message "feat(custom): 新增技能"
./scripts/check-commit-msg.sh --file .git/COMMIT_EDITMSG
./scripts/check-commit-msg.sh --range origin/main..HEAD
./scripts/check-commit-msg.sh --last
```

允许的类型：`feat` `fix` `docs` `ci` `chore` `refactor` `perf` `test` `style` `revert` `build`，
范围限定为小写字母、数字、点、下划线、斜杠、连字符。

报错时给出的是**针对性原因**而不是一句「格式错误」：类型没小写会说「类型必须小写，
应写作 `feat`」；类型不在列表里会把那个类型名点出来。判断顺序很重要 ——
先定位类型部分的问题，再定位冒号与描述的问题，否则 `Feat: xxx` 会被误报成「类型缺失」。

退出码：0 = 全部合规（区间内没有提交也算 0），1 = 存在不合规的提交信息或区间无法解析。

### `checks/*.js` —— 六个检查器

每个都是独立的可执行入口（CI 里就是直接 `node scripts/checks/<name>.js`），
共用 `lib/report.js` 的输出与退出码语义。

### `lib/*.js` —— 共享层

| 文件 | 职责 |
| --- | --- |
| `gitfiles.js` | 目标集枚举的**唯一入口**。`trackedFiles()` / `trackedSet()` / `skillDirs()` / `tierOf()` / `requireRepo()` |
| `frontmatter.js` | 受限解析器 + 按官方规则集校验（外加本仓库自有的 name/目录名一致性） |
| `manifest.js` | `local-skills.json` 的构建与序列化。生成器与校验器共用这一份 —— 两处各写一遍迟早会漂移，而「生成物与生成器一致」正是校验要验的东西 |
| `report.js` | 结果收集、分级（tier → level）、输出格式、退出码 |

### `gen-local-skills.js` —— 生成器

```bash
node scripts/gen-local-skills.js            # 打到 stdout，不落盘
node scripts/gen-local-skills.js --write    # 写回 local-skills.json
node scripts/gen-local-skills.js --out /tmp/x.json
```

**默认不落盘。** 这个脚本原来是「生成器 + 校验器」两个身份，
于是一个想写、一个永远 exit 0，互相破坏。现在职责分开：这里只管写，
一致性由 `checks/vendor-lock.js` 管。

汇总信息走 stderr，stdout 保持是纯粹的 JSON（可以安全重定向或管道）。

---

## CI 结构

`.github/workflows/ci.yml` 共 13 个 job：

| Job | 名称 | 内容 |
| --- | --- | --- |
| `frontmatter` | 技能 frontmatter 校验 | `node scripts/checks/frontmatter.js` |
| `evals` | evals.json 结构校验 | `node scripts/checks/evals.js` |
| `vendor-lock` | 上游技能 lock 一致性 | `node scripts/checks/vendor-lock.js` |
| `hygiene` | 编码与 JSON 校验 | `node scripts/checks/hygiene.js` |
| `links` | 相对链接校验 | `node scripts/checks/links.js` |
| `scripts` | 脚本语法检查 | `node scripts/checks/scripts.js` |
| `shellcheck` | shellcheck（Shell 静态分析） | 按 pin 的版本下载并校验 sha256 |
| `actionlint` | actionlint（工作流静态检查） | 显式传工作流文件列表 |
| `yamllint` | yamllint（YAML 风格） | venv 安装指定版本 |
| `zizmor` | zizmor（工作流安全扫描） | docker 按 tag 固定，只读挂载 |
| `commit-messages` | 提交信息规范 | 仅在 PR 上跑，校验提交 + PR 标题 |
| `lint-selftest` | lint.sh 自测 | 五条断言，见下 |
| `ci-summary` | CI 总览 | 汇总，唯一挂了分支保护的 check |

十条静态检查互相独立（没有 `needs`）：它们都是亚秒级的，串行只会让反馈变慢；
独立 job 意味着一个检查器崩溃不影响其他结果的可见性。

几条安全约定：

- 所有 action 按 **commit SHA** 固定（不是 tag），`persist-credentials: false`
  保证 `GITHUB_TOKEN` 不残留在 runner 上
- 外部工具按版本 pin + sha256 校验（shellcheck 的 release 不提供校验和文件，
  所以按内容哈希固定）
- 工作流里的 `${{ }}` 上下文值一律经 `env:` 中转，绝不直接写进 `run:`
- `permissions: contents: read`，CI 只读

### `lint-selftest` 的五条断言

`lint.sh` 是 CI 里**被调用为零**的脚本，而它的全部价值就是「本地过 = CI 过」
—— 这条保证本身需要有人守。断言方向两两相反，既防「本地太松」，也防「本地太严」：

| 断言 | 防的是什么 |
| --- | --- |
| `lint.sh --list` 的 id 集合 == `ci.yml` 的 `needs` 减去两项 CI 专属 | 加了本地检查却忘了接进 CI |
| 自建技能注入非法 frontmatter 键后，`lint.sh` **必须失败**，且原因必须是那个键 | 本地太松；以及「失败了但原因不对」的假断言 |
| 上游技能注入同样的键后，`lint.sh` **必须仍然通过**，且输出里必须**看得见**它、必须说明「不阻塞」 | 分级被写反；以及静默跳过被当成通过 |
| `hygiene` 同一份工作区跑两次输出必须相同 | 输出不确定会让任何基于 diff 的判据失效 |
| 无 `.git` 的目录里 `lint.sh` 必须**明确失败**、报「以 git 索引为目标集」、且**不抛异常** | 崩溃与拒绝执行是两回事 |

沙箱副本会先 `git init` 成一个真仓库再注入 —— 不带 `.git` 的副本里每个检查器都 exit 2，
那样无论注入什么都会「失败」，断言就成了恒真，测的是「没有 `.git`」而不是「注入的键被拦下」。

---

## 被否掉的方案一览

| 被否掉的方案 | 否掉的理由 | 现在的做法 |
| --- | --- | --- |
| 把 `.agents/**` 从检查范围排除 | 等于看不见；上游引入「缺 name」会让技能加载失败 | 只 warn、不阻塞、但每次可见 |
| 把 vendor 违规设成 fail | 上游既有违规让 CI 永久红 | 只 warn，`VENDOR_STRICT=1` 可选收紧 |
| 给 vendor 违规提供 `--fix` | 修完会在 `npx skills update` 时丢失 | 不提供 |
| 用 `find` / 递归扫描当目标集 | 会把被 ignore 的文件算进来，制造必现的本地红 CI 绿 | `git ls-files -z` |
| 用 `fs.existsSync` 判链接目标存在 | 大小写不敏感的 APFS 上假绿，Linux 上红 | 查 git 索引 |
| 依赖 `readdirSync` 的返回顺序 | APFS 是字典序、ext4 不是，输出不可复现 | 显式 `.sort()`（按 UTF-16 码元，不用 `localeCompare`） |
| 给 `.agents/**` 设 `-text` | 关掉 `core.autocrlf` 归一化，产生整文件假 diff | 所有规则锚定到仓库根，vendor 区不写规则 |
| 不写 `.gitattributes` | Windows 贡献者提交 CRLF 造成假 diff；CRLF 混进 `.sh` 会让 shebang 失效 | 自建内容统一 LF |
| 引 PyYAML 跑官方 `quick_validate.py` | 本机没有；为一个 44 文件的校验引入 Python 依赖 | Node 受限解析器，零依赖 |
| 引 `package.json` + `yaml` | 零依赖数据仓库变成要 `npm ci` 的仓库 | 同上 |
| 用通配 pathspec 枚举 `SKILL.md` | `*` 跨目录匹配，会捞到 `plugin-creator` 的模板资产，产生无法修复的假失败 | 只认三个父目录的深度 1 子目录 |
| 在 `local-skills.json` 里写 `generatedAt` | 让 `git diff --exit-code` 永远不可用 | 不写时间戳，输出逐字节确定 |
| 让生成器同时当校验器 | 一个想写、一个永远 exit 0，互相破坏 | 生成归 `gen-local-skills.js`，一致归 `checks/vendor-lock.js` |
| 用 `iconv` 查 UTF-8 | 对合法 UTF-8 也误报（一次 41 个文件） | `TextDecoder({fatal: true})` |
| 对全仓跑 shellcheck | 上游 5 个 `.sh` 方言不一（3 个 `sh`、2 个 `bash`），且告警无权修 | 只跑 `scripts/`，上游的**语法**由 `checks/scripts.js` 按 shebang 覆盖 |
| 让 shellcheck 自己猜方言 | 猜错时是静默的 | 按 shebang 显式传 `-s <方言>` |
| `actionlint` 裸跑 | 裸跑靠 `.git` 定位项目根，在没有 `.git` 的目录直接报错 | 显式传工作流文件列表，且只收 `.github/workflows/**` |
| 把 `dependabot.yml` / ISSUE_TEMPLATE 喂给 actionlint | 它们不是工作流，会报「"jobs" section is missing」 | 目标集限定到 `.github/workflows/` |
| Python 语法检查用 `py_compile` | 会写 `__pycache__/`，只读校验器不该在工作区产生文件 | `ast.parse` |
| 在 `ci-summary` 里手写三份平行列表 | 参考实现曾漏掉一项，子 job 失败而汇总报成功 | 由 job id 机械推导 + 三条断言 |
| 把 `skipped` 一律当通过 | 配置错误（`if` 写错）会被伪装成成功 | 非 `commit-messages` 的 skipped 一律算失败 |
| CI 里不跑 `lint.sh` 自测 | `lint.sh` 的价值是「本地过 = CI 过」，这条保证本身需要有人守 | `lint-selftest` job，五条反向断言 |

---

## 安全模型

这个仓库的威胁面比一般项目小（它不执行任何外部输入），但有几条硬规则：

**1. `custom/**` 会被软链进使用者的全局 AI 环境。**
那里的每一句指令都是会被执行的。所以自建技能的内容必须**可审计** ——
看得懂它在让 AI 做什么。这一条直接推出了[维护者手册的项目红线](MAINTAINER_GUIDE.md#项目红线)。

**2. 不把凭证、内网地址写进任何技能内容。**
技能内容会随仓库公开分发，写进去就是公开。这条对 `custom/` 和
`evals/evals.json` 里的示例同样适用。

**3. 工作流里 `${{ }}` 一律经 `env:` 中转。**
`${{ github.event.pull_request.title }}` 这类值可能含攻击者可控内容，
直接插进 `run:` 就是脚本注入。CI 里每一处用到上下文值的地方都走 `env:`。

**4. `.agents/**` 是第三方代码。**
它被追踪、被分发，但不由这里维护。审查 PR 时如果看到 `.agents/` 的改动，
先确认那是 `npx skills update` 的结果，而不是有人手工塞进去的东西。

**5. 检查器不做任何写操作。**
唯一的写入口是 `gen-local-skills.js --write`（要显式加 `--write`），
以及 `check-commit-msg.sh` 用 `mktemp` 建的临时文件（用完即删）。
只读校验器在 CI 里产生文件是垃圾，在本地则可能掩盖问题。
