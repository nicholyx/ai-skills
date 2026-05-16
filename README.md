# ai-skills

个人 Claude Code Skills 仓库，包含外部安装和自建两类技能。

## 目录结构

```
ai-skills/
├── .agents/skills/     # 外部安装的技能（由 skills-lock.json 追踪）
└── custom/             # 自建技能
    ├── daily/          # 通用技能（跨项目可用）
    └── projects/       # 项目相关技能（按项目前缀命名）
```

### `.agents/skills/` vs `custom/`

| | `.agents/skills/` | `custom/` |
|---|---|---|
| 来源 | 通过 `npx skills add` 从外部仓库安装 | 自己编写和维护 |
| 追踪 | `skills-lock.json` 记录来源和版本 | 无 lock 文件 |
| 更新 | 可通过 `npx skills update` 更新 | 手动维护 |

### `custom/daily/` vs `custom/projects/`

| | `custom/daily/` | `custom/projects/` |
|---|---|---|
| 定位 | 通用技能，任何项目都能用 | 特定项目专用 |
| 命名 | 直接用功能名，如 `git-commit` | 加项目前缀，如 `prj-agent-platform-e2e-test` |
| 示例 | 日报生成、git 操作、代码分析 | 某项目的 e2e 测试、某项目的部署流程 |

## 安装命令

```bash
# 安装 .agents/skills 中的技能（默认搜索）
npx skills add nicholyx/ai-skills

# 安装全部技能（包括 custom 中的自建技能）
npx skills add nicholyx/ai-skills --full-depth

# 仅安装 custom 中的自建技能
npx skills add nicholyx/ai-skills/custom
```
