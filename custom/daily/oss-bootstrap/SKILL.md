---
name: oss-bootstrap
description: 把一个新项目（或只有代码的裸仓库）落实为符合主流规范的开源项目——CI、治理文件、Issue/PR 模板、仓库自动化、文档体系、看板与发布流程。当用户说「新建开源项目」「给项目加上 CI / 规范」「按热门开源项目的标准搭基建」时使用。基建就位后的日常迭代请改用 maintain-loop skill。
---

# 开源项目 Bootstrap（oss-bootstrap）

把一个裸仓库变成结构完整的开源项目。

## 与 maintain-loop 的关系

- 本 skill：从 0 到 1 搭基建（只做一次，或大改时回来对照）
- `maintain-loop` skill：基建就位后，日常迭代的闭环（规划 → 实现 → 发布）

搭完基建后，一切开发工作都应切换到 maintain-loop 的流程。

---

## 第零步：先探测，再动手

**本 skill 不绑定任何具体仓库。** 动手前先花几分钟把下面四件事弄清楚——
判断得出来的就自己判断，只有真正属于用户的决定才需要确认。

### 1. 项目类型与工具链（决定 CI 里放什么）

```bash
ls -a                                    # 有没有 package.json / pyproject.toml / go.mod
git ls-files | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -20   # 文件类型分布
```

| 形态 | 静态检查 | 测试 |
| --- | --- | --- |
| bash | `shellcheck -x`、`bash -n` | bats，或内联断言脚本 |
| YAML（Actions） | `actionlint`、`yamllint` | — |
| Go | `golangci-lint` | `go test` |
| JS/TS | `eslint`、`tsc --noEmit` | vitest / jest |
| Python | `ruff` | pytest |
| **内容仓库**（Markdown/JSON，无构建） | 结构校验脚本、内部链接校验、编码校验 | 结构断言 |

**没有构建产物不代表没有可检查的东西。** 内容仓库（文档站、技能库、模板集、
配置集）最值钱的三类检查是：**结构一致性**（schema、frontmatter、必填字段）、
**内部引用有效性**（相对链接指向的文件是否真的存在）、**编码卫生**（替换字符、
末尾换行、非法字节序列）。这三类都不需要真的「跑」代码，成本极低而收益很高。

### 2. 仓库现状

```bash
gh repo view --json name,visibility,isFork,parent,hasIssuesEnabled,hasDiscussionsEnabled,licenseInfo,viewerPermission
git log --oneline | wc -l
```

- **是 fork 吗？** fork 仓库的 Issues 默认禁用，且改不了仓库设置。脱离 fork network
  只能在网页端 Danger Zone 操作，**API 做不了**，且不可逆
- **GitHub 认出 LICENSE 了吗？** `licenseInfo.key` 为 `null` 或显示 NOASSERTION，
  多半是许可证文本里被追加了额外段落——**必须保持纯许可证文本**才能被识别
- **仓库是空的吗？** `isEmpty: true` 时分支保护等设置无从谈起

### 3. 权限

```bash
gh auth status    # 需要 repo、workflow；操作 Projects 还需要 project, read:project
```

缺 scope 时请用户执行 `gh auth refresh -s project,read:project`（这一步要用户自己跑）。

### 4. 仓库里现在有什么

```bash
ls -a && git ls-files | awk -F/ '{print $1}' | sort -u
```

**已经存在的治理文件不要重写**，先读一遍再决定补什么。用户可能已经有 LICENSE、
README 或 CLAUDE.md，其中有些判断值得保留。

### 不要一次性问用户一堆问题

语言与现状自己判断。只有这几类才需要确认：**LICENSE 选型**、**是否已有使用者
（决定要不要留破坏性变更的余地）**、**仓库是公开还是私有（决定能否用 Scorecard）**。

### 实施节奏

按阶段推进，每个组件独立分支 + 独立 PR，小批量提交，CI 全绿再合并。分支与合并
规范见 maintain-loop。

---

## 阶段一：地基 —— CI 与提交规范

这是其他一切的前提：先让「每次改动都被自动检查」跑起来。

### 1. CI 工作流，骨架固定为四层

- **静态检查**：按语言选工具，**固定版本号**（可复现）。工具版本写在工作流顶部的
  `env:`，成为唯一真源
