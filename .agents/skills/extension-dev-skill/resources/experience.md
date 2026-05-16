# Common Pitfalls and Lessons Learned

> The following lessons come from real development experience. Pay close attention when developing plugins.

## 1. Always Verify Class Existence First

- ❌ Assume a class exists (e.g., `pcb_PrimitivePolygon`, `sch_PrimitiveBezier`)
- ✅ Search the class name with `grepSearch`; no results = does not exist, do not use

## 2. Document Type Values

- Use `docInfo.documentType` (not `docInfo.type`)
- Enum values (`EDMT_EditorDocumentType`):
  - `HOME = -1`, `BLANK = 0`, `SCHEMATIC_PAGE = 1`, `SYMBOL_COMPONENT = 2`
  - `PCB = 3` (not 2!), `FOOTPRINT = 4`, `PANEL = 26`

## 3. API Mount Modules

- ❌ `eda.sch_Document.getCurrentDocumentInfo()` — does not exist
- ✅ `getCurrentDocumentInfo` is on `eda.dmt_SelectControl`
- Query flow: Search method name → Find owning class → Search class mount path on `eda`

## 4. IFrame Data Passing

- ✅ Both main process and iframe can access the `eda` object
- ✅ Option A (recommended): Store with `eda.sys_Storage.setExtensionUserConfig(key, value)`, read in iframe
- ✅ Option B: Call eda API directly from iframe
- ❌ `(window as any).__xxx = data` — main process and iframe window objects are isolated
- ❌ `window.parent.eda` — just use `eda` directly

## 5. Getting Primitive Counts

- `SCH_Primitive` and `PCB_Primitive` are abstract classes without `getAllPrimitiveId`
- Component count: `eda.sch_PrimitiveComponent.getAllPrimitiveId()`
- Other primitives: Use the `getAll()` method
- Component pins: `eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(componentId)`
- `SCH_PrimitivePin.getAll()` is only available in the symbol editor

## 6. Canvas UUID ≠ Library UUID

- `component.getState_Component().uuid` obtained from canvas is a primitiveId
- `lib_Device.get()` requires the device UUID (device UUID in the library)
- Correct approach: Use the UUID from `lib_Device.search()` results

## 7. Different Methods on the Same Class Return Different Interface Types

```typescript
// get() returns ISCH_PrimitiveComponent — does not have getState_Designator()
// getAll() returns ISCH_PrimitiveComponent$1 — has getState_Designator()
const components = await eda.sch_PrimitiveComponent.getAll();
components[0].getState_Designator(); // ✓
```

## 8. setState_* Behavior Differs Between PCB and SCH

**SCH primitives**: `setState_*` does NOT commit changes; you must use the class-level `modify()` method.

```typescript
// ❌ SCH: setState_* only returns an object reference, does not commit
component.setState_Designator("B2");

// ✅ SCH: Use the modify method
await eda.sch_PrimitiveComponent.modify(primitiveId, { designator: "B2" });
```

**PCB primitives**: `setState_*` supports method chaining and commits via `.done()`.

```typescript
// ✅ PCB: setState_* chain + done() commits the change
line.setState_StartX(100).setState_StartY(200).done();
```

## 9. openIFrame API Parameters

```typescript
// ✅ Correct signature
eda.sys_IFrame.openIFrame('/iframe/index.html', 400, 500, 'my-id', { title: 'Title' });

// ❌ Query parameters are not allowed
eda.sys_IFrame.openIFrame('/iframe/index.html?mode=add'); // Error
```

## 10. Resource Paths Inside iframe

- CSS/JS in HTML should use full paths: `/iframe/style.css`, `/iframe/renderer.js`
- Do not use relative paths

## 11. sys_Storage API Requires a Key

```typescript
// ✅ Correct
await eda.sys_Storage.setExtensionUserConfig('stats', data);
const stats = await eda.sys_Storage.getExtensionUserConfig('stats');

// ❌ Not passing a key returns undefined
await eda.sys_Storage.getExtensionUserConfig(); // undefined
```

## 12. Pins/Pads Do Not Have a getState_Net Method

- Nets can only be obtained from wires (SCH): `eda.sch_PrimitiveWire.getAll()` → `wire.getState_Net()`
- PCB nets: `eda.pcb_Net.getAll()` → `netInfo.getNetName()`

## 13. Displaying HTML Content Requires iframe

- `showInformationMessage()` does not support rendering HTML; it only displays plain text
- Complex HTML (tables, styles, etc.) must use `eda.sys_IFrame.openIFrame()`

## 14. headerMenus id Must Be Globally Unique

- All `headerMenus[].id` values must be unique across ALL editor pages (home/sch/pcb/footprint/panel etc.)
- Duplicate IDs — even across different editor pages — cause only the first menu to render
- Always add a plugin-specific prefix to differentiate (e.g., `myplugin-home`, `myplugin-sch`, `myplugin-pcb`)
- Nested `menuItems` IDs must also be globally unique
- Before finalizing `extension.json`, scan every ID and reject duplicates

## 15. Prefer Built-in Dialogs

- `showInputDialog` + callback is simpler and more stable than iframe
- `showSelectDialog` supports single and multi-select
- Avoid unnecessary iframe communication complexity

## 16. Menu Title i18n Uses `locales/extensionJson/`, NOT `locales/`

- `extension.json` menu `title` values are translated via `locales/extensionJson/en.json` and `locales/extensionJson/zh-Hans.json`
- The title text itself is the lookup key (e.g., `"title": "About..."` → key is `"About..."`)
- ❌ Do NOT use `%key%` syntax in menu titles — that pattern does not apply here
- ❌ Do NOT put menu translations in `locales/en.json` — that file is for `sys_I18n.text()` code-level translations only
- ✅ `locales/extensionJson/zh-Hans.json`: `{ "About...": "关于..." }`

## 17. npm Packages Can Be Used in iframe

- The `iframe/` directory runs in a standard browser context, so bundled npm packages work normally
- Install via `npm install` and import in iframe source files; the build process handles bundling
- This does NOT apply to `src/` main process code, which runs in the EDA sandbox with restricted APIs
- Common use cases: chart libraries, UI frameworks, utility libraries (lodash, dayjs, etc.)

## 18. Always Run Lint Before Build

- The SDK includes a custom lint script (`node scripts/lint-eda-api.js src/`) to verify EasyEDA Pro API usage
- Run `node scripts/lint-eda-api.js src/` before `npm run build` to catch API usage errors early
- Use `npm run fix` to auto-fix fixable style issues
