# 获取帮助

遇到问题不知道去哪问？先看下面这张分流表，越靠上的越快。

| 我遇到的是…… | 去哪 |
| --- | --- |
| 技能**没被触发**，或在不该触发的时候触发 | 先看该技能 `SKILL.md` 的 `description`；仍不清楚 → [提文档问题](https://github.com/nicholyx/ai-skills/issues/new?template=documentation.yml) |
| 技能触发了，但做的不是文档里写的事 | [提 Bug](https://github.com/nicholyx/ai-skills/issues/new?template=bug_report.yml) |
| 我不知道该用哪个技能 | 在 Claude Code 里问 `find-skills`；或到 [Discussions](https://github.com/nicholyx/ai-skills/discussions) 提问 |
| 想知道某个技能怎么用、参数是什么意思 | [README](README.md#目录结构) 与对应技能的 `SKILL.md` |
| `./scripts/lint.sh` 在我机器上失败 | 看它的报错与 [CONTRIBUTING.md](CONTRIBUTING.md#本地验证工作流) 的「覆盖/不覆盖」说明 |
| 我想加一个新技能 / 改检查脚本 | [CONTRIBUTING.md](CONTRIBUTING.md) |
| 技能里有可疑或危险的内容 | **别开公开 Issue**，走 [SECURITY.md](SECURITY.md) 的私有渠道 |
| 有人在社区里行为不当 | 按 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md#报告与执行) 的渠道报告 |

## 1. 使用问题：到 Discussions

「这个技能为什么没生效」「怎么把它同步到我的工具里」这类问题，欢迎到
[GitHub Discussions](https://github.com/nicholyx/ai-skills/discussions)，
不必开 Issue。

提问时请附上：

1. **你用的 AI 工具与版本**，以及技能是怎么装上去的
   （例如 `npx skills add nicholyx/ai-skills --full-depth`，再经 skills-sync 软链）
2. **你实际发的提示词原文** —— 触发与否几乎完全取决于这句话
3. **完整的输出或报错文本**（不是截图）—— 报错原文是可搜索的，改写过的不是

> 💡 技能是通过软链接同步的：`custom/**` 落地到 `~/.agents/skills/`，
> 再由 [skills-sync](custom/daily/skills-sync/SKILL.md) 软链进 `~/.claude/skills`
> 与 `~/.codebuddy/skills`。**改了仓库里的文件但没重新同步，工具里看到的还是旧版本**
> —— 这是「我明明改了却没生效」最常见的原因。

## 2. 确认是 Bug：提 Issue

请先搜索[已有 Issue](https://github.com/nicholyx/ai-skills/issues)，避免重复。
然后[选择模板提交](https://github.com/nicholyx/ai-skills/issues/new/choose)。

Bug 报告请带上与上面相同的三要素（环境、提示词、完整输出），再加一条**复现方式**：
是必现还是偶发，有没有试出触发条件。

## 3. 安全类问题：私下报告

**不要**用公开 Issue 报告。这在本仓库的范围比通常更宽：除了凭证与供应链问题，
「技能诱导模型执行危险命令」「技能指示模型读取本地敏感文件」也属于安全类问题。

请按 [SECURITY.md](SECURITY.md) 的说明私下报告。

## 4. 想贡献：看贡献指南

从报一个「这段说明我看不懂」到提一个新技能，都欢迎。入口在
[CONTRIBUTING.md](CONTRIBUTING.md) —— 里面也写清了本地怎么自查，
能帮你省掉一轮 CI 返工。

---

> 💡 提问前先在现有 Issue / Discussions 里搜一遍关键词 ——
> 你的问题很可能已经有人问过并解决了。
