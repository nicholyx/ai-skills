# PCB\_Document class

PCB &amp; 封装 / 文档操作类

## 签名

```typescript
declare class PCB_Document
```

## 备注

对设计文档总体进行的操作

## 方法

| 方法名                                                                               | 修饰符 | 描述                          |
| --------------------------------------------------------------------------------- | --- | --------------------------- |
| [convertCanvasOriginToDataOrigin(x, y)](./PCB_Document.md)                        |     | 输入画布坐标返回该坐标对应的数据坐标          |
| [convertDataOriginToCanvasOrigin(x, y)](./PCB_Document.md)                        |     | 输入数据坐标返回该坐标对应的画布坐标          |
| [getCalculatingRatlineStatus()](./PCB_Document.md)                                |     | 获取当前飞线计算功能状态                |
| [getCanvasOrigin()](./PCB_Document.md)                                            |     | 获取画布原点相对于数据原点的偏移坐标          |
| [getCurrentFilterConfiguration()](./PCB_Document.md)                              |     | **_(BETA)_** 获取当前画布过滤器配置    |
| [getPrimitiveAtPoint(x, y)](./PCB_Document.md)                                    |     | **_(BETA)_** 获取坐标点的图元       |
| [getPrimitivesInRegion(left, right, top, bottom, leftToRight)](./PCB_Document.md) |     | **_(BETA)_** 获取区域内所有图元      |
| [importAutoLayoutJsonFile(autoLayoutFile)](./PCB_Document.md)                     |     | **_(BETA)_** 导入自动布局文件（JSON） |
| [importAutoRouteJsonFile(autoRouteFile)](./PCB_Document.md)                       |     | **_(BETA)_** 导入自动布线文件（JSON） |
| [importAutoRouteSesFile(autoRouteFile)](./PCB_Document.md)                        |     | **_(BETA)_** 导入自动布线文件（SES）  |
| [importChanges(uuid)](./PCB_Document.md)                                          |     | 从原理图导入变更                    |
| [navigateToCoordinates(x, y)](./PCB_Document.md)                                  |     | 定位到画布坐标                     |
| [navigateToRegion(left, right, top, bottom)](./PCB_Document.md)                   |     | **_(BETA)_** 定位到画布区域        |
| [save(uuid)](./PCB_Document.md)                                                   |     | 保存文档                        |
| [setCanvasOrigin(offsetX, offsetY)](./PCB_Document.md)                            |     | 设置画布原点相对于数据原点的偏移坐标          |
| [startCalculatingRatline()](./PCB_Document.md)                                    |     | 启动飞线计算功能                    |
| [stopCalculatingRatline()](./PCB_Document.md)                                     |     | 停止飞线计算功能                    |
| [zoomToBoardOutline()](./PCB_Document.md)                                         |     | **_(BETA)_** 缩放到板框（适应板框）    |

---

## 方法详情

### convertcanvasorigintodataorigin

# PCB\_Document.convertCanvasOriginToDataOrigin() method

输入画布坐标返回该坐标对应的数据坐标

## 签名

```typescript
convertCanvasOriginToDataOrigin(x: number, y: number): Promise<{
        x: number;
        y: number;
    }>;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| x   | number |     |
| y   | number |     |



## 返回值

Promise&lt;{ x: number; y: number; }&gt;

数据原点坐标

## 备注

嘉立创 EDA 前端显示的坐标均为画布原点；嘉立创 EDA API 使用的均为数据原点；在创建 PCB 时，默认画布原点等于数据原点

### convertdataorigintocanvasorigin

# PCB\_Document.convertDataOriginToCanvasOrigin() method

输入数据坐标返回该坐标对应的画布坐标

## 签名

```typescript
convertDataOriginToCanvasOrigin(x: number, y: number): Promise<{
        x: number;
        y: number;
    }>;
