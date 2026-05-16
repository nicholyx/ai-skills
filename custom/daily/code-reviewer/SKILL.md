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

### 第一步：收集审查范围

确定用户要审查的目标：
- 具体文件路径或目录
- 当前 git 变更（未提交或最近提交）
- PR 编号

如果用户未明确指定，默认审查当前 git 变更：

```bash
git diff --name-only HEAD~1
```

### 第二步：启动审查 subagent

读取本目录下的 `code-reviewer.md` 获取完整审查 prompt，然后使用 Agent 工具 spawn subagent：

- `description`: "深度代码审查"
- `prompt`: 将 `code-reviewer.md` 的内容作为 system prompt，附上待审查的代码内容或变更范围
- `model`: 读取 `code-reviewer.md` frontmatter 中的 `model` 字段决定（如未指定则默认 sonnet）

### 第三步：输出审查结果

将 subagent 返回的审查结果直接输出给用户，不做摘要或缩写。
