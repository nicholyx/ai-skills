---
name: repo-analyzer
description: 深入研究代码仓库的源代码，以首次开发人员的角度进行全面分析。当用户说"深入研究一下 xxx 项目"、"帮我分析这个代码仓库"、"了解这个项目的架构"、"分析 github.com/xxx/xxx 仓库"时触发。支持本地目录和 GitHub 仓库地址，自动下载并分析项目结构、启动流程、核心业务流程、模块职责等，最后生成详细的分析报告文档。
---

# 代码仓库深度分析器

帮助用户快速理解一个陌生代码仓库的整体架构和核心逻辑，以首次开发人员的视角进行深度分析。

**核心原则：**
1. **并行 subagent 处理** - 使用多个 subagent 并行分析不同维度，避免主 agent 上下文爆掉
2. **代码片段优先** - 输出核心代码片段和文件路径，让用户能直接定位
3. **流程驱动** - 从流程角度讲清楚项目如何运行

---

## 触发场景

- "深入研究一下 xxx 项目"
- "帮我分析这个代码仓库"
- "了解这个项目的架构"
- "分析 github.com/user/repo 仓库"
- "我想快速入手这个项目"

---

## 分析模式

| 模式 | Subagent 数量 | 预计时间 | 适用场景 |
|------|---------------|----------|----------|
| Quick | 3-4 | 2-3 分钟 | 快速了解项目 |
| Standard | 5-6 | 5-8 分钟 | 日常分析 [默认] |
| Deep | 7-8 | 10-15 分钟 | 重要项目深入理解 |
| UltraDeep | 9-10 | 20-30 分钟 | 核心项目全面掌握 |

---

## 执行流程

### Phase 1: 项目发现 (DISCOVERY)

**目标：** 获取代码仓库，识别项目类型和技术栈

**活动：**
1. 根据 GitHub 地址克隆仓库，或使用本地目录
2. 扫描项目根目录，识别技术栈
3. 读取 README、CLAUDE.md 等文档

**技术栈识别：**

| 文件 | 技术栈 |
|------|--------|
| `package.json` | Node.js/JavaScript/TypeScript |
| `requirements.txt` / `pyproject.toml` | Python |
| `pom.xml` / `build.gradle` | Java |
| `go.mod` | Go |
| `Cargo.toml` | Rust |

**输出：** 创建工作目录 `<project>/docs/analysis-temp/`

---

### Phase 2: 并行分析 (PARALLEL ANALYSIS)

**关键：使用 Agent 工具并行启动多个 subagent，每个专注一个维度**

**Standard 模式启动 6 个 subagent：**

```
[单个消息中并行启动所有 subagent]
- Agent(subagent_type="Explore", description="分析项目结构", prompt="...")
- Agent(subagent_type="Explore", description="分析启动流程", prompt="...")
- Agent(subagent_type="Explore", description="分析核心业务流程", prompt="...")
- Agent(subagent_type="Explore", description="分析数据模型", prompt="...")
- Agent(subagent_type="Explore", description="分析依赖关系", prompt="...")
- Agent(subagent_type="Explore", description="分析配置系统", prompt="...")
```

**Subagent Prompt 模板：**

每个 subagent 的 prompt 使用以下格式：

```
你是一个{分析领域}专家。

## 任务要求
请阅读以下规范文件，按要求分析项目：
{SKILL_PATH}/reference/subagents/{分析器名称}.md

## 项目路径
{PROJECT_PATH}

## 输出要求
- 输出 JSON 格式结果
- 包含代码片段、文件路径、行号
- 包含 Mermaid 图表代码
```

**Subagent 与规范文件对应：**

| Subagent | 规范文件 |
|----------|----------|
| 项目结构分析 | `reference/subagents/structure-analyzer.md` |
| 启动流程分析 | `reference/subagents/startup-analyzer.md` |
| 业务流程分析 | `reference/subagents/business-flow-analyzer.md` |
| 数据模型分析 | `reference/subagents/data-model-analyzer.md` |
| 依赖关系分析 | `reference/subagents/dependency-analyzer.md` |
| 配置系统分析 | `reference/subagents/config-analyzer.md` |

---

### Phase 3: 结果聚合 (AGGREGATION)

**目标：** 收集所有 subagent 的分析结果

**活动：**
1. 等待所有 subagent 完成
2. 读取每个 subagent 的输出
3. 合并到统一的分析结果

---

### Phase 4: 报告生成 (REPORT GENERATION)

**关键：渐进式生成报告，每个章节单独写入**

**章节生成顺序（每个使用 Edit 追加）：**

1. 报告头部和项目概览
2. 快速入手指南
3. 启动流程详解
4. 核心业务流程
5. 模块详解
6. 数据模型
7. 配置说明
8. 依赖分析
9. 总结

**报告模板：** 参考 `reference/report-template.md`

**质量标准：** 参考 `reference/quality-standards.md`

---

## Reference 文件

| 文件 | 用途 |
|------|------|
| `reference/subagents/structure-analyzer.md` | 项目结构分析规范 |
| `reference/subagents/startup-analyzer.md` | 启动流程分析规范 |
| `reference/subagents/business-flow-analyzer.md` | 业务流程分析规范 |
| `reference/subagents/data-model-analyzer.md` | 数据模型分析规范 |
| `reference/subagents/dependency-analyzer.md` | 依赖关系分析规范 |
| `reference/subagents/config-analyzer.md` | 配置系统分析规范 |
| `reference/report-template.md` | 报告模板 |
| `reference/quality-standards.md` | 质量标准检查清单 |

---

## 输出要求

| 项目 | 要求 |
|------|------|
| 文件名 | `repo-analysis-YYYYMMDD.md` |
| 位置 | `<项目根目录>/docs/` |
| 临时文件 | `<项目根目录>/docs/analysis-temp/` |

---


