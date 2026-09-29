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

写清楚「什么时候用」比写得漂亮有用。实测长度 47～292 字符都在合理范围内。

> ⚠️ **别把这段读成「写好 description 就能触发」** —— 见下方「关于技能唤起的实测」，
> 那个因果**没有**被证实。

### 一条硬约束：目录承诺的那句话，必须在 description 里

`docs/SKILLS.md` 给访客展示的「你可以这样说」取自 `metadata.example`。**这句话必须
原样出现在该技能的 `description` 里** —— 由 `scripts/checks/skill-integrity.js` 断言。

理由是**自洽**，不是形式上的：目录对访客承诺的那句话，应当是技能自己元数据里的说法，
而不是另编的 —— 两者对不上，访客看到的就是一句技能本身不认的话。

它**不保证**技能会被唤起。见下方「关于技能唤起的实测」：那个因果**没有**被证实。
写起来只是把这句话并进元数据：

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
      "assertions": [{ "type": "contains", "target": "tools", "value": "..." }]
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

### 断言必须说清它在看什么（`target`）

| `target` | 看的是 | 典型用途 |
| --- | --- | --- |
| `transcript`（默认）| 全文 = 工具调用 + 模型输出 | 正向断言够用 |
| `tools` | 模型**实际执行**的工具调用 | 「不许执行 `git push`」|
| `output` | 模型的输出文本 | 「不许问『是否继续』」|
| `repo` | 沙箱**最终状态**的摘要 | 「什么都没提交」「真的推上去了」|

**能落在 `repo` 上的断言就落在 `repo` 上。** 它比另外三个都硬：模型可以嘴上说「我不会
执行 `git push`」而实际推了，也可以什么都没说却把 `.env` 提交了。另外三个面测的是它
**怎么说**，`repo` 测的是它**做成了什么**。`repo` 的内容（扁平 `key: value`，便于断言）：

```
commits: 2              提交总数
new-commits: 1          本次运行新增的提交数（0 = 什么都没提交）
staged: src/a.js        暂存区里的文件
committed-files: …      本次运行改动到的文件
untracked: …            未跟踪文件
pushed: no              裸 origin 里有没有 ref（即「真的推上去了吗」）
```

**`not_contains` 必须显式写 `target`**（判错，不是提示）。默认的 `transcript` 是全文
匹配，而否定断言在全文下几乎必然误伤 —— 模型只要说一句「我不会执行 `git push`」，
行为完全正确，`not_contains "git push"` 却红了。这类**假失败**比漏检更糟：它让人不再
相信这套用例。正向断言不强制，因为 `transcript` 是超集，最坏只是约束偏松。

选 `tools` 还是 `output` 有个实用的判据：**如果断言值只可能出现在模型的话里，
选 `output`**。`git-smart-update` 的 `not_contains "所有分支"` 就是这种情况 ——
命令里不会出现中文，选 `tools` 会让这条断言**永远通过**，等于没写。

### 别把断言绑死在措辞上

实测踩到过：`git-commit #2` 断言模型会问「是否要提交工作区的变更」。模型**行为完全
正确** —— 它问了「请确认要怎么处理：1. 只提交 …」，沙箱里一个提交都没产生 —— 但因为它
没用那句话，断言红了。**这是断言的问题，不是技能的问题**，而它同样会让人不再相信输出。

判据：**你要断言的是「它说了某句特定的话」，还是「它没有做出那个动作」？** 后者一律
写到 `repo` 面上。前者宽一点没关系（`拆分|分成.{0,4}提交` 比 `拆分` 稳），但要明白它
终究是脆的。

### 落在 `repo` 上的断言要指定到具体那一行

`repo` 是一个多行摘要，**裸写关键词会命中不该管的那一行**。真实翻车：断言
`not_contains [repo] \.env` 用来表达「不许把 .env 提交进去」，而摘要里有一行
`untracked: .env` —— 那是**前置状态**（.env 本来就该存在），不是违规。结果是一条
**自己造出来的假失败**。

所以要写到行内：

| 想断言 | 别写 | 写 |
| --- | --- | --- |
| 没有把 .env 暂存 | `\.env` | `staged: .*\.env` |
| 没有把 .env 提交 | `\.env` | `committed-files: .*\.env` |
| 没有推送 | `pushed` | `pushed: yes` |
| 没有产生提交 | `new-commits` | `new-commits: 0` |

另：`type` / `target` 写错值会判错，`value` 为空也会判错。不认识的 `type` 不会被任何
跑手匹配，用例会**静默失效** —— 那是最难发现的一类坏法。

### 断言的 `value` 不要假设命令以规范形式书写

实测踩到过，而且是最危险的那种出错方式：`not_contains "git add .env"` 判定**通过**了，
而 transcript 里模型明明执行了 `git -C /private/var/… add .env && …` —— `git -C <路径>`
插在中间，字面匹配就漏了。

**agent 会把命令写成 `git -C <绝对路径> …`、`cd x && git push`、`/usr/bin/git …`。**
所以对工具调用的断言要用容忍这些形式的正则：

| 想断言 | 别写 | 写 |
| --- | --- | --- |
| 没有 push | `git push` | `\bpush\b` |
| 没有暂存 .env | `git add .env` | `add\s+\S*\.env` |
| 查看过暂存区 | `git diff --staged` | `diff\s+--staged` |

否定断言尤其危险：**匹配漏了就是假通过**，而假通过比失败更难发现 —— 它让人以为验过了。

