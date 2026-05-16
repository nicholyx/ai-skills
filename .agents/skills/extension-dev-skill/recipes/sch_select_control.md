# 原理图选择控制：获取/设置选中图元

> **适用摘要**: 在原理图中控制图元选择——获取当前选中的图元、通过 ID 选中图元、清除选中、交叉选择（Cross Probe）。

## 触发意图

- "获取当前选中的图元"
- "选中指定图元"
- "清除选中"
- "交叉选择器件/引脚/网络"
- "获取鼠标在画布上的位置"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1）或符号编辑器 |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_SelectControl.getAllSelectedPrimitives() — 获取所有选中图元
  → Step 2: sch_SelectControl.doSelectPrimitives(primitiveIds) — 选中指定图元
  → Step 3: sch_SelectControl.clearSelected() — 清除选中
  → [可选] Step 4: sch_SelectControl.doCrossProbeSelect(...) — 交叉选择
  → [可选] Step 5: sch_SelectControl.getCurrentMousePosition() — 获取鼠标位置
```

## 分步说明

### Step 1: 获取所有选中图元（BETA）

**API**: `eda.sch_SelectControl.getAllSelectedPrimitives()`

**参考**: `../resources/references/classes/SCH_SelectControl.md`

**返回类型**: `Promise<Array<ISCH_Primitive>>`

**参考接口**: `../resources/references/interfaces/ISCH_Primitive.md`

> 返回所有选中图元的图元对象，可调用 `getState_*` 方法读取属性。

**获取选中图元 ID**（BETA）: `eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId()` → `Promise<Array<string>>`

### Step 2: 选中指定图元

**API**: `eda.sch_SelectControl.doSelectPrimitives(primitiveIds)`

**参数说明**:
- `primitiveIds` — 图元 ID（string）或图元 ID 数组

**返回类型**: `Promise<boolean>`

### Step 3: 清除选中

**API**: `eda.sch_SelectControl.clearSelected()`

**返回类型**: `boolean`

### Step 4: 交叉选择

**API**: `eda.sch_SelectControl.doCrossProbeSelect(components?, pins?, nets?, highlight?, select?)`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `components` | `Array<string>`（可选） | 器件位号数组 |
| `pins` | `Array<string>`（可选） | 器件位号_引脚编号，如 `['U1_1', 'U1_2']` |
| `nets` | `Array<string>`（可选） | 网络名称数组 |
| `highlight` | boolean（可选） | 是否高亮 |
| `select` | boolean（可选） | 是否选中 |

**返回类型**: `boolean`

### Step 5: 获取鼠标位置（BETA）

**API**: `eda.sch_SelectControl.getCurrentMousePosition()`

**返回类型**: `Promise<{ x: number; y: number } | undefined>` — `undefined` 表示鼠标不在画布上

## 代码示例

```typescript
const PLUGIN_TAG = '[SchSelect]';

export async function selectControlExample() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      return;
    }

    // 获取所有选中图元
    const selectedPrimitives = await eda.sch_SelectControl.getAllSelectedPrimitives();
    if (selectedPrimitives.length === 0) {
      console.warn(PLUGIN_TAG, 'No primitives selected');
    } else {
      console.warn(PLUGIN_TAG, `${selectedPrimitives.length} primitives selected`);
      for (const prim of selectedPrimitives) {
        const id = prim.getState_PrimitiveId();
        console.warn(PLUGIN_TAG, `Selected: ${id}`);
      }
    }

    // 获取选中图元 ID 列表
    const selectedIds = await eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId();
    console.warn(PLUGIN_TAG, 'Selected IDs:', selectedIds);

    // 清除选中
    eda.sch_SelectControl.clearSelected();

    // 通过 ID 选中图元
    if (selectedIds.length > 0) {
      await eda.sch_SelectControl.doSelectPrimitives(selectedIds[0]);
    }

    // 交叉选择：高亮 U1 器件
    eda.sch_SelectControl.doCrossProbeSelect(
      ['U1'],       // components
      undefined,     // pins
      undefined,     // nets
      true,          // highlight
      true           // select
    );

    // 获取鼠标位置
    const mousePos = await eda.sch_SelectControl.getCurrentMousePosition();
    if (mousePos) {
      console.warn(PLUGIN_TAG, `Mouse at: (${mousePos.x}, ${mousePos.y})`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Select control failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用已弃用的 `getSelectedPrimitives_PrimitiveId()` | API 已弃用 | 改用 `getAllSelectedPrimitives_PrimitiveId()` |
| 使用已弃用的 `getSelectedPrimitives()` | API 已弃用 | 改用 `getAllSelectedPrimitives()` |
| `doCrossProbeSelect` 无效果 | 位号或网络名称不存在 | 确认传入的位号/网络名称正确 |
| 引脚格式错误 | pins 格式不是 `位号_引脚编号` | 使用 `['U1_1', 'U1_2']` 格式 |
| 混淆 `dmt_SelectControl` 和 `sch_SelectControl` | 两者功能不同 | `dmt_SelectControl` 获取文档信息，`sch_SelectControl` 操作图元选择 |

## 变体

- **仅获取选中 ID（轻量）**: 使用 `getAllSelectedPrimitives_PrimitiveId()` 不加载图元对象
- **交叉选择网络**: 传入 `nets` 参数高亮指定网络的所有导线和引脚
- **PCB 选择控制**: PCB 使用 `eda.pcb_SelectControl` 类
