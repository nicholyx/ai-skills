# PCB\_PrimitivePolyline class

PCB &amp; 封装 / 折线图元类

## 签名

```typescript
declare class PCB_PrimitivePolyline implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                 | 修饰符 | 描述                        |
| ----------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(net, layer, polygon, lineWidth, primitiveLock)](./PCB_PrimitivePolyline.md) |     | 创建折线                      |
| [delete(primitiveIds)](./PCB_PrimitivePolyline.md)                                  |     | **_(BETA)_** 删除折线         |
| [get(primitiveIds)](./PCB_PrimitivePolyline.md)                                     |     | **_(BETA)_** 获取折线         |
| [get(primitiveIds)](./PCB_PrimitivePolyline.md)                                     |     | **_(BETA)_** 获取折线         |
| [getAll(net, layer, primitiveLock)](./PCB_PrimitivePolyline.md)                     |     | **_(BETA)_** 获取所有折线       |
| [getAllPrimitiveId(net, layer, primitiveLock)](./PCB_PrimitivePolyline.md)          |     | **_(BETA)_** 获取所有折线的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitivePolyline.md)                         |     | **_(BETA)_** 修改折线         |

---

## 方法详情

### create

# PCB\_PrimitivePolyline.create() method

创建折线

## 签名

```typescript
create(net: string, layer: TPCB_LayersOfLine, polygon: IPCB_Polygon, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitivePolyline | undefined>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| net           | string                                              | 网络名称        |
| layer         | [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md) | 层           |
| polygon       | [IPCB\_Polygon](./IPCB_Polygon.md)                  | 单多边形对象      |
| lineWidth     | number                                              | _（可选）_ 线宽   |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md) \| undefined&gt;

折线图元对象

### delete

# PCB\_PrimitivePolyline.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除折线

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitivePolyline | Array<string> | Array<IPCB_PrimitivePolyline>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                                             | 描述               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)&gt; | 折线的图元 ID 或折线图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitivePolyline.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取折线

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitivePolyline | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 折线的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md) \| undefined&gt;

折线图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitivePolyline.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取折线

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitivePolyline>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 折线的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)&gt;&gt;

折线图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitivePolyline.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有折线

## 签名

```typescript
getAll(net?: string, layer?: TPCB_LayersOfLine, primitiveLock?: boolean): Promise<Array<IPCB_PrimitivePolyline>>;
```

## 参数名

| 参数            | 类型                                                  | 描述          |
| ------------- | --------------------------------------------------- | ----------- |
| net           | string                                              | _（可选）_ 网络名称 |
| layer         | [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md) | _（可选）_ 层    |
| primitiveLock | boolean                                             | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)&gt;&gt;

折线图元对象数组

### getallprimitiveid

# PCB\_PrimitivePolyline.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有折线的图元 ID

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

# PCB\_PrimitivePolyline.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改折线

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitivePolyline, property: {
        net?: string;
        layer?: TPCB_LayersOfLine;
        polygon?: IPCB_Polygon;
        lineWidth?: number;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitivePolyline | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                        | 描述    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)                                                                                                          | 图元 ID |
| property    | { net?: string; layer?: [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md); polygon?: [IPCB\_Polygon](./IPCB_Polygon.md); lineWidth?: number; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md) \| undefined&gt;

折线图元对象
