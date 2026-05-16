# 原理图绘图图元：创建和管理圆弧、圆、矩形、多边形、文本

> **适用摘要**: 在原理图或符号编辑器中创建和管理绘图图元（Drawing Primitives）——圆弧、圆、矩形、多边形/折线、文本。这些是绘图图元，不是器件（Component）。

## 触发意图

- "在原理图上画一个矩形"
- "创建圆弧"
- "添加文本标注"
- "画一个圆"
- "创建多边形/折线"
- "修改绘图图元属性"
- "获取所有矩形/圆/文本"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1）或符号编辑器（documentType === 2） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为原理图或符号编辑器
  → 选择图元类型:
    → sch_PrimitiveArc — 圆弧
    → sch_PrimitiveCircle — 圆
    → sch_PrimitiveRectangle — 矩形
    → sch_PrimitivePolygon — 多边形/折线
    → sch_PrimitiveText — 文本
  → 操作: create / getAll / get / modify / delete
```

## 分步说明

### 圆弧 (Arc)

**参考**: `../resources/references/classes/SCH_PrimitiveArc.md`

**创建**: `eda.sch_PrimitiveArc.create(startX, startY, referenceX, referenceY, endX, endY, color?, fillColor?, lineWidth?, lineType?)`

**通用方法**: `getAll()`, `get(primitiveIds)`, `getAllPrimitiveId()`, `modify(primitiveId, property)`, `delete(primitiveIds)`

### 圆 (Circle)

**参考**: `../resources/references/classes/SCH_PrimitiveCircle.md`

**创建**: `eda.sch_PrimitiveCircle.create(centerX, centerY, radius, color?, fillColor?, lineWidth?, lineType?, fillStyle?)`

**参考枚举**: `../resources/references/enums/ESCH_PrimitiveFillStyle.md`（填充样式）

### 矩形 (Rectangle)

**参考**: `../resources/references/classes/SCH_PrimitiveRectangle.md`

**创建**: `eda.sch_PrimitiveRectangle.create(topLeftX, topLeftY, width, height, cornerRadius?, rotation?, color?, fillColor?, lineWidth?, lineType?, fillStyle?)`

**参数说明**:
- `cornerRadius`（可选）— 圆角半径
- `rotation`（可选）— 绕左上点旋转，可选 `0` `90` `180` `270`

### 多边形/折线 (Polygon)

**参考**: `../resources/references/classes/SCH_PrimitivePolygon.md`

**创建**: `eda.sch_PrimitivePolygon.create(line, color?, fillColor?, lineWidth?, lineType?)`

**参数说明**:
- `line` — 坐标组 `[x1, y1, x2, y2, x3, y3, ...]`

### 文本 (Text)

**参考**: `../resources/references/classes/SCH_PrimitiveText.md`

**创建**: `eda.sch_PrimitiveText.create(x, y, content, rotation?, textColor?, fontName?, fontSize?, bold?, italic?, underLine?, alignMode?)`

**参考枚举**: `../resources/references/enums/ESCH_PrimitiveTextAlignMode.md`

**对齐模式**: `0` 左顶, `1` 中顶, `2` 右顶, `3` 左中, `4` 中中, `5` 右中, `6` 左底, `7` 中底, `8` 右底

### 通用可选参数

所有绘图图元共享以下可选参数:
- `color` — 线条颜色，`null` 表示默认
- `fillColor` — 填充颜色，`'none'` 表示无填充，`null` 表示默认
- `lineWidth` — 线宽，范围 `1-10`，`null` 表示默认
- `lineType` — 线型，参考 `../resources/references/enums/ESCH_PrimitiveLineType.md`

## 代码示例

```typescript
const PLUGIN_TAG = '[SchDraw]';

export async function drawPrimitivesExample() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || (docInfo.documentType !== 1 && docInfo.documentType !== 2)) {
      console.warn(PLUGIN_TAG, 'Not a schematic or symbol editor');
      return;
    }

    // 创建矩形
    const rect = await eda.sch_PrimitiveRectangle.create(
      100, 100,  // topLeftX, topLeftY
      200, 150,  // width, height
      10,        // cornerRadius
      0,         // rotation
      '#FF0000', // color
      'none'     // fillColor (无填充)
    );
    if (!rect) {
      console.warn(PLUGIN_TAG, 'Failed to create rectangle');
    }

    // 创建圆
    const circle = await eda.sch_PrimitiveCircle.create(
      500, 500,  // centerX, centerY
      50         // radius
    );

    // 创建文本
    const text = await eda.sch_PrimitiveText.create(
      100, 300,       // x, y
      'Hello EDA',    // content
      0,              // rotation
      '#0000FF'       // textColor
    );
    if (!text) {
      console.warn(PLUGIN_TAG, 'Failed to create text');
    }

    // 创建多边形（三角形）
    const polygon = await eda.sch_PrimitivePolygon.create(
      [300, 100, 400, 300, 200, 300, 300, 100]  // 坐标组
    );

    // 获取所有矩形并修改
    const allRects = await eda.sch_PrimitiveRectangle.getAll();
    for (const r of allRects) {
      const id = r.getState_PrimitiveId();
      await eda.sch_PrimitiveRectangle.modify(id, {
        color: '#00FF00',
      });
    }

    await eda.sch_Document.save();
    console.warn(PLUGIN_TAG, 'Drawing primitives created');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to create drawing primitives:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 混淆绘图图元和器件 | 绘图图元不是 Component | 器件操作请参考 `recipes/get_sch_components.md` |
| `modify` 不生效 | 使用了 `setState_*` 而非 `modify()` | SCH 图元修改必须使用 `modify()` 方法 |
| 多边形创建失败 | 坐标组格式错误 | 确保坐标组为 `[x1, y1, x2, y2, ...]` 格式 |
| 文本对齐模式不对 | alignMode 值错误 | 参考 `ESCH_PrimitiveTextAlignMode` 枚举 |
| 在 PCB 中调用 SCH 图元 API | 文档类型不匹配 | 先检查 `documentType`，PCB 使用 `pcb_Primitive*` |

## 变体

- **仅获取图元 ID 列表**: 使用 `getAllPrimitiveId()` 更轻量
- **批量删除**: `delete()` 支持传入数组 `Array<string>` 或图元对象数组
- **修改填充样式**: 圆和矩形支持 `fillStyle` 参数，参考 `ESCH_PrimitiveFillStyle` 枚举
- **器件操作**: 器件（Component）不是绘图图元，请参考 `recipes/get_sch_components.md` 和 `recipes/modify_sch_component.md`
