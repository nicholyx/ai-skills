# 修复安装面回归并提升可发现性（v1.1.0）

## Goal

让第一次接触这个仓库的人**拿到正确的东西**，并让这个正确性被 CI 永久守住。

## 背景

`npx skills add nicholyx/ai-skills` 是这个仓库的主采用路径 —— README 的第一条命令，
也是所有人接触它的第一步。**它目前装错东西。**

实测（用 `--list` 不安装，只列发现结果）：

| 版本 | 发现到的技能 | 正确性 |
| --- | --- | --- |
| 接入 Trellis 之前（`f1f3835`） | 13 个自建技能 | ✅ |
| 当前 main | 9 个 `trellis-*` | ❌ |

`trellis-*` 是 **Trellis 自己的 meta-skill**（用来定制 Trellis 的），
属于「维护这个仓库的工具」，不是「这个仓库分发的产品」。用户拿到它们毫无用处。

### 根因

接入 Trellis 时它在仓库根生成了 `.claude/skills/trellis-*`（9 个 `SKILL.md`）。
`skills` CLI 发现技能时**优先读 `.claude/skills/`**，于是它把本该被发现的
`custom/` 顶掉了。

A/B 对照证实：把 `.claude/` 临时移走，同一条命令发现的就是正确的 15 个
（14 个 `custom/daily` + 1 个 `custom/projects`）。

### 为什么 CI 没拦住

这类缺陷**不在任何 diff 里**，也不会让任何一项检查变红 —— 它是「仓库在别人眼里
长什么样」的问题，而现有 12 个 job 查的全是「仓库内部是否自洽」。
所以修复之外必须补一条断言，否则下次加任何带 `.claude/` 的东西都会再犯。

### 另一处既有错误（不是本次引入）

README 写着「默认命令装 `.agents/skills` 里的」—— **实测从来不是**：
接入 Trellis 之前，默认命令装的也是 `custom/`。`.agents/skills/` 那 31 个上游技能
从不参与发现。这句是改写 README 时原样沿用的既有错误。

## Requirements

1. **修复默认安装路径**：`.claude/` 移出分发面（新增 gitignore），
   `.trellis/` 继续提交（已确认它含 0 个 `SKILL.md`，不会污染发现结果）。
2. **加一条防复发断言**：「从仓库根跑 `skills --list` 发现的技能集合 == 期望集合」
   进 CI。期望集合从 `custom/` 的真实结构推导，不写死名单。
3. **修正 README 对 `.agents/skills` 的描述**：说清楚那 31 个上游技能怎么分发、
   以及为什么它们不在安装面。
4. **英文入口**：`docs/` 目前全是中文。至少把「安装 + 用起来 + 自己写一个技能」
   这条路英文化，让非中文用户能自己跑通。
5. **技能质量信号**：15 个技能里只有 3 个有 `evals.json`，其中 2 个还缺 `assertions`。

## Acceptance Criteria

- [ ] `npx skills add nicholyx/ai-skills` 发现且仅发现 `custom/` 下的 15 个技能
- [ ] `--full-depth` 不再混入 `trellis-*`
- [ ] `.claude/` 已 gitignore；`.trellis/` 仍被追踪
- [ ] CI 新增的断言在「故意把 `.claude/skills/` 加回去」时**会红**（变异验证，不是恒真断言）
- [ ] README 不再声称默认命令装 `.agents/skills` 里的内容
- [ ] 英文入口覆盖「装 + 用 + 写新技能」三条路径
- [ ] `./scripts/lint.sh` 全绿，U+FFFD 全仓扫描干净

## Notes

- **先修回归，再谈采用**。装错东西的前提下，任何可发现性工作都是在把人引到坑里。
- 这条断言的写法要特别小心：**别写成恒真**。判据是「期望集合与发现集合相等」，
  而不是「发现不为空」—— 后者在发现 9 个 trellis 技能时同样成立。
- `--full-depth` 的语义待确认：修好之后它应该发现什么？需要在实现时实测定义，
  而不是照抄文档。
