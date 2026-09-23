# 检查器与 CI 规范

自动化检查分两层：`scripts/checks/*.js`（六个零依赖 Node 检查器）、
`scripts/lint.sh`（本地统一入口）、`.github/workflows/ci.yml`（CI）。

## 退出码语义（全仓统一，不可协商）

| 码 | 含义 | CI 行为 |
| --- | --- | --- |
| 0 | 检查执行完成，无 fail 级问题（可能有 warn） | success |
| 1 | 检查执行完成，存在 fail 级问题 | failure |
| 2 | **检查未能执行**（目标集为空 / 不在 git 仓库内 / 输入非法） | failure |

**2 单独成一类**：读者要能分清「你要改代码」和「你要装东西 / 换个目录再跑」。
CI 那边 1 和 2 都是红，一样不放过。`lint.sh` 把 2 单列为「以下检查未能执行
（多半是环境问题）」，与「以下检查未通过」分开显示。

## 分级：self fail / vendor warn

| tier | 范围 | 分级 |
| --- | --- | --- |
| `self` | 除 `.agents/` 之外的一切 | fail |
| `vendor` | `.agents/**` | warn（`VENDOR_STRICT=1` 可提升为 fail） |

**vendor 不设 fail**：任何自动修复都会在 `npx skills update` 时丢失，设成 fail
等于让 CI 永久红。

**vendor 也不排除**：排除等于看不见。上游下次引入「缺 `name`」或「description
含控制字符」的技能，恰恰会让它在 Claude Code 里加载失败 —— 而本仓库的唯一用途
就是「这些技能能被加载」。warn 的代价只是每次多 3 行输出。

本地与 CI 采用**同一套分级**，所以「本地绿 = CI 绿」在分级语义上仍然成立。

风格类检查（BOM、末尾换行）只对 self 生效：上游有 20 多处文件缺末尾换行、6 个
`.xsd` 带 BOM，每次运行都报一遍只会训练读者忽略输出。

同样的理由，`.trellis/.version` 与 `.trellis/.template-hashes.json` 也被豁免 ——
它们是 **trellis 自己写的记账文件**，会在 `trellis update` 时被重写。用本仓库的风格
约定约束它们，等于给未来的例行维护埋一个「CI 突然变红」。**只豁免风格检查**，
正确性检查（UTF-8、U+FFFD、JSON 可解析）照常执行。

## 目标集一律来自 git 索引

**永远用 `git ls-files` 枚举，不要 `find` / `readdir` 递归。** 三个理由：

1. `.agents/skills/deep-research/.gitignore` 含 `*.json` + `!schemas/*.json`。
   递归扫描会看到 CI 的干净 clone 里根本不存在的文件 —— 必现的「本地红、CI 绿」
2. `custom/daily/skills-sync/.venv/` 与 `.DS_Store` 从未被追踪，不该进目标集
3. 判断「链接目标是否存在」必须查索引而非 `fs.existsSync`：后者在大小写不敏感的
   APFS 上会对 `Foo.md` 命中真实的 `foo.md`，在 Linux runner 上则不会

技能枚举还多一条：**只认三个父目录的深度 1 子目录**，不能用通配 pathspec 枚举
`SKILL.md`。`plugin-creator/assets/templates/skill/SKILL.md` 是一个**模板资产**，
它的 `name: skill-template` 与目录名 `skill` 不符，捞进来会制造无法修复的假失败。

## 写一个新检查器

```js
#!/usr/bin/env node
"use strict";
const { Report } = require("../lib/report");
const { trackedFiles, tierOf } = require("../lib/gitfiles");

const report = new Report("检查项显示名");

const files = trackedFiles();
if (files.length === 0) report.abort("目标集为空，说明原因");  // 退出 2

for (const rel of files) {
  report.at(tierOf(rel), rel, 0, "问题描述");   // 按 tier 自动分级
}
report.info("扫描了 N 个文件。");               // 结尾的事实性说明
report.finish();                                // 0 或 1
```

- 复用 `scripts/lib/` 的 `gitfiles` / `report` / `frontmatter` / `manifest`，
  **不要各写一份**
- 用 `report.at(tier, ...)` 让分级由 tier 决定；`report.warn` / `report.fail` 只在
  「与 tier 无关」时用（如 JSON 语法错误没有「上游风格」的解释空间）
- 新检查器要被 `lint.sh` 的 `CHECKS` 数组收录，**并在 `ci.yml` 里有一个同名 job**
  —— `lint-selftest` 会断言两者集合相同，防止「加了本地检查却忘了接进 CI」

## lint.sh 与 CI 的关系

- `lint.sh --list` 输出的 id 与 `ci.yml` 各 job 的 id **逐字对应**
- 工具版本 pin 的**唯一真源**是 `ci.yml` 的 `env:`，`lint.sh` 用 `ci_env()` 抽取，
  不写第二份。本机版本与 pin 不一致时记入「非 CI 同源」清单并在结尾单列 ——
  那不是失败，而是「这个通过的可信度与 CI 的不同」
- **它不覆盖 PR 标题**。CI 的 `commit-messages` job 校验 PR 里的提交与 PR 标题，
  而标题在 PR 建立之前不存在。`--commits <区间>` 只补齐前半段

## 中文内容的坑（都真实踩过）

**每次编辑中文内容后必须全仓扫描 U+FFFD**：

```bash
python3 -c "
import pathlib
bad=[str(p) for p in pathlib.Path('.').rglob('*') if p.is_file() and '.git' not in p.parts
     and chr(0xfffd) in p.read_text(encoding='utf-8', errors='ignore')]
print(bad if bad else 'OK')
"
```

- **不要在会被检查的文件里写 U+FFFD 的字面量**。`hygiene.js` 检测替换字符时用的是
  `"\uFFFD"` 转义 —— 写字面量会让这个检查器把自己报成违规
- **注释里不要出现 shellcheck 指令字样**。它会被当成真指令解析，触发莫名的
  SC1072/SC1073（已踩过一次）
- **批量改中文文档用「按行索引」，别用长中文串做匹配锚点**：长句里混入一个替换
  字符就会静默匹配失败或错位
- **`sed 's/x/y\nz/'` 的 `\n` 在 GNU sed 里是换行、在 BSD sed 里是字面的 n。**
  需要插入行时用 `{ head -n 1 f; echo ...; tail -n +2 f; } > tmp && mv tmp f`，
  否则本地静默不生效、断言变成恒真

## 供应链基线

`zizmor` 基线 0 findings，豁免集中在 `.github/zizmor.yml`，**每条豁免必须写明可
验证的安全依据**。新增 `uses:` 引用必须 pin 到 commit SHA + 注释版本号；所有
checkout 保持 `persist-credentials: false`。慎用 `pull_request_target` —— 只有在
**不 checkout PR 代码**时才可接受，且必须在 `.github/zizmor.yml` 里说明理由。
