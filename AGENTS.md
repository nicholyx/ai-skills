<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->

---

## 项目特定说明（人工维护，不在受管块内）

上面受管块里提到的 `.agents/skills/` 是 Trellis 的**通用措辞**。**在本仓库里它的含义
不同**，见下。

### 这个仓库是什么

一个 Claude Code Skills 仓库：**自建技能在这里维护并对外分发**（`npx skills add` 装到的就是它们），上游第三方技能只是本地工作区、不在安装面内。

| 位置 | 是什么 | 能不能改 |
| --- | --- | --- |
| `custom/daily/`、`custom/projects/` | **自建技能**，15 个（`npx skills add` 装到的就是它们） | ✅ 这是主要工作区 |
| `.agents/skills/` | **上游技能**，31 个，占仓库绝大部分体积。是 `npx skills` 的**安装目标目录**；`npx skills add` **默认不安装**它们（实测只报 16 个自建技能） | ❌ **一律不改**，改了会在 `npx skills update` 时丢失 |
| `.claude/` | Trellis 的平台层，**已 gitignore、不在仓库里** | — 克隆后跑一次 `trellis init --claude -y` 生成，见 [CONTRIBUTING](CONTRIBUTING.md) |

`custom/**` 的内容会被 `custom/daily/skills-sync/` 软链进 `~/.claude/skills`，
**在使用者的全局 AI 环境里生效**。写技能内容时按这个前提对待。

### 文档语言

中文为主。`README.en.md` 是英文入口而非全文。

### 动手前必读

- 改技能（`custom/**`）→ [`.trellis/spec/skills/index.md`](.trellis/spec/skills/index.md) —— frontmatter 契约与内容红线
- 改检查器或 `scripts/` → [`.trellis/spec/checks/index.md`](.trellis/spec/checks/index.md) —— 退出码语义与分级原则
- 改工作流、发版、PR → [`.trellis/spec/maintenance/index.md`](.trellis/spec/maintenance/index.md)
- **写测试、加检查、判断「验够了没有」→ [`.trellis/spec/testing/index.md`](.trellis/spec/testing/index.md)** —— 四层测试、验收标准、踩过的坑
- 总导航见 [`.trellis/spec/index.md`](.trellis/spec/index.md)

**上面这些是「指针」不是「内容」** —— 它们**没有**被加载进你的上下文（每次会话只加载
本文件与 `CLAUDE.md`）。所以「知道该读哪个文件」不等于「知道里面写了什么」，**动手前
必须真的把对应文件打开**。实测过：只凭本文件的指针回答「加一个检查器要接几处」，
答得出「lint.sh 与 ci.yml」，而 spec 里写的是**五处** —— 差的正是没打开文件的那部分。

### 本地检查入口

```bash
./scripts/lint.sh          # 18 项静态检查，目标是「本地绿 == CI 绿」
./scripts/lint.sh --list   # 看有哪些检查项
```

**它不覆盖 PR 标题** —— CI 的 `commit-messages` job 会校验 PR 标题，而标题在 PR 建立
之前不存在。**本地全绿不等于 commit-messages 会绿**，标题仍需自己按 Conventional
Commits 写。

### 开发流程

本仓库的日常是**改技能、改检查器、发版**。流程固定，照做即可：

1. **先探测现状** —— 别在不知道当前状态的情况下动手：

   ```bash
   git log --oneline -5 && git status && gh pr list && gh issue list
   ```

2. **改之前读对应规范** —— 见上面「动手前必读」那张表。
3. **改完跑静态检查**：`./scripts/lint.sh`，必须全绿。它查不出 PR 标题，标题自己按约定式写。
4. **改了技能内容，再跑行为评测**：`node scripts/run-evals.js --skill <名字>` ——
   但要先读下一节，**它通过不等于有效**。
5. **提 PR**：`git checkout -b <类型>/<名字>` → 提交 → 推送 → `gh pr create`。
   **PR 标题按 Conventional Commits 写**（squash 合并后，它就是那条提交信息）。
6. **CI 全绿再合并**：`gh pr merge <N> --squash --delete-branch`。
7. **发布**：把 `[Unreleased]` 归档成 `[X.Y.Z] - 日期` → 单独一个 PR → 合并 →
   `git tag -a vX.Y.Z` → `git push origin vX.Y.Z`。
   [`release.yml`](.github/workflows/release.yml) 据此生成发布说明。

