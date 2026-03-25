# 配置系统分析器

## 任务

分析项目的配置系统，输出以下内容：

1. 识别配置文件位置
2. 分析配置加载方式
3. 列出重要配置项
4. 识别环境变量

## 输出格式

```json
{
  "config_files": [
    {
      "file": "config.yaml",
      "purpose": "主配置文件",
      "format": "YAML"
    }
  ],
  "config_loading": {
    "file": "app/config.py",
    "code_snippet": "def load_config(path): ...",
    "lines": "15-30"
  },
  "important_configs": [
    {"key": "database.url", "type": "string", "description": "数据库连接"}
  ],
  "environment_variables": [
    {"name": "OPENAI_API_KEY", "required": true, "description": "API 密钥"}
  ]
}
```

## 要求

- 列出所有配置文件
- 包含配置加载代码（10-20 行）
- 标注必需的环境变量
- 识别敏感配置项（如密钥、密码）

## 常见配置文件

| 类型 | 文件名 |
|------|--------|
| YAML | `config.yaml`, `settings.yaml`, `.yaml` |
| JSON | `config.json`, `.json` |
| TOML | `pyproject.toml`, `config.toml` |
| INI | `config.ini`, `.ini` |
| ENV | `.env`, `.env.local`, `.env.production` |

## 环境变量识别

1. 查找 `.env` 文件
2. 查找 `os.getenv()`, `process.env`, `System.getenv()` 调用
3. 查找 `${VAR_NAME}` 占位符
4. 识别 `required=True/False` 参数

## 敏感配置识别

需要特别标注的敏感配置：
- API 密钥：`*_API_KEY`, `*_SECRET`
- 数据库密码：`*_PASSWORD`, `DB_PASS`
- Token：`*_TOKEN`
- 私钥：`*_PRIVATE_KEY`

## 配置加载代码示例

```python
# Python Pydantic Settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    api_key: str

    class Config:
        env_file = ".env"
```

```typescript
// Node.js dotenv
import dotenv from 'dotenv';
dotenv.config();

const config = {
    databaseUrl: process.env.DATABASE_URL,
    apiKey: process.env.API_KEY,
};
```
