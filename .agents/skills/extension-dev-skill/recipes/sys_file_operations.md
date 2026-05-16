# 文件系统操作：保存文件、读取文件、文件管理

> **适用摘要**: 使用 `sys_FileSystem` 进行文件保存/读取/删除操作，使用 `sys_FileManager` 获取文档/工程/器件文件和源码。

## 触发意图

- "保存文件到本地"
- "读取本地文件"
- "导出工程文件"
- "获取文档源码"
- "导入工程文件"
- "打开文件选择对话框"

## 前置条件

| 条件 | 要求 |
|---|---|
| 文件系统操作 | 部分方法仅客户端可用（非浏览器环境） |
| 权限 | 文件系统读写需启用外部交互权限 |

## 调用链

```
方式 A（保存文件）:
  → sys_FileSystem.saveFile(fileData, fileName) — 浏览器下载/客户端保存

方式 B（文件系统读写，仅客户端）:
  → sys_FileSystem.saveFileToFileSystem(uri, fileData, fileName, force)
  → sys_FileSystem.readFileFromFileSystem(uri)
  → sys_FileSystem.deleteFileInFileSystem(uri, force)

方式 C（文档/工程文件管理）:
  → sys_FileManager.getDocumentFile() — 获取当前文档文件
  → sys_FileManager.getProjectFile() — 获取当前工程文件
  → sys_FileManager.getDocumentSource() — 获取文档源码
```

## 分步说明

### 保存文件（通用）

**API**: `eda.sys_FileSystem.saveFile(fileData, fileName?)`

**参考**: `../resources/references/classes/SYS_FileSystem.md`

**返回类型**: `Promise<void>`

调用浏览器下载接口或 Electron 保存文件接口。

### 打开文件选择对话框

**API**: `eda.sys_FileSystem.openReadFileDialog(filenameExtensions?, multiFiles?)`

**返回类型**: `Promise<File | Array<File> | undefined>`

### 文件系统直接读写（仅客户端）

- `readFileFromFileSystem(uri)` — 读取文件
- `saveFileToFileSystem(uri, fileData, fileName?, force?)` — 写入文件
- `deleteFileInFileSystem(uri, force?)` — 删除文件
- `listFilesOfFileSystem(folderPath, recursive?)` — 列出目录文件

### 获取文档/工程文件

**API**: `eda.sys_FileManager`

**参考**: `../resources/references/classes/SYS_FileManager.md`

- `getDocumentFile(fileName?, password?, fileType?)` — 获取当前文档文件
- `getProjectFile(fileName?, password?, fileType?)` — 获取当前工程文件
- `getDocumentSource()` — 获取文档源码（BETA）
- `setDocumentSource(source)` — 修改文档源码（BETA）
- `getDeviceFileByDeviceUuid(deviceUuid, libraryUuid?, fileType?)` — 获取器件文件

### 获取路径信息

- `getDocumentsPath()` — 文档目录路径
- `getEdaPath()` — EDA 文档目录路径
- `getProjectsPaths()` — 工程目录路径（仅离线客户端）
- `getLibrariesPaths()` — 库目录路径（仅全离线客户端）

## 代码示例

```typescript
const PLUGIN_TAG = '[FileOps]';

export async function exportDocument() {
  try {
    // 获取当前文档文件
    const file = await eda.sys_FileManager.getDocumentFile('my-export');
    if (!file) {
      console.warn(PLUGIN_TAG, 'No document file available');
      await eda.sys_Dialog.showInformationMessage('请先打开一个文档');
      return;
    }

    // 保存到本地
    await eda.sys_FileSystem.saveFile(file, 'my-export.epro');
    console.warn(PLUGIN_TAG, 'Document exported successfully');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Export failed:', err);
  }
}

export async function readUserFile() {
  try {
    // 打开文件选择对话框
    const file = await eda.sys_FileSystem.openReadFileDialog(['.json', '.csv'], false);
    if (!file) {
      console.warn(PLUGIN_TAG, 'No file selected');
      return;
    }

    const text = await file.text();
    console.warn(PLUGIN_TAG, 'File content length:', text.length);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Read file failed:', err);
  }
}

export async function saveToFileSystem() {
  try {
    const data = JSON.stringify({ version: '1.0', data: [] });
    const blob = new Blob([data], { type: 'application/json' });

    const edaPath = await eda.sys_FileSystem.getEdaPath();
    const success = await eda.sys_FileSystem.saveFileToFileSystem(
      `${edaPath}/plugin-data/`,
      blob,
      'config.json',
      true // force overwrite
    );

    if (success) {
      console.warn(PLUGIN_TAG, 'File saved to file system');
    } else {
      console.warn(PLUGIN_TAG, 'File save failed');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Save to file system failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 文件系统方法抛出 Error | 在浏览器环境调用仅客户端方法 | 使用 `sys_Environment.isClient()` 检查环境 |
| 未启用外部交互权限 | 文件系统操作需要权限 | 在扩展设置中启用外部交互权限 |
| `saveFileToFileSystem` 返回 `false` | 文件已存在且 `force` 为 `false` | 设置 `force: true` 或先删除 |
| URI 路径格式错误 | 结尾斜杠决定是文件夹还是文件 | 文件夹以 `/` 结尾，完整文件名不以 `/` 结尾 |
| `getDocumentFile` 返回 `undefined` | 未打开文档或无导出权限 | 确认已打开文档，检查权限 |

## 变体

- **导入工程**: `sys_FileManager.importProjectByProjectFile()` — 支持多种格式（Altium Designer, KiCad 等）
- **获取扩展内文件**: `sys_FileSystem.getExtensionFile(uri)` — 读取扩展包内的资源文件
- **获取器件文件**: `sys_FileManager.getDeviceFileByDeviceUuid()` — 导出器件库文件
- **获取封装文件**: `sys_FileManager.getFootprintFileByFootprintUuid()`
