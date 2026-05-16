# PCB\_ManufactureData class

PCB &amp; 封装 / 生产资料类

## 签名

```typescript
declare class PCB_ManufactureData
```

## 备注

获取当前 PCB 的生产资料文件及快捷下单

## 方法

| 方法名                                                                                                                | 修饰符 | 描述                                 |
| ------------------------------------------------------------------------------------------------------------------ | --- | ---------------------------------- |
| [deleteBomTemplate(template)](./PCB_ManufactureData.md)                                                            |     | **_(BETA)_** 删除 BOM 模板             |
| [get3DFile(fileName, fileType, element, modelMode, autoGenerateModels)](./PCB_ManufactureData.md)                  |     | **_(BETA)_** 获取 3D 模型文件            |
| [get3DShellFile(fileName, fileType)](./PCB_ManufactureData.md)                                                     |     | **_(BETA)_** 获取 3D 外壳文件            |
| [getAltiumDesignerFile(fileName)](./PCB_ManufactureData.md)                                                        |     | **_(BETA)_** 获取 Altium Designer 文件 |
| [getAutoLayoutJsonFile(fileName)](./PCB_ManufactureData.md)                                                        |     | **_(BETA)_** 获取自动布局文件（JSON）        |
| [getAutoRouteJsonFile(fileName)](./PCB_ManufactureData.md)                                                         |     | **_(BETA)_** 获取自动布线文件（JSON）        |
| [getBomFile(fileName, fileType, template, filterOptions, statistics, property, columns)](./PCB_ManufactureData.md) |     | **_(BETA)_** 获取 BOM 文件             |
| [getBomTemplateFile(template)](./PCB_ManufactureData.md)                                                           |     | **_(BETA)_** 获取 BOM 模板文件           |
| [getBomTemplates()](./PCB_ManufactureData.md)                                                                      |     | **_(BETA)_** 获取 BOM 模板列表           |
| [getDsnFile(fileName)](./PCB_ManufactureData.md)                                                                   |     | **_(BETA)_** 获取自动布线文件（DSN）         |
| [getDxfFile(fileName, layers, objects)](./PCB_ManufactureData.md)                                                  |     | **_(BETA)_** 获取 DXF 文件             |
| [getFlyingProbeTestFile(fileName)](./PCB_ManufactureData.md)                                                       |     | **_(BETA)_** 获取飞针测试文件              |
| [getGerberFile(fileName, colorSilkscreen, unit, digitalFormat, other, layers, objects)](./PCB_ManufactureData.md)  |     | **_(BETA)_** 获取 PCB 制版文件（Gerber）   |
| [getIdxFile(fileName)](./PCB_ManufactureData.md)                                                                   |     | **_(BETA)_** 获取 IDX 文件             |
| [getIpcD356AFile(fileName)](./PCB_ManufactureData.md)                                                              |     | **_(BETA)_** 获取 IPC-D-356A 文件      |
| [getManufactureData()](./PCB_ManufactureData.md)                                                                   |     | **_(BETA)_** 导出制造文件                |
| [getNetlistFile(fileName, netlistType)](./PCB_ManufactureData.md)                                                  |     | **_(BETA)_** 获取网表文件（Netlist）       |
| [getOpenDatabaseDoublePlusFile(fileName, unit, otherData, layers, objects)](./PCB_ManufactureData.md)              |     | **_(BETA)_** 获取 ODB++ 文件           |
| [getPadsFile(fileName)](./PCB_ManufactureData.md)                                                                  |     | **_(BETA)_** 获取 PADS 文件            |
| [getPcbInfoFile(fileName)](./PCB_ManufactureData.md)                                                               |     | **_(BETA)_** 获取 PCB 信息文件           |
| [getPdfFile(fileName, outputMethod, contentConfig, watermark)](./PCB_ManufactureData.md)                           |     | **_(BETA)_** 获取 PDF 文件             |
| [getPickAndPlaceFile(fileName, fileType, unit)](./PCB_ManufactureData.md)                                          |     | **_(BETA)_** 获取坐标文件（PickAndPlace）  |
| [getTestPointFile(fileName, fileType)](./PCB_ManufactureData.md)                                                   |     | **_(BETA)_** 获取测试点报告文件             |
| [place3DShellOrder(interactive, ignoreWarning)](./PCB_ManufactureData.md)                                          |     | **_(BETA)_** 3D 外壳下单               |
| [placeComponentsOrder(interactive, ignoreWarning)](./PCB_ManufactureData.md)                                       |     | **_(BETA)_** 元件下单                  |
| [placePcbOrder(interactive, ignoreWarning)](./PCB_ManufactureData.md)                                              |     | **_(BETA)_** PCB 下单                |
| [placeSmtComponentsOrder(interactive, ignoreWarning)](./PCB_ManufactureData.md)                                    |     | **_(BETA)_** SMT 元件下单              |
| [uploadBomTemplateFile(templateFile, template)](./PCB_ManufactureData.md)                                          |     | **_(BETA)_** 上传 BOM 模板文件           |