- **测试**：冒烟（快、无外部依赖）+ 集成（真实路径，能发现 mock 发现不了的问题）。
  没有容器/网络依赖的检查别硬塞进需要它们的那一层
- **提交信息校验**：Conventional Commits，**用脚本实现**（见下），同时校验
  区间内的提交**与 PR 标题**（squash 后标题即提交信息）
- **`ci-summary` 汇总 job**：`needs: [全部检查]` + `if: always()`，把所有检查汇总成
  一个结果。**分支保护规则只需要盯这一个 check**，增删检查项不用改保护规则

### 2. `ci-summary` 必须从单一真源派生，并自证完整

汇总 job 最常见的失败模式：`needs` / 显示名数组 / 结果变量**三份手工维护的平行
列表**，新增检查时漏改其中一份 —— 于是子 job 失败而汇总仍报成功。

把它写成派生的，并加断言：

```bash
declare -a jobs=("job-id:显示名" ...)

# 断言 jobs 数组与 ci.yml 的 needs 是同一个集合（比集合，不比数量——同长度互换也会漏）
cfg_ids="$(grep -m1 '^    needs: \[' .github/workflows/ci.yml \
           | sed 's/.*\[//; s/\].*//' | tr ',' '\n' | tr -d ' ' | grep . | sort)"
arr_ids="$(printf '%s\n' "${jobs[@]}" | cut -d: -f1 | sort)"
[[ "$cfg_ids" == "$arr_ids" ]] || { echo "::error::汇总表与 needs 不一致"; exit 1; }

for spec in "${jobs[@]}"; do
  id="${spec%%:*}"; var="R_$(printf '%s' "$id" | tr 'a-z-' 'A-Z_')"
  result="${!var:-}"
  # 断言：每个 id 都有对应 env，缺了就是「进了 needs 但没进判据」
  [[ -n "$result" ]] || { echo "::error::needs 里有 $id 但没有 env $var"; failed=1; }
  # skipped 只在确实会跳过的 job 上算良性；别处出现 skipped 说明 if 条件写错了
done
```

**注意 `tr -d '[],'` 会把 `needs:` 这个前缀也切出来当成一个 id** —— 用
`sed 's/.*\[//; s/\].*//'` 只取方括号内的内容。

### 3. 本地统一入口 `scripts/lint.sh`

一条命令跑完 CI 里**本地能跑**的那些检查。目标是「本地绿 == CI 绿」。

```bash
./scripts/lint.sh                 # 跑全部
./scripts/lint.sh --list          # 列出检查项 id 与显示名
./scripts/lint.sh --only links    # 只跑指定项
./scripts/lint.sh --skip zizmor   # 跳过（如需要 docker 的那项）
```

设计要点：

- **四个辅助函数**：`run_check` / `skip_check` / `fail_check` / `note`
- **「工具在但检查跑不起来」算失败，不算跳过** —— 静默跳过与通过无法区分
- **三个计数器 + 两类附加清单**：`PASSED/FAILED/SKIPPED` 不足以表达
  「跑了但不是 CI 同源」（本机工具版本与 CI pin 不一致）与「跑不起来（环境问题）」，
  这两类在结尾单独列出
- **头部注释明确写出「不覆盖什么」**，尤其：**PR 标题**。CI 校验 PR 标题，而标题
  在 PR 建立之前不存在，本地任何入口都验不了。**本地全绿不等于 commit-messages 会绿**
- **入口脚本必须可执行**（`chmod +x`），并在 CI 里断言可执行位

### 4. 「本地过 = CI 过」需要有人守：`lint-selftest` job

`lint.sh` 是 CI 里**被调用为零**的脚本，而它的全部价值就是那条等价保证。加一个 job
断言它的行为，**断言方向两两相反**：

- 给自建内容注入违规 → `lint.sh` **必须失败**，且**失败原因必须是那个违规**
  （不是环境问题 —— 否则断言是恒真的）
- 给只读 vendor 区注入同样的违规 → **必须仍然通过**，且违规**必须出现在输出里**
- 同一份工作区跑两次，输出**逐字节相同**（防不确定性混进判据）
- 在**不含 `.git` 的副本**里跑 → 必须明确报错退出，**不能崩栈**
- `lint.sh --list` 的 id 集合与 `ci.yml` 的 `needs` 集合相同

