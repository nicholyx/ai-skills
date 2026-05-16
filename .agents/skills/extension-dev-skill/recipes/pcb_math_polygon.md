# PCB 多边形数学操作：布尔运算、面积计算、图像转多边形

> **适用摘要**: 使用 PCB 多边形数学类进行多边形操作——创建单多边形和复杂多边形、布尔运算（交/并/差/异或）、面积和包围盒计算、图像转多边形、多边形拆分。

## 触发意图

- "创建 PCB 多边形"
- "多边形布尔运算"
- "计算多边形面积"
- "计算多边形包围盒"
- "图像转多边形"
- "拆分复杂多边形"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3）或封装编辑器 |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为 PCB 或封装
  → Step 1: pcb_MathPolygon.createPolygon(polygon) — 创建单多边形
  → Step 2: pcb_MathPolygon.createComplexPolygon(complexPolygon) — 创建复杂多边形
  → Step 3: 使用 IPCB_ComplexPolygon 方法进行布尔运算
  → Step 4: pcb_MathPolygon.calculateBBoxWidth / calculateBBoxHeight — 计算包围盒
  → Step 5: pcb_MathPolygon.splitPolygon(complexPolygons) — 拆分多边形
  → [可选] pcb_MathPolygon.convertImageToComplexPolygon(...) — 图像转多边形
```

## 分步说明

### Step 1: 创建单多边形

**API**: `eda.pcb_MathPolygon.createPolygon(polygon)`

**参考**: `../resources/references/classes/PCB_MathPolygon.md`

**参数类型**: `TPCB_PolygonSourceArray` — 坐标数组

**参考类型**: `../resources/references/types/TPCB_PolygonSourceArray.md`

**返回类型**: `IPCB_Polygon | undefined` — `undefined` 表示数据不合法

**参考类**: `../resources/references/classes/IPCB_Polygon.md`

### Step 2: 创建复杂多边形

**API**: `eda.pcb_MathPolygon.createComplexPolygon(complexPolygon)`

**参数类型**: `TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray> | IPCB_Polygon | Array<IPCB_Polygon>`

**返回类型**: `IPCB_ComplexPolygon | undefined`

**参考类**: `../resources/references/classes/IPCB_ComplexPolygon.md`

> 复杂多边形可包含多个子多边形（含孔洞），支持布尔运算。

### Step 3: 布尔运算（通过 IPCB_ComplexPolygon 方法）

`IPCB_ComplexPolygon` 对象提供以下布尔运算方法:

- `intersect(other)` — 交集
- `union(other)` — 并集
- `subtract(other)` — 差集
- `xor(other)` — 异或
- `getArea()` — 获取面积
- `getPolygonSourceArray()` — 获取坐标数组

### Step 4: 计算包围盒尺寸

**宽度**: `eda.pcb_MathPolygon.calculateBBoxWidth(complexPolygon)` → `number`

**高度**: `eda.pcb_MathPolygon.calculateBBoxHeight(complexPolygon)` → `number`

**参数类型**: `TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray>`

### Step 5: 拆分多边形

**API**: `eda.pcb_MathPolygon.splitPolygon(...complexPolygons)`

**参数类型**: `Array<IPCB_ComplexPolygon>`

**返回类型**: `Array<IPCB_Polygon>` — 拆分后的单多边形数组

### Step 6: 图像转多边形（BETA）

**API**: `eda.pcb_MathPolygon.convertImageToComplexPolygon(imageBlob, imageWidth, imageHeight, tolerance?, simplification?, smoothing?, despeckling?, whiteAsBackgroundColor?, inversion?)`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `imageBlob` | Blob | 图像 Blob 文件 |
| `imageWidth` | number | 图像宽度 |
| `imageHeight` | number | 图像高度 |
| `tolerance` | number（可选） | 容差，范围 `0-1` |
| `simplification` | number（可选） | 简化，范围 `0-1` |
| `smoothing` | number（可选） | 平滑，范围 `0-1.33` |
| `despeckling` | number（可选） | 去斑，范围 `0-5` |
| `whiteAsBackgroundColor` | boolean（可选） | 是否白色作为背景色 |
| `inversion` | boolean（可选） | 是否反相 |

**返回类型**: `Promise<IPCB_ComplexPolygon | undefined>`

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbMathPolygon]';

export async function pcbPolygonOperations() {
  try {
    // 创建两个单多边形（矩形）
    const polygonA = eda.pcb_MathPolygon.createPolygon([
      0, 0, 100, 0, 100, 100, 0, 100,
    ]);
    const polygonB = eda.pcb_MathPolygon.createPolygon([
      50, 50, 150, 50, 150, 150, 50, 150,
    ]);

    if (!polygonA || !polygonB) {
      console.warn(PLUGIN_TAG, 'Failed to create polygons');
      return;
    }

    // 创建复杂多边形
    const complexA = eda.pcb_MathPolygon.createComplexPolygon(polygonA);
    const complexB = eda.pcb_MathPolygon.createComplexPolygon(polygonB);

    if (!complexA || !complexB) {
      console.warn(PLUGIN_TAG, 'Failed to create complex polygons');
      return;
    }

    // 布尔运算：并集
    const unionResult = complexA.union(complexB);
    if (unionResult) {
      const area = unionResult.getArea();
      console.warn(PLUGIN_TAG, 'Union area:', area);
    }

    // 布尔运算：交集
    const intersectResult = complexA.intersect(complexB);
    if (intersectResult) {
      const area = intersectResult.getArea();
      console.warn(PLUGIN_TAG, 'Intersection area:', area);
    }

    // 布尔运算：差集
    const subtractResult = complexA.subtract(complexB);
    if (subtractResult) {
      console.warn(PLUGIN_TAG, 'Subtract result polygon source:', subtractResult.getPolygonSourceArray());
    }

    // 计算包围盒
    const sourceArray = complexA.getPolygonSourceArray();
    const bboxWidth = eda.pcb_MathPolygon.calculateBBoxWidth(sourceArray);
    const bboxHeight = eda.pcb_MathPolygon.calculateBBoxHeight(sourceArray);
    console.warn(PLUGIN_TAG, `BBox: ${bboxWidth} x ${bboxHeight}`);

    // 拆分复杂多边形为单多边形
    if (unionResult) {
      const splitResult = eda.pcb_MathPolygon.splitPolygon(unionResult);
      console.warn(PLUGIN_TAG, `Split into ${splitResult.length} polygons`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Polygon operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `createPolygon` 返回 `undefined` | 坐标数据不合法 | 确保坐标数组格式正确且构成有效多边形 |
| `createComplexPolygon` 返回 `undefined` | 输入数据不合法 | 检查输入的多边形数据 |
| 布尔运算结果为空 | 两个多边形无交集 | 检查多边形坐标是否有重叠区域 |
| 面积计算结果为负 | 多边形顶点顺序问题 | 检查顶点是否按正确方向排列 |
| 图像转多边形失败 | 图像格式或参数不对 | 确保 Blob 有效，调整容差和简化参数 |

## 变体

- **图像转 PCB 图形**: 先用 `convertImageToComplexPolygon()` 转换，再用 `pcb_PrimitivePour` 创建覆铜
- **多边形面积检查**: 用 `getArea()` 检查覆铜面积是否满足设计要求
- **复杂形状裁剪**: 用 `subtract()` 从大多边形中挖去小多边形（创建孔洞）
- **多边形合并**: 用 `union()` 合并多个相邻区域
