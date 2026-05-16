---
name: extension-dev-skill
description: >-
  AI Skill for building EasyEDA Pro extension plugins. Used when users need to create,
  modify, or debug EasyEDA Pro plugins, including generating plugin code,
  querying API documentation, configuring extension.json, and handling i18n localization.
  Trigger words: "EasyEDA", "嘉立创EDA", "EDA plugin", "EDA extension", "extension.json",
  "pro-api-types", "原理图", "PCB设计"
tags:
  - EDA
  - EasyEDA
  - plugin
  - extension
  - PCB
  - schematic
  - 嘉立创
license: MIT
compatibility: Build requires Node.js 18+; runtime is EasyEDA Pro browser sandbox
metadata:
  author: JLCEDA
  version: "2.0.0"
---

# extension-dev-skill

AI Skill for EasyEDA Pro extension plugin development. Provides scenario-driven recipes, complete API reference, code generation standards, and debugging toolchain.

## Core Principles

1. **Never guess APIs** — Check `resources/references/` first; no matching doc = does not exist
2. **Verify mount path** — Class name ≠ eda property name. Always confirm via the mapping table below
3. **Verify return types** — `get()` and `getAll()` on the same class may return different interface types
4. **SCH modify ≠ PCB modify** — SCH uses class-level `modify()` method; PCB uses `setState_*().done()` chain
5. **Browser APIs forbidden in main process** — No `localStorage`, `window`, `document`; allowed inside iframe only
6. **Document type values** — SCH=1, PCB=3, FOOTPRINT=4 (PCB is NOT 2)
7. **console.log forbidden** — Only `console.warn` and `console.error` are allowed in generated code

## When to Use

**Applicable:**
- Creating or modifying EasyEDA Pro extension plugins
- Querying API method signatures via `resources/` documentation
- Configuring `extension.json`, locales i18n files, or build processes
- Automating plugin import/debugging via `eext-dev-mcp` MCP tools

**Not applicable:**
- General TypeScript/JavaScript questions unrelated to EasyEDA Pro
- Non-EasyEDA Pro EDA tools
- Workspace has no `extension.json` and user did not request initialization

---

## Scenario Quick Reference (Recipes)

When user intent matches a scenario below, **read the corresponding recipe first** — it contains the complete call chain, step-by-step instructions, common errors, and code examples.

### Plugin Scaffolding & Document Info

| recipe | scenario |
|---|---|
| `recipes/create_menu_plugin.md` | Create a new plugin with menu registration and basic structure |
| `recipes/get_current_document.md` | Get current document info (type, UUID, project) — the most common starting point |

### Document Tree Management (DMT)

| recipe | scenario |
|---|---|
| `recipes/dmt_board_management.md` | Board management — create/delete/copy boards, get board info |
| `recipes/dmt_editor_control.md` | Editor control — open/close/activate documents, split screen, zoom, markers |
| `recipes/dmt_project_management.md` | Project/team/folder/workspace management |
| `recipes/dmt_schematic_pcb_management.md` | Schematic pages, PCB docs, panels — create/delete/copy/rename |

### Schematic Operations (SCH)

| recipe | scenario |
|---|---|
| `recipes/get_sch_components.md` | Get all schematic components (designator, value, package) |
| `recipes/modify_sch_component.md` | Modify schematic component properties (designator, position, custom props) |
| `recipes/export_sch_bom.md` | Export BOM from schematic (all components with attributes) |
| `recipes/sch_wire_bus_operations.md` | Wire and bus operations — create/get/modify wires, get net info |
| `recipes/sch_pin_operations.md` | Get component pins — key pitfall: getAllPinsByPrimitiveId vs sch_PrimitivePin |
| `recipes/sch_primitives_bindraw.md` | Drawing primitives — arcs, circles, rectangles, polygons, text |
| `recipes/sch_document_operations.md` | Save, import changes from PCB, auto-layout, auto-routing |
| `recipes/sch_netlist_operations.md` | Netlist operations — get/update netlist |
| `recipes/sch_drc_check.md` | Schematic DRC (Design Rule Check) |
| `recipes/sch_event_bindraw.md` | Register schematic event callbacks (primitive/mouse events) |
| `recipes/sch_select_control.md` | Selection control — get/set selected, cross probe |
| `recipes/sch_manufacture_data.md` | Manufacturing data export — BOM file, netlist, PDF, component ordering |
| `recipes/sch_simulation_engine.md` | Simulation engine control and SCH utilities |

