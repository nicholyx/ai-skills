---
name: maintain-loop
description: 开源项目的维护闭环流程——规划、实现、发布、继续规划的完整循环，以及踩坑沉淀的硬规则。当需要在项目中继续迭代（新功能、修缺陷、补文档）、发布新版本、盘点未完成事项，或有人说「继续」「走维护流程」「按开源流程开发」时使用。
---

# 维护闭环（maintain-loop）

本 skill 描述**任何按开源方式维护的项目**的日常迭代闭环。

**核心闭环**：`规划 → 实现 → 发布 → 继续规划`。每一轮迭代围绕一个主题
（如 v1.4.0 = 某条主线），走完一轮再开下一轮。

**规则部分优先级最高** —— 它们是踩过坑之后沉淀的，且与具体项目无关。
先读「硬规则」一节，再按阶段走。

> 本 skill 假设项目基建已就位（CI、治理文件、仓库自动化、看板）。
> **新项目从零搭建请先用 `oss-bootstrap` skill**，搭完再回到这里。

---

## 第零步：先探测项目（每次会话开始时）

**本 skill 不绑定任何具体仓库。** 下面这些先问清楚，后面的流程才落得下去：

```bash
gh repo view --json nameWithOwner --jq .nameWithOwner     # owner/repo
ls scripts/lint.sh 2>/dev/null || echo "无统一入口"        # 本地检查入口叫什么
git log --oneline -5                                       # 提交信息风格
head -20 CHANGELOG.md 2>/dev/null                          # CHANGELOG 格式与分类
gh label list --limit 30                                   # 标签体系
```

要确定的四件事：

1. **本地检查入口**：`./scripts/lint.sh`？`make check`？`npm test`？（本 skill 后文
   统一写作 `<检查入口>`）
2. **提交规范**：Conventional Commits？有没有校验脚本？类型表在哪（通常在
   `CONTRIBUTING.md`）
3. **CHANGELOG 格式**：Keep a Changelog？分类是哪几类？
4. **分支策略**：`main` 是否受保护？合并方式是 squash 还是 merge？

**项目自己的规范文档优先级高于本 skill**：`docs/MAINTAINER_GUIDE.md`、
`CONTRIBUTING.md`、`.trellis/spec/`（若项目用了 Trellis）。本 skill 是流程框架，
项目文档是细节的事实来源。

### 与 Trellis 的分工（若项目用了它）

Trellis 管「知识与任务上下文」，本 skill 管「GitHub 侧闭环」：

- 编码规范在 `.trellis/spec/`（会话自动注入）
- 任务 PRD 在 `.trellis/tasks/`（`task.py create/start/finish/archive`）
- 会话记忆在 `.trellis/workspace/`
- **Issue / 里程碑 / 看板 / PR / 发布仍走本 skill 的流程**——Trellis 不覆盖这些

一个开发任务 = 一个 Trellis task + 一个 GitHub Issue + 一个分支 PR。
踩坑沉淀的去向：**代码约定** → `.trellis/spec/`；**流程规则** → 本 skill。

---

## 一、盘点现状

每轮开始、或用户问「还剩什么没做」时：

```bash
gh issue list --state open --json number,title
gh api repos/{owner}/{repo}/milestones --jq '.[] | "\(.title): 完成 \(.closed_issues) / 待办 \(.open_issues)"'
gh release list
gh run list --branch main --limit 3
git status --short && git log --oneline -3
```

检查点：本地与远端是否一致、main 的 CI 是否绿、`[Unreleased]` 是否积压了未发布的
改动（**积压即说明「发布」这一步欠着，优先补上**）。

---

## 二、规划

1. **建里程碑**：`gh api repos/{owner}/{repo}/milestones -f title="vX.Y.Z" -f state=open -f description="主题"`
2. **建 Issue**，每项一个，结构固定：
   - **背景**：为什么（引用真实痛点，不写空话）
   - **期望**：做成什么样（带验收标准 checkbox）
   - **入手位置**：涉及哪些文件/函数
   - **难度**：简单 / 中等 / 中偏难，标注「适合首次贡献」
   - `--milestone "vX.Y.Z"`，打上 `bug` / `enhancement` / `documentation` 标签
3. **看板**：Issue 加入 Projects 看板 `gh project item-add <编号> --owner @me --url <issue-url>`
4. **更新 Roadmap Issue**：它是路线图的**单一事实来源**。规划后把新条目写进「计划中」，
   完成后移入「已完成」并带上 Issue 链接。README 的路线图段落同步指向它

---

## 三、实现

