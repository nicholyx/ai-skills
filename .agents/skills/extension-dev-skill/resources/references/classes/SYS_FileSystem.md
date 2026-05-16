# SYS\_FileSystem class

系统 / 文件系统交互类

## 签名

```typescript
declare class SYS_FileSystem
```

## 备注


## 方法

| 方法名                                                                         | 修饰符 | 描述                          |
| --------------------------------------------------------------------------- | --- | --------------------------- |
| [deleteFileInFileSystem(uri, force)](./SYS_FileSystem.md)                   |     | **_(BETA)_** 删除文件系统内的文件     |
| [getDocumentsPath()](./SYS_FileSystem.md)                                   |     | **_(BETA)_** 获取文档目录路径       |
| [getEdaPath()](./SYS_FileSystem.md)                                         |     | **_(BETA)_** 获取 EDA 文档目录路径  |
| [getExtensionFile(uri)](./SYS_FileSystem.md)                                |     | 获取扩展内的文件                    |
| [getLibrariesPaths()](./SYS_FileSystem.md)                                  |     | **_(BETA)_** 获取库目录路径        |
| [getProjectsPaths()](./SYS_FileSystem.md)                                   |     | **_(BETA)_** 获取工程目录路径       |
| [listFilesOfFileSystem(folderPath, recursive)](./SYS_FileSystem.md)         |     | **_(BETA)_** 查看文件系统路径下的文件列表 |
| [openReadFileDialog(filenameExtensions, multiFiles)](./SYS_FileSystem.md)   |     | **_(BETA)_** 打开读入文件窗口       |
| [openReadFileDialog(filenameExtensions, multiFiles)](./SYS_FileSystem.md)   |     | **_(BETA)_** 打开读入文件窗口       |
| [readFileFromFileSystem(uri)](./SYS_FileSystem.md)                          |     | **_(BETA)_** 从文件系统读取文件      |
| [saveFile(fileData, fileName)](./SYS_FileSystem.md)                         |     | 保存文件                        |
| [saveFileToFileSystem(uri, fileData, fileName, force)](./SYS_FileSystem.md) |     | **_(BETA)_** 向文件系统写入文件      |

---

## 方法详情

### deletefileinfilesystem

# SYS\_FileSystem.deleteFileInFileSystem() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除文件系统内的文件

## 签名

```typescript
deleteFileInFileSystem(uri: string, force?: boolean): Promise<boolean>;
```

## 参数名

| 参数    | 类型      | 描述                                                                                          |
| ----- | ------- | ------------------------------------------------------------------------------------------- |
| uri   | string  | 文件资源定位符 如若结尾为斜杠 `/`（Windows 为反斜杠 `\`），则识别为文件夹； 如若结尾非斜杠，则识别为完整文件名，此时 `fileName` 参数将被忽略 |
| force | boolean | _（可选）_ 强制删除文件夹（当欲删除的是文件夹且文件夹内有文件时，是否强制删除该文件夹）                                               |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

## 备注

注意 1：本接口仅客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### getdocumentspath

# SYS\_FileSystem.getDocumentsPath() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取文档目录路径

## 签名

```typescript
getDocumentsPath(): Promise<string>;
```


## 返回值

Promise&lt;string&gt;

文档目录路径

## 备注

返回的路径中，结尾不包含斜杠 `/`（或反斜杠 `\`）

注意 1：本接口仅客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### getedapath

# SYS\_FileSystem.getEdaPath() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 EDA 文档目录路径

## 签名

```typescript
getEdaPath(): Promise<string>;
```


## 返回值

Promise&lt;string&gt;

EDA 文档目录路径

## 备注

返回的路径中，结尾不包含斜杠 `/`（或反斜杠 `\`）

注意 1：本接口仅客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### getextensionfile

# SYS\_FileSystem.getExtensionFile() method

获取扩展内的文件

## 签名

```typescript
getExtensionFile(uri: string): Promise<File | undefined>;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| uri | string | 文件路径 |



## 返回值

Promise&lt;File \| undefined&gt;

File 格式文件

### getlibrariespaths

# SYS\_FileSystem.getLibrariesPaths() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取库目录路径

## 签名

