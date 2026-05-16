# PCB 生产资料导出：Gerber、BOM、坐标文件、钻孔文件、快捷下单

> **适用摘要**: 从 PCB 导出生产资料——Gerber 制版文件、BOM、坐标文件（Pick and Place）、网表、PDF、DXF、ODB++、3D 模型、Altium Designer 文件、飞针测试文件，以及 PCB 下单、元件下单、SMT 下单。

## 触发意图

- "导出 Gerber 文件"
- "导出 PCB BOM"
- "导出坐标文件"
- "导出网表"
- "导出 PCB 为 PDF"
- "导出 ODB++ 文件"
- "导出 3D 模型"
- "PCB 下单"
- "元件下单"
- "SMT 下单"
- "导出 DXF 文件"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3） |
| 权限 | 下单操作需要对应权限 |

## 调用链

```
确认当前文档为 PCB
  → Step 1: pcb_ManufactureData.getGerberFile(...) — 获取 Gerber 制版文件
  → Step 2: pcb_ManufactureData.getBomFile(...) — 获取 BOM 文件
  → Step 3: pcb_ManufactureData.getPickAndPlaceFile(...) — 获取坐标文件
  → Step 4: pcb_ManufactureData.getNetlistFile(...) — 获取网表文件
  → Step 5: pcb_ManufactureData.getPdfFile(...) — 获取 PDF 文件
  → Step 6: sys_FileSystem.saveFile(file) — 保存到本地
  → [可选] pcb_ManufactureData.placePcbOrder(...) — PCB 下单
  → [可选] pcb_ManufactureData.placeComponentsOrder(...) — 元件下单
  → [可选] pcb_ManufactureData.placeSmtComponentsOrder(...) — SMT 下单
```

## 分步说明

### Step 1: 获取 Gerber 制版文件（BETA）

**API**: `eda.pcb_ManufactureData.getGerberFile(fileName?, colorSilkscreen?, unit?, digitalFormat?, other?, layers?, objects?)`

**参考**: `../resources/references/classes/PCB_ManufactureData.md`

**参数说明**:
- `fileName`（可选）— 文件名
- `colorSilkscreen`（可选）— 是否生成彩色丝印制造文件（嘉立创专用）
- `unit`（可选）— 单位（`ESYS_Unit.MILLIMETER` 或 `ESYS_Unit.INCH`）
- `digitalFormat`（可选）— 数字格式 `{ integerNumber, decimalNumber }`
- `other`（可选）— 其他选项（金属钻孔、非金属钻孔、钻孔表、飞针测试文件）
- `layers`（可选）— 导出层，默认按嘉立创生产需求导出
- `objects`（可选）— 导出对象

**返回类型**: `Promise<File | undefined>`

### Step 2: 获取 BOM 文件（BETA）

**API**: `eda.pcb_ManufactureData.getBomFile(fileName?, fileType?, template?, filterOptions?, statistics?, property?, columns?)`

**参数说明**:
- `fileType`（可选）— `'xlsx'` 或 `'csv'`
- `template`（可选）— BOM 模板名称
- `filterOptions`（可选）— 过滤规则数组

**返回类型**: `Promise<File | undefined>`

**BOM 模板管理**:
- `getBomTemplates()` — 获取模板列表
- `getBomTemplateFile(template)` — 获取模板文件
- `uploadBomTemplateFile(file, template)` — 上传模板
- `deleteBomTemplate(template)` — 删除模板

### Step 3: 获取坐标文件（BETA）

**API**: `eda.pcb_ManufactureData.getPickAndPlaceFile(fileName?, fileType?, unit?)`

**参数说明**:
- `fileType`（可选）— `'xlsx'` 或 `'csv'`
- `unit`（可选）— `ESYS_Unit.MILLIMETER` 或 `ESYS_Unit.MIL`

**返回类型**: `Promise<File | undefined>`

### Step 4: 获取网表文件（BETA）

**API**: `eda.pcb_ManufactureData.getNetlistFile(fileName?, netlistType?)`

**参考枚举**: `../resources/references/enums/ESYS_NetlistType.md`

**返回类型**: `Promise<File | undefined>`

### Step 5: 获取 PDF 文件（BETA）

**API**: `eda.pcb_ManufactureData.getPdfFile(fileName?, outputMethod?, contentConfig?, watermark?)`

**参考枚举**: `../resources/references/enums/EPCB_PdfOutputMethod.md`

**返回类型**: `Promise<File | undefined>`

### Step 6: 保存文件到本地

使用 `eda.sys_FileSystem.saveFile(file)` 将获取的 File 对象保存到本地文件系统。

### 其他导出格式（BETA）

