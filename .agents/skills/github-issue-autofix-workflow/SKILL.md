---
name: github-issue-autofix-workflow
description: 使用 superpowers 工作流修复 GitHub issue。支持自动化模式（用户输入"自动化处理"时全程无需确认）。强制使用 brainstorming 理解需求，test-driven-development 编写测试，verification-before-completion 验证，requesting-code-review 代码审查。适用于用户请求修复 issue、处理 bug、添加功能等场景。
---

# Superpowers GitHub Issue AutoFix Workflow

使用 superpowers 完整工作流修复 GitHub issue，包括需求理解、测试驱动开发、验证和代码审查。

> ⚠️ **重要要求：所有响应必须使用中文！必须使用中文！必须使用中文！**
>
> 无论我问什么，无论代码是什么语言，你的所有回复、解释、说明、注释都必须使用中文。这是强制要求，没有例外。

## 工作模式

### 普通模式
按步骤逐一执行，每个关键决策点需要用户确认。

### 自动化模式
当用户输入包含"自动化处理"时：
- 全程自动化执行，无需用户确认
- 默认使用 upstream（原始仓库）的 issue
- issue 类型不限（bug/enhancement/feature 等）
- 难度选择简单或中等
- 自动完成所有步骤直到代码修改完成

---

## 强制工作流程

**你必须按顺序执行以下步骤，不能跳过任何一步：**

### 步骤 1: 同步 upstream 最新代码

首先确保本地代码是最新的：

```bash
# 查看当前 remote 配置
git remote -v

# 同步 upstream 最新代码到当前分支
git fetch upstream
git rebase upstream/main
# 或者使用 superpowers:git-sync-upstream skill
```

### 步骤 2: 理解用户偏好模式

**关键问题必须确认（自动化模式使用默认值）：**

| 问题 | 普通模式 | 自动化模式默认值 |
|------|---------|-----------------|
| 使用哪个远程仓库的 issue？ | 咨询用户 | upstream（原始仓库） |
| issue 类型偏好？ | Bug/新功能/改进/都可以 | 都可以 |
| 难度偏好？ | 简单/中等/复杂 | 简单或中等 |

### 步骤 3: 查找合适的 Issue

#### 3.1 查询已处理的 issue（去重检查）

在查找新 issue 之前，必须检查哪些 issue 已经处理过：

```bash
# 查看本地分支
git branch -a | grep "myfix/issue-"

# 查看 origin 远程分支（已推送的处理记录）
git ls-remote --heads origin | grep "myfix/issue-"

```

**已处理 issue 的分支命名规则：**
- 分支名称：`myfix/issue-{issueId}-简短英文描述`
- 例如：`myfix/issue-48928-poll-params-zero-check`

如果某个 issue 已经有对应的分支，则跳过该 issue，不要重复修复。

#### 3.2 获取 open issues 列表

根据用户选择的远程仓库（默认 upstream）：

```bash
# 使用 GitHub CLI 获取 issue 列表
gh issue list --repo <owner>/<repo> --state open --limit 30

# 或使用 curl
curl -sL "https://api.github.com/repos/<owner>/<repo>/issues?state=open&per_page=30"
```

#### 3.3 详细审查候选 issue

对于每个候选 issue，**必须使用 gh 命令查看详情页**：

```bash
# 查看 issue 详情
gh issue view <issue-number> --repo <owner>/<repo>

# 查看 issue 评论和讨论
gh issue view <issue-number> --repo <owner>/<repo> --comments
```

**审查要点：**
1. 阅读完整 issue 描述
2. 查看维护人员的评论和反馈
3. **排除条件：**
   - 维护人员认为 issue 有歧义或问题
   - 维护人员标记为 "wontfix" 或 "invalid"
   - issue 已被分配给其他人
   - issue 需要更多信息但没有补充
   - issue 已有 PR 正在处理

**选择标准：**
- 优先选择描述清晰、范围适中的 issue
- 优先选择有维护人员确认的 issue
- 难度适中（简单或中等）

### 步骤 4: 创建 Worktree 和分支并确保已经在worktree中

找到合适的 issue 后，使用 `superpowers:using-git-worktrees` skill 创建隔离的工作环境：

```bash
# 调用 skill 创建 worktree
# worktree 名称: myfix-issue-{issueId}-简短英文描述
# 分支名称: myfix/issue-{issueId}-简短英文描述
```

确保当前工作在worktree中，如果不在worktree中，请切换到worktree中再进行下一步。

**命名示例：**
- Issue #295: 移除硬编码端口 18080
- Worktree: `myfix-issue-295-remove-hardcoded-port`
- Branch: `myfix/issue-295-remove-hardcoded-port`

### 步骤 5: 在worktree中创建 Task 文档并推送

在项目根目录中创建 task 文档：

```bash
# 创建 tasks 目录
mkdir -p tasks

# 创建 task 文件
# 文件名: tasks/myfix-issue-{issueId}-简短英文描述.md
```

**Task 文档模板：**

```markdown
# Fix Issue #{issueId}: {issue标题}

## Issue 概述

- **Issue 编号**: #{issueId}
- **Issue 类型**: bug/enhancement/feature
- **仓库**: owner/repo
- **状态**: In Progress

## 问题描述

{issue 的详细描述}

## 相关链接

- Issue URL: https://github.com/owner/repo/issues/{issueId}

## 实现计划

- [ ] 理解需求
- [ ] 编写测试
- [ ] 实现修复
- [ ] 验证通过
- [ ] 代码审查

## 进度记录

- {日期}: 开始处理
```

