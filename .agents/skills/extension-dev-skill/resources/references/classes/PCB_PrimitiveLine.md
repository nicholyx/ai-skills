# PCB\_PrimitiveLine class

PCB &amp; 封装 / 直线图元类

## 签名

```typescript
declare class PCB_PrimitiveLine implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 备注

直线和圆弧线均为导线，对应画布的线条走线和圆弧走线

## 方法

| 方法名                                                                                                | 修饰符 | 描述                        |
| -------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(net, layer, startX, startY, endX, endY, lineWidth, primitiveLock)](./PCB_PrimitiveLine.md) |     | 创建直线                      |
| [delete(primitiveIds)](./PCB_PrimitiveLine.md)                                                     |     | **_(BETA)_** 删除直线         |
| [get(primitiveIds)](./PCB_PrimitiveLine.md)                                                        |     | **_(BETA)_** 获取直线         |
| [get(primitiveIds)](./PCB_PrimitiveLine.md)                                                        |     | **_(BETA)_** 获取直线         |
| [getAll(net, layer, primitiveLock)](./PCB_PrimitiveLine.md)                                        |     | **_(BETA)_** 获取所有直线       |
| [getAllPrimitiveId(net, layer, primitiveLock)](./PCB_PrimitiveLine.md)                             |     | **_(BETA)_** 获取所有直线的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveLine.md)                                            |     | **_(BETA)_** 修改直线         |

---

## 方法详情

### create

# PCB\_PrimitiveLine.create() method

创建直线

## 签名

```typescript
create(net: string, layer: TPCB_LayersOfLine, startX: number, startY: number, endX: number, endY: number, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveLine | undefined>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| net           | string                                              | 网络名称        |
| layer         | [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md) | 层           |
| startX        | number                                              | 起始位置 X      |
| startY        | number                                              | 起始位置 Y      |
| endX          | number                                              | 终止位置 X      |
| endY          | number                                              | 终止位置 Y      |
| lineWidth     | number                                              | _（可选）_ 线宽   |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md) \| undefined&gt;

直线图元对象

### delete

# PCB\_PrimitiveLine.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除直线

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveLine | Array<string> | Array<IPCB_PrimitiveLine>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                             | 描述               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md)&gt; | 直线的图元 ID 或直线图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveLine.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取直线

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveLine | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 直线的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md) \| undefined&gt;

直线图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveLine.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取直线

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveLine>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 直线的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md)&gt;&gt;

直线图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveLine.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有直线

## 签名

```typescript
getAll(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveLine>>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| net           | string                                              | _（可选）_ 网络名称 |
| layer         | [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md) | _（可选）_ 层    |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md)&gt;&gt;

直线图元对象数组

### getallprimitiveid

# PCB\_PrimitiveLine.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有直线的图元 ID

## 签名

```typescript
getAllPrimitiveId(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| net           | string                                              | _（可选）_ 网络名称 |
| layer         | [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md) | _（可选）_ 层    |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

折线的图元 ID 数组

### modify

# PCB\_PrimitiveLine.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改直线

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveLine, property: {
        net?: string;
        layer?: TPCB_LayersOfLine;
        startX?: number;
        startY?: number;
        endX?: number;
        endY?: number;
        lineWidth?: number;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitiveLine | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                          | 描述    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md)                                                                                                                                    | 图元 ID |
| property    | { net?: string; layer?: [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md); startX?: number; startY?: number; endX?: number; endY?: number; lineWidth?: number; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md) \| undefined&gt;

直线图元对象
