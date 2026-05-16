# PCB 绘图图元：创建和管理导线、圆弧、过孔、焊盘、填充、折线、文本、标注、区域、覆铜、图片、对象

> **适用摘要**: 在 PCB 或封装编辑器中创建和管理各类图元——导线（Line）、圆弧（Arc）、过孔（Via）、焊盘（Pad）、填充（Fill）、折线（Polyline）、文本（String）、标注（Dimension）、禁止/约束区域（Region）、覆铜（Pour/Poured）、图片（Image）、二进制对象（Object）。

## 触发意图

- "在 PCB 上画一条导线"
- "创建过孔"
- "添加焊盘"
- "创建覆铜区域"
- "添加文本标注"
- "创建禁止区域"
- "获取所有导线/过孔/焊盘"
- "修改 PCB 图元属性"
- "批量删除图元"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3）或封装编辑器（documentType === 4） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为 PCB 或封装
  → 选择图元类型:
    → pcb_PrimitiveLine — 导线（走线）
    → pcb_PrimitiveArc — 圆弧
    → pcb_PrimitiveVia — 过孔
    → pcb_PrimitivePad — 焊盘
    → pcb_PrimitiveFill — 填充
    → pcb_PrimitivePolyline — 折线
    → pcb_PrimitiveString — 文本
    → pcb_PrimitiveDimension — 标注
    → pcb_PrimitiveRegion — 禁止/约束区域
    → pcb_PrimitivePour — 覆铜边框
    → pcb_PrimitivePoured — 覆铜填充（只读）
    → pcb_PrimitiveImage — 图片
    → pcb_PrimitiveObject — 二进制对象
  → 操作: create / getAll / get / modify / delete
  → 修改方式: modify() 或 setState_*().done() 链
