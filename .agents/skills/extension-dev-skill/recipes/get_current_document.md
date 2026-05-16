# 获取当前文档信息：插件开发最常见的起点

> **适用摘要**: 获取当前打开的文档类型、UUID、所属工程信息。几乎所有插件功能的第一步。

## 触发意图

- "获取当前打开的文档信息"
- "判断当前是原理图还是 PCB"
- "获取当前文档的 UUID"
- 任何需要先判断当前编辑器类型再执行后续操作的场景

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 用户已打开至少一个文档（原理图/PCB/封装等） |
| 权限 | 无特殊权限要求 |

## 调用链

```
插件入口函数
  → Step 1: dmt_SelectControl.getCurrentDocumentInfo()
  → 获取 documentType, uuid, projectUuid
  → Step 2: 根据 documentType 分发到对应编辑器逻辑
```

## 分步说明

### Step 1: 获取当前文档信息

**API**: `eda.dmt_SelectControl.getCurrentDocumentInfo()`

**参考**: `../resources/references/classes/DMT_SelectControl.md`

**返回类型**: `Promise<IDMT_EditorDocumentItem | undefined>`

**参考接口**: `../resources/references/interfaces/IDMT_EditorDocumentItem.md`

**从响应获取**:
- `documentType` — 文档类型枚举值
- `uuid` — 文档 UUID
- `projectUuid` — 所属工程 UUID
- `libraryUuid` — 所属库 UUID（仅库文档）

### Step 2: 判断文档类型

**参考枚举**: `../resources/references/enums/EDMT_EditorDocumentType.md`

**关键枚举值**:

| 枚举值 | 数字值 | 含义 |
|---|---|---|
| `HOME` | -1 | 首页 |
| `BLANK` | 0 | 空白页 |
| `SCHEMATIC_PAGE` | 1 | 原理图图页 |
| `SYMBOL_COMPONENT` | 2 | 符号编辑器 |
| `PCB` | 3 | PCB（注意不是 2！） |
| `FOOTPRINT` | 4 | 封装编辑器 |
| `PANEL` | 26 | 面板 |

## 代码示例

```typescript
const PLUGIN_TAG = '[MyPlugin]';

export async function main() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo) {
      console.warn(PLUGIN_TAG, 'No active document found');
      await eda.sys_Dialog.showInformationMessage('Please open a document first.');
      return;
    }

    // documentType: SCH=1, PCB=3, FOOTPRINT=4
    if (docInfo.documentType === 1) {
      // 原理图逻辑
      await handleSchematic();
    } else if (docInfo.documentType === 3) {
      // PCB 逻辑
      await handlePcb();
    } else {
      console.warn(PLUGIN_TAG, 'Unsupported document type:', docInfo.documentType);
      await eda.sys_Dialog.showInformationMessage('This plugin only supports Schematic and PCB.');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get document info:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getCurrentDocumentInfo` 找不到 | 在 `eda.sch_Document` 上调用 | 正确路径是 `eda.dmt_SelectControl` |
| 返回 `undefined` | 没有打开任何文档，或焦点在首页 | 添加 null 检查，提示用户先打开文档 |
| PCB 判断为 `documentType === 2` | PCB 的值是 3，不是 2 | 使用正确值：SCH=1, PCB=3, FOOTPRINT=4 |
| 使用 `docInfo.type` 而非 `docInfo.documentType` | 属性名错误 | 正确属性名是 `documentType` |
