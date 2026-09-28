<div align="center">

# ai-skills

A personal Claude Code skills repository: 14 self-maintained general-purpose skills,
1 project-specific skill, plus 31 upstream skills that are tracked here but **not** shipped.

[![CI](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/nicholyx/ai-skills)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicholyx/ai-skills?style=social)](https://github.com/nicholyx/ai-skills/stargazers)

[Quick Start](#quick-start) · [Usage Guide](docs/USAGE.en.md) · [Skills](#skills) · [Write a Skill](#writing-your-own-skill) · [中文文档](README.md)

[中文文档](README.md) | **English**

</div>

---

> **🔤 What is — and is not — in English**
>
> **In English:** this README and [`docs/USAGE.en.md`](docs/USAGE.en.md). Together they cover
> the whole path you need to get going: *what this is → install → confirm it works → use it →
> write your own skill*.
>
> **Chinese only, and canonical:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (why the
> repository is built this way, and which alternatives were rejected),
> [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) (symptom → cause → fix, with verbatim
> error output), [`docs/MAINTAINER_GUIDE.md`](docs/MAINTAINER_GUIDE.md) (maintainer handbook)
> and [`CHANGELOG.md`](CHANGELOG.md).
>
> **Why the boundary is drawn here:** a translated copy of a 20 KB troubleshooting manual is
> wrong the day someone fixes the original, and a stale fix is worse than no fix at all.
> So the rule is: the English docs cover everything you cannot work around, and everything
> past that points at the canonical Chinese page. Machine translation of those pages is fine
> in practice — [Documentation](#documentation) says which page to open for what.

---

## What this is

A repository of agent skills — the `SKILL.md` format that Claude Code, CodeBuddy, Codex,
Cursor and a couple of dozen other tools understand. Install it with
[`npx skills`](https://www.npmjs.com/package/skills) and the skills become part of your local
AI environment.

Two kinds of content live here, with **completely different provenance**:

| Directory | What it is | Who maintains it |
| --- | --- | --- |
| `custom/` | Our own skills — **this is what gets installed** | This repository, hand-written |
| `.agents/skills/` | Third-party skills installed from upstream repos | Upstream authors, refreshed by `npx skills update` |

The split exists for one reason: `npx skills update` **replaces `.agents/skills/` wholesale**,
so any local edit made there silently disappears on the next update. Our own skills live in
`custom/` so they survive.

Because the whole point of this repository is that the skills *load correctly*, it ships a
static check suite (`./scripts/lint.sh`) that enforces the skill file contract — a `name`
that doesn't match its directory, a missing `description`, or broken encoding is caught
before merge.

---

## Quick Start

### 1. Prerequisites

| Dependency | Needed for | Required? |
| --- | --- | --- |
| Node.js (`npx`) | Running `npx skills` | Yes, to install |
| An AI tool that reads `SKILL.md` | Claude Code, CodeBuddy, Codex, Cursor, … | Yes |
| git | Cloning this repository and running its checkers | Only if you want to change it |
| `uv` | Running the `skills-sync` skill | Only if you use that skill |

This repository ships **no third-party dependencies**: the checkers under `scripts/` use only
the Node standard library, and `custom/daily/skills-sync/pyproject.toml` declares an empty
dependency list. You never need `npm install` or `pip install`.

### 2. Install

```bash
# Install everything this repository ships (15 skills)
npx skills add nicholyx/ai-skills

# Install only the general-purpose ones, skipping the single project-specific skill (14)
npx skills add nicholyx/ai-skills/custom/daily
```

**What you get is the skills under `custom/`** — the ones this repository maintains and ships.
That is the whole install surface; the CLI confirms the count before it does anything:

```text
◇  Source: https://github.com/nicholyx/ai-skills.git
◇  Found 15 skills
●  Installing all 15 skills
◇  79 agents
●  Installing to: Antigravity, Claude Code, OpenClaw, Cline, CodeBuddy, Codex, Cursor, …
◇  Installation Summary
│  ./.agents/skills/git-commit
│    …
└  Done!  Review skills before use; they run with full agent permissions.
```

(Abridged from a real run. `custom/daily` prints `Found 14 skills` instead. Each skill gets
one block listing which agents receive a copy and which receive a symlink.)

> ⚠️ **The project-specific skill under `custom/projects/` IS installed by the default command**
> (15 = 14 general-purpose + 1 project-specific). It assumes you are working inside that
> specific project — specific pages, specific endpoints, specific startup steps — so anywhere
> else it is just noise. Use the second command to skip it.

> 💡 `--full-depth` installs **exactly the same 15 skills**. It only changes how deep the CLI
> searches for `SKILL.md` files, which makes no difference to this repository's layout.
> There is no reason to reach for it.

### 3. Where it landed, and how to confirm it works

By default `skills` installs at **project level**: a copy lands in `./.agents/skills/<name>/`
and is symlinked into the detected agents' directories in the same project, e.g.
`./.claude/skills/<name>`. Add `-g` / `--global` for a user-level install instead, which puts
it under `~/.claude/skills/` (and the equivalents for other tools).

```bash
# What did I install, and where did it go?
npx skills list

# Or just look (project-level install shown here)
ls .claude/skills/
```

Then **trigger a skill with one sentence**. A skill is selected by the `description` field in
its `SKILL.md` frontmatter, so the most direct check is to say something that matches it:

```text
# git-commit's description is "使用约定式提交规范执行 git commit"
> commit my changes
```

The skill descriptions in this repository are mostly written in Chinese. That is not a
blocker — the model reads the description directly, and skill *names* are English, so naming
the skill (`use git-commit`) always works.

If the AI does not follow the skill's process, see
[When something breaks](#when-something-breaks).

### 4. Update and remove

```bash
npx skills update          # update installed skills to their latest versions
npx skills remove <name>   # remove one skill
npx skills remove --all    # remove every installed skill
```

> ⚠️ **`npx skills update` is a wholesale replacement by design.** Any local edit you made to
> a file under `.agents/skills/` disappears on the next run. That is not a bug, it is what a
> vendor area means. Changes you want to keep belong in `custom/`.

### 5. The 31 upstream skills are *not* installed by any of this

The 31 skills under `.agents/skills/` are **not part of the install surface** and neither
command above will fetch them. That directory is `npx skills`'s *install target* — the place
where skills you install from elsewhere land. It is committed here only so this environment is
reproducible; `skills-lock.json` records where each one came from.

To get one of them, install it from **its own upstream repository**:

```bash
# Skill name + upstream repository, sorted by repository
jq -r '.skills | to_entries | sort_by(.value.source)[] | "\(.key)\t\(.value.source)"' skills-lock.json

# …then install it, e.g.
npx skills add vercel-labs/agent-browser
```

This repository does not re-distribute them because they are third-party content: we cannot
fix them, and any edit we made would be wiped by `npx skills update`. Shipping a copy that
*looks* like it comes from this repository is a worse deal than a one-line install command.

> ⚠️ **Never edit files under `.agents/`.** It is a vendor area — `npx skills update` replaces
> it entirely, taking your edits with it. Fork the upstream, or copy the skill into `custom/`
> and maintain it there.

---

## Skills

### General-purpose (`custom/daily/`, 14)

These are project-agnostic and are the bulk of what `npx skills add nicholyx/ai-skills` installs.

The authoritative one-line description of each skill lives in its `SKILL.md` frontmatter
(mostly Chinese — that is the canonical text; the boundary is described at the top of this
page).

| Skill | What it does |
| --- | --- |
| `bug-analyzer-agent` | Bug root-cause analysis via a dedicated-context subagent that traces deep execution flow |
| `code-reviewer-agent` | Code review via a dedicated-context subagent, covering security holes, performance and production reliability |
| `daily-report` | Generates a work daily report from git history, with date filtering and automatic categorisation |
| `git-commit` | Runs `git commit` following the Conventional Commits specification |
| `git-smart-update` | Smart git update: auto-stash, conflict resolution and local commit handling. Handles the stash-update-restore cycle, resolves conflicts (preferring remote improvements while keeping local debug code), and supports both rebase and merge modes |
| `git-sync-upstream` | Syncs a fork with upstream using rebase to keep history clean. Stashes uncommitted changes, fetches upstream, rebases and force-pushes the PR branch. Specifically for fork-syncing, not for ordinary `git pull` |
| `github-issue-autofix-workflow` | Fixes GitHub issues through the superpowers workflow (brainstorming, TDD, verification, code review), with an unattended mode |
| `maintain-loop` | The maintenance loop for an open-source project — plan, implement, release, plan again — plus the hard-won rules that go with it. Use it to keep iterating on a project (features, fixes, docs), cut a release, or take stock of what is unfinished |
| `obsidian-note-workflow` | Creates, queries and manages Obsidian notes with a preview-first workflow, automatic classification and vault initialisation |
| `oss-bootstrap` | Turns a new project (or a bare repository with nothing but code) into a standards-compliant open-source project: CI, governance files, issue/PR templates, repository automation, docs, project board and release flow. Once the scaffolding is in place, use `maintain-loop` for day-to-day iteration |
| `repo-analyzer` | Deep-dives into a codebase from a first-time contributor's angle — structure, startup flow, core business flows, module responsibilities — and writes a report. Accepts a local path or a GitHub URL |
| `skills-sync` | Symlinks commands and skills from `~/.agents/` into AI tool directories such as Claude or CodeBuddy |
| `update-claude-code` | Updates Claude Code / checks its version |
| `update-opencode` | Updates the OpenCode CLI or the oh-my-opencode plugin, checks versions, and troubleshoots version-related errors |

> 📖 The full trigger conditions and execution flow of each skill are in its own `SKILL.md`.
> For `skills-sync`'s parameters see
> [the usage guide](docs/USAGE.en.md#skills-sync-sharing-one-local-copy-across-tools).

### Project-specific (`custom/projects/`, 1)

| Skill | What it does |
| --- | --- |
| `prj-agent-platform-e2e-test` | End-to-end verification of the Agent platform's core features using `agent-browser` |

> ⚠️ **Not suitable for a general install.** These skills assume you are working on that
> specific project — specific pages, specific endpoints, specific startup steps. Run them
> against another repository and you just get irrelevant instructions. The `prj-` prefix
> exists so this is obvious from the name alone.

---

## Layout

```text
ai-skills/
├── .agents/skills/         # Upstream vendored skills (31, read-only, ~97% of repo size)
├── custom/
│   ├── daily/              # Self-maintained general skills (14)
│   └── projects/           # Self-maintained project skills (1, prj- prefix)
├── docs/                   # Repository documentation (Chinese, plus USAGE.en.md)
├── scripts/                # Static checks and generators
├── skills-lock.json        # Provenance and versions of upstream skills
├── local-skills.json       # Human-readable inventory of upstream skills (generated)
└── README.md
```

### `.agents/skills/` vs `custom/`

| | `.agents/skills/` | `custom/` |
| --- | --- | --- |
| **Shipped to users?** | **No** — it is the tool's install target | **Yes** — `npx skills add` installs this |
| Source | Installed from upstream repos by `npx skills add` | Written and maintained here |
| Tracking | `skills-lock.json` | No lock file |
| Updates | Replaced wholesale by `npx skills update` | Manual |
| Editable? | **No** — edits get overwritten | Yes, that is the point |
| Check strictness | Violations warn, do not block CI | Violations fail CI |

### `custom/daily/` vs `custom/projects/`

| | `custom/daily/` | `custom/projects/` |
| --- | --- | --- |
| Scope | General, any project | One specific project |
| Naming | Plain feature name, e.g. `git-commit` | `prj-` prefix, e.g. `prj-agent-platform-e2e-test` |
| Installed? | Yes | **Yes, by the default command too** — use `…/custom/daily` to skip it |
| Examples | Daily reports, git workflows, code analysis | One project's e2e tests, one project's deploy flow |

### What counts as a skill

A skill is a **depth-1** subdirectory of one of the three parent directories above, holding a
`SKILL.md`:

```text
.agents/skills/<name>/SKILL.md     # upstream vendored, 31
custom/daily/<name>/SKILL.md       # self-maintained general, 14
custom/projects/<name>/SKILL.md    # self-maintained project-specific, 1
```

Anything nested deeper is not a skill. That is not over-cautious: the upstream
`plugin-creator` skill has a deeper `SKILL.md` under `assets/templates/` which is a
*template asset*, not a skill — even its `name` disagrees with its directory name. Treating
it as a skill would produce a permanent false failure.

---

## Writing your own skill

This section is the short version; [the usage guide](docs/USAGE.en.md#writing-your-own-skill)
walks through it in more detail.

### 1. Decide where it goes

| Your skill | Put it here |
| --- | --- |
| Useful in any project | `custom/daily/<name>/` |
| Only meaningful for one project | `custom/projects/prj-<project>-<purpose>/` |
| Third-party skill from upstream | Don't hand-write it — `npx skills add` it |

The directory name **is** the skill name, and the two must match (see below).

### 2. The `SKILL.md` frontmatter contract

The frontmatter is the YAML block delimited by `---` at the top of the file. **Only these six
top-level keys are allowed** — anything else fails CI:

| Key | Required | Constraint |
| --- | :---: | --- |
| `name` | ✅ | kebab-case (lowercase letters, digits, hyphens); ≤ 64 chars; no leading/trailing hyphen, no doubled hyphens; **must equal the directory name** |
| `description` | ✅ | Non-empty; ≤ 1024 chars; must not contain `<` or `>` |
| `license` | | e.g. `MIT` |
| `allowed-tools` | | e.g. `Bash` |
| `metadata` | | Nested structure; values are not parsed here |
| `compatibility` | | ≤ 500 chars |

"`name` must equal the directory name" is this repository's own rule — the official validator
does not check it — but every skill here satisfies it, so it is locked in. Get it wrong on a
rename and any tool that indexes skills by name will stop finding yours.

### 3. Minimal skeleton

```markdown
---
name: my-skill
description: Use when … (say exactly when this should trigger — it is the only signal the AI has)
---

# My Skill

## What it solves

…

## Steps

1. First step
2. Second step
```

A skill directory may also contain supporting files: extra `*.md` material, a human-facing
`README.md`, `reference/**` (templates, sub-agent definitions) and `evals/evals.json`
(evaluation cases, structurally validated by CI).

### 4. Check your work

```bash
# Only the skill-related checks — returns in seconds
./scripts/lint.sh --only frontmatter,evals,hygiene,links
```

It reports a `name` that disagrees with the directory, a missing `description`, a
non-whitelisted key such as `hidden`, a BOM, CRLF line endings, a missing final newline, and
dead relative links in the body.

> ⚠️ Everything under `custom/**` is symlinked into users' global AI environments, so every
> instruction you write there **will be executed**. Read the
> [maintainer guide's red lines](docs/MAINTAINER_GUIDE.md) (Chinese) before writing.

---

## When something breaks

The one that bites most often is *"I installed it but the skill never triggers"* — the
troubleshooting guide starts with exactly that, as 「技能装了但不生效」.

The full [troubleshooting guide](docs/TROUBLESHOOTING.md) is **written in Chinese** — it is
the canonical symptom → cause → fix reference, and the only place that carries the verbatim
error output. Open it with browser translation, or search this repository's
[issues](https://github.com/nicholyx/ai-skills/issues); the three starting points are:

| Symptom | Which part of the guide |
| --- | --- |
| Installed, but the skill never triggers | 「技能装了但不生效」 (the first section) |
| My edits under `.agents/` vanished after an update | 「npx skills update 之后本地对 .agents 的改动消失」 |
| `skills-sync` says `⚠ 跳过（目标已存在且不是软链接）` | `skills-sync` output symbols — a real file is sitting where the symlink should be |

If none of it fits, [open an issue](https://github.com/nicholyx/ai-skills/issues/new).

---

## Documentation

| Document | Contents | Language |
| --- | --- | --- |
| [README.md](README.md) | What this is, what to install, how to install it | Chinese (canonical) |
| **[README.en.md](README.en.md)** | The same, in English | **English** |
| **[docs/USAGE.en.md](docs/USAGE.en.md)** | Install → verify → use, `skills-sync` parameters, writing your own skill | **English** |
| [docs/USAGE.md](docs/USAGE.md) | The full usage guide, including everything the English version summarises | Chinese (canonical) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Why it is designed this way, rejected alternatives, the job of each file under `scripts/` | Chinese |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Symptom / cause / fix, with verbatim error output | Chinese |
| [docs/MAINTAINER_GUIDE.md](docs/MAINTAINER_GUIDE.md) | Repository settings checklist, project red lines, maintenance cadence, PR review | Chinese |
| [CHANGELOG.md](CHANGELOG.md) | What changed in each release | Chinese |

---

## Contributing

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (Chinese) before changing anything: it
records the reasoning behind every rule and the alternatives that were rejected, so you don't
have to rediscover them. [CONTRIBUTING.md](CONTRIBUTING.md) (Chinese) covers the process.

```bash
# Run the local checks before committing (11 checks)
./scripts/lint.sh

# Run only some of them
./scripts/lint.sh --only frontmatter,links

# Also validate commit messages (but not the PR title — see below)
./scripts/lint.sh --commits origin/main..HEAD
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>(<scope>): <description>

feat(custom): 新增并接入 oss-bootstrap 技能
fix(skills-sync): 修复失效软链未被清理的问题
docs: 补充 custom/projects 的命名约定
```

The description may be written in Chinese or English; the type and scope prefixes are what CI
checks. Allowed types: `feat` `fix` `docs` `ci` `chore` `refactor` `perf` `test` `style`
`revert` `build`. CI validates both every commit in the pull request **and the PR title**
(after a squash merge the title becomes the commit message).

> ⚠️ A green `./scripts/lint.sh` does **not** guarantee green CI: the PR title doesn't exist
> until the PR is opened, so it cannot be validated locally.

---

## License

[Apache License 2.0](LICENSE).

Upstream skills under `.agents/skills/` remain the property of their respective authors and
carry their own licenses. This repository's license covers `custom/`, `docs/`, `scripts/`
and the repository's own configuration files.
