# 原理图与 PCB 文档树管理：创建/删除原理图图页、PCB 文档、面板

> **适用摘要**: 在当前工程内管理原理图（Schematic）、原理图图页（Schematic Page）、PCB 和面板（Panel）的文档树——创建、删除、复制、重命名、排序。

## 触发意图

- "创建新的原理图图页"
- "删除原理图"
- "复制原理图图页到另一个原理图"
- "创建 PCB 文档"
- "删除 PCB"
- "创建面板"
- "获取所有原理图图页信息"
- "重新排序原理图图页"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 用户已打开一个工程 |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前已打开工程
  → 原理图管理:
    → dmt_Schematic.getAllSchematicsInfo() — 获取所有原理图
    → dmt_Schematic.createSchematic(boardName?) — 创建原理图（BETA）
    → dmt_Schematic.createSchematicPage(schematicUuid) — 创建图页（BETA）
    → dmt_Schematic.deleteSchematicPage(schematicPageUuid) — 删除图页（BETA）
  → PCB 管理:
    → dmt_Pcb.getAllPcbsInfo() — 获取所有 PCB
    → dmt_Pcb.createPcb(boardName?) — 创建 PCB
    → dmt_Pcb.deletePcb(pcbUuid) — 删除 PCB
  → 面板管理:
    → dmt_Panel.getAllPanelsInfo() — 获取所有面板
    → dmt_Panel.createPanel() — 创建面板（BETA）
    → dmt_Panel.deletePanel(panelUuid) — 删除面板
```

## 分步说明

### Step 1: 原理图管理

**参考**: `../resources/references/classes/DMT_Schematic.md`

**获取信息**:
- `eda.dmt_Schematic.getAllSchematicsInfo()` → `Promise<Array<IDMT_SchematicItem>>`
- `eda.dmt_Schematic.getCurrentSchematicInfo()` → `Promise<IDMT_SchematicItem | undefined>`
- `eda.dmt_Schematic.getAllSchematicPagesInfo()` → `Promise<Array<IDMT_SchematicPageItem>>`
- `eda.dmt_Schematic.getCurrentSchematicPageInfo()` → `Promise<IDMT_SchematicPageItem | undefined>`

**参考接口**: `../resources/references/interfaces/IDMT_SchematicItem.md`、`../resources/references/interfaces/IDMT_SchematicPageItem.md`

**创建/删除**（均为 BETA）:
- `createSchematic(boardName?)` — 创建原理图，不指定 boardName 则为游离原理图
- `createSchematicPage(schematicUuid)` — 在指定原理图下创建图页
- `deleteSchematic(schematicUuid)` — 删除原理图（关联复用模块时同步删除 PCB 和复用模块符号）
- `deleteSchematicPage(schematicPageUuid)` — 删除图页

**复制**（BETA）:
- `copySchematic(schematicUuid, boardName?)` — 复制原理图
- `copySchematicPage(schematicPageUuid, schematicUuid?)` — 复制图页到指定原理图

**修改名称**（BETA）:
- `modifySchematicName(schematicUuid, schematicName)`
- `modifySchematicPageName(schematicPageUuid, schematicPageName)`

**排序图页**（BETA）:
- `reorderSchematicPages(schematicUuid, schematicPageItemsArray)` — 传入排序后的图页数组

### Step 2: PCB 管理

**参考**: `../resources/references/classes/DMT_Pcb.md`

**获取信息**:
- `eda.dmt_Pcb.getAllPcbsInfo()` → `Promise<Array<IDMT_PcbItem>>`
- `eda.dmt_Pcb.getCurrentPcbInfo()` → `Promise<IDMT_PcbItem | undefined>`

**参考接口**: `../resources/references/interfaces/IDMT_PcbItem.md`

**创建/删除**:
- `createPcb(boardName?)` — 创建 PCB，不指定 boardName 则为游离 PCB
- `deletePcb(pcbUuid)` — 删除 PCB（关联复用模块时同步删除原理图和复用模块符号）
- `copyPcb(pcbUuid, boardName?)` — 复制 PCB
- `modifyPcbName(pcbUuid, pcbName)` — 修改 PCB 名称

### Step 3: 面板管理

**参考**: `../resources/references/classes/DMT_Panel.md`

**获取信息**:
- `eda.dmt_Panel.getAllPanelsInfo()` → `Promise<Array<IDMT_PanelItem>>`
- `eda.dmt_Panel.getCurrentPanelInfo()` → `Promise<IDMT_PanelItem | undefined>`

**参考接口**: `../resources/references/interfaces/IDMT_PanelItem.md`

**创建/删除**:
- `createPanel()` — 创建面板（BETA）
- `deletePanel(panelUuid)` — 删除面板
- `copyPanel(panelUuid)` — 复制面板
- `modifyPanelName(panelUuid, panelName)` — 修改面板名称

## 代码示例

```typescript
const PLUGIN_TAG = '[DocTreeManager]';

export async function manageDocumentTree() {
  try {
    // 获取所有原理图
    const schematics = await eda.dmt_Schematic.getAllSchematicsInfo();
    console.warn(PLUGIN_TAG, `Found ${schematics.length} schematics`);

    // 获取当前原理图的所有图页
    const pages = await eda.dmt_Schematic.getCurrentSchematicAllSchematicPagesInfo();
    console.warn(PLUGIN_TAG, `Current schematic has ${pages.length} pages`);

    // 在当前原理图下创建新图页
    if (schematics.length > 0) {
      const newPageUuid = await eda.dmt_Schematic.createSchematicPage(
        schematics[0].uuid
      );
      if (!newPageUuid) {
        console.warn(PLUGIN_TAG, 'Failed to create schematic page');
      } else {
        console.warn(PLUGIN_TAG, `Created page: ${newPageUuid}`);
      }
    }

    // 获取所有 PCB
    const pcbs = await eda.dmt_Pcb.getAllPcbsInfo();
    console.warn(PLUGIN_TAG, `Found ${pcbs.length} PCBs`);

    // 创建面板
    const panelUuid = await eda.dmt_Panel.createPanel();
    if (!panelUuid) {
      console.warn(PLUGIN_TAG, 'Failed to create panel');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Document tree management failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `deleteSchematic` 同步删除了 PCB | 原理图关联了复用模块 | 了解复用模块关联关系，谨慎删除 |
| `deletePcb` 同步删除了原理图 | PCB 关联了复用模块 | 同上 |
| `createSchematicPage` 返回 `undefined` | schematicUuid 不正确 | 先用 `getAllSchematicsInfo()` 获取正确的 UUID |
| `reorderSchematicPages` 失败 | 传入的数组不是从上游方法获取的 | 必须先通过 `getAllSchematicPagesInfo()` 获取原始数组再排序 |
| 游离原理图/PCB | 创建时未指定 boardName | 传入 boardName 关联到板子 |

## 变体

- **修改原理图图页明细表**: 使用 `eda.dmt_Schematic.modifySchematicPageTitleBlock(showTitleBlock?, titleBlockData?)`（BETA）
- **获取指定原理图信息**: 使用 `eda.dmt_Schematic.getSchematicInfo(schematicUuid)`
- **获取指定 PCB 信息**: 使用 `eda.dmt_Pcb.getPcbInfo(pcbUuid)`
- **修改 PCB 名称时同步复用模块**: `modifyPcbName` 会自动同步关联的复用模块符号名称和原理图名称
