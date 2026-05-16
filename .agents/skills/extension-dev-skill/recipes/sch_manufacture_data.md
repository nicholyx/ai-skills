# 原理图生产资料导出：BOM、网表、文档导出、元件下单

> **适用摘要**: 从原理图导出生产资料——BOM 文件、网表文件、仿真网表、文档导出（PDF/SVG 等），以及元件下单和 SMT 下单。

## 触发意图

- "导出 BOM"
- "导出网表文件"
- "导出原理图为 PDF"
- "导出仿真网表"
- "元件下单"
- "SMT 下单"
- "获取装配体变量配置"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 权限 | 下单操作需要对应权限 |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_ManufactureData.getBomFile(...) — 获取 BOM 文件
  → Step 2: sch_ManufactureData.getNetlistFile(...) — 获取网表文件
  → Step 3: sch_ManufactureData.getExportDocumentFile(...) — 获取导出文档
  → Step 4: sys_FileSystem.saveFile(file) — 保存到本地
  → [可选] Step 5: sch_ManufactureData.placeComponentsOrder(...) — 元件下单
```

## 分步说明

### Step 1: 获取 BOM 文件（BETA）

**API**: `eda.sch_ManufactureData.getBomFile(fileName?, fileType?, template?, filterOptions?, statistics?, property?, columns?, assemblyVariantsConfig?)`

**参考**: `../resources/references/classes/SCH_ManufactureData.md`

**参数说明**:
- `fileName`（可选）— 文件名
- `fileType`（可选）— `'xlsx'` 或 `'csv'`
- `template`（可选）— 模板名称
- `filterOptions`（可选）— 过滤规则数组
- `assemblyVariantsConfig`（可选）— 装配体变量配置

**返回类型**: `Promise<File | undefined>`

> 也可参考 `recipes/export_sch_bom.md` 获取更详细的 BOM 导出说明。

### Step 2: 获取网表文件（BETA）

**API**: `eda.sch_ManufactureData.getNetlistFile(fileName?, netlistType?)`

**参考枚举**: `../resources/references/enums/ESYS_NetlistType.md`

**返回类型**: `Promise<File | undefined>`

### Step 3: 获取导出文档文件（BETA）

**API**: `eda.sch_ManufactureData.getExportDocumentFile(fileName?, fileType?, typeSpecificParams?, object?, objectSpecificParams?)`

**参考枚举**: `../resources/references/enums/ESCH_ExportDocumentFileType.md`

**参数说明**:
- `fileType`（可选）— 导出文件类型（PDF、SVG 等）
- `typeSpecificParams`（可选）— 类型特定参数（主题、线宽、尺寸等）
- `object`（可选）— 导出范围：`'All Schematic'` / `'Current Schematic'` / `'Current Schematic Page'`
- `objectSpecificParams`（可选）— 对象特定参数（页码范围、输出方式等）

**返回类型**: `Promise<File | undefined>`

### Step 4: 保存文件到本地

使用 `eda.sys_FileSystem.saveFile(file)` 将获取的 File 对象保存到本地文件系统。

### Step 5: 获取装配体变量配置（BETA）

**API**: `eda.sch_ManufactureData.getAssemblyVariantsConfigs()`

**返回类型**: `Promise<Array<{ text: string; value: string }>>`

### Step 6: 元件下单（BETA）

**API**: `eda.sch_ManufactureData.placeComponentsOrder(interactive?, ignoreWarning?)`

**参数说明**:
- `interactive`（可选）— 是否启用交互式检查（弹窗）
- `ignoreWarning`（可选）— 非交互式时是否忽略警告

**返回类型**: `Promise<boolean>` — 是否通过下单检查

### Step 7: SMT 元件下单（BETA）

**API**: `eda.sch_ManufactureData.placeSmtComponentsOrder(interactive?, ignoreWarning?)`

**参数说明**: 同 `placeComponentsOrder`

### Step 8: 获取仿真网表文件（BETA）

**API**: `eda.sch_ManufactureData.getSimulationNetlistFile(fileName?, netlistType?)`

**参考枚举**: `../resources/references/enums/ESCH_SimulationNetlistType.md`

**返回类型**: `Promise<File | undefined>`

## 代码示例

```typescript
const PLUGIN_TAG = '[SchManufacture]';

export async function exportManufactureData() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      return;
    }

    // 导出 BOM 为 xlsx
    const bomFile = await eda.sch_ManufactureData.getBomFile(
      'my_bom',
      'xlsx'
    );
    if (bomFile) {
      await eda.sys_FileSystem.saveFile(bomFile);
      console.warn(PLUGIN_TAG, 'BOM exported');
    } else {
      console.warn(PLUGIN_TAG, 'Failed to get BOM file');
    }

    // 导出网表
    const netlistFile = await eda.sch_ManufactureData.getNetlistFile(
      'my_netlist'
    );
    if (netlistFile) {
      await eda.sys_FileSystem.saveFile(netlistFile);
      console.warn(PLUGIN_TAG, 'Netlist exported');
    }

    // 导出原理图为 PDF（所有原理图）
    const pdfFile = await eda.sch_ManufactureData.getExportDocumentFile(
      'schematic_export',
      undefined,
      undefined,
      'All Schematic'
    );
    if (pdfFile) {
      await eda.sys_FileSystem.saveFile(pdfFile);
      console.warn(PLUGIN_TAG, 'PDF exported');
    }

    // 静默元件下单（忽略警告）
    const orderResult = await eda.sch_ManufactureData.placeComponentsOrder(
      false,  // 非交互式
      true    // 忽略警告
    );
    if (orderResult) {
      console.warn(PLUGIN_TAG, 'Component order placed');
    } else {
      console.warn(PLUGIN_TAG, 'Component order check failed');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Manufacture data export failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getBomFile` 返回 `undefined` | 原理图无器件或参数错误 | 确保原理图中有器件 |
| 使用旧的 `sch_Netlist.getNetlist()` | 已弃用 | 改用 `sch_ManufactureData.getNetlistFile()` |
| 下单时弹窗阻塞 | `interactive = true` 时会弹窗 | 静默下单设置 `interactive = false` |
| 忽略警告后下单失败 | 存在错误（非警告） | 错误无法忽略，需修复后重试 |
| 文件未保存到本地 | 忘记调用 `sys_FileSystem.saveFile()` | 获取 File 对象后需手动保存 |

## 变体

- **带过滤的 BOM 导出**: 传入 `filterOptions` 过滤特定器件
- **带装配体变量的 BOM**: 先调用 `getAssemblyVariantsConfigs()` 获取配置，再传入 `getBomFile()`
- **导出指定页码范围**: 在 `objectSpecificParams` 中设置 `range: [1, 3]`
- **合并/分离输出**: 在 `objectSpecificParams` 中设置 `outputMethod: 'Merged sheet'` 或 `'Separated sheet'`
- **详细 BOM 导出**: 参考 `recipes/export_sch_bom.md`