- **一个 Issue 对应一个分支、一个 PR**。分支名 `feat/*`、`fix/*`、`docs/*`、`chore/*`
- **动手前先核实 Issue 的前提**。曾有 Issue 断言「重试没有退避」，核实后发现那两条
  路径本来就有指数退避——**前提不成立时，在 Issue 里留言说明并改写范围**，
  而不是硬着头皮实现错误的目标
- 实现中偏离 Issue 计划（如发现了更严重的相关缺陷），**先起一个独立 Issue 记录**，
  再决定顺序

### 设计原则（通用判断，新功能必须延续）

- **排除/筛掉的东西必须可见**：被过滤掉的条目仍应出现在结果里并标注原因。
  **悄悄消失是最危险的**——使用者会以为它被处理了
- **参数被接受却不生效必须告警**：静默失效比报错更危险。但默认值不生效不值得打扰，
  **只在显式传入时告警**
- **不引入新的存储**：需要跨运行状态时先问「已有数据源能不能回答？」
- **凭证不进命令行、不进日志**：写进 600 权限临时文件，退出即删；CI 用环境变量传参
  （命令行参数对同机进程可见，也会被日志语句原样打印）
- **退出码语义要明确且稳定**：例如 `0` 全部成功（含有意跳过）、`1` 参数/环境错误、
  `2` 至少一项失败。**使用者的有意操作（排除）不算失败**

### 测试策略

- **无法端到端构造的场景**：提取生产函数加伪造输入做单测，CI 步骤里内联执行
- **真实路径必须走一遍**：mock 发现不了的问题全在真实路径上。dry-run 覆盖不到真实
  写入/推送路径
- **每条 CI 断言先在本地复现**再提交，包括 `bash -e` 语义下的行为
  （GitHub Actions 的 `run:` 默认 errexit）
- **断言不要匹配状态词本身**。审计类命令的汇总行可能是「最新 0 ｜ 落后 0 ｜ 缺失 0」，
  几个状态词永远都在里面——直接 `grep -q '缺失'` 等于**断言恒真**。要么匹配带图标的
  正文行（`✗ 缺失`），要么断言汇总行的具体数值
- **恒真的断言比没有断言更糟**：它会让人以为这件事已经被守住了

### 修改 YAML 的工具选择

- **无结构的简单替换**（如把 `@v7` 换成 `@<sha>`）→ 脚本批量安全
- **涉及缩进/块结构的插入**（如给 step 加 `with:`）→ **逐个手工编辑**。
  批量脚本会连续算错 `with:` 与 `uses:` 的层级关系弄坏 YAML
- 判断依据：**修改对象是「字符」还是「结构」**
- 每次改完工作流跑 `<检查入口>`（若它包含 zizmor / actionlint）

---

## 四、CI 与合并

- **CI 全绿才合并**：`gh pr checks <N>` 或 `gh pr view <N> --json statusCheckRollup`
- 合并用 `gh pr merge <N> --squash --delete-branch`
- **squash 后 PR 标题会成为提交信息**，所以标题也要符合规范（CI 会校验）
- PR 正文结构：**为什么 → 做了什么 → 关键取舍（含被否掉的方案）→ 测试策略**
- **合并后核对 Issue 是否真的关闭了**。没关就先看 PR 正文在不在——
  `Closes #N` 可能随正文一起丢了（见硬规则）

### CI 故障排查

- **汇总 job 卡 in_progress 而 run 汇总显示 success**：GitHub 状态机不一致。
  `gh pr close <N> && gh pr reopen <N>` 重新触发即可恢复
- **分支保护拒绝合并、提示 not up to date**：`git fetch --prune && git rebase main && git push --force-with-lease`
- **`gh pr merge --auto` 报 Auto merge is not allowed**：仓库未开启该功能，
  改为等检查完成后手动合并
- **`gh run view --log` 的输出混着源码行**：过滤 ANSI 回显（`\x1b[36;1m`）再看实际输出
- **日志只显示 `exit code 2` 却没有任何输出**：多半是 `set -e` 下某条命令失败导致整个
  步骤中断。**故意要失败的命令必须包在 `set +e` / `set -e` 之间**
- **判断成败禁止管道接 `tail`/`head`**（见硬规则）

### 网络抖动是常态

```bash
for i in 1 2 3 4 5; do
  if out="$(<命令> 2>&1)"; then echo "$out" | tail -1; break; fi
  echo "第 ${i} 次失败，重试..."; sleep 5
done
```

注意**非幂等操作的重复执行风险**（见发布的幂等一节）。
所有失败判断都用 `if out="$(cmd 2>&1)"` 形式——**不要用管道**。

- **HTTPS 对 github.com 不通时先试 SSH**。用一个临时 remote 兜底，别动使用者的
  `origin` 配置：`git remote add ssh-origin git@github.com:<owner>/<repo>.git`，
  用完 `git remote remove` 删掉（或事先问过使用者再改 origin）
