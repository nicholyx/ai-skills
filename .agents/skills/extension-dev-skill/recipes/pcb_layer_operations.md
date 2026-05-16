# PCB 图层操作：获取/修改图层属性、可见性、颜色、锁定、铜箔层数

> **适用摘要**: 对 PCB 图层进行操作——获取所有图层信息、修改图层属性（名称/类型/颜色/透明度）、设置可见性、锁定/解锁、设置铜箔层数、新增/移除自定义层、设置非激活层显示模式。

## 触发意图

- "获取所有 PCB 图层"
- "修改图层颜色"
- "隐藏/显示某个图层"
- "锁定/解锁图层"
- "设置铜箔层数"
- "新增自定义层"
- "设置非激活层透明度"
- "切换层颜色配置"
- "设置 PCB 类型（FPC 软板）"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3）或封装编辑器（documentType === 4） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为 PCB 或封装
  → Step 1: pcb_Layer.getAllLayers() — 获取所有图层信息
  → Step 2: pcb_Layer.selectLayer(layer) — 选中图层
  → Step 3: pcb_Layer.modifyLayer(layer, property) — 修改图层属性
  → Step 4: pcb_Layer.setLayerVisible / setLayerInvisible — 设置可见性
  → Step 5: pcb_Layer.lockLayer / unlockLayer — 锁定/解锁
  → Step 6: pcb_Layer.setTheNumberOfCopperLayers(n) — 设置铜箔层数
  → [可选] pcb_Layer.addCustomLayer() / removeLayer() — 新增/移除自定义层
  → [可选] pcb_Layer.setLayerColorConfiguration() — 设置层颜色配置
  → [可选] pcb_Layer.setInactiveLayerDisplayMode() / setInactiveLayerTransparency() — 非激活层设置