```

## 分步说明

### 图元通用操作模式

所有 PCB 图元类共享以下通用方法:

- `create(...)` — 创建图元
- `getAll()` — 获取所有图元对象
- `getAllPrimitiveId()` — 获取所有图元 ID（轻量）
- `get(primitiveIds)` — 按 ID 获取图元
- `modify(primitiveId, property)` — 修改图元属性
- `delete(primitiveIds)` — 删除图元

### 两种修改方式

**方式 A: `modify()` 方法**（推荐用于器件和批量修改）

```typescript
await eda.pcb_PrimitiveVia.modify(primitiveId, { x: 500, y: 600 });
```

**方式 B: `setState_*().done()` 链**（适用于所有图元）

```typescript
line.setState_StartX(100).setState_StartY(200).setState_EndX(300).setState_EndY(400).done();
```

> ⚠️ **必须调用 `.done()`**，否则修改不会生效。
> ⚠️ **SCH 不支持 setState chain**！SCH 必须使用 `modify()` 方法。

### 导线 (Line) — 走线/布线

**参考**: `../resources/references/classes/PCB_PrimitiveLine.md`

**创建**: `eda.pcb_PrimitiveLine.create(startX, startY, endX, endY, width, layer, net?)`

> PCB 中的 Line 是导线（走线），不是绘图线条。

### 圆弧 (Arc)

**参考**: `../resources/references/classes/PCB_PrimitiveArc.md`

**创建**: `eda.pcb_PrimitiveArc.create(centerX, centerY, radius, startAngle, endAngle, width, layer, net?)`

### 过孔 (Via)

**参考**: `../resources/references/classes/PCB_PrimitiveVia.md`

**创建**: `eda.pcb_PrimitiveVia.create(x, y, diameter, holeDiameter, net?)`

### 焊盘 (Pad)

**参考**: `../resources/references/classes/PCB_PrimitivePad.md`

**创建**: `eda.pcb_PrimitivePad.create(x, y, width, height, layer, shape?, holeDiameter?, holeWidth?, holeHeight?, rotation?, net?, number?)`

### 填充 (Fill)

**参考**: `../resources/references/classes/PCB_PrimitiveFill.md`

### 折线 (Polyline)

**参考**: `../resources/references/classes/PCB_PrimitivePolyline.md`

**创建**: `eda.pcb_PrimitivePolyline.create(points, width, layer)`

### 文本 (String)

**参考**: `../resources/references/classes/PCB_PrimitiveString.md`

**创建**: `eda.pcb_PrimitiveString.create(x, y, content, layer, fontSize?, rotation?)`

### 标注 (Dimension)

**参考**: `../resources/references/classes/PCB_PrimitiveDimension.md`

### 禁止/约束区域 (Region)

**参考**: `../resources/references/classes/PCB_PrimitiveRegion.md`

### 覆铜边框 (Pour)

**参考**: `../resources/references/classes/PCB_PrimitivePour.md`

> 覆铜边框定义覆铜区域的形状和规则。

### 覆铜填充 (Poured)

**参考**: `../resources/references/classes/PCB_PrimitivePoured.md`

> 覆铜填充是覆铜边框计算后的结果，只读（无 `create` / `modify`）。

### 图片 (Image)

**参考**: `../resources/references/classes/PCB_PrimitiveImage.md`

### 二进制对象 (Object)

**参考**: `../resources/references/classes/PCB_PrimitiveObject.md`

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbDraw]';

export async function drawPcbPrimitives() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      console.warn(PLUGIN_TAG, 'Not a PCB document');
      return;
    }

    // 创建导线（顶层，layer=1）
    const line = await eda.pcb_PrimitiveLine.create(
      1000, 1000,  // startX, startY
      2000, 1000,  // endX, endY
      10,          // width
      1            // layer (顶层)
    );
    if (!line) {
      console.warn(PLUGIN_TAG, 'Failed to create line');
    }

    // 创建过孔
    const via = await eda.pcb_PrimitiveVia.create(
      1500, 1500,  // x, y
      24,          // diameter
      12           // holeDiameter
    );

    // 创建焊盘
    const pad = await eda.pcb_PrimitivePad.create(
      3000, 3000,  // x, y
      60, 60,      // width, height
      1            // layer (顶层)
    );

    // 创建文本
    const text = await eda.pcb_PrimitiveString.create(
      1000, 2000,    // x, y
      'Hello PCB',   // content
      1              // layer (顶层)
    );

    // 获取所有导线并使用 setState chain 修改
    const allLines = await eda.pcb_PrimitiveLine.getAll();
    for (const l of allLines) {
      // 使用 setState chain 修改（必须调用 .done()）
      l.setState_Width(20).done();
    }

    // 使用 modify 方法修改过孔
    if (via) {
      const viaId = via.getState_PrimitiveId();
      await eda.pcb_PrimitiveVia.modify(viaId, {
        x: 1600,
        y: 1600,
      });
    }

    // 保存
    await eda.pcb_Document.save(docInfo.uuid);
    console.warn(PLUGIN_TAG, 'PCB primitives created');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to create PCB primitives:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `setState` 修改不生效 | 忘记调用 `.done()` | 链式调用末尾必须加 `.done()` |
| 在 SCH 中使用 `setState` chain | SCH 不支持此方式 | SCH 必须使用 `modify()` 方法 |
| 混淆 Line 和绘图线条 | PCB Line 是导线（走线） | PCB 的 Line/Arc 是路由走线，不是绘图图元 |
| 覆铜填充无法修改 | `PrimitivePoured` 是只读的 | 修改覆铜边框 `PrimitivePour`，重新铺铜后自动更新 |
| 坐标偏移 | 混淆数据原点和画布原点 | 使用 `pcb_Document.convertCanvasOriginToDataOrigin()` 转换 |
| 图元创建在错误图层 | `layer` 参数值不对 | 参考 `EPCB_LayerId` 枚举确认图层 ID |

## 变体

- **仅获取图元 ID 列表**: 使用 `getAllPrimitiveId()` 更轻量
- **批量删除**: `delete()` 支持传入 ID 数组
- **按区域获取图元**: 使用 `pcb_Document.getPrimitivesInRegion()` 获取区域内图元
- **修改器件（Component）**: 器件不是绘图图元，参考 `recipes/modify_pcb_primitive.md`
- **原理图绘图图元**: 参考 `recipes/sch_primitives_bindraw.md`