```

## 参数名

| 参数  | 类型     | 描述     |
| --- | ------ | ------ |
| x   | number | 数据原点 X |
| y   | number | 数据原点 Y |



## 返回值

Promise&lt;{ x: number; y: number; }&gt;

画布原点坐标

## 备注

嘉立创 EDA 前端显示的坐标均为画布原点；嘉立创 EDA API 使用的均为数据原点；在创建 PCB 时，默认画布原点等于数据原点

### getcalculatingratlinestatus

# PCB\_Document.getCalculatingRatlineStatus() method

获取当前飞线计算功能状态

## 签名

```typescript
getCalculatingRatlineStatus(): Promise<EPCB_DocumentRatlineCalculatingActiveStatus>;
```


## 返回值

Promise&lt;[EPCB\_DocumentRatlineCalculatingActiveStatus](../enums/EPCB_DocumentRatlineCalculatingActiveStatus.md)&gt;

功能状态

### getcanvasorigin

# PCB\_Document.getCanvasOrigin() method

获取画布原点相对于数据原点的偏移坐标

## 签名

```typescript
getCanvasOrigin(): Promise<{
        offsetX: number;
        offsetY: number;
    }>;
```


## 返回值

Promise&lt;{ offsetX: number; offsetY: number; }&gt;

画布原点相对于数据原点的偏移坐标

## 备注

嘉立创 EDA 专业版前端显示的坐标均为画布原点；

嘉立创 EDA 专业版 API 使用的均为数据原点；

如果返回的数据为 `{ canvasOriginOffsetX: 100, canvasOriginOffsetY: 200 }`， 则代表画布原点在数据原点的向右 100 单位且向上 200 单位的位置；

此处的单位为数据层面单位，在跨度上等同于画布层面的 mil

### getcurrentfilterconfiguration

# PCB\_Document.getCurrentFilterConfiguration() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取当前画布过滤器配置

## 签名

```typescript
getCurrentFilterConfiguration(): Promise<{
        [key: string]: any;
    } | undefined>;
```


## 返回值

Promise&lt;{ \[key: string\]: any; } \| undefined&gt;

当前画布过滤器配置，`undefined` 为获取失败

### getprimitiveatpoint

# PCB\_Document.getPrimitiveAtPoint() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取坐标点的图元

## 签名

```typescript
getPrimitiveAtPoint(x: number, y: number): Promise<IPCB_Primitive | undefined>;
```

## 参数名

| 参数  | 类型     | 描述    |
| --- | ------ | ----- |
| x   | number | 坐标点 X |
| y   | number | 坐标点 Y |



## 返回值

Promise&lt;[IPCB\_Primitive](../interfaces/IPCB_Primitive.md) \| undefined&gt;

坐标点的图元，如若坐标点无法找到图元，将返回 `undefined`

## 备注

本操作和前端鼠标点击操作类似，将会获取指定坐标点上的图元

### getprimitivesinregion

# PCB\_Document.getPrimitivesInRegion() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取区域内所有图元

## 签名

```typescript
getPrimitivesInRegion(left: number, right: number, top: number, bottom: number, leftToRight?: boolean): Promise<Array<IPCB_Primitive>>;
```

## 参数名

| 参数          | 类型      | 描述                                 |
| ----------- | ------- | ---------------------------------- |
| left        | number  | 矩形框第一 X 坐标                         |
| right       | number  | 矩形框第二 X 坐标                         |
| top         | number  | 矩形框第一 Y 坐标                         |
| bottom      | number  | 矩形框第二 Y 坐标                         |
| leftToRight | boolean | _（可选）_ 是否仅获取完全框选的图元，`false` 则触碰即获取 |



## 返回值

Promise&lt;Array&lt;[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)&gt;&gt;

区域内所有图元

### importautolayoutjsonfile

# PCB\_Document.importAutoLayoutJsonFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

导入自动布局文件（JSON）

## 签名

```typescript
importAutoLayoutJsonFile(autoLayoutFile: File): Promise<boolean>;
```

## 参数名

| 参数             | 类型   | 描述           |
| -------------- | ---- | ------------ |
| autoLayoutFile | File | 欲导入的 JSON 文件 |



## 返回值

Promise&lt;boolean&gt;

导入操作是否成功

## 备注

可以使用  读入文件

### importautoroutejsonfile

# PCB\_Document.importAutoRouteJsonFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

导入自动布线文件（JSON）

## 签名

```typescript
importAutoRouteJsonFile(autoRouteFile: File): Promise<boolean>;
```

## 参数名

| 参数            | 类型   | 描述           |
| ------------- | ---- | ------------ |
| autoRouteFile | File | 欲导入的 JSON 文件 |



## 返回值

Promise&lt;boolean&gt;

导入操作是否成功

## 备注

可以使用  读入文件

### importautoroutesesfile

# PCB\_Document.importAutoRouteSesFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

导入自动布线文件（SES）

## 签名

```typescript
importAutoRouteSesFile(autoRouteFile: File): Promise<boolean>;
```

## 参数名

| 参数            | 类型   | 描述          |
| ------------- | ---- | ----------- |
| autoRouteFile | File | 欲导入的 SES 文件 |



## 返回值

Promise&lt;boolean&gt;

导入操作是否成功

## 备注

可以使用  读入文件

### importchanges

# PCB\_Document.importChanges() method

从原理图导入变更

## 签名

```typescript
importChanges(uuid?: string): Promise<boolean>;
```

## 参数名

| 参数   | 类型     | 描述                                    |
| ---- | ------ | ------------------------------------- |
| uuid | string | _（可选）_ 原理图 UUID，默认为关联在同一个 Board 下的原理图 |



## 返回值

Promise&lt;boolean&gt;

导入操作是否成功，导入失败或未传入原理图 UUID 的游离 PCB 将返回 `false`

### navigatetocoordinates

# PCB\_Document.navigateToCoordinates() method

定位到画布坐标

## 签名

```typescript
navigateToCoordinates(x: number, y: number): Promise<boolean>;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| x   | number | 坐标 X |
| y   | number | 坐标 Y |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

