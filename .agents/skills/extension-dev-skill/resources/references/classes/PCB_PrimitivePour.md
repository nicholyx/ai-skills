# PCB\_PrimitivePour class

PCB &amp; 封装 / 覆铜边框图元类

## 签名

```typescript
declare class PCB_PrimitivePour implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                                                           | 修饰符 | 描述                          |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --- | --------------------------- |
| [create(net, layer, complexPolygon, pourFillMethod, preserveSilos, pourName, pourPriority, lineWidth, primitiveLock)](./PCB_PrimitivePour.md) |     | **_(BETA)_** 创建覆铜边框         |
| [delete(primitiveIds)](./PCB_PrimitivePour.md)                                                                                                |     | **_(BETA)_** 删除覆铜边框         |
| [get(primitiveIds)](./PCB_PrimitivePour.md)                                                                                                   |     | **_(BETA)_** 获取覆铜边框         |
| [get(primitiveIds)](./PCB_PrimitivePour.md)                                                                                                   |     | **_(BETA)_** 获取覆铜边框         |
| [getAll(net, layer, primitiveLock)](./PCB_PrimitivePour.md)                                                                                   |     | **_(BETA)_** 获取所有覆铜边框图元     |
| [getAllPrimitiveId(net, layer, primitiveLock)](./PCB_PrimitivePour.md)                                                                        |     | **_(BETA)_** 获取所有覆铜边框的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitivePour.md)                                                                                       |     | **_(BETA)_** 修改覆铜边框         |

---

## 方法详情

### create

# PCB\_PrimitivePour.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建覆铜边框

## 签名

```typescript
create(net: string, layer: TPCB_LayersOfCopper, complexPolygon: IPCB_Polygon, pourFillMethod?: EPCB_PrimitivePourFillMethod, preserveSilos?: boolean, pourName?: string, pourPriority?: number, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitivePour | undefined>;
```

## 参数名

| 参数             | 类型                                                                        | 描述            |
| -------------- | ------------------------------------------------------------------------- | ------------- |
| net            | string                                                                    | 网络名称          |
| layer          | [TPCB\_LayersOfCopper](../types/TPCB_LayersOfCopper.md)                   | 层             |
| complexPolygon | [IPCB\_Polygon](./IPCB_Polygon.md)                                        | 复杂多边形对象       |
| pourFillMethod | [EPCB\_PrimitivePourFillMethod](../enums/EPCB_PrimitivePourFillMethod.md) | _（可选）_ 覆铜填充方法 |
| preserveSilos  | boolean                                                                   | _（可选）_ 是否保留孤岛 |
| pourName       | string                                                                    | _（可选）_ 覆铜名称   |
| pourPriority   | number                                                                    | _（可选）_ 覆铜优先级  |
| lineWidth      | number                                                                    | _（可选）_ 线宽     |
| primitiveLock  | boolean                                                                   | _（可选）_ 是否锁定   |



## 返回值

Promise&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md) \| undefined&gt;

覆铜边框图元对象

### delete

# PCB\_PrimitivePour.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除覆铜边框

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitivePour | Array<string> | Array<IPCB_PrimitivePour>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                             | 描述                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| primitiveIds | string \| [IPCB\_PrimitivePour](./IPCB_PrimitivePour.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md)&gt; | 覆铜边框的图元 ID 或覆铜边框图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitivePour.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取覆铜边框

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitivePour | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                     |
| ------------ | ------ | -------------------------------------- |
| primitiveIds | string | 覆铜边框的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md) \| undefined&gt;

覆铜边框图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitivePour.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取覆铜边框

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitivePour>>;
```

## 参数名

| 参数           | 类型                  | 描述                                     |
| ------------ | ------------------- | -------------------------------------- |
| primitiveIds | Array&lt;string&gt; | 覆铜边框的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md)&gt;&gt;

覆铜边框图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitivePour.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有覆铜边框图元

## 签名

```typescript
getAll(net?: string, layer?: TPCB_LayersOfCopper, primitiveLock?: boolean): Promise<Array<IPCB_PrimitivePour>>;
```

## 参数名

| 参数            | 类型                                                      | 描述          |
| ------------- | ------------------------------------------------------- | ----------- |
| net           | string                                                  | _（可选）_ 网络名称 |
| layer         | [TPCB\_LayersOfCopper](../types/TPCB_LayersOfCopper.md) | _（可选）_ 层    |
| primitiveLock | boolean                                                 | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md)&gt;&gt;

覆铜边框图元对象数组

### getallprimitiveid

# PCB\_PrimitivePour.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有覆铜边框的图元 ID

## 签名

```typescript
getAllPrimitiveId(net?: string, layer?: TPCB_LayersOfCopper, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                      | 描述          |
| ------------- | ------------------------------------------------------- | ----------- |
| net           | string                                                  | _（可选）_ 网络名称 |
| layer         | [TPCB\_LayersOfCopper](../types/TPCB_LayersOfCopper.md) | _（可选）_ 层    |
| primitiveLock | boolean                                                 | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

覆铜边框的图元 ID 数组

### modify

# PCB\_PrimitivePour.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改覆铜边框

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitivePour, property: {
        net?: string;
        layer?: TPCB_LayersOfCopper;
        complexPolygon?: IPCB_Polygon;
        pourFillMethod?: EPCB_PrimitivePourFillMethod;
        preserveSilos?: boolean;
        pourName?: string;
        pourPriority?: number;
        lineWidth?: number;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitivePour | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                                                                  | 描述    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitivePour](./IPCB_PrimitivePour.md)                                                                                                                                                                                                                                                                                            | 图元 ID |
| property    | { net?: string; layer?: [TPCB\_LayersOfCopper](../types/TPCB_LayersOfCopper.md); complexPolygon?: [IPCB\_Polygon](./IPCB_Polygon.md); pourFillMethod?: [EPCB\_PrimitivePourFillMethod](../enums/EPCB_PrimitivePourFillMethod.md); preserveSilos?: boolean; pourName?: string; pourPriority?: number; lineWidth?: number; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md) \| undefined&gt;

覆铜边框图元对象，`undefined` 表示修改失败
