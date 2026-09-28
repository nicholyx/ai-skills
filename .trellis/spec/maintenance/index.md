# 仓库维护规范

## 提交信息

遵循 Conventional Commits，校验脚本 `scripts/check-commit-msg.sh`（CI 会查）：

```
<类型>(<范围>): <描述>
```

允许的类型（与 `CONTRIBUTING.md` 的类型表保持一致）：

`feat` `fix` `docs` `ci` `chore` `refactor` `perf` `test` `style` `revert` `build`

- 冒号后必须有**一个空格**
- 建议范围：`custom`、`projects`、`ci`、`scripts`、`docs`
- **正文写「为什么」，不只是「改了什么」**
- 生成合并提交、交互式 rebase 的中间产物会自动跳过校验

CI 校验**提交区间 + PR 标题**（squash 合并后标题会成为提交信息，所以标题也要合规）。
本地 `lint.sh` 验不了标题 —— 它在你建 PR 之前根本不存在。

## 分支与 PR

- `main` 是唯一长期分支，始终可发布；**不接受直接推送到 main**
- 分支名建议 `feat/*`、`fix/*`、`docs/*`、`ci/*`、`chore/*`
- **一个 PR 只做一件事**；正文写清为什么、关键取舍（含被否掉的方案）、测试策略
- 超过 400 行 diff 建议拆分
- 合并用 `gh pr merge <N> --squash --delete-branch`
- **PR 正文写进临时文件再用 `--body-file`**，不要用嵌套 heredoc —— 那会让正文
  静默丢失，`Closes #N` 一起消失，症状是「PR 合并了、issue 还开着」

## CHANGELOG

`CHANGELOG.md` 用 Keep a Changelog 格式，分类固定为
**新增 / 变更 / 弃用 / 移除 / 修复 / 安全**，不自创分类。

每个用户可感知的改动都要记入 `[Unreleased]`。修复类条目要写清「此前错在哪、
有什么后果」。

**往 `[Unreleased]` 插条目时锚点必须校验在正确段落里**：`lines.index('### 新增')`
找的是全文件第一个 —— 版本刚发布后 `[Unreleased]` 是空壳，第一个「### 新增」在
**上一个已发布版本**的段下，新条目会错插进已发布段。插入前断言「锚点行号 >
`[Unreleased]` 行号 且 < 下一个 `## [` 行号」。

## 发布

1. 从最新 main 切 `chore/release-vX.Y.Z`
2. 把 `[Unreleased]` 归入 `[X.Y.Z] - 日期`，段首加一句话概述本轮主题；`[Unreleased]` 恢复为空壳
3. 提交信息 `chore(release): 发布 vX.Y.Z`，建 PR 并走完整 CI
4. squash 合并后打标签并推送：`git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z`
5. `release.yml` 自动生成三段式发布说明

**推送 tag 前先用 `git ls-remote --tags origin vX.Y.Z` 确认不存在**：网络抖动时
`git push` 可能「显示失败、远端已成功」，重试会重复推送 tag、触发两次发布工作流。

## 验证会写文件的命令时，先隔离环境

**任何会写文件、改配置、装东西的命令，验证时都必须在隔离环境里跑，不得拿真实开发机做实验。**

### 真实教训

2026-09-28，为了确认 `npx skills add <目录> -g` 的落点，直接在本机跑了它。
落点确实搞清楚了（`~/.agents/skills/` + `~/.claude/skills/`，用户级），代价是：

- **`~/.claude/skills/` 被新增了 9 个符号链接** —— 那是 Claude Code 实际加载技能的地方，
  等于**改变了本机生效的技能集合**
- `~/.agents/skills/` 下 6 个已有技能的内容被刷新成仓库当前版本

当时的心理活动是「我只是想确认它装到哪」—— **但「确认装到哪」本身就是一次安装**。
把一次写操作误判成一次观察，是这类事故的共同起点。

### 怎么做

```bash
# 隔离 HOME：绝大多数 CLI 都把用户级目录挂在 $HOME 下
HOME=$(mktemp -d) npx skills add <目录> -g

# 需要更彻底时用容器
docker run --rm -v "$PWD":/work:ro -w /work <image> <命令>
```

跑完检查那个临时 HOME，而不是本机。

### 判据

动手前问一句：**这条命令会往磁盘上写东西吗？**

- 会 → 隔离环境
- 不确定 → 按「会」处理
- 只读（`--list`、`--dry-run`、`grep`、`cat`）→ 可以直接跑

> 注意「看起来只读」的陷阱：`npx skills add --list` 在**仓库根**跑是只读的，
> 但它可能因为 `npx` 的解析行为而改变别的东西。拿不准就隔离。

## 判断成败禁止管道接 tail/head

```bash
# ✗ 判断的是 tail 的退出码，合并没有发生也报成功
if gh pr merge N --squash | tail -1; then

# ✓ 输出打印放在判断之后
if out="$(gh pr merge N --squash 2>&1)"; then echo "$out"; fi
```

merge / push 之后必须**复核远端真实状态**：`gh pr view N --json state`、
`git ls-remote --tags origin vX.Y.Z`。

## GitHub 侧配置（不在代码里）

换机器或重建仓库时需要重新配置，完整清单见 `docs/MAINTAINER_GUIDE.md`。
需要 `gh` 的 `repo` 与 `project` scope。

## 红线

- **不改 `.agents/**`** —— 会被 `npx skills update` 全量冲掉
- **`.gitattributes` 的规则必须锚定到仓库根**。给 `.agents/**` 设 `-text` 会关掉
  `core.autocrlf` 的归一化，改动 vendor 文件时出现「整文件都变了」的假 diff
- 工作流里 `${{ }}` 一律经 `env:` 中转，不直接写进 `run:`（表达式注入）
- 不在日志里输出 Secret
- `custom/**` 的内容会全局生效，其中的指令必须可审计

## 排错备忘

- **「CI 总览」卡 in_progress 而 run 汇总显示 success**：GitHub 状态机不一致，
  `gh pr close <N> && gh pr reopen <N>` 重新触发即可
- **分支保护提示 not up to date**：`git fetch --prune && git rebase main && git push --force-with-lease`
- **`gh run view --log` 的输出混着源码行**：过滤 ANSI 回显（`\x1b[36;1m`）再看
- **`gh` 只认 `origin`**：分支推在别的 remote 上时 `gh pr create` 报
  `you must first push the current branch to a remote`，加 `--head <owner>:<branch>` 即可