**做这类测试时，副本必须是真正的 git 仓库**（`git init && git add -A && git commit`）。
`tar --exclude=.git` 复制出来的目录里，所有基于 git 索引的检查器都会 exit 2，
于是「注入违规后失败」这条断言**无论注入什么都成立** —— 恒真。

**插入行不要用 `sed 's/x/y\nz/'`**：`\n` 在 GNU sed 里是换行、在 BSD sed 里是字面的
`n`，本地会静默不生效。用 `{ head -n 1 f; echo '...'; tail -n +2 f; } > tmp && mv tmp f`，
并在注入后 `grep` 确认真的落进去了。

### 5. 提交信息校验脚本 `scripts/check-commit-msg.sh`

四种模式：`--message <文本>`、`--file <路径>`（给 git hook）、`--range <区间>`、
`--last`。类型白名单与 `CONTRIBUTING.md` 的类型表保持一致。

```bash
readonly ALLOWED_TYPES='feat|fix|docs|ci|chore|refactor|perf|test|style|revert|build'
readonly PATTERN="^(${ALLOWED_TYPES})(\([a-z0-9._/-]+\))?!?: .+"
```

必须保留的四个细节（每一个都是踩出来的）：

- **`--range` 用命令替换捕获，不用进程替换**。`done < <(git log ...)` 的退出码传不进
  `while`，「区间无效」与「区间内没有提交」会混成同一种「读到 0 条」，无效区间被
  静默放行成「全部合规（共检查 0 条）」。改成 `log_out="$(git log ...)"` 后，
  命令替换的退出码就是 git 的退出码（实测：ref/SHA 不存在 → 128，区间有效但为空 → 0）
- **空区间退出 0，但措辞避开「全部合规」**。CI 里 `BASE..HEAD` 为空是合法情形
  （例如只有 merge 的 PR），判失败会造假红；但 0 条检查结果什么都没验，
  措辞不能说「验过了」
- **诊断顺序**：先试小写化再判类型，否则 `Feat: xxx` 会被误报成「缺少类型前缀」
- **`while` 用重定向而非管道**：管道会让它落进子 shell，计数器累加传不回父进程

### 6. 最小权限

CI 顶层声明 `permissions: contents: read`；需要写权限的工作流在各自文件里单独声明。
所有 `run:` 块开头 `set -euo pipefail`，多行脚本加 `#!/usr/bin/env bash`。

---

## 阶段二：治理文件与模板

| 文件 | 要点 |
| --- | --- |
| `LICENSE` | 用户选型；**纯许可证文本，不加附加段落**（否则 GitHub 无法识别，显示 NOASSERTION） |
| `CONTRIBUTING.md` | 流程、提交规范、本地检查入口。**类型表必须与校验脚本逐字一致** |
| `CODE_OF_CONDUCT.md` | Contributor Covenant 即可 |
| `SECURITY.md` | 漏洞报告渠道 + **针对本项目的威胁模型**（见下） |
| `SUPPORT.md` | 获取帮助的分流路径：文档 → Discussions Q&A → Bug → 安全报告 |
| `.github/CODEOWNERS` | 兜底 `* @owner` + 敏感路径 + 治理文件本身 |
| Issue 模板 | **用 YAML forms 而非 markdown**；至少分 bug / feature / docs 三类；`config.yml` 关闭空白 Issue 并指向 Discussions |
| `PULL_REQUEST_TEMPLATE.md` | 重点是「**为什么**」（diff 已经说明了「改了什么」）；给「我如何验证」的具体示例，别让人只写「测试通过」 |
| `.gitignore` | 语言惯例 + 编辑器目录。**别依赖使用者本机的全局 gitignore** —— 换机器就会暴露 |
| `.editorconfig` | 编码、换行、缩进。**`*.md` 要关掉 `trim_trailing_whitespace`**（中文文档的行尾双空格是有意义的换行标记） |
| `.gitattributes` | 换行符策略，见下 |
| 多语言 README | 顶部互相链接做语言切换；次要语言注明「完整文档以主语言为准」 |

### `SECURITY.md` 的价值全在「威胁模型」那一节

**不要照抄**。先回答一个问题：**这个仓库持有/分发什么？** 答案不同，威胁模型完全不同。

