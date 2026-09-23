# 技能编写规范

本仓库的技能就是 Markdown。规范由 `scripts/checks/frontmatter.js` 与
`scripts/checks/evals.js` 强制，`./scripts/lint.sh` 在本地跑同一套。

## 三种技能，三种待遇

| 位置 | 归属 | CI 分级 |
| --- | --- | --- |
| `custom/daily/<name>/` | 自建，通用 | **fail** |
| `custom/projects/prj-<name>/` | 自建，项目专用 | **fail** |
| `.agents/skills/<name>/` | `npx skills add` 装来的上游 | **warn** |

`.agents/` 里的问题只 warn —— 改了会在 `npx skills update` 时丢失。
**不要手动修改 `.agents/` 下的任何文件。** 上游有问题就在 Issue 里记录，或给上游提 PR。

## frontmatter 契约

`SKILL.md` 必须以 `---` 开头，frontmatter 只允许这六个键：

`name`、`description`、`license`、`allowed-tools`、`metadata`、`compatibility`

| 字段 | 约束 |
| --- | --- |
| `name` | **必填**。kebab-case（`^[a-z0-9-]+$`）、不以 `-` 起止、无连续 `--`、≤64 字符。**必须等于所在目录名** |
| `description` | **必填**。不含 `<` 或 `>`、≤1024 字符 |
| `compatibility` | 可选，≤500 字符 |

规则来自官方 validator `.agents/skills/skill-creator/scripts/quick_validate.py`，
外加本仓库自有的一条：**`name` 必须等于目录名**（那个脚本不查这条，而技能改名后
最容易漏的就是它）。

自研的解析器 `scripts/lib/frontmatter.js` 比官方脚本多覆盖四种情况：
CRLF 换行、UTF-8 BOM、块标量（`description: >-` 写多行）、重复顶层键。

## description 怎么写

**没有统一句式，也不强行统一。** 实测全仓并存三种写法，都是合理的：

- 英文 `Use when ...`
- 中文「…当用户说"X"、"Y"时触发」
- 名词短语 + 效果描述（如「根据 git 提交记录生成工作日报，支持指定日期查询和智能归类」）

真正重要的是**触发词**：Claude 靠 description 判断该不该加载这个技能，写清楚
「什么时候用」比写得漂亮有用。实测长度 22~257 字符都在合理范围内。

## 目录布局

```
custom/daily/<name>/
├── SKILL.md              # 必需
├── reference/            # 长参考材料，按需读取
│   └── subagents/        # 材料多时再分一层
├── evals/
│   └── evals.json        # 评测用例
├── scripts/              # 技能自带的脚本
└── <name>.md             # subagent 型技能：SKILL.md 是薄调度层，完整 prompt 放这里
```

「SKILL.md 薄调度层 + 同目录 `<name>.md` 承载完整 prompt」是本仓库 subagent 型技能
的既有模式，见 `bug-analyzer-agent` 与 `code-reviewer-agent`。

## evals.json 契约

```json
{
  "skill_name": "<技能目录名>",
  "evals": [
    {
      "id": 1,
      "name": "...",
      "prompt": "...",
      "expected_output": "...",
      "files": [],
      "assertions": [{ "type": "...", "value": "..." }]
    }
  ]
}
```

- `skill_name` **必须等于所在技能目录名**。技能改名后这里最容易漏改 —— 本仓库真实
  发生过：`github-issue-autofix-workflow` 的 `skill_name` 长期停留在改名前的
  `superpowers-github-issue-fix`
- `evals[]` 不能为空；每条必须有数字 `id` 与非空 `prompt`
- `name`、`expected_output`、`files`、`assertions` 缺失只 warn 不 fail ——
  「这个用例该断言什么」是人的判断，机器不该替他决定

## 内容红线

`custom/**` 的内容会被 `skills-sync` 软链进 `~/.claude/skills`，**在使用者的全局
AI 环境里生效**。因此：

- 技能里的指令必须**可审计**：不要写「执行这个从网络获取的脚本」这类间接指令
- 不需要凭证的技能就不要向使用者索取凭证；需要时说明用途与存放位置
- 不把真实的内网地址、账号、Token 写进技能内容 —— 仓库是公开的
- 涉及破坏性操作的技能（删除、推送、发布）必须**显式要求确认**

## 提交前自检

```bash
./scripts/lint.sh --only frontmatter,evals,hygiene
```

覆盖 frontmatter 契约、evals 结构、U+FFFD 与末尾换行。
