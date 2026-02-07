---
name: update-opencode
description: Use when users need to update OpenCode CLI or oh-my-opencode plugin, check for new versions, or troubleshoot version-related issues. Use when seeing errors like "seems to be managed by a package manager" or "opencode upgrade doesn't move to newest version".
---

# 更新 OpenCode 和 Oh-My-OpenCode

## 概述

保持 OpenCode CLI 和 oh-my-opencode 插件为最新版本至关重要，可以获得新功能、bug 修复和性能改进。本文档提供了在不同包管理器环境下更新这两个组件的完整指南。

**核心原则**：
- 使用正确的包管理器命令更新 OpenCode
- 重新安装 oh-my-opencode 以获取最新版本
- 验证更新后配置仍然有效

## 何时使用

使用此技能的场景：

```
                      需要更新?
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    检查新版本      更新 OpenCode    更新 oh-my-opencode
        │                 │                 │
        ▼                 ▼                 ▼
   运行命令检查    使用包管理器更新   重新运行安装命令
```

### 使用场景

- 用户看到版本更新提示或想检查是否有新版本
- 遇到功能问题，怀疑是旧版本导致
- 需要使用最新功能（如新的 Agent 或技能）
- 安装失败或升级报错："seems to be managed by a package manager"
- "opencode upgrade doesn't move to newest version"

### 不使用场景

- 首次安装 OpenCode → 使用官方安装指南
- 配置问题（与版本无关）→ 检查配置文件
- 认证问题 → 使用 `opencode auth login`

## 核心模式

### 更新 OpenCode CLI

**❌ 错误方式**：手动下载二进制文件覆盖，可能导致版本混乱

**✅ 正确方式**：使用包管理器的更新命令

| 包管理器 | 更新命令 | 说明 |
|---------|---------|------|
| **Homebrew (推荐)** | `brew install anomalyco/tap/opencode` | 总是最新版本 |
| **Homebrew (官方)** | `brew install opencode` | 更新较慢，但稳定 |
| **npm/yarn/pnpm/bun** | `npm i -g opencode-ai@latest` | 指定 @latest 确保最新 |
| **Scoop (Windows)** | `scoop update opencode` | 自动更新到最新 |
| **Chocolatey (Windows)** | `choco upgrade opencode` | 自动更新到最新 |
| **Mise** | `mise use -g opencode` | 自动切换到最新 |
| **Nix** | `nix run nixpkgs#opencode` | 使用最新可用版本 |
| **通用命令** | `opencode upgrade` | 如果可用，自动检测包管理器 |

### 更新 oh-my-opencode 插件

**❌ 错误方式**：手动编辑 `opencode.json` 修改版本号

**✅ 正确方式**：重新运行安装命令

```bash
# 重新安装（推荐）
bunx oh-my-opencode install --no-tui <原订阅选项>

# 或使用 npm
npm i -g oh-my-opencode@latest
```

## 快速参考

### 常见更新命令速查表

| 场景 | 命令 | 备注 |
|------|------|------|
| **检查 OpenCode 版本** | `opencode --version` | 应 ≥ 1.0.150 |
| **更新 OpenCode (macOS/Linux)** | `brew install anomalyco/tap/opencode` | 推荐，总是最新 |
| **更新 OpenCode (npm)** | `npm i -g opencode-ai@latest` | 显式指定 @latest |
| **更新 OpenCode (Windows Scoop)** | `scoop update opencode` | - |
| **更新 oh-my-opencode** | `bunx oh-my-opencode install --no-tui <选项>` | 使用原安装参数 |
| **查看插件版本** | `cat ~/.config/opencode/oh-my-opencode.json` | 检查版本信息 |
| **验证配置** | `opencode --version && cat ~/.config/opencode/opencode.json` | 确认插件已加载 |

### 故障排查速查表

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| "seems to be managed by a package manager" | OpenCode 由包管理器安装 | 使用对应的包管理器更新命令 |
| "opencode upgrade doesn't move to newest version" | 使用了错误的 Homebrew tap | 改用 `anomalyco/tap/opencode` |
| 插件加载失败 | 配置文件损坏或版本不兼容 | 检查 JSON 语法，重新安装 |
| 认证失效 | 更新后需重新登录 | 运行 `opencode auth login` |

## 实现

### 完整更新流程

#### 步骤 1：检查当前版本

```bash
# 检查 OpenCode 版本
opencode --version

# 检查插件配置
cat ~/.config/opencode/oh-my-opencode.json
```

#### 步骤 2：更新 OpenCode

**macOS/Linux (Homebrew 推荐)**：