- **DXF**: `getDxfFile(fileName?, layers?, objects?)`
- **ODB++**: `getOpenDatabaseDoublePlusFile(fileName?, unit?, otherData?, layers?, objects?)`
- **3D 模型**: `get3DFile(fileName?, fileType?, element?, modelMode?, autoGenerateModels?)`
- **3D 外壳**: `get3DShellFile(fileName?, fileType?)`
- **Altium Designer**: `getAltiumDesignerFile(fileName?)`
- **PADS**: `getPadsFile(fileName?)`
- **DSN 自动布线**: `getDsnFile(fileName?)`
- **IPC-D-356A**: `getIpcD356AFile(fileName?)`
- **IDX**: `getIdxFile(fileName?)`
- **飞针测试**: `getFlyingProbeTestFile(fileName?)`
- **测试点报告**: `getTestPointFile(fileName?, fileType?)`
- **PCB 信息**: `getPcbInfoFile(fileName?)`
- **自动布局 JSON**: `getAutoLayoutJsonFile(fileName?)`
- **自动布线 JSON**: `getAutoRouteJsonFile(fileName?)`

### 快捷下单（BETA）

- **PCB 下单**: `eda.pcb_ManufactureData.placePcbOrder(interactive?, ignoreWarning?)`
- **元件下单**: `eda.pcb_ManufactureData.placeComponentsOrder(interactive?, ignoreWarning?)`
- **SMT 下单**: `eda.pcb_ManufactureData.placeSmtComponentsOrder(interactive?, ignoreWarning?)`
- **3D 外壳下单**: `eda.pcb_ManufactureData.place3DShellOrder(interactive?, ignoreWarning?)`

**参数说明**:
- `interactive`（可选）— 是否启用交互式检查（弹窗）
- `ignoreWarning`（可选）— 非交互式时是否忽略警告

**返回类型**: `Promise<boolean>` — 是否通过下单检查

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbManufacture]';

export async function exportPcbManufactureData() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      console.warn(PLUGIN_TAG, 'Not a PCB document');
      return;
    }

    // 导出 Gerber 文件（默认配置）
    const gerberFile = await eda.pcb_ManufactureData.getGerberFile('my_gerber');
    if (gerberFile) {
      await eda.sys_FileSystem.saveFile(gerberFile);
      console.warn(PLUGIN_TAG, 'Gerber exported');
    } else {
      console.warn(PLUGIN_TAG, 'Failed to get Gerber file');
    }

    // 导出 BOM 为 xlsx
    const bomFile = await eda.pcb_ManufactureData.getBomFile('my_bom', 'xlsx');
    if (bomFile) {
      await eda.sys_FileSystem.saveFile(bomFile);
      console.warn(PLUGIN_TAG, 'BOM exported');
    }

    // 导出坐标文件（csv，毫米单位）
    const pickPlaceFile = await eda.pcb_ManufactureData.getPickAndPlaceFile(
      'my_pick_place',
      'csv'
    );
    if (pickPlaceFile) {
      await eda.sys_FileSystem.saveFile(pickPlaceFile);
      console.warn(PLUGIN_TAG, 'Pick and place file exported');
    }

    // 导出网表
    const netlistFile = await eda.pcb_ManufactureData.getNetlistFile('my_netlist');
    if (netlistFile) {
      await eda.sys_FileSystem.saveFile(netlistFile);
      console.warn(PLUGIN_TAG, 'Netlist exported');
    }

    // 静默 PCB 下单（忽略警告）
    const orderResult = await eda.pcb_ManufactureData.placePcbOrder(false, true);
    if (orderResult) {
      console.warn(PLUGIN_TAG, 'PCB order placed');
    } else {
      console.warn(PLUGIN_TAG, 'PCB order check failed');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'PCB manufacture data export failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getGerberFile` 返回 `undefined` | PCB 无板框或参数错误 | 确保 PCB 有完整板框 |
| 文件未保存到本地 | 忘记调用 `sys_FileSystem.saveFile()` | 获取 File 对象后需手动保存 |
| 下单时弹窗阻塞 | `interactive = true` 时会弹窗 | 静默下单设置 `interactive = false` |
| 忽略警告后下单失败 | 存在错误（非警告） | 错误无法忽略，需修复后重试 |
| `getManufactureData` 报错 | 仅私有化部署版本可用 | 公有云版本使用具体的导出方法 |
| 在 SCH 中调用 `pcb_ManufactureData` | 文档类型不匹配 | SCH 使用 `sch_ManufactureData` |

## 变体

- **带过滤的 BOM 导出**: 传入 `filterOptions` 过滤特定器件
- **自定义 Gerber 导出层**: 传入 `layers` 和 `objects` 参数指定导出范围
- **导出 3D STEP 模型**: 使用 `get3DFile('model', 'step')` 导出装配体
- **原理图生产资料**: 参考 `recipes/sch_manufacture_data.md`
