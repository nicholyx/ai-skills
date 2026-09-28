# Usage Guide

Get the skills in this repository into your AI tool, and make them actually take effect.

> 💡 This page is the **English** companion to the Chinese [使用指南](USAGE.md). It covers the
> path a user needs end to end: install → confirm it works → use → write your own skill.
> See [Scope of this page](#scope-of-this-page) for what is deliberately not translated.

[中文](USAGE.md) | **English**

---

## Table of contents

- [Prerequisites](#prerequisites)
- [Step 1: Install the skills](#step-1-install-the-skills)
- [Step 2: Confirm they work](#step-2-confirm-they-work)
- [Step 3: Update and remove](#step-3-update-and-remove)
- [skills-sync: sharing one local copy across tools](#skills-sync-sharing-one-local-copy-across-tools)
- [Writing your own skill](#writing-your-own-skill)
- [Common scenarios](#common-scenarios)
- [Scope of this page](#scope-of-this-page)

---

## Prerequisites

| Dependency | Used for | Required? |
| --- | --- | --- |
| Node.js (`npx`) | Running `npx skills`; the repository's own checkers are Node too | Yes, to install skills |
| git | Cloning the repository and running the checkers (they target the git index) | Only if you want to change the repository |
| `uv` | Running the `skills-sync` skill | Only if you use that skill |
| An AI tool that understands `SKILL.md` | Claude Code, CodeBuddy, Codex, Cursor, … | Yes |

The repository itself pulls in **no third-party dependencies**: the checkers under `scripts/`
use only the Node standard library, and `custom/daily/skills-sync/pyproject.toml` has an empty
dependency list (`dependencies = []`). So there is nothing to `npm install` or `pip install`.

---

## Step 1: Install the skills

```bash
# Everything (15 skills)
npx skills add nicholyx/ai-skills

# Only the general-purpose ones, skipping the single project-specific skill (14)
npx skills add nicholyx/ai-skills/custom/daily
```

### Choosing between the two

| Command | What you get | When to use it |
| --- | --- | --- |
| `npx skills add nicholyx/ai-skills` | Everything under `custom/` (14 general-purpose + 1 project-specific) | **The usual choice** |
| `npx skills add nicholyx/ai-skills/custom/daily` | Only the general-purpose skills (14) | You don't want the project-specific one |

**The install surface is `custom/`** — the skills this repository maintains and ships. The CLI
tells you the count up front: the first command prints `Found 15 skills`, the second
`Found 14 skills`.

> ⚠️ **The project-specific skill under `custom/projects/` IS installed by the default command.**
> It assumes you are working inside that specific project (specific pages, specific endpoints,
> specific startup steps), so anywhere else it is just noise — use the second command to skip it.

> `--full-depth` installs **exactly the same 15 skills** as the default command. It only
> controls how deeply the CLI searches for `SKILL.md` files ("search all subdirectories even
> when a root SKILL.md exists"), which makes no difference to this repository's layout. There
> is no reason to use it.

### Where the skills land

By default `skills` installs at **project level**: the files are copied to
`./.agents/skills/<skill-name>/` and symlinked into the agent directories it detects in the
same project — for Claude Code, `./.claude/skills/<skill-name>`.

Pass `-g` / `--global` for a **user-level** install instead, which puts them under
`~/.claude/skills/` (and the equivalent directories of the other tools):

```bash
npx skills add nicholyx/ai-skills -g     # user-level instead of project-level
```

One skill directory holds the real files; every agent directory holds a symlink to it. That is
why editing a skill in one place is enough.

### What about the 31 upstream skills under `.agents/skills/`?

**They are not distributed by this repository, and neither command above installs them.**

`.agents/skills/` is `npx skills`'s **install target** — the directory where the skills *you*
install with `npx skills add <upstream repo>` end up. This repository commits it so the
environment is reproducible (`skills-lock.json` records provenance and versions).

To get one of them, install it from **its own upstream repository**:

```bash
# Look the source up first
jq -r '.skills | to_entries[] | "\(.key)\t\(.value.source)"' skills-lock.json

# Then install it, e.g. agent-browser
npx skills add vercel-labs/agent-browser
```

**Why doesn't this repository re-distribute them?** They are third-party content: we cannot
edit them (any edit would be lost on `npx skills update`), and we cannot fix them when they
break. Shipping a copy that looks like it comes from here is a far worse deal than one install
command. See [架构与原理](ARCHITECTURE.md) (Chinese) for the reasoning in full.

### Directory conventions

One skill = a **depth-1** subdirectory of one of the three parent directories below, holding a
`SKILL.md`:

```text
.agents/skills/<name>/SKILL.md     # upstream vendored, 31
custom/daily/<name>/SKILL.md       # self-maintained general, 14
custom/projects/<name>/SKILL.md    # self-maintained project-specific, 1
```

Anything nested deeper does not count as a skill. That limit is not over-cautious: the
upstream `plugin-creator` skill has a deeper `SKILL.md` under its `assets/templates/`, and that
file is a **template asset** rather than a skill — even its `name` disagrees with the directory
it sits in. Treating it as a skill would produce a permanent failure that can never be fixed.

---

## Step 2: Confirm they work

The skills are installed into the agent directories described above. For a project-level
install with Claude Code:

```bash
# Which skills did I install, and where?
npx skills list

# Or just look
ls .claude/skills/

# For a user-level install it is
ls ~/.claude/skills/
```

Then **trigger one with a single sentence**. A skill is chosen by the `description` field in
its `SKILL.md` frontmatter, so the most direct test is to phrase something that matches it:

```text
# git-commit's description is "使用约定式提交规范执行 git commit"
> commit my changes
```

Those descriptions are mostly written in Chinese, which is not a problem: the model reads them
directly, and the skill names are English, so naming the skill outright (`use git-commit`)
always works.

If the AI does not follow the skill's process, see
[docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) — starting with its first section,
「技能装了但不生效」 ("installed, but the skill never triggers"). That page is Chinese; see
[Scope of this page](#scope-of-this-page).

---

## Step 3: Update and remove

```bash
npx skills update            # update installed skills to their latest versions
npx skills remove <name>     # remove one skill
npx skills remove --all      # remove every installed skill
```

> ⚠️ **`npx skills update` is a wholesale replacement by design.** Any local edit you made to
> a file under `.agents/skills/` will be gone after the update — that is not a bug, it is what
> a vendor area means. Changes worth keeping belong in `custom/`.

Self-maintained skills (`custom/`) are untouched by `npx skills update`. Change them, commit
them, and the next person to install gets the new version.

---

## skills-sync: sharing one local copy across tools

`skills-sync` is one of the skills in `custom/daily/`, and it solves a different problem from
`npx skills`:

| | `npx skills` | `skills-sync` |
| --- | --- | --- |
| Source | Skill repositories on GitHub | Your local `~/.agents/` |
| Mechanism | Downloads and installs | Creates **symlinks**, no copying |
| Good for | Installing skills from someone else | Letting several AI tools share one local copy |

### What it does

It symlinks everything under `~/.agents/commands/` and `~/.agents/skills/` into the target
tool's directories:

| Tool | Commands path | Skills path |
| --- | --- | --- |
| Claude | `~/.claude/commands/` | `~/.claude/skills/` |
| CodeBuddy | `~/.codebuddy/commands/` | `~/.codebuddy/skills/` |

Because these are symlinks rather than copies, editing one place updates every tool at once.

### Parameters

| Parameter | Required | Values | Meaning |
| --- | :---: | --- | --- |
| `--target` | ✅ | `claude`, `codebuddy`, or several separated by commas | Which tool(s) to sync to |
| `--type` | ✅ | `commands`, `skills`, `both` | Which kind of content to sync |

Both are required. `--type` is constrained by `choices`, so an invalid value is rejected by the
argument parser. An invalid `--target` is not caught that way — it fails at runtime:

```text
✗ 未知的目标工具: xxx
  支持的工具: claude, codebuddy
```

### Usage

```bash
# Sync skills to Claude
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type skills

# Sync commands to Claude
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type commands

# Sync both to Claude
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude --type both

# Sync to two tools at once
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude,codebuddy --type both
```

`--directory` makes `uv` run inside the skill directory, so it can prepare the environment from
that directory's `pyproject.toml`; `sync.py` itself only uses the standard library. Adjust the
path to wherever the skill actually lives — if you installed it with
`npx skills add nicholyx/ai-skills -g`, that is
`uv run --directory ~/.claude/skills/skills-sync python sync.py ...`.

### Reading the output

The script prints its progress in Chinese; these are the lines you will see:

| Line | Meaning | What you need to do |
| --- | --- | --- |
| `✓ 创建链接: <target> -> <source>` | A new symlink was created | Nothing |
| `✓ 跳过（已存在有效链接）: <target>` | The symlink already exists and is valid | Nothing |
| `✗ 删除无效链接: <target>` | The symlink pointed at something that no longer exists; it was removed | Nothing (it gets recreated) |
| `⚠ 跳过（目标已存在且不是软链接）: <target>` | A **real** file or directory is in the way, so it was not overwritten | **You must deal with this**, otherwise the skill never takes effect |
| `✗ 源目录不存在: <source>` | `~/.agents/commands/` or `~/.agents/skills/` does not exist | Create the directory, or check the path |

It finishes with four counters (created / skipped / removed / failed). **Only a non-zero
"failed" count exits with status 1** — meaning `⚠ …不是软链接` is not treated as an error and
the script exits "successfully" while your skill may not be wired up at all. See
[docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) (Chinese).

---

## Writing your own skill

### 1. Decide where it goes

| Your skill | Goes here |
| --- | --- |
| Useful in any project | `custom/daily/<skill-name>/` |
| Only meaningful for one project | `custom/projects/prj-<project>-<purpose>/` |
| A third-party skill from upstream | Do not hand-write it — use `npx skills add` |

The directory name is the skill name and **must match it exactly** (see below).

### 2. The `SKILL.md` frontmatter contract

The frontmatter is the YAML block delimited by `---` at the top of the file. The repository's
checker implements exactly what the official validator needs (top-level keys, scalar values,
nested structures skipped) plus four reinforcements of its own — the reasoning is in
[架构与原理](ARCHITECTURE.md) (Chinese).

Only these six top-level keys are allowed. One extra key fails CI:

| Key | Required | Constraint |
| --- | :---: | --- |
| `name` | ✅ | kebab-case (lowercase letters, digits, hyphens); ≤ 64 chars; no leading or trailing hyphen, no doubled hyphens; **must equal the directory name** |
| `description` | ✅ | Non-empty; ≤ 1024 chars; no angle brackets (`<` or `>`) |
| `license` | | e.g. `MIT` |
| `allowed-tools` | | e.g. `Bash` |
| `metadata` | | Nested structure; values are not parsed here |
| `compatibility` | | ≤ 500 chars |

"`name` must equal the directory name" is this repository's own rule — the official validator
does not check it — but all skills here satisfy it today, so it is locked in. Miss it during a
rename and any tool that indexes skills by name will stop finding the skill.

### 3. Supporting files you may add

Besides `SKILL.md`, a skill directory may contain:

| File | Purpose | Example |
| --- | --- | --- |
| `*.md` | Extra material referenced by the main file | `bug-analyzer-agent/bug-analyzer.md` |
| `README.md` | Documentation for humans | `github-issue-autofix-workflow/README.md` |
| `reference/**` | Reference material, templates, sub-agent definitions | `repo-analyzer/reference/subagents/*.md` |
| `evals/evals.json` | Evaluation cases | `git-smart-update/evals/evals.json` |
| `sync.py` / `pyproject.toml` | A skill's own script and dependency declaration | `skills-sync/` |

The structure of `evals/evals.json` is validated by CI:

```json
{
  "skill_name": "<must equal the skill directory name>",
  "evals": [
    {
      "id": 1,
      "prompt": "what the user would say",
      "expected_output": "the expected result",
      "files": [],
      "assertions": []
    }
  ]
}
```

`id` (a number) and `prompt` (a non-empty string) are hard requirements; a missing
`expected_output`, `files` or `assertions` is only a note, not an error — deciding what a case
should assert is a human judgement, and the machine should not make it for you. **CI validates
the structure only; it does not run the assertions.**

### 4. Minimal skeleton

```markdown
---
name: my-skill
description: Use when … (be explicit about when this should trigger — it is the only signal the AI has)
---

# My Skill

## What it solves

…

## Steps

1. First step
2. Second step
```

### 5. Check your work

```bash
# Only the skill-related checks — returns in seconds
./scripts/lint.sh --only frontmatter,evals,hygiene,links
```

The checkers report: a `name` that disagrees with the directory, a missing `description`, a key
outside the whitelist (such as `hidden`), a BOM, CRLF line endings, a missing final newline,
and dead relative links in the body.

> ⚠️ The contents of `custom/**` are symlinked into users' global AI environments, where every
> instruction you write **will be executed**. Read the
> [maintainer guide's red lines](MAINTAINER_GUIDE.md) (Chinese) before you write.

---

## Common scenarios

### I want every commit to follow the spec

Install the `git-commit` skill (it is in `custom/daily/`), then just say "commit this". Its
description is 「使用约定式提交规范执行 git commit」, so ordinary phrasing triggers it.

### I changed a skill in `custom/` — how do I get it locally?

It depends on how you installed it:

- If you installed with `npx skills add`, re-run the install (or edit the copy in your agent
  directory directly, keeping in mind that the copy never makes it back to the repository).
- If you want one edit to take effect everywhere at once, use `skills-sync` to symlink from
  `~/.agents/skills/`.

### I want to use Claude Code and CodeBuddy at the same time

```bash
uv run --directory ~/.agents/skills/skills-sync python sync.py --target claude,codebuddy --type both
```

One source, two symlinks, no "the two sides drifted apart".

### My changes under `.agents/` disappeared after an update

That is not data loss, it is how a vendor area behaves. See
[docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) (Chinese).

### I want everything on a second machine

```bash
npx skills add nicholyx/ai-skills
```

That installs all 15 skills this repository ships. The 31 upstream skills under
`.agents/skills/` are **not** included — install those from their own source repositories, as
described in [Step 1](#what-about-the-31-upstream-skills-under-agentsskills).

---

## Scope of this page

**This page translates the path you cannot work around, and nothing else.** The rule is:
anything without which you cannot install the skills, confirm they work or write your own is
in English — everything past that points at the canonical Chinese page.

In English, here and in [README.en.md](../README.en.md):

- What this repository is, and what it does and does not install.
- Both install commands, where the skills land, and how to confirm they took effect.
- How to trigger a skill, and how to update or remove it.
- `skills-sync`: parameters and the output symbols.
- How to write a new skill: where it goes, the frontmatter contract, the checks to run.

Chinese only, and canonical — these are **not** translated, on purpose:

| Page | What it holds |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Why the repository is designed this way, and the alternatives that were rejected |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | The complete symptom → cause → fix reference, with verbatim error output |
| [MAINTAINER_GUIDE.md](MAINTAINER_GUIDE.md) | Repository settings, project red lines, release cadence, PR review |
| [USAGE.md](USAGE.md) | The full usage guide, including everything this page summarises |
| [CHANGELOG.md](../CHANGELOG.md) | What changed in each release |

**Why not translate everything:** the two copies would drift. A translated troubleshooting
manual is wrong the moment someone fixes the original, and a stale fix is worse than no fix.
Drawing the boundary explicitly — rather than leaving it as an unwritten convention — is what
keeps this page honest about what it does and does not cover. Machine translation handles the
Chinese pages well in practice; they are ordinary Markdown with no images to lose.

If something here is wrong or missing, [open an issue](https://github.com/nicholyx/ai-skills/issues/new).