### PCB Operations (PCB)

| recipe | scenario |
|---|---|
| `recipes/get_pcb_components.md` | Get all PCB components (designator, position, layer, rotation) |
| `recipes/modify_pcb_primitive.md` | Modify PCB primitives — modify() and setState_*().done() chain |
| `recipes/pcb_net_query.md` | Query PCB nets and net classes |
| `recipes/pcb_primitives_bindraw.md` | PCB drawing primitives — lines, arcs, vias, pads, fills, text, pour, etc. |
| `recipes/pcb_document_operations.md` | Save (needs UUID!), import changes, coordinate conversion, zoom |
| `recipes/pcb_layer_operations.md` | Layer operations — visibility, color, lock, copper layer count |
| `recipes/pcb_select_control.md` | PCB selection control — get/set selected, cross probe |
| `recipes/pcb_drc_check.md` | PCB DRC, net class, differential pair, equal-length group management |
| `recipes/pcb_event_bindraw.md` | Register PCB event callbacks (primitive/mouse/net/cross-probe events) |
| `recipes/pcb_manufacture_data.md` | Manufacturing data — Gerber, BOM, pick-and-place, PCB/SMT ordering |
| `recipes/pcb_math_polygon.md` | Polygon math — boolean operations, area, image-to-polygon |

### Library Operations (LIB)

| recipe | scenario |
|---|---|
| `recipes/lib_device_search.md` | Search devices, get device info — canvas UUID ≠ library UUID pitfall |
| `recipes/lib_symbol_footprint.md` | Symbol and footprint search/get/preview |
| `recipes/lib_libraries_management.md` | Library list, classification, 3D models, CBB modules |

### System Operations (SYS)

| recipe | scenario |
|---|---|
| `recipes/iframe_custom_ui.md` | Create custom UI with iframe (data exchange) |
| `recipes/user_dialog_input.md` | Get user input via built-in dialogs (input, select, confirm) |
| `recipes/sys_storage_operations.md` | Data storage — extension user config (key required!) |
| `recipes/sys_http_request.md` | External HTTP requests (cURL) |
| `recipes/sys_file_operations.md` | File system — save/read files |
| `recipes/sys_menu_shortcut.md` | Header menu and shortcut key management |
| `recipes/sys_notification_message.md` | Toast messages, message box, loading/progress bar |
| `recipes/sys_environment_info.md` | Runtime environment info — version, theme, language |
| `recipes/sys_i18n_localization.md` | Internationalization (i18n) — multi-language support |
| `recipes/sys_window_operations.md` | Window, right-click menu, panel control, message bus |
| `recipes/sys_timer_websocket.md` | Timer and WebSocket operations |
| `recipes/sys_format_conversion.md` | Format conversion — Altium Designer, KiCad import/export |
| `recipes/sys_font_unit_tool.md` | Font management, unit conversion (mil), utility tools, logging |

---

## eda Property Mapping Table

**This is the authoritative mapping.** Use `eda.<property>` to access the corresponding class.

### DMT (Document Tree)

| eda property | Class | Description |
|---|---|---|
| `eda.dmt_Board` | DMT_Board | Board management |
| `eda.dmt_EditorControl` | DMT_EditorControl | Editor tab/split-screen control |
| `eda.dmt_Folder` | DMT_Folder | Folder management |
| `eda.dmt_Panel` | DMT_Panel | Panel management |
| `eda.dmt_Pcb` | DMT_Pcb | PCB document management |
| `eda.dmt_Project` | DMT_Project | Project management |
| `eda.dmt_Schematic` | DMT_Schematic | Schematic document management |
| `eda.dmt_SelectControl` | DMT_SelectControl | **Current document info** (`getCurrentDocumentInfo()`) |
| `eda.dmt_Team` | DMT_Team | Team management |
| `eda.dmt_Workspace` | DMT_Workspace | Workspace management |