- **持有凭证的自动化仓库**（部署、发布、同步）：核心风险是「谁能改工作流，谁就能
  读走凭证」。列出手持凭证的 Secrets，说明已采取的防护（仅手动触发、分支保护、
  表达式经 `env:` 中转、CODEOWNERS 强制 review 工作流目录）
- **分发可执行内容的内容仓库**（文档、技能、模板、插件）：核心风险是「恶意或误导性
  内容随一次 pull 直接进入使用者的环境」。说明内容的生效范围、内容必须可审计的要求、
  以及 CI 对内容的校验强度
- **库/SDK**：核心风险是「使用者的输入被当作可信数据」。说明信任边界在哪

然后写出**明确不在威胁模型内**的情况 —— 这一节比列举防护更有价值，它能挡掉
大量「这算不算安全问题」的无效讨论。

### `.gitattributes`：换行符策略，注意 vendor 区

```
# 自建内容：统一 LF。规则锚定到仓库根（/ 开头），避免波及 vendor 目录
/scripts/**      text eol=lf
/custom/**       text eol=lf
/docs/**         text eol=lf
/*.md            text eol=lf

# 二进制
*.png  binary
```

**如果仓库里有 vendored 目录（上游代码、生成产物、锁定版本的内容），不要给它写任何
属性规则。** 实测教训：给 vendor 目录设 `-text` 会**关掉 `core.autocrlf` 的归一化**。
当 index 里是 LF、工作区是 CRLF 时（`autocrlf=input` 的正常状态），关掉归一化会让
「改动 vendor 文件」的 diff 显示成**整文件都变了**——比不加 `.gitattributes` 还糟。

判断方法：`git check-attr text eol -- <vendor 路径>` 应为 `unspecified`。
另外别用 `* text=auto eol=lf` 这种全局规则，它会匹配到 vendor 路径。

---

## 阶段三：仓库自动化

- **labeler.yml**：按改动路径自动给 PR 打标签（`pull_request_target`，因为它不
  checkout PR 代码——**任何 checkout PR 代码的场景禁止用 `pull_request_target`**）
- **welcome.yml**：首次贡献者致意（同样 `pull_request_target` 且不 checkout 代码）
- **stale.yml**：N 天无响应标 stale，再 M 天自动关闭；给高频使用的标签加 exempt；
  `operations-per-run` 限流（避免一次刷屏触发滥用检测）；`schedule` 用**非整点** cron
- **release.yml**：`v*.*.*` tag 触发。发布说明三段式组装，见下
- **dependabot.yml**：每周一次，配 **7 天 cooldown**（新版本有 bug 或 tag 被改投恶意
  代码时，冷却期让它先暴露）；用 `groups` 把同一依赖的 minor/patch 合并成一个 PR

### 三段式发布说明

**人工归纳 + 机器枚举 + 可选润色**，三个输入源各自独立降级、任一缺失都不阻断发布：

1. **CHANGELOG 手写段**（`awk` 以 `^## \[` 为分隔提取本版本）
2. **GitHub 原生 `releases/generate-notes`** —— 它返回自上一个 tag 以来的 PR 列表、
   贡献者、以及 Full Changelog 对比链接。**自己拼这些既麻烦又容易漏**
3. **可选 AI 摘要** —— **配了 key 才启用，任何失败都 `exit 0`**。摘要绝不能成为
   发布的单点故障

组装顺序即优先级：摘要（`> ` 引用块）→ 手写正文 → `---` 分隔线 → 机器清单。
没有 AI key 时走降级路径，发布照常成功。

**tag 过滤器末尾要加 `*`**（如 `v[0-9]+.[0-9]+.[0-9]+*`），否则预发布 tag
根本不触发工作流，预发布逻辑成死代码。预发布版本（tag 含 `-`）不标 latest。

**创建 Release 走「先查后建」**：`gh release view` 成功后改走 `gh release edit`。
网络抖动时 `git push` 可能「显示失败、远端已成功」，重试会重复推 tag、触发两次
工作流，第二次 `gh release create` 因已存在而 422。

### 供应链加固（对标 OSSF Scorecard）