**立即推送到 origin：**

```bash
git add tasks/myfix-issue-{issueId}-*.md
git commit -m "docs: add task for issue #{issueId}"
git push -u origin myfix/issue-{issueId}-简短英文描述
```

这样其他人可以立即知道该 issue 正在被处理。

### 步骤 6: brainstorming - 深入理解 Issue

使用 `Skill` 工具调用 `superpowers:brainstorming` skill 来深入理解 issue 需求，调用该skills时，确保全程自动化执行，无需用户确认，完成后更新task中的计划内容，说明是否使用了skill，完成结果如何。

**必须探讨的内容：**
1. 查看 issue 详情页的完整描述
2. 查看相关用户的反馈和讨论
3. 理解 issue 的根本原因
4. 确定修复的范围和边界
5. 评估是否有其他依赖或影响

### 步骤 7: test-driven-development - 编写测试

**在编写任何实现代码之前，必须先编写测试！确保全程自动化执行，无需用户确认，完成后更新task中的计划内容，说明是否使用了skill，完成结果如何。**

1. 探索项目测试结构：
```bash
# 查找测试文件和目录
ls -la tests/ test/ __tests__/ spec/
find . -name "*test*" -o -name "*_test*" -o -name "*.spec.*" | head -20

# 查看项目使用的测试框架
cat package.json | grep -A5 "test"
cat pyproject.toml | grep -A5 "pytest"
```

2. 安装依赖并确保测试能运行：
```bash
# 根据项目类型安装依赖
# Python: pip install -e . pytest
# Node.js: npm install
# Rust: cargo build
# Go: go mod download
```

3. 为要修复的功能编写测试：
   - 在项目的 tests/ 目录下创建测试文件
   - 使用项目已有的测试框架和风格
   - 测试应覆盖要修复的功能点

4. **验证测试失败** - 运行测试确认测试可以执行（但应该失败）

**关键原则：测试必须在实现之前编写！**

### 步骤 8: subagent-driven-development - 实现修复

使用 `Skill` 工具调用 `superpowers:subagent-driven-development` skill 来实现修复，调用该skills时，确保全程自动化执行，无需用户确认，完成后更新task中的计划内容，说明是否使用了skill，完成结果如何。

或者根据项目情况，直接编写实现代码：
- 根据测试编写最小化实现代码
- 确保代码能够通过之前编写的测试
- 遵循项目的代码风格和规范

### 步骤 9: verification-before-completion - 验证

使用 `Skill` 工具调用 `superpowers:verification-before-completion` skill 进行验证，调用该skills时，确保全程自动化执行，无需用户确认，完成后更新task中的计划内容，说明是否使用了skill，完成结果如何。

**必须执行的验证：**
1. 运行测试 - 必须全部通过：
   ```bash
   pytest tests/ -v   # Python
   npm test            # Node.js
   cargo test          # Rust
   go test ./...       # Go
   ```
2. 如果有 linter，运行 linter 检查
3. 检查修改的文件内容

### 步骤 10: requesting-code-review - 代码审查

使用 `Skill` 工具调用 `superpowers:requesting-code-review` skill，调用该skills时，确保全程自动化执行，无需用户确认，完成后更新task中的计划内容，说明是否使用了skill，完成结果如何。

**重要：注意，当审查不通过时，必须重新修复该问题，然后再次请求进行代码审查，直到审查通过为止。**

### 步骤 11: 完成、更新task中的计划内容并展示结果

更新task中的计划内容，并展示结果：
- 修改了哪些文件
- 测试结果（必须有证据）
- 代码变更摘要

**重要：任务完成后，自动提交并且push代码到 origin，注意不要自动帮我提交PR到 upstream，需要用户线下确认之后再手动提交PR。**

---

## 流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    开始处理 Issue                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 1: 同步 upstream 最新代码                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 2: 理解用户偏好模式                                    │
│  自动化模式: 使用默认值，无需确认                             │
│  普通模式: 询问用户偏好                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 3: 查找合适的 Issue                                    │
│  3.1 查询已处理的 issue（去重检查）                           │
│  3.2 获取 open issues 列表                                   │
│  3.3 使用 gh issue view 详细审查候选 issue                   │
│      - 排除有歧义或问题的 issue                               │
│      - 排除已有 PR 处理的 issue                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 4: 创建 Worktree 和分支                                │
│  Worktree: myfix-issue-{issueId}-简短英文描述                  │
│  Branch: myfix/issue-{issueId}-简短英文描述                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 5: 创建 Task 文档并推送                                 │
│  文件: tasks/myfix-issue-{issueId}-简短英文描述.md             │
│  立即 push 到 origin                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 6: brainstorming - 深入理解 Issue                      │
│  查看 issue 详情、用户反馈、讨论                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  步骤 7-12: 开发、测试、验证、审查                            │
│  使用对应的 superpowers skills                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  完成并展示结果，并更新task中的计划内容                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 关键原则

1. **不能跳过 brainstorming** - 必须理解用户需求和 issue 详情
2. **必须去重检查** - 避免重复处理已有人处理的 issue
3. **必须审查 issue 详情** - 使用 gh issue view 查看完整讨论
4. **测试必须先于实现** - TDD 原则
5. **验证必须有证据** - 展示测试输出
6. **自动提交代码** - 自动提交并且push代码到 origin
7. **使用其他 superpowers skills** - 根据需要调用相关技能
8. **自动化模式全程无确认** - 除非遇到错误或阻塞