本接口在前端画布上定位到指定的数据层面坐标；

如果希望在进行本操作时前端画布坐标能与传入数据一致， 建议调用 [PCB\_Document.setCanvasOrigin()](./PCB_Document.md) 方法并设置偏移量为零；

此处的单位为数据层面单位，在跨度上等同于画布层面的 mil

### navigatetoregion

# PCB\_Document.navigateToRegion() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

定位到画布区域

## 签名

```typescript
navigateToRegion(left: number, right: number, top: number, bottom: number): Promise<boolean>;
```

## 参数名

| 参数     | 类型     | 描述         |
| ------ | ------ | ---------- |
| left   | number | 矩形框第一 X 坐标 |
| right  | number | 矩形框第二 X 坐标 |
| top    | number | 矩形框第一 Y 坐标 |
| bottom | number | 矩形框第二 Y 坐标 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

本接口在前端画布上定位到指定的区域，区域数据为相对于数据原点的偏移；

例如：传入数据为 `{left: 0, right: 60, top: 100, bottom: -20}` =&gt; `navigateToRegion(0, 60, 100, -20)`， 则画布将会定位到以 `[30, 40]` 为中心的，`x` 轴方向长度为 `60`，`y` 轴方向长度为 `120` 的矩形范围；

本接口不进行缩放操作，但会生成指示定位中心及表示区域范围的矩形框；

此处的单位为数据层面单位，在跨度上等同于画布层面的 mil

### save

# PCB\_Document.save() method

保存文档

## 签名

```typescript
save(uuid: string): Promise<boolean>;
```

## 参数名

| 参数   | 类型     | 描述  |
| ---- | ------ | --- |
| uuid | string |     |



## 返回值

Promise&lt;boolean&gt;

保存操作是否成功，保存失败、上传失败等错误均返回 `false`

### setcanvasorigin

# PCB\_Document.setCanvasOrigin() method

设置画布原点相对于数据原点的偏移坐标

## 签名

```typescript
setCanvasOrigin(offsetX: number, offsetY: number): Promise<boolean>;
```

## 参数名

| 参数      | 类型     | 描述                  |
| ------- | ------ | ------------------- |
| offsetX | number | 画布原点相对于数据原点的 X 坐标偏移 |
| offsetY | number | 画布原点相对于数据原点的 Y 坐标偏移 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

嘉立创 EDA 专业版前端显示的坐标均为画布原点；

嘉立创 EDA 专业版 API 使用的均为数据原点；

如果希望在 API 操作时前端画布坐标能与数据一致， 建议调用本方法并设置偏移量为零， 即 `setCanvasOrigin(0, 0)`；

此处的单位为数据层面单位，在跨度上等同于画布层面的 mil

### startcalculatingratline

# PCB\_Document.startCalculatingRatline() method

启动飞线计算功能

## 签名

```typescript
startCalculatingRatline(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

在启动时将会触发一次飞线计算

### stopcalculatingratline

# PCB\_Document.stopCalculatingRatline() method

停止飞线计算功能

## 签名

```typescript
stopCalculatingRatline(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

操作是否成功

### zoomtoboardoutline

# PCB\_Document.zoomToBoardOutline() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

缩放到板框（适应板框）

## 签名

```typescript
zoomToBoardOutline(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

操作是否成功
