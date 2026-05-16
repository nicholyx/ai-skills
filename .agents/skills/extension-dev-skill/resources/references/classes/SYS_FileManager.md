# SYS\_FileManager class

系统 / 文件管理类

## 签名

```typescript
declare class SYS_FileManager
```

## 方法

| 方法名                                                                                                              | 修饰符 | 描述                                |
| ---------------------------------------------------------------------------------------------------------------- | --- | --------------------------------- |
| [extractLibInfo(data)](./SYS_FileManager.md)                                                                     |     | 提取文件内的库配置信息                       |
| [extractProjectInfo(data)](./SYS_FileManager.md)                                                                 |     | 提取文件内的工程配置信息                      |
| [getCbbFileByCbbUuid(cbbUuid, libraryUuid, props)](./SYS_FileManager.md)                                         |     | **_(BETA)_** 使用复用模块 UUID 获取复用模块文件 |
| [getDeviceFileByDeviceUuid(deviceUuid, libraryUuid, fileType)](./SYS_FileManager.md)                             |     | 使用器件 UUID 获取器件文件                  |
| [getDocumentFile(fileName, password, fileType)](./SYS_FileManager.md)                                            |     | 获取文档文件                            |
| [getDocumentFootprintSources()](./SYS_FileManager.md)                                                            |     | **_(BETA)_** 获取文档封装源码             |
| [getDocumentSource()](./SYS_FileManager.md)                                                                      |     | **_(BETA)_** 获取文档源码               |
| [getFootprintFileByFootprintUuid(footprintUuid, libraryUuid, fileType)](./SYS_FileManager.md)                    |     | **_(BETA)_** 使用封装 UUID 获取封装文件     |
| [getPanelLibraryFileByPanelLibraryUuid(panelLibraryUuid, libraryUuid, fileType)](./SYS_FileManager.md)           |     | **_(BETA)_** 使用面板库 UUID 获取面板库文件   |
| [getProjectFile(fileName, password, fileType)](./SYS_FileManager.md)                                             |     | 获取工程文件                            |
| [getProjectFileByProjectUuid(projectUuid, fileName, password, fileType)](./SYS_FileManager.md)                   |     | **_(BETA)_** 使用工程 UUID 获取工程文件     |
| [importProjectByProjectFile(projectFile, fileType, props, saveTo, librariesImportSetting)](./SYS_FileManager.md) |     | **_(BETA)_** 使用工程文件导入工程           |
| [importProjectByProjectFile(projectFile, fileType, props, saveTo, librariesImportSetting)](./SYS_FileManager.md) |     | **_(BETA)_** 使用工程文件导入工程           |
| [setDocumentSource(source)](./SYS_FileManager.md)                                                                |     | **_(BETA)_** 修改文档源码               |

---

## 方法详情

### extractlibinfo

# SYS\_FileManager.extractLibInfo() method

提取文件内的库配置信息

## 签名

```typescript
extractLibInfo(data: File | Array<File>): Promise<any>;
```

## 参数名

| 参数   | 类型                        | 描述  |
| ---- | ------------------------- | --- |
| data | File \| Array&lt;File&gt; | 库文件 |



## 返回值

Promise&lt;any&gt;

库配置信息

### extractprojectinfo

# SYS\_FileManager.extractProjectInfo() method

提取文件内的工程配置信息

## 签名

```typescript
extractProjectInfo(data: File): Promise<any>;
```

## 参数名

| 参数   | 类型   | 描述   |
| ---- | ---- | ---- |
| data | File | 工程文件 |



## 返回值

Promise&lt;any&gt;

工程配置信息

### getcbbfilebycbbuuid

# SYS\_FileManager.getCbbFileByCbbUuid() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用复用模块 UUID 获取复用模块文件

## 签名

