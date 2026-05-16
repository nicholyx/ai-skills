# PCB\_PrimitiveImage class

PCB &amp; 封装 / 图像图元类

## 签名

```typescript
declare class PCB_PrimitiveImage implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                                   | 修饰符 | 描述                        |
| --------------------------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(x, y, complexPolygon, layer, width, height, rotation, horizonMirror, primitiveLock)](./PCB_PrimitiveImage.md) |     | 创建图像                      |
| [delete(primitiveIds)](./PCB_PrimitiveImage.md)                                                                       |     | **_(BETA)_** 删除图像         |
| [get(primitiveIds)](./PCB_PrimitiveImage.md)                                                                          |     | **_(BETA)_** 获取图像         |
| [get(primitiveIds)](./PCB_PrimitiveImage.md)                                                                          |     | **_(BETA)_** 获取图像         |
| [getAll(layer, primitiveLock)](./PCB_PrimitiveImage.md)                                                               |     | **_(BETA)_** 获取所有图像       |
| [getAllPrimitiveId(layer, primitiveLock)](./PCB_PrimitiveImage.md)                                                    |     | **_(BETA)_** 获取所有图像的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveImage.md)                                                              |     | **_(BETA)_** 修改图像         |

---

## 方法详情

### create

# PCB\_PrimitiveImage.create() method

创建图像

## 签名

```typescript
create(x: number, y: number, complexPolygon: TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray> | IPCB_Polygon | IPCB_ComplexPolygon, layer: TPCB_LayersOfImage, width?: number, height?: number, rotation?: number, horizonMirror?: boolean, primitiveLock?: boolean): Promise<IPCB_PrimitiveImage | undefined>;
```

## 参数名

| 参数             | 类型                                                                                                                                                                                                                                        | 描述                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| x              | number                                                                                                                                                                                                                                    | BBox 左上点坐标 X                                                                                                |
| y              | number                                                                                                                                                                                                                                    | BBox 左上点坐标 Y                                                                                                |
| complexPolygon | [TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt; \| [IPCB\_Polygon](./IPCB_Polygon.md) \| [IPCB\_ComplexPolygon](./IPCB_ComplexPolygon.md) | 图像源数据（复杂多边形），可以使用 [PCB\_MathPolygon.convertImageToComplexPolygon()](./PCB_MathPolygon.md) 方法将图像文件转换为复杂多边形数据 |
| layer          | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md)                                                                                                                                                                                     | 层                                                                                                           |
| width          | number                                                                                                                                                                                                                                    | _（可选）_ 宽                                                                                                    |
| height         | number                                                                                                                                                                                                                                    | _（可选）_ 高                                                                                                    |
| rotation       | number                                                                                                                                                                                                                                    | _（可选）_ 旋转角度                                                                                                 |
| horizonMirror  | boolean                                                                                                                                                                                                                                   | _（可选）_ 是否水平镜像                                                                                               |
| primitiveLock  | boolean                                                                                                                                                                                                                                   | _（可选）_ 是否锁定                                                                                                 |



## 返回值

Promise&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md) \| undefined&gt;

图像图元对象

## 备注

如需创建彩色丝印图像，请使用 [二进制内嵌对象图元类](./PCB_PrimitiveObject.md)

### delete

# PCB\_PrimitiveImage.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除图像

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveImage | Array<string> | Array<IPCB_PrimitiveImage>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                                 | 描述               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)&gt; | 图像的图元 ID 或图像图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveImage.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取图像

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveImage | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 图像的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md) \| undefined&gt;

图像图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveImage.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取图像

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveImage>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 图像的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)&gt;&gt;

图像图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveImage.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有图像

## 签名

```typescript
getAll(layer?: TPCB_LayersOfImage, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveImage>>;
```

## 参数名

| 参数            | 类型                                                    | 描述          |
| ------------- | ----------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md) | _（可选）_ 层    |
| primitiveLock | boolean                                               | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)&gt;&gt;

图像图元对象数组

### getallprimitiveid

# PCB\_PrimitiveImage.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有图像的图元 ID

## 签名

```typescript
getAllPrimitiveId(layer?: TPCB_LayersOfImage, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                    | 描述          |
| ------------- | ----------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md) | _（可选）_ 层    |
| primitiveLock | boolean                                               | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

图像的图元 ID 数组

### modify

# PCB\_PrimitiveImage.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改图像

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveImage, property: {
        x?: number;
        y?: number;
        layer?: TPCB_LayersOfImage;
        width?: number;
        height?: number;
        rotation?: number;
        horizonMirror?: boolean;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitiveImage | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                               | 描述    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| primitiveId | string \| [IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)                                                                                                                                       | 图元 ID |
| property    | { x?: number; y?: number; layer?: [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md); width?: number; height?: number; rotation?: number; horizonMirror?: boolean; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md) \| undefined&gt;

图像图元对象