```

## 分步说明

### Step 1: 获取所有图层信息（BETA）

**API**: `eda.pcb_Layer.getAllLayers()`

**参考**: `../resources/references/classes/PCB_Layer.md`

**返回类型**: `Promise<Array<IPCB_LayerItem>>`

**参考接口**: `../resources/references/interfaces/IPCB_LayerItem.md`

### Step 2: 选中图层

**API**: `eda.pcb_Layer.selectLayer(layer)`

**参数类型**: `TPCB_LayersInTheSelectable`

**参考类型**: `../resources/references/types/TPCB_LayersInTheSelectable.md`

**返回类型**: `Promise<boolean>` — 不存在指定层返回 `false`

### Step 3: 修改图层属性（BETA）

**API**: `eda.pcb_Layer.modifyLayer(layer, property)`

**参数说明**:
- `layer` — 图层 ID（`TPCB_LayersInTheSelectable`）
- `property` — `{ name?: string; type?: TPCB_LayerTypesOfInnerLayer; color?: string; transparency?: number }`

**参考类型**: `../resources/references/types/TPCB_LayerTypesOfInnerLayer.md`

**返回类型**: `Promise<boolean>`

> 仅内层和自定义层允许修改名称；仅内层允许修改类型；透明度范围 `0-100`。

### Step 4: 设置图层可见性（BETA）

**显示**: `eda.pcb_Layer.setLayerVisible(layer?, setOtherLayerInvisible?)`

**隐藏**: `eda.pcb_Layer.setLayerInvisible(layer?, setOtherLayerVisible?)`

**参数说明**:
- `layer`（可选）— 图层或图层数组，不指定则默认所有层
- `setOtherLayerInvisible/setOtherLayerVisible`（可选）— 是否同时设置其他层

### Step 5: 锁定/解锁图层（BETA）

**锁定**: `eda.pcb_Layer.lockLayer(layer?)`

**解锁**: `eda.pcb_Layer.unlockLayer(layer?)`

> 不指定 `layer` 则默认操作所有层。

### Step 6: 设置铜箔层数（BETA）

**API**: `eda.pcb_Layer.setTheNumberOfCopperLayers(numberOfLayers)`

**参数说明**:
- `numberOfLayers` — 层数，可选值: `2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32`

**返回类型**: `Promise<boolean>`

### Step 7: 新增/移除自定义层（BETA）

**新增**: `eda.pcb_Layer.addCustomLayer()` → `Promise<TPCB_LayersOfCustom | undefined>`

**移除**: `eda.pcb_Layer.removeLayer(layer)` — 仅支持移除自定义层

**参考类型**: `../resources/references/types/TPCB_LayersOfCustom.md`

### Step 8: 设置层颜色配置（BETA）

**API**: `eda.pcb_Layer.setLayerColorConfiguration(colorConfiguration)`

**参考枚举**: `../resources/references/enums/EPCB_LayerColorConfiguration.md`

### Step 9: 设置非激活层显示（BETA）

**显示模式**: `eda.pcb_Layer.setInactiveLayerDisplayMode(displayMode?)`

**参考枚举**: `../resources/references/enums/EPCB_InactiveLayerDisplayMode.md`

**透明度**: `eda.pcb_Layer.setInactiveLayerTransparency(transparency)` — 范围 `0-100`

### Step 10: 设置 PCB 类型（BETA）

**API**: `eda.pcb_Layer.setPcbType(pcbType)`

**参考枚举**: `../resources/references/enums/EPCB_PcbPlateType.md`

> 主要用于适配 FPC 软板设计。切换为 FPC 时新增补强层；切回普通板材需先删除补强层上的图元。

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbLayer]';

export async function pcbLayerOperations() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      console.warn(PLUGIN_TAG, 'Not a PCB document');
      return;
    }

    // 获取所有图层
    const layers = await eda.pcb_Layer.getAllLayers();
    if (!layers || layers.length === 0) {
      console.warn(PLUGIN_TAG, 'No layers found');
      return;
    }
    console.warn(PLUGIN_TAG, `Found ${layers.length} layers`);

    // 选中顶层铜箔层（layerId = 1）
    await eda.pcb_Layer.selectLayer(1);

    // 仅显示顶层，隐藏其他层
    await eda.pcb_Layer.setLayerVisible(1, true);

    // 修改图层颜色
    await eda.pcb_Layer.modifyLayer(1, {
      color: '#FF0000',
      transparency: 50,
    });

    // 锁定底层（layerId = 2）
    await eda.pcb_Layer.lockLayer(2);

    // 设置铜箔层数为 4 层
    await eda.pcb_Layer.setTheNumberOfCopperLayers(4);

    // 新增自定义层
    const customLayerId = await eda.pcb_Layer.addCustomLayer();
    if (customLayerId) {
      console.warn(PLUGIN_TAG, 'Custom layer added:', customLayerId);
    } else {
      console.warn(PLUGIN_TAG, 'Failed to add custom layer (may have reached limit)');
    }

    // 设置非激活层透明度
    await eda.pcb_Layer.setInactiveLayerTransparency(30);
  } catch (err) {
    console.error(PLUGIN_TAG, 'PCB layer operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `modifyLayer` 名称修改不生效 | 仅内层和自定义层允许修改名称 | 顶层/底层等固定层不支持改名 |
| `removeLayer` 失败 | 仅支持移除自定义层 | 不能移除系统内置层 |
| `addCustomLayer` 返回 `undefined` | 自定义层数量已达上限 | 检查已有自定义层数量 |
| 透明度设置无效 | 值超出范围 | 透明度范围为 `0-100` |
| FPC 切回普通板材失败 | 补强层上有图元 | 先删除 FPC 补强层上的所有图元 |

## 变体

- **仅显示指定多个层**: 传入图层数组 `setLayerVisible([1, 2], true)` 显示顶层和底层
- **批量锁定所有层**: 不传参数 `lockLayer()` 默认锁定所有层
- **切换颜色主题**: 使用 `setLayerColorConfiguration()` 切换预设颜色方案
