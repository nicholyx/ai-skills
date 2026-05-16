# PCB\_PrimitiveComponent class

PCB &amp; 封装 / 器件图元类

## 签名

```typescript
declare class PCB_PrimitiveComponent implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                    | 修饰符 | 描述                        |
| -------------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(component, layer, x, y, rotation, primitiveLock)](./PCB_PrimitiveComponent.md) |     | **_(BETA)_** 创建器件         |
| [delete(primitiveIds)](./PCB_PrimitiveComponent.md)                                    |     | **_(BETA)_** 删除器件         |
| [get(primitiveIds)](./PCB_PrimitiveComponent.md)                                       |     | **_(BETA)_** 获取器件         |
| [get(primitiveIds)](./PCB_PrimitiveComponent.md)                                       |     | **_(BETA)_** 获取器件         |
| [getAll(layer, primitiveLock)](./PCB_PrimitiveComponent.md)                            |     | **_(BETA)_** 获取所有器件       |
| [getAllPinsByPrimitiveId(primitiveId)](./PCB_PrimitiveComponent.md)                    |     | **_(BETA)_** 获取器件关联的所有焊盘  |
| [getAllPrimitiveId(layer, primitiveLock)](./PCB_PrimitiveComponent.md)                 |     | **_(BETA)_** 获取所有器件的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveComponent.md)                           |     | **_(BETA)_** 修改器件         |

---

## 方法详情

### create

# PCB\_PrimitiveComponent.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建器件

## 签名

```typescript
create(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem, layer: TPCB_LayersOfComponent, x: number, y: number, rotation?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveComponent | undefined>;
```

## 参数名

| 参数            | 类型                                                                                             | 描述          |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| component     | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) | 关联库器件       |
| layer         | [TPCB\_LayersOfComponent](../types/TPCB_LayersOfComponent.md)                                  | 层           |
| x             | number                                                                                         | 坐标 X        |
| y             | number                                                                                         | 坐标 Y        |
| rotation      | number                                                                                         | _（可选）_ 旋转角度 |
| primitiveLock | boolean                                                                                        | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md) \| undefined&gt;

器件图元对象

### delete

# PCB\_PrimitiveComponent.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除器件

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveComponent | Array<string> | Array<IPCB_PrimitiveComponent>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                                                 | 描述               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)&gt; | 器件的图元 ID 或器件图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveComponent.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveComponent | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 器件的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md) \| undefined&gt;

器件图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveComponent.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveComponent>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 器件的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)&gt;&gt;

器件图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveComponent.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有器件

## 签名

```typescript
getAll(layer?: TPCB_LayersOfComponent, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveComponent>>;
```

## 参数名

| 参数            | 类型                                                            | 描述          |
| ------------- | ------------------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfComponent](../types/TPCB_LayersOfComponent.md) | _（可选）_ 层    |
| primitiveLock | boolean                                                       | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)&gt;&gt;

器件图元对象数组

### getallpinsbyprimitiveid

# PCB\_PrimitiveComponent.getAllPinsByPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件关联的所有焊盘

## 签名

```typescript
getAllPinsByPrimitiveId(primitiveId: string): Promise<Array<IPCB_PrimitiveComponentPad> | undefined>;
```

## 参数名

| 参数          | 类型     | 描述      |
| ----------- | ------ | ------- |
| primitiveId | string | 器件图元 ID |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveComponentPad](./IPCB_PrimitiveComponentPad.md)&gt; \| undefined&gt;

器件焊盘图元数组

### getallprimitiveid

# PCB\_PrimitiveComponent.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有器件的图元 ID

## 签名

```typescript
getAllPrimitiveId(layer?: TPCB_LayersOfComponent, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                            | 描述          |
| ------------- | ------------------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfComponent](../types/TPCB_LayersOfComponent.md) | _（可选）_ 层    |
| primitiveLock | boolean                                                       | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

器件的图元 ID 数组

### modify

# PCB\_PrimitiveComponent.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改器件

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveComponent, property: {
        layer?: TPCB_LayersOfComponent;
        x?: number;
        y?: number;
        rotation?: number;
        primitiveLock?: boolean;
        addIntoBom?: boolean;
        designator?: string | null;
        name?: string | null;
        uniqueId?: string | null;
        manufacturer?: string | null;
        manufacturerId?: string | null;
        supplier?: string | null;
        supplierId?: string | null;
        otherProperty?: {
            [key: string]: any;
        };
    }): Promise<IPCB_PrimitiveComponent | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                                                                                                                                     | 描述    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)                                                                                                                                                                                                                                                                                                                                                     | 图元 ID |
| property    | { layer?: [TPCB\_LayersOfComponent](../types/TPCB_LayersOfComponent.md); x?: number; y?: number; rotation?: number; primitiveLock?: boolean; addIntoBom?: boolean; designator?: string \| null; name?: string \| null; uniqueId?: string \| null; manufacturer?: string \| null; manufacturerId?: string \| null; supplier?: string \| null; supplierId?: string \| null; otherProperty?: { \[key: string\]: any; }; } |       |



## 返回值

Promise&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md) \| undefined&gt;

器件图元对象
