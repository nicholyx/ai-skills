# 贡献指南

感谢你愿意为 `ai-skills` 投入时间！无论是报一个「我看不懂这句话」、修一处文档，
还是提一个新技能，都是对这个仓库的帮助。

本文档面向所有想参与的人，**不需要你是 Claude Code 专家**。如果你在任何一个环节
卡住了，直接在 Issue 里问，这本身就是一种贡献。

---

## 目录

- [行为准则](#行为准则)
- [先读懂这个仓库的边界](#先读懂这个仓库的边界)
- [我能贡献什么](#我能贡献什么)
- [报告问题](#报告问题)
- [提交代码](#提交代码)
- [技能内容规范](#技能内容规范)
- [提交信息规范](#提交信息规范)
- [分支与合并策略](#分支与合并策略)
- [开发环境准备](#开发环境准备)
- [本地验证工作流](#本地验证工作流)
- [代码风格要求](#代码风格要求)
- [Review 流程](#review-流程)

---

## 行为准则

参与本项目即表示你同意遵守 [行为准则](CODE_OF_CONDUCT.md)。请在所有互动中保持专业与友善。

## 先读懂这个仓库的边界

在动手之前，请务必分清仓库里的两块内容 —— 它们的规则**完全相反**：

| | `custom/`（含 `daily/` 与 `projects/`） | `.agents/`（skills、agents、commands） |
| --- | --- | --- |
| 来源 | 我们自己写的 | `npx skills add` 从上游仓库安装的 |
| 追踪 | 无 lock 文件，手工维护 | `skills-lock.json` 记录来源与版本 |
| 更新 | 直接改 | `npx skills update` 覆盖 |
| 能否 PR 修改 | ✅ 欢迎 | ❌ **不要就地改** |

> ⚠️ **`.agents/**` 是 vendored 内容，占了仓库约 97% 的体积（785 个文件）。**
> 对它做任何就地修改，都会在下一次 `npx skills update` 时**全部丢失**。
> 如果你认为上游技能有问题，请提 Issue 说明原因，由维护者向上游仓库反馈。

还有一件事需要提前知道：**`custom/` 里的技能不只影响本仓库。**
它经 `npx skills add` 落到 `~/.agents/skills/`，再由
[skills-sync](custom/daily/skills-sync/SKILL.md) 软链进 `~/.claude/skills` 与
`~/.codebuddy/skills` —— **对使用者的全局 AI 环境生效**。
所以请不要提交自己都没在本机验证过的技能内容。

## 我能贡献什么

你不必会写技能也能帮上忙：

| 类型 | 举例 |
| --- | --- |
| 🐛 报 Bug | 技能没被触发、触发了但做错事、`./scripts/lint.sh` 在你机器上失败 |
| 📖 补文档 | 你把某段说明读了三次才懂 —— 那段说明就该改 |
| 💡 提需求 | 希望有一个解决某类重复劳动的技能 |
| 🧪 反馈使用体验 | 某技能总在你不想它触发的时候触发 |
| 🔧 提代码 | 新增或修正技能、修检查脚本、改 CI |
| ⭐ 点 Star / 分享 | 让更多被重复劳动困住的人找到这里 |

## 报告问题

提 Issue 前请先做两件事：

1. 搜索[已有 Issue](https://github.com/nicholyx/ai-skills/issues)，避免重复
2. 先看 [SUPPORT.md](SUPPORT.md) 里的分流顺序

我们提供了三种 Issue 模板，请按场景选择：

- **Bug 报告** —— 技能行为异常、脚本报错、实际行为与文档不符
- **功能请求** —— 希望新增的技能或能力
- **文档问题** —— 文档写错了、看不懂、缺内容

> 🔒 **安全类问题请勿提公开 Issue**，请走 [SECURITY.md](SECURITY.md) 中的私有渠道。
> 这包括「技能诱导模型执行危险命令」「技能在读取本地敏感文件」这类可疑内容 ——
> 在本仓库，它们是安全问题，不是普通 Bug。

### 一个好 Bug 报告长什么样

```text
标题：git-smart-update 在有未提交改动时不走 stash 分支，直接报错退出

模块：custom/daily 技能

环境：Claude Code 2.x / macOS 15.5 (Apple Silicon)
      install_method: npx skills add nicholyx/ai-skills --full-depth
      sync_target: ~/.claude/skills（经 skills-sync 软链）

期望：按 SKILL.md 描述，应先 stash 本地改动，更新完再恢复
实际：报错 "error: cannot pull with rebase: You have unstaged changes." 后退出

复现：对模型说「帮我更新代码」必现，前提是工作区有未提交改动
补充：先用 git stash 手动处理再触发就正常，怀疑是 stash 分支没走到
```

关键是把 **触发方式**、**完整报错**、**复现条件** 三样给全。

## 提交代码

### 整体流程

```text
Fork（若你无写权限）
   ↓
基于 main 创建分支  →  git switch -c docs/xxx
   ↓
改动 + 本地自测
   ↓
提交（遵循约定式提交）
   ↓
推送并开 PR（PR 模板会自动出现，请认真填）
   ↓
CI 自动检查（不通过会在 PR 上标红，可在本地提前跑同样的检查）
   ↓
维护者 review，可能请你改
   ↓
合并 🎉
```

### PR 的基本要求

- **一个 PR 只做一件事**。修 bug 和改文档请分开提，review 会快很多
- 描述里写清楚 **为什么**，而不只是 **改了什么**（diff 已经说明了后者）
- 关联相关 Issue，例如 `Closes #12`
- **不要修改 `.agents/**`** —— 这类 PR 会被直接关闭，并请你改提 Issue
- 保持 PR 可被 review 的规模。本仓库大量改动是「改一个技能的说明」，
  单个 PR 通常应该只动一个技能目录；跨技能的大范围改动请先开 Issue 讨论

## 技能内容规范

一个技能就是 `custom/daily/<技能名>/` 或 `custom/projects/<技能名>/` 下的一个目录，
其中必须有 `SKILL.md`，可选 `reference/`、`evals/`、`scripts/` 等。

### 目录命名

- `custom/daily/` —— 通用技能，直接用功能名，例如 `git-commit`、`daily-report`
- `custom/projects/` —— 项目专用技能，**必须加 `prj-` 前缀**，
  例如 `prj-agent-platform-e2e-test`

### `SKILL.md` 的 frontmatter

CI 会严格校验下面这些规则（`custom/**` 违规是 **fail 级**，会让 PR 变红）：

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `name` | ✅ | kebab-case（小写字母、数字、连字符）；**必须与所在目录名完全一致**；≤ 64 字符 |
| `description` | ✅ | 不能为空；**不能含尖括号 `<` 或 `>`**；≤ 1024 字符 |
| `license` | | |
| `allowed-tools` | | |
| `metadata` | | |
| `compatibility` | | ≤ 500 字符 |

除上表之外的顶层键一律 **fail** —— 包括写错名字的、从别处抄来的。
另外：frontmatter 里出现**重复的顶层键**也是 fail（YAML 会静默取后者，是个隐蔽的坑）。

```yaml
---
name: my-skill
description: Use when you need to do X, typically triggered by "帮我做 X"
---
```

`description` 的写法值得多花点心思：**它是技能唯一的触发依据**。写清楚「什么时候用它」，
比写清楚「它是什么」重要得多。

### `evals/evals.json`（可选，但推荐）

如果一个技能有 `evals/` 目录，就必须有 `evals.json`，且结构如下：

```json
{
  "skill_name": "my-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "帮我做 X",
      "expected_output": "应当产出 ...",
      "files": [],
      "assertions": [{ "type": "contains", "value": "..." }]
    }
  ]
}
```

- `skill_name` **必须等于技能目录名**（技能改名后这里最容易漏改）
- `evals` 必须是非空数组，每项要有数字 `id` 与非空 `prompt`
- 缺 `expected_output` / `files` / `assertions` 只提示不判错 ——
  「这个用例该断言什么」是人的判断，机器不该替你决定

> 检查器**只校验结构，不跑断言**。断言写得对不对，机器判不了，靠 review。

### 行为要求

- 技能里出现的命令，应当是**可解释、可预期**的；不要写「执行这段脚本即可」却不说明它做什么
- 不要写会静默修改使用者仓库之外内容的指令（例如未经确认就 `rm -rf`、写 `~/.zshrc`）
- 涉及删除、覆盖、推送的操作，应在技能里明确写出「先向用户确认」

## 提交信息规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)，
CI 会校验提交信息格式。**好消息是：用错格式 CI 会告诉你哪里错了。**

### 格式

```text
<类型>(<范围>): <简短描述>

[可选的正文，说明为什么这么改]

[可选的脚注，例如 BREAKING CHANGE 或 Closes #12]
```

### 允许的类型

下表与 `scripts/check-commit-msg.sh` 里的 `ALLOWED_TYPES` **逐字一致**：

| 类型 | 用途 |
| --- | --- |
| `feat` | 新功能、新技能 |
| `fix` | 修复 Bug |
| `docs` | 只改文档 |
| `ci` | 只改 CI / 工作流 |
| `chore` | 构建流程、依赖、杂项 |
| `refactor` | 重构（不改变外部行为） |
| `perf` | 性能优化 |
| `test` | 增删测试 |
| `style` | 格式调整（不影响逻辑） |
| `revert` | 回滚 |
| `build` | 构建产物与打包配置 |

### 范围（scope）建议

常用的有 `custom`、`projects`、`ci`、`scripts`、`docs`。范围也可以用具体的技能名
（例如 `skills-sync`），因为它同样是全小写的 kebab-case。

范围的字符集被限制为**小写字母、数字、`.`、`_`、`/`、`-`** ——
所以 `custom/daily` 是合法的，`Custom`、`custom daily` 不是。

### 示例

```bash
# ✅ 好
feat(custom): 新增并接入 oss-bootstrap 技能
fix(skills-sync): 修复失效软链未被清理的问题
docs: 补充 custom/projects 的命名约定
ci: 引入技能 frontmatter 校验

# ❌ 会被 CI 拦下
update                    # 缺少类型
修复bug                   # 缺少类型与括号
feat:支持新技能           # 冒号后需要空格
Feat(custom): xxx         # 类型必须小写
feat(Custom): xxx         # 范围必须小写
```

## 分支与合并策略

- `main` 是**唯一长期分支**，始终处于可用状态
- 所有改动通过 PR 进入 `main`，**不接受直接向 `main` 推送**
- 功能分支从 `main` 拉出，合并后即删除
- 本项目使用 squash merge 保持 `main` 历史线性整洁

分支命名建议（不强制，但便于识别）：

| 前缀 | 用途 |
| --- | --- |
| `feat/` | 新技能或新功能 |
| `fix/` | 修 bug |
| `docs/` | 文档 |
| `ci/` | 工作流与检查脚本 |
| `chore/` | 杂项 |

## 开发环境准备

本仓库**没有编译过程**，也不需要为它安装运行时依赖 —— 它本质是一组 Markdown
技能加几个 Node / Shell 检查脚本。

你需要的是：

```bash
# 必需
git --version          # 任意较新版本
node --version         # 20+（检查脚本是零依赖的 Node 脚本）

# 可选但强烈推荐（提交前本地自查，避免 CI 返工）
brew install actionlint shellcheck yamllint    # macOS
# zizmor 走 docker 镜像，装了 Docker 就与 CI 完全同源
```

克隆并设置：

```bash
git clone https://github.com/nicholyx/ai-skills.git
cd ai-skills
```

**本地自测技能**（推荐，能发现 lint 查不出的问题）：

```bash
npx skills add . --full-depth     # 安装到 ~/.agents/skills
uv run --directory ~/.agents/skills/skills-sync python sync.py \
  --target claude --type skills   # 软链到 ~/.claude/skills
# 然后在 Claude Code 里实际用提示词触发一次你改的技能
```

## 本地验证工作流

### 一键自查（推荐）

仓库提供了统一入口，跑一次覆盖 CI 里的**静态检查**：

```bash
./scripts/lint.sh
```

它依次执行 10 项检查：技能 frontmatter、evals.json 结构、上游 lock 一致性、
编码与 JSON、相对链接、脚本语法、shellcheck、actionlint、yamllint、zizmor。
任何一项失败都会以非零码退出，并告诉你具体是哪个文件哪一行。**提交前跑一次，
能省掉一轮 CI 返工** —— 提交信息与 PR 标题那一项除外，见下。

想只跑其中几项：

```bash
./scripts/lint.sh --list                       # 看全部检查项 id
./scripts/lint.sh --only links,hygiene         # 只跑指定的
./scripts/lint.sh --skip zizmor                # 跳过需要 docker 的那项
./scripts/lint.sh --commits origin/main..HEAD  # 顺带校验这段区间里的提交信息
```

> ⚠️ **本地全绿不等于 CI 会绿。** CI 的 `commit-messages` job 校验的是 PR 里的提交
> **与 PR 标题**，而标题在 PR 建立之前根本不存在 —— 本地任何入口都验不了它。
> 加了 `--commits` 也只补齐前半段，**标题仍然验不了**。
> 所以 PR 标题请照[提交信息规范](#提交信息规范)自己写一遍再提交。

### 这项检查覆盖什么、不覆盖什么

| | 内容 |
| --- | --- |
| ✅ 覆盖 | 技能 frontmatter、evals.json 结构、上游 lock 一致性、编码与 JSON、相对链接、脚本语法、shellcheck、actionlint、yamllint、zizmor |
| ❌ 不覆盖 | PR 标题；上游 `.agents/**` 的实质违规；外链可达性；技能的行为正确性 |

逐条解释后面三项：

- **上游 `.agents/**` 的实质违规只 warn，不计入退出码。** 那是 `npx skills add`
  装来的内容，任何自动修复都会在 `npx skills update` 时丢失。所以本地全绿时，
  上游仍可能有若干 frontmatter 额外键之类的告警 —— **这是设计，不是漏检**。
  但上游一旦出现非法 UTF-8 或坏 JSON 这类「技能会直接加载失败」的问题，依然会 fail。
- **外链可达性不查。** 只校验相对链接，`http(s)` 一律不探网 —— 探网会让 CI
  因对方限流或改版而假红，这条检查的价值抵不上那种不稳定。
- **技能的行为正确性不查。** `evals.json` 只查结构，不跑断言。
  「这个技能在该触发时会不会触发」目前只能靠人实际用一遍。

另外，**GitHub 侧设置**（分支保护、标签、Discussions 是否开启）也不在本地检查范围内。

### 关于相对链接

链接检查器会校验 `custom/**`、`docs/**`、`.github/**` 与根目录 `*.md` 里的
**相对链接**，且判存在的依据是 **git 索引**，不是文件系统。两个后果：

- 新写的链接目标必须先 `git add`，否则本地会报「不在 git 索引里」
- 目标文件路径的**大小写必须完全正确**（macOS 上文件系统不区分大小写，Linux runner 区分）

## 代码风格要求

### 通用

- 一律使用 **LF** 换行、**UTF-8** 编码、文件末尾留空行（已由 [.editorconfig](.editorconfig) 约束）
- YAML 使用 **2 空格**缩进，**不要用 Tab**
- 中英文混排时，中英文之间加一个空格；标点用中文全角
- **不要写入 U+FFFD 替换字符** —— 它是「中文在上一次编码转换里被写坏」的化石，
  `hygiene` 检查会把它当 fail 拦下

### 技能（`custom/**/SKILL.md`）

- 见上面的[技能内容规范](#技能内容规范)
- 说明面向「第一次用这个技能的人」写，不要预设读者了解你的项目背景

### 文档（`*.md`）

- 命令、路径、代码标识符使用行内代码格式
- 大段命令使用带语言标注的代码块
- 相对链接指向仓库内的真实文件；指向目录请用行内代码而不是链接

### 脚本（`scripts/**`）

- Node 脚本保持**零依赖**（本仓库没有 `package.json`，也不要引入）
- Shell 脚本通过 `shellcheck`；需要禁用某条规则时，必须在该行上方写明原因
- **检查器的目标集一律以 git 索引为准，不要递归扫描文件系统** —— 详见
  `scripts/lib/gitfiles.js` 的说明

## Review 流程

### 提交 PR 之后

1. **CI 自动跑**（约 1 分钟内）—— 10 项静态检查 + 提交信息校验
2. **维护者 review** —— 通常几天内；如果一周没动静，欢迎在 PR 里 @ 维护者催一下
3. **合并** —— 维护者会使用 squash merge

### 作为作者，你可以期待

- 具体的、可执行的 review 意见，而不是「这里不好」
- 如果方案有更优解，我们会说明原因，而不是直接改掉你的内容
- 如果 PR 长期无人处理，那一定是维护者疏忽，请务必催促

### 作为 reviewer，我们遵循

- 对**内容**严格，对**人**友善
- 区分「必须改」与「建议」—— 前者会明确说清楚
- 首次贡献者会得到更详细的引导

### 什么样的 PR 会被拒绝

- 修改 `.agents/**` 下的上游内容（会被 `npx skills update` 覆盖）
- 与仓库定位无关（本项目是个人技能仓库，不做技能市场、不做通用 Agent 框架）
- 引入运行时依赖或构建步骤（例如为检查脚本加 `package.json`）
- 在技能内容里写入未加确认的破坏性命令
- 只改格式、制造大量无意义 diff

---

再次感谢你的参与。哪怕只是指出一句看不懂的说明，这个仓库都会因为你而更好一点。💛
