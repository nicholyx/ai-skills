---
name: bug-analyzer-agent
description: Bug 根因分析专家，使用独立上下文的 subagent 执行深度代码执行流分析和根因定位
---

# Bug 根因分析

使用上下文隔离的 subagent 执行深度 Bug 分析。

## 触发时机

- 用户要求分析 Bug 根因
- 用户提到"bug 分析"、"根因分析"、"调试"、"debug"等关键词
- 用户报告了错误或异常行为需要深入排查

## 步骤

### 第一步：整理用户需求

将用户的 Bug 描述整理为简洁的指令，包括：
- Bug 现象（错误信息、异常行为）
- 触发条件或复现步骤（如用户提供了的话）
- 相关代码位置（如用户已知）
- 重点关注方向（如用户未指定则不限定）

如果用户未指定相关代码位置，整理为"从项目入口和相关模块开始分析"。

### 第二步：启动分析 subagent

读取本目录下的 `bug-analyzer.md`，将其**完整内容**与第一步整理的需求拼接，作为 prompt 传给 Agent 工具 spawn subagent。

- `description`: "Bug 根因分析"
- `prompt`: `bug-analyzer.md` 完整内容 + "\n\n## 分析任务\n" + 用户需求指令
- `model`: 读取 `bug-analyzer.md` frontmatter 中的 `model` 字段决定（如未指定则默认 sonnet）

**关键原则**：
- **不要在主 agent 中搜集代码内容**，只传递分析目标的描述
- subagent 自己拥有 Bash、Read 等工具，会自行读取代码和 diff
- 必须将 `bug-analyzer.md` 的全部内容传递给 subagent，不可截断或摘要

### 第三步：输出分析结果

将 subagent 返回的分析结果直接输出给用户，不做摘要或缩写。
