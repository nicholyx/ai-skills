# 库符号与封装操作：搜索、获取、创建、修改符号和封装

> **适用摘要**: 在综合库中搜索/获取/创建/修改符号和封装，支持在编辑器中打开预览。所有 BETA API。

## 触发意图

- "搜索库中的符号"
- "搜索库中的封装"
- "获取符号/封装详细信息"
- "在编辑器中打开符号/封装"
- "创建新的符号或封装"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求 |
| 库权限 | 需要对应库的读/写权限 |

## 调用链

```
Step 1: lib_LibrariesList.getSystemLibraryUuid() — 获取库 UUID
Step 2A: lib_Symbol.search(key, libraryUuid) — 搜索符号
  → lib_Symbol.get(symbolUuid, libraryUuid) — 获取符号属性
Step 2B: lib_Footprint.search(key, libraryUuid) — 搜索封装
  → lib_Footprint.get(footprintUuid, libraryUuid) — 获取封装属性
Step 3: [可选] lib_Symbol.openInEditor() / lib_Footprint.openInEditor() — 在编辑器打开
```

## 分步说明

### Step 1: 获取库 UUID

**API**: `eda.lib_LibrariesList.getSystemLibraryUuid()` / `getPersonalLibraryUuid()` / `getProjectLibraryUuid()`

**参考**: `../resources/references/classes/LIB_LibrariesList.md`

### Step 2A: 搜索符号

**API**: `eda.lib_Symbol.search(key, libraryUuid?, classification?, symbolType?, itemsOfPage?, page?)`

**参考**: `../resources/references/classes/LIB_Symbol.md`

**返回类型**: `Promise<Array<ILIB_SymbolSearchItem>>`

**参考接口**: `../resources/references/interfaces/ILIB_SymbolSearchItem.md`

### Step 2B: 搜索封装

**API**: `eda.lib_Footprint.search(key, libraryUuid?, classification?, itemsOfPage?, page?)`

**参考**: `../resources/references/classes/LIB_Footprint.md`

**返回类型**: `Promise<Array<ILIB_FootprintSearchItem>>`

**参考接口**: `../resources/references/interfaces/ILIB_FootprintSearchItem.md`

### Step 3: 获取详细属性

**符号**: `eda.lib_Symbol.get(symbolUuid, libraryUuid?)` → `ILIB_SymbolItem`

**封装**: `eda.lib_Footprint.get(footprintUuid, libraryUuid?)` → `ILIB_FootprintItem`

### Step 4: 在编辑器中打开

**符号**: `eda.lib_Symbol.openInEditor(symbolUuid, libraryUuid, splitScreenId?)`

**封装**: `eda.lib_Footprint.openInEditor(footprintUuid, libraryUuid, splitScreenId?)`

返回标签页 ID，可用于后续分屏操作。

## 代码示例

```typescript
const PLUGIN_TAG = '[LibSymbolFootprint]';

export async function searchSymbolAndFootprint() {
  try {
    const keyword = 'RES';

    // 搜索符号
    const symbols = await eda.lib_Symbol.search(keyword);
    if (!symbols || symbols.length === 0) {
      console.warn(PLUGIN_TAG, 'No symbols found');
    } else {
      console.warn(PLUGIN_TAG, `Found ${symbols.length} symbols`);

      // 获取第一个符号的详细信息
      const symbolInfo = await eda.lib_Symbol.get(symbols[0].uuid);
      if (symbolInfo) {
        console.warn(PLUGIN_TAG, 'Symbol name:', symbolInfo.name);
      }
    }

    // 搜索封装
    const footprints = await eda.lib_Footprint.search(keyword);
    if (!footprints || footprints.length === 0) {
      console.warn(PLUGIN_TAG, 'No footprints found');
    } else {
      console.warn(PLUGIN_TAG, `Found ${footprints.length} footprints`);
    }

    await eda.sys_Dialog.showInformationMessage(
      `符号: ${symbols?.length ?? 0} 个\n封装: ${footprints?.length ?? 0} 个`
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'Search failed:', err);
  }
}

export async function openSymbolInEditor() {
  try {
    const symbols = await eda.lib_Symbol.search('RES');
    if (!symbols || symbols.length === 0) {
      console.warn(PLUGIN_TAG, 'No symbols to open');
      return;
    }

    const sysLibUuid = await eda.lib_LibrariesList.getSystemLibraryUuid();
    if (!sysLibUuid) {
      console.warn(PLUGIN_TAG, 'System library UUID not found');
      return;
    }

    const tabId = await eda.lib_Symbol.openInEditor(symbols[0].uuid, sysLibUuid);
    if (tabId) {
      console.warn(PLUGIN_TAG, 'Opened symbol in editor, tab:', tabId);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to open symbol:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `search()` 不传 `libraryUuid` 搜不到 | 默认搜索系统库，目标可能在其他库 | 明确传入目标库 UUID |
| `openInEditor()` 返回 `undefined` | UUID 无效或库权限不足 | 确认 UUID 和 libraryUuid 正确 |
| `create()` 返回 `undefined` | 库内已存在同名符号/封装 | 使用不同名称或先删除已有项 |
| 所有方法标记为 BETA | API 可能在后续版本变更 | 关注版本更新日志 |

## 变体

- **创建符号**: `lib_Symbol.create(libraryUuid, symbolName, classification?, symbolType?, description?)`
- **创建封装**: `lib_Footprint.create(libraryUuid, footprintName, classification?, description?)`
- **修改符号/封装**: 使用 `modify()` 方法，传 `null` 可清除属性
- **更新文档源码**: `lib_Symbol.updateDocumentSource()` / `lib_Footprint.updateDocumentSource()`
- **复制到其他库**: 使用 `copy()` 方法跨库复制
