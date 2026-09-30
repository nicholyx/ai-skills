# 验收收口：修四处静默失效，并同步文档与数字

## Goal

把 v2.2.0 发布后从子 agent 回流的一批发现收口。四路互不依赖，**并行派发、主会话验收合并** ——
主会话不写实现代码（见 `.trellis/spec/index.md` 的角色分工）。

## 背景

这批发现全部出自「子 agent 报告 → 主会话复核」这条链路。复核**当场推翻了两类东西**：

- 一条**结论**（我给文档 agent 的简报把 47/16 说反了，见下）
- 两个**错数字**（`484 字 → 88 字`，见 `maintenance/index.md` 的「报数字要说清口径」）

**凡未经复核的结论一律不进仓库。** 这是本任务存在的理由。

## 交付物（四路）

| # | 内容 | 交付物 | 状态 |
| --- | --- | --- | --- |
| 1 | README 覆盖缺口 | `checks/catalogue.js` 第三条断言（每个自建技能都进 README）| ✅ [#59](https://github.com/nicholyx/ai-skills/pull/59) |
| 2 | 评测跑手两处缺陷 | `lib/sandbox.js` 挡掉 `.claude.json`；`run-evals.js` 记录基线逐条结果 | 进行中 |
| 3 | 共用层三处隐患 | `lib/frontmatter.js` 带 `.` 的键整行漏网；`lib/report.js` 的 `warn()` 把 tier 写死成 self；`EXIT_*` 无使用者 | 进行中 |
| 4 | 英文文档滞后 | `README.en.md` / `docs/USAGE.en.md` 同步新章节；`docs/USAGE.md` 补「默认装到项目级」 | 进行中 |

第 2、3 两路的两条已由维护者**亲手复现**（不是采信报告）：`.claude.json` 在一次真跑里
把模型带偏到「要不要提交它」；`evil.dotted: 1` 被解析器整个丢掉、白名单看不见。

## 规范沉淀（主会话亲做，这是维护者的活）

- [testing/index.md](../../spec/testing/index.md) —— **合规型用例的消融不止验不了它，还会反过来骗人**
- [checks/index.md](../../spec/checks/index.md) —— `.claude-plugin/marketplace.json` 是承重件
- [maintenance/index.md](../../spec/maintenance/index.md) —— 报数字要说清口径（字符 vs 字节）

## 一个被实测推翻的结论（留档，别重复踩）

本会话一度据「`npx skills add .` 在没有 marketplace.json 时发现 47 个」推断
**「使用者会被装进 31 个上游技能」**，并据此给文档 agent 写了简报。

逐项二分之后推翻：

| 移走什么 | 结果 |
| --- | --- |
| `.claude/` | 仍 47 |
| `.agents/` | 仍 47 |
| **`.trellis/`** | **16** ← 真凶 |
| 换到 `git clone` 出来的副本 | 16 |

那 31 个来自 `.trellis/.backup-2026-09-30T17-53-28/`（Trellis 留下的**全仓快照**，
未被追踪，里面含一份 `.agents/skills/`）。用户克隆下来**两种情况下都是 16**。
差一点就印到 README 上 —— 属于 `maintenance/index.md` 里「没实测就写承诺」那一类。

## Acceptance Criteria

- [ ] `./scripts/lint.sh` 全绿
- [ ] `node scripts/e2e.js --offline` 全绿
- [ ] 每条新增断言/修复都有**变异验证**（先证明它能失败）
- [ ] 全仓无 U+FFFD 替换字符
- [ ] 用户可感知的改动记入 `CHANGELOG.md` 的 `[Unreleased]`

## 边界

- `.agents/**` 一律不改
- 不新增 `package.json`、不引入依赖
- 子 agent 在自己的 git worktree 里干活；不改规格、不发版、不碰 `main`