### SCH (Schematic & Symbol)

| eda property | Class | Description |
|---|---|---|
| `eda.sch_Document` | SCH_Document | Save, import changes, auto-layout |
| `eda.sch_Drc` | SCH_Drc | Schematic DRC |
| `eda.sch_Event` | SCH_Event | Schematic events |
| `eda.sch_ManufactureData` | SCH_ManufactureData | Manufacturing data export |
| `eda.sch_Netlist` | SCH_Netlist | Netlist operations |
| `eda.sch_Primitive` | SCH_Primitive | Unified primitive operations (abstract) |
| `eda.sch_PrimitiveArc` | SCH_PrimitiveArc | Arc primitives |
| `eda.sch_PrimitiveAttribute` | SCH_PrimitiveAttribute | Attribute primitives |
| `eda.sch_PrimitiveBus` | SCH_PrimitiveBus | Bus primitives |
| `eda.sch_PrimitiveCircle` | SCH_PrimitiveCircle | Circle primitives |
| `eda.sch_PrimitiveComponent` | SCH_PrimitiveComponent | **Component primitives** (get/create/modify/delete) |
| `eda.sch_PrimitivePin` | SCH_PrimitivePin | Pin primitives (symbol editor only) |
| `eda.sch_PrimitivePolygon` | SCH_PrimitivePolygon | Polygon primitives |
| `eda.sch_PrimitiveRectangle` | SCH_PrimitiveRectangle | Rectangle primitives |
| `eda.sch_PrimitiveText` | SCH_PrimitiveText | Text primitives |
| `eda.sch_PrimitiveWire` | SCH_PrimitiveWire | Wire primitives |
| `eda.sch_SelectControl` | SCH_SelectControl | Selection control |
| `eda.sch_SimulationEngine` | SCH_SimulationEngine | Simulation engine |
| `eda.sch_Utils` | SCH_Utils | Utilities |

### PCB (PCB & Footprint)

| eda property | Class | Description |
|---|---|---|
| `eda.pcb_Document` | PCB_Document | Save, import changes, coordinate conversion |
| `eda.pcb_Drc` | PCB_Drc | PCB DRC |
| `eda.pcb_Event` | PCB_Event | PCB events |
| `eda.pcb_Layer` | PCB_Layer | Layer operations |
| `eda.pcb_ManufactureData` | PCB_ManufactureData | Manufacturing data / Gerber export |
| `eda.pcb_MathPolygon` | PCB_MathPolygon | Polygon math utilities |
| `eda.pcb_Net` | PCB_Net | Net operations |
| `eda.pcb_Primitive` | PCB_Primitive | Unified primitive operations (abstract) |
| `eda.pcb_PrimitiveArc` | PCB_PrimitiveArc | Arc primitives |
| `eda.pcb_PrimitiveAttribute` | PCB_PrimitiveAttribute | Attribute primitives |
| `eda.pcb_PrimitiveComponent` | PCB_PrimitiveComponent | **Component primitives** (get/create/modify/delete) |
| `eda.pcb_PrimitiveDimension` | PCB_PrimitiveDimension | Dimension primitives |
| `eda.pcb_PrimitiveFill` | PCB_PrimitiveFill | Fill primitives |
| `eda.pcb_PrimitiveImage` | PCB_PrimitiveImage | Image primitives |
| `eda.pcb_PrimitiveLine` | PCB_PrimitiveLine | Line primitives |
| `eda.pcb_PrimitiveObject` | PCB_PrimitiveObject | Binary embedded objects |
| `eda.pcb_PrimitivePad` | PCB_PrimitivePad | Pad primitives |
| `eda.pcb_PrimitivePolyline` | PCB_PrimitivePolyline | Polyline primitives |
| `eda.pcb_PrimitivePour` | PCB_PrimitivePour | Pour border primitives |
| `eda.pcb_PrimitivePoured` | PCB_PrimitivePoured | Pour fill primitives |
| `eda.pcb_PrimitiveRegion` | PCB_PrimitiveRegion | Region primitives |
| `eda.pcb_PrimitiveString` | PCB_PrimitiveString | Text primitives |
| `eda.pcb_PrimitiveVia` | PCB_PrimitiveVia | Via primitives |
| `eda.pcb_SelectControl` | PCB_SelectControl | Selection control |