> 更彻底的办法是让断言看**仓库的最终状态**而不是模型的自述。那需要给跑手加一个 `repo`
> 面（`git log` / 暂存区 / origin 的 refs），见路线图 Issue #7。

### `files` 是这条用例的前置状态，不是装饰

断言「暂存区为空时先询问」的用例，前提是**暂存区真的是空的**；断言「拒绝把 .env 纳入
提交」的用例，前提是**真的有个 .env**。「写完 prompt 就算把用例立起来了」是**最容易
漏掉的一环** —— 前置状态不对，跑出来的结果测的是别的东西，而且**它照样给你一个通过或
失败**，看上去完全正常。

写法见 `scripts/run-evals.js` 的文件头。要点：跑手自带基准仓库（一个提交过的
`README.md` + 一个裸 `origin`），**`files: []` 的含义是「什么都不动」**；要让后续条目
能修改某个文件（造出「修复型」的 diff），得先用 `commit: true` 把它提交进基准状态。

### 怎么跑

```bash
node scripts/run-evals.js --skill git-commit --dry-run   # 先看会执行什么、前置状态铺成什么样
node scripts/run-evals.js --skill git-commit             # 真跑（约 $0.24 / 40 秒 一条）
node scripts/run-evals.js --skill git-commit --eval 4 --keep   # 排错：留沙箱与 transcript
```

**它不进 CI** —— 成本与时长都不适合每次 PR。它是维护者工具：改完技能手动跑一遍。

### 两层验证：静态 → 行为

| 层 | 工具 | 回答的问题 | 花钱 | 进 CI |
| --- | --- | --- | --- | --- |
| 静态 | `checks/skill-integrity.js` | 目录承诺的那句话**和技能自己说的一致吗** | 否 | ✅ |
| 行为 | `scripts/run-evals.js` | 技能起来之后，它**干得对吗** | ~$0.24/用例 | ❌ |

**中间缺一层：「照着目录说的说了，技能真的会起来吗」。** 它本该是「技能不触发」这个
最常见抱怨的防线 —— 我试着造了，**造不出来，已放弃**，完整记录见下一节。所以现在
**没有任何东西**能回答那个问题，别以为有。

> **目前只有 `git-commit` 的 6 条用例是「可跑」的。** 另四个带用例的技能
> （`code-reviewer-agent`、`git-smart-update`、`github-issue-autofix-workflow`、
> `repo-analyzer`）需要**外部资源** —— 真实的 GitHub 仓库、真实的 PR、真实的 fork。
> 沙箱里给不出这些，硬跑等于测另一个东西。要么把前置状态改写成可表达的本地文件，
> 要么承认它们只能人工验证 —— 但别装作跑过了。

## 关于技能唤起的实测（2026-09-30）

**想做的事**：造一个「触发测试」—— 用目录承诺的那句话当提示，看技能会不会被唤起。
它是「技能不触发」这个最常见抱怨的唯一防线，而它当时完全空着。

**结果：造不出来，已放弃。** 这一节把过程与证据留下来，免得下一个人重走一遍 ——
也包括**别重新相信那句已经被推翻的话**。

### 做了什么

在本机 Claude Code 2.1.283 上，把技能装进一次性沙箱的 `.claude/skills/`，跑
`claude -p "<目录承诺的那句话>" --output-format stream-json`，再从 transcript 里找
`Skill` 工具调用（其入参形如 `{"skill": "<名字>"}`，实测确认）。

### 观察到什么

沙箱里只装一个技能，提示词固定为 `git-commit` 的 `metadata.example`「帮我提交」：

| 改动 | 结果 |
| --- | --- |
| 无（基线） | 唤起了 `git-commit` |
| `description` 改成「天气查询工具」 | **照样**唤起 `git-commit` |
| **整个删掉 `description` 字段** | **照样**唤起 |
| 目录名与 `name` 都改成 `zz-helper` | **照样**唤起 `zz-helper` |

装 **14 个**技能时也一样：把 `git-commit` 的 `description` 改成无关内容，
「帮我提交」**仍然**路由到 `git-commit`。

### 这说明什么

- **没有观察到 `description` 影响唤起。** 在这套环境里，唤起更像是**按技能名**，
  或者「只要技能能被加载就会被用」决定的。**但机制不明** —— 这里只报告观察，
  不解释成因
- **那个测试是空的**：它对上面每一种改动都返回「通过」。**一个不会失败的测试比没有
  测试更糟** —— 它让人以为验过了（本仓库已经栽过一次同类：`not_contains
  "git add .env"` 的假通过）
- **不能**据此反过来说「`description` 没用」。本次只测了**一个模型、一个 CLI 版本**，
  换个模型很可能不同。原先文档里那句「模型靠 `description` 决定唤不唤起」同样是
  **没有依据的断言** —— 现在两边的依据都不够，所以措辞只能到「未观察到」为止

### 留下的三条规矩

1. **任何断言/测试，先证明它能失败。** 用变异测试：把被测对象改坏，看它是否报红。
   这一轮的触发测试正是在这一步被否掉的 —— 改坏了三种方式，它一次都没红
2. **「验证过了」不等于「验证有效」。** 触发测试起初跑出 **15/15 全绿**，看上去是
   一份漂亮的成绩单；而变异测试证明那份成绩单**不含任何信息**
3. **不要在文档里写未经实测的因果。** 「模型靠 X 决定 Y」这类句子读起来像常识，
   但它**是需要被验证的**。本仓库为这类句子已经栽过两次，见
   `.trellis/spec/maintenance/index.md`「描述外部工具的行为前，先实测」

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
