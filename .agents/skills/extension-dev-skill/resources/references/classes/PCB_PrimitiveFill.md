# PCB\_PrimitiveFill class

PCB &amp; 封装 / 填充图元类

## 签名

```typescript
declare class PCB_PrimitiveFill implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                              | 修饰符 | 描述                        |
| ------------------------------------------------------------------------------------------------ | --- | ------------------------- |
| [create(layer, complexPolygon, net, fillMode, lineWidth, primitiveLock)](./PCB_PrimitiveFill.md) |     | **_(BETA)_** 创建填充         |
| [delete(primitiveIds)](./PCB_PrimitiveFill.md)                                                   |     | **_(BETA)_** 删除填充         |
| [get(primitiveIds)](./PCB_PrimitiveFill.md)                                                      |     | **_(BETA)_** 获取填充         |
| [get(primitiveIds)](./PCB_PrimitiveFill.md)                                                      |     | **_(BETA)_** 获取填充         |
| [getAll(layer, net, primitiveLock)](./PCB_PrimitiveFill.md)                                      |     | **_(BETA)_** 获取所有填充       |
| [getAllPrimitiveId(layer, net, primitiveLock)](./PCB_PrimitiveFill.md)                           |     | **_(BETA)_** 获取所有填充的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveFill.md)                                          |     | **_(BETA)_** 修改填充         |

---

## 方法详情

### create

# PCB\_PrimitiveFill.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建填充

## 签名

```typescript
create(layer: TPCB_LayersOfFill, complexPolygon: IPCB_Polygon, net?: string, fillMode?: EPCB_PrimitiveFillMode, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveFill | undefined>;
```

## 参数名

| 参数             | 类型                                                            | 描述          |
| -------------- | ------------------------------------------------------------- | ----------- |
| layer          | [TPCB\_LayersOfFill](../types/TPCB_LayersOfFill.md)           | 层           |
| complexPolygon | [IPCB\_Polygon](./IPCB_Polygon.md)                            | 复杂多边形对象     |
| net            | string                                                        | _（可选）_ 网络名称 |
| fillMode       | [EPCB\_PrimitiveFillMode](../enums/EPCB_PrimitiveFillMode.md) | _（可选）_ 填充模式 |
| lineWidth      | number                                                        | _（可选）_ 线宽   |
| primitiveLock  | boolean                                                       | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md) \| undefined&gt;

填充图元对象

### delete

# PCB\_PrimitiveFill.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除填充

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveFill | Array<string> | Array<IPCB_PrimitiveFill>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                             | 描述               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md)&gt; | 填充的图元 ID 或填充图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveFill.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取填充

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveFill | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 填充的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md) \| undefined&gt;

填充图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveFill.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取填充

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveFill>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 填充的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md)&gt;&gt;

填充图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveFill.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有填充

## 签名

```typescript
getAll(layer?: TPCB_LayersOfFill, net?: string, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveFill>>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfFill](../types/TPCB_LayersOfFill.md) | _（可选）_ 层    |
| net           | string                                              | _（可选）_ 网络名称 |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md)&gt;&gt;

填充图元对象数组

### getallprimitiveid

# PCB\_PrimitiveFill.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有填充的图元 ID

## 签名

```typescript
getAllPrimitiveId(layer?: TPCB_LayersOfFill, net?: string, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfFill](../types/TPCB_LayersOfFill.md) | _（可选）_ 层    |
| net           | string                                              | _（可选）_ 网络名称 |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

填充的图元 ID 数组

### modify

# PCB\_PrimitiveFill.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改填充

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveFill, property: {
        layer?: TPCB_LayersOfFill;
        complexPolygon?: IPCB_Polygon;
        net?: string;
        fillMode?: EPCB_PrimitiveFillMode;
        lineWidth?: number;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitiveFill | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                         | 描述    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md)                                                                                                                                                                                                   | 图元 ID |
| property    | { layer?: [TPCB\_LayersOfFill](../types/TPCB_LayersOfFill.md); complexPolygon?: [IPCB\_Polygon](./IPCB_Polygon.md); net?: string; fillMode?: [EPCB\_PrimitiveFillMode](../enums/EPCB_PrimitiveFillMode.md); lineWidth?: number; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md) \| undefined&gt;

填充图元对象，`undefined` 表示修改失败