### LIB (Library)

| eda property | Class | Description |
|---|---|---|
| `eda.lib_3DModel` | LIB_3DModel | 3D model library |
| `eda.lib_Cbb` | LIB_Cbb | Reuse module library |
| `eda.lib_Classification` | LIB_Classification | Library classification index |
| `eda.lib_Device` | LIB_Device | Device library (search/get devices) |
| `eda.lib_Footprint` | LIB_Footprint | Footprint library |
| `eda.lib_LibrariesList` | LIB_LibrariesList | Library list |
| `eda.lib_PanelLibrary` | LIB_PanelLibrary | Panel library |
| `eda.lib_SelectControl` | LIB_SelectControl | Library selection control |
| `eda.lib_Symbol` | LIB_Symbol | Symbol library |

### SYS (System)

| eda property | Class | Description |
|---|---|---|
| `eda.sys_ClientUrl` | SYS_ClientUrl | External HTTP requests (cURL) |
| `eda.sys_Dialog` | SYS_Dialog | **Dialogs** (message, input, select, confirm) |
| `eda.sys_Environment` | SYS_Environment | Runtime environment info |
| `eda.sys_FileManager` | SYS_FileManager | File manager |
| `eda.sys_FileSystem` | SYS_FileSystem | File system interaction |
| `eda.sys_FontManager` | SYS_FontManager | Font management |
| `eda.sys_FormatConversion` | SYS_FormatConversion | Format conversion (Altium/KiCad) |
| `eda.sys_HeaderMenu` | SYS_HeaderMenu | Header menu control |
| `eda.sys_I18n` | SYS_I18n | Internationalization |
| `eda.sys_IFrame` | SYS_IFrame | **IFrame windows** (custom UI) |
| `eda.sys_LoadingAndProgressBar` | SYS_LoadingAndProgressBar | Loading / progress bar |
| `eda.sys_Log` | SYS_Log | Logging |
| `eda.sys_Message` | SYS_Message | Non-intrusive notifications |
| `eda.sys_MessageBox` | SYS_MessageBox | Message box |
| `eda.sys_MessageBus` | SYS_MessageBus | Message bus |
| `eda.sys_PanelControl` | SYS_PanelControl | Panel control |
| `eda.sys_RightClickMenu` | SYS_RightClickMenu | Right-click menu |
| `eda.sys_Setting` | SYS_Setting | Settings |
| `eda.sys_ShortcutKey` | SYS_ShortcutKey | Shortcut key registration |
| `eda.sys_Storage` | SYS_Storage | **Storage** (extension user config) |
| `eda.sys_Timer` | SYS_Timer | Timer |
| `eda.sys_ToastMessage` | SYS_ToastMessage | Toast notifications |
| `eda.sys_Tool` | SYS_Tool | Utility tools |
| `eda.sys_Unit` | SYS_Unit | Unit conversion (mil-based) |
| `eda.sys_WebSocket` | SYS_WebSocket | WebSocket |
| `eda.sys_Window` | SYS_Window | Window operations |

### PNL (Panel)

| eda property | Class | Description |
|---|---|---|
| `eda.pnl_Document` | PNL_Document | Panel document operations |

---

## Critical Pitfalls (Must Read)

These are the most common errors. Violating any of these will produce broken code.

### 1. getCurrentDocumentInfo is on dmt_SelectControl, NOT sch_Document

```typescript
// ❌ WRONG — does not exist
eda.sch_Document.getCurrentDocumentInfo();

// ✅ CORRECT
const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
```

### 2. SCH modify() vs PCB setState_*().done()

