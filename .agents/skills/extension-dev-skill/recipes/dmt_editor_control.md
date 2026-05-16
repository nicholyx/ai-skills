# 编辑器控制：打开/关闭/激活文档、分屏、缩放、指示标记

> **适用摘要**: 控制编辑器行为——打开/关闭/激活文档标签页，创建分屏视图，缩放画布到指定位置，生成/移除指示标记，获取画布截图。

## 触发意图

- "打开指定文档"
- "关闭当前文档"
- "切换到某个标签页"
- "创建分屏视图"
- "缩放到指定位置"
- "缩放到全部图元"
- "在画布上标记位置"
- "获取画布截图"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 用户已打开一个工程，且工程内存在文档 |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前已打开工程
  → 文档操作:
    → dmt_EditorControl.openDocument(documentUuid) — 打开文档
    → dmt_EditorControl.closeDocument(tabId) — 关闭文档
    → dmt_EditorControl.activateDocument(tabId) — 激活文档
  → 分屏操作:
    → dmt_EditorControl.createSplitScreen(type, tabId) — 创建分屏
  → 缩放操作:
    → dmt_EditorControl.zoomTo(x, y, scaleRatio) — 缩放到坐标
    → dmt_EditorControl.zoomToAllPrimitives() — 缩放到所有图元
  → 标记操作:
    → dmt_EditorControl.generateIndicatorMarkers(markers) — 生成指示标记
    → dmt_EditorControl.removeIndicatorMarkers() — 移除指示标记
  → 截图:
    → dmt_EditorControl.getCurrentRenderedAreaImage() — 获取画布图像
```

## 分步说明

### Step 1: 打开文档

**API**: `eda.dmt_EditorControl.openDocument(documentUuid, splitScreenId?)`

**参考**: `../resources/references/classes/DMT_EditorControl.md`

**参数说明**:
- `documentUuid` — 文档 UUID（支持原理图、原理图图页、PCB、面板的 UUID）
- `splitScreenId`（可选）— 分屏 ID

**返回类型**: `Promise<string | undefined>` — 标签页 ID，`undefined` 表示打开失败

### Step 2: 关闭文档

**API**: `eda.dmt_EditorControl.closeDocument(tabId)`

**返回类型**: `Promise<boolean>`

> ⚠️ 关闭文档会直接丢失未保存数据！请先调用 `sch_Document.save()` 或 `pcb_Document.save()` 保存。

### Step 3: 激活文档

**API**: `eda.dmt_EditorControl.activateDocument(tabId)`

**返回类型**: `Promise<boolean>` — 切换到指定标签页并将输入焦点置于其中

### Step 4: 创建分屏

**API**: `eda.dmt_EditorControl.createSplitScreen(splitScreenType, tabId)`

**参考枚举**: `../resources/references/enums/EDMT_EditorSplitScreenDirection.md`

**参数说明**:
- `splitScreenType` — `'horizontal'` 水平 / `'vertical'` 垂直
- `tabId` — 将被移入新分屏的标签页 ID

**返回类型**: `Promise<{ sourceSplitScreenId: string; newSplitScreenId: string } | undefined>`

> 确保 tabId 对应的分屏存在两个以上标签页，否则返回 `undefined`。

### Step 5: 缩放到坐标（BETA）

**API**: `eda.dmt_EditorControl.zoomTo(x?, y?, scaleRatio?, tabId?)`

**参数说明**:
- `scaleRatio` — 缩放比，单位 `1/100`，如 `200` 表示 200%

**返回类型**: `Promise<{ left, right, top, bottom } | false>`

> 原理图/符号画布坐标单位跨度为 0.01inch，PCB/封装画布坐标单位跨度为 mil。

### Step 6: 缩放到所有图元（BETA）

**API**: `eda.dmt_EditorControl.zoomToAllPrimitives(tabId?)`

**返回类型**: `Promise<{ left, right, top, bottom } | false>`

### Step 7: 生成指示标记（BETA）

**API**: `eda.dmt_EditorControl.generateIndicatorMarkers(markers, color?, lineWidth?, zoom?, tabId?)`

**参考接口**: `../resources/references/interfaces/IDMT_IndicatorMarkerShape.md`

**参数说明**:
- `markers` — 指示标记外形对象数组
- `color`（可选）— `{ r, g, b, alpha }` 颜色
- `zoom`（可选）— 是否定位并缩放

### Step 8: 移除指示标记（BETA）

**API**: `eda.dmt_EditorControl.removeIndicatorMarkers(tabId?)`

### Step 9: 获取画布渲染区域图像（BETA）

**API**: `eda.dmt_EditorControl.getCurrentRenderedAreaImage(tabId?)`

**返回类型**: `Promise<Blob | undefined>` — 画布渲染区域的 Blob 格式图像数据

## 代码示例

```typescript
const PLUGIN_TAG = '[EditorControl]';

export async function editorControlExample() {
  try {
    // 获取当前文档信息
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo) {
      console.warn(PLUGIN_TAG, 'No active document');
      return;
    }

    // 缩放到所有图元
    const region = await eda.dmt_EditorControl.zoomToAllPrimitives();
    if (region === false) {
      console.warn(PLUGIN_TAG, 'Zoom not supported for this canvas');
    }

    // 缩放到指定坐标，200% 缩放比
    await eda.dmt_EditorControl.zoomTo(500, 500, 200);

    // 生成红色指示标记
    const markers = [
      { type: 'circle', x: 500, y: 500, radius: 50 },
    ];
    const markerResult = await eda.dmt_EditorControl.generateIndicatorMarkers(
      markers as any,
      { r: 255, g: 0, b: 0, alpha: 1 },
      2,
      true
    );
    if (!markerResult) {
      console.warn(PLUGIN_TAG, 'Failed to generate markers');
    }

    // 获取画布截图
    const image = await eda.dmt_EditorControl.getCurrentRenderedAreaImage();
    if (image) {
      console.warn(PLUGIN_TAG, `Got canvas image: ${image.size} bytes`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Editor control failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `openDocument` 返回 `undefined` | documentUuid 不属于当前工程 | 确认 UUID 来自当前工程的文档树 |
| `closeDocument` 丢失数据 | 关闭前未保存 | 先调用 `sch_Document.save()` / `pcb_Document.save()` |
| `zoomTo` 返回 `false` | 画布不支持或 tabId 不存在 | 确认当前画布类型和 tabId 正确 |
| `createSplitScreen` 返回 `undefined` | 分屏内标签页不足两个 | 确保分屏内至少有两个标签页 |
| 坐标单位混淆 | SCH 用 0.01inch，PCB 用 mil | 根据文档类型使用正确的坐标单位 |

## 变体

- **平铺所有文档**: 使用 `eda.dmt_EditorControl.tileAllDocumentToSplitScreen()` 自动分屏
- **合并所有分屏**: 使用 `eda.dmt_EditorControl.mergeAllDocumentFromSplitScreen()`
- **缩放到选中图元**: 使用 `eda.dmt_EditorControl.zoomToSelectedPrimitives(tabId?)`
- **缩放到区域**: 使用 `eda.dmt_EditorControl.zoomToRegion(left, right, top, bottom, tabId?)`
- **打开库文档**: 使用 `eda.dmt_EditorControl.openLibraryDocument(libraryUuid, libraryType, uuid)`（BETA）
