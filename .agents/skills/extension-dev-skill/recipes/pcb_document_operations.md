# PCB 文档操作：保存、从原理图导入变更、坐标转换、画布原点、缩放到板框、获取图元

> **适用摘要**: 对 PCB 文档进行整体操作——保存文档、从原理图导入变更、数据/画布坐标转换、画布原点设置、定位导航、缩放到板框、获取指定位置/区域图元、飞线计算控制。

## 触发意图

- "保存 PCB"
- "从原理图导入变更到 PCB"
- "坐标转换（画布/数据原点）"
- "设置画布原点"
- "定位到指定坐标"
- "缩放到板框"
- "获取某个坐标点的图元"
- "获取区域内所有图元"
- "启动/停止飞线计算"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3） |
| 导入变更 | PCB 需关联原理图（非游离 PCB） |

## 调用链

```
确认当前文档为 PCB
  → Step 1: pcb_Document.save(uuid) — 保存文档（需传入 UUID）
  → Step 2: pcb_Document.importChanges(uuid?) — 从原理图导入变更
  → Step 3: pcb_Document.convertCanvasOriginToDataOrigin(x, y) — 画布坐标→数据坐标
  → Step 4: pcb_Document.convertDataOriginToCanvasOrigin(x, y) — 数据坐标→画布坐标
  → Step 5: pcb_Document.getCanvasOrigin() / setCanvasOrigin(offsetX, offsetY) — 获取/设置画布原点
  → Step 6: pcb_Document.navigateToCoordinates(x, y) — 定位到坐标
  → Step 7: pcb_Document.navigateToRegion(left, right, top, bottom) — 定位到区域
  → Step 8: pcb_Document.zoomToBoardOutline() — 缩放到板框
  → Step 9: pcb_Document.getPrimitiveAtPoint(x, y) — 获取坐标点图元
  → Step 10: pcb_Document.getPrimitivesInRegion(...) — 获取区域内图元
  → Step 11: pcb_Document.startCalculatingRatline() / stopCalculatingRatline() — 飞线计算
```

## 分步说明

### Step 1: 保存文档

**API**: `eda.pcb_Document.save(uuid)`

**参考**: `../resources/references/classes/PCB_Document.md`

**参数说明**:
- `uuid` — 文档 UUID（必填），通过 `dmt_SelectControl.getCurrentDocumentInfo()` 获取

**返回类型**: `Promise<boolean>` — 保存失败、上传失败等错误均返回 `false`

> ⚠️ **与 SCH 不同**：PCB 的 `save()` 需要传入 `uuid` 参数，而 SCH 的 `save()` 无需参数。

### Step 2: 从原理图导入变更

**API**: `eda.pcb_Document.importChanges(uuid?)`

**参数说明**:
- `uuid`（可选）— 原理图 UUID，默认为关联在同一个 Board 下的原理图

**返回类型**: `Promise<boolean>` — 导入失败或游离 PCB 返回 `false`

### Step 3: 画布坐标转数据坐标

**API**: `eda.pcb_Document.convertCanvasOriginToDataOrigin(x, y)`

**返回类型**: `Promise<{ x: number; y: number }>`

> API 使用数据原点坐标，前端画布显示画布原点坐标。创建 PCB 时默认两者相同。

### Step 4: 数据坐标转画布坐标

**API**: `eda.pcb_Document.convertDataOriginToCanvasOrigin(x, y)`

**返回类型**: `Promise<{ x: number; y: number }>`

### Step 5: 获取/设置画布原点

**获取**: `eda.pcb_Document.getCanvasOrigin()` → `Promise<{ offsetX: number; offsetY: number }>`

**设置**: `eda.pcb_Document.setCanvasOrigin(offsetX, offsetY)` → `Promise<boolean>`

> 如果希望 API 坐标与前端画布坐标一致，调用 `setCanvasOrigin(0, 0)` 将偏移量设为零。

### Step 6: 定位到坐标

**API**: `eda.pcb_Document.navigateToCoordinates(x, y)`

**返回类型**: `Promise<boolean>`

> 坐标为数据层面单位，跨度等同于画布层面的 mil。

### Step 7: 定位到区域（BETA）

**API**: `eda.pcb_Document.navigateToRegion(left, right, top, bottom)`