| 加固项 | 做法 |
| --- | --- |
| Actions pin 到 commit SHA | `uses: actions/checkout@<40 位 SHA> # v7`——tag 可移动而 SHA 不可；注释保留版本，Dependabot 的 PR 照常更新 SHA。用 `gh api repos/<owner>/<repo>/commits/<tag> --jq .sha` 查**真实的** SHA，不要编造 |
| checkout 不留凭证 | 每个 checkout 加 `persist-credentials: false` |
| 工作流安全扫描 | CI 加 **zizmor** job（容器按版本 pin，挂载 `:ro`）。**基线保持 0 findings**，豁免集中在 `.github/zizmor.yml`，**每条豁免必须写明可验证的安全依据** |
| CLI 工具按内容固定 | 不用 `apt-get`、不用 runner 预装版本（它们随镜像更新漂移，是「本地绿 CI 红」的常见来源）。下载 release 后 `sha256sum -c` 校验；**release 不提供校验和文件时，把 sha256 写进工作流顶部固定** |
| OSSF Scorecard | `ossf/scorecard-action` + `publish_results: true`（需要 `id-token: write`）。**仅公开仓库**；私有仓库必须设为 `false`。README 加徽章，供应链安全从「自觉做得好」变成「有公开体检报告」 |
| 最小权限 | 每个工作流显式声明 `permissions`，绝不放任仓库默认（宽）权限 |

**先跑 `lint.sh` 看 zizmor 实际报什么，再针对真实告警写豁免。** 不要预先编造豁免
条目——预先创建的空配置或猜测性豁免，恰恰会让人以为「已经评估过了」。

注意：给 step **插入** `with:` 块这类结构调整，逐个手工做。批量脚本会算错缩进层级
弄坏 YAML（判断依据：修改对象是「字符」还是「结构」）。

仓库标签体系补齐：在默认标签外建项目标签，`gh label create <名> --color <色> --description <说明>`。

---

## 阶段四：文档体系

- **README**：面向使用者。结构：这是什么 / 特性 / 快速开始 / 参数速查 / 常见场景
  / 项目结构 / 文档索引 / 路线图 / 贡献 / 许可证
- **`docs/` 四件套**：
  - `USAGE.md`：从零跑起来的全部步骤 + 每个参数详解 + 常见场景
  - `ARCHITECTURE.md`：面向想改代码的人。**写「为什么这样设计」并记录被否掉的方案**
    ——「我们试过 X，因为它会导致 Y，所以选了 Z」比列出目录结构有用得多
  - `TROUBLESHOOTING.md`：现象（**保留报错原文**，使用者拿它搜索）/ 原因 / 解决；
    写明「什么情况下不该用这个方案」
  - `MAINTAINER_GUIDE.md`：维护者手册 + **仓库配置清单** + 项目红线
- **`CHANGELOG.md`**：Keep a Changelog 格式，`[Unreleased]` 段 + 固定六分类
  （新增/变更/弃用/移除/修复/安全），不自创分类

**写完文档要核对两件事**：提到的每个参数/选项/文件是否真实存在、**内部相对链接是否
全部有效**（写个十几行的脚本扫一遍，或直接复用 `lint.sh` 的链接检查）。

文档与代码同步演进：**改了行为不改文档，等于没有改。**

---

## 阶段五：仓库设置（`gh api` / `gh` 命令）

这些不在代码里，要用 API 落实，并且**记录进 MAINTAINER_GUIDE 的「仓库配置清单」**
—— 换机器或重建仓库时需要重做。

```bash
# 分支保护：要求汇总检查通过、严格同步最新、过期评审自动清除、
# 禁止 force push 与删除、必须解决所有对话
gh api repos/{owner}/{repo}/branches/main/protection -X PUT --input - <<'JSON'
{ "required_status_checks": {"strict": true, "contexts": ["CI 总览"]},
  "required_pull_request_reviews": {"dismiss_stale_reviews": true, "required_approving_review_count": 0},
  "enforce_admins": false, "restrictions": null,
  "allow_force_pushes": false, "allow_deletions": false,
  "required_conversation_resolution": true }
JSON
```

