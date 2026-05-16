# PCB\_PrimitivePad class

PCB &amp; 封装 / 焊盘图元类

## 签名

```typescript
declare class PCB_PrimitivePad implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                                                                                                                                        | 修饰符 | 描述                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(layer, padNumber, x, y, rotation, pad, net, hole, holeOffsetX, holeOffsetY, holeRotation, metallization, padType, specialPad, solderMaskAndPasteMaskExpansion, heatWelding, primitiveLock)](./PCB_PrimitivePad.md) |     | 创建焊盘                      |
| [delete(primitiveIds)](./PCB_PrimitivePad.md)                                                                                                                                                                              |     | **_(BETA)_** 删除焊盘         |
| [get(primitiveIds)](./PCB_PrimitivePad.md)                                                                                                                                                                                 |     | **_(BETA)_** 获取焊盘         |
| [get(primitiveIds)](./PCB_PrimitivePad.md)                                                                                                                                                                                 |     | **_(BETA)_** 获取焊盘         |
| [getAll(layer, net, primitiveLock, padType)](./PCB_PrimitivePad.md)                                                                                                                                                        |     | **_(BETA)_** 获取所有焊盘       |
| [getAllPrimitiveId(layer, net, primitiveLock, padType)](./PCB_PrimitivePad.md)                                                                                                                                             |     | **_(BETA)_** 获取所有焊盘的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitivePad.md)                                                                                                                                                                     |     | **_(BETA)_** 修改焊盘         |

---

## 方法详情

### create

# PCB\_PrimitivePad.create() method

创建焊盘

## 签名

```typescript
create(layer: TPCB_LayersOfPad, padNumber: string, x: number, y: number, rotation?: number, pad?: TPCB_PrimitivePadShape, net?: string, hole?: TPCB_PrimitivePadHole | null, holeOffsetX?: number, holeOffsetY?: number, holeRotation?: number, metallization?: boolean, padType?: EPCB_PrimitivePadType, specialPad?: TPCB_PrimitiveSpecialPadShape, solderMaskAndPasteMaskExpansion?: IPCB_PrimitiveSolderMaskAndPasteMaskExpansion | null, heatWelding?: IPCB_PrimitivePadHeatWelding | null, primitiveLock?: boolean): Promise<IPCB_PrimitivePad | undefined>;
```

## 参数名

| 参数                              | 类型                                                                                                                       | 描述                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| layer                           | [TPCB\_LayersOfPad](../types/TPCB_LayersOfPad.md)                                                                        | 层                            |
| padNumber                       | string                                                                                                                   | 焊盘编号                         |
| x                               | number                                                                                                                   | 位置 X                         |
| y                               | number                                                                                                                   | 位置 Y                         |
| rotation                        | number                                                                                                                   | _（可选）_ 旋转角度                  |
| pad                             | [TPCB\_PrimitivePadShape](../types/TPCB_PrimitivePadShape.md)                                                            | _（可选）_ 焊盘外形，在特殊焊盘外形实现前，该参数必传 |
| net                             | string                                                                                                                   | _（可选）_ 网络名称                  |
| hole                            | [TPCB\_PrimitivePadHole](../types/TPCB_PrimitivePadHole.md) \| null                                                      | _（可选）_ 孔，`null` 标识无孔         |
| holeOffsetX                     | number                                                                                                                   | _（可选）_ 孔偏移 X                 |
| holeOffsetY                     | number                                                                                                                   | _（可选）_ 孔偏移 Y                 |
| holeRotation                    | number                                                                                                                   | _（可选）_ 孔相对于焊盘的旋转角度           |
| metallization                   | boolean                                                                                                                  | _（可选）_ 是否金属化孔壁               |
| padType                         | [EPCB\_PrimitivePadType](../enums/EPCB_PrimitivePadType.md)                                                              | _（可选）_ 焊盘类型                  |
| specialPad                      | [TPCB\_PrimitiveSpecialPadShape](../types/TPCB_PrimitiveSpecialPadShape.md)                                              | _（可选）_ 特殊焊盘外形，当前暂未实现，请勿使用    |
| solderMaskAndPasteMaskExpansion | [IPCB\_PrimitiveSolderMaskAndPasteMaskExpansion](../interfaces/IPCB_PrimitiveSolderMaskAndPasteMaskExpansion.md) \| null | _（可选）_ 阻焊/助焊扩展，`null` 表示遵循规则 |
| heatWelding                     | IPCB\_PrimitivePadHeatWelding \| null                                                                                    | _（可选）_ 热焊优化参数                |
| primitiveLock                   | boolean                                                                                                                  | _（可选）_ 是否锁定                  |



## 返回值

Promise&lt;[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md) \| undefined&gt;

焊盘图元对象

### delete

# PCB\_PrimitivePad.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除焊盘

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitivePad | Array<string> | Array<IPCB_PrimitivePad>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                         | 描述               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitivePad](./IPCB_PrimitivePad.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md)&gt; | 焊盘的图元 ID 或焊盘图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitivePad.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取焊盘

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitivePad | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 焊盘的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md) \| undefined&gt;

焊盘图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitivePad.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取焊盘

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitivePad>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 焊盘的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md)&gt;&gt;

焊盘图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitivePad.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有焊盘

## 签名

```typescript
getAll(layer?: TPCB_LayersOfPad, net?: string, primitiveLock?: boolean, padType?: EPCB_PrimitivePadType): Promise<Array<IPCB_PrimitivePad>>;
```

## 参数名

| 参数            | 类型                                                          | 描述           |
| ------------- | ----------------------------------------------------------- | ------------ |
| layer         | [TPCB\_LayersOfPad](../types/TPCB_LayersOfPad.md)           | _（可选）_ 层     |
| net           | string                                                      | _（可选）_ 网络名称  |
| primitiveLock | boolean                                                     | _（可选）_ 是否锁定  |
| padType       | [EPCB\_PrimitivePadType](../enums/EPCB_PrimitivePadType.md) | _(Optional)_ |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md)&gt;&gt;

焊盘图元对象数组

### getallprimitiveid

# PCB\_PrimitivePad.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有焊盘的图元 ID

## 签名

```typescript
getAllPrimitiveId(layer?: TPCB_LayersOfPad, net?: string, primitiveLock?: boolean, padType?: EPCB_PrimitivePadType): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                          | 描述           |
| ------------- | ----------------------------------------------------------- | ------------ |
| layer         | [TPCB\_LayersOfPad](../types/TPCB_LayersOfPad.md)           | _（可选）_ 层     |
| net           | string                                                      | _（可选）_ 网络名称  |
| primitiveLock | boolean                                                     | _（可选）_ 是否锁定  |
| padType       | [EPCB\_PrimitivePadType](../enums/EPCB_PrimitivePadType.md) | _(Optional)_ |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

