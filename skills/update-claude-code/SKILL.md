---
name: update-claude-code
description: 当用户提到"更新 claude"、"升级 claude code"、"检查 claude 版本"、"claude code 最新版本"时使用此技能。
---

# 更新 Claude Code CLI

## 概述

保持 Claude Code CLI 为最新版本可以获得新功能、bug 修复和性能改进。Claude Code 内置了自更新命令，无需关心包管理器。

**核心原则**：
- 使用 `claude update` 一键更新
- 更新后验证版本号

## 何时使用

- 用户看到版本更新提示或想检查是否有新版本
- 遇到功能问题，怀疑是旧版本导致
- 需要使用最新功能（如新的 Agent 或工具）

### 不使用场景

- 首次安装 Claude Code → 使用官方安装指南
- 配置问题（与版本无关）→ 检查配置文件

## 更新流程

### 步骤 1：检查当前版本

```bash
claude --version
```

记录当前版本号，用于后续对比。

### 步骤 2：执行更新

```bash
claude update
```

这是唯一的更新命令，Claude Code 会自动检测安装方式并完成更新，无需手动选择包管理器。

### 步骤 3：验证更新

```bash
claude --version
```

确认版本号已更新。

### 步骤 4：输出更新日志（如有更新）

如果版本号发生变化，**必须**输出从旧版本到新版本的更新日志。

**前置条件**：新旧版本号相同时跳过此步骤。

**Changelog 来源**：`https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md`

**获取方式**：
```bash
# 方法 1: 使用 gh api（推荐）
gh api repos/anthropics/claude-code/contents/CHANGELOG.md --jq '.content' | base64 -d

# 方法 2: 使用 curl
curl -s https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md
```

**输出要求**：

1. **重点内容**（按优先级）：
   - 🚀 **新功能**：新增的命令、API、配置选项、平台支持等
   - ⚠️ **重要变更**：破坏性变更、移除的功能、配置迁移需求
   - 🐛 **关键修复**：影响稳定性的重要 bug 修复
   - ⚡ **性能改进**：显著的性能优化

2. **输出格式**：
```markdown
## 更新摘要

| 组件 | 旧版本 | 新版本 | 版本跨度 |
|------|--------|--------|----------|
| Claude Code | x.y.z | X.Y.Z | N 个版本 |

---

## Claude Code 更新日志 (vx.y.z → vX.Y.Z)

### vX.Y.Z (日期) 🎉 Latest
**🚀 新功能**
- [功能名]: [描述]

**⚠️ 重要变更**
- [变更描述]

**🐛 关键修复**
- [修复描述]
```

3. **注意事项**：
   - 只输出旧版本到新版本之间的变更
   - 按版本号从旧到新排序
   - 版本跨度超过 5 个版本时，只输出最近 5 个版本的详细信息，其余简略
   - 使用中文输出
   - 纯技术性重构或内部改进可简要带过或省略
