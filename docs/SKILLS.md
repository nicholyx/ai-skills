# 技能目录

> 🤖 **本文件由 [`scripts/gen-catalogue.js`](../scripts/gen-catalogue.js) 生成，不要手改。**
> 它从每个技能的 `SKILL.md` 里读 `metadata`，改技能后重跑生成器即可 ——CI 会断言这里与源头一致。

共 **15** 个自建技能，分布在 6 个场景。其中 **5** 个附带可验证的评测用例（`evals/evals.json`）。

## 先试再装

**不确定要不要装？任何一个技能都可以不安装先试。** 把技能名换成下表里的名字：

```bash
npx skills use nicholyx/ai-skills@<技能名>
```

它会生成一段可直接粘贴给 AI 的提示词 —— 不写文件、不动配置，试完不满意没有任何残留。

觉得好用再装：

```bash
npx skills add nicholyx/ai-skills          # 全部 15 个
npx skills add nicholyx/ai-skills/custom/daily   # 只装通用技能
```

## 一览

| 场景 | 技能 |
| --- | --- |
| **代码质量** | `bug-analyzer-agent` · `code-reviewer-agent` |
| **Git 与协作** | `git-commit` · `git-smart-update` · `git-sync-upstream` · `github-issue-autofix-workflow` |
| **仓库与开源** | `maintain-loop` · `oss-bootstrap` · `repo-analyzer` |
| **知识与记录** | `daily-report` · `obsidian-note-workflow` |
| **环境与工具** | `skills-sync` · `update-claude-code` · `update-opencode` |
| **项目专用** | `prj-agent-platform-e2e-test` |

---

## 代码质量（2）

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| [`bug-analyzer-agent`](../custom/daily/bug-analyzer-agent/SKILL.md) | 独立上下文深挖 Bug 根因，给出执行流级别的分析 | 「这个接口偶尔返回 500，帮我查根因」 |
| [`code-reviewer-agent`](../custom/daily/code-reviewer-agent/SKILL.md) ✅ | 独立上下文的深度代码审查，覆盖安全、性能与生产可靠性 | 「审查一下我暂存区的改动」 |

## Git 与协作（4）

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| [`git-commit`](../custom/daily/git-commit/SKILL.md) ✅ | 按约定式提交规范生成提交信息并提交 | 「帮我提交」 |
| [`git-smart-update`](../custom/daily/git-smart-update/SKILL.md) ✅ | 带 stash 循环的智能拉取，自动处理本地改动与冲突 | 「更新代码」 |
| [`git-sync-upstream`](../custom/daily/git-sync-upstream/SKILL.md) | fork 仓库用 rebase 同步上游，保持提交历史线性 | 「同步 upstream」 |
| [`github-issue-autofix-workflow`](../custom/daily/github-issue-autofix-workflow/SKILL.md) ✅ | 从 GitHub Issue 出发，走 brainstorm → TDD → 代码审查的完整修复流程 | 「帮我修一下 issue 42」 |

## 仓库与开源（3）

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| [`maintain-loop`](../custom/daily/maintain-loop/SKILL.md) | 开源项目的维护闭环：规划 → 实现 → 发布 → 继续规划 | 「继续走维护流程」 |
| [`oss-bootstrap`](../custom/daily/oss-bootstrap/SKILL.md) | 把裸仓库搭成合规开源项目：CI、治理、模板、自动化、文档 | 「给这个项目加上开源规范」 |
| [`repo-analyzer`](../custom/daily/repo-analyzer/SKILL.md) ✅ | 并行 subagent 深读陌生仓库，产出架构与业务流分析报告 | 「深入研究一下这个项目」 |

## 知识与记录（2）

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| [`daily-report`](../custom/daily/daily-report/SKILL.md) | 从 git 提交记录生成工作日报，按项目自动归类 | 「生成今天的日报」 |
| [`obsidian-note-workflow`](../custom/daily/obsidian-note-workflow/SKILL.md) | 预览优先的 Obsidian 笔记创建、分类与整库初始化 | 「把这段内容记到我的 Obsidian 里」 |

## 环境与工具（3）

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| [`skills-sync`](../custom/daily/skills-sync/SKILL.md) | 用软链接把技能与命令同步到 Claude / CodeBuddy | 「把我的技能同步到 Claude」 |
| [`update-claude-code`](../custom/daily/update-claude-code/SKILL.md) | 检查并升级 Claude Code 到最新版本 | 「更新 claude」 |
| [`update-opencode`](../custom/daily/update-opencode/SKILL.md) | 检查并升级 OpenCode 与 oh-my-opencode 插件 | 「更新 opencode」 |

## 项目专用（1）

> ⚠️ 这一类**假设你手上就是那个项目**，装在别处只会变成噪音。

| 技能 | 它能做什么 | 你可以这样说 |
| --- | --- | --- |
| [`prj-agent-platform-e2e-test`](../custom/projects/prj-agent-platform-e2e-test/SKILL.md) | 用 agent-browser 对 Agent 平台核心功能做端到端验证 | 「跑一遍 Agent 平台的端到端测试」 |

---

## 关于这张表

- **技能名后的 ✅** 表示它附带可验证的评测用例（`evals/evals.json`）。
  没有 ✅ 不代表不能用，只表示「它能干活」这件事还没有机器可验证的证据。
- **「你可以这样说」是从 `metadata.example` 读的**，不是自动摘的 —— 触发词在 `description` 里，这里是给人看的示例。
- 每个技能的完整触发条件与执行流程，在它自己的 `SKILL.md` 里（点技能名即可）。

> `.agents/skills/` 下那 31 个上游技能**不在这张表里** —— 它们不随本仓库分发，要用请从各自的源仓库装（来源记在 `skills-lock.json`）。

