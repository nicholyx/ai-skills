<div align="center">

# ai-skills

个人 Claude Code Skills 仓库：12 个自建通用技能 + 1 个项目专用技能，
另附 31 个由 `skills-lock.json` 追踪的上游技能。

[![CI](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/nicholyx/ai-skills)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicholyx/ai-skills?style=social)](https://github.com/nicholyx/ai-skills/stargazers)

[快速开始](#快速开始) · [使用指南](docs/USAGE.md) · [架构与原理](docs/ARCHITECTURE.md) · [排错手册](docs/TROUBLESHOOTING.md) · [维护者手册](docs/MAINTAINER_GUIDE.md) · [更新日志](CHANGELOG.md)

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

- **12 个自建通用技能**，覆盖 git 操作、代码审查、Bug 分析、仓库分析、日报、Obsidian 笔记等日常场景
- **1 个项目专用技能**，按 `prj-` 前缀隔离，不污染通用安装
- **上游区与自建区物理隔离**：`npx skills update` 只动 `.agents/`，不会碰到你的自建技能
- **上游技能有 lock 可查**：`skills-lock.json` 记录每个技能来自哪个 GitHub 仓库，`npx skills update` 据此更新
- **一套本地静态检查**：`./scripts/lint.sh` 一条命令跑完 10 项检查，其中 6 项是纯 Node、无需额外安装
- **零第三方依赖**：检查器只用 Node 标准库；`skills-sync` 的 `pyproject.toml` 依赖列表为空
- **技能自带评测用例**：部分技能附带 `evals/evals.json`，CI 校验其结构

---

## 快速开始

```bash
# 安装 .agents/skills 中的技能（默认搜索深度）
npx skills add nicholyx/ai-skills

# 安装全部技能（包括 custom 中的自建技能）
npx skills add nicholyx/ai-skills --full-depth

# 仅安装 custom 中的自建技能
npx skills add nicholyx/ai-skills/custom
```

> ⚠️ 三条命令装到的技能都**不含** `custom/projects/` 下的项目专用技能 —— 见[目录约定](#目录约定)。
> 想要它们，把整个目录复制走，或者用 `skills-sync` 自己软链。

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

这 14 个技能跨项目可用，是 `npx skills add nicholyx/ai-skills --full-depth` 装到的主要内容。

| 技能 | 说明 |
| --- | --- |
| `bug-analyzer-agent` | Bug 根因分析专家，使用独立上下文的 subagent 执行深度代码执行流分析和根因定位 |
| `code-reviewer-agent` | 代码审查专家，使用独立上下文的 subagent 执行深度代码审查，覆盖安全漏洞、性能优化和生产可靠性 |
| `daily-report` | 根据 git 提交记录生成工作日报，支持指定日期查询和智能归类 |
| `git-commit` | 使用约定式提交规范执行 git commit |
| `git-smart-update` | 智能 Git 更新工具，支持自动暂存、冲突解决和本地提交处理。当用户说"更新代码"、"拉取最新代码"、"git pull"、"更新当前分支"、"更新所有分支"、"保留本地修改并更新"时触发。自动处理 stash-update-restore 循环，智能解决冲突（优先采用远程改进，同时保留本地调试代码），支持 rebase 和 merge 两种模式。 |
| `git-sync-upstream` | Fork 仓库同步 upstream 最新代码到当前分支，使用 rebase 方式保持提交历史整洁。当用户说"同步upstream"、"rebase upstream"、"更新upstream main"、"拉取upstream更新"、"同步上游仓库"、"fork仓库更新"、"更新PR分支"时触发。自动处理未提交更改（stash/rebase/pop）、fetch upstream、rebase 到最新、强制推送更新 PR。专门用于 fork 仓库同步上游更新的场景，不适用于普通的 git pull 操作。 |
| `github-issue-autofix-workflow` | 使用 superpowers 工作流修复 GitHub issue。支持自动化模式（用户输入"自动化处理"时全程无需确认）。强制使用 brainstorming 理解需求，test-driven-development 编写测试，verification-before-completion 验证，requesting-code-review 代码审查。适用于用户请求修复 issue、处理 bug、添加功能等场景。 |
| `maintain-loop` | 开源项目的维护闭环流程——规划、实现、发布、继续规划的完整循环，以及踩坑沉淀的硬规则。当需要在项目中继续迭代（新功能、修缺陷、补文档）、发布新版本、盘点未完成事项，或有人说「继续」「走维护流程」「按开源流程开发」时使用。 |
| `obsidian-note-workflow` | Use when creating, querying, or managing Obsidian notes with preview-first workflow, intelligent classification, automatic directory creation, and vault initialization |
| `oss-bootstrap` | 把一个新项目（或只有代码的裸仓库）落实为符合主流规范的开源项目——CI、治理文件、Issue/PR 模板、仓库自动化、文档体系、看板与发布流程。当用户说「新建开源项目」「给项目加上 CI / 规范」「按热门开源项目的标准搭基建」时使用。基建就位后的日常迭代请改用 `maintain-loop`。 |
| `repo-analyzer` | 深入研究代码仓库的源代码，以首次开发人员的角度进行全面分析。当用户说"深入研究一下 xxx 项目"、"帮我分析这个代码仓库"、"了解这个项目的架构"、"分析 github.com/xxx/xxx 仓库"时触发。支持本地目录和 GitHub 仓库地址，自动下载并分析项目结构、启动流程、核心业务流程、模块职责等，最后生成详细的分析报告文档。 |
| `skills-sync` | Use when you need to synchronize commands and skills from ~/.agents/ to AI tool directories like Claude or CodeBuddy using symbolic links |
| `update-claude-code` | 当用户提到"更新 claude"、"升级 claude code"、"检查 claude 版本"、"claude code 最新版本"时使用此技能。 |
| `update-opencode` | Use when users need to update OpenCode CLI or oh-my-opencode plugin, check for new versions, or troubleshoot version-related issues. Use when seeing errors like "seems to be managed by a package manager" or "opencode upgrade doesn't move to newest version". |

> 📖 每个技能的完整触发条件与执行流程在其 `SKILL.md` 里；`skills-sync` 的完整参数说明见
> [使用指南](docs/USAGE.md#skills-sync同步到-claude-code--codebuddy)。

### 自建 · 项目专用（`custom/projects/`）

| 技能 | 说明 |
| --- | --- |
| `prj-agent-platform-e2e-test` | 使用 agent-browser 对 Agent 平台核心功能进行端到端验证 |

> ⚠️ 这一类技能**不适合通用安装**。它们假设你手上就是那个项目（特定的页面、特定的接口、
> 特定的启动方式），换一个仓库跑只会得到一堆无关的指令。
> 这也是它们带 `prj-` 前缀的原因 —— 让「这是某个项目的」在技能名里就看得出来。

### 上游（`.agents/skills/`）

31 个第三方技能，来源记录在 `skills-lock.json` 里。列出全部来源：

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
│   ├── daily/              # 自建通用技能（12 个）
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
| 安装 | `npx skills add` 装得到 | 不随通用安装分发 |
| 示例 | 日报生成、git 操作、代码分析 | 某项目的 e2e 测试、某项目的部署流程 |

---

## 开发与贡献

改这个仓库之前，先读[架构与原理](docs/ARCHITECTURE.md) —— 里面记着每条设计规则的**理由**
和被否掉的方案，省得你重新踩一遍。

```bash
# 提交前跑一次本地检查（10 项，其中 6 项纯 Node、零依赖）
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
