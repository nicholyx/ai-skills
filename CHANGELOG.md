# 更新日志

本文件记录本项目的所有重要变更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### 新增

- **建立仓库地基：`.gitignore` / `.gitattributes` / `.editorconfig` / `.yamllint`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。此前这是一个裸仓库，没有任何一层配置。`.DS_Store` 与 `custom/daily/skills-sync/.venv/` 之所以没被提交进来，靠的是使用者本机的全局 gitignore —— 换一台机器、换一个贡献者就会立刻泄漏进来。
  - `.gitattributes` 的规则**全部锚定到仓库根**，刻意不写任何匹配 `.agents/**` 的规则：上游 vendor 区有 17 个文件的工作区副本是 CRLF、而索引里是 LF，那是 `core.autocrlf=input` 的正常结果。加 `.agents/** -text` 会关掉这套归一化，改动 vendor 文件时出现「整文件都变了」的假 diff，比不加 `.gitattributes` 还糟
- **六个零依赖 Node 检查器**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）：技能 frontmatter、`evals.json` 结构、上游 lock 一致性、编码与 JSON、相对链接、脚本语法。
  - 目标集一律来自 **git 索引**而不是 `find`：`deep-research/.gitignore` 含 `*.json`，递归扫描会看到 CI 干净 clone 里根本不存在的文件，制造一个必现的「本地红、CI 绿」
  - 判「链接目标是否存在」也查索引而不是 `fs.existsSync`：后者在大小写不敏感的 APFS 上会对 `Foo.md` 命中真实的 `foo.md`，在 Linux runner 上则不会
  - frontmatter 用自研的**受限**解析器（不引 PyYAML，也不引入 `package.json`），并补上官方 `quick_validate.py` 缺的四项：CRLF 归一化、BOM 剥离、块标量支持、重复顶层键检测
- **本地统一校验入口 `scripts/lint.sh` 与提交信息校验 `scripts/check-commit-msg.sh`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。`lint.sh` 一条命令跑完本地能跑的静态检查（`--list` / `--only` / `--skip` / `--commits`），工具版本 pin 从 `.github/workflows/ci.yml` 的 `env:` 读出，不写第二份。
  - 工具缺失一律记为**跳过**并显式列出（不计入通过）；工具在但检查跑不起来（退出码 2）算失败不算跳过 —— 静默跳过与通过无法区分
- **CI 检查层 `.github/workflows/ci.yml`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。13 个 job：10 个静态检查 + 提交信息规范 + `lint.sh` 自测 + 汇总。
  - 分支保护只勾 `CI 总览` 一个 check，增删检查项时不必回头改仓库设置
  - 汇总表的 job 列表由 id **机械推导**，并有三条断言守着「进了 `needs` 却没进判据」这个缺陷
  - `lint-selftest` 用五条方向相反的断言守「本地过 = CI 过」，包括在无 `.git` 的目录里必须明确拒绝执行而不是崩溃
- **上游 vendor 区的分级策略**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。`.agents/**` 的违规只 warn、不计入退出码；但也不排除 —— 排除等于看不见，上游引入「缺 `name`」这类问题会让技能直接加载失败，而本仓库的唯一用途就是「这些技能能被加载」。需要严格检查时用 `VENDOR_STRICT=1`，不必改代码。

### 变更

- **`scripts/check-local-skills.{js,sh}` 由 `scripts/gen-local-skills.js` 与 `scripts/checks/vendor-lock.js` 取代**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。原脚本同时兼着「生成器」与「校验器」两个身份，一个想写文件、一个永远 `exit 0`，互相破坏。现在职责分开：生成器默认只打 stdout（要 `--write` 才落盘），一致性由检查器断言。
  - 生成物不再含时间戳，因此对同一份工作区逐字节确定，「生成物与生成器一致」这条判据才成立

### 移除

- **`scripts/check-local-skills.js` 与 `scripts/check-local-skills.sh`**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。由上面两个脚本取代。

### 修复

- **修正三处既有违规**（[#1](https://github.com/nicholyx/ai-skills/pull/1)）。它们在此之前没有暴露，是因为仓库还没有任何检查层；一旦接上 CI 就会立刻变红。
  - `github-issue-autofix-workflow` 仍在用改名前的技能名：`evals/evals.json` 的 `skill_name`、`README.md`、`SKILL.md` 三处都要跟着改。`skill_name` 与目录名不符时，按名字索引 eval 用例的工具会找不到它们
  - 4 个自建文件末尾缺换行：`git-sync-upstream/SKILL.md`、`github-issue-autofix-workflow/README.md`、`github-issue-autofix-workflow/SKILL.md`、`github-issue-autofix-workflow/evals/evals.json`
  - `local-skills.json` 里的 `generatedAt` 被移除。它是这份文件永远无法用作 diff 判据的唯一原因（实测重跑后整个文件恰好差这 1 行），而它本来就是冗余的 —— 文件什么时候生成的，`git log` 已经记着了

---

## 版本说明

- `[Unreleased]` 段由维护者在合并 PR 时更新；每个分类下按「改了什么 → 为什么」写，被否掉的方案也记进去，避免下次重新踩一遍
- 每个版本的分类固定为：`新增` / `变更` / `弃用` / `移除` / `修复` / `安全`，**不自创分类**；某一类没有内容就整段省略
- 破坏性变更在条目里用 **BREAKING** 标出。对这个仓库来说，「技能的行为变了」算破坏性变更 —— 使用者依赖的是技能的行为，不是它的文件名
- 目前还没有发布过版本（没有 tag），所以这里只有 `[Unreleased]` 一段

[Unreleased]: https://github.com/nicholyx/ai-skills/commits/main
