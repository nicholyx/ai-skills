<div align="center">

# ai-skills

15 个自建通用技能 + 1 个项目专用技能，覆盖 git 操作、代码审查、Bug 根因分析、仓库分析、
日报、Obsidian 笔记等日常场景。装进 Claude Code、CodeBuddy、Codex 等认识 `SKILL.md` 的
AI 工具后，用一句自然语言唤起。

```bash
npx skills add nicholyx/ai-skills
```

仓库里另有 31 个上游第三方技能，**不随这条命令安装** —— 见[技能清单](#技能清单)。

[![skills.sh](https://skills.sh/b/nicholyx/ai-skills)](https://skills.sh/nicholyx/ai-skills)
[![CI](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml)
[![静态检查](https://img.shields.io/badge/%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5-18%20%E9%A1%B9-brightgreen)](https://github.com/nicholyx/ai-skills/blob/main/scripts/lint.sh)
[![License](https://img.shields.io/github/license/nicholyx/ai-skills)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicholyx/ai-skills?style=social)](https://github.com/nicholyx/ai-skills/stargazers)

[快速开始](#快速开始) · [技能目录](docs/SKILLS.md) · [使用指南](docs/USAGE.md) · [自己写技能](docs/USAGE.md#自己写一个技能) · [排错手册](docs/TROUBLESHOOTING.md) · [更新日志](CHANGELOG.md)

**中文** | [English](README.en.md)

</div>

---

## 这是什么

这是一个**个人技能仓库**，用 [`npx skills`](https://www.npmjs.com/package/skills) 安装到 Claude Code、CodeBuddy 等 AI 工具里，
装完之后这些技能就成为你本机 AI 环境的一部分。

仓库里有两类内容，**来源和维护方式完全不同**：

| 目录 | 是什么 | 谁维护 |
| --- | --- | --- |
| `custom/` | 自建技能，我们自己的指令 | 本仓库，手写 |
| `.agents/skills/` | 从上游仓库装来的第三方技能 | 上游作者，`npx skills update` 更新 |

这样切分的理由很简单：`.agents/skills/` 里的东西**会被 `npx skills update` 全量替换**，
所以任何落在那里面的本地修改都会在某次更新后静默消失。
自己的技能放在 `custom/` 才留得住。

也因为这个仓库的全部价值就是「这些技能能被 AI 工具正确加载」，
仓库自带一套静态检查（`./scripts/lint.sh`）盯着技能文件的格式契约 ——
`name` 与目录名不符、缺 `description`、编码写坏，都会在合并前被拦下。
检查器只用 Node 标准库，`skills-sync` 的 `pyproject.toml` 依赖列表为空 —— **零第三方依赖**，
你不需要 `npm install` 或 `pip install`；部分技能还附带 `evals/evals.json`，CI 会校验它的结构。

---

## 快速开始

### 先试再装

**不确定要不要装？任何一个技能都可以不安装先试。** 把技能名换成[技能目录](docs/SKILLS.md)里的名字：

```bash
npx skills use nicholyx/ai-skills@<技能名>
```

它会生成一段可直接粘贴给 AI 的提示词 —— **不安装、不改任何配置**，试完不满意随时走开。
唯一会落盘的，是它下载到系统临时目录、供 AI 读取的那份技能文件（详见
[使用指南](docs/USAGE.md) 第零步）。觉得好用再往下走。

### 装到本地

```bash
# 装本仓库的全部技能（16 个）
npx skills add nicholyx/ai-skills

# 只装通用技能，跳过项目专用的那 1 个（15 个）
npx skills add nicholyx/ai-skills/custom/daily
```

**装到的是 `custom/` 下的技能** —— 也就是本仓库自己维护、自己分发的那部分。

> **`.agents/skills/` 里的 31 个上游技能不在安装面内**，也不会被这两条命令装到。
> 它们是 `npx skills` 的**安装目标目录**（工具的工作区），不是本仓库分发的产品。
> 想要其中某个，从它**自己的源仓库**装 —— 来源都记在 `skills-lock.json` 里：
>
> ```bash
> npx skills add vercel-labs/agent-browser        # 例：装 agent-browser
> ```
>
> 本仓库不把它们算作自己的产品 —— 那是第三方内容：我们无权修，出了问题也改不了。
> 详见[为什么 `.agents/` 不在安装面](docs/ARCHITECTURE.md)。

装完之后：

```bash
# 看装进来的技能。默认装到"当前目录"这一层，所以先看这里：
ls .claude/skills/

# 如果你是加 -g 装的（用户级），看这里：
ls ~/.claude/skills/

# 检查上游技能有没有新版本
npx skills check

# 更新全部上游技能
npx skills update

# 卸载技能：写技能名卸一个，--all 卸全部（两者别混用）
npx skills remove <技能名>
npx skills remove --all
```

### 另一条通道：Claude Code 插件市场

只用 Claude Code 的话，还可以走它自己的插件通道。仓库根目录的
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) 就是给它读的，
列的正是本仓库那 16 个自建技能：

```bash
claude plugin marketplace add nicholyx/ai-skills
claude plugin install ai-skills@ai-skills
```

| | `npx skills add nicholyx/ai-skills` | `claude plugin ...` |
| --- | --- | --- |
| 装到哪 | 各 AI 工具的技能目录（见下面的兼容矩阵） | Claude Code 自己管的插件位置（`~/.claude/plugins/`）|
| 技能名 | 原名，如 `daily-report` | 带插件前缀：`ai-skills:daily-report` |
| 什么时候用 | 还想同步给 Claude Code 之外的其它工具 | 只用 Claude Code，且想让 `/plugin` 面板统一管 |

> **实测**（Claude Code 2.1.283）：`claude plugin validate .` 通过；
> 装上之后 `claude plugin details ai-skills` 列出 `Skills (16)`。
> 这份 `marketplace.json` 是**生成物** —— 技能增删后重跑
> `node scripts/gen-catalogue.js --write`，CI 会断言它与技能源头一致。

### 装完先验证：说一句话，看技能起不起得来

**装完别急着用。** 技能是靠 `SKILL.md` 里的 `description` 被选中的，所以最快的验证方式是
**照着技能自己的说法说一句话**，看它有没有按技能描述的流程走。

下面三句都取自技能的 `metadata.example` —— 也就是[技能目录](docs/SKILLS.md)里
「你可以这样说」那一列的**原话**，不是我另编的：

| 说这句 | 技能 | 你应该看到 |
| --- | --- | --- |
| `生成今天的日报` | `daily-report` | 先贴出默认日报模板问你「要不要改」，你确认后才跑 `git log`，再按模块归类 |
| `审查一下我暂存区的改动` | `code-reviewer-agent` | **开一个独立上下文的 subagent** 审查 `git diff --cached`，结果原样返回 |
| `技能装了但用不了，帮我看看` | `skills-doctor` | 四步排查：装在哪个目录、软链断没断、`SKILL.md` 能不能加载、有没有被别的目录顶掉 |

**说这句话，技能会起来；没反应才说明装错了。** 如果 AI 完全没按上面那列的流程走
（比如日报那句它干脆自己编一份、审查那句它不开 subagent 而是自己扫一眼），别先怀疑技能写得不好
—— 按[排错手册的「技能装了但不生效」](docs/TROUBLESHOOTING.md#技能装了但不生效)查一遍，
最常见的两种原因是：**装到了工具不读的目录**，或者**技能目录被别的来源顶掉了，模型根本看不见它**。

### 兼容矩阵：技能装到哪、用户级还是项目级

`npx skills` 默认装**项目级**（当前目录），加 `-g` / `--global` 才是**用户级**（任何项目都能用）。

**文件本体只有一份，落在项目根的 `.agents/skills/<技能名>/`**，下表那些工具目录里放的
都是指向它的软链接 —— 所以你在 `./.claude/skills/<技能名>/` 里改的字，改的其实是
`.agents/skills/` 里那一份，而那个目录会被 `npx skills update` 全量替换。

| AI 工具 | 项目级（默认） | 用户级（`-g`） |
| --- | --- | --- |
| Claude Code | `./.claude/skills/<技能名>/` | `~/.claude/skills/<技能名>/` |
| CodeBuddy | `./.codebuddy/skills/<技能名>/` | `~/.codebuddy/skills/<技能名>/` |
| 其它认识 `SKILL.md` 的工具（Codex、Cursor 等） | 由 CLI 按它检测到的工具决定；`-a '*'` 一次装到全部 | 同左 |

上表每一条都能在仓库里找到出处，**不是凭记忆写的**：

- 「默认项目级、`-g` 才是用户级」：`npx skills add --help`（CLI 1.7.0）的原文
  `-g, --global  Install skill globally (user-level) instead of project-level` —— **实测**
- 「本体在 `.agents/skills/`、工具目录里是软链」：在空目录里跑 `npx skills add` 实测 ——
  真身是 `./.agents/skills/<技能名>/SKILL.md`，`./.claude/skills/<技能名>` 是指向它的软链
  （`readlink` 得到 `../../.agents/skills/<技能名>`）
- `./.claude/skills/`：`docs/USAGE.en.md` 的「Where the skills land」一节
- `~/.claude/skills/` 与 `~/.codebuddy/skills/`：`docs/USAGE.md` 的 `skills-sync` 参数表
  —— 这两个是仓库里**被点名验证过**的目录
- 各工具目录的**名字**（`.claude/skills`、`.codebuddy/skills`、`.codex/skills`、`.cursor/skills` …）：
  `skills` CLI 内置的工具探测列表（本机 v1.7.0）。除上面两个之外，其余工具本仓库**未逐一实测**

> 💡 技能装了却「不生效」是这份文档里最高频的问题，先看
> [排错手册的「技能装了不生效」](docs/TROUBLESHOOTING.md#技能装了但不生效)一节。

---

## 技能清单

### 自建 · 通用（`custom/daily/`）

> 📖 带**触发示例**与**试用命令**的版本在[技能目录](docs/SKILLS.md) —— 下面这张表是给搜索引擎和快速扫读用的简表。

<!-- SKILLS-TABLE:START daily -->
这 15 个技能跨项目可用，是 `npx skills add nicholyx/ai-skills` 装到的主要内容。

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| `bug-analyzer-agent` | 独立上下文深挖 Bug 根因，给出执行流级别的分析 | 「这个接口偶尔返回 500，帮我查根因」 |
| `code-reviewer-agent` | 独立上下文的深度代码审查，覆盖安全、性能与生产可靠性 | 「审查一下我暂存区的改动」 |
| `daily-report` | 从 git 提交记录生成工作日报，按项目自动归类 | 「生成今天的日报」 |
| `git-commit` | 按约定式提交规范生成提交信息并提交 | 「帮我提交」 |
| `git-smart-update` | 带 stash 循环的智能拉取，自动处理本地改动与冲突 | 「更新代码」 |
| `git-sync-upstream` | fork 仓库用 rebase 同步上游，保持提交历史线性 | 「同步 upstream」 |
| `github-issue-autofix-workflow` | 从 GitHub Issue 出发，走 brainstorm → TDD → 代码审查的完整修复流程 | 「帮我修一下 issue 42」 |
| `maintain-loop` | 开源项目的维护闭环：规划 → 实现 → 发布 → 继续规划 | 「继续走维护流程」 |
| `obsidian-note-workflow` | 预览优先的 Obsidian 笔记创建、分类与整库初始化 | 「把这段内容记到我的 Obsidian 里」 |
| `oss-bootstrap` | 把裸仓库搭成合规开源项目：CI、治理、模板、自动化、文档 | 「给这个项目加上开源规范」 |
| `repo-analyzer` | 并行 subagent 深读陌生仓库，产出架构与业务流分析报告 | 「深入研究一下这个项目」 |
| `skills-doctor` | 排查「技能装了没反应」：装在哪、断链、加载失败、被顶掉 | 「技能装了但用不了，帮我看看」 |
| `skills-sync` | 用软链接把技能与命令同步到 Claude / CodeBuddy | 「把我的技能同步到 Claude」 |
| `update-claude-code` | 检查并升级 Claude Code 到最新版本 | 「更新 claude」 |
| `update-opencode` | 检查并升级 OpenCode 与 oh-my-opencode 插件 | 「更新 opencode」 |
<!-- SKILLS-TABLE:END daily -->

> 📖 每个技能的完整触发条件与执行流程在其 `SKILL.md` 里；`skills-sync` 的完整参数说明见
> [使用指南](docs/USAGE.md#skills-sync同步到-claude-code--codebuddy)。

### 自建 · 项目专用（`custom/projects/`）

<!-- SKILLS-TABLE:START projects -->
| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| `prj-agent-platform-e2e-test` | 用 agent-browser 对 Agent 平台核心功能做端到端验证 | 「跑一遍 Agent 平台的端到端测试」 |
<!-- SKILLS-TABLE:END projects -->

> ⚠️ 这一类技能**不适合通用安装**。它们假设你手上就是那个项目（特定的页面、特定的接口、
> 特定的启动方式），换一个仓库跑只会得到一堆无关的指令。
> 这也是它们带 `prj-` 前缀的原因 —— 让「这是某个项目的」在技能名里就看得出来。

### 上游（`.agents/skills/`）

31 个第三方技能，**不在安装面内**。它们是 `npx skills` 的安装目标目录 ——
你自己用 `npx skills add <上游仓库>` 装进来的东西会落在这里，提交进仓库只是为了让
这套环境可复现。

要用其中某个，直接从它**自己的源仓库**装。来源都记在 `skills-lock.json` 里：

```bash
# 技能名 + 上游仓库，按仓库名排序
jq -r '.skills | to_entries | sort_by(.value.source)[] | "\(.key)\t\(.value.source)"' skills-lock.json
```

> ⚠️ **不要直接改 `.agents/` 里的文件。** 那是 vendor 区，`npx skills update` 会把它整个换掉，
> 你的修改会连同它的存在一起消失。要改就 fork 上游、或者把技能复制进 `custom/`。
> 详见[架构与原理](docs/ARCHITECTURE.md#为什么-agents-是只读-vendor-区)。

---

## 目录约定

```text
ai-skills/
├── .agents/skills/         # 上游 vendored 技能（31 个，只读，占仓库绝大部分体积）
├── .claude-plugin/         # Claude Code 插件市场清单（生成物，见「另一条通道」）
├── custom/
│   ├── daily/              # 自建通用技能（15 个）
│   └── projects/           # 自建项目专用技能（1 个，prj- 前缀）
├── docs/                   # 本仓库的文档
├── scripts/                # 静态检查与生成器
├── skills-lock.json        # 上游技能的来源与版本
├── local-skills.json       # 上游技能的人读清单（由脚本生成）
└── README.md
```

### `.agents/skills/` vs `custom/`

| | `.agents/skills/` | `custom/` |
| --- | --- | --- |
| **会分发给用户吗** | **不会** —— 是工具的安装目标目录 | **会** —— `npx skills add` 装到的就是它 |
| 来源 | `npx skills add` 从上游仓库安装 | 自己编写和维护 |
| 追踪 | `skills-lock.json` 记录来源与版本 | 无 lock 文件 |
| 更新 | `npx skills update` 全量替换 | 手动维护 |
| 可以改吗 | **不可以**，改了会被更新冲掉 | 可以，这就是它的用途 |
| 检查严格度 | 违规只 warn、不阻塞 CI | 违规直接 fail |

### `custom/daily/` vs `custom/projects/`

| | `custom/daily/` | `custom/projects/` |
| --- | --- | --- |
| 定位 | 通用技能，任何项目都能用 | 特定项目专用 |
| 命名 | 直接用功能名，如 `git-commit` | 加 `prj-` 前缀，如 `prj-agent-platform-e2e-test` |
| 安装 | 默认命令装得到 | **默认也装得到** —— 想跳过就用 `.../custom/daily` |
| 示例 | 日报生成、git 操作、代码分析 | 某项目的 e2e 测试、某项目的部署流程 |

---

## 开发与贡献

改这个仓库之前，先读 [AGENTS.md](AGENTS.md) —— 规则、开发流程与红线都在那里，
**它是唯一来源**；再读[架构与原理](docs/ARCHITECTURE.md)，里面记着每条设计规则的**理由**
和被否掉的方案，省得你重新踩一遍。

```bash
# 提交前跑一次本地检查（18 项检查，其中 10 项纯 Node、零依赖）
./scripts/lint.sh

# 只跑某几项
./scripts/lint.sh --only frontmatter,links

# 顺手校验提交信息（但覆盖不了 PR 标题，见下）
./scripts/lint.sh --commits origin/main..HEAD
```

提交信息遵循[约定式提交](https://www.conventionalcommits.org/zh-hans/)：

```text
<类型>(<范围>): <描述>

feat(custom): 新增并接入 oss-bootstrap 技能
fix(skills-sync): 修复失效软链未被清理的问题
docs: 补充 custom/projects 的命名约定
```

允许的类型：`feat` `fix` `docs` `ci` `chore` `refactor` `perf` `test` `style` `revert` `build`。
CI 会同时校验 PR 里的每一个提交**和 PR 标题**（squash 合并后标题会成为提交信息）。

> ⚠️ `./scripts/lint.sh` 是绿的**不等于** CI 会绿：PR 标题在 PR 建立之前根本不存在，
> 本地无从验证。全绿之后的最后一步仍然是把标题写规范。

---

## 路线图

路线图的**单一事实来源**是 [Issue #7 · 路线图（Roadmap）](https://github.com/nicholyx/ai-skills/issues/7)。
本 README 不复制它的内容 —— 两处各写一份，迟早会不一致。

那里记录了「计划中」的条目、「已完成」的版本，以及几个**有意识接受**的已知缺口
（例如 `evals.json` 的 `assertions` 字段不完整、上游技能里有我们无权修的违规）。
按那里的「明确不做」一节，可以在讨论需求时省掉不少来回。

---

## 文档索引

| 文档 | 内容 | 适合谁 |
| --- | --- | --- |
| [README.md](README.md) | 这是什么、装什么、怎么装 | 所有人 |
| [AGENTS.md](AGENTS.md) | **规则、开发流程、红线** —— 规则的唯一来源（`CLAUDE.md` 只是转发指针）| 想改这个仓库的人、AI 会话 |
| [使用指南](docs/USAGE.md) | 从零跑起来：安装、生效、`skills-sync` 参数、自己写技能 | 使用者 |
| [架构与原理](docs/ARCHITECTURE.md) | 为什么这样设计、被否掉的方案、`scripts/` 各文件职责 | 想改这个仓库的人 |
| [排错手册](docs/TROUBLESHOOTING.md) | 现象 / 原因 / 解决，保留报错原文 | 出问题的时候 |
| [维护者手册](docs/MAINTAINER_GUIDE.md) | 仓库配置清单、项目红线、维护节奏、审查 PR | 维护者 |
| [更新日志](CHANGELOG.md) | 每个版本改了什么 | 所有人 |

---

## 许可证

[Apache License 2.0](LICENSE)。

上游技能（`.agents/skills/`）的版权归各自作者所有，
许可证随技能目录内的文件一同分发；本仓库的许可证只覆盖 `custom/`、`docs/`、`scripts/`
与本仓库自己维护的配置文件。