```typescript
// ❌ SCH: setState_* does NOT commit changes
component.setState_Designator("B2"); // no effect

// ✅ SCH: use class-level modify()
await eda.sch_PrimitiveComponent.modify(primitiveId, { designator: "B2" });

// ✅ PCB: setState_* chain + done() commits
line.setState_StartX(100).setState_StartY(200).done();
```

### 3. get() vs getAll() return different interface types

```typescript
// get() returns ISCH_PrimitiveComponent — may NOT have getState_Designator()
// getAll() returns ISCH_PrimitiveComponent$1 — HAS getState_Designator()
const components = await eda.sch_PrimitiveComponent.getAll();
components[0].getState_Designator(); // ✓ works
```

### 4. SCH_Primitive / PCB_Primitive are abstract — no getAllPrimitiveId

```typescript
// ❌ WRONG — abstract class, no getAllPrimitiveId
eda.sch_Primitive.getAllPrimitiveId();

// ✅ CORRECT — use concrete class
const ids = await eda.sch_PrimitiveComponent.getAllPrimitiveId();
```

### 5. openIFrame — no query parameters allowed

```typescript
// ❌ WRONG
eda.sys_IFrame.openIFrame('/iframe/index.html?mode=add');

// ✅ CORRECT
eda.sys_IFrame.openIFrame('/iframe/index.html', 400, 500, 'my-id', { title: 'Title' });
```

### 6. IFrame data passing — window objects are isolated

```typescript
// ❌ WRONG — main process and iframe window are isolated
(window as any).__data = data;
window.parent.eda; // unnecessary

// ✅ Option A (recommended): use storage
await eda.sys_Storage.setExtensionUserConfig('myKey', data);
// In iframe: const data = await eda.sys_Storage.getExtensionUserConfig('myKey');

// ✅ Option B: use eda directly in iframe (both contexts have access)
// In iframe: const doc = await eda.dmt_SelectControl.getCurrentDocumentInfo();
```

### 7. sys_Storage requires a key parameter

```typescript
// ❌ WRONG — returns undefined
await eda.sys_Storage.getExtensionUserConfig();

// ✅ CORRECT
await eda.sys_Storage.getExtensionUserConfig('stats');
```

### 8. showInformationMessage does NOT render HTML

```typescript
// ❌ WRONG — HTML tags shown as plain text
eda.sys_Dialog.showInformationMessage('<b>Hello</b>');

// ✅ CORRECT — use iframe for HTML content
eda.sys_IFrame.openIFrame('/iframe/result.html', 600, 400);
```

### 9. Pins/Pads do NOT have getState_Net

```typescript
// ❌ WRONG — no getState_Net on pins
pin.getState_Net();

// ✅ SCH nets: get from wires
const wires = await eda.sch_PrimitiveWire.getAll();
wires[0].getState_Net();

// ✅ PCB nets: use pcb_Net
const nets = await eda.pcb_Net.getAll();
```

### 10. Canvas UUID ≠ Library UUID

```typescript
// ❌ WRONG — canvas primitiveId is not a library device UUID
const comp = await eda.sch_PrimitiveComponent.get(id);
comp.getState_Component().uuid; // this is a primitiveId, NOT device UUID

// ✅ CORRECT — use lib_Device.search() to get library device UUID
const results = await eda.lib_Device.search({ keyword: 'STM32' });
```

### 11. Menu Title i18n Uses `locales/extensionJson/`, NOT `locales/`

```typescript
// ❌ WRONG — menu titles are NOT translated via locales/en.json
// extension.json: "title": "%myplugin.menu.title%"  ← wrong syntax
// locales/en.json: { "myplugin.menu.title": "My Plugin" }  ← wrong location

// ✅ CORRECT — use plain text title, translate in locales/extensionJson/
// extension.json: "title": "My Plugin"
// locales/extensionJson/en.json: { "My Plugin": "My Plugin" }
// locales/extensionJson/zh-Hans.json: { "My Plugin": "我的插件" }
```

### 12. npm Packages Work in iframe, NOT in Main Process

