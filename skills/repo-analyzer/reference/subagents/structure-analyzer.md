# 项目结构分析器

## 任务

分析项目目录结构，输出以下内容：

1. 列出项目的目录结构（使用 tree 格式，深度 3-4 层）
2. 分析每个主要目录的职责
3. 识别核心模块和工具模块

## 输出格式

```json
{
  "directory_tree": "...",
  "directories": [
    {
      "path": "src/api",
      "purpose": "API 路由层",
      "key_files": ["routes.py", "handlers.py"],
      "responsibility": "处理 HTTP 请求，定义 API 端点"
    }
  ],
  "core_modules": ["src/services", "src/models"],
  "util_modules": ["src/utils", "src/config"]
}
```

## 要求

- 必须标注文件路径
- 用一句话描述每个目录的职责
- 区分核心业务模块和辅助模块
- 识别项目使用的设计模式（如分层架构、插件模式等）

## 分析技巧

1. 首先查看根目录文件，了解项目类型
2. 识别常见的目录命名模式：
   - `api/`, `routes/`, `controllers/` → API 层
   - `services/`, `domain/`, `business/` → 业务逻辑层
   - `models/`, `entities/`, `schemas/` → 数据模型层
   - `utils/`, `helpers/`, `common/` → 工具层
   - `config/`, `settings/` → 配置层
   - `tests/`, `spec/` → 测试层
3. 识别框架特定的目录结构