**返回类型**: `Promise<boolean>`

> 不进行缩放操作，但会生成指示定位中心及表示区域范围的矩形框。

### Step 8: 缩放到板框（BETA）

**API**: `eda.pcb_Document.zoomToBoardOutline()`

**返回类型**: `Promise<boolean>`

### Step 9: 获取坐标点图元（BETA）

**API**: `eda.pcb_Document.getPrimitiveAtPoint(x, y)`

**返回类型**: `Promise<IPCB_Primitive | undefined>`

**参考接口**: `../resources/references/interfaces/IPCB_Primitive.md`

### Step 10: 获取区域内图元（BETA）

**API**: `eda.pcb_Document.getPrimitivesInRegion(left, right, top, bottom, leftToRight?)`

**参数说明**:
- `leftToRight`（可选）— `true` 仅获取完全框选的图元，`false` 则触碰即获取

**返回类型**: `Promise<Array<IPCB_Primitive>>`

### Step 11: 飞线计算控制

**启动**: `eda.pcb_Document.startCalculatingRatline()` → `Promise<boolean>`

**停止**: `eda.pcb_Document.stopCalculatingRatline()` → `Promise<boolean>`

**获取状态**: `eda.pcb_Document.getCalculatingRatlineStatus()` → `Promise<EPCB_DocumentRatlineCalculatingActiveStatus>`

**参考枚举**: `../resources/references/enums/EPCB_DocumentRatlineCalculatingActiveStatus.md`

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbDoc]';

export async function pcbDocumentOperations() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      console.warn(PLUGIN_TAG, 'Not a PCB document');
      return;
    }

    const uuid = docInfo.uuid;

    // 从原理图导入变更
    const imported = await eda.pcb_Document.importChanges();
    if (!imported) {
      console.warn(PLUGIN_TAG, 'Import changes failed (may be a floating PCB)');
    }

    // 设置画布原点为零偏移（使 API 坐标与画布坐标一致）
    await eda.pcb_Document.setCanvasOrigin(0, 0);

    // 坐标转换示例
    const dataCoord = await eda.pcb_Document.convertCanvasOriginToDataOrigin(1000, 2000);
    console.warn(PLUGIN_TAG, 'Data origin:', dataCoord);

    // 获取坐标点图元
    const prim = await eda.pcb_Document.getPrimitiveAtPoint(1000, 2000);
    if (prim) {
      console.warn(PLUGIN_TAG, 'Found primitive at point:', prim.getState_PrimitiveId());
    }

    // 获取区域内图元（触碰即获取）
    const primsInRegion = await eda.pcb_Document.getPrimitivesInRegion(0, 5000, 5000, 0, false);
    console.warn(PLUGIN_TAG, `Found ${primsInRegion.length} primitives in region`);

    // 缩放到板框
    await eda.pcb_Document.zoomToBoardOutline();

    // 保存文档（PCB 需要传入 uuid）
    const saved = await eda.pcb_Document.save(uuid);
    if (!saved) {
      console.warn(PLUGIN_TAG, 'Save failed');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'PCB document operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `save()` 报错或不生效 | PCB `save()` 需要传入 `uuid` 参数 | 使用 `eda.pcb_Document.save(docInfo.uuid)` |
| 坐标偏移 | 混淆数据原点和画布原点 | 使用 `convertCanvasOriginToDataOrigin()` 转换，或 `setCanvasOrigin(0, 0)` 统一 |
| `importChanges` 返回 `false` | 游离 PCB（未关联原理图） | 确保 PCB 关联了板子和原理图 |
| 在 SCH 中调用 `pcb_Document` | 文档类型不匹配 | SCH 使用 `sch_Document`，PCB 使用 `pcb_Document` |
| `navigateToCoordinates` 画布坐标不一致 | 画布原点有偏移 | 先调用 `setCanvasOrigin(0, 0)` 再定位 |

## 变体

- **导入自动布局/布线文件**: 使用 `importAutoLayoutJsonFile(file)` / `importAutoRouteJsonFile(file)` / `importAutoRouteSesFile(file)`
- **获取画布过滤器配置**: 使用 `getCurrentFilterConfiguration()` 获取当前过滤器设置
- **原理图文档操作**: 参考 `recipes/sch_document_operations.md`（SCH `save()` 无需 UUID）
