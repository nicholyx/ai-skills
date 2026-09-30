---
name: skills-doctor
description: 诊断「技能装了却没反应」—— 检查技能装在哪个目录、软链有没有断、SKILL.md 能不能被加载、有没有被别的目录顶掉。当用户说「技能装了但用不了，帮我看看」「技能没反应」「我说了触发词什么都不发生」「检查一下技能装好没有」「skills 怎么不生效」时使用。
license: MIT
allowed-tools: Bash, Read, Glob, Grep
metadata:
  category: 环境与工具
  tagline: "排查「技能装了没反应」：装在哪、断链、加载失败、被顶掉"
  example: "技能装了但用不了，帮我看看"
---

# 技能装好了却没反应？按这四步查

## 什么时候用

- 「我装了技能，但怎么说都不触发」
- 「之前能用，现在没反应了」
- 「换台机器/换个目录就不好使了」
- 「帮我看看技能到底装上没有」

**只管诊断，不做修改** —— 找到原因后把修复命令给用户，让他自己决定要不要执行。
删软链、改配置这类动作，未经明确同意不要做。

## 一条前提

**「装了」和「能被加载」是两件事。** 技能文件躺在磁盘上不代表工具看得见它：
可能装错了位置、软链断了、目录被别的工具顶掉、或者 frontmatter 坏了导致静默跳过。
这个技能就是把这三件事分开查。

## 第一步：它到底装在哪

`npx skills` 装到两个位置之一，**很多人是在一个目录装的、在另一个目录用**：

```bash
for d in ./.agents/skills ./.claude/skills ~/.agents/skills ~/.claude/skills; do
  if [ -d "$d" ]; then
    printf '%s  →  %s 项\n' "$d" "$(ls -1 "$d" 2>/dev/null | wc -l | tr -d ' ')"
  else
    printf '%s  →  不存在\n' "$d"
  fi
done
```

- **项目级**（`./.agents/skills` + `./.claude/skills`）是默认落点，**只在这个项目里生效**
- **用户级**（`~/.agents/skills` + `~/.claude/skills`）要 `-g` 或 `--global`，全局生效

**最常见的误判**：在 A 目录装的，在 B 目录里找。先把这条排除掉。

## 第二步：软链有没有断

`.claude/skills/` 里通常是指向 `.agents/skills/` 的**软链**。目标被移动或删除后，
链接还在、但指向空气 —— 技能就这么静默消失了，没有任何报错。

```bash
find ./.claude/skills ~/.claude/skills -maxdepth 1 -type l 2>/dev/null | while read -r f; do
  [ -e "$f" ] || printf '断链：%s  →  %s（目标不存在）\n' "$f" "$(readlink "$f")"
done
```

有输出就是找到了 —— **把每一个断链的条目名原样报给用户。**

> **别用 `for f in .claude/skills/*`。** 目录不存在时，zsh 会报
> `no matches found` 并**中断整条命令**（macOS 默认就是 zsh），于是你会以为「没查到」，
> 其实是命令根本没跑完。`find` 对不存在的目录只是往 stderr 抱怨一句，不影响其余部分。

## 第三步：SKILL.md 能不能被加载

对第一步里每个存在技能的目录，逐个检查。**加载失败通常是静默的**，所以只能自己验：

```bash
find ./.agents/skills ./.claude/skills ~/.agents/skills ~/.claude/skills \
     -maxdepth 1 -mindepth 1 2>/dev/null | while read -r d; do
  [ -d "$d" ] || continue          # 跟随软链；断链在第二步已单独报
  name=$(basename "$d")
  f="$d/SKILL.md"
  if [ ! -f "$f" ]; then
    printf '缺 SKILL.md：%s\n' "$d"
    continue
  fi
  if ! head -1 "$f" | grep -qx -- '---'; then
    printf '没有 frontmatter：%s\n' "$f"
    continue
  fi
  fm_name=$(sed -n 's/^name:[[:space:]]*//p' "$f" | head -1)
  if [ -z "$fm_name" ]; then
    printf '缺 name 字段：%s\n' "$f"
  elif [ "$fm_name" != "$name" ]; then
    printf 'name 与目录名不符：%s（目录 %s，name %s）\n' "$f" "$name" "$fm_name"
  fi
done
```

三类问题都**不会报错**，只会让技能用不了：缺 `SKILL.md`、没有 frontmatter、
`name` 与目录名不一致。

## 第四步：有没有被别的目录顶掉

同一个技能名出现在多个目录时，谁生效取决于工具的查找顺序 —— 而这种覆盖是静默的。

```bash
find ./.agents/skills ./.claude/skills ~/.agents/skills ~/.claude/skills \
     -maxdepth 1 -mindepth 1 2>/dev/null | while read -r p; do
  [ -d "$p" ] || continue
  printf '%s\t%s\n' "$(basename "$p")" "$(cd "$p" && pwd -P)"
done | sort -u | cut -f1 | uniq -d
```

有输出说明这些名字**装了不止一份**。重点看：两份内容是否一致、其中一份是不是很久
没更新的旧版本。

> **必须按解析后的真实路径去重**（`pwd -P`）。`.claude/skills/<名字>` 通常就是指向
> `.agents/skills/<名字>` 的软链 —— 同一份东西。只比名字的话，**每一个技能都会被
> 报成重名**，真正的问题反而淹在里面。

> 这个仓库自己踩过一次：项目里多了一个 `.claude/skills/`（另一个工具写进去的 9 个
> 技能），把本该生效的那批整个顶掉 —— 装的人以为装的是 A，实际生效的是 B。

## 报告怎么写

**先给结论，再给证据。** 格式：

```
## 结论

<能用 / 不能用 / 部分不能用>，原因：<一句话>

## 查到什么

| 位置 | 项数 | 问题 |
| --- | --- | --- |
| ./.agents/skills | 15 | — |
| ./.claude/skills | 15 | 2 个断链 |
| ~/.claude/skills | 8 | — |

## 有问题的条目

- 断链：`./.claude/skills/xxx` → `../../.agents/skills/nonexistent`（目标不存在）
- name 与目录名不符：`./.agents/skills/foo/SKILL.md`（目录 foo，name bar）

## 建议怎么修

<具体命令，一条一条列>
```

**要求：**

- **问题条目一律原样引用路径与名字** —— 用户要拿它去搜、去删，改写了就没用
- **没查到问题就直说没查到**，不要为了显得有用而凑几条模糊的「建议优化」
- **每一步的实际输出要能对上** —— 报「15 项」就该真数出 15 项

## 边界

- **只诊断，不改。** 修复命令给出来，让用户自己执行；删软链、动配置尤其要问
- **不猜。** 查不到原因就说「按这四步没发现异常，可能是工具版本或它自己的配置问题」，
  并建议下一步查哪里 —— 不要编一个像模像样的原因
- **不评价技能内容好不好用。** 这里只回答「它能不能被加载」
