# 原理图引脚操作：获取器件引脚、引脚属性

> **适用摘要**: 获取原理图器件的引脚信息。关键区别：原理图中通过 `sch_PrimitiveComponent.getAllPinsByPrimitiveId()` 获取引脚，`sch_PrimitivePin.getAll()` 仅在符号编辑器中可用。

## 触发意图

- "获取器件的所有引脚"
- "获取引脚编号和名称"
- "查看引脚属性"
- "在符号编辑器中创建引脚"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态（原理图引脚） | 当前打开原理图图页（documentType === 1） |
| 编辑器状态（符号引脚） | 当前打开符号编辑器（documentType === 2） |

## 调用链

```
原理图中获取器件引脚:
  → Step 1: sch_PrimitiveComponent.getAll() — 获取器件
  → Step 2: sch_PrimitiveComponent.getAllPinsByPrimitiveId(primitiveId) — 获取引脚

符号编辑器中操作引脚:
  → sch_PrimitivePin.getAll() — 获取所有引脚
  → sch_PrimitivePin.create(...) — 创建引脚
  → sch_PrimitivePin.modify(...) — 修改引脚
```

## 分步说明

### Step 1: 获取器件（原理图）

参考 `recipes/get_sch_components.md` 获取器件列表。

### Step 2: 获取器件引脚（原理图）

**API**: `eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(primitiveId)`

**参考**: `../resources/references/classes/SCH_PrimitiveComponent.md`

**返回类型**: `Promise<Array<ISCH_PrimitiveComponentPin> | undefined>`

**参考接口**: `../resources/references/classes/ISCH_PrimitiveComponentPin.md`

> ⚠️ **关键**: 原理图中必须使用 `getAllPinsByPrimitiveId()`，不能使用 `sch_PrimitivePin.getAll()`！

**从引脚对象获取**:
- `getState_PinNumber()` — 引脚编号
- `getState_PinName()` — 引脚名称
- `getState_X()` / `getState_Y()` — 坐标
- `getState_Rotation()` — 旋转角度
- `getState_PrimitiveId()` — 图元 ID

### Step 3: 符号编辑器中操作引脚（BETA）

**API**: `eda.sch_PrimitivePin.getAll()` / `eda.sch_PrimitivePin.create(...)` / `eda.sch_PrimitivePin.modify(...)`

**参考**: `../resources/references/classes/SCH_PrimitivePin.md`

**创建引脚**: `eda.sch_PrimitivePin.create(x, y, pinNumber, pinName?, rotation?, pinLength?, pinColor?, pinShape?, pinType?)`

**参考枚举**:
- `../resources/references/enums/ESCH_PrimitivePinShape.md` — 引脚形状
- `../resources/references/enums/ESCH_PrimitivePinType.md` — 引脚类型

**修改引脚**: `eda.sch_PrimitivePin.modify(primitiveId, property)`

**可修改属性**: `x`, `y`, `pinNumber`, `pinName`, `rotation`, `pinLength`, `pinColor`, `pinShape`, `pinType`

## 代码示例

```typescript
const PLUGIN_TAG = '[SchPin]';

export async function getPinsExample() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo) {
      console.warn(PLUGIN_TAG, 'No active document');
      return;
    }

    if (docInfo.documentType === 1) {
      // 原理图：通过器件获取引脚
      const components = await eda.sch_PrimitiveComponent.getAll();
      if (!components || components.length === 0) {
        console.warn(PLUGIN_TAG, 'No components found');
        return;
      }

      for (const comp of components) {
        const compId = comp.getState_PrimitiveId();
        const designator = comp.getState_Designator();

        // 必须使用 getAllPinsByPrimitiveId，不能用 sch_PrimitivePin.getAll()
        const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(compId);
        if (!pins) {
          console.warn(PLUGIN_TAG, `No pins for ${designator}`);
          continue;
        }

        for (const pin of pins) {
          const pinNumber = pin.getState_PinNumber();
          const pinName = pin.getState_PinName();
          console.warn(PLUGIN_TAG, `${designator} pin ${pinNumber}: ${pinName}`);
        }
      }
    } else if (docInfo.documentType === 2) {
      // 符号编辑器：直接获取所有引脚
      const pins = await eda.sch_PrimitivePin.getAll();
      console.warn(PLUGIN_TAG, `Found ${pins.length} pins in symbol editor`);

      // 创建新引脚
      const newPin = await eda.sch_PrimitivePin.create(
        100, 200,   // x, y
        '1',        // pinNumber
        'VCC',      // pinName
        0,          // rotation
        30          // pinLength
      );
      if (!newPin) {
        console.warn(PLUGIN_TAG, 'Failed to create pin');
      }
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Pin operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `sch_PrimitivePin.getAll()` 在原理图中返回空 | 此方法仅符号编辑器可用 | 原理图中使用 `sch_PrimitiveComponent.getAllPinsByPrimitiveId()` |
| `getAllPinsByPrimitiveId` 返回 `undefined` | primitiveId 不正确或器件无引脚 | 确认 primitiveId 来自有效的器件图元 |
| 在原理图中创建引脚 | `sch_PrimitivePin.create()` 仅符号编辑器可用 | 原理图中不能直接创建引脚，引脚属于器件 |
| 混淆引脚和网络 | 网络信息在导线上，不在引脚上 | 获取网络信息请参考 `recipes/sch_wire_bus_operations.md` |

## 变体

- **获取引脚 ID 列表（符号编辑器）**: 使用 `eda.sch_PrimitivePin.getAllPrimitiveId()`
- **修改引脚属性（符号编辑器）**: 使用 `eda.sch_PrimitivePin.modify(primitiveId, property)`
- **删除引脚（符号编辑器）**: 使用 `eda.sch_PrimitivePin.delete(primitiveIds)`
- **获取网络信息**: 网络信息在导线上，参考 `recipes/sch_wire_bus_operations.md`
