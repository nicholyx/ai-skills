<div align="center">

# ai-skills

A personal Claude Code skills repository: 12 self-maintained general-purpose skills,
1 project-specific skill, plus 31 upstream skills tracked by `skills-lock.json`.

[![CI](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/nicholyx/ai-skills)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicholyx/ai-skills?style=social)](https://github.com/nicholyx/ai-skills/stargazers)

[Quick Start](#quick-start) · [Skills](#skills) · [Layout](#layout) · [Contributing](#contributing) · [Documentation](#documentation)

[中文文档](README.md) | **English**

> 📖 **Note on language**: The full documentation under `docs/` is written in Chinese,
> which is the canonical version. This English README covers everything you need to
> install and use the skills; for design rationale and troubleshooting details,
> the Chinese docs are still worth a read (browser translation works fine).

</div>

---

## What is this

A repository of [agent skills](https://www.npmjs.com/package/skills) that you install
into Claude Code, CodeBuddy or any other tool that understands the `SKILL.md` format.

Two kinds of content live here, with **completely different provenance**:

| Directory | What it is | Who maintains it |
| --- | --- | --- |
| `custom/` | Our own skills | This repository, hand-written |
| `.agents/skills/` | Third-party skills installed from upstream repos | Upstream authors, refreshed by `npx skills update` |

The split exists for one reason: `npx skills update` **replaces `.agents/skills/` wholesale**,
so any local edit made there silently disappears on the next update. Our own skills live in
`custom/` so they survive.

Because the whole point of this repository is that the skills *load correctly*, it ships a
static check suite (`./scripts/lint.sh`) that enforces the skill file contract — a `name`
that doesn't match its directory, a missing `description`, or broken encoding is caught
before merge.

---

## Features

- **12 general-purpose skills**: git workflows, code review, bug root-cause analysis,
  repository analysis, daily reports, Obsidian notes, and more
- **1 project-specific skill**, namespaced with a `prj-` prefix so it never leaks into a general install
- **Vendored and self-maintained content kept physically separate**: `npx skills update` only touches `.agents/`
- **Upstream skills are locked**: `skills-lock.json` records which GitHub repo each one came from
- **One entry point for local checks**: `./scripts/lint.sh` runs 10 checks, 6 of which are pure Node
- **Zero third-party dependencies**: the checkers use only the Node standard library, and
  `skills-sync`'s `pyproject.toml` has an empty dependency list

---

## Quick Start

```bash
# Install the skills under .agents/skills (default search depth)
npx skills add nicholyx/ai-skills

# Install everything, including the self-maintained skills under custom
npx skills add nicholyx/ai-skills --full-depth

# Install only the self-maintained skills under custom
npx skills add nicholyx/ai-skills/custom
```

> ⚠️ None of the three commands installs the project-specific skills under `custom/projects/` —
> see [Layout](#layout). Copy that directory yourself if you want them.

Afterwards:

```bash
# See what got installed (Claude Code shown here)
ls ~/.claude/skills/

# Check whether upstream skills have newer versions
npx skills check

# Update all upstream skills
npx skills update
```

> 💡 "The skill is installed but nothing happens" is the most common problem people hit.
> See the troubleshooting entry
> [技能装了但不生效](docs/TROUBLESHOOTING.md#技能装了但不生效) (Chinese).

---

## Skills

### General-purpose (`custom/daily/`)

These 12 skills are project-agnostic; they are what
`npx skills add nicholyx/ai-skills --full-depth` mostly installs.

The authoritative one-line description of each skill lives in its `SKILL.md` frontmatter
(mostly written in Chinese — that is the canonical text).

| Skill | What it does |
| --- | --- |
| `bug-analyzer-agent` | Bug root-cause analysis via a dedicated-context subagent that traces deep execution flow |
| `code-reviewer-agent` | Code review via a dedicated-context subagent, covering security holes, performance and production reliability |
| `daily-report` | Generates a work daily report from git history, with date filtering and automatic categorisation |
| `git-commit` | Runs `git commit` following the Conventional Commits specification |
| `git-smart-update` | Smart git update: auto-stash, conflict resolution and local commit handling. Handles the stash-update-restore cycle, resolves conflicts (preferring remote improvements while keeping local debug code), and supports both rebase and merge modes |
| `git-sync-upstream` | Syncs a fork with upstream using rebase to keep history clean. Stashes uncommitted changes, fetches upstream, rebases and force-pushes the PR branch. Specifically for fork-syncing, not for ordinary `git pull` |
| `github-issue-autofix-workflow` | Fixes GitHub issues through the superpowers workflow (brainstorming, TDD, verification, code review), with an unattended mode |
| `obsidian-note-workflow` | Creates, queries and manages Obsidian notes with a preview-first workflow, automatic classification and vault initialisation |
| `repo-analyzer` | Deep-dives into a codebase from a first-time contributor's angle — structure, startup flow, core business flows, module responsibilities — and writes a report. Accepts a local path or a GitHub URL |
| `skills-sync` | Symlinks commands and skills from `~/.agents/` into AI tool directories such as Claude or CodeBuddy |
| `update-claude-code` | Updates Claude Code / checks its version |
| `update-opencode` | Updates the OpenCode CLI or the oh-my-opencode plugin, checks versions, and troubleshoots version-related errors |

### Project-specific (`custom/projects/`)

| Skill | What it does |
| --- | --- |
| `prj-agent-platform-e2e-test` | End-to-end verification of the Agent platform's core features using `agent-browser` |

> ⚠️ **Not suitable for a general install.** These skills assume you are working on that
> specific project — specific pages, specific endpoints, specific startup steps. Run them
> against another repository and you just get irrelevant instructions. The `prj-` prefix
> exists so this is obvious from the name alone.

### Upstream (`.agents/skills/`)

31 third-party skills whose provenance is recorded in `skills-lock.json`:

```bash
# Skill name + upstream repository, sorted by repository
jq -r '.skills | to_entries | sort_by(.value.source)[] | "\(.key)\t\(.value.source)"' skills-lock.json
```

> ⚠️ **Never edit files under `.agents/`.** It is a vendor area — `npx skills update`
> replaces it entirely, taking your edits with it. Fork the upstream, or copy the skill
> into `custom/` and maintain it there.

---

## Layout

```text
ai-skills/
├── .agents/skills/         # Upstream vendored skills (31, read-only, ~97% of repo size)
├── custom/
│   ├── daily/              # Self-maintained general skills (12)
│   └── projects/           # Self-maintained project skills (1, prj- prefix)
├── docs/                   # Repository documentation
├── scripts/                # Static checks and generators
├── skills-lock.json        # Provenance and versions of upstream skills
├── local-skills.json       # Human-readable inventory of upstream skills (generated)
└── README.md
```

| | `.agents/skills/` | `custom/` |
| --- | --- | --- |
| Source | Installed from upstream repos by `npx skills add` | Written and maintained here |
| Tracking | `skills-lock.json` | No lock file |
| Updates | Replaced wholesale by `npx skills update` | Manual |
| Editable? | **No** — edits get overwritten | Yes, that is the point |
| Check strictness | Violations warn, do not block CI | Violations fail CI |

| | `custom/daily/` | `custom/projects/` |
| --- | --- | --- |
| Scope | General, any project | One specific project |
| Naming | Plain feature name, e.g. `git-commit` | `prj-` prefix, e.g. `prj-agent-platform-e2e-test` |
| Distribution | Shipped by a general install | Not part of a general install |

Full details on both conventions — in Chinese — are in
[使用指南](docs/USAGE.md#目录约定).

---

## Contributing

Read [架构与原理](docs/ARCHITECTURE.md) (Chinese) before changing anything: it records the
reasoning behind every rule and the alternatives that were rejected, so you don't have to
rediscover them.

```bash
# Run the local checks before committing (10 checks, 6 of them pure Node)
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

Allowed types: `feat` `fix` `docs` `ci` `chore` `refactor` `perf` `test` `style` `revert` `build`.
CI validates both every commit in the pull request **and the PR title** (after a squash merge
the title becomes the commit message).

> ⚠️ A green `./scripts/lint.sh` does **not** guarantee green CI: the PR title doesn't exist
> until the PR is opened, so it cannot be validated locally.

---

## Documentation

**The docs below are written in Chinese, and the Chinese version is canonical.**

| Document | Contents | Audience |
| --- | --- | --- |
| [README.md](README.md) | What this is, what to install, how to install it | Everyone |
| [使用指南](docs/USAGE.md) | From zero to working: install, make skills take effect, `skills-sync` parameters, writing your own skill | Users |
| [架构与原理](docs/ARCHITECTURE.md) | Why it is designed this way, rejected alternatives, the job of each file under `scripts/` | Anyone changing this repository |
| [排错手册](docs/TROUBLESHOOTING.md) | Symptom / cause / fix, with verbatim error output | When something breaks |
| [维护者手册](docs/MAINTAINER_GUIDE.md) | Repository settings checklist, project red lines, maintenance cadence, PR review | Maintainers |
| [更新日志](CHANGELOG.md) | What changed in each release | Everyone |

---

## License

[Apache License 2.0](LICENSE).

Upstream skills under `.agents/skills/` remain the property of their respective authors and
carry their own licenses. This repository's license covers `custom/`, `docs/`, `scripts/`
and the repository's own configuration files.
