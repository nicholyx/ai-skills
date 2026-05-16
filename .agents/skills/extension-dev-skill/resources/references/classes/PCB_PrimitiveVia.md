# PCB\_PrimitiveVia class

PCB &amp; 封装 / 过孔图元类

## 签名

```typescript
declare class PCB_PrimitiveVia implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                                                     | 修饰符 | 描述                       |
| --------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------ |
| [create(net, x, y, holeDiameter, diameter, viaType, designRuleBlindViaName, solderMaskExpansion, primitiveLock)](./PCB_PrimitiveVia.md) |     | 创建过孔                     |
| [delete(primitiveIds)](./PCB_PrimitiveVia.md)                                                                                           |     | **_(BETA)_** 删除过孔        |
| [get(primitiveIds)](./PCB_PrimitiveVia.md)                                                                                              |     | **_(BETA)_** 获取过孔        |
| [get(primitiveIds)](./PCB_PrimitiveVia.md)                                                                                              |     | **_(BETA)_** 获取过孔        |
| [getAll(net, primitiveLock)](./PCB_PrimitiveVia.md)                                                                                     |     | **_(BETA)_** 获取所有过孔      |
| [getAllPrimitiveId(net, primitiveLock)](./PCB_PrimitiveVia.md)                                                                          |     | **_(BETA)_** 获取所有过孔图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveVia.md)                                                                                  |     | **_(BETA)_** 修改过孔        |

---

## 方法详情

### create

# PCB\_PrimitiveVia.create() method

创建过孔

## 签名

```typescript
create(net: string, x: number, y: number, holeDiameter: number, diameter: number, viaType?: EPCB_PrimitiveViaType, designRuleBlindViaName?: string | null, solderMaskExpansion?: IPCB_PrimitiveSolderMaskAndPasteMaskExpansion | null, primitiveLock?: boolean): Promise<IPCB_PrimitiveVia | undefined>;
```

## 参数名

| 参数                     | 类型                                                                                                                       | 描述                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| net                    | string                                                                                                                   | 网络名称                                         |
| x                      | number                                                                                                                   | 坐标 X                                         |
| y                      | number                                                                                                                   | 坐标 Y                                         |
| holeDiameter           | number                                                                                                                   | 孔径                                           |
| diameter               | number                                                                                                                   | 外径                                           |
| viaType                | [EPCB\_PrimitiveViaType](../enums/EPCB_PrimitiveViaType.md)                                                              | _（可选）_ 过孔类型                                  |
| designRuleBlindViaName | string \| null                                                                                                           | _（可选）_ 盲埋孔设计规则项名称，定义过孔的开始层与结束层，`null` 表示非盲埋孔 |
| solderMaskExpansion    | [IPCB\_PrimitiveSolderMaskAndPasteMaskExpansion](../interfaces/IPCB_PrimitiveSolderMaskAndPasteMaskExpansion.md) \| null | _（可选）_ 阻焊/助焊扩展，`null` 表示跟随规则                 |
| primitiveLock          | boolean                                                                                                                  | _（可选）_ 是否锁定                                  |



## 返回值

Promise&lt;[IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md) \| undefined&gt;

过孔图元对象

### delete

# PCB\_PrimitiveVia.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除过孔

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveVia | Array<string> | Array<IPCB_PrimitiveVia>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                         | 描述               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md)&gt; | 过孔的图元 ID 或过孔图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveVia.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取过孔

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveVia | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 过孔的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md) \| undefined&gt;

过孔图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveVia.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取过孔

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveVia>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 过孔的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md)&gt;&gt;

过孔图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveVia.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有过孔

## 签名

```typescript
getAll(net?: string, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveVia>>;
```

## 参数名

| 参数            | 类型      | 描述          |
| ------------- | ------- | ----------- |
| net           | string  | _（可选）_ 网络名称 |
| primitiveLock | boolean | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md)&gt;&gt;

过孔图元对象数组

### getallprimitiveid

# PCB\_PrimitiveVia.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有过孔图元 ID

## 签名

```typescript
getAllPrimitiveId(net?: string, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型      | 描述          |
| ------------- | ------- | ----------- |
| net           | string  | _（可选）_ 网络名称 |
| primitiveLock | boolean | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

过孔的图元 ID 数组

### modify

# PCB\_PrimitiveVia.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改过孔

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveVia, property: {
        net?: string;
        x?: number;
        y?: number;
        holeDiameter?: number;
        diameter?: number;
        viaType?: EPCB_PrimitiveViaType;
        designRuleBlindViaName?: string | null;
        solderMaskExpansion?: IPCB_PrimitiveSolderMaskAndPasteMaskExpansion | null;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitiveVia | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                                                                                           | 描述    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md)                                                                                                                                                                                                                                                                                                                       | 图元 ID |
| property    | { net?: string; x?: number; y?: number; holeDiameter?: number; diameter?: number; viaType?: [EPCB\_PrimitiveViaType](../enums/EPCB_PrimitiveViaType.md); designRuleBlindViaName?: string \| null; solderMaskExpansion?: [IPCB\_PrimitiveSolderMaskAndPasteMaskExpansion](../interfaces/IPCB_PrimitiveSolderMaskAndPasteMaskExpansion.md) \| null; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md) \| undefined&gt;

过孔图元对象