- `contexts` 用的是**检查的显示名**（汇总 job 的 `name:`），**不是 job id**
- 单人维护的仓库用 `required_approving_review_count: 0`——不要求别人审批，但 CI 仍是硬门禁
- `enforce_admins: false` 让管理员仍可直接推送，是「软门禁」；要硬门禁就设 `true`
- **分支保护必须在 CI 落地之后才启用**，否则所有 PR 会因缺必需检查而卡死

其余：开启 Discussions（承接使用提问）· Projects 看板 `gh project create` ·
Roadmap Issue 作为路线图**单一事实来源** · 第一个里程碑 vX.Y.Z · 补齐标签。

需要用户手动配置的（Secrets、网页端开关）**列一张清单告知，不要默默跳过**。

---

## 阶段六：验证与首个发布

1. **全流程演练**：开一个真实的小 PR（哪怕是文档），完整走一遍
   分支 → PR → CI → review → squash merge → Issue 自动关闭。
   **基建只有在第一次真实使用时才算真正搭好**
2. **首个 Release**：CHANGELOG 归档 v1.0.0 → 发布 PR → tag 推送 → 验证发布说明三段齐全
3. **交接**：向用户汇报搭建清单（建了什么、在哪、还差什么需要手动配置）

---

## 踩坑记录（与 maintain-loop 互补）

- **`run-name` 里的 `#`**：`run-name: 为 PR #${{ ... }}` 中 `#` 前有空格会被 YAML
  当注释，表达式被吞掉。含 `#` 的行要加引号。yamllint 能发现
- **注释里出现 shellcheck 指令字样会被当成真指令**，触发莫名的 SC1072/SC1073。改措辞
- **`shellcheck` 版本差异**：本地新版不报的告警 CI 旧版会报。所以要么两端同版本，
  要么按内容哈希 pin
- **`set -u` 下空数组**：`"${arr[@]}"` 在 bash 3.2（macOS 自带）会抛 unbound variable，
  bash 4.4+ 才改掉。遍历前先判 `${#arr[@]}`
- **`pipefail` + `$(cmd) || return 1`**：命令输出了有效内容但退出码非零时，会把成功
  当失败。判据应该是「有没有拿到内容」，而不是退出码
- **判断成败禁止管道接 `tail`/`head`**：`if cmd | tail -1; then` 判断的是 `tail`
  的退出码。用 `if out="$(cmd 2>&1)"; then`，输出打印放在判断**之后**
- **`pull_request_target` + checkout PR 代码 = 任意代码以可写 token 运行**，绝对禁止
- 所有用户输入（`workflow_dispatch` inputs 等）经 `env:` 中转进脚本，`${{ }}` 不直接
  写进 `run:`——表达式注入
- **`gh pr create` 的正文用 `--body-file <临时文件>`**，不要用嵌套 heredoc：
  `--body-file - <<'EOF'` 放进 `$(...)` 里、外层又套一个循环时，`-` 拿到的 stdin
  是空的，**PR 正文静默丢失**
- **`gh` 只认 `origin`**：分支推在别的 remote 上时 `gh pr create` 报
  `you must first push the current branch to a remote`。加 `--head <owner>:<branch>`
- **每次编辑中文/非 ASCII 内容后全仓扫描 U+FFFD 替换字符**。多轮迭代中反复出现
  「写入时混入替换字符」，这条必须执行，不要省

---

## 完成标准

- [ ] CI 覆盖静态检查、测试、提交规范，且有一个汇总 check
- [ ] 汇总 check 自证完整（`needs` 与显示名数组是同一集合）
- [ ] 分支保护启用，且只依赖汇总 check
- [ ] `scripts/lint.sh` 可用，且有一个 `lint-selftest` job 守它
- [ ] 治理文件齐全，LICENSE 能被 GitHub 识别
- [ ] labeler / welcome / stale / release / dependabot 全部就位且跑过至少一次
- [ ] 供应链基线达标：`uses:` 全部 pin 到 SHA、checkout 全部 `persist-credentials: false`、
      zizmor 0 findings（豁免有据）
- [ ] docs 四件套 + CHANGELOG 就位，README 的参数与内部链接经过校验
- [ ] 看板、Roadmap Issue、第一个里程碑就位
- [ ] 一个真实 PR 从头到尾走通过，首个 Release 已发布
- [ ] 移交清单已告知用户（需手动配置的 Secrets、网页端开关）

之后的一切迭代，切换到 `maintain-loop` skill。
