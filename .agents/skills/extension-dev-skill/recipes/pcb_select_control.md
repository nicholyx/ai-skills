# PCB 选择控制：获取/设置选中图元、交叉选择

> **适用摘要**: 在 PCB 中控制图元选择——获取当前选中的图元、通过 ID 选中图元、清除选中、交叉选择（Cross Probe）、获取鼠标位置。

## 触发意图

- "获取 PCB 当前选中的图元"
- "选中指定 PCB 图元"
- "清除 PCB 选中"
- "交叉选择器件/引脚/网络"
- "获取鼠标在 PCB 画布上的位置"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3）或封装编辑器 |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为 PCB
  → Step 1: pcb_SelectControl.getAllSelectedPrimitives() — 获取所有选中图元
  → Step 2: pcb_SelectControl.doSelectPrimitives(primitiveIds) — 选中指定图元
  → Step 3: pcb_SelectControl.clearSelected() — 清除选中
  → [可选] Step 4: pcb_SelectControl.doCrossProbeSelect(...) — 交叉选择
  → [可选] Step 5: pcb_SelectControl.getCurrentMousePosition() — 获取鼠标位置
```

## 分步说明

### Step 1: 获取所有选中图元（BETA）

**API**: `eda.pcb_SelectControl.getAllSelectedPrimitives()`

**参考**: `../resources/references/classes/PCB_SelectControl.md`

**返回类型**: `Promise<Array<IPCB_Primitive>>`

**参考接口**: `../resources/references/interfaces/IPCB_Primitive.md`

**获取选中图元 ID**（BETA）: `eda.pcb_SelectControl.getAllSelectedPrimitives_PrimitiveId()` → `Promise<Array<string>>`

### Step 2: 选中指定图元（BETA）

**API**: `eda.pcb_SelectControl.doSelectPrimitives(primitiveIds)`

**参数说明**:
- `primitiveIds` — 图元 ID（string）或图元 ID 数组

**返回类型**: `Promise<boolean>`

### Step 3: 清除选中（BETA）

**API**: `eda.pcb_SelectControl.clearSelected()`

**返回类型**: `Promise<boolean>`

### Step 4: 交叉选择（BETA）

**API**: `eda.pcb_SelectControl.doCrossProbeSelect(components?, pins?, nets?, highlight?, select?)`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `components` | `Array<string>`（可选） | 器件位号数组 |
| `pins` | `Array<string>`（可选） | 器件位号_引脚编号，如 `['U1_1', 'U1_2']` |
| `nets` | `Array<string>`（可选） | 网络名称数组 |
| `highlight` | boolean（可选） | 是否高亮 |
| `select` | boolean（可选） | 是否选中 |

**返回类型**: `Promise<boolean>`

### Step 5: 获取鼠标位置（BETA）

**API**: `eda.pcb_SelectControl.getCurrentMousePosition()`

**返回类型**: `Promise<{ x: number; y: number } | undefined>` — `undefined` 表示鼠标不在画布上

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbSelect]';

export async function pcbSelectControlExample() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      console.warn(PLUGIN_TAG, 'Not a PCB document');
      return;
    }

    // 获取所有选中图元
    const selectedPrimitives = await eda.pcb_SelectControl.getAllSelectedPrimitives();
    if (selectedPrimitives.length === 0) {
      console.warn(PLUGIN_TAG, 'No primitives selected');
    } else {
      console.warn(PLUGIN_TAG, `${selectedPrimitives.length} primitives selected`);
      for (const prim of selectedPrimitives) {
        const id = prim.getState_PrimitiveId();
        console.warn(PLUGIN_TAG, `Selected: ${id}`);
      }
    }

    // 获取选中图元 ID 列表（轻量）
    const selectedIds = await eda.pcb_SelectControl.getAllSelectedPrimitives_PrimitiveId();
    console.warn(PLUGIN_TAG, 'Selected IDs:', selectedIds);

    // 清除选中
    await eda.pcb_SelectControl.clearSelected();

    // 通过 ID 选中图元
    if (selectedIds.length > 0) {
      await eda.pcb_SelectControl.doSelectPrimitives(selectedIds[0]);
    }

    // 交叉选择：高亮 U1 器件
    await eda.pcb_SelectControl.doCrossProbeSelect(
      ['U1'],       // components
      undefined,     // pins
      undefined,     // nets
      true,          // highlight
      true           // select
    );

    // 获取鼠标位置
    const mousePos = await eda.pcb_SelectControl.getCurrentMousePosition();
    if (mousePos) {
      console.warn(PLUGIN_TAG, `Mouse at: (${mousePos.x}, ${mousePos.y})`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'PCB select control failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用已弃用的 `getSelectedPrimitives()` | API 已弃用 | 改用 `getAllSelectedPrimitives()` |
| `doCrossProbeSelect` 无效果 | 位号或网络名称不存在 | 确认传入的位号/网络名称正确 |
| 引脚格式错误 | pins 格式不是 `位号_引脚编号` | 使用 `['U1_1', 'U1_2']` 格式 |
| 混淆 `dmt_SelectControl` 和 `pcb_SelectControl` | 两者功能不同 | `dmt_SelectControl` 获取文档信息，`pcb_SelectControl` 操作图元选择 |
| 在 SCH 中调用 `pcb_SelectControl` | 文档类型不匹配 | SCH 使用 `sch_SelectControl` |

## 变体

- **仅获取选中 ID（轻量）**: 使用 `getAllSelectedPrimitives_PrimitiveId()` 不加载图元对象
- **交叉选择网络**: 传入 `nets` 参数高亮指定网络的所有走线和焊盘
- **交叉选择引脚**: 传入 `pins` 参数，格式为 `['U1_1', 'R1_2']`
- **原理图选择控制**: 使用 `eda.sch_SelectControl` 类，参考 `recipes/sch_select_control.md`
