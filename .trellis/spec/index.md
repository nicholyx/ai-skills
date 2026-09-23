# Spec 导航

本目录是 ai-skills 的编码与维护规范，供 AI 会话在动手前注入。
所有规则都来自真实代码与真实踩坑，每条都给出处。

## 这个项目是什么

一句话：**一个 Claude Code Skills 仓库 —— 自建技能在这里维护，上游技能在这里分发。**

- `custom/`（13 个技能）是**自建内容**，我们维护
- `.agents/`（31 个技能，占仓库 97% 体积）是 `npx skills add` 装来的**上游 vendored 内容**，只读
- `custom/daily/skills-sync/` 用软链接把技能同步到 `~/.claude/skills` 与 `~/.codebuddy/skills`，
  **在使用者的全局 AI 环境里生效** —— 这是本仓库最重要的一条性质，也是多数红线的由来
- 没有构建产物、没有运行时依赖、没有 `package.json`。全部检查由 `scripts/` 下的零依赖 Node 脚本承担
- 文档以**中文**为主，`README.en.md` 是英文入口而非全文

## 按任务类型选择要读的 spec

| 你要动什么 | 先读 |
| --- | --- |
| 新增 / 修改技能（`custom/**`） | [skills/index.md](skills/index.md) —— **必读**，frontmatter 契约与内容红线 |
| `scripts/`（检查器、lint.sh） | [checks/index.md](checks/index.md) —— 退出码语义与分级原则 |
| `.github/workflows/**` | [checks/index.md](checks/index.md) + [maintenance/index.md](maintenance/index.md) |
| 发版 / PR / CHANGELOG / Issue | [maintenance/index.md](maintenance/index.md) |
| 设计新功能（判断「该不该做」） | [guides/index.md](guides/index.md) |

## Pre-Development Checklist（任何任务动手前）

1. 读上表对应的 spec 入口
2. `./scripts/lint.sh` 先跑一遍，确认基线是绿的
3. 确认要改的文件属于 `custom/` 还是 `.agents/` —— **`.agents/` 一律不改**

## Quality Check（任何任务收尾前）

- [ ] `./scripts/lint.sh` 全绿（10 项）
- [ ] 全仓无 U+FFFD 乱码（扫描命令见 [checks/index.md](checks/index.md)）
- [ ] 改了行为 → `docs/` 与 `README.md` 同步更新
- [ ] 用户可感知的改动 → 记入 `CHANGELOG.md` 的 `[Unreleased]`
- [ ] 新增/修改技能 → 确认 `name` 与目录名一致、`description` 无尖括号
- [ ] CI 全绿才合并；提交与分支规范见 [maintenance/index.md](maintenance/index.md)