---

## 方法详情

### deletebomtemplate

# PCB\_ManufactureData.deleteBomTemplate() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除 BOM 模板

## 签名

```typescript
deleteBomTemplate(template: string): Promise<boolean>;
```

## 参数名

| 参数       | 类型     | 描述       |
| -------- | ------ | -------- |
| template | string | BOM 模板名称 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### get3dfile

# PCB\_ManufactureData.get3DFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 3D 模型文件

## 签名

```typescript
get3DFile(fileName?: string, fileType?: 'step' | 'obj', element?: Array<'Component Model' | 'Via' | 'Silkscreen' | 'Wire In Signal Layer'>, modelMode?: 'Outfit' | 'Parts', autoGenerateModels?: boolean): Promise<File | undefined>;
```

## 参数名

| 参数                 | 类型                                                                                | 描述                                            |
| ------------------ | --------------------------------------------------------------------------------- | --------------------------------------------- |
| fileName           | string                                                                            | _（可选）_ 文件名                                    |
| fileType           | 'step' \| 'obj'                                                                   | _（可选）_ 文件类型                                   |
| element            | Array&lt;'Component Model' \| 'Via' \| 'Silkscreen' \| 'Wire In Signal Layer'&gt; | _（可选）_ 导出对象                                   |
| modelMode          | 'Outfit' \| 'Parts'                                                               | _（可选）_ 导出模式，`Outfit` = 装配体，`Parts` = 零件       |
| autoGenerateModels | boolean                                                                           | _（可选）_ 是否为未绑定 3D 模型的元件自动生成 3D 模型（根据元件的“高度”属性） |



## 返回值

Promise&lt;File \| undefined&gt;

3D 模型文件数据

## 备注

请注意：只有以 STEP 格式导入的元件模型，才能在导出的 STEP 文件中体现

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### get3dshellfile

# PCB\_ManufactureData.get3DShellFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 3D 外壳文件

## 签名

```typescript
get3DShellFile(fileName?: string, fileType?: 'stl' | 'step' | 'obj'): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型                       | 描述          |
| -------- | ------------------------ | ----------- |
| fileName | string                   | _（可选）_ 文件名  |
| fileType | 'stl' \| 'step' \| 'obj' | _（可选）_ 文件类型 |



## 返回值

Promise&lt;File \| undefined&gt;

3D 外壳文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getaltiumdesignerfile

# PCB\_ManufactureData.getAltiumDesignerFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 Altium Designer 文件

## 签名

```typescript
getAltiumDesignerFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

Altium Designer 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getautolayoutjsonfile

# PCB\_ManufactureData.getAutoLayoutJsonFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取自动布局文件（JSON）

## 签名

```typescript
getAutoLayoutJsonFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

自动布局 JSON 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getautoroutejsonfile

# PCB\_ManufactureData.getAutoRouteJsonFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取自动布线文件（JSON）

## 签名

```typescript
getAutoRouteJsonFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

自动布线 JSON 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getbomfile

# PCB\_ManufactureData.getBomFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 BOM 文件

## 签名

```typescript
getBomFile(fileName?: string, fileType?: 'xlsx' | 'csv', template?: string, filterOptions?: Array<{
        property: string;
        includeValue: boolean | string;
    }>, statistics?: Array<string>, property?: Array<string>, columns?: Array<IPCB_BomPropertiesTableColumns>): Promise<File | undefined>;
```

## 参数名

