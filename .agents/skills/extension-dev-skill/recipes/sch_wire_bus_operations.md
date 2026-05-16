# 原理图导线与总线操作：创建/获取/修改导线和总线，获取网络信息

> **适用摘要**: 在原理图中创建、获取、修改、删除导线（Wire）和总线（Bus）。导线是网络连接的载体，网络信息通过导线的 `getState_Net()` 获取，而非引脚。

## 触发意图

- "创建导线连接两个引脚"
- "获取所有导线"
- "获取指定网络的导线"
- "修改导线颜色/线宽"
- "创建总线"
- "获取导线的网络名称"
- "删除导线"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为原理图
  → 导线操作:
    → sch_PrimitiveWire.create(line, net?) — 创建导线
    → sch_PrimitiveWire.getAll(net?) — 获取所有导线（可按网络过滤）
    → sch_PrimitiveWire.modify(primitiveId, property) — 修改导线
    → sch_PrimitiveWire.delete(primitiveIds) — 删除导线
  → 总线操作:
    → sch_PrimitiveBus.create(busName, line) — 创建总线
    → sch_PrimitiveBus.getAll() — 获取所有总线
    → sch_PrimitiveBus.modify(primitiveId, property) — 修改总线
  → 网络信息:
    → wire.getState_Net() — 从导线获取网络名称
```

## 分步说明

### Step 1: 创建导线（BETA）

**API**: `eda.sch_PrimitiveWire.create(line, net?, color?, lineWidth?, lineType?)`

**参考**: `../resources/references/classes/SCH_PrimitiveWire.md`

**参数说明**:
- `line` — 多段线坐标组 `[x1, y1, x2, y2, ...]` 或 `[[x1, y1, x2, y2], [x3, y3, x4, y4]]`
- `net`（可选）— 网络名称。未指定时自动推断：
  - 无坐标落在图元上 → 空网络
  - 一个坐标在某网络图元上 → 跟随该网络
  - 多个坐标在不同网络图元上 → 创建失败

**返回类型**: `Promise<ISCH_PrimitiveWire | undefined>`

### Step 2: 获取导线（BETA）

**API**: `eda.sch_PrimitiveWire.getAll(net?)`

**参数说明**:
- `net`（可选）— 网络名称或网络名称数组，用于过滤

**返回类型**: `Promise<Array<ISCH_PrimitiveWire>>`

### Step 3: 从导线获取网络信息

> ⚠️ **关键**: 网络信息在导线上（`getState_Net()`），不在引脚上！

从导线图元对象获取:
- `getState_Net()` — 网络名称
- `getState_Line()` — 坐标数据
- `getState_PrimitiveId()` — 图元 ID
- `getState_Color()` — 颜色
- `getState_LineWidth()` — 线宽

### Step 4: 修改导线（BETA）

**API**: `eda.sch_PrimitiveWire.modify(primitiveId, property)`

**可修改属性**:
- `line` — 坐标组
- `net` — 网络名称
- `color` — 颜色
- `lineWidth` — 线宽
- `lineType` — 线型

### Step 5: 创建总线（BETA）

**API**: `eda.sch_PrimitiveBus.create(busName, line, color?, lineWidth?, lineType?)`

**参考**: `../resources/references/classes/SCH_PrimitiveBus.md`

**参数说明**:
- `busName` — 总线名称（必填）
- `line` — 多段线坐标组，格式同导线

### Step 6: 获取/修改总线（BETA）

**API**: `eda.sch_PrimitiveBus.getAll()` / `eda.sch_PrimitiveBus.modify(primitiveId, property)`

**可修改属性**: `busName`, `line`, `color`, `lineWidth`, `lineType`

## 代码示例

```typescript
const PLUGIN_TAG = '[WireBus]';

export async function wireAndBusExample() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      return;
    }

    // 创建一条导线
    const wire = await eda.sch_PrimitiveWire.create(
      [100, 200, 300, 200],  // 水平线段
      'VCC'                   // 指定网络名称
    );
    if (!wire) {
      console.warn(PLUGIN_TAG, 'Failed to create wire');
    }

    // 获取指定网络的所有导线
    const vccWires = await eda.sch_PrimitiveWire.getAll('VCC');
    console.warn(PLUGIN_TAG, `Found ${vccWires.length} VCC wires`);

    // 遍历导线获取网络信息
    const allWires = await eda.sch_PrimitiveWire.getAll();
    for (const w of allWires) {
      const net = w.getState_Net();
      const id = w.getState_PrimitiveId();
      console.warn(PLUGIN_TAG, `Wire ${id}: net=${net}`);
    }

    // 修改导线颜色
    if (allWires.length > 0) {
      const firstWire = allWires[0];
      await eda.sch_PrimitiveWire.modify(firstWire, {
        color: '#FF0000',
        lineWidth: 2,
      });
    }

    // 创建总线
    const bus = await eda.sch_PrimitiveBus.create(
      'DATA[0..7]',
      [100, 400, 500, 400]
    );
    if (!bus) {
      console.warn(PLUGIN_TAG, 'Failed to create bus');
    }

    await eda.sch_Document.save();
  } catch (err) {
    console.error(PLUGIN_TAG, 'Wire/Bus operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 在引脚上找网络信息 | 网络信息在导线上，不在引脚上 | 使用 `wire.getState_Net()` 获取网络 |
| 导线创建失败 | 多段线坐标彼此无连接 | 确保坐标组描述的线段是连续的 |
| 指定 net 后创建失败 | 坐标点在其他已显式指定网络的图元上 | 检查坐标点位置，避免网络冲突 |
| 总线创建忘记传 busName | busName 是必填参数 | 总线必须指定名称 |
| 使用 `setState_*` 修改导线 | SCH 不支持 setState 链式修改 | 使用 `modify()` 方法 |

## 变体

- **仅获取导线 ID**: 使用 `eda.sch_PrimitiveWire.getAllPrimitiveId(net?)` 更轻量
- **按多个网络过滤**: `getAll()` 的 `net` 参数支持 `Array<string>`
- **批量删除导线**: `delete()` 支持传入 ID 数组或图元对象数组
- **获取总线 ID 列表**: 使用 `eda.sch_PrimitiveBus.getAllPrimitiveId()`