**分工：主会话是调度者与验收者，不自己写实现。** 每个任务拆好之后派给子 agent 实现，
主会话负责**独立复核**（复跑它的验证，不要只读报告）与合并。规则见
[`.trellis/spec/index.md`](.trellis/spec/index.md) 的「角色分工」。

**下一步做什么，看[路线图 Issue](https://github.com/nicholyx/ai-skills/issues/7) —— 那是单一事实来源。**
每一轮迭代后由维护者更新它，别在别处另起一份计划。

更完整的方法论（含与具体项目无关的硬规则）见 [maintain-loop](custom/daily/maintain-loop/SKILL.md)；
从零把一个裸仓库搭成规范开源项目的六阶段流程见 [oss-bootstrap](custom/daily/oss-bootstrap/SKILL.md)
（本仓库已经搭完，日常用不上）。

### 三层验证，以及「通过不等于有效」

技能「能不能用」分三段，各有一层挡着 —— **但只有第一层是可靠的**：

| 层 | 工具 | 现状 |
| --- | --- | --- |
| 静态 | `./scripts/lint.sh`（18 项检查）| 进 CI，每次 PR 都跑 |
| 行为 | [`scripts/run-evals.js`](scripts/run-evals.js) | 只对 `git-commit` 可跑，且通过**不等于**有效 |
| 触发 | 无 | 试过，**造不出来**（见下）|

**「一个用例通过」不等于「它在测这个技能」。** 用 `--ablate` 复核：只有「装了过、
不装挂」才算数。`skills-doctor` 的三条用例**全绿过**，消融一测 **0 条有区分度**，
已撤掉。触发测试同理：它跑过 **15/15**，而那份成绩单不含任何信息。

**任何新的断言、检查、测试，先证明它能失败** —— 用变异测试把被测对象改坏，看它是否
报红。本仓库反复栽在这上面，例如最近三次：规则 B 的恒真断言、触发测试的 15/15、
`skills-doctor` 的 3/3。完整记录在
[`.trellis/spec/skills/index.md`](.trellis/spec/skills/index.md)。

### 常见任务从哪开始

| 要做什么 | 入口 |
| --- | --- |
| 加一个技能 | `node scripts/new-skill.js <名字> --tagline "…" --example "…"` |
| 改技能内容 | [`.trellis/spec/skills/index.md`](.trellis/spec/skills/index.md) |
| 加 / 改检查器 | [`.trellis/spec/checks/index.md`](.trellis/spec/checks/index.md) |
| 发版 / PR / CHANGELOG | [`.trellis/spec/maintenance/index.md`](.trellis/spec/maintenance/index.md) |
| 技能清单（**生成物，别手改**）| [`docs/SKILLS.md`](docs/SKILLS.md) |

### RED LINES

- **别删 `CLAUDE.md` 里的 `@AGENTS.md` 那一行。** 规则只有一份（在 `AGENTS.md`），而
  Claude Code 不会自动读它 —— 靠那一行的**导入语法**把全文拉进每次会话的上下文。
  删了或改成普通链接，规则就**静默不再加载**：没有报错，只是之后每个会话都不知道规矩。
  `checks/agent-rules.js` 守着这条链
- **不改 `.agents/**`** —— 会被 `npx skills update` 全量冲掉。上游有问题就记 Issue
  或给上游提 PR
- **`.gitattributes` 的规则必须锚定到仓库根**。给 `.agents/**` 设 `-text` 会关掉
  `core.autocrlf` 的归一化，改动 vendor 文件时出现「整文件都变了」的假 diff
- **检查器一律以 git 索引为目标集**，不要改成 `find` / `readdir` 递归
- 工作流里 `${{ }}` 一律经 `env:` 中转，不直接写进 `run:`
- 任何新增检查器都要同时进 `lint.sh` 的 `CHECKS` 与 `ci.yml` 的同名 job ——
  `lint-selftest` 会断言两者集合相同

### 每次编辑中文内容后

```bash
python3 -c "
import pathlib
bad=[str(p) for p in pathlib.Path('.').rglob('*') if p.is_file() and '.git' not in p.parts
     and chr(0xfffd) in p.read_text(encoding='utf-8', errors='ignore')]
print(bad if bad else 'OK')
"
```

写入时混入 U+FFFD 替换字符在本仓库反复出现过，**这条不要省**。
