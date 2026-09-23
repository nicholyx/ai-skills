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

一个 Claude Code Skills 仓库：自建技能在这里维护，上游技能在这里分发。

| 位置 | 是什么 | 能不能改 |
| --- | --- | --- |
| `custom/daily/`、`custom/projects/` | **自建技能**，13 个 | ✅ 这是主要工作区 |
| `.agents/skills/` | `npx skills add` 装来的**上游技能**，31 个，占仓库 97% 体积 | ❌ **一律不改**，改了会在 `npx skills update` 时丢失 |
| `.claude/` | Trellis 生成的集成层 | ❌ 由 `trellis update` 管理 |

`custom/**` 的内容会被 `custom/daily/skills-sync/` 软链进 `~/.claude/skills`，
**在使用者的全局 AI 环境里生效**。写技能内容时按这个前提对待。

### 文档语言

中文为主。`README.en.md` 是英文入口而非全文。

### 动手前必读

- 改技能（`custom/**`）→ `.trellis/spec/skills/index.md` —— frontmatter 契约与内容红线
- 改检查器或 `scripts/` → `.trellis/spec/checks/index.md` —— 退出码语义与分级原则
- 改工作流、发版、PR → `.trellis/spec/maintenance/index.md`
- 总导航见 `.trellis/spec/index.md`

### 本地检查入口

```bash
./scripts/lint.sh          # 10 项静态检查，目标是「本地绿 == CI 绿」
./scripts/lint.sh --list   # 看有哪些检查项
```

**它不覆盖 PR 标题** —— CI 的 `commit-messages` job 会校验 PR 标题，而标题在 PR 建立
之前不存在。**本地全绿不等于 commit-messages 会绿**，标题仍需自己按 Conventional
Commits 写。

### RED LINES

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
