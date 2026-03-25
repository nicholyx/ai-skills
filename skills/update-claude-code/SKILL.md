---
name: update-claude-code
description: 当用户提到"更新 claude"、"升级 claude code"、"检查 claude 版本"、"claude code 最新版本"时也使用此技能。
---

# 更新 Claude Code CLI

## 概述

保持 Claude Code CLI 为最新版本至关重要，可以获得新功能、bug 修复和性能改进。本文档提供了在不同包管理器环境下更新 Claude Code 的完整指南。

**核心原则**：
- 使用正确的包管理器命令更新 Claude Code
- 验证更新后配置仍然有效

## 何时使用

使用此技能的场景：

```
                      需要更新?
                          │
                        检查新版本
                          │
                          ▼
                   使用包管理器更新
```

### 使用场景

- 用户看到版本更新提示或想检查是否有新版本
- 遇到功能问题，怀疑是旧版本导致
- 需要使用最新功能（如新的 Agent 或工具）

### 不使用场景

- 首次安装 Claude Code → 使用官方安装指南
- 配置问题（与版本无关）→ 检查配置文件

## 核心模式

### 更新 Claude Code CLI

**❌ 错误方式**：手动下载二进制文件覆盖，可能导致版本混乱

**✅ 正确方式**：使用包管理器的更新命令

| 包管理器 | 更新命令 | 说明 |
|---------|---------|------|
| **Homebrew** | `brew upgrade claude` | 自动更新到最新 |
| **npm** | `npm i -g @anthropic-ai/claude-code@latest` | 指定 @latest 确保最新 |
| **bun** | `bun i -g @anthropic-ai/claude-code@latest` | 指定 @latest 确保最新 |
| **yarn** | `yarn global add @anthropic-ai/claude-code@latest` | 指定 @latest 确保最新 |
| **pnpm** | `pnpm add -g @anthropic-ai/claude-code@latest` | 指定 @latest 确保最新 |

## 快速参考

### 常见更新命令速查表

| 场景 | 命令 | 备注 |
|------|------|------|
| **检查 Claude Code 安装方式** | `which claude` | 确定使用哪个包管理器 |
| **检查 Claude Code 版本** | `claude --version` | 显示当前版本号 |
| **更新 Homebrew 索引** | `brew update` | 如果用 Homebrew 安装，必须先执行 |
| **更新 Claude Code (Homebrew)** | `brew upgrade claude` | 推荐 macOS 用户 |
| **更新 Claude Code (npm)** | `npm i -g @anthropic-ai/claude-code@latest` | 显式指定 @latest |
| **更新 Claude Code (bun)** | `bun i -g @anthropic-ai/claude-code@latest` | 显式指定 @latest |
| **查看 Claude Code 帮助** | `claude --help` | 显示可用命令 |

### 故障排查速查表

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| "seems to be managed by a package manager" | Claude Code 由包管理器安装 | 使用对应的包管理器更新命令 |
| "claude update doesn't move to newest version" | 使用了错误的更新方式 | 使用包管理器更新命令 |
| 网络问题导致更新失败 | 无法连接到默认 registry | 使用 `--registry=https://registry.npmmirror.com` 参数 |
| which 显示错误路径 | 可能使用了多个包管理器 | 根据路径使用对应的包管理器更新 |
| 未更新包管理器索引 | brew update 后才检查版本，否则获取旧版本 | 先运行包管理器更新命令 |

## 实现

### 完整更新流程

#### 步骤 1：检查当前版本和安装方式

```bash
# 1.1 检查 Claude Code 安装方式
which claude
# - /opt/homebrew/bin/claude → Homebrew 安装
# - /usr/local/bin/claude → Homebrew 或手动安装
# - ~/.npm-global/bin/claude → npm 安装
# - ~/.bun/bin/claude → Bun 安装
# - 其他路径 → 需根据路径判断

# 1.2 检查 Claude Code 当前版本
claude --version
```

#### 步骤 2：更新包管理器索引

根据步骤 1 中 `which` 的结果，更新对应的包管理器：

```bash
# Homebrew（如果 claude 在 /opt/homebrew/ 或 /usr/local/bin/）
brew update

# npm（如果需要检查 npm 包的更新）
# npm 自身不需要更新索引，直接安装 @latest 即可

# Bun（如果需要检查 bun 包的更新）
# bun 自身不需要更新索引，直接安装 @latest 即可
```

**重要**: 必须先更新包管理器索引，否则获取的版本信息可能是旧的。

#### 步骤 3：更新 Claude Code

**macOS/Linux (Homebrew)**：

```bash
brew upgrade claude
```

**npm/bun/yarn/pnpm**：

```bash
npm i -g @anthropic-ai/claude-code@latest
# 或
bun i -g @anthropic-ai/claude-code@latest
# 或
yarn global add @anthropic-ai/claude-code@latest
# 或
pnpm add -g @anthropic-ai/claude-code@latest
```

**验证更新**：

```bash
claude --version
```

#### 步骤 4：验证更新生效

```bash
验证 Claude Code 版本
claude --version

```

**验证标准**：
- ✅ Claude Code 版本为最新

#### 步骤 5：输出更新日志（如有更新）

更新完成后，如果存在版本更新，**必须**输出从旧版本到新版本的更新日志，让用户了解本次更新的内容。

**前置条件检查**：
- 如果 Claude Code 没有版本更新（新旧版本号相同），则**跳过此步骤**

**Changelog 来源**：
- GitHub 文件: `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md`

**获取方式**（使用 gh 命令）：
```bash
# 方法 1: 使用 gh api 获取文件内容（推荐）
gh api repos/anthropics/claude-code/contents/CHANGELOG.md --jq '.content' | base64 -d

# 方法 2: 使用 curl 获取 raw 文件
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
- [新增命令]: `/command` - [用途]

**⚠️ 重要变更**
- [变更描述]

**🐛 关键修复**
- [修复描述]
```

3. **注意事项**：
   - 只输出从旧版本（更新前）到新版本（更新后）之间的变更
   - 按版本号从旧到新排序
   - 如果版本跨度很大（超过 5 个版本），只输出最近 5 个版本的详细信息，其余用简略列表
   - 使用中文输出
   - 对于纯技术性的重构或内部改进，可以简要带过或省略