| 参数            | 类型                                                                                              | 描述                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| fileName      | string                                                                                          | _（可选）_ 文件名                                                                                   |
| fileType      | 'xlsx' \| 'csv'                                                                                 | _（可选）_ 文件类型                                                                                  |
| template      | string                                                                                          | _（可选）_ 模板名称                                                                                  |
| filterOptions | Array&lt;{ property: string; includeValue: boolean \| string; }&gt;                             | _（可选）_ 过滤规则，仅应包含需要启用的规则，`property` 为规则名称，`includeValue` 为匹配的值                                |
| statistics    | Array&lt;string&gt;                                                                             | _（可选）_ 统计，包含所有需要启用的统计项的名称                                                                    |
| property      | Array&lt;string&gt;                                                                             | _（可选）_ 属性，包含所有需要启用的属性的名称                                                                     |
| columns       | Array&lt;[IPCB\_BomPropertiesTableColumns](../interfaces/IPCB_BomPropertiesTableColumns.md)&gt; | _（可选）_ 列的属性及排序，`title`、`sort`、`group`、`orderWeight` 不传入则取默认值，`null` 代表 \*\*无\*\* 或 \*\*空\*\* |



## 返回值

Promise&lt;File \| undefined&gt;

BOM 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getbomtemplatefile

# PCB\_ManufactureData.getBomTemplateFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 BOM 模板文件

## 签名

