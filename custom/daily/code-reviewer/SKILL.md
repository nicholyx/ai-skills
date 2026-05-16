---
name: code-reviewer
description: 代码审查专家，使用独立上下文的 subagent 执行深度代码审查，覆盖安全漏洞、性能优化和生产可靠性
---

# 代码审查

使用上下文隔离的 subagent 执行深度代码审查。

## 触发时机

- 用户要求进行代码审查
- 用户提到"code review"、"代码审查"、"审查代码"等关键词
- 用户要求检查安全性、性能或代码质量

## 步骤

### 第一步：整理用户需求

将用户的审查需求整理为清晰的指令，包括：
- 审查目标（文件/目录/PR/当前变更）
- 重点关注方向（安全/性能/质量，如用户未指定则不限定）
- 其他用户补充的要求

如果用户未指定审查目标，整理为"审查当前项目的最近变更"。

### 第二步：启动审查 subagent

读取本目录下的 `code-reviewer.md`，将其**完整内容**（包括 frontmatter 中的人设、注意事项、能力描述等）与第一步整理的需求拼接，作为 prompt 传给 Agent 工具 spawn subagent：

- `description`: "深度代码审查"
- `prompt`: `code-reviewer.md` 完整内容 + 用户需求
- `model`: 读取 `code-reviewer.md` frontmatter 中的 `model` 字段决定（如未指定则默认 sonnet）

**注意**：必须将 `code-reviewer.md` 的全部内容传递给 subagent，不可截断或摘要，否则 subagent 会丢失人设和审查标准。

### 第三步：输出审查结果

将 subagent 返回的审查结果直接输出给用户，不做摘要或缩写。