```bash
# 更新到最新版本（推荐）
brew install anomalyco/tap/opencode

# 或使用官方 Homebrew 公式（更新较慢）
brew install opencode
```

**npm/bun/yarn/pnpm**：

```bash
npm i -g opencode-ai@latest
# 或
bun i -g opencode-ai@latest
# 或
yarn global add opencode-ai@latest
# 或
pnpm add -g opencode-ai@latest
```

**Windows**：

```bash
# Scoop
scoop update opencode

# Chocolatey
choco upgrade opencode

# 其他包管理器：参考快速参考表
```

**验证更新**：

```bash
opencode --version
```

#### 步骤 3：更新 oh-my-opencode

**方式一：重新安装（推荐）**

```bash
# 如果记得原始订阅选项
bunx oh-my-opencode install --no-tui --claude=yes --openai=yes --gemini=no --copilot=no

# 如果不记得选项，可以交互式重新配置
bunx oh-my-opencode install
```

**方式二：使用 npm/bun 更新**

```bash
npm i -g oh-my-opencode@latest
# 或
bun i -g oh-my-opencode@latest
```

**验证插件**：

```bash
# 检查插件是否在 opencode.json 中
cat ~/.config/opencode/opencode.json | grep oh-my-opencode

# 检查插件配置
cat ~/.config/opencode/oh-my-opencode.json
```

#### 步骤 4：验证更新

```bash
# 验证 OpenCode 版本
opencode --version  # 应 ≥ 1.0.150

# 验证插件配置
cat ~/.config/opencode/opencode.json  # 应包含 "oh-my-opencode"

# 验证认证状态
opencode auth status  # 确认提供商已连接

# 测试功能
opencode run "test"
```

### 特殊场景处理

#### 场景：版本不匹配导致错误

如果看到错误提示版本要求（如 "OpenCode version >= 1.0.150 required"）：

```bash
# 1. 检查当前版本
opencode --version

# 2. 如果版本过低，使用推荐的包管理器更新
brew install anomalyco/tap/opencode

# 3. 验证版本
opencode --version
```

#### 场景：插件配置丢失

更新后如果发现插件配置丢失或行为异常：

```bash
# 1. 检查配置文件
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json  # 项目级配置

# 2. 重新安装插件
bunx oh-my-opencode install --no-tui <原订阅选项>

# 3. 恢复配置（如果有备份）
cp ~/.config/opencode/oh-my-opencode.json.bak ~/.config/opencode/oh-my-opencode.json
```

#### 场景：认证失效

更新后可能需要重新认证：

```bash
# Anthropic (Claude)
opencode auth login
# 选择：Provider: Anthropic → Login method: Claude Pro/Max

# Google (Gemini)
opencode auth login
# 选择：Provider: Google → Login method: OAuth with Google (Antigravity)

# GitHub Copilot
opencode auth login
# 选择：Provider: GitHub → Login method: GitHub Copilot
```

## 常见错误

| 错误 | 原因 | 修复方法 |
|------|------|---------|
| **手动覆盖二进制文件后版本混乱** | 手动下载和替换破坏了包管理器跟踪 | 使用包管理器重新安装：`brew reinstall opencode` |
| **使用错误的 Homebrew tap** | 使用了官方 tap 而非 anomalyco/tap | `brew uninstall opencode && brew install anomalyco/tap/opencode` |
| **插件未重新安装** | OpenCode 更新后插件仍使用旧版本 | 运行 `bunx oh-my-opencode install --no-tui <选项>` |
| **配置文件 JSON 语法错误** | 手动编辑引入语法错误 | 使用 JSON 验证工具，或恢复备份后重新安装 |
| **忘记订阅选项** | 重新安装时忘记了原始配置 | 查看备份配置：`cat ~/.config/opencode/oh-my-opencode.json.bak` |
| **更新后功能异常** | 新版本可能有配置变化 | 查看更新日志，检查配置兼容性，必要时调整配置 |

## 最佳实践

1. **定期更新**：每月或遇到问题时检查更新
2. **备份配置**：更新前备份 `~/.config/opencode/` 目录
3. **使用推荐命令**：优先使用 `anomalyco/tap/opencode` 而非官方 tap
4. **验证更新**：更新后运行测试确保功能正常
5. **记录配置**：保存订阅选项以便重新安装时使用

## 相关资源

- OpenCode 官方文档：https://opencode.ai/docs
- oh-my-opencode 仓库：https://github.com/code-yeongyu/oh-my-opencode
- oh-my-opencode 安装指南：https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
- OpenCode Releases：https://github.com/anomalyco/opencode/releases
- oh-my-opencode Releases：https://github.com/code-yeongyu/oh-my-opencode/releases