```typescript
getCbbFileByCbbUuid(cbbUuid: string, libraryUuid?: string, props?: {
        fileName?: string;
        password?: string;
        fileType?: 'epro' | 'epro2';
        templateSchematicUuid?: string;
        templatePcbUuid?: string;
    }): Promise<File | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                | 描述                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| cbbUuid     | string                                                                                                                            | 复用模块 UUID                                                              |
| libraryUuid | string                                                                                                                            | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| props       | { fileName?: string; password?: string; fileType?: 'epro' \| 'epro2'; templateSchematicUuid?: string; templatePcbUuid?: string; } | _(Optional)_                                                           |



## 返回值

Promise&lt;File \| undefined&gt;

复用模块文件数据，`undefined` 表示数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*团队模块 &gt; 下载模块\*\* 权限，没有权限调用将始终 `throw Error`

### getdevicefilebydeviceuuid

# SYS\_FileManager.getDeviceFileByDeviceUuid() method

使用器件 UUID 获取器件文件

## 签名

```typescript
getDeviceFileByDeviceUuid(deviceUuid: string | Array<string>, libraryUuid?: string, fileType?: 'elibz' | 'elibz2'): Promise<File | undefined>;
```

## 参数名

| 参数          | 类型                            | 描述                                                                                 |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| deviceUuid  | string \| Array&lt;string&gt; | 器件 UUID 或器件 UUID 列表                                                                |
| libraryUuid | string                        | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取，如若不传入，则为系统库 |
| fileType    | 'elibz' \| 'elibz2'           | _(Optional)_                                                                       |



## 返回值

Promise&lt;File \| undefined&gt;

器件文件数据，`undefined` 表示数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*团队库 &gt; 下载库\*\* 权限，没有权限调用将始终 `throw Error`

### getdocumentfile

# SYS\_FileManager.getDocumentFile() method

获取文档文件

## 签名

```typescript
getDocumentFile(fileName?: string, password?: string, fileType?: 'epro' | 'epro2'): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型                | 描述          |
| -------- | ----------------- | ----------- |
| fileName | string            | _（可选）_ 文件名  |
| password | string            | _（可选）_ 加密密码 |
| fileType | 'epro' \| 'epro2' | _（可选）_ 文件格式 |



## 返回值

Promise&lt;File \| undefined&gt;

文档文件数据，`undefined` 表示当前未打开文档或数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*工程设计图 &gt; 文件导出\*\* 权限，没有权限调用将始终 `throw Error`

### getdocumentfootprintsources

# SYS\_FileManager.getDocumentFootprintSources() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取文档封装源码

## 签名

```typescript
getDocumentFootprintSources(): Promise<Array<{
        footprintUuid: string;
        documentSource: string;
    }>>;
```


## 返回值

Promise&lt;Array&lt;{ footprintUuid: string; documentSource: string; }&gt;&gt;

文档封装源码数据，数据获取失败将返回空数组

### getdocumentsource

# SYS\_FileManager.getDocumentSource() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取文档源码

## 签名

```typescript
getDocumentSource(): Promise<string | undefined>;
```


## 返回值

Promise&lt;string \| undefined&gt;

文档源码数据，`undefined` 表示当前未打开文档或数据获取失败

### getfootprintfilebyfootprintuuid

# SYS\_FileManager.getFootprintFileByFootprintUuid() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用封装 UUID 获取封装文件

## 签名

```typescript
getFootprintFileByFootprintUuid(footprintUuid: string | Array<string>, libraryUuid?: string, fileType?: 'elibz' | 'elibz2'): Promise<File | undefined>;
```

## 参数名

| 参数            | 类型                            | 描述                                                                     |
| ------------- | ----------------------------- | ---------------------------------------------------------------------- |
| footprintUuid | string \| Array&lt;string&gt; | 封装 UUID 或封装 UUID 列表                                                    |
| libraryUuid   | string                        | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| fileType      | 'elibz' \| 'elibz2'           | _(Optional)_                                                           |



## 返回值

Promise&lt;File \| undefined&gt;

封装文件数据，`undefined` 表示数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*团队库 &gt; 下载库\*\* 权限，没有权限调用将始终 `throw Error`

### getpanellibraryfilebypanellibraryuuid

# SYS\_FileManager.getPanelLibraryFileByPanelLibraryUuid() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用面板库 UUID 获取面板库文件

## 签名

```typescript
getPanelLibraryFileByPanelLibraryUuid(panelLibraryUuid: string | Array<string>, libraryUuid?: string, fileType?: 'elibz' | 'elibz2'): Promise<File | undefined>;
```

## 参数名

| 参数               | 类型                            | 描述                                                                     |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------- |
| panelLibraryUuid | string \| Array&lt;string&gt; | 面板库 UUID 或面板库 UUID 列表                                                  |
| libraryUuid      | string                        | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| fileType         | 'elibz' \| 'elibz2'           | _(Optional)_                                                           |



## 返回值

Promise&lt;File \| undefined&gt;

面板库文件数据，`undefined` 表示数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*团队库 &gt; 下载库\*\* 权限，没有权限调用将始终 `throw Error`

### getprojectfile

# SYS\_FileManager.getProjectFile() method

获取工程文件

## 签名

