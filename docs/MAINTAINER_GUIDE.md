# 维护者手册

写给「要长期照看这个仓库的人」。内容分三块：

- **不在代码里的东西** —— 仓库设置、标签、分支保护。它们换台机器就要重做一遍，
  所以必须写下来
- **项目红线** —— 这个仓库特有的、不能碰的几条
- **维护节奏** —— 每周 / 每月 / 每季度该做什么

> 💡 想改仓库**代码**（检查器、脚本）的人请先看[架构与原理](ARCHITECTURE.md)；
> 这篇管的是「仓库这个实体怎么维护」。

---

## 目录

- [项目定位与边界](#项目定位与边界)
- [仓库配置清单](#仓库配置清单)
- [自动化设施一览](#自动化设施一览)
- [项目红线](#项目红线)
- [维护节奏](#维护节奏)
- [审查 PR](#审查-pr)
- [发布与版本](#发布与版本)
- [应急处理](#应急处理)
- [附：常用命令速查](#附常用命令速查)

---

## 项目定位与边界

先明确这个仓库**是什么**，因为它决定了后面所有取舍：

> 它是一个**个人使用的技能仓库**：`npx skills add nicholyx/ai-skills` 装进本机 AI 环境，
> 让 AI 在处理日常任务时有一套自己沉淀下来的流程。

### 做

- 沉淀自己反复用到的 AI 工作流程（`custom/daily/`）
- 存放手上项目的专用流程（`custom/projects/`）
- 追踪从上游装来的第三方技能，记录它们的来源（`.agents/` + `skills-lock.json`）
- 用一层静态检查保证「技能装上去能加载」

### 不做

- **不做技能市场**。这里不是给别人挑技能的地方，是「我自己的技能顺便开源」
- **不提供行为保证**。`evals/evals.json` 只校验结构，不跑断言 ——
  技能跑起来效果如何是提示词工程问题，机器判不了
- **不修上游技能**。`.agents/` 里的问题一律只 warn，理由见
  [架构与原理](ARCHITECTURE.md#为什么上游的违规只-warn-而不-fail但也不排除)
- **不引入第三方依赖**。检查器只用 Node 标准库，`skills-sync` 零依赖 ——
  一个纯数据仓库要求别人 `npm ci` 是无理由的门槛

---

## 仓库配置清单

**这一节里的东西全部不在代码里**，push 不上去、clone 下不来，换机器重建仓库时要重做一遍。
清单一律给「怎么读现状」的命令，改动用网页端（写错一个字段的代价比点几下鼠标高）。

### 分支保护

要保护的是 `main`，且**只勾选 `CI 总览` 这一个 check**。

CI 有 13 个 job，但 `CI 总览`（`ci-summary`）是唯一挂了分支保护的那个 ——
它汇总其余 12 个的结果。所以增删检查项时**不必回头改仓库设置**，
这是刻意的设计，见[架构与原理](ARCHITECTURE.md#为什么-ci-汇总表是派生出来的而不是手写三份)。

```bash
# 读现状：看不到任何输出 / 报 404，说明分支保护没开
gh api repos/nicholyx/ai-skills/branches/main/protection

# 只看必需检查项
gh api repos/nicholyx/ai-skills/branches/main/protection \
  --jq '.required_status_checks.contexts'
```

建议的设置：

| 项 | 值 | 理由 |
| --- | --- | --- |
| Require a pull request before merging | 开 | 配置类改动值得过一次 CI |
| Require status checks to pass | 开 | 勾 `CI 总览` |
| Require branches to be up to date before merging | 开 | 避免「两个各自绿的分支合起来红」 |
| Require linear history | 开 | 与 squash 合并配套 |
| Do not allow bypassing the above settings | 开 | 否则规则只是建议 |

> ⚠️ **不要勾单个检查项。** 只勾 `CI 总览` 就够，勾了 `frontmatter` 之类的一串，
> 以后加检查项时就得回来补勾 —— 而漏勾的表现是「CI 红了但 PR 仍可合并」。

### 标签体系

```bash
gh label list --repo nicholyx/ai-skills
```

建议至少保留这几组（自动打标签的规则会用到它们）：

| 标签 | 用途 |
| --- | --- |
| `custom` / `agents` | 改动落在哪个区 —— 这一条对 review 最有用，两边的处理方式完全不同 |
| `docs` | 文档改动 |
| `ci` | 检查层、工作流改动 |
| `skill:new` / `skill:update` | 新增技能 / 修改技能 |
| `dependencies` | 依赖更新（由 dependabot 使用） |
| `stale` | 长期无响应，准备关闭 |

### Discussions

```bash
# 看是否开启
gh api repos/nicholyx/ai-skills --jq '.has_discussions'
```

**当前是开启的**，用途是承接**使用提问**（「怎么装」「为什么没生效」），
避免这类内容把 issue 列表淹没 —— `ISSUE_TEMPLATE/config.yml` 与 `SUPPORT.md`
都指向它。

但它的边界要说清楚：**技能请求与排错仍是 issue，不是 discussion**。
它们是可关闭的具体事项，不是开放式讨论 —— 这一点是刻意区分的，
不要让 Discussions 变成第二个 issue 列表。

### Projects 看板

```bash
gh project list --owner nicholyx
```

可选。单人的话，issue 列表 + 标签基本够用；看板的价值在于「有外部贡献者时
让对方知道某事排在什么位置」。

### Secrets 与 Variables

```bash
gh secret list --repo nicholyx/ai-skills
gh variable list --repo nicholyx/ai-skills
```

**当前 CI 不需要任何 secret** —— 这是刻意的：CI 只做静态检查，
`permissions: contents: read`，不写回任何东西、不登录任何外部服务。
如果你发现自己在加 secret，先问一句「这一项真的需要在 CI 里跑吗」。

> ⚠️ 工具版本 pin（`ACTIONLINT_VERSION`、`SHELLCHECK_VERSION`、`YAMLLINT_VERSION`、
> `ZIZMOR_VERSION`、`NODE_VERSION`）**不是** repository variables，
> 它们是 `.github/workflows/ci.yml` 的 `env:`。别放到 Variables 里 ——
> 那会让 `lint.sh` 读不到（它从 ci.yml 里 sed 出来），于是本地与 CI 静默漂移。

### 安全功能开关

```bash
gh api repos/nicholyx/ai-skills --jq '.security_and_analysis'
gh api repos/nicholyx/ai-skills/private-vulnerability-reporting
```

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| Secret scanning | ✅ 开 | 自动识别提交进来的凭证 |
| Push protection | ✅ 开 | 在推送阶段就拦住已知凭证，而不是事后告警 |
| Private vulnerability reporting | ✅ 开 | `SECURITY.md` 与 `ISSUE_TEMPLATE/config.yml` 都指向 `security/advisories/new`。**不开的话那个入口根本不存在**，文档里的链接是死的 |
| Dependabot security updates | ❌ **关** | 见下 |

**为什么关掉 Dependabot security updates**（这一条容易被误认为是疏漏）：

它基于仓库的**依赖图谱**全仓扫描，而且**无法按路径限定**。本仓库唯一的依赖清单
全在 vendor 区（`.agents/skills/*/package.json`、`*/requirements.txt`、
`plugin-creator/assets/templates/**`），自建内容的依赖面是零
（`custom/daily/skills-sync/pyproject.toml` 的 `dependencies = []`）。

于是它只会去改**我们无权改的 vendor 内容** —— 那些改动会在下次
`npx skills update` 时被覆盖，永远合不了。实测：开启后立刻产生了一次失败运行
（`npm_and_yarn in .../mcp-server-typescript` → `dependency_file_not_supported`），
而它盯的正是上游模板里的 `@modelcontextprotocol/sdk`。

`dependabot.yml` 里的 **version updates 仍然有效**（只配了 `github-actions` 生态），
那才是本仓库真正需要 Dependabot 的地方 —— 维护工作流里按 SHA 固定的那些 action。

> 如果将来本仓库真的有了自己的依赖（例如某个技能开始带 `package.json`），
> 再把这个开关打开。**判据是「依赖清单在不在我们自己的目录里」**，
> 不是「GitHub 有没有提示你去开」。

### 换机器重建清单

克隆仓库之后，**代码里的东西都在了**，下面这些要重做：

| # | 事项 | 怎么确认 |
| --- | --- | --- |
| 1 | 分支保护（勾 `CI 总览`） | `gh api repos/nicholyx/ai-skills/branches/main/protection` |
| 2 | 标签体系 | `gh label list` |
| 3 | Discussions 开关（当前**开启**） | `gh api repos/nicholyx/ai-skills --jq '.has_discussions'` |
| 3b | 安全功能开关（见下） | `gh api repos/nicholyx/ai-skills --jq '.security_and_analysis'` |
| 4 | Projects 看板（可选） | `gh project list --owner nicholyx` |
| 5 | 自动化设施对应的仓库权限 | 见下一节 |
| 6 | 本机工具（`shellcheck` / `actionlint` / `yamllint` / `docker`） | `./scripts/lint.sh` 的收尾会列出跳过项与安装方式 |

第 6 项是最常被忘的：`lint.sh` 不会因为工具缺失而失败，
它把那些项列为「跳过」并打印安装命令 —— **跳过不等于通过**，请读那几行。

---

## 自动化设施一览

这些设施都在 `.github/` 下（工作流在 `.github/workflows/`，
配置文件在 `.github/`），**它们的实际清单以仓库里的文件为准** ——
下面记的是每个设施存在的理由，以及它出问题时去哪看。

| 设施 | 它做什么 | 触发时机 |
| --- | --- | --- |
| **labeler** | 按改动路径自动打标签（`custom/**` 打 `custom`、`.agents/**` 打 `agents`、文档打 `docs` ……） | 每次 PR |
| **welcome** | 给第一次开 issue / PR 的人自动回一条欢迎消息，并指出该看哪份文档 | 对方第一次发言 |
| **stale** | 长期没有活动的 issue / PR 先打 `stale`，再过一段自动关闭 | 定时（通常是每天） |
| **release** | 按 tag 生成 Release 与发布说明 | 推 tag 时 |
| **scorecard** | OpenSSF Scorecard 安全评分，结果进 Security 页签 | 定时 + 推 main 时 |
| **dependabot** | 给 GitHub Actions 的版本提更新 PR | 定时 |

### 出问题了去哪看

| 症状 | 去哪 |
| --- | --- |
| 标签打错了 / 没打上 | `.github/labeler.yml` 的路径规则 |
| 机器人回复的措辞不对 | 对应工作流里的消息文本 |
| 不该被关的 issue 被关了 | stale 工作流的 `days-before-stale` / `exempt` 标签 |
| dependabot 提的 PR 一直红 | 那个 action 的新版本可能改了行为 —— 看它的 release notes，别直接合 |
| Scorecard 分数掉了 | Security 页签里点开具体告警；分数下降通常来自新的工作流写法 |

> ⚠️ **自动化设施的权限要单独看。** 这类工作流通常需要
> `issues: write` / `pull-requests: write`（打标签、关 issue）。
> 那是它们的**必要**权限，不要照抄 `ci.yml` 的 `contents: read`——
> 但也别多给：只给这个设施真正用到的那几项。

---

## 项目红线

这几条不是风格偏好，是「破了会出事」。每条都附了原因和正确做法。

### 1. `custom/**` 的内容会被软链进使用者的全局 AI 环境

`custom/` 里的技能会被装进（或用 `skills-sync` 软链进）`~/.claude/skills/`、
`~/.codebuddy/skills/` —— 也就是说，**这些文件里的每一句指令都会在别人的机器上被执行**。

所以自建技能的内容必须**可审计**：读得懂它在让 AI 做什么。
含糊的「你去把该改的都改了」、大段的「无论如何都要执行以下命令」，
在别的仓库里只是坏味道，在这里是**会被执行**的指令。

**正确做法**：写清楚触发条件、执行步骤、边界（什么情况下**不**做）。
`custom/daily/git-smart-update/SKILL.md` 是正面例子：
它把「优先采用远程改进，同时保留本地调试代码」这种判断规则明确写出来，
而不是留给 AI 猜。

### 2. 不改 `.agents/**`

那是 vendor 区，`npx skills update` 会按 `skills-lock.json` 全量替换。
你的修改会连同它的存在一起消失 —— 而且是在某个不特定的未来静默消失。

**正确做法**：fork 上游提 PR，或者复制到 `custom/` 自己维护。
CI 对 `.agents/` 的违规只 warn 不 fail，正是这条红线的直接后果
（修了也没用的东西不该阻塞合并）。

**唯一例外**：`npx skills update` 自己产生的改动。

### 3. 不把凭证、内网地址写进任何技能内容

技能内容会**随仓库公开分发**。写进去就是公开，没有「只是本地用一下」这回事。

这条对 `custom/`、技能的 `README.md`、以及 `evals/evals.json` 里的示例同样适用 ——
eval 用例里的 prompt 和 expected_output 也是公开内容，
「把 `https://internal.corp.example/api` 换成生产地址」这种示例同样是泄露。

**正确做法**：用占位符（`<your-token>`、`https://example.com`），
把真实值放在使用者自己的环境变量或工具的凭证存储里。

### 4. 工作流里 `${{ }}` 一律经 `env:` 中转

```yaml
# ❌ 不要这样
- run: ./scripts/check-commit-msg.sh --message "${{ github.event.pull_request.title }}"

# ✅ 这样
- env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: ./scripts/check-commit-msg.sh --message "$PR_TITLE"
```

`github.event.pull_request.title` 是**攻击者可控内容**（谁都能开 PR、起标题），
直接插进 `run:` 就是脚本注入。经 `env:` 中转之后它只是一个普通的环境变量值。

`ci.yml` 里每一处用到上下文值的地方都遵守这条，新增工作流时照做。

### 5. 外部工具与 action 都要按不可变引用固定

- action 按 **commit SHA** 固定（不是 `@v7`，tag 是可移动的）
- 外部工具按版本 pin + **sha256 校验**（shellcheck 的 release 不提供校验和文件，
  所以按内容哈希固定）
- zizmor 按镜像 tag 固定，挂载只读（`:ro`）、`--no-online-audits` 保证离线且确定
- `persist-credentials: false`，别让 `GITHUB_TOKEN` 残留在 runner 上

---

## 维护节奏

### 每周（约 10 分钟）

```bash
# 上游技能有没有新版本；有就更新、跑检查、提交
npx skills check
npx skills update
./scripts/lint.sh

# 看 open 的 issue / PR，该回的回了
gh issue list --repo nicholyx/ai-skills
gh pr list --repo nicholyx/ai-skills
```

更新上游之后 `git status` 出现大量改动是**正常的** —— 那是这次唯一该提交
`.agents/` 改动的时刻。提交前确认 `local-skills.json` 也同步了：

```bash
node scripts/gen-local-skills.js --write
./scripts/lint.sh --only vendor-lock
```

### 每月（约 30 分钟）

- **读一遍 `.agents/` 的 warn 输出**。上游那 3 处 frontmatter 额外键还在吗？
  有没有新的？新增的 warn 往往意味着上游引入了新键 —— 如果那是合理的键，
  考虑给白名单加一项（改 `scripts/lib/frontmatter.js` 的 `ALLOWED_PROPERTIES`），
  而不是放着让它一直 warn
- **看依赖更新 PR**。dependabot 提的 action 更新要扫一眼 release notes 再合；
  它改动的是 CI 的供应链，不能当普通依赖合
- **跑一次严格的 vendor 检查**，看看上游是不是已经修好了那几处：

  ```bash
  VENDOR_STRICT=1 ./scripts/lint.sh --only frontmatter,evals,hygiene,links,scripts
  ```

  全绿的话，可以考虑把 vendor 违规从 warn 提到 fail（改 `lib/report.js` 的默认分级）
- **清一遍 CHANGELOG**。如果 `[Unreleased]` 攒了很多，考虑发一个版本
- **清理 stale 掉的 issue / PR**，确认没有该留的被关掉

### 每季度（约 1 小时）

- **重新审视「项目定位与边界」**。有没有该归到 `custom/` 的东西一直散落在别处？
  有没有 `custom/daily/` 里的技能其实只对某个项目有意义，该挪去 `custom/projects/`？
- **重跑一次「换机器重建清单」**。分支保护还在吗？标签被删过吗？
  这一项的意义是**验证清单本身是完整的** —— 照着做一遍，缺什么补什么
- **看 Scorecard 分数**。掉了就去 Security 页签看具体告警，
  分数下降通常是新工作流的写法问题（缺权限声明、action 没按 SHA 固定）
- **升级工具 pin**。`ci.yml` 的 `env:` 是唯一的真源，
  升级之后本地与 CI 会一起变（`lint.sh` 从那里读），这正是它这样设计的原因
- **检查 Node 版本**。`NODE_VERSION` 目前是 24；Node 的 LTS 周期走完之后
  检查器的 API 兼容性要重新确认一遍

---

## 审查 PR

### 审查清单

**先看改动落在哪个区** —— 这决定了后面所有条目的严格程度：

| 改动落在 | 处理方式 |
| --- | --- |
| `custom/**` | 最严格：这是会被执行的指令，逐句读 |
| `scripts/**` `.github/**` | 严格：这是保证机制本身，它错了没人知道 |
| `.agents/**` | 只需确认「这是 `npx skills update` 的结果，不是手工塞的」 |
| `docs/**` `*.md` | 正常审查，注意链接与事实准确性 |
| 根配置文件 | 严格：`.gitattributes` / `.gitignore` 的改动影响面很大 |

逐条过：

- [ ] **CI 全绿** —— 而且是 `CI 总览` 绿，不是「大部分 job 绿」
- [ ] **`./scripts/lint.sh` 本地也绿**（本地绿不代表 CI 绿，但本地红一定有问题）
- [ ] **提交信息合规**，PR 标题也合规（标题在本地验不了，这一条只能靠眼看）
- [ ] **有没有碰 `.agents/**`** —— 碰了就要问清楚为什么
- [ ] **新增技能的话**：
  - 放在 `custom/daily/` 还是 `custom/projects/`？（跨项目用 → daily；项目专用 → projects + `prj-` 前缀）
  - `description` 写清楚**什么时候该触发**了吗？（那是 AI 选择技能的唯一依据）
  - 目录名和 `name` 一致吗？kebab-case 吗？
  - 有没有凭证、内网地址、真实域名？
  - 流程里有没有「无论如何都执行」这类没有边界的指令？
- [ ] **改 `scripts/` 的话**：
  - 目标集是不是仍然以 git 索引为准？（别引入 `find` / `fs.existsSync`）
  - 新检查有没有接进 `lint.sh` 的 `CHECKS` 和 `ci.yml` 的 `needs`？
    `lint-selftest` 会断言这一点，但先看一眼更快
  - 输出可复现吗？（不要引入时间戳、不要依赖 `readdirSync` 的顺序）
  - 退出码用对了吗？（0 通过 / 1 有 fail 级问题 / 2 未能执行）
- [ ] **改文档的话**：相对链接指得到东西吗？（`./scripts/lint.sh --only links`）
- [ ] **改工作流的话**：`${{ }}` 经 `env:` 中转了吗？权限给到最小了吗？
  action 按 SHA 固定了吗？

### 给反馈的方式

- 说**为什么**，不只是「这样不好」。这个仓库的每个约定背后都有一段实测
  （见[架构与原理](ARCHITECTURE.md)），你的理由也应该有同等的分量
- 区分「必须改」和「可以考虑」。前者说清楚不改的后果
- 如果对方的方案比现状好，**改现状**。约定不是不能动，
  但要连带把 `ARCHITECTURE.md` 里对应的那段一起改掉 —— 那里记的是理由，
  理由变了却不更新，下一个人就会照着一个过时的理由做决定

### 合并

- 用 **squash 合并**（与「Require linear history」配套）
- squash 后的提交信息 = PR 标题，所以**标题就是最终的提交信息**，写规范点
- 合并后删掉分支

---

## 发布与版本

**这个仓库当前没有版本号，也没有 release tag**（`git tag` 是空的），
`CHANGELOG.md` 只有一个 `## [Unreleased]` 段。这是符合定位的：
它不是一个被依赖的库，使用者用 `npx skills add` 装的是 `main` 上的最新内容。

什么时候需要考虑发版：

- 有外部使用者开始依赖某个具体版本的技能行为
- 想给 `custom/` 的技能做一次「行为冻结」，让人能引用一个稳定版

真要发的时候：

```bash
# 1. 把 CHANGELOG 的 [Unreleased] 归入一个版本号，补上日期
#    分类固定为：新增 / 变更 / 弃用 / 移除 / 修复 / 安全
# 2. 提交
git commit -am "docs: 发布 v1.0.0"

# 3. 打 tag 并推送（release 工作流据此生成 Release）
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

版本号遵循[语义化版本](https://semver.org/lang/zh-CN/)。
对这个仓库来说，**「技能的行为变了」算破坏性变更** ——
使用者依赖的是技能的行为，不是它的文件名。

---

## 应急处理

### CI 突然全红

先分清是「一个 job 红」还是「全部 job 红」：

- **全部红，且报错形似「找不到 X」** → 大概率是工作流本身坏了，
  看 `ci.yml` 最近有没有改过；`actionlint` / `yamllint` 那几项也会红
- **全部红，报「以 git 索引为目标集」** → runner 上的检出行出了问题，
  通常是 `checkout` 步骤失败或浅克隆。看那个步骤的日志
- **只有一项红** → 就是那一项的问题，本地 `./scripts/lint.sh --only <id>` 复现
- **`CI 总览` 报「⚠️ 未纳入判据」** → `ci.yml` 的 `needs` 与 `ci-summary` 的 env
  对不上了，有人加了 job 没加 env

**不要**在没搞清原因时把检查项从 `needs` 里删掉 —— 那会让问题从「红」
变成「看不见」，而看不见是更坏的状态。

### 怀疑凭证泄露

虽然 CI 不用 secret，但技能内容里可能出现凭证。处理顺序：

1. 先确认范围：`git log -S '<泄露的字符串>' --all` 找出是从哪个提交进去的
2. **立刻轮换那个凭证** —— 转公开仓库的历史是删不干净的
   （fork、缓存、CI 日志里都可能有）
3. 再改内容、提交
4. 如果历史上确实有过敏感内容，评估是否需要清理历史
   （`git filter-repo`），但那要所有 fork 配合，成本很高 —— 所以第 2 步才是重点

### 上游技能更新后本地全乱了

`npx skills update` 之后的 diff 是预期行为。如果 diff 的**规模**远超预期
（比如某个技能整个被重写），先确认 `skills-lock.json` 里它的 `source` 没变 ——
变了说明 lock 被人改过。

不满意就回退：`git checkout -- .agents/`，然后去上游看看是不是发了新版本。

---

## 附：常用命令速查

```bash
# ---- 日常检查 ----
./scripts/lint.sh                          # 本地 10 项静态检查
./scripts/lint.sh --list                   # 列出检查项 id 与显示名
./scripts/lint.sh --only links,hygiene     # 只跑某几项
./scripts/lint.sh --skip zizmor            # 本机没 docker 时
./scripts/lint.sh --commits origin/main..HEAD   # 追加提交信息校验

# ---- 严格模式（收紧上游检查）----
VENDOR_STRICT=1 ./scripts/lint.sh
node scripts/checks/frontmatter.js --strict-vendor

# ---- 上游技能 ----
npx skills check                                   # 查更新
npx skills update                                  # 更新（会全量替换 .agents/）
jq -r '.skills | to_entries | sort_by(.value.source)[] | "\(.key)\t\(.value.source)"' skills-lock.json

# ---- 清单生成 ----
node scripts/gen-local-skills.js                   # 打到 stdout，不落盘
node scripts/gen-local-skills.js --write           # 写回 local-skills.json

# ---- 提交信息 ----
./scripts/check-commit-msg.sh --message "docs: 建立文档体系"
./scripts/check-commit-msg.sh --last
./scripts/check-commit-msg.sh --range origin/main..HEAD

# ---- 仓库设置（读现状）----
gh api repos/nicholyx/ai-skills/branches/main/protection
gh label list --repo nicholyx/ai-skills
gh secret list --repo nicholyx/ai-skills
gh variable list --repo nicholyx/ai-skills
gh api repos/nicholyx/ai-skills --jq '.has_discussions'
gh project list --owner nicholyx

# ---- 日常工作 ----
gh issue list --repo nicholyx/ai-skills
gh pr list --repo nicholyx/ai-skills
gh pr checks <PR 编号>
gh run list --repo nicholyx/ai-skills --limit 10
```