```typescript
// ❌ WRONG — npm packages that depend on DOM/Node.js APIs won't work in src/
import Chart from 'chart.js'; // fails in EDA sandbox

// ✅ CORRECT — use npm packages in iframe/ code (standard browser context)
// iframe/app.ts: import Chart from 'chart.js'; // works fine
```

---

## API Documentation Structure

```
resources/
  experience.md                     # All pitfalls and lessons learned (15 items)
  guide/                            # Developer guide (concepts, best practices)
    index.md                        # What is the Extension API
    how-to-start.md                 # Environment setup and first extension
    invoke-apis.md                  # How to call APIs + debugging methods
    extension-json.md               # extension.json configuration reference
    i18n.md                         # Multi-language support
    inline-frame.md                 # IFrame custom UI windows
    error-handling.md               # Error handling and safety mode
    stability.md                    # API versioning and stability policy
    extensions-marketplace.md       # Extensions marketplace guide
    ancillary-projects.md           # Ancillary projects overview
    ancillary-projects/             # Ancillary project details
  references/                       # Complete API reference
    _index.md                       # Master index of all classes, enums, interfaces, types
    _quick-reference.md             # All method signatures for rapid lookup
    classes/                        # 120 class docs
    enums/                          # 62 enum docs
    interfaces/                     # 70 interface docs
    types/                          # 19 type alias docs
```

### How to Look Up API

**Recommended decision path:**

1. User need is a **multi-step scenario** (e.g., "export BOM", "create plugin with UI") → find the matching `recipes/` file
2. User need is a **single API detail** (e.g., "what params does modify() take") → read `references/classes/<ClassName>.md`
3. Need to find which class has a method → search in `references/_quick-reference.md`
4. Need enum values or interface properties → check `references/enums/` or `references/interfaces/`
5. Need concepts or patterns → read `guide/` files

---

## Execution Workflow

1. **Plan** — Understand requirements, confirm target editor (home/sch/pcb) and core functionality
2. **Init** — If workspace has no `extension.json`, run project initialization; otherwise skip
3. **Recipe** — Check if a matching recipe exists in `recipes/`; if yes, follow its call chain
4. **Query** — For APIs not covered by recipes, query `resources/references/` using the four-step method (find class → verify mount path → confirm signature → verify return interface)
5. **Validate** — Verify all type signatures are complete with no guesswork; if uncertain, return to Query
6. **Confirm** — **Always** present the implementation plan to the user before writing any code. The plan must include: API list, dependencies, data flow, and file changes. Then explicitly ask the user whether to proceed. Do not start code generation until the user confirms
7. **Execute** — After user confirmation, generate code; each API call corresponds to a verified signature, wrapped in `try/catch` with proper logging
8. **Lint** — Run `node scripts/lint-eda-api.js src/` to verify EasyEDA Pro API usage; fix any errors before proceeding
9. **Check** — Check runtime environment constraints; confirm no forbidden operations; verify all `headerMenus` IDs in `extension.json` are globally unique across all editor pages; verify menu title translations are in `locales/extensionJson/` (not `locales/`); if violations found, return to Execute to fix
10. **Doc** — Generate or update `README.md` and `CHANGELOG.md`
11. **Deploy** — Run `npm run build`; if `eext-dev-mcp` MCP tools are available, auto-import via `dev_plugin`; otherwise inform user to manually upload

### API Verification Checklist

- [ ] Found class doc in `resources/references/classes/`; confirmed method exists
- [ ] Read full method signature; confirmed all parameter types and counts
- [ ] Confirmed `eda.xxx_YYY` property exists (use mapping table above)
- [ ] Verified return interface has required methods (checked in `references/interfaces/`)
- [ ] If using `getAllPrimitiveId`, using a concrete class (not abstract SCH_Primitive/PCB_Primitive)
- [ ] Document type checks use correct values: SCH=1, PCB=3, FOOTPRINT=4
- [ ] All `headerMenus` IDs are globally unique across every editor page
- [ ] Menu title translations are in `locales/extensionJson/`, code translations in `locales/`
- [ ] Ran `node scripts/lint-eda-api.js src/` with no errors before building