```typescript
getProjectFile(fileName?: string, password?: string, fileType?: 'epro' | 'epro2'): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型                | 描述          |
| -------- | ----------------- | ----------- |
| fileName | string            | _（可选）_ 文件名  |
| password | string            | _（可选）_ 加密密码 |
| fileType | 'epro' \| 'epro2' | _（可选）_ 文件格式 |



## 返回值

Promise&lt;File \| undefined&gt;

工程文件数据，`undefined` 表示当前未打开工程或数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*工程管理 &gt; 下载工程\*\* 权限，没有权限调用将始终 `throw Error`

### getprojectfilebyprojectuuid

# SYS\_FileManager.getProjectFileByProjectUuid() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用工程 UUID 获取工程文件

## 签名

```typescript
getProjectFileByProjectUuid(projectUuid: string, fileName?: string, password?: string, fileType?: 'epro' | 'epro2'): Promise<File | undefined>;
```

## 参数名

| 参数          | 类型                | 描述          |
| ----------- | ----------------- | ----------- |
| projectUuid | string            | 工程 UUID     |
| fileName    | string            | _（可选）_ 文件名  |
| password    | string            | _（可选）_ 加密密码 |
| fileType    | 'epro' \| 'epro2' | _（可选）_ 文件格式 |



## 返回值

Promise&lt;File \| undefined&gt;

工程文件数据，`undefined` 表示当前未打开工程或数据获取失败

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

注意：本接口需要启用 \*\*工程管理 &gt; 下载工程\*\* 权限，没有权限调用将始终 `throw Error`

### importprojectbyprojectfile

# SYS\_FileManager.importProjectByProjectFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用工程文件导入工程

## 签名

```typescript
importProjectByProjectFile(projectFile: File, fileType?: 'JLCEDA' | 'JLCEDA Pro' | 'EasyEDA' | 'EasyEDA Pro' | 'Allegro' | 'OrCAD' | 'EAGLE' | 'KiCad' | 'PADS' | 'LTspice', props?: {
        importOption?: ESYS_ImportProjectImportOption;
        schematicObjectStyle?: ESYS_ImportProjectSchematicObjectStyle;
        associateFootprint?: boolean;
        associate3DModel?: boolean;
        importFootprintNotesLayer?: boolean;
    }, saveTo?: {
        operation: 'New Project';
        newProjectOwnerTeamUuid: IDMT_TeamItem['uuid'];
        newProjectOwnerFolderUuid?: IDMT_FolderItem['uuid'];
        newProjectName?: string;
        newProjectFriendlyName?: string;
        newProjectDescription?: string;
        newProjectCollaborationMode?: EDMT_ProjectCollaborationMode;
    } | {
        operation: 'Existing Project';
        existingProjectUuid: IDMT_BriefProjectItem['uuid'];
    }, librariesImportSetting?: {
        ownerTeamUuid: IDMT_TeamItem['uuid'];
        createDeviceForSingleSymbol?: boolean;
    }): Promise<IDMT_BriefProjectItem | undefined>;
```

## 参数名

| 参数                     | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 描述                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| projectFile            | File                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 工程文件                                     |
| fileType               | 'JLCEDA' \| 'JLCEDA Pro' \| 'EasyEDA' \| 'EasyEDA Pro' \| 'Allegro' \| 'OrCAD' \| 'EAGLE' \| 'KiCad' \| 'PADS' \| 'LTspice'                                                                                                                                                                                                                                                                                                                                                                                                                                | _（可选）_ 文件类型                              |
| props                  | { importOption?: [ESYS\_ImportProjectImportOption](../enums/ESYS_ImportProjectImportOption.md); schematicObjectStyle?: [ESYS\_ImportProjectSchematicObjectStyle](../enums/ESYS_ImportProjectSchematicObjectStyle.md); associateFootprint?: boolean; associate3DModel?: boolean; importFootprintNotesLayer?: boolean; }                                                                                                                                                                                                                                     | _（可选）_ 导入参数，参考 EDA 前端 \*\*导入\*\* 窗口内的配置项 |
| saveTo                 | { operation: 'New Project'; newProjectOwnerTeamUuid: [IDMT\_TeamItem](../interfaces/IDMT_TeamItem.md)\['uuid'\]; newProjectOwnerFolderUuid?: [IDMT\_FolderItem](../interfaces/IDMT_FolderItem.md)\['uuid'\]; newProjectName?: string; newProjectFriendlyName?: string; newProjectDescription?: string; newProjectCollaborationMode?: [EDMT\_ProjectCollaborationMode](../enums/EDMT_ProjectCollaborationMode.md); } \| { operation: 'Existing Project'; existingProjectUuid: [IDMT\_BriefProjectItem](../interfaces/IDMT_BriefProjectItem.md)\['uuid'\]; } | _（可选）_ 保存到工程参数                           |
| librariesImportSetting | { ownerTeamUuid: [IDMT\_TeamItem](../interfaces/IDMT_TeamItem.md)\['uuid'\]; createDeviceForSingleSymbol?: boolean; }                                                                                                                                                                                                                                                                                                                                                                                                                                      | _(Optional)_                             |



## 返回值

Promise&lt;[IDMT\_BriefProjectItem](../interfaces/IDMT_BriefProjectItem.md) \| undefined&gt;

导入的工程的简略工程属性

## 备注

暂不支持提取库的相关配置，如果需求提取库，将会按照默认配置提取

### importprojectbyprojectfile_1

# SYS\_FileManager.importProjectByProjectFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用工程文件导入工程

## 签名

```typescript
importProjectByProjectFile(projectFile: File, fileType?: 'Altium Designer' | 'Protel', props?: {
        importOption?: ESYS_ImportProjectImportOption;
        viaSolderMaskExpansion?: ESYS_ImportProjectViaSolderMaskExpansion;
        boardOutlineSource?: ESYS_ImportProjectBoardOutlineSource;
        schematicObjectStyle?: ESYS_ImportProjectSchematicObjectStyle;
        associateFootprint?: boolean;
        associate3DModel?: boolean;
        importFootprintNotesLayer?: boolean;
    }, saveTo?: {
        operation: 'New Project';
        newProjectOwnerTeamUuid: IDMT_TeamItem['uuid'];
        newProjectOwnerFolderUuid?: IDMT_FolderItem['uuid'];
        newProjectName?: string;
        newProjectFriendlyName?: string;
        newProjectDescription?: string;
        newProjectCollaborationMode?: EDMT_ProjectCollaborationMode;
    } | {
        operation: 'Existing Project';
        existingProjectUuid: IDMT_BriefProjectItem['uuid'];
    }, librariesImportSetting?: {
        ownerTeamUuid: IDMT_TeamItem['uuid'];
        createDeviceForSingleSymbol?: boolean;
    }): Promise<IDMT_BriefProjectItem | undefined>;
