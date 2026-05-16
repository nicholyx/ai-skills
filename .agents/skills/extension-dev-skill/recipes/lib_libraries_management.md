# 库列表管理：获取库列表、库信息、分类、3D 模型、CBB 模块、面板库

> **适用摘要**: 管理综合库的库列表、分类索引、3D 模型、复用模块（CBB）、面板库，以及获取底部库选中行信息。

## 触发意图

- "获取所有库列表"
- "获取系统库/个人库/工程库 UUID"
- "查看库的分类信息"
- "搜索 3D 模型"
- "管理复用模块"
- "获取底部库选中行信息"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求（工程库需先打开工程） |
| 库权限 | 需要对应库的访问权限 |

## 调用链

```
Step 1: lib_LibrariesList — 获取库列表和特殊库 UUID
Step 2: lib_Classification — 获取/管理库分类
Step 3: [可选] lib_3DModel / lib_Cbb / lib_PanelLibrary — 搜索/管理对应资源
Step 4: [可选] lib_SelectControl — 获取底部库选中行信息
```

## 分步说明

### Step 1: 获取库列表

**API**: `eda.lib_LibrariesList`

**参考**: `../resources/references/classes/LIB_LibrariesList.md`

**关键方法**:
- `getAllLibrariesList()` → `Array<ILIB_LibraryInfo>` — 获取所有库（不含系统/个人/工程/收藏库）
- `getSystemLibraryUuid()` → `string | undefined`
- `getPersonalLibraryUuid()` → `string | undefined`
- `getProjectLibraryUuid()` → `string | undefined`（需先打开工程）
- `getFavoriteLibraryUuid()` → `string | undefined`

### Step 2: 获取库分类

**API**: `eda.lib_Classification`

**参考**: `../resources/references/classes/LIB_Classification.md`

**关键方法**:
- `getAllClassificationTree(libraryUuid, libraryType)` — 获取分类树
- `getNameByUuid(libraryUuid, libraryType, primaryUuid, secondaryUuid?)` — 按 UUID 获取分类名

**参考枚举**: `../resources/references/enums/ELIB_LibraryType.md`

### Step 3: 3D 模型操作

**API**: `eda.lib_3DModel`

**参考**: `../resources/references/classes/LIB_3DModel.md`

**关键方法**: `search()`, `get()`, `create()`, `modify()`, `delete()`, `copy()`

### Step 4: 复用模块（CBB）操作

**API**: `eda.lib_Cbb`

**参考**: `../resources/references/classes/LIB_Cbb.md`

**关键方法**: `search()`, `get()`, `create()`, `modify()`, `delete()`, `copy()`, `openProjectInEditor()`, `openSymbolInEditor()`

### Step 5: 面板库操作

**API**: `eda.lib_PanelLibrary`

**参考**: `../resources/references/classes/LIB_PanelLibrary.md`

**关键方法**: `search()`, `get()`, `create()`, `modify()`, `delete()`, `copy()`, `openInEditor()`

### Step 6: 获取底部库选中行

**API**: `eda.lib_SelectControl.getSelectedLibraryRowInfo()`

**参考**: `../resources/references/classes/LIB_SelectControl.md`

**返回类型**: `Promise<ILIB_LibraryItem | undefined>`

## 代码示例

```typescript
const PLUGIN_TAG = '[LibManagement]';

export async function listLibraries() {
  try {
    // 获取特殊库 UUID
    const sysLibUuid = await eda.lib_LibrariesList.getSystemLibraryUuid();
    const personalLibUuid = await eda.lib_LibrariesList.getPersonalLibraryUuid();
    const projectLibUuid = await eda.lib_LibrariesList.getProjectLibraryUuid();

    console.warn(PLUGIN_TAG, 'System lib:', sysLibUuid);
    console.warn(PLUGIN_TAG, 'Personal lib:', personalLibUuid);
    console.warn(PLUGIN_TAG, 'Project lib:', projectLibUuid);

    // 获取所有其他库
    const allLibs = await eda.lib_LibrariesList.getAllLibrariesList();
    console.warn(PLUGIN_TAG, `Found ${allLibs.length} additional libraries`);

    await eda.sys_Dialog.showInformationMessage(
      `系统库: ${sysLibUuid ? '✓' : '✗'}\n个人库: ${personalLibUuid ? '✓' : '✗'}\n工程库: ${projectLibUuid ? '✓' : '✗'}\n其他库: ${allLibs.length} 个`
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to list libraries:', err);
  }
}

export async function getClassificationTree() {
  try {
    const sysLibUuid = await eda.lib_LibrariesList.getSystemLibraryUuid();
    if (!sysLibUuid) {
      console.warn(PLUGIN_TAG, 'System library not found');
      return;
    }

    // libraryType: 0=器件, 1=符号, 2=封装, 3=3D模型, 4=复用模块, 5=面板库
    const tree = await eda.lib_Classification.getAllClassificationTree(sysLibUuid, 0);
    console.warn(PLUGIN_TAG, `Classification tree has ${tree.length} top-level categories`);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get classification:', err);
  }
}

export async function getSelectedLibRow() {
  try {
    const rowInfo = await eda.lib_SelectControl.getSelectedLibraryRowInfo();
    if (!rowInfo) {
      console.warn(PLUGIN_TAG, 'No library row selected');
      await eda.sys_Dialog.showInformationMessage('请先在底部库面板中选中一行');
      return;
    }

    console.warn(PLUGIN_TAG, 'Selected row:', rowInfo);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get selected row:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getProjectLibraryUuid()` 返回 `undefined` | 未打开工程 | 先打开一个工程 |
| `getPersonalLibraryUuid()` 返回 `undefined` | 私有部署环境无个人库 | 检查部署环境类型 |
| `getAllLibrariesList()` 不含系统/个人/工程库 | 设计如此，需单独获取 | 使用对应的 `get*LibraryUuid()` 方法 |
| 分类 API 标记为 deprecated | 部分方法在 v3.2 后弃用 | 使用 `getAllClassificationTree()` 和 `getNameByUuid()` |

## 变体

- **搜索 3D 模型**: `eda.lib_3DModel.search(key, libraryUuid?)`
- **搜索复用模块**: `eda.lib_Cbb.search(key, libraryUuid?)`
- **搜索面板库**: `eda.lib_PanelLibrary.search(key, libraryUuid?)`
- **打开复用模块工程**: `eda.lib_Cbb.openProjectInEditor(cbbUuid, libraryUuid)` — 注意会丢失未保存数据
- **右键菜单集成**: 结合 `lib_SelectControl` 获取选中行，配合右键菜单操作