---

## Project Initialization

When `extension.json` does not exist:

```bash
git clone https://github.com/easyeda/pro-api-sdk.git <project-name>
cd <project-name>
npm install
npm run build
```

## Runtime Environment Constraints

| Requirement | ❌ Forbidden | ✅ Recommended |
|---|---|---|
| Get user input | - | `eda.sys_Dialog.showInputDialog()` |
| User selection | - | `eda.sys_Dialog.showSelectDialog()` |
| Show message | `alert()` | `eda.sys_Dialog.showInformationMessage()` |
| Confirm action | `confirm()` | `eda.sys_Dialog.showConfirmationMessage()` |
| Toast notification | DOM manipulation | `eda.sys_Message.showToastMessage()` |
| Store data | `localStorage` (main) | `eda.sys_Storage.setExtensionUserConfig(key, value)` |
| Custom UI | Manipulate host DOM | `eda.sys_IFrame.openIFrame()` |
| Show HTML | `showInformationMessage(html)` | Must use iframe |
| Open link | `window.open()` | `eda.sys_Window.open()` |
| IFrame data | `window.__xxx` / `window.parent.eda` | `sys_Storage` or use `eda` directly in iframe |

---

## Error Handling and Logging Standards

### Logging Rules

| Level | API | Usage | Allowed |
|---|---|---|---|
| Warning | `console.warn('[PluginName]', ...)` | Non-critical: fallback values, empty results, deprecated usage | ✅ Yes |
| Error | `console.error('[PluginName]', ...)` | Failures: API call failed, data missing, operation aborted | ✅ Yes |
| Debug | `console.log(...)` | — | ❌ Forbidden |

- Always prefix with plugin name: `[MyPlugin]`
- Only `console.warn` and `console.error` are allowed — `console.log` is strictly forbidden

### try/catch Rules

1. Every `eda.*` API call must be wrapped in `try/catch`
2. Catch blocks must log with `console.error` and include the error object
3. Group related API calls in a single `try/catch` when they share a logical operation
4. Provide user-facing feedback on failure via `eda.sys_Dialog.showInformationMessage()` or `eda.sys_Message.showToastMessage()`

### Standard Code Pattern

```typescript
const PLUGIN_TAG = '[MyPlugin]';

export async function myFeature() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo) {
      console.warn(PLUGIN_TAG, 'No active document found, aborting');
      return;
    }
    // ... business logic
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to execute myFeature:', err);
    await eda.sys_Dialog.showInformationMessage('Operation failed. Check console for details.');
  }
}
```

### Defensive Checks

```typescript
const components = await eda.sch_PrimitiveComponent.getAll();
if (!components || components.length === 0) {
  console.warn(PLUGIN_TAG, 'No components found in current schematic');
  return;
}
```

---

## Plugin Documentation Generation

### README.md

After generating plugin code, always create or update `README.md`:
1. Plugin name and one-line description
2. Features list
3. Supported editors (home/sch/pcb/footprint)
4. Installation — build and import `.eext` file
5. Usage — menu access
6. Configuration — `extension.json` fields
7. Dependencies
8. Known limitations

### CHANGELOG.md

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [1.0.0] - YYYY-MM-DD
### Added
- Initial release with xxx feature
```

- Record every user-visible change (Added / Changed / Fixed / Removed)
- Update on every code generation or modification session

---

## Failure Strategies

| Situation | Action |
|---|---|
| API does not exist | Stop immediately, inform user |
| Signature uncertain | Stop generation, return to Query step |
| Workspace not initialized | Prompt user to initialize first |
| Forbidden DOM API used | Auto-replace with `eda.sys_*` alternatives |
| Menu ID conflict | Add plugin-specific prefix; scan all IDs and reject duplicates |

## References

- Scenario recipes → `recipes/` directory
- Quick method signatures → `resources/references/_quick-reference.md`
- Master API index → `resources/references/_index.md`
- Common pitfalls → `resources/experience.md`
- Developer guide → `resources/guide/`
- Full API reference → `resources/references/`
