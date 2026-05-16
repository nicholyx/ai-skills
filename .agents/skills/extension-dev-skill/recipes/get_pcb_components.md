# 获取 PCB 所有器件信息

> **适用摘要**: 获取当前 PCB 的全部器件，包括位号、坐标、层、旋转角度等。器件定位、布局分析、报告生成的基础。

## 触发意图

- "获取 PCB 所有器件"
- "列出 PCB 器件的位置和层"
- "统计 PCB 顶层/底层器件数量"
- "读取 PCB 器件属性"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3） |

## 调用链

```
确认当前文档为 PCB
  → Step 1: pcb_PrimitiveComponent.getAll(layer?) — 获取器件
  → Step 2: 遍历器件，调用 getState_* 读取属性
  → [可选] Step 3: pcb_PrimitiveComponent.getAllPinsByPrimitiveId() — 获取焊盘
```

## 分步说明

### Step 1: 获取所有器件

**API**: `eda.pcb_PrimitiveComponent.getAll(layer?, primitiveLock?)`

**参考**: `../resources/references/classes/PCB_PrimitiveComponent.md`

**参数说明**:
- `layer`（可选）— 按层过滤，参考 `../resources/references/types/TPCB_LayersOfComponent.md`
- `primitiveLock`（可选）— 按锁定状态过滤

**返回类型**: `Promise<Array<IPCB_PrimitiveComponent>>`

**返回接口参考**: `../resources/references/classes/IPCB_PrimitiveComponent.md`

### Step 2: 读取器件属性

从每个 PCB 器件图元对象获取：
- `getState_Designator()` — 位号
- `getState_Name()` — 器件名称
- `getState_X()` / `getState_Y()` — 坐标
- `getState_Rotation()` — 旋转角度
- `getState_Layer()` — 所在层
- `getState_PrimitiveLock()` — 是否锁定
- `getState_PrimitiveId()` — 图元 ID

### [可选] Step 3: 获取器件焊盘

**API**: `eda.pcb_PrimitiveComponent.getAllPinsByPrimitiveId(primitiveId)`

**返回类型**: `Promise<Array<IPCB_PrimitiveComponentPad> | undefined>`

**参考**: `../resources/references/classes/IPCB_PrimitiveComponentPad.md`

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbInfo]';

export async function listPcbComponents() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      await eda.sys_Dialog.showInformationMessage('Please open a PCB document.');
      return;
    }

    const components = await eda.pcb_PrimitiveComponent.getAll();
    if (!components || components.length === 0) {
      console.warn(PLUGIN_TAG, 'No components found in PCB');
      return;
    }

    for (const comp of components) {
      const designator = comp.getState_Designator();
      const x = comp.getState_X();
      const y = comp.getState_Y();
      const layer = comp.getState_Layer();
      console.warn(PLUGIN_TAG, `${designator}: (${x}, ${y}) layer=${layer}`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get PCB components:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 文档类型判断为 2 | PCB 的 documentType 是 3 | 使用 `docInfo.documentType === 3` |
| 焊盘获取返回 undefined | primitiveId 无效 | 确认 primitiveId 来自有效的器件对象 |
| 坐标与画布显示不一致 | API 使用数据原点，画布显示画布原点 | 使用 `pcb_Document.convertDataOriginToCanvasOrigin()` 转换 |

## 变体

- **仅获取顶层器件**: 传入 `layer` 参数过滤
- **获取器件 ID 列表**: 使用 `getAllPrimitiveId()` 更轻量
- **修改 PCB 器件**: 参考 `recipes/modify_pcb_primitive.md`
