# AGENTS.md — Supplementary Agent Guide

> Core rules, mapping table, pitfalls, recipes index, execution workflow, and error handling standards are all in `SKILL.md`.
> This file covers **only** conventions and tooling guidance not present in `SKILL.md`. Do not duplicate content.

## Project Context

**Language**: TypeScript · **Runtime**: EasyEDA Pro browser sandbox (not Node.js)

## grepSearch Standards

| Search Target | Correct Pattern | Incorrect Pattern |
|---|---|---|
| Class/Interface name | `SCH_PrimitiveComponent` | `class SCH_PrimitiveComponent` |
| Method name | `getCurrentDocumentInfo` | `function getCurrentDocumentInfo` |
| Enum name | `EDMT_EditorDocumentType` | `enum EDMT_EditorDocumentType` |
| eda property | `dmt_SelectControl` | `eda.dmt_SelectControl` |

When you already know the class name, prefer reading the doc file directly (e.g., `resources/references/classes/DMT_SelectControl.md`) over broad grepSearch.

## Recursive Query Triggers

When an API query result contains any of the following, continue querying recursively:

1. Returns `Promise<IPCB_*>` or `Promise<ISCH_*>` → Read the corresponding interface doc in `references/interfaces/`
2. Parameter contains a complex interface → Read its interface doc for property structure
3. Interface has inheritance → Read both parent and child docs
4. Return value is a union type → Read each member's doc
5. Enum type parameter → Read the enum doc in `references/enums/` for all possible values

## Code Generation Conventions

> Core rules (try/catch, browser API restrictions, logging standards, defensive checks) are in `SKILL.md`. Below are additional conventions only:

- npm dependencies can be imported as needed; update `package.json` accordingly
- Define a `PLUGIN_TAG` constant at the top of each file for consistent log prefixes
- Prefer `async/await` over `.then()` chains
- All generated code must be valid TypeScript; avoid `any` unless unavoidable

## Generated Plugin Project Structure

```
├── src/                          Main plugin code (src/index.ts entry point)
├── iframe/                       Frontend code for custom UI panels
├── locales/                      i18n files (en.json + zh-Hans.json)
│   └── extensionJson/            Menu title translations (en.json + zh-Hans.json)
├── images/                       Extension preview images
├── build/                        Build output directory
├── extension.json                Plugin metadata and menu configuration
├── package.json                  NPM configuration
├── eslint.config.mjs             ESLint configuration
└── tsconfig.json                 TypeScript compilation configuration
```

## Menu Title i18n: Use `locales/extensionJson/`

Menu titles in `extension.json` are **not** translated via `locales/en.json`. They use a separate directory: `locales/extensionJson/`.

- `locales/en.json` + `locales/zh-Hans.json` — for code-level `eda.sys_I18n.text()` translations
- `locales/extensionJson/en.json` + `locales/extensionJson/zh-Hans.json` — for `extension.json` `headerMenus[].title` translations

The `title` value in `extension.json` is used as the lookup key in `locales/extensionJson/`:

```json
// extension.json
{ "id": "About", "title": "About...", "registerFn": "about" }
```

```json
// locales/extensionJson/en.json
{ "About...": "About..." }

// locales/extensionJson/zh-Hans.json
{ "About...": "关于..." }
```

> ⚠️ Do **not** use `%key%` syntax in `extension.json` menu titles. The title text itself is the key, matched directly against `locales/extensionJson/` files.

## npm Packages in iframe

npm dependencies **can** be used inside `iframe/` code. The iframe runs in a standard browser context, so bundled npm packages (e.g., chart libraries, UI frameworks, utility libraries) work normally.

- Install via `npm install <package>` and import in iframe source files
- The build process bundles iframe dependencies into the output
- Update `package.json` accordingly when adding new dependencies
- This does **not** apply to `src/` main process code, which runs in the EDA sandbox

## Lint Script for Code Validation

The SDK includes ESLint with `@antfu/eslint-config`. Use it to catch errors before building:

```bash
npm run fix           # Auto-fix issues
```

Add `node scripts/lint-eda-api.js src/` as a validation step before `npm run build` in the execution workflow.

## MCP Debugging Workflow (Optional)

Requires the `eext-dev-mcp` MCP service:

1. Build: `npm run build` (output in `build/dist/*.eext`)
2. `listDirectory` to find the `.eext` absolute path
3. MCP `dev_plugin` to import
4. MCP `get_console_logs` to retrieve logs
5. Fix and repeat

Without MCP: manually upload the `.eext` file via the EDA Extension Manager.

## Do Not Modify

- `resources/guide/` and `resources/references/` — API documentation source
- `SKILL.md` front matter — Skill metadata
