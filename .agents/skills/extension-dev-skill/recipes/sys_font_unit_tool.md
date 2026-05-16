# 字体管理、单位转换与工具类

> **适用摘要**: 使用 `sys_FontManager` 管理字体列表，使用 `sys_Unit` 进行 mil/mm/inch 单位转换，使用 `sys_Tool` 进行网表对比，使用 `sys_Log` 管理日志，使用 `sys_Setting` 恢复默认设置。

## 触发意图

- "添加/删除字体"
- "单位转换 mil 到 mm"
- "获取系统数据单位"
- "网表对比"
- "添加日志条目"
- "导出日志"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求 |

## 调用链

```
字体管理:
  → sys_FontManager.getFontsList() — 获取字体列表
  → sys_FontManager.addFont(fontName) — 添加字体
  → sys_FontManager.deleteFont(fontName) — 删除字体

单位转换:
  → sys_Unit.milToMm(mil) / mmToMil(mm) — mil ↔ mm
  → sys_Unit.milToInch(mil) / inchToMil(inch) — mil ↔ inch
  → sys_Unit.mmToInch(mm) / inchToMm(inch) — mm ↔ inch

工具:
  → sys_Tool.netlistComparison(netlist1, netlist2) — 网表对比

日志:
  → sys_Log.add(message, type?) — 添加日志
  → sys_Log.sort(types?) / find(message, types?) — 筛选/查找
  → sys_Log.export(types?) — 导出日志
```

## 分步说明

### 字体管理

**API**: `eda.sys_FontManager`

**参考**: `../resources/references/classes/SYS_FontManager.md`

- `getFontsList()` → `Promise<Array<string>>` — 获取已配置字体列表
- `addFont(fontName)` → `Promise<boolean>` — 添加字体
- `deleteFont(fontName)` → `Promise<boolean>` — 删除字体

### 单位转换

**API**: `eda.sys_Unit`

**参考**: `../resources/references/classes/SYS_Unit.md`

> ⚠️ **关键说明**: API 系统数据单位等效为 `mil`。所有坐标、尺寸数据的单位都是 mil。

**转换方法**（均支持 `numberOfDecimals` 参数，默认保留 4 位小数）:
- `milToMm(mil)` / `mmToMil(mm)`
- `milToInch(mil)` / `inchToMil(inch)`
- `mmToInch(mm)` / `inchToMm(inch)`
- `getSystemDataUnit()` → 始终返回 `ESYS_Unit.MIL`

### 网表对比（BETA）

**API**: `eda.sys_Tool.netlistComparison(netlist1, netlist2)`

**参考**: `../resources/references/classes/SYS_Tool.md`

支持三种输入格式：
1. 当前工程内的原理图/PCB UUID（字符串）
2. 其他工程的 `{ projectUuid, documentUuid }`
3. 原理图/PCB 文件数据（`File`）

### 日志管理

**API**: `eda.sys_Log`

**参考**: `../resources/references/classes/SYS_Log.md`

**参考枚举**: `../resources/references/enums/ESYS_LogType.md`

- `add(message, type?)` — 添加日志条目
- `sort(types?)` — 筛选并获取日志条目
- `find(message, types?)` — 查找日志条目
- `export(types?)` — 导出日志
- `clear()` — 清空日志

### 恢复默认设置（BETA）

**API**: `eda.sys_Setting.restoreDefault()`

**参考**: `../resources/references/classes/SYS_Setting.md`

> ⚠️ 此操作会丢失所有设置项，请谨慎使用。

## 代码示例

```typescript
const PLUGIN_TAG = '[FontUnitTool]';

export async function manageFonts() {
  try {
    // 获取当前字体列表
    const fonts = await eda.sys_FontManager.getFontsList();
    console.warn(PLUGIN_TAG, `Current fonts: ${fonts.length}`);

    // 添加字体
    const added = await eda.sys_FontManager.addFont('Arial');
    if (added) {
      console.warn(PLUGIN_TAG, 'Font added: Arial');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Font management failed:', err);
  }
}

export async function convertUnits() {
  try {
    // API 数据单位是 mil
    const widthInMil = 100; // 100 mil

    const widthInMm = eda.sys_Unit.milToMm(widthInMil);
    const widthInInch = eda.sys_Unit.milToInch(widthInMil);

    console.warn(PLUGIN_TAG, `${widthInMil} mil = ${widthInMm} mm = ${widthInInch} inch`);

    // 反向转换
    const mmValue = 2.54;
    const milValue = eda.sys_Unit.mmToMil(mmValue);
    console.warn(PLUGIN_TAG, `${mmValue} mm = ${milValue} mil`);

    await eda.sys_Dialog.showInformationMessage(
      `${widthInMil} mil = ${widthInMm} mm = ${widthInInch} inch`
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'Unit conversion failed:', err);
  }
}

export async function compareNetlists() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo) {
      console.warn(PLUGIN_TAG, 'No active document');
      return;
    }

    // 对比当前文档与另一个文档的网表
    const result = await eda.sys_Tool.netlistComparison(
      docInfo.uuid,
      { projectUuid: docInfo.projectUuid, documentUuid: 'other-doc-uuid' }
    );

    console.warn(PLUGIN_TAG, `Netlist differences: ${result.length}`);
    for (const diff of result) {
      console.warn(PLUGIN_TAG, `  ${diff.type}: ${diff.object}`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Netlist comparison failed:', err);
  }
}

export async function manageLog() {
  try {
    // 添加日志
    eda.sys_Log.add('Plugin started');
    eda.sys_Log.add('Warning: low memory', 1); // warning type

    // 查找日志
    const found = await eda.sys_Log.find('Plugin');
    console.warn(PLUGIN_TAG, `Found ${found.length} log entries`);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Log management failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 坐标值异常大/小 | 未做单位转换，混用 mil 和 mm | API 数据单位是 mil，需要时用 `sys_Unit` 转换 |
| `getSystemDataUnit()` 返回 MIL | 设计如此，不会改变 | 所有 API 坐标/尺寸数据都是 mil |
| 网表对比结果为空 | 两个网表完全一致 | 正常结果，表示无差异 |
| `restoreDefault()` 丢失所有设置 | 设计如此 | 调用前确认用户意图 |

## 变体

- **自定义小数位数**: 所有转换方法支持 `numberOfDecimals` 参数，如 `milToMm(100, 2)` 保留 2 位
- **日志筛选**: `sort(types)` 传入日志类型数组筛选特定类型
- **日志导出**: `export(types?)` 导出日志到文件
- **网表对比文件输入**: 传入 `File` 对象直接对比文件