```typescript
getBomTemplateFile(template: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述       |
| -------- | ------ | -------- |
| template | string | BOM 模板名称 |



## 返回值

Promise&lt;File \| undefined&gt;

BOM 模板文件

### getbomtemplates

# PCB\_ManufactureData.getBomTemplates() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 BOM 模板列表

## 签名

```typescript
getBomTemplates(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

BOM 模板列表

### getdsnfile

# PCB\_ManufactureData.getDsnFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取自动布线文件（DSN）

## 签名

```typescript
getDsnFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

自动布线 DSN 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getdxffile

# PCB\_ManufactureData.getDxfFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 DXF 文件

## 签名

```typescript
getDxfFile(fileName?: string, layers?: Array<{
        layerId: number;
        mirror: boolean;
    }>, objects?: Array<string>): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型                                                 | 描述          |
| -------- | -------------------------------------------------- | ----------- |
| fileName | string                                             | _（可选）_ 文件名  |
| layers   | Array&lt;{ layerId: number; mirror: boolean; }&gt; | _（可选）_ 导出层  |
| objects  | Array&lt;string&gt;                                | _（可选）_ 导出对象 |



## 返回值

Promise&lt;File \| undefined&gt;

DXF 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getflyingprobetestfile

# PCB\_ManufactureData.getFlyingProbeTestFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取飞针测试文件

## 签名

```typescript
getFlyingProbeTestFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

飞针测试文件数据

### getgerberfile

# PCB\_ManufactureData.getGerberFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 PCB 制版文件（Gerber）

## 签名

```typescript
getGerberFile(fileName?: string, colorSilkscreen?: boolean, unit?: ESYS_Unit.MILLIMETER | ESYS_Unit.INCH, digitalFormat?: {
        integerNumber: number;
        decimalNumber: number;
    }, other?: {
        metallicDrillingInformation: boolean;
        nonMetallicDrillingInformation: boolean;
        drillTable: boolean;
        flyingProbeTestingFile: boolean;
    }, layers?: Array<{
        layerId: number;
        isMirror: boolean;
    }>, objects?: Array<'Pad' | 'Via' | 'Track' | 'Text' | 'Image' | 'Dimension' | 'BoardOutline' | 'BoardCutout' | 'CopperFilled' | 'SolidRegion' | 'FPCStiffener' | 'Line' | 'PlaneZone' | 'ComponentProperty' | 'ComponentSilkscreen' | 'TearDrop'>): Promise<File | undefined>;
```

## 参数名

| 参数              | 类型                                                                                                                                                                                                                                                        | 描述                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| fileName        | string                                                                                                                                                                                                                                                    | _（可选）_ 文件名                   |
| colorSilkscreen | boolean                                                                                                                                                                                                                                                   | _（可选）_ 是否生成彩色丝印制造文件（嘉立创专用文件） |
| unit            | [ESYS\_Unit.MILLIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.INCH](../enums/ESYS_Unit.md)                                                                                                                                                                | _（可选）_ 单位                    |
| digitalFormat   | \{ integerNumber: number; decimalNumber: number; \}                                                                                                                                                                                                       | _（可选）_ 数字格式                  |
| other           | \{ metallicDrillingInformation: boolean; nonMetallicDrillingInformation: boolean; drillTable: boolean; flyingProbeTestingFile: boolean; \}                                                                                                                | _（可选）_ 其它                    |
| layers          | Array&lt;{ layerId: number; isMirror: boolean; }&gt;                                                                                                                                                                                                      | _（可选）_ 导出层，默认则按照嘉立创生产需求导出    |
| objects         | Array&lt;'Pad' \| 'Via' \| 'Track' \| 'Text' \| 'Image' \| 'Dimension' \| 'BoardOutline' \| 'BoardCutout' \| 'CopperFilled' \| 'SolidRegion' \| 'FPCStiffener' \| 'Line' \| 'PlaneZone' \| 'ComponentProperty' \| 'ComponentSilkscreen' \| 'TearDrop'&gt; | _（可选）_ 导出对象，默认则按照嘉立创生产需求导出   |



## 返回值

Promise&lt;File \| undefined&gt;

PCB 制版文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getidxfile

# PCB\_ManufactureData.getIdxFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 IDX 文件

## 签名

```typescript
getIdxFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述           |
| -------- | ------ | ------------ |
| fileName | string | _(Optional)_ |



## 返回值

Promise&lt;File \| undefined&gt;

IDX 文件

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getipcd356afile

# PCB\_ManufactureData.getIpcD356AFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 IPC-D-356A 文件

## 签名

```typescript
getIpcD356AFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

IPC-D-356A 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getmanufacturedata

# PCB\_ManufactureData.getManufactureData() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

导出制造文件

## 签名

```typescript
getManufactureData(): Promise<File | undefined>;
```


## 返回值

Promise&lt;File \| undefined&gt;

制造文件

## 备注

本接口对应私有化部署版本一键导出制造文件功能

将根据前端一键导出制造文件弹窗的配置获取其文件数据

注意：本接口仅私有化部署版本有效，如若在其他版本调用将始终 `throw Error`

### getnetlistfile

# PCB\_ManufactureData.getNetlistFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取网表文件（Netlist）

## 签名

```typescript
getNetlistFile(fileName?: string, netlistType?: ESYS_NetlistType): Promise<File | undefined>;
```

## 参数名

| 参数          | 类型                                                | 描述          |
| ----------- | ------------------------------------------------- | ----------- |
| fileName    | string                                            | _（可选）_ 文件名  |
| netlistType | [ESYS\_NetlistType](../enums/ESYS_NetlistType.md) | _（可选）_ 网表类型 |



## 返回值

Promise&lt;File \| undefined&gt;

网表文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getopendatabasedoubleplusfile

# PCB\_ManufactureData.getOpenDatabaseDoublePlusFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 ODB++ 文件

## 签名

```typescript
getOpenDatabaseDoublePlusFile(fileName?: string, unit?: ESYS_Unit.INCH, otherData?: {
        metallizedDrilledHoles?: boolean;
        nonMetallizedDrilledHoles?: boolean;
        drillTable?: boolean;
        flyingProbeTestFile?: boolean;
    }, layers?: Array<{
        layerId: number;
        mirror: boolean;
    }>, objects?: Array<{
        objectName: string;
    }>): Promise<File | undefined>;
```

## 参数名

| 参数        | 类型                                                                                                                                | 描述                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| fileName  | string                                                                                                                            | _（可选）_ 文件名                 |
| unit      | [ESYS\_Unit.INCH](../enums/ESYS_Unit.md)                                                                                          | _（可选）_ 单位                  |
| otherData | \{ metallizedDrilledHoles?: boolean; nonMetallizedDrilledHoles?: boolean; drillTable?: boolean; flyingProbeTestFile?: boolean; \} | _（可选）_ 其它                  |
| layers    | Array&lt;{ layerId: number; mirror: boolean; }&gt;                                                                                | _（可选）_ 导出层，默认则按照嘉立创生产需求导出  |
| objects   | Array&lt;{ objectName: string; }&gt;                                                                                              | _（可选）_ 导出对象，默认则按照嘉立创生产需求导出 |



## 返回值

Promise&lt;File \| undefined&gt;

ODB++ 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getpadsfile

# PCB\_ManufactureData.getPadsFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 PADS 文件

## 签名

```typescript
getPadsFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

PADS 文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getpcbinfofile

# PCB\_ManufactureData.getPcbInfoFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 PCB 信息文件

## 签名

```typescript
getPcbInfoFile(fileName?: string): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型     | 描述         |
| -------- | ------ | ---------- |
| fileName | string | _（可选）_ 文件名 |



## 返回值

Promise&lt;File \| undefined&gt;

PCB 信息文件

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### getpdffile

# PCB\_ManufactureData.getPdfFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 PDF 文件

## 签名

```typescript
getPdfFile(fileName?: string, outputMethod?: EPCB_PdfOutputMethod, contentConfig?: {
        displayAttributesAsMenu: boolean;
        showOutlineOnly: boolean;
    }, watermark?: {
        show?: boolean;
        content?: string;
        styleConfig?: {
            color: string;
            transparency: 'Opaque' | '75%' | '50%' | '25%';
            font: string;
            fontSize: string;
            style: {
                blood: boolean;
                italic: boolean;
                underline: boolean;
            };
            slope: 0 | 45 | 90;
            denseness: 'Single' | 'Sparse' | 'Std' | 'Dense';
        };
    }): Promise<File | undefined>;
```

## 参数名

| 参数            | 类型                                                                                                                                                                                                                                                                                                     | 描述          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| fileName      | string                                                                                                                                                                                                                                                                                                 | _（可选）_ 文件名  |
| outputMethod  | [EPCB\_PdfOutputMethod](../enums/EPCB_PdfOutputMethod.md)                                                                                                                                                                                                                                              | _（可选）_ 输出方式 |
| contentConfig | \{ displayAttributesAsMenu: boolean; showOutlineOnly: boolean; \}                                                                                                                                                                                                                                      | _（可选）_ 内容配置 |
| watermark     | { show?: boolean; content?: string; styleConfig?: { color: string; transparency: 'Opaque' \| '75%' \| '50%' \| '25%'; font: string; fontSize: string; style: { blood: boolean; italic: boolean; underline: boolean; }; slope: 0 \| 45 \| 90; denseness: 'Single' \| 'Sparse' \| 'Std' \| 'Dense'; }; } | _（可选）_ 水印   |



## 返回值

Promise&lt;File \| undefined&gt;

PDF 文件数据（或压缩包）

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

`outputMethod`、`contentConfig`、`watermark` 参数暂不可用，等待后期规划

### getpickandplacefile

# PCB\_ManufactureData.getPickAndPlaceFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取坐标文件（PickAndPlace）

## 签名

```typescript
getPickAndPlaceFile(fileName?: string, fileType?: 'xlsx' | 'csv', unit?: ESYS_Unit.MILLIMETER | ESYS_Unit.MIL): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型                                                                                        | 描述          |
| -------- | ----------------------------------------------------------------------------------------- | ----------- |
| fileName | string                                                                                    | _（可选）_ 文件名  |
| fileType | 'xlsx' \| 'csv'                                                                           | _（可选）_ 文件类型 |
| unit     | [ESYS\_Unit.MILLIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.MIL](../enums/ESYS_Unit.md) | _（可选）_ 单位   |



## 返回值

Promise&lt;File \| undefined&gt;

坐标文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### gettestpointfile

# PCB\_ManufactureData.getTestPointFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取测试点报告文件

## 签名

```typescript
getTestPointFile(fileName?: string, fileType?: 'xlsx' | 'csv'): Promise<File | undefined>;
```

## 参数名

| 参数       | 类型              | 描述          |
| -------- | --------------- | ----------- |
| fileName | string          | _（可选）_ 文件名  |
| fileType | 'xlsx' \| 'csv' | _（可选）_ 文件类型 |



## 返回值

Promise&lt;File \| undefined&gt;

测试点报告文件数据

## 备注

可以使用 [SYS\_FileSystem.saveFile()](./SYS_FileSystem.md) 接口将文件导出到本地文件系统

### place3dshellorder

# PCB\_ManufactureData.place3DShellOrder() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

3D 外壳下单

## 签名

```typescript
place3DShellOrder(interactive?: boolean, ignoreWarning?: boolean): Promise<boolean>;
```

## 参数名

| 参数            | 类型      | 描述                                                                                                                                                                     |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| interactive   | boolean | _（可选）_ 是否启用交互式检查 如若启用，则会存在弹窗等待用户进行交互，且无法使用 `ignoreWarning` 参数忽略警告， 即 `ignoreWarning` 参数将被忽略； 如若禁用，则在调用后不会有任何 EDA 内部弹窗，程序执行静默检查， 如若达成下单条件，将返回 `true` 并在新标签页打开下单页面 |
| ignoreWarning | boolean | _（可选）_ 在非交互式检查时忽略警告 如果设置为 `true`，将会忽略所有检查警告项并尽可能生成下单资料； 如果设置为 `false`，存在任意警告将中断执行并返回 `false` 的结果                                                                 |



## 返回值

Promise&lt;boolean&gt;

是否通过下单检查

## 备注

本接口暂时只支持交互式检查，入参暂无作用，预留后续开发

### placecomponentsorder

# PCB\_ManufactureData.placeComponentsOrder() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

元件下单

## 签名

```typescript
placeComponentsOrder(interactive?: boolean, ignoreWarning?: boolean): Promise<boolean>;
```

## 参数名

| 参数            | 类型      | 描述                                                                                                                                                                     |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| interactive   | boolean | _（可选）_ 是否启用交互式检查 如若启用，则会存在弹窗等待用户进行交互，且无法使用 `ignoreWarning` 参数忽略警告， 即 `ignoreWarning` 参数将被忽略； 如若禁用，则在调用后不会有任何 EDA 内部弹窗，程序执行静默检查， 如若达成下单条件，将返回 `true` 并在新标签页打开下单页面 |
| ignoreWarning | boolean | _（可选）_ 在非交互式检查时忽略警告 如果设置为 `true`，将会忽略所有检查警告项并尽可能生成下单资料； 如果设置为 `false`，存在任意警告将中断执行并返回 `false` 的结果                                                                 |



## 返回值

Promise&lt;boolean&gt;

是否通过下单检查

## 备注

本接口暂时只支持交互式检查，入参暂无作用，预留后续开发

### placepcborder

# PCB\_ManufactureData.placePcbOrder() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

PCB 下单

## 签名

```typescript
placePcbOrder(interactive?: boolean, ignoreWarning?: boolean): Promise<boolean>;
```

## 参数名

| 参数            | 类型      | 描述                                                                                                                                                                     |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| interactive   | boolean | _（可选）_ 是否启用交互式检查 如若启用，则会存在弹窗等待用户进行交互，且无法使用 `ignoreWarning` 参数忽略警告， 即 `ignoreWarning` 参数将被忽略； 如若禁用，则在调用后不会有任何 EDA 内部弹窗，程序执行静默检查， 如若达成下单条件，将返回 `true` 并在新标签页打开下单页面 |
| ignoreWarning | boolean | _（可选）_ 在非交互式检查时忽略警告 如果设置为 `true`，将会忽略所有检查警告项并尽可能生成下单资料； 如果设置为 `false`，存在任意警告将中断执行并返回 `false` 的结果                                                                 |



## 返回值

Promise&lt;boolean&gt;

是否通过下单检查

## 备注

本接口暂时只支持交互式检查，入参暂无作用，预留后续开发

### placesmtcomponentsorder

# PCB\_ManufactureData.placeSmtComponentsOrder() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

SMT 元件下单

## 签名

```typescript
placeSmtComponentsOrder(interactive?: boolean, ignoreWarning?: boolean): Promise<boolean>;
```

## 参数名

| 参数            | 类型      | 描述                                                                                                                                                                     |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| interactive   | boolean | _（可选）_ 是否启用交互式检查 如若启用，则会存在弹窗等待用户进行交互，且无法使用 `ignoreWarning` 参数忽略警告， 即 `ignoreWarning` 参数将被忽略； 如若禁用，则在调用后不会有任何 EDA 内部弹窗，程序执行静默检查， 如若达成下单条件，将返回 `true` 并在新标签页打开下单页面 |
| ignoreWarning | boolean | _（可选）_ 在非交互式检查时忽略警告 如果设置为 `true`，将会忽略所有检查警告项并尽可能生成下单资料； 如果设置为 `false`，存在任意警告将中断执行并返回 `false` 的结果                                                                 |



## 返回值

Promise&lt;boolean&gt;

是否通过下单检查

## 备注

本接口暂时只支持交互式检查，入参暂无作用，预留后续开发

### uploadbomtemplatefile

# PCB\_ManufactureData.uploadBomTemplateFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

上传 BOM 模板文件

## 签名

```typescript
uploadBomTemplateFile(templateFile: File, template?: string): Promise<string | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                                      |
| ------------ | ------ | ------------------------------------------------------- |
| templateFile | File   | BOM 模板文件                                                |
| template     | string | _（可选）_ BOM 模板名称，如若为 `undefined` 则自动从 `templateFile` 中取值 |



## 返回值

Promise&lt;string \| undefined&gt;

BOM 模板名称
