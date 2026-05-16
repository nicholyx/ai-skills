---
name: git-sync-upstream
description: Fork 仓库同步 upstream 最新代码到当前分支，使用 rebase 方式保持提交历史整洁。当用户说"同步upstream"、"rebase upstream"、"更新upstream main"、"拉取upstream更新"、"同步上游仓库"、"fork仓库更新"、"更新PR分支"时触发。自动处理未提交更改（stash/rebase/pop）、fetch upstream、rebase 到最新、强制推送更新 PR。专门用于 fork 仓库同步上游更新的场景，不适用于普通的 git pull 操作。
---

# Git Sync Upstream

将当前分支 rebase 到 upstream/main 的最新代码，适用于 fork 仓库同步上游更新的场景。

## 前置检查

执行任何操作前，先检查：

```bash
# 1. 确认 remote 配置
git remote -v

# 2. 确认当前分支
git branch --show-current

# 3. 检查是否有 upstream remote
git remote | grep -q upstream || echo "需要先添加 upstream remote"
```

如果用户没有配置 upstream remote，询问用户上游仓库地址。

## 工作流程

### Step 1: 获取上游最新代码

```bash
git fetch upstream
```

### Step 2: 查看更新情况

```bash
# 你的提交
git log upstream/main..HEAD --oneline

# 上游更新
git log HEAD..upstream/main --oneline
```

**快速退出判断**：
- 如果上游没有新提交（`HEAD..upstream/main` 为空），直接告知用户：

> ✅ 当前分支已是最新，无需同步。上游没有新的更新。

然后询问用户是否需要处理当前工作区的更改（如果有），直接结束流程。

- 如果上游有更新，继续执行后续步骤。

### Step 3: 处理未提交的更改

检查是否有未提交的更改：

```bash
git status
```

**如果有未提交的更改**，询问用户选择：
1. **Stash 后 rebase**（推荐）- 暂存更改，rebase 完成后恢复
2. **先提交再 rebase** - 提交这些更改后 rebase
3. **放弃更改** - 丢弃这些更改

### Step 4: 执行 Rebase

```bash
# 如果用户选择 stash
git stash push -m "temporary stash before rebase"

# 执行 rebase
git rebase upstream/main
```

如果 rebase 过程中发生冲突：
- 列出冲突文件
- 指导用户解决冲突
- 解决后执行 `git rebase --continue`

### Step 5: 恢复暂存的更改

如果之前 stash 了更改：

```bash
git stash pop
```

### Step 6: 推送更新

Rebase 成功后，需要强制推送（因为改写了历史）：

```bash
# 先展示 rebase 后的 commit 历史
git log --oneline -5

# 询问用户确认后强制推送
git push origin <branch-name> --force
```

**重要**：强制推送是改写历史的操作，必须先向用户确认。

## 完成提示

操作完成后告知用户：
- ✅ Rebase 成功
- ✅ PR 已自动更新（GitHub PR 会自动反映推送的新 commits）
- 如果有 stash 的文件，说明当前状态（已暂存/未暂存）

## 常见问题

### 没有配置 upstream remote

```bash
git remote add upstream <upstream-repo-url>
```

### Rebase 冲突

1. 查看冲突文件：`git status`
2. 手动解决冲突
3. 标记为已解决：`git add <files>`
4. 继续 rebase：`git rebase --continue`
5. 如果想放弃：`git rebase --abort`

### 推送被拒绝

如果 force push 失败，可能是远程有新提交。先 pull 再 rebase：

```bash
git pull origin <branch> --rebase
git push origin <branch> --force
```