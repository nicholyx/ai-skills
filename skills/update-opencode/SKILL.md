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

**✅ 正确方式**：使用包管理器的更新命令

```bash
# 使用 bun，如果有网络问题，需指定 registry
bun i -g oh-my-opencode@latest
# 或使用 npm，如果有网络问题，需指定 registry
npm i -g oh-my-opencode@latest
```

## 快速参考

### 常见更新命令速查表

| 场景 | 命令 | 备注 |
|------|------|------|
| **检查 OpenCode 安装方式** | `which opencode` | 确定使用哪个包管理器 |
| **检查 OpenCode 版本** | `opencode --version` | 应 ≥ 1.0.150 |
| **检查 oh-my-opencode 安装方式** | `which oh-my-opencode` | 确定使用哪个包管理器 |
| **检查 oh-my-opencode 版本** | `oh-my-opencode version` 或 `-v` | 显示插件版本号 |

| **更新 Homebrew 索引** | `brew update` | 如果用 Homebrew 安装，必须先执行 |
| **更新 OpenCode (Homebrew)** | `brew install anomalyco/tap/opencode` | 推荐，总是最新 |
| **更新 OpenCode (npm)** | `npm i -g opencode-ai@latest` | 显式指定 @latest |
| **更新 OpenCode (Windows Scoop)** | `scoop update opencode` | - |
| **更新 oh-my-opencode (bun)** | `bun i -g oh-my-opencode@latest --registry=https://registry.npmmirror.com` | 需指定 registry |
| **更新 oh-my-opencode (npm)** | `npm i -g oh-my-opencode@latest --registry=https://registry.npmmirror.com` | 需指定 registry |
| **查看插件版本** | `cat ~/.config/opencode/oh-my-opencode.json` | 检查配置信息 |
| **验证配置** | `opencode --version && oh-my-opencode version` | 确认版本一致 |

### 故障排查速查表

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| "seems to be managed by a package manager" | OpenCode 由包管理器安装 | 使用对应的包管理器更新命令 |
| "opencode upgrade doesn't move to newest version" | 使用了错误的 Homebrew tap | 改用 `anomalyco/tap/opencode`，或先运行 `brew update` |
| oh-my-opencode 版本不一致 | 本地版本与 opencode.json 中注册版本不一致 | 如果opencode.json的版本更加新一点，则不需要处理，如果opencode.json的版本更旧，则更新 opencode.json 中的版本号跟本地版本一样 |
| 网络问题导致更新失败 | 无法连接到默认 registry | 使用 `--registry=https://registry.npmmirror.com` 参数 |
| 插件加载失败 | 配置文件损坏或版本不兼容 | 检查 JSON 语法，重新安装 |
| 认证失效 | 更新后需重新登录 | 运行 `opencode auth login` |
| which 显示错误路径 | 可能使用了多个包管理器 | 根据路径使用对应的包管理器更新 |
| 未更新包管理器索引 | brew update 后才检查版本，否则获取旧版本 | 先运行包管理器更新命令 |

## 实现

### 完整更新流程

#### 步骤 1：检查当前版本和安装方式

```bash
# 1.1 检查 OpenCode 安装方式
which opencode
# - /opt/homebrew/bin/opencode → Homebrew 安装
# - /usr/local/bin/opencode → Homebrew 或手动安装
# - ~/.npm-global/bin/opencode → npm 安装
# - ~/.bun/bin/opencode → Bun 安装
# - 其他路径 → 需根据路径判断

# 1.2 检查 OpenCode 当前版本
opencode --version

# 1.3 检查 oh-my-opencode 安装方式
which oh-my-opencode
# - /opt/homebrew/bin/oh-my-opencode → Homebrew 安装
# - ~/.bun/bin/oh-my-opencode → Bun 安装
# - ~/.npm-global/bin/oh-my-opencode → npm 安装
# - 其他路径 → 需根据路径判断

# 1.4 检查 oh-my-opencode 版本
oh-my-opencode version                    # 显示插件版本号

# 1.5 检查 opencode.json 中注册的插件版本
cat ~/.config/opencode/opencode.json | grep -A1 "oh-my-opencode"

# 1.6 检查 oh-my-opencode 配置
cat ~/.config/opencode/oh-my-opencode.json 
```

**版本命令说明**：
- `oh-my-opencode version` (或 `-v`, `--version`): 显示插件版本号

**版本匹配说明**：
- `oh-my-opencode version` 显示插件版本号
- `~/.config/opencode/opencode.json` 中显示的是 OpenCode 已加载的插件版本
- `oh-my-opencode version` 显示的实际安装版本应该与 opencode.json 中的注册版本一致
- 如果不一致，规则如下：如果opencode.json的版本更加新一点，则不需要处理，如果opencode.json的版本更旧，则更新 opencode.json 中的版本号跟插件版本一样

#### 步骤 2：更新包管理器索引

根据步骤 1 中 `which` 的结果，更新对应的包管理器：

```bash
# Homebrew（如果 opencode 或 oh-my-opencode 在 /opt/homebrew/ 或 /usr/local/bin/）
brew update

# npm（如果需要检查 npm 包的更新）
# npm 自身不需要更新索引，直接安装 @latest 即可

# Bun（如果需要检查 bun 包的更新）
# bun 自身不需要更新索引，直接安装 @latest 即可

# 其他包管理器：根据对应包管理器的命令更新索引
```