```typescript
getLibrariesPaths(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

库目录路径数组

## 备注

注意 1：本接口仅全离线客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### getprojectspaths

# SYS\_FileSystem.getProjectsPaths() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取工程目录路径

## 签名

```typescript
getProjectsPaths(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

工程目录路径数组

## 备注

注意 1：本接口仅离线客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### listfilesoffilesystem

# SYS\_FileSystem.listFilesOfFileSystem() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

查看文件系统路径下的文件列表

## 签名

```typescript
listFilesOfFileSystem(folderPath: string, recursive?: boolean): Promise<Array<ISYS_FileSystemFileList>>;
```

## 参数名

| 参数         | 类型      | 描述                 |
| ---------- | ------- | ------------------ |
| folderPath | string  | 目录路径               |
| recursive  | boolean | _（可选）_ 是否递归获取所有子文件 |



## 返回值

Promise&lt;Array&lt;[ISYS\_FileSystemFileList](../interfaces/ISYS_FileSystemFileList.md)&gt;&gt;

当前目录下的文件列表

## 备注

注意 1：本接口仅客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### openreadfiledialog

# SYS\_FileSystem.openReadFileDialog() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

打开读入文件窗口

## 签名

```typescript
openReadFileDialog(filenameExtensions?: string | Array<string>, multiFiles?: true): Promise<Array<File> | undefined>;
```

## 参数名

| 参数                 | 类型                            | 描述               |
| ------------------ | ----------------------------- | ---------------- |
| filenameExtensions | string \| Array&lt;string&gt; | _（可选）_ 文件扩展名     |
| multiFiles         | true                          | _（可选）_ 是否允许读取多文件 |



## 返回值

Promise&lt;Array&lt;File&gt; \| undefined&gt;

File 格式文件数组

### openreadfiledialog_1

# SYS\_FileSystem.openReadFileDialog() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

打开读入文件窗口

## 签名

```typescript
openReadFileDialog(filenameExtensions?: string | Array<string>, multiFiles?: false): Promise<File | undefined>;
```

## 参数名

| 参数                 | 类型                            | 描述               |
| ------------------ | ----------------------------- | ---------------- |
| filenameExtensions | string \| Array&lt;string&gt; | _（可选）_ 文件扩展名     |
| multiFiles         | false                         | _（可选）_ 是否允许读取多文件 |



## 返回值

Promise&lt;File \| undefined&gt;

File 格式文件

### readfilefromfilesystem

# SYS\_FileSystem.readFileFromFileSystem() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

从文件系统读取文件

## 签名

```typescript
readFileFromFileSystem(uri: string): Promise<File | undefined>;
```

## 参数名

| 参数  | 类型     | 描述                       |
| --- | ------ | ------------------------ |
| uri | string | 文件资源定位符，需要包含完整的文件名称的绝对路径 |



## 返回值

Promise&lt;File \| undefined&gt;

File 格式文件

## 备注

注意 1：本接口仅客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`

### savefile

# SYS\_FileSystem.saveFile() method

保存文件

## 签名

```typescript
saveFile(fileData: File | Blob, fileName?: string): Promise<void>;
```

## 参数名

| 参数       | 类型           | 描述          |
| -------- | ------------ | ----------- |
| fileData | File \| Blob | 文件数据        |
| fileName | string       | _（可选）_ 文件名称 |



## 返回值

Promise&lt;void&gt;

## 备注

调用浏览器下载接口或 Electron 保存文件接口，将传入的文件流保存到本地

### savefiletofilesystem

# SYS\_FileSystem.saveFileToFileSystem() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

向文件系统写入文件

## 签名

```typescript
saveFileToFileSystem(uri: string, fileData: File | Blob, fileName?: string, force?: boolean): Promise<boolean>;
```

## 参数名

| 参数       | 类型           | 描述                                                                                          |
| -------- | ------------ | ------------------------------------------------------------------------------------------- |
| uri      | string       | 文件资源定位符 如若结尾为斜杠 `/`（Windows 为反斜杠 `\`），则识别为文件夹； 如若结尾非斜杠，则识别为完整文件名，此时 `fileName` 参数将被忽略 |
| fileData | File \| Blob | 文件数据                                                                                        |
| fileName | string       | _（可选）_ 文件名称                                                                                 |
| force    | boolean      | _（可选）_ 强制写入（文件存在则覆盖文件）                                                                      |



## 返回值

Promise&lt;boolean&gt;

写入操作是否成功，如若不允许覆盖但文件已存在将返回 `false` 的结果

## 备注

注意 1：本接口仅客户端有效，在浏览器环境内调用将始终 `throw Error`

注意 2：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`
