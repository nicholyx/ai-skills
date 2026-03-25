# superpowers-github-issue-fix

使用 superpowers 工作流修复 GitHub issue。

## 触发条件

当用户说：
- "帮我到 github 上找一个未处理的 issue"
- "修复一个 GitHub issue"
- "帮我在 xxx/yyy 仓库找一个 bug 来修复"
- "去 github 找一个 issue，修复它"
- "帮我 fork 仓库并修复 issue"
- "自动化处理 issue"（自动化模式）
- 任何关于 GitHub issue 修复的请求

## 工作模式

### 普通模式
按步骤逐一执行，每个关键决策点需要用户确认。

### 自动化模式
当用户输入包含"自动化处理"时，全程自动化执行，无需用户确认。

## 核心流程

```
同步 upstream → brainstorming → 查找 issue（去重）→ 审查 issue 详情
    ↓
创建 worktree + 分支 → 创建 task 文档 → push 到 origin
    ↓
深入理解 issue → TDD 开发 → 验证 → 代码审查 → 展示结果
```

## 关键特性

1. **自动化模式** - 用户输入"自动化处理"时全程无需确认
2. **Issue 去重** - 检查已有分支和 task 文件，避免重复处理
3. **详细审查** - 使用 `gh issue view` 查看完整讨论，排除有问题的 issue
4. **Worktree 隔离** - 使用 superpowers:using-git-worktrees 创建隔离环境
5. **Task 文档** - 创建标准化文档记录处理进度
6. **立即推送** - 创建分支后立即推送，通知其他人

## 命名规范

| 项目 | 格式 | 示例 |
|------|------|------|
| Worktree | `fix-issue-{issueId}-简短描述` | `fix-issue-295-remove-hardcoded-port` |
| Branch | `fix/issue-{issueId}-简短描述` | `fix/issue-295-remove-hardcoded-port` |
| Task 文件 | `tasks/fix-issue-{issueId}-简短描述.md` | `tasks/fix-issue-295-remove-hardcoded-port.md` |

## 依赖工具

- Git / gh CLI - GitHub 操作
- curl - API 请求
- 虚拟环境 - 依赖安装
- superpowers skills - 工作流支持

## 强制工作流

1. 同步 upstream 最新代码
2. brainstorming - 理解需求
3. 查找合适的 issue（去重 + 详细审查）
4. 创建 worktree 和分支
5. 创建 task 文档并推送
6. brainstorming - 深入理解 issue
7. TDD 开发（测试先行）
8. verification-before-completion 验证
9. requesting-code-review（可选）
10. 展示结果，不提交