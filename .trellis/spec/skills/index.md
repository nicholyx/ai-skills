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
「什么时候用」比写得漂亮有用。实测长度 47～292 字符都在合理范围内。

### 一条硬约束：目录承诺的那句话，必须在 description 里

`docs/SKILLS.md` 给访客展示的「你可以这样说」取自 `metadata.example`。**这句话必须
原样出现在该技能的 `description` 里** —— 由 `scripts/checks/skill-integrity.js` 断言。

理由是因果的，不是形式上的：模型先读 `description` 决定唤不唤起，正文是唤起**之后**
才加载的。示例不在描述里，目录对用户的承诺就没有兑现机制 —— 用户照着说了，什么都不会
发生。写起来只是把它并入触发说法：

```yaml
description: 使用约定式提交规范执行 git commit。当用户说「帮我提交」「提交一下这些改动」时使用。
metadata:
  example: "帮我提交"
```

引入这条约束时它挂了 **11/15** 个技能：它们的描述是**主题概括**（`git-commit` 当时只有
22 字「使用约定式提交规范执行 git commit」），而目录承诺的是一句口语。其中三个技能的
描述还是**纯英文**的，用户却多半说中文 —— 承诺的那句话在模型能看到的地方没有任何锚点。

## `metadata`：给人看的那一层

frontmatter 的 `description` 是**写给模型看的** —— 塞满触发词，本仓库的实测长度在
47～292 字符之间。人浏览时读不下去，而「这仓库里有什么、我该装哪个」正是访客最先
问的问题。

所以用 `metadata` 补一层**给人看**的信息，三个字段：

```yaml
metadata:
  category: 代码质量                          # 归到哪个场景（决定目录里的分组）
  tagline: "一句话说清它能干什么"              # 目录里的「它能做什么」列
  example: "审查一下我暂存区的改动"            # 目录里的「你可以这样说」列
```

| 字段 | 给谁看 | 写法要求 |
| --- | --- | --- |
| `description` | 模型 | 塞触发词，越长越准。**不要为了好看而精简它** |
| `metadata.tagline` | 人 | 一句话。不要复述 description，那是另一个读者 |
| `metadata.example` | 人 | **一句可以直接说出口的话**，不要写成「支持 X 功能」。且必须原样出现在 `description` 里（见上）|
| `metadata.category` | 人 | 常用集合见 `scripts/new-skill.js` 的 `CATEGORIES` |

`metadata` 是官方 frontmatter 白名单里的六个键之一，放这些是合规的（`checks/frontmatter.js`
不会拦）。**约定本身由 `scripts/checks/catalogue.js` 与目录生成器共同维持** ——
缺字段不会 fail，但新技能会以占位符出现在 `docs/SKILLS.md` 里，等于没被介绍给访客。

### 用脚手架创建一个技能

```bash
node scripts/new-skill.js <名字> --tagline "一句话" --example "你可以这样说" [--category 分类]
```

它生成合规骨架、提醒你补 `description`、并告诉你**要重跑目录生成器** ——
忘了重跑不会静默通过，CI 的「技能目录校验」会拦住。

> `metadata` 只解析**一层**子键的标量（见 `lib/frontmatter.js`）。要放更复杂的结构，
> 先想清楚读者是谁 —— 目录只需要这三个字段。

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
