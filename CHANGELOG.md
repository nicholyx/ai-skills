# 更新日志

本文件记录本项目的所有重要变更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

这一版的主线是**让评测用例真的能被跑起来**。第一步是补上它们缺失的语义。

### 新增

- **断言的作用面 `target`**（[#38](https://github.com/nicholyx/ai-skills/pull/38)）。一条断言必须说清它检查的是**模型说了什么**还是**模型做了什么** —— 否则无法执行：

  | `target` | 看的是 |
  | --- | --- |
  | `transcript`（默认）| 全文 = 工具调用 + 模型输出 |
  | `tools` | 模型**实际执行**的工具调用 |
  | `output` | 模型的输出文本 |

- **`not_contains` 必须显式写 `target`**（判错，不是提示）。默认的 `transcript` 是全文匹配，而否定断言在全文下几乎必然误伤：模型只要说一句「我不会执行 `git push`」，行为完全正确，`not_contains "git push"` 却红了。这类**假失败**比漏检更糟 —— 它让人不再相信这套用例。正向断言不强制，`transcript` 是超集，最坏只是约束偏松。
  - 7 条 `not_contains` 已逐条回填：5 条 `tools`（不许做的动作）、2 条 `output`（不许说的话）。判据是「断言值只可能出现在模型的话里吗」—— `git-smart-update` 的 `not_contains "所有分支"` 就属于这种，选 `tools` 会让它**永远通过**，等于没写
- **`type` / `target` 写错值、`value` 为空，现在都判错**。不认识的 `type` 不会被任何跑手匹配，用例会**静默失效** —— 那是最难发现的一类坏法。

## [1.3.2] - 2026-09-29

这一版收掉**两处没实测过就被写进文档的声明** —— 都属于同一类：话是对的读者会照着做判断，但没人真去验过。

### 修复

- **「`npx skills use` 试完没有任何残留」不成立**（[#36](https://github.com/nicholyx/ai-skills/pull/36)）。README 与 USAGE 都写着它「**不写文件**、不动配置、试完不满意没有任何残留」。实测：它会把技能文件下载到 `$TMPDIR/skills-use-*/<技能名>/`，**而且不自行清理** —— 连跑两次，临时目录从 2 个变成 3 个，旧的一个没删。
  - 声明里成立的那半（四项都实测确认过）：**不安装、不改配置、不动 `~/.claude/skills`、不动任何配置文件**。所以「试完随时走开」是对的，「什么都没写到磁盘」不对
  - 此前没人验它，是因为**「零残留试用」是个好卖点 —— 正因为好，没人去验**
- **目录图例把 ✅ 说成了「已有证据」**（[#36](https://github.com/nicholyx/ai-skills/pull/36)）。`docs/SKILLS.md` 原文说「没有 ✅ 只表示『它能干活』这件事还没有机器可验证的证据」，这反推出 ✅ 代表已有证据。实际 `checks/evals.js` 只校验结构，**没有任何东西会执行这些用例**。图例已改成如实描述：✅ = 有用例、结构受 CI 校验、**但不会被执行**。
  - 顺带实测发现这些用例**当前无法被忠实执行**：断言没有定义语义面 —— 同一个用例里 `git diff --staged` 指工具调用、`是否要提交工作区` 指模型的话，没有哪个单一文本面能同时满足。已列入路线图，**顺序是先补语义面再写跑手**

### 变更

- **`.trellis/spec/maintenance/index.md` 新增「描述外部工具的行为前，先实测」**。这是同一类错误第二次出现（前一次是 v1.3.1 的「不随本仓库分发」）。规则里写明那条最容易踩的分界：**「不安装」与「不写文件」不是一回事** —— 前者容易成立，后者常常不成立。
- 顺带把「`npx skills add` 装不到上游技能」这条**从假设变成实测**：默认命令 15 个、`/custom/daily` 14 个，两条都没有上游混入 —— 这条是成立的。

## [1.3.1] - 2026-09-29

这一版只做一件事：**把文档里讲反了的地方收掉**，顺带把一条从没验证过的安装断言变成实测。

### 修复

- **收掉「不随本仓库分发」这句与自身上下文矛盾的话**（[#34](https://github.com/nicholyx/ai-skills/pull/34)）。六处文档（README ×2、AGENTS.md、USAGE ×3）说 `.agents/skills/` 的 31 个上游技能「不随本仓库分发」，而**紧邻的下一句**就是「本仓库把它们提交进仓库，只是为了让这套环境可复现」—— 同一段里两句对不上。字面读起来是「不在仓库里」，而 clone 一次就会拿到全部 31 个、占仓库 97% 体积。已统一为仓库里本就正确的说法「**不在安装面内**」。
- **把「`npx skills add` 装不到上游技能」从假设变成实测**。这条断言一直写在文档里，却从没被验证过。实测：默认命令 **Found 15 skills**（全为自建），`/custom/daily` 子路径 **Found 14 skills**（全为通用），两条都没有上游混入 —— 与文档写的一致，**安装面是健康的**。

## [1.3.0] - 2026-09-29

这一版的主线是**让两类无声故障变得有声**：装了技能却唤不起来、技能里的文件改名后静默失效 —— 这两件事此前都不在任何检查的覆盖范围内。

### 新增

- **技能自洽校验 `checks/skill-integrity.js`**（[#32](https://github.com/nicholyx/ai-skills/pull/32)）。三条断言，都不需要跑模型：
  - **A｜指向本技能目录的路径必须存在**。`SKILL.md` 里写着「按 `reference/quality-standards.md` 的标准打分」，而那个文件被改名成 `quality.md` —— frontmatter 全合规、目录照常生成、链接检查器也看不见它（那是反引号里的路径，不是 Markdown 链接）。技能照常安装，只在真正跑到那一步时才出问题
    - 判据不能是「所有相对路径」：`maintain-loop` 引用的 `./scripts/lint.sh` 是**目标仓库**的脚本（它是通用技能），`obsidian-note-workflow` 引用的 `_metadata_/tag-rules.md` 是**用户 vault** 的结构。实际用的是「路径的第一段在技能目录里存在吗」，引入时对全仓零误报
    - **已知漏网**：不含 `/` 的裸文件名（`package.json`、`bug-analyzer.md`）不检查 —— `repo-analyzer` 提的 `package.json` 是被分析仓库的，`bug-analyzer-agent` 提的 `bug-analyzer.md` 却是它自己的，无法可靠区分，放宽就会误报
  - **B｜目录承诺的那句话必须在 `description` 里**。`docs/SKILLS.md` 给访客看的「你可以这样说」取自 `metadata.example`，而模型是靠 `description` 决定唤不唤起的 —— 这句话不在那里，目录对用户的承诺就没有兑现机制
  - **C｜`description` 不得留脚手架占位符**。带着一句「【待补】…」上线的技能装得上，但永远唤不起来
- **11 个技能补上真正的触发说法**（[#32](https://github.com/nicholyx/ai-skills/pull/32)）。引入规则 B 时它挂了 **11/15**：那些描述是**主题概括**（`git-commit` 当时只有 22 字「使用约定式提交规范执行 git commit」），而目录承诺的是一句口语；其中三个的描述还是**纯英文**的，用户却多半说中文 —— 承诺的那句话在模型能看到的地方没有任何锚点。
- **脚手架在创建时刻就把约束说清楚**。`new-skill.js` 生成的占位描述里会带上 `--example` 那句话，并写明原因。

### 修复

- **`lib/frontmatter.js` 补上 `docBody`**（[#32](https://github.com/nicholyx/ai-skills/pull/32)），并在注释里写明：`body` 是 **frontmatter 内部**的行，文档正文要用 `docBody`。这条注释来自一次真实的翻车 —— 规则 B 的第一版取错了字段，断言因此**恒真**（15/15）；**是变异测试把它揭出来的**，真正的正文命中率只有 2/15。同一次还暴露出 `.trellis/spec/skills/index.md` 里两处互相矛盾的描述长度区间（`22~257` 与 `44～482`），实测区间是 47～292，已统一。

## [1.2.0] - 2026-09-29

这一版的主线是**让陌生人一眼看到有什么、并且零成本试一次**：把写给模型的 482 字符说明书，变成人能读的目录；把一直存在却没人知道的「不装先试」摆到明面上。

### 新增

- **技能目录 `docs/SKILLS.md`**（[#30](https://github.com/nicholyx/ai-skills/pull/30)）。按场景分组的技能清单，每个技能一句话 tagline、一句**可以直接照念**的示例、以及是否有可验证的评测用例。
  - 解决的问题：`SKILL.md` 的 `description` 是**写给模型的**（塞触发词，本仓库实测 44～482 字符），人浏览时读不下去。而「这仓库里有什么、我该装哪个」正是陌生人最先问的两个问题
  - 数据来自 frontmatter 的 `metadata`（`category` / `tagline` / `example`）—— 官方白名单六键之一，与 `description` 各司其职：前者给模型，后者给人。**没有第二份需要维护的清单**，目录完全从技能本身生成
- **“先试再装”这条路被发现**（[#30](https://github.com/nicholyx/ai-skills/pull/30)）。`npx skills use nicholyx/ai-skills@<技能名>` 能**不安装就生成一段可用的提示词** —— 这个能力一直存在，但仓库从没告诉过任何人。现在 README、USAGE 与技能目录三处都写了。
  - 这是采用链路上成本最低的一步：不安装、不改配置，试完没有安装痕迹。对「要不要装」犹豫的人，它把门槛降到了零
- **新技能脚手架 `scripts/new-skill.js`**（[#30](https://github.com/nicholyx/ai-skills/pull/30)）。按仓库约定生成骨架，省得对照 frontmatter 契约表手写；创建时就提醒要重跑目录生成器（忘了不会静默通过，CI 会拦）。
- **文档计数校验 `checks/doc-counts.js`**（[#30](https://github.com/nicholyx/ai-skills/pull/30)）。断言文档里写的「N 项检查」「N 个 job」「N 个自建技能」与事实一致，支持 `--fix` 就地改正。
  - 起因是这类腐烂已经出现**三次**：检查项数 10 → 11 → 12、CI job 数 13 → 14 → 15、自建技能数 12 → 14 → 15。每次都不是「写错了」，而是**写对之后事实变了** —— 旧值看起来是权威的，读者无从判断它是什么时候的数字。它第一次运行就抓出 11 处，其中两处是我**上一轮刚修好又过期的**
  - 只匹配本仓库实际使用的几种措辞，**宁可漏也不误报** —— 一个会在正确状态下误报的检查，会让人不再相信输出


## [1.1.0] - 2026-09-29

这一版的主线是**让第一次接触的人拿到正确的东西**：修好被 Trellis 顶掉的主安装路径，把讲反了的分发关系纠正过来，补上英文入口 —— 并让这几件事从此有 CI 守着。

### 新增


- **补上英文入口：非中文用户现在能自己装起来、用上**（[#26](https://github.com/nicholyx/ai-skills/pull/26)）。此前 `README.en.md` 只有开头两行命令就没了下文，`docs/` 四件套又全是中文 —— 非中文用户点进英文 README 之后就断了。技能本身是语言无关的（模型读得懂中文技能），**被挡住的是人，不是模型**。
  - `README.en.md` 补成一条完整可跑的链路：装什么、两条安装命令与实测输出、装到哪、怎么确认生效、怎么触发、怎么更新与卸载，以及如何自己写一个新技能
  - 新增 `docs/USAGE.en.md`：安装、生效确认、`skills-sync` 的参数与输出符号（含中文输出原文，读者要照着认）、frontmatter 契约与目录约定、常见场景
  - **边界写进文档，而不是留成隐含约定**：英文只覆盖「不翻就完全用不起来」的部分（这是什么 / 装 / 用 / 自己写一个），架构原理、完整排错、维护者手册一律指向中文原版并注明是中文 —— 全量翻译会变成两份需要同步维护的文档，必然漂移，而漂移的排错手册比没有更糟
  - 顺带把安装落点写准了：`npx skills add` **默认是项目级**（`./.agents/skills/` + 软链进 `./.claude/skills/`），`-g` 才是用户级（`~/.claude/skills/`）。这两条都实测过

### 变更


- **仓库设置对齐：社区标准从 85% 提到 100%**（[#12](https://github.com/nicholyx/ai-skills/pull/12)）。缺口是**仓库描述为空** —— 实测对照证明了这一点：`community/profile` 在有描述时返回 100%，无描述时 85%，其余六项（README / LICENSE / CONTRIBUTING / 行为准则 / SECURITY / PR 模板）都齐全也一样扣。同时补上了 10 个 topics。
  - **描述与 topics 是最容易被漏掉的一类配置**：它们随时可改、不进代码、不开 PR，因此不会在任何 diff 里留下痕迹。已写进 `MAINTAINER_GUIDE` 的配置清单，并注明「上表是当下值，改了记得回来同步」
  - 顺带澄清一个假警报：`community/profile` 报的 `issue_template: false` **不是缺口**。实测 vscode、cli/cli、ohmyzsh 同样是 `null` 但健康度都是 100% —— 那个字段只认旧的**单文件** `ISSUE_TEMPLATE.md`，不认目录式模板
- **开启「合并后自动删分支」与「允许自动合并」，关闭空 Wiki**（[#12](https://github.com/nicholyx/ai-skills/pull/12)）。前两项此前一直是关闭的：前者要每次记得带 `--delete-branch`，后者会让 `gh pr merge --auto` 报 `Auto merge is not allowed`。
  - Wiki 的状态是**开着但从未初始化**：仓库页面留着一个「Create the first page」入口，点进去是空页面 —— 对访客来说这比没有 Wiki 更糟。而本仓库本来就明确「文档在 `docs/`，不放 Wiki」
- **修正里程碑模型：Roadmap Issue 不再挂在版本里程碑下**（[#12](https://github.com/nicholyx/ai-skills/pull/12)）。Roadmap 是**持续维护的活文档**，不是某个版本的交付物；挂在 v1.0.0 下会让那个已发布的版本永远显示「未完成 1」。已将其移出并关闭 v1.0.0 里程碑。



- **`maintain-loop` 新增一条判断：「先分清行为问题与配置问题」**（[#11](https://github.com/nicholyx/ai-skills/pull/11)）。起因是对另一个项目做仓库设置审计时发现，它的维护手册把 `gh pr merge --auto` 报的 `Auto merge is not allowed` 当作「已知故障」记了绕过办法 —— 而 `allow_auto_merge` 只是仓库设置里一个能勾的选项，打开它那条「故障」就消失了。
  - 由此提炼出判断方法：报错里出现 `is not allowed` / `not enabled` / `permission denied` 这类措辞时先去看设置的对应位置；一条「故障」如果每次都以同样方式出现、且绕法每次都有效，它多半是配置；**在文档里写下绕法时，同时写下「为什么不能直接改配置」—— 写不出来就说明该去改配置**
  - 同时改掉了 skill 里同源的那条表述：原先写「仓库未开启该功能，改为等待检查完成后再合并」，现在写明「先去确认那个开关，而不是找绕过办法」

### 修复


- **安装说明此前把分发关系讲反了**（[#23](https://github.com/nicholyx/ai-skills/pull/23)）。多处文档写着「默认命令装 `.agents/skills` 里的技能」，并据此给出「只要上游那 31 个就装默认」「不想要上游就装 `/custom`」的选型建议 —— **两个方向都是反的**。实测：`npx skills add nicholyx/ai-skills` 装到的是 `custom/` 下的 15 个技能，`.agents/skills/` 那 31 个一个都装不到。
  - 同时修正一个更细的错误：`custom/projects/` 下的项目专用技能**会被默认命令装到**，而多处文档声称「三条命令都不含它」——那也是反的。现在文档写明「不想要它就用 `.../custom/daily`」
  - 补充「那 31 个上游技能到底怎么装」：`.agents/skills/` 是 `npx skills` 的**安装目标目录**（工具的工作区），不是本仓库分发的产品。要用就从各自的源仓库装，来源记在 `skills-lock.json` 里。这条已实测验证（`npx skills add vercel-labs/agent-browser` 可装）
  - 顺带清掉三处过时计数：`AGENTS.md` 的「13 个技能」（实为 15）、「10 项检查」（实为 11），以及它把 `.claude/` 描述为「由 trellis update 管理」（实为已 gitignore、不在仓库里）


- **`release.yml` 提取的发布说明会把 CHANGELOG 的维护者样板段带进去**（[#10](https://github.com/nicholyx/ai-skills/pull/10)）。提取用的 awk 只在 `^## [` 处停止，而 CHANGELOG 尾部的 `## 版本说明`（写给维护者的格式约定）没有方括号 —— 于是提取一路跑到文件末尾，把那段样板和底部的链接引用一起塞进了**公开的**发布说明。v1.0.0 首发时实测：提取 64 行，正确的只有 55 行。改为在下一个 `^## ` 二级标题处停止，已发布页面的内容一并订正。

## [1.0.0] - 2026-09-24

这一版把仓库从「裸仓库」建成符合主流规范的开源项目：CI 检查层、治理文件、仓库自动化、文档体系，以及把维护流程本身沉淀为两个可复用的技能。

### 新增

- **建立仓库地基：`.gitignore` / `.gitattributes` / `.editorconfig` / `.yamllint`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。此前这是一个裸仓库，没有任何一层配置。`.DS_Store` 与 `custom/daily/skills-sync/.venv/` 之所以没被提交进来，靠的是使用者本机的全局 gitignore —— 换一台机器、换一个贡献者就会立刻泄漏进来。
  - `.gitattributes` 的规则**全部锚定到仓库根**，刻意不写任何匹配 `.agents/**` 的规则：上游 vendor 区有 17 个文件的工作区副本是 CRLF、而索引里是 LF，那是 `core.autocrlf=input` 的正常结果。加 `.agents/** -text` 会关掉这套归一化，改动 vendor 文件时出现「整文件都变了」的假 diff，比不加 `.gitattributes` 还糟
- **六个零依赖 Node 检查器**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）：技能 frontmatter、`evals.json` 结构、上游 lock 一致性、编码与 JSON、相对链接、脚本语法。
  - 目标集一律来自 **git 索引**而不是 `find`：`deep-research/.gitignore` 含 `*.json`，递归扫描会看到 CI 干净 clone 里根本不存在的文件，制造一个必现的「本地红、CI 绿」
  - 判「链接目标是否存在」也查索引而不是 `fs.existsSync`：后者在大小写不敏感的 APFS 上会对 `Foo.md` 命中真实的 `foo.md`，在 Linux runner 上则不会
  - frontmatter 用自研的**受限**解析器（不引 PyYAML，也不引入 `package.json`），并补上官方 `quick_validate.py` 缺的四项：CRLF 归一化、BOM 剥离、块标量支持、重复顶层键检测
- **本地统一校验入口 `scripts/lint.sh` 与提交信息校验 `scripts/check-commit-msg.sh`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。`lint.sh` 一条命令跑完本地能跑的静态检查（`--list` / `--only` / `--skip` / `--commits`），工具版本 pin 从 `.github/workflows/ci.yml` 的 `env:` 读出，不写第二份。
  - 工具缺失一律记为**跳过**并显式列出（不计入通过）；工具在但检查跑不起来（退出码 2）算失败不算跳过 —— 静默跳过与通过无法区分
- **CI 检查层 `.github/workflows/ci.yml`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。13 个 job：10 个静态检查 + 提交信息规范 + `lint.sh` 自测 + 汇总。
  - 分支保护只勾 `CI 总览` 一个 check，增删检查项时不必回头改仓库设置
  - 汇总表的 job 列表由 id **机械推导**，并有三条断言守着「进了 `needs` 却没进判据」这个缺陷
  - `lint-selftest` 用五条方向相反的断言守「本地过 = CI 过」，包括在无 `.git` 的目录里必须明确拒绝执行而不是崩溃
- **上游 vendor 区的分级策略**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。`.agents/**` 的违规只 warn、不计入退出码；但也不排除 —— 排除等于看不见，上游引入「缺 `name`」这类问题会让技能直接加载失败，而本仓库的唯一用途就是「这些技能能被加载」。需要严格检查时用 `VENDOR_STRICT=1`，不必改代码。

- **补齐开源治理文件与仓库模板**（[#2](https://github.com/nicholyx/ai-skills/pull/2)）：`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`、`SUPPORT.md`、`.github/CODEOWNERS`、PR 模板与 bug / feature / docs 三类 Issue 表单。
  - `SECURITY.md` 的威胁模型是**为本仓库写的**，不是照搬通用模板：本仓库不是「持有凭证的自动化仓库」，而是**分发 AI 指令的内容仓库** —— `custom/**` 会被 `skills-sync` 软链进使用者的全局环境，所以核心风险是「恶意或误导性内容随一次 pull 直接进入使用者的 AI 环境」。同时写明了**不在威胁模型内**的情况，挡掉「这算不算安全问题」的无效讨论
  - `CONTRIBUTING.md` 的类型表与 `scripts/check-commit-msg.sh` 的 `ALLOWED_TYPES` 逐字一致，并如实写明 `lint.sh` **验不了 PR 标题** —— 标题在 PR 建立之前不存在，本地任何入口都验不了它
- **接入 Trellis 作为任务与知识上下文层**（[#3](https://github.com/nicholyx/ai-skills/pull/3)）。`.trellis/spec/` 存编码规范（会话自动注入）、`.trellis/tasks/` 存任务 PRD、`.trellis/workspace/` 存会话记忆；它与 GitHub 侧闭环（Issue / 里程碑 / PR / 发布）分工互补，两者不重叠。
  - spec **没有沿用 Trellis 的默认骨架**：它生成的是 `backend/` + `frontend/`，那是为 Web 应用设计的，与本仓库（Markdown/JSON 内容仓库，无构建、无依赖）完全不符。按真实形态重组为 `skills/`、`checks/`、`maintenance/`、`guides/`，并删掉默认的 `00-bootstrap-guidelines` 占位任务
  - `AGENTS.md` 采用 Trellis 的「受管块 + 手写块」分层。手写块特别点明一处歧义：受管块里的 `.agents/skills/` 是 Trellis 的通用措辞，而本仓库该路径指的是**上游 vendored 技能**，含义完全不同 —— 否则后来者极易误改 `.agents/**`
- **新增 `oss-bootstrap` 与 `maintain-loop` 两个技能**（[#3](https://github.com/nicholyx/ai-skills/pull/3)）。前者「从 0 到 1 搭基建」，后者「基建就位后的日常迭代闭环」，分工互补。
  - 两者都写成**不绑定具体仓库的通用型**：开篇先探测目标仓库（语言与工具链、仓库现状、权限、已有文件），项目专属项全部换成判据与占位符。因此任何项目都能用，也可以直接分发给别人
  - 从真实踩坑沉淀的规则原样保留，没有为了「通用」而稀释 —— 判断成败禁止管道接 `tail`/`head`、CHANGELOG 锚点必须校验在正确段落、`gh pr create` 正文必须用 `--body-file`、`set -u` 下空数组在 bash 3.2 与 5.x 的行为差异、GNU 与 BSD sed 的 `\n` 语义差异。这些与项目无关，是纯经验，删掉就等于重新踩一遍
- **建立文档体系**（[#4](https://github.com/nicholyx/ai-skills/pull/4)）：`README.md` 重写为面向使用者、新增 `README.en.md` 英文入口、`docs/` 四件套（USAGE / ARCHITECTURE / TROUBLESHOOTING / MAINTAINER_GUIDE），以及本文件。
  - `ARCHITECTURE.md` 重点写「**为什么这样设计**」并记录被否掉的方案，而不是罗列目录结构；`TROUBLESHOOTING.md` 保留报错原文，并写明「什么情况下不该用这个方案」
- **仓库自动化工作流**（[#5](https://github.com/nicholyx/ai-skills/pull/5)）：labeler（按改动路径自动打标签）、welcome（首次贡献者致意）、stale（长期无响应自动清理）、release（三段式发布说明）、scorecard（供应链公开评分）与 dependabot（Actions 生态，含 7 天 cooldown 与同 Action 合并更新）。
  - `release.yml` 的三段式说明 = **人工归纳（CHANGELOG 手写段）+ 机器枚举（GitHub 原生 `generate-notes`）+ 可选润色（AI 摘要）**，三个输入源各自独立降级，任一缺失都不阻断发布
  - AI 摘要**只在配了 key 时启用**，实现时实测出一个真实缺陷：裸引用 `$ANTHROPIC_API_KEY` 在 `set -u` 下会让**整个步骤失败** —— 没配 key 的人本意是跳过摘要，却连发布一起挂掉。已改为 `"${ANTHROPIC_API_KEY:-}"`
  - `.github/zizmor.yml` 最终只有一条豁免（labeler / welcome 的 `pull_request_target`），依据写明「两者都不 checkout、不执行任何 PR 内容」，并预先声明「若将来有工作流要 checkout PR 的 head 分支，必须改代码而不是往豁免列表里加文件」

### 变更

- **`scripts/check-local-skills.{js,sh}` 由 `scripts/gen-local-skills.js` 与 `scripts/checks/vendor-lock.js` 取代**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。原脚本同时兼着「生成器」与「校验器」两个身份，一个想写文件、一个永远 `exit 0`，互相破坏。现在职责分开：生成器默认只打 stdout（要 `--write` 才落盘），一致性由检查器断言。
  - 生成物不再含时间戳，因此对同一份工作区逐字节确定，「生成物与生成器一致」这条判据才成立

- **`hygiene` 检查器豁免 `.trellis/.version` 与 `.trellis/.template-hashes.json` 的风格检查**（[#3](https://github.com/nicholyx/ai-skills/pull/3)）。这两个是 Trellis 自己写的记账文件，会在 `trellis update` 时被重写 —— 直接补末尾换行更简单，但那等于给未来的例行维护埋一个「CI 突然变红」。所以按与 vendor 区同样的原则豁免**风格**检查（末尾换行、BOM），**正确性检查照常执行**（UTF-8、U+FFFD、JSON 可解析）。

### 移除

- **`scripts/check-local-skills.js` 与 `scripts/check-local-skills.sh`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。由上面两个脚本取代。

### 修复

- **修正三处既有违规**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。它们在此之前没有暴露，是因为仓库还没有任何检查层；一旦接上 CI 就会立刻变红。
  - `github-issue-autofix-workflow` 仍在用改名前的技能名：`evals/evals.json` 的 `skill_name`、`README.md`、`SKILL.md` 三处都要跟着改。`skill_name` 与目录名不符时，按名字索引 eval 用例的工具会找不到它们
  - 4 个自建文件末尾缺换行：`git-sync-upstream/SKILL.md`、`github-issue-autofix-workflow/README.md`、`github-issue-autofix-workflow/SKILL.md`、`github-issue-autofix-workflow/evals/evals.json`
  - `local-skills.json` 里的 `generatedAt` 被移除。它是这份文件永远无法用作 diff 判据的唯一原因（实测重跑后整个文件恰好差这 1 行），而它本来就是冗余的 —— 文件什么时候生成的，`git log` 已经记着了

---

## 版本说明

- `[Unreleased]` 段由维护者在合并 PR 时更新；每个分类下按「改了什么 → 为什么」写，被否掉的方案也记进去，避免下次重新踩一遍
- 每个版本的分类固定为：`新增` / `变更` / `弃用` / `移除` / `修复` / `安全`，**不自创分类**；某一类没有内容就整段省略
- 破坏性变更在条目里用 **BREAKING** 标出。对这个仓库来说，「技能的行为变了」算破坏性变更 —— 使用者依赖的是技能的行为，不是它的文件名
- 已发布的版本按 `[X.Y.Z] - 日期` 归档，`[Unreleased]` 恢复为空壳

[Unreleased]: https://github.com/nicholyx/ai-skills/compare/v1.3.2...HEAD
[1.3.2]: https://github.com/nicholyx/ai-skills/releases/tag/v1.3.2
[1.3.1]: https://github.com/nicholyx/ai-skills/releases/tag/v1.3.1
[1.3.0]: https://github.com/nicholyx/ai-skills/releases/tag/v1.3.0
[1.2.0]: https://github.com/nicholyx/ai-skills/releases/tag/v1.2.0
[1.1.0]: https://github.com/nicholyx/ai-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/nicholyx/ai-skills/releases/tag/v1.0.0
