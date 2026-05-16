# 原理图网表操作：获取/更新网表

> **适用摘要**: 获取和更新原理图网表数据。注意 `getNetlist` 已弃用，推荐使用 `sch_ManufactureData.getNetlistFile()` 替代。

## 触发意图

- "获取原理图网表"
- "导出网表"
- "更新网表数据"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_Netlist.getNetlist(type?) — 获取网表（已弃用）
  → [推荐] sch_ManufactureData.getNetlistFile(fileName?, netlistType?) — 获取网表文件
  → Step 2: sch_Netlist.setNetlist(type, netlist) — 更新网表（BETA）
```

## 分步说明

### Step 1: 获取网表（已弃用）

**API**: `eda.sch_Netlist.getNetlist(type?)`

**参考**: `../resources/references/classes/SCH_Netlist.md`

**参数说明**:
- `type`（可选）— 网表格式，参考 `../resources/references/enums/ESYS_NetlistType.md`

**返回类型**: `Promise<string>` — 网表数据字符串

> ⚠️ 此 API 已弃用，请使用 `eda.sch_ManufactureData.getNetlistFile()` 替代。

### [推荐] 获取网表文件

**API**: `eda.sch_ManufactureData.getNetlistFile(fileName?, netlistType?)`

**参考**: `../resources/references/classes/SCH_ManufactureData.md`

**参数说明**:
- `fileName`（可选）— 文件名
- `netlistType`（可选）— 网表类型，参考 `../resources/references/enums/ESYS_NetlistType.md`

**返回类型**: `Promise<File | undefined>` — 网表文件数据

> 可以使用 `eda.sys_FileSystem.saveFile()` 将文件导出到本地。

### Step 2: 更新网表（BETA）

**API**: `eda.sch_Netlist.setNetlist(type, netlist)`

**参数说明**:
- `type` — 网表格式（`ESYS_NetlistType | undefined`）
- `netlist` — 网表数据字符串

**返回类型**: `Promise<void>`

## 代码示例

```typescript
const PLUGIN_TAG = '[SchNetlist]';

export async function netlistOperations() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      return;
    }

    // 推荐方式：获取网表文件
    const netlistFile = await eda.sch_ManufactureData.getNetlistFile(
      'my_netlist'
    );
    if (!netlistFile) {
      console.warn(PLUGIN_TAG, 'Failed to get netlist file');
      return;
    }
    console.warn(PLUGIN_TAG, `Netlist file: ${netlistFile.name}, size: ${netlistFile.size}`);

    // 保存到本地
    await eda.sys_FileSystem.saveFile(netlistFile);

    // 旧方式（已弃用）：获取网表字符串
    // const netlistStr = await eda.sch_Netlist.getNetlist();

    // 更新网表（BETA）
    // await eda.sch_Netlist.setNetlist(undefined, netlistData);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Netlist operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用已弃用的 `getNetlist` | API 已弃用 | 改用 `sch_ManufactureData.getNetlistFile()` |
| `getNetlistFile` 返回 `undefined` | 原理图无有效网表数据 | 确保原理图中有器件和连接 |
| `setNetlist` 格式错误 | 网表数据格式不匹配 | 确保 type 和 netlist 数据格式一致 |

## 变体

- **获取仿真网表**: 使用 `eda.sch_ManufactureData.getSimulationNetlistFile(fileName?, netlistType?)`
- **导出 BOM**: 使用 `eda.sch_ManufactureData.getBomFile()`，参考 `recipes/export_sch_bom.md`
- **导出文档文件**: 使用 `eda.sch_ManufactureData.getExportDocumentFile()` 导出 PDF/SVG 等