```

## 参数名

| 参数                     | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 描述                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| projectFile            | File                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 工程文件                                     |
| fileType               | 'Altium Designer' \| 'Protel'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | _（可选）_ 文件类型                              |
| props                  | { importOption?: [ESYS\_ImportProjectImportOption](../enums/ESYS_ImportProjectImportOption.md); viaSolderMaskExpansion?: [ESYS\_ImportProjectViaSolderMaskExpansion](../enums/ESYS_ImportProjectViaSolderMaskExpansion.md); boardOutlineSource?: [ESYS\_ImportProjectBoardOutlineSource](../enums/ESYS_ImportProjectBoardOutlineSource.md); schematicObjectStyle?: [ESYS\_ImportProjectSchematicObjectStyle](../enums/ESYS_ImportProjectSchematicObjectStyle.md); associateFootprint?: boolean; associate3DModel?: boolean; importFootprintNotesLayer?: boolean; } | _（可选）_ 导入参数，参考 EDA 前端 \*\*导入\*\* 窗口内的配置项 |
| saveTo                 | { operation: 'New Project'; newProjectOwnerTeamUuid: [IDMT\_TeamItem](../interfaces/IDMT_TeamItem.md)\['uuid'\]; newProjectOwnerFolderUuid?: [IDMT\_FolderItem](../interfaces/IDMT_FolderItem.md)\['uuid'\]; newProjectName?: string; newProjectFriendlyName?: string; newProjectDescription?: string; newProjectCollaborationMode?: [EDMT\_ProjectCollaborationMode](../enums/EDMT_ProjectCollaborationMode.md); } \| { operation: 'Existing Project'; existingProjectUuid: [IDMT\_BriefProjectItem](../interfaces/IDMT_BriefProjectItem.md)\['uuid'\]; }         | _（可选）_ 保存到工程参数                           |
| librariesImportSetting | { ownerTeamUuid: [IDMT\_TeamItem](../interfaces/IDMT_TeamItem.md)\['uuid'\]; createDeviceForSingleSymbol?: boolean; }                                                                                                                                                                                                                                                                                                                                                                                                                                              | _(Optional)_                             |



## 返回值

Promise&lt;[IDMT\_BriefProjectItem](../interfaces/IDMT_BriefProjectItem.md) \| undefined&gt;

导入的工程的简略工程属性

## 备注

暂不支持提取库的相关配置，如果需求提取库，将会按照默认配置提取

### setdocumentsource

# SYS\_FileManager.setDocumentSource() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改文档源码

## 签名

```typescript
setDocumentSource(source: string): Promise<boolean>;
```

## 参数名

| 参数     | 类型     | 描述   |
| ------ | ------ | ---- |
| source | string | 文档源码 |



## 返回值

Promise&lt;boolean&gt;

是否修改成功，如果输入的文档源码格式错误，将返回 `false` 的结果
