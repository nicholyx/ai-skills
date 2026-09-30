<div align="center">

# ai-skills

15 self-maintained general-purpose skills plus 1 project-specific one: git workflows, code
review, bug root-cause analysis, repository analysis, daily reports, Obsidian notes. Install
them into Claude Code, CodeBuddy, Codex or any other tool that reads `SKILL.md`, then trigger
them in plain language.

```bash
npx skills add nicholyx/ai-skills
```

Another 31 third-party skills are vendored here but **not installed by that command** —
see [Skills](#skills).

[![skills.sh](https://skills.sh/b/nicholyx/ai-skills)](https://skills.sh/nicholyx/ai-skills)
[![CI](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholyx/ai-skills/actions/workflows/ci.yml)
[![静态检查](https://img.shields.io/badge/%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5-18%20%E9%A1%B9-brightgreen)](https://github.com/nicholyx/ai-skills/blob/main/scripts/lint.sh)
[![License](https://img.shields.io/github/license/nicholyx/ai-skills)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nicholyx/ai-skills?style=social)](https://github.com/nicholyx/ai-skills/stargazers)

[Quick Start](#quick-start) · [Skills](#skills) · [Usage Guide](docs/USAGE.en.md) · [Write a Skill](#writing-your-own-skill) · [When it breaks](#when-something-breaks) · [Changelog](CHANGELOG.md)

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

A **personal** repository of agent skills — the `SKILL.md` format that Claude Code,
CodeBuddy, Codex, Cursor and a couple of dozen other tools understand. Install it with
[`npx skills`](https://www.npmjs.com/package/skills) and the skills become part of your
local AI environment.

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

### 2. Try one before you install it

**Not sure whether you want it? Any skill can be tried without installing it.** Put a skill
name from the [skill catalogue](docs/SKILLS.md) in place of `<skill>`:

```bash
npx skills use nicholyx/ai-skills@<skill>
```

It prints a prompt you can paste straight to your AI — **no install, no config change**, and
you can walk away afterwards. The only thing that lands on disk is the skill file it downloads
to a system temp directory for the AI to read (see
[the usage guide](docs/USAGE.en.md#step-0-try-one-first-optional-recommended) for the exact
path). Carry on below once you like what you see.

### 3. Install

```bash
# Install everything this repository ships (16 skills)
npx skills add nicholyx/ai-skills

# Install only the general-purpose ones, skipping the single project-specific skill (15)
npx skills add nicholyx/ai-skills/custom/daily
```

**What you get is the skills under `custom/`** — the ones this repository maintains and ships.
That is the whole install surface; the CLI confirms the count before it does anything:

```text
◇  Source: https://github.com/nicholyx/ai-skills.git
◇  Found 16 skills
●  Installing all 16 skills
◇  79 agents
●  Installing to: Antigravity, Claude Code, OpenClaw, Cline, CodeBuddy, Codex, Cursor, …
◇  Installation Summary
│  ./.agents/skills/git-commit
│    …
└  Done!  Review skills before use; they run with full agent permissions.
```

(Abridged from a real run. `custom/daily` prints `Found 15 skills` instead. Each skill gets
one block listing which agents receive a copy and which receive a symlink.)

> ⚠️ **The project-specific skill under `custom/projects/` IS installed by the default command**
> (16 = 15 general-purpose + 1 project-specific). It assumes you are working inside that
> specific project — specific pages, specific endpoints, specific startup steps — so anywhere
> else it is just noise. Use the second command to skip it.

> 💡 `--full-depth` installs **exactly the same 16 skills**. It only changes how deep the CLI
> searches for `SKILL.md` files, which makes no difference to this repository's layout.
> There is no reason to reach for it.

#### The third channel: the Claude Code plugin marketplace

If Claude Code is the only tool you use, you can also go through its own plugin channel. The
repository's [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) is what it
reads, and it lists exactly the 16 skills this repository ships:

```bash
claude plugin marketplace add nicholyx/ai-skills
claude plugin install ai-skills@ai-skills
```

| | `npx skills add nicholyx/ai-skills` | `claude plugin …` |
| --- | --- | --- |
| Lands in | Each AI tool's skill directory (see the matrix below) | The plugin location Claude Code manages (`~/.claude/plugins/`) |
| Skill name | The original, e.g. `daily-report` | Prefixed with the plugin: `ai-skills:daily-report` |
| When to use it | You also want to sync to tools other than Claude Code | Claude Code only, managed from the `/plugin` panel |

> **Measured** (Claude Code 2.1.283): `claude plugin validate .` passes; once installed,
> `claude plugin details ai-skills` lists `Skills (16)`. The manifest is a **generated file** —
> re-run `node scripts/gen-catalogue.js --write` after adding or removing a skill, and CI
> asserts it matches the skills themselves.

> 💡 It also **pins the discovery surface to the 16 declared skills**. Without it, `npx skills`
> falls back to scanning the tree, and a stray copy of a skill lying around in the working
> directory (a backup snapshot, a worktree copy) can be picked up as if it were installable.
> With it, what the repository declares is what gets found.

### 4. Where it landed, and how to confirm it works

By default `skills` installs at **project level**: a copy lands in `./.agents/skills/<name>/`
and is symlinked into the detected agents' directories in the same project, e.g.
`./.claude/skills/<name>`. Add `-g` / `--global` for a user-level install instead, which puts
it under `~/.claude/skills/` (and the equivalents for other tools).

So the agent directories are *views*, not storage: editing `./.claude/skills/<name>/SKILL.md`
edits the copy under `.agents/skills/` — the very directory `npx skills update` replaces
wholesale. Anything you want to keep belongs outside `.agents/`.

```bash
# What did I install, and where did it go?
npx skills list

# Or just look (project-level install shown here)
ls .claude/skills/

# A user-level install (-g) is here instead
ls ~/.claude/skills/
```

#### Compatibility matrix: where skills land, and at which level

`npx skills` installs at **project level** by default (the current directory); `-g` /
`--global` is what makes it **user level** (available in every project). There is only ever one
copy of a skill's real files — each tool directory holds a symlink to it, so editing one place
updates them all.

| AI tool | Project level (default) | User level (`-g`) |
| --- | --- | --- |
| Claude Code | `./.claude/skills/<name>/` | `~/.claude/skills/<name>/` |
| CodeBuddy | `./.codebuddy/skills/<name>/` | `~/.codebuddy/skills/<name>/` |
| Other tools that read `SKILL.md` (Codex, Cursor, …) | Decided by the CLI from the tools it detects; `-a '*'` installs to all of them | Same |

Everything in that table is sourced from the repository rather than from memory:

- "Project level by default, `-g` for user level": the exact wording of `npx skills add --help`
  (CLI 1.7.0) — `-g, --global  Install skill globally (user-level) instead of project-level` —
  **measured**
- `./.claude/skills/`: the "Where the skills land" section of
  [docs/USAGE.en.md](docs/USAGE.en.md)
- `~/.claude/skills/` and `~/.codebuddy/skills/`: the `skills-sync` parameter table in
  [docs/USAGE.md](docs/USAGE.md) — these two are the directories this repository has
  **actually verified**
- The tool directory *names* (`.claude/skills`, `.codebuddy/skills`, `.codex/skills`,
  `.cursor/skills`, …): the `skills` CLI's built-in agent list (v1.7.0 locally). Apart from the
  two above, this repository has **not** verified the rest one by one

#### Say one sentence to confirm the skill fires

**Trigger a skill with one sentence.** A skill is selected by the `description` field in its
`SKILL.md` frontmatter, so the most direct check is to say something that matches it. These
three are taken from the skills' own `metadata.example` — the **original wording** of the
"You can say this" column in the [skill catalogue](docs/SKILLS.md), not invented here:

| Say this | Skill | What you should see |
| --- | --- | --- |
| `生成今天的日报` | `daily-report` | Asks about the report template first; only then runs `git log` and groups by module |
| `审查一下我暂存区的改动` | `code-reviewer-agent` | **Opens a subagent with its own context** to review `git diff --cached`, returns it verbatim |
| `技能装了但用不了，帮我看看` | `skills-doctor` | Four steps: install location, broken symlinks, whether `SKILL.md` loads, shadowing |

**If the skill fires, you are done; no reaction means the install is wrong.** The skill
descriptions in this repository are mostly written in Chinese. That is not a blocker — the
model reads the description directly, and skill *names* are English, so naming the skill
(`use git-commit`) always works.

If the AI does not follow the skill's process, see
[When something breaks](#when-something-breaks).

### 5. Update and remove

```bash
npx skills update          # update installed skills to their latest versions
npx skills remove <name>   # remove one skill
npx skills remove --all    # remove every installed skill
```

> ⚠️ **`npx skills update` is a wholesale replacement by design.** Any local edit you made to
> a file under `.agents/skills/` disappears on the next run. That is not a bug, it is what a
> vendor area means. Changes you want to keep belong in `custom/`.

### 6. The 31 upstream skills are *not* installed by any of this

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

### General-purpose (`custom/daily/`, 15)

These 15 are project-agnostic and are the bulk of what `npx skills add nicholyx/ai-skills`
installs.

The authoritative one-line description of each skill lives in its `SKILL.md` frontmatter
(mostly Chinese — that is the canonical text; the boundary is described at the top of this
page). Each skill declares **two** such fields, and this table uses the human one:

| Field | Written for | Shape |
| --- | --- | --- |
| `description` | the model | stuffed with trigger words; the longest here runs to nearly 300 characters |
| `metadata.tagline` | people | one sentence saying what it does |

The "What it does" column below summarises each skill's `metadata.tagline` — **the same
field the generated Chinese table is built from**. Dropping `description` in there is the
difference between a scannable table and a paragraph per row.

**The "You can say this" column is not invented here** — each sentence is copied verbatim
from that skill's own `metadata.example`, the field the generated Chinese catalogue is
asserted against. Those sentences are Chinese; say them as written, or name the skill in
English.

| Skill | What it does | You can say this |
| --- | --- | --- |
| `bug-analyzer-agent` | Digs for a bug's root cause in a dedicated-context subagent, down to the execution flow | 「这个接口偶尔返回 500，帮我查根因」 |
| `code-reviewer-agent` | Code review in a dedicated-context subagent: security, performance, production reliability | 「审查一下我暂存区的改动」 |
| `daily-report` | Builds a work daily report from git history, grouped by project | 「生成今天的日报」 |
| `git-commit` | Writes the commit message to the Conventional Commits spec, then commits | 「帮我提交」 |
| `git-smart-update` | Smart pull with a stash cycle: handles local edits and conflicts for you | 「更新代码」 |
| `git-sync-upstream` | Syncs a fork with upstream by rebase, keeping the history linear | 「同步 upstream」 |
| `github-issue-autofix-workflow` | Fixes a GitHub issue end to end: brainstorm → TDD → code review | 「帮我修一下 issue 42」 |
| `maintain-loop` | The open-source maintenance loop: plan → implement → release → plan again | 「继续走维护流程」 |
| `obsidian-note-workflow` | Preview-first Obsidian notes: create, classify, initialise a whole vault | 「把这段内容记到我的 Obsidian 里」 |
| `oss-bootstrap` | Turns a bare repo into a standards-compliant project: CI, governance, templates, docs | 「给这个项目加上开源规范」 |
| `repo-analyzer` | Parallel subagents read an unfamiliar repo; reports architecture and business flows | 「深入研究一下这个项目」 |
| `skills-doctor` | Diagnoses "installed but never triggers": location, broken symlinks, load failures, shadowing | 「技能装了但用不了，帮我看看」 |
| `skills-sync` | Symlinks skills and commands into Claude / CodeBuddy (and other tools) | 「把我的技能同步到 Claude」 |
| `update-claude-code` | Checks for and installs the latest Claude Code | 「更新 claude」 |
| `update-opencode` | Updates the OpenCode CLI and the oh-my-opencode plugin | 「更新 opencode」 |

> ℹ️ The table above is hand-maintained, so it is **not** byte-compared against the generator
> the way the Chinese ones are. Two things about it *are* asserted, though: every self-maintained
> skill must appear in one of these tables (drop a row and CI fails — the skill would be
> invisible to anyone reading this page), and the counts written here must match the repository.
> That second check is new: `skills-doctor` was missing from this table for a while and nothing
> caught it, because a stale count and a missing row look the same.
>
> The two tables in the [Chinese README](README.md) are **generated** from
> each skill's `metadata`, between `<!-- SKILLS-TABLE:START … -->` markers, and CI asserts
> they match byte for byte — never hand-edit inside those markers. The generated
> [skill catalogue](docs/SKILLS.md) (Chinese) is the canonical list; when the two disagree,
> that one is right. Trigger conditions and execution flow for any skill are in its own
> `SKILL.md`; for `skills-sync`'s parameters see
> [the usage guide](docs/USAGE.en.md#skills-sync-sharing-one-local-copy-across-tools).

### Project-specific (`custom/projects/`, 1)

| Skill | What it does | You can say this |
| --- | --- | --- |
| `prj-agent-platform-e2e-test` | End-to-end verification of the Agent platform's core features using `agent-browser` | 「跑一遍 Agent 平台的端到端测试」 |

> ⚠️ **Not suitable for a general install.** These skills assume you are working on that
> specific project — specific pages, specific endpoints, specific startup steps. Run them
> against another repository and you just get irrelevant instructions. The `prj-` prefix
> exists so this is obvious from the name alone.

---

## Layout

```text
ai-skills/
├── .agents/skills/         # Upstream vendored skills (31, read-only, the bulk of the repo size)
├── .claude-plugin/         # Claude Code plugin marketplace manifest (generated, see "The third channel")
├── custom/
│   ├── daily/              # Self-maintained general skills (15)
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
custom/daily/<name>/SKILL.md       # self-maintained general, 15
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
# Run the local checks before committing (18 checks)
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
