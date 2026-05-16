# 格式转换：导入/导出 Altium Designer、KiCad 等 EDA 格式

> **适用摘要**: 使用 `sys_FormatConversion` 转换 Altium Designer 库文件为嘉立创格式，使用 `sys_FileManager.importProjectByProjectFile()` 导入多种 EDA 格式工程。

## 触发意图

- "转换 Altium Designer 库"
- "导入 KiCad 工程"
- "导入其他 EDA 格式"
- "格式转换"
- "AD 库转换为嘉立创格式"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求 |
| 文件 | 需要有对应格式的源文件 |

## 调用链

```
方式 A（库文件转换）:
  → sys_FormatConversion.convertAltiumDesignerLibrariesToEasyEDASingleFile(file)
  → sys_FormatConversion.convertAltiumDesignerLibrariesToEasyEDAMultiFiles(file)

方式 B（工程导入）:
  → sys_FileSystem.openReadFileDialog() — 选择文件
  → sys_FileManager.importProjectByProjectFile(file, fileType, props, saveTo)
```

## 分步说明

### 转换 AD 库为单个文件

**API**: `eda.sys_FormatConversion.convertAltiumDesignerLibrariesToEasyEDASingleFile(file)`

**参考**: `../resources/references/classes/SYS_FormatConversion.md`

**参数**: `File | Array<File>` — Altium Designer 库文件

**返回类型**: `Promise<File | undefined>`

### 转换 AD 库为多个文件

**API**: `eda.sys_FormatConversion.convertAltiumDesignerLibrariesToEasyEDAMultiFiles(file)`

**返回类型**: `Promise<Array<File>>` — 每个器件一个文件

### 导入工程文件

**API**: `eda.sys_FileManager.importProjectByProjectFile(projectFile, fileType?, props?, saveTo?, librariesImportSetting?)`

**参考**: `../resources/references/classes/SYS_FileManager.md`

**支持的文件类型**:
- `'Altium Designer'` | `'Protel'`
- `'JLCEDA'` | `'JLCEDA Pro'` | `'EasyEDA'` | `'EasyEDA Pro'`
- `'Allegro'` | `'OrCAD'` | `'EAGLE'` | `'KiCad'` | `'PADS'` | `'LTspice'`

**参考枚举**:
- `../resources/references/enums/ESYS_ImportProjectImportOption.md`
- `../resources/references/enums/ESYS_ImportProjectSchematicObjectStyle.md`

## 代码示例

```typescript
const PLUGIN_TAG = '[FormatConvert]';

export async function convertADLibrary() {
  try {
    // 选择 AD 库文件
    const file = await eda.sys_FileSystem.openReadFileDialog(
      ['.SchLib', '.PcbLib', '.IntLib'],
      false
    );
    if (!file) {
      console.warn(PLUGIN_TAG, 'No file selected');
      return;
    }

    eda.sys_LoadingAndProgressBar.showLoading();

    // 转换为单个嘉立创库文件
    const convertedFile = await eda.sys_FormatConversion
      .convertAltiumDesignerLibrariesToEasyEDASingleFile(file);

    eda.sys_LoadingAndProgressBar.destroyLoading();

    if (!convertedFile) {
      console.warn(PLUGIN_TAG, 'Conversion failed');
      await eda.sys_Dialog.showInformationMessage('转换失败');
      return;
    }

    // 保存转换后的文件
    await eda.sys_FileSystem.saveFile(convertedFile, 'converted-library.elibz');
    console.warn(PLUGIN_TAG, 'Library converted and saved');
    await eda.sys_Dialog.showInformationMessage('库文件转换完成！');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Conversion failed:', err);
    eda.sys_LoadingAndProgressBar.destroyLoading();
  }
}

export async function importKiCadProject() {
  try {
    // 选择 KiCad 工程文件
    const file = await eda.sys_FileSystem.openReadFileDialog(['.zip'], false);
    if (!file) {
      console.warn(PLUGIN_TAG, 'No file selected');
      return;
    }

    eda.sys_LoadingAndProgressBar.showLoading();

    const result = await eda.sys_FileManager.importProjectByProjectFile(
      file,
      'KiCad'
    );

    eda.sys_LoadingAndProgressBar.destroyLoading();

    if (!result) {
      console.warn(PLUGIN_TAG, 'Import failed');
      await eda.sys_Dialog.showInformationMessage('导入失败');
      return;
    }

    console.warn(PLUGIN_TAG, 'Project imported:', result.uuid);
    await eda.sys_Dialog.showInformationMessage('工程导入成功！');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Import failed:', err);
    eda.sys_LoadingAndProgressBar.destroyLoading();
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 转换返回 `undefined` | 文件格式不正确或损坏 | 确认文件是有效的 AD 库文件 |
| 导入工程失败 | fileType 不匹配 | 确认 fileType 与实际文件格式一致 |
| 导入时库提取失败 | 暂不支持提取库配置 | 按默认配置提取 |
| AD 导入缺少特定选项 | AD/Protel 有额外参数 | 传入 `viaSolderMaskExpansion`、`boardOutlineSource` 等参数 |

## 变体

- **AD 库转多文件**: `convertAltiumDesignerLibrariesToEasyEDAMultiFiles()` — 每个器件单独一个文件
- **批量转换**: 传入 `Array<File>` 一次转换多个库文件
- **导入到新工程**: 在 `saveTo` 参数中指定 `operation: 'New Project'`
- **导入到已有工程**: 在 `saveTo` 参数中指定 `operation: 'Existing Project'`
- **Altium Designer 工程导入**: fileType 设为 `'Altium Designer'`，支持额外的 via/board outline 选项
