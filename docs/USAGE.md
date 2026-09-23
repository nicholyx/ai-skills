# 使用指南

从零把这个仓库的技能装进你的 AI 工具，并让它们真的生效。

> 💡 想先搞清楚「为什么这样设计」而不是「怎么用」，去看[架构与原理](ARCHITECTURE.md)。
> 这篇只讲操作。

---

## 目录

- [前置条件](#前置条件)
- [第一步：安装技能](#第一步安装技能)
- [第二步：确认技能生效](#第二步确认技能生效)
- [第三步：更新与卸载](#第三步更新与卸载)
- [skills-sync：同步到 Claude Code / CodeBuddy](#skills-sync同步到-claude-code--codebuddy)
- [自己写一个技能](#自己写一个技能)
- [常见场景](#常见场景)

---

## 前置条件

| 依赖 | 用途 | 必需吗 |
| --- | --- | --- |
| Node.js | 跑 `npx skills`；仓库自带的检查器也用 Node | 安装技能必需 |
| git | 克隆仓库、跑检查器（检查器以 git 索引为目标集） | 要改仓库时必需 |
| `uv` | 跑 `skills-sync` | 只在该技能需要时 |
| 一个认识 `SKILL.md` 的 AI 工具 | Claude Code、CodeBuddy 等 | 必需 |

仓库自身**不引入任何第三方依赖**：`scripts/` 下的检查器只用 Node 标准库，
`custom/daily/skills-sync/pyproject.toml` 的依赖列表是空的（`dependencies = []`）。
所以你不需要 `npm install` 或 `pip install` 任何东西。

---

## 第一步：安装技能

```bash
# 安装 .agents/skills 中的技能（默认搜索深度）
npx skills add nicholyx/ai-skills

# 安装全部技能（包括 custom 中的自建技能）
npx skills add nicholyx/ai-skills --full-depth

# 仅安装 custom 中的自建技能
npx skills add nicholyx/ai-skills/custom
```

### 三条命令怎么选

| 命令 | 装到什么 | 什么时候用 |
| --- | --- | --- |
| `npx skills add nicholyx/ai-skills` | `.agents/skills` 中的技能（默认搜索深度） | 只要上游那 31 个 |
| `npx skills add nicholyx/ai-skills --full-depth` | 全部，含 `custom/` 下的自建技能 | **推荐**，一次装齐 |
| `npx skills add nicholyx/ai-skills/custom` | 只有 `custom/` 下的自建技能 | 不想要上游那 31 个 |

> ⚠️ 三条命令**都不会**装 `custom/projects/` 下的项目专用技能 —— 它们假设你在那个项目里，
> 装到别处只会变成噪音。要它们就把目录复制走：见[目录约定](#目录约定)。

### 目录约定

一个技能 = 下面三个父目录之一的**深度 1** 子目录，且目录里有一个 `SKILL.md`：

```text
.agents/skills/<技能名>/SKILL.md     # 上游 vendored，31 个
custom/daily/<技能名>/SKILL.md       # 自建通用，12 个
custom/projects/<技能名>/SKILL.md    # 自建项目专用，1 个
```

只要嵌套更深就不算技能。这条限制不是保守：上游 `plugin-creator` 的
`assets/templates/` 下有一个更深的 `SKILL.md`，它是**模板素材**而不是技能，
连它的 `name` 都和所在目录名不符 —— 把它当成技能只会制造一个永远修不好的假失败。

---

## 第二步：确认技能生效

技能装到工具自己的技能目录里。以 Claude Code 为例：

```bash
# 看装进来了哪些技能
ls ~/.claude/skills/
```

然后**用一句话触发它**。技能的触发靠的是 `SKILL.md` frontmatter 里的 `description`，
所以最直接的验证是照着 description 的措辞说一遍：

```text
# git-commit 的 description 是「使用约定式提交规范执行 git commit」
> 帮我把当前的改动提交一下
```

如果 AI 没有按技能描述的流程走，先看
[排错手册的「技能装了但不生效」](TROUBLESHOOTING.md#技能装了但不生效)。

---

## 第三步：更新与卸载

```bash
# 查上游技能有没有新版本
npx skills check

# 更新全部上游技能（会替换 .agents/skills/ 下的内容）
npx skills update
```

> ⚠️ **`npx skills update` 是设计上的「全量替换」。** 你对 `.agents/skills/` 下文件做的
> 任何本地修改都会在这次更新里消失 —— 这不是 bug，是 vendor 区的定义。
> 想长期保留的改动，放进 `custom/`。

自建技能（`custom/`）不受 `npx skills update` 影响，改完提交到仓库，
下次别人安装时才会拿到新版本。

---

## skills-sync：同步到 Claude Code / CodeBuddy

`skills-sync` 是 `custom/daily/` 里的一个技能，用途和 `npx skills` 不同：

| | `npx skills` | `skills-sync` |
| --- | --- | --- |
| 来源 | GitHub 上的技能仓库 | 你本机的 `~/.agents/` |
| 方式 | 下载并安装 | 建**软链接**，不复制 |
| 适合 | 从别人那里装技能 | 让多个 AI 工具共用同一份本地技能 |

### 它做什么

把 `~/.agents/commands/` 和 `~/.agents/skills/` 下的每一项，软链到目标工具目录：

| 工具 | Commands 路径 | Skills 路径 |
| --- | --- | --- |
| Claude | `~/.claude/commands/` | `~/.claude/skills/` |
| CodeBuddy | `~/.codebuddy/commands/` | `~/.codebuddy/skills/` |

因为是软链接而不是拷贝，改一处，所有工具立刻都是新版。

### 参数

| 参数 | 必填 | 取值 | 说明 |
| --- | :---: | --- | --- |
| `--target` | ✅ | `claude`、`codebuddy`，或逗号分隔的多个 | 同步到哪个（哪些）工具 |
| `--type` | ✅ | `commands`、`skills`、`both` | 同步哪一类内容 |

两个参数都是必填的；`--type` 的取值受 `choices` 约束，写别的会被参数解析器直接拒绝。
`--target` 写错不会报「参数错误」，而是在运行时报：

```text
✗ 未知的目标工具: xxx
  支持的工具: claude, codebuddy
```

### 用法

```bash
# 同步 skills 到 Claude
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type skills

# 同步 commands 到 Claude
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type commands

# 两者都同步到 Claude
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type both

# 一次同步到两个工具
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude,codebuddy --type both
```

`--directory` 让 `uv` 在技能目录下执行，从而用该目录的 `pyproject.toml` 准备环境；
`sync.py` 本身只用标准库。路径按你实际的安装位置调整 —— 如果技能是通过
`npx skills add` 装进 `~/.claude/skills/` 的，那就是
`uv run --directory ~/.claude/skills/skills-sync python sync.py ...`。

### 输出怎么读

| 符号 | 含义 | 你需要做什么 |
| --- | --- | --- |
| `✓ 创建链接: <目标> -> <源>` | 新建了软链接 | 无 |
| `✓ 跳过（已存在有效链接）: <目标>` | 已经是有效软链接 | 无 |
| `✗ 删除无效链接: <目标>` | 链接指向的目标已经不存在，删掉 | 无（会自动重建） |
| `⚠ 跳过（目标已存在且不是软链接）: <目标>` | 目标位置有个**真实**文件/目录，不覆盖 | **要处理**，否则技能不生效 |
| `✗ 源目录不存在: <源>` | `~/.agents/commands/` 或 `~/.agents/skills/` 不存在 | 建目录或检查路径 |

收尾会打印四个计数（创建 / 跳过 / 删除 / 失败）。**只有「失败」大于 0 才会以退出码 1 结束**
—— 也就是说 `⚠ 跳过` 不算是错误，脚本会「成功」退出，但你的技能可能压根没接上。
详见[排错手册](TROUBLESHOOTING.md#技能装了但不生效)。

---

## 自己写一个技能

### 1. 决定放在哪

| 你的技能 | 放这里 |
| --- | --- |
| 任何项目都能用 | `custom/daily/<技能名>/` |
| 只对某一个项目有意义 | `custom/projects/prj-<项目>-<用途>/` |
| 从上游装来的第三方技能 | 不要手写，交给 `npx skills add` |

目录名就是技能名，**必须完全一致**（见下）。

### 2. SKILL.md 的 frontmatter 契约

frontmatter 是文件开头用 `---` 包起来的一段 YAML。仓库的检查器只实现官方校验器需要的那些事
（找顶层键、取标量值、跳过嵌套结构），并额外加了四条补强 —— 边界见
[架构与原理](ARCHITECTURE.md#为什么用-node-自研-frontmatter-解析器而不是-pyyaml)。

允许出现的顶层键**只有这 6 个**，多一个都会让 CI 失败：

| 键 | 必填 | 约束 |
| --- | :---: | --- |
| `name` | ✅ | kebab-case（小写字母、数字、连字符）；≤ 64 字符；不能以连字符开头/结尾，不能有连续连字符；**必须等于所在目录名** |
| `description` | ✅ | 非空；≤ 1024 字符；不能含尖括号 `<` 或 `>` |
| `license` | | 如 `MIT` |
| `allowed-tools` | | 如 `Bash` |
| `metadata` | | 嵌套结构，值不在此处解析 |
| `compatibility` | | ≤ 500 字符 |

「`name` 必须等于目录名」是本仓库自有的约定，官方校验器不查这一条 ——
但全仓技能当前 100% 满足，所以可以锁死。技能改名时漏改这里，
按名字索引技能的工具就找不到它了。

### 3. 可以放的附属文件

技能目录里除了 `SKILL.md`，还可以放：

| 文件 | 用途 | 示例 |
| --- | --- | --- |
| `*.md` | 主文件引用的补充材料 | `bug-analyzer-agent/bug-analyzer.md` |
| `README.md` | 给人看的说明 | `github-issue-autofix-workflow/README.md` |
| `reference/**` | 参考资料、模板、子 agent 定义 | `repo-analyzer/reference/subagents/*.md` |
| `evals/evals.json` | 评测用例 | `git-smart-update/evals/evals.json` |
| `sync.py` / `pyproject.toml` | 技能自带的脚本与依赖声明 | `skills-sync/` |

`evals/evals.json` 的结构由 CI 校验：

```json
{
  "skill_name": "<技能目录名，必须一致>",
  "evals": [
    {
      "id": 1,
      "prompt": "用户会说的话",
      "expected_output": "期望的结果",
      "files": [],
      "assertions": []
    }
  ]
}
```

`id`（数字）和 `prompt`（非空字符串）是硬要求；`expected_output`、`files`、`assertions`
缺失只提示不报错 —— 一条用例该断言什么是人的判断，机器不该替你决定。
**CI 只校验结构，不跑断言。**

### 4. 最小骨架

```markdown
---
name: my-skill
description: Use when ... （写清楚什么时候该触发，这是 AI 选择技能的唯一依据）
---

# My Skill

## 概述

这个技能解决什么问题。

## 执行流程

1. 第一步
2. 第二步
```

### 5. 写完自检

```bash
# 只跑技能相关的检查，秒级返回
./scripts/lint.sh --only frontmatter,evals,hygiene,links
```

检查器会告诉你：`name` 和目录名不符、缺 `description`、混进 `hidden` 之类没白名单的键、
文件带 BOM、用了 CRLF、末尾缺换行、正文里有失效的相对链接。

> ⚠️ `custom/**` 的内容会被软链进使用者的全局 AI 环境，那里写的每一句指令都是**会被执行**的。
> 写之前先看一眼[维护者手册的项目红线](MAINTAINER_GUIDE.md#项目红线)。

---

## 常见场景

### 我想让 AI 每次提交都按规范写提交信息

装 `git-commit` 技能（在 `custom/daily/` 里），然后直接说「帮我提交」。它的 description
就是「使用约定式提交规范执行 git commit」，正常措辞即可触发。

### 我在另一台机器上，想拿到全部技能

```bash
npx skills add nicholyx/ai-skills --full-depth
```

自建技能和上游技能都会装上。`custom/projects/` 下的项目技能需要手工复制。

### 我改了 `custom/` 里的技能，怎么让它在我本机生效

取决于你是**怎么装的**：

- 如果是 `npx skills add` 装进 `~/.claude/skills/` 的，重新跑一次安装（或直接改
  `~/.claude/skills/<技能名>/` 里的副本，但那份副本不会回到仓库）
- 如果你想改一处、所有工具立刻生效，用 `skills-sync` 从 `~/.agents/skills/` 软链过去

### 我想同时用 Claude Code 和 CodeBuddy

```bash
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude,codebuddy --type both
```

一份源，两个软链接，不存在「两边版本不一致」。

### 上游技能更新后我本地的东西没了

那不是丢失，是 vendor 区的正常行为 —— 见
[排错手册](TROUBLESHOOTING.md#npx-skills-update-之后本地对-agents-的改动消失)。
