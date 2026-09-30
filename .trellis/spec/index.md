# Spec 导航

本目录是 ai-skills 的编码与维护规范，供 AI 会话在动手前注入。
所有规则都来自真实代码与真实踩坑，每条都给出处。

## 这个项目是什么

一句话：**一个 Claude Code Skills 仓库 —— 自建技能在这里维护，上游技能在这里分发。**

- `custom/`（16 个自建技能）是**自建内容**，我们维护
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
| **写测试 / 加检查 / 判断「验够了没有」** | [testing/index.md](testing/index.md) —— **必读**，四层测试与验收标准 |

## 角色分工：主会话是**调度者与验收者**，不是实现者

**每一个任务的开发都走这条：主会话负责拆分、派发、验收、合并；具体实现交给子 agent。**

| 谁 | 干什么 | 不干什么 |
| --- | --- | --- |
| **主会话** | 侦察现状、拆分任务、写清交付物与验收标准、**独立复核子 agent 的产出**、合并、发布 | **不自己写实现代码** |
| **子 agent** | 在明确的边界内实现一个闭环，并自己跑通验证 | 不改规格、不发版、不碰 `main` |

### 为什么

- **上下文**：主会话的上下文要留给判断与验收，不该被实现细节淹没
- **并行**：互不依赖的活儿可以同时派出去
- **独立复核**：写代码的人自己说「验过了」不算数，**验收必须是另一双眼睛**

### 派发时必须写清的四件事

1. **要做出的东西**（文件路径、行为）
2. **边界**（哪些文件能改、哪些绝对不能碰 —— 例如 `.agents/**`、`package.json`）
3. **验收标准**（跑什么命令、期望什么结果）
4. **要求它自己先证明能失败**（见 [testing/index.md](testing/index.md)）

### 验收时不许偷懒的三件事

- **复跑它的验证**，不要只读它的报告。本会话真实发生过：子 agent 报告「测试通过」，
  而同一时刻它的变异验证正在改坏源码，我复跑时看到 3 条失败 —— 那是它的中间状态。
  分不清就等它收工再跑。
- **检查它有没有偷偷放宽断言**。让它「证明能失败」，它可能改成「改成能过」。
- **看它留下的临时文件**（沙箱、`/tmp` 里的产物），该清的清掉。

## 为什么这里没有 `guides/`

Trellis 初始化时会生成 `.trellis/spec/guides/`（Thinking Guides / Code Reuse /
Cross-Layer，共 647 行**英文通用软件工程建议**）。**本仓库把它删掉了。**

理由：它讲的是「写代码前先搜一搜有没有现成的」「注意层边界」这类**与具体项目无关**的话，
而我们有更具体、有证据支撑的对应版本 —— [checks/index.md](checks/index.md) 的
「枚举只能有一处实现」、[testing/index.md](testing/index.md) 的跨平台差异与隔离环境，
每一条都对应本仓库真实踩过的坑。**留着泛泛的通用建议，只会稀释真正要遵守的规范。**

> **`trellis update` 会做两件事**：把 `.trellis/workflow.md` 里指向 `guides/index.md`
> 的那一行**写回来**（该文件是 Trellis 受管的，手改无效、每次 update 都被覆盖），
> 以及可能重新生成 `guides/` 目录。两件事都**不用管** —— 只要 `guides/` 目录不存在
> 就行，workflow.md 里那行引用是 Trellis 自己的文档，悬着不影响任何人。
>
> **`trellis update` / `trellis init` 都动的文件不要手改**：`.trellis/workflow.md`、
> `.trellis/scripts/**`、`.claude/**`。手改会在下次 update 时静默丢失。

## Pre-Development Checklist（任何任务动手前）

1. 读上表对应的 spec 入口
2. `./scripts/lint.sh` 先跑一遍，确认基线是绿的
3. 确认要改的文件属于 `custom/` 还是 `.agents/` —— **`.agents/` 一律不改**

## Quality Check（任何任务收尾前）

- [ ] `./scripts/lint.sh` 全绿（17 项）—— 它已包含单元测试与端到端验证
- [ ] 全仓无 U+FFFD 乱码（扫描命令见 [checks/index.md](checks/index.md)）
- [ ] 改了行为 → `docs/` 与 `README.md` 同步更新
- [ ] 用户可感知的改动 → 记入 `CHANGELOG.md` 的 `[Unreleased]`
- [ ] 新增/修改技能 → 确认 `name` 与目录名一致、`description` 无尖括号
- [ ] CI 全绿才合并；提交与分支规范见 [maintenance/index.md](maintenance/index.md)
- [ ] **新加的断言/检查/测试，先证明它能失败**（变异测试）—— 见 [testing/index.md](testing/index.md)