**重要**: 必须先更新包管理器索引，否则获取的版本信息可能是旧的。

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

**使用 npm/bun 更新**

```bash
# 使用 npm 更新（需要指定 registry）
npm i -g oh-my-opencode@latest --registry=https://registry.npmmirror.com

# 或使用 bun 更新（需要指定 registry）
bun i -g oh-my-opencode@latest --registry=https://registry.npmmirror.com
```

**验证插件**：

```bash
# 检查插件是否在 opencode.json 中
cat ~/.config/opencode/opencode.json | grep oh-my-opencode

# 检查插件配置
cat ~/.config/opencode/oh-my-opencode.json
```

**注意**: 如果网络有问题，必须指定 `--registry=https://registry.npmmirror.com` 参数才能正常更新。

#### 步骤 4：验证更新生效

```bash
# 4.1 验证 OpenCode 版本
opencode --version

# 4.2 验证 oh-my-opencode 版本
oh-my-opencode version                    # 显示插件版本号

# 4.3 验证 opencode.json 中注册的插件版本
cat ~/.config/opencode/opencode.json | grep -A1 "oh-my-opencode"
# 应显示类似: "oh-my-opencode@3.5.0"

# 4.4 对比版本号，如果不一致则更新 opencode.json
# 规则如下：如果opencode.json的版本更加新一点，则不需要处理，如果opencode.json的版本更旧，则更新 opencode.json 中的版本号跟插件版本一样

# 4.5 验证配置文件完整性
cat ~/.config/opencode/oh-my-opencode.json

# 4.6 验证认证状态
opencode auth list  # 确认提供商已连接
```

**验证标准**：
- ✅ OpenCode 版本为最新
- ✅ `oh-my-opencode version` 显示最新版本号
- ✅ `opencode.json` 中注册的插件版本比 `oh-my-opencode version` 更加新或者一致
- ✅ 配置文件无语法错误
- ✅ 认证状态正常
- ✅ 测试命令执行成功

#### 步骤 5：输出更新日志（如有更新）

更新完成后，如果存在版本更新，**必须**输出从旧版本到新版本的更新日志，让用户了解本次更新的内容。

**前置条件检查**：
- 如果 OpenCode 和 oh-my-opencode 都没有版本更新（新旧版本号相同），则**跳过此步骤**
- 只有存在版本变化的组件才需要输出对应的更新日志

**实现方式**：使用两个并行的 subagent 分别查询和总结两个工具的更新日志，然后整合输出。**注意**：只有版本有变化的组件才启动对应的 subagent。

**仓库信息**：
- OpenCode: `https://github.com/anomalyco/opencode`
- oh-my-opencode: `https://github.com/code-yeongyu/oh-my-openagent`

**查询命令**：
```bash
# 列出最近的 releases
gh release list --repo anomalyco/opencode --limit 20
gh release list --repo code-yeongyu/oh-my-openagent --limit 20

# 查看特定版本的 release notes
gh release view v<VERSION> --repo anomalyco/opencode
gh release view v<VERSION> --repo code-yeongyu/oh-my-openagent
```

**输出要求**：

1. **使用两个 subagent 并行查询**：
   - Subagent 1: 查询 OpenCode 从旧版本到新版本的所有 release notes，总结重点
   - Subagent 2: 查询 oh-my-opencode 从旧版本到新版本的所有 release notes，总结重点

2. **重点内容**（按优先级）：
   - 🚀 **新功能**：新增的命令、API、配置选项、平台支持等
   - ⚠️ **重要变更**：破坏性变更、移除的功能、配置迁移需求
   - 🐛 **关键修复**：影响稳定性的重要 bug 修复
   - ⚡ **性能改进**：显著的性能优化
   - 🖥️ **Desktop 改进**：桌面应用的 UI/UX 改进

3. **输出格式**：
```markdown
## 更新摘要

| 组件 | 旧版本 | 新版本 | 版本跨度 |
|------|--------|--------|----------|
| OpenCode | x.y.z | x.y.z | N 个版本 |
| oh-my-opencode | x.y.z | x.y.z | N 个版本 |

---

## OpenCode 更新日志 (vx.y.z → vX.Y.Z)

### vX.Y.Z (日期) 🎉 Latest
**🚀 新功能**
- [功能名]: [描述]
- [新增命令]: `/command` - [用途]

**⚠️ 重要变更**
- [变更描述]

**🐛 关键修复**
- [修复描述]

---

## oh-my-opencode 更新日志 (vx.y.z → vX.Y.Z)

### vX.Y.Z (日期) 🎉 Latest
**🚀 新功能**
- [功能名]: [描述]
- [新增命令]: `/command` - [用途]

**⚠️ 重要变更**
- [变更描述]

**🐛 关键修复**
- [修复描述]
```

4. **注意事项**：
   - 只输出从旧版本（更新前）到新版本（更新后）之间的变更
   - 按版本号从旧到新排序
   - 如果版本跨度很大（超过 5 个版本），只输出最近 5 个版本的详细信息，其余用简略列表
   - 使用中文输出
   - 对于纯技术性的重构或内部改进，可以简要带过或省略

