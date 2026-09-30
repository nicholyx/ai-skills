<div align="center">

# ai-skills

个人 Claude Code Skills 仓库：15 个自建通用技能 + 1 个项目专用技能，
另附 31 个由 `skills-lock.json` 追踪的上游技能。

[![CI](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/nicholyx/ai-skills)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicholyx/ai-skills?style=social)](https://github.com/nicholyx/ai-skills/stargazers)

[快速开始](#快速开始) · [技能目录](docs/SKILLS.md) · [使用指南](docs/USAGE.md) · [架构与原理](docs/ARCHITECTURE.md) · [排错手册](docs/TROUBLESHOOTING.md) · [维护者手册](docs/MAINTAINER_GUIDE.md) · [更新日志](CHANGELOG.md)

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

---

## 特性

- **15 个自建通用技能**，覆盖 git 操作、代码审查、Bug 分析、仓库分析、日报、Obsidian 笔记等日常场景
- **1 个项目专用技能**，按 `prj-` 前缀隔离，不污染通用安装
- **上游区与自建区物理隔离**：`npx skills update` 只动 `.agents/`，不会碰到你的自建技能
- **上游技能有 lock 可查**：`skills-lock.json` 记录每个技能来自哪个 GitHub 仓库，`npx skills update` 据此更新
- **一套本地静态检查**：`./scripts/lint.sh` 一条命令跑完 18 项检查，其中 6 项是纯 Node、无需额外安装
- **零第三方依赖**：检查器只用 Node 标准库；`skills-sync` 的 `pyproject.toml` 依赖列表为空
- **技能自带评测用例**：部分技能附带 `evals/evals.json`，CI 校验其结构

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
# 装本仓库的全部技能（15 个）
npx skills add nicholyx/ai-skills

# 只装通用技能，跳过项目专用的那 1 个（14 个）
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
# 看装进来的技能（以 Claude Code 为例）
ls ~/.claude/skills/

# 检查上游技能有没有新版本
npx skills check

# 更新全部上游技能
npx skills update
```

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
├── .agents/skills/         # 上游 vendored 技能（31 个，只读，占仓库约 97% 体积）
├── custom/
│   ├── daily/              # 自建通用技能（14 个）
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
