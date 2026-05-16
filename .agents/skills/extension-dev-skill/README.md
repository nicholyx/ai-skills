**[English](README_EN.md)** | 中文

# extension-dev-skill

用于 [嘉立创EDA & EasyEDA 专业版](https://lceda.cn/) 扩展插件开发的 AI Skill。让 AI Agent 自动完成插件的 API 查询、代码生成、插件构建流程。

## 功能特性

- 针对[pro-api-sdk](https://github.com/easyeda/pro-api-sdk)优化
- 基于[easyeda-api-skill](https://github.com/easyeda/easyeda-api-skill)文档驱动的代码生成
- 支持 MCP 调试工具链，实现 AI 自动构建 → 导入 → 日志监听


## 安装说明

### 1. 拉取仓库到skill目录

根据你使用的 AI Agent 文档，找到或创建存放 Skill 的目录：

```bash
git clone https://github.com/easyeda/extension-dev-skill
```

例如：  

> **QwenCode**  
> **项目作用域**：位于项目根目录下的 .qwen/skills  
> **用户作用域**：位于 ~/.qwen/skills，对本机所有项目生效  
> 进入到对应的skills文件夹下  
> 在终端执行`git clone https://github.com/easyeda/extension-dev-skill`即可

> **OpenCode**  
> **项目作用域**：位于项目根目录下的 .opencode/skills  
> **用户作用域**：位于 ~/.config/opencode/skills，对本机所有项目生效  
> 进入到对应的skills文件夹下  
> 在终端执行`git clone https://github.com/easyeda/extension-dev-skill`即可


### 2. 使用指定skill

在你的 AI Agent 中确认 Skill 已加载，可通过命令指定skill。

例如：

> **QwenCode**  
> **1.进入终端**：在终端中输入`qwen`后回车  
> **2.指定skill并发送需求**：在QwenCode的CLI中输入`/skills`回车  
> 选择要使用的extension-dev-skill并回车，然后填入你的需求   

> **OpenCode**  
> **1.进入终端**：在终端中输入`opencode`后回车  
> **2.指定skill并发送需求**：在OpenCode的CLI中输入`/skills`回车  
> 选择要使用的extension-dev-skill并回车，然后填入你的需求   

## 工作原理

Skill 定义了一套工作流，AI Agent 在生成插件代码时会遵循：

| 步骤 | 名称 | 说明 |
|------|------|------|
| 1 | 计划 | 理解需求，确认目标编辑器和核心功能 |
| 2 | 初始化 | 工作区未初始化时执行项目初始化 |
| 3 | 查询 | 四步法查询 API，每个 API 必须在文档中验证 |
| 4 | 验证 | 确认所有类型签名完整，不确定则回退查询 |
| 5 | 确认 | 向用户展示实现方案 |
| 6 | 执行 | 生成代码，API 调用包裹 try/catch |
| 7 | 检查 | 运行时约束检查、菜单 ID 唯一性校验 |
| 8 | 文档 | 生成/更新 README.md 和 CHANGELOG.md |
| 9 | 部署 | 构建并导入插件 |

具体实现效果与模型能力存在相关性，建议配合编码及理解能力较优秀的模型使用

## 已测试的平台
  
| 平台 | 模型 |
|------|------|
| OpenClaw | MiniMax-2.7 |
| OpenCode | MiMo V2 Pro Free|
| QwenCode | Qwen3-Coder |
| Kiro | Claude Opus4.6 |
| Trae | Kimi-K2 / Deepseek-V3|

## MCP 调试工具（可选）

[extension-dev-mcp-tools](https://github.com/easyeda/extension-dev-mcp-tools)

安装后 AI Agent 可支持：构建 `.eext` → 导入浏览器 → 获取控制台日志。


## 演示视频

基于 OpenCode：

https://github.com/user-attachments/assets/742954b8-9527-43ad-ae08-3f08ec083fa2