- **22 端口被网络拦截时，GitHub 官方提供 443 入口**：`ssh.github.com:443`。全局生效的
  做法是在 `~/.ssh/config` 的 `Host github.com` 块里加 `HostName ssh.github.com`
  与 `Port 443`（临时做法是 `GIT_SSH_COMMAND="ssh -o HostName=ssh.github.com -p 443 ..."`）
- **`gh` 只认 `origin`**：分支推在别的 remote 上时 `gh pr create` 报
  `you must first push the current branch to a remote`——**这不是网络问题，重试
  20 次也不会好**。加 `--head <owner>:<branch>` 一次就过。**排查网络类报错前先看
  报错原文说的是什么**

---

## 五、发布

1. 从最新 main 切 `chore/release-vX.Y.Z`
2. 把 CHANGELOG 的 `[Unreleased]` 归入 `[X.Y.Z] - 日期`，段首加一句话概述本轮主题；
   `[Unreleased]` 恢复为空壳
3. 提交信息 `chore(release): 发布 vX.Y.Z`，建发布 PR 并走完整 CI
4. squash merge 后打标签并推送：`git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z`
5. 发布工作流自动生成发布说明（三段式，见 oss-bootstrap）
6. **验证**：`gh release view vX.Y.Z` 确认内容齐全、`gh run list --workflow=release.yml`
   确认成功

### 发布的幂等

网络抖动时 `git push` 可能「显示失败、远端已成功」，重试会重复推送 tag → 触发两次
发布工作流，第二次 `gh release create` 因 Release 已存在而 422。

- **推送 tag 前先用 `git ls-remote --tags origin vX.Y.Z` 确认不存在**，
  避免制造无意义的失败运行
- 发布工作流本身应做「先查后建」：`gh release view` 成功后改走 `gh release edit`

### tag 打错时的修复顺序

删远端 tag（`git push origin :refs/tags/vX.Y.Z`）→ 删错误 release（`gh release delete`）
→ 确认 main 含归档提交 → 重推 tag → 验证 release 内容。

---

## 六、发布后：继续规划

- 更新 Roadmap Issue：本轮条目移入「已完成」
- 建下一版本里程碑与 Issue（回到第二步）
- 看板同步（新 Issue 加入、项目状态与里程碑一致）

---

## 硬规则（与项目无关，优先级最高）

以下每一条都是真实踩坑后的结论。**它们不依赖于任何具体项目。**

### 判断成败：禁止管道接 tail/head

```bash
# ✗ 判断的是 tail 的退出码——命令失败了也报成功
if gh pr merge N --squash | tail -1; then

# ✓ 输出打印放在判断之后
if out="$(gh pr merge N --squash 2>&1)"; then echo "$out"; fi
```

后果实例：一条 `gh pr merge | tail -1` 的判断让「合并没有发生」报成成功，tag 跟着
打在错误的提交上、release 用错误内容生成。**merge / push 之后必须复核远端真实状态**：
`gh pr view N --json state`、`git ls-remote --tags origin vX.Y.Z`。

### 进程模型：值跨进程边界的流向必须与模型对齐

bash 里「值」和「状态」跨过进程边界时，流向必须与进程模型对齐。以下四条是同一个
问题的四个面孔：

- **包装函数不得吞退出码**：`wrapper() { inner; return 0; }` 让 inner 的失败静默消失。
  结尾不写 `return`，或写 `return $?`
- **命令替换是子 shell**：`var="$(fn)"` 里 fn 对全局变量的赋值传不回父进程。
  传出多个值要用全局变量 + 返回码
- **并发子进程对数组的修改传不回父进程**：结果收集用带序号的临时文件
- **`output="$(cmd)"` 的退出码就是 cmd 的退出码**：在 errexit 下 cmd 失败会在
  `echo "$output"` 之前中断整个步骤、**吞掉全部输出**。可能失败的命令要用
  `set +e` 包裹后再捕获

另外：**`find` 的退出码只表示「遍历成功」，与是否匹配无关**（这点和 `grep` 不同）。
按「有没有匹配」判断要看输出是否非空。

### 提交信息与 CHANGELOG

- 提交信息遵循 Conventional Commits。**正文写「为什么」，不只是改了什么**
- 提交前本地跑 `<检查入口>`。注意它**不一定验提交信息规范**——CI 校的是 PR 标题，
  本地无从验证，标题仍要自己按规范写
- **CHANGELOG 每个用户可感知的改动都要记入**，分类固定，不自创。修复类条目写清
  「此前错在哪、有什么后果」