焊盘的图元 ID 数组

### modify

# PCB\_PrimitivePad.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改焊盘

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitivePad, property: {
        layer?: TPCB_LayersOfPad;
        padNumber?: string;
        x?: number;
        y?: number;
        rotation?: number;
        pad?: TPCB_PrimitivePadShape;
        net?: string;
        hole?: TPCB_PrimitivePadHole | null;
        holeOffsetX?: number;
        holeOffsetY?: number;
        holeRotation?: number;
        metallization?: boolean;
        specialPad?: TPCB_PrimitiveSpecialPadShape;
        solderMaskAndPasteMaskExpansion?: IPCB_PrimitiveSolderMaskAndPasteMaskExpansion | null;
        heatWelding?: IPCB_PrimitivePadHeatWelding | null;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitivePad | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 描述    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitivePad](./IPCB_PrimitivePad.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 图元 ID |
| property    | { layer?: [TPCB\_LayersOfPad](../types/TPCB_LayersOfPad.md); padNumber?: string; x?: number; y?: number; rotation?: number; pad?: [TPCB\_PrimitivePadShape](../types/TPCB_PrimitivePadShape.md); net?: string; hole?: [TPCB\_PrimitivePadHole](../types/TPCB_PrimitivePadHole.md) \| null; holeOffsetX?: number; holeOffsetY?: number; holeRotation?: number; metallization?: boolean; specialPad?: [TPCB\_PrimitiveSpecialPadShape](../types/TPCB_PrimitiveSpecialPadShape.md); solderMaskAndPasteMaskExpansion?: [IPCB\_PrimitiveSolderMaskAndPasteMaskExpansion](../interfaces/IPCB_PrimitiveSolderMaskAndPasteMaskExpansion.md) \| null; heatWelding?: IPCB\_PrimitivePadHeatWelding \| null; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md) \| undefined&gt;

焊盘图元对象