- **往 `[Unreleased]` 插条目，锚点必须校验在正确段落里**。`lines.index('### 新增')`
  找的是全文件第一个——版本刚发布后 `[Unreleased]` 是空壳，第一个「### 新增」在
  **上一个已发布版本**的段下，新条目会错插进已发布段。插入前断言「锚点行号 >
  `[Unreleased]` 行号 且 < 下一个 `## [` 行号」，或先从 tag 版本恢复基准。
  已发布段的改正方法：`git show vX.Y.Z:CHANGELOG.md` 是唯一事实来源，
  条目**按行取出搬进新版本段，不要重打**

### `gh pr create` / `gh issue create` 的正文

写进**临时文件**再用 `--body-file <文件>`，**不要用嵌套 heredoc**：

把 `gh pr create --body-file - <<'EOF'` 放进 `$(...)`、同时外层又给循环加一个 heredoc 时，
`-` 拿到的 stdin 会是空的——**PR 正文静默丢失**，`Closes #N` 一起消失，
症状是「PR 合并了、issue 还开着」。先用 Write 落盘再 `--body-file /tmp/pr-body.md` 不会踩这个。

**合并后养成核对 issue 是否关闭的习惯**：没关就先看 PR 正文在不在。

### bash 编码硬规则（兼容 bash 3.2）

macOS 自带的 bash 是 3.2，CI 上通常是 5.x。差异会导致**只在本地暴露**的缺陷：

- 禁用 `declare -A`、`mapfile`、`wait -n`、`tac`。去重用 `awk '!seen[$0]++'`，
  倒序用数组下标循环
- **空数组的 `"${arr[@]}"` 遍历前必须判 `${#arr[@]}`**。`set -u` 下 bash 3.2 会抛
  unbound variable，bash 4.4+ 才改掉这个展开行为——**而 CI 用的是新版**，
  所以这类缺陷只在本地暴露，表现为「明明成功、脚本却以非零退出」
- **`printf '%s'` 不输出结尾换行**，配 `while IFS= read -r` 会**丢掉最后一段**
  （read 遇 EOF 返回非零）。必须写 `printf '%s\n'`
- 结果文件字段分隔用 `$'\x1f'`（Unit Separator）。tab 是 IFS 空白，
  空字段会让后续字段整体左移
- **`--dry-run` 的输出必须复述真正会执行的参数数组**，不是拿输入重新拼一遍——
  两者看似一样，脱节时 dry-run 就失去了全部意义

### 中文/非 ASCII 内容质量

- **每次编辑中文内容（代码注释、文档、Issue/PR 正文）后，全仓扫描 U+FFFD**：

  ```bash
  python3 -c "
  import pathlib
  bad=[str(p) for p in pathlib.Path('.').rglob('*') if p.is_file() and '.git' not in p.parts
       and chr(0xfffd) in p.read_text(encoding='utf-8', errors='ignore')]
  print(bad if bad else 'OK')
  "
  ```

  多轮迭代中反复出现「写入时混入替换字符」，**这条必须执行，不要省**。
  发现后**逐个修掉再提交**，不要让它在仓库里沉淀
- **批量改中文文档用「按行索引」，别用长中文串做匹配锚点**。长句里混入一个替换字符
  就会静默匹配失败或匹配错位。更稳的做法：先用 `### 标题` 这类含 ASCII 的锚点定位，
  再按行号切片替换，写入前断言新内容不含 U+FFFD。**需要复用已有文本时，
  直接把行取出来用，不要凭记忆重打**
- **注释里不要出现 shellcheck 指令字样**（如 `# shellcheck disable=...` 的裸写法）——
  它会被当成真指令解析，触发莫名的 SC1072/SC1073。改措辞
- **`sed 's/x/y\nz/'` 的 `\n` 在 GNU sed 里是换行、在 BSD sed 里是字面的 `n`**。
  本地跑会静默不生效、断言变成恒真。插入行用
  `{ head -n 1 f; echo '...'; tail -n +2 f; } > tmp && mv tmp f`
- 排错文档保留**报错原文**（使用者拿报错搜索），并写明「什么情况下不该用这个方案」

---

## 快速命令参考

| 操作 | 命令 |
| --- | --- |
| 本地全量检查 | `<检查入口>`（如 `./scripts/lint.sh`） |
| 建里程碑 | `gh api repos/{owner}/{repo}/milestones -f title=... -f state=open` |
| Issue 入看板 | `gh project item-add <编号> --owner @me --url <issue-url>` |
| 合并 PR | `gh pr merge <N> --squash --delete-branch` |
| 发布 | tag `vX.Y.Z` 推送即触发发布工作流 |
| 复核 PR 状态 | `gh pr view <N> --json state,mergedAt` |
| 确认 tag 未推送过 | `git ls-remote --tags origin vX.Y.Z` |
| 乱码扫描 | 见「中文/非 ASCII 内容质量」 |
