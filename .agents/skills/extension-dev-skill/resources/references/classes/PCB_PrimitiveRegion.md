# PCB\_PrimitiveRegion class

PCB &amp; 封装 / 禁止区域和约束区域图元类

## 签名

```typescript
declare class PCB_PrimitiveRegion implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                       | 修饰符 | 描述                        |
| --------------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(layer, complexPolygon, ruleType, regionName, lineWidth, primitiveLock)](./PCB_PrimitiveRegion.md) |     | **_(BETA)_** 创建区域         |
| [delete(primitiveIds)](./PCB_PrimitiveRegion.md)                                                          |     | **_(BETA)_** 删除区域         |
| [get(primitiveIds)](./PCB_PrimitiveRegion.md)                                                             |     | **_(BETA)_** 获取区域         |
| [get(primitiveIds)](./PCB_PrimitiveRegion.md)                                                             |     | **_(BETA)_** 获取区域         |
| [getAll(layer, ruleType, primitiveLock)](./PCB_PrimitiveRegion.md)                                        |     | **_(BETA)_** 获取所有区域       |
| [getAllPrimitiveId(layer, ruleType, primitiveLock)](./PCB_PrimitiveRegion.md)                             |     | **_(BETA)_** 获取所有区域的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveRegion.md)                                                 |     | **_(BETA)_** 修改区域         |

---

## 方法详情

### create

# PCB\_PrimitiveRegion.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建区域

## 签名

```typescript
create(layer: TPCB_LayersOfRegion, complexPolygon: IPCB_Polygon, ruleType?: Array<EPCB_PrimitiveRegionRuleType>, regionName?: string, lineWidth?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveRegion | undefined>;
```

## 参数名

| 参数             | 类型                                                                                     | 描述            |
| -------------- | -------------------------------------------------------------------------------------- | ------------- |
| layer          | [TPCB\_LayersOfRegion](../types/TPCB_LayersOfRegion.md)                                | 层             |
| complexPolygon | [IPCB\_Polygon](./IPCB_Polygon.md)                                                     | 复杂多边形对象       |
| ruleType       | Array&lt;[EPCB\_PrimitiveRegionRuleType](../enums/EPCB_PrimitiveRegionRuleType.md)&gt; | _（可选）_ 区域规则类型 |
| regionName     | string                                                                                 | _（可选）_ 区域名称   |
| lineWidth      | number                                                                                 | _（可选）_ 线宽     |
| primitiveLock  | boolean                                                                                | _（可选）_ 是否锁定   |



## 返回值

Promise&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md) \| undefined&gt;

区域图元对象

### delete

# PCB\_PrimitiveRegion.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除区域

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveRegion | Array<string> | Array<IPCB_PrimitiveRegion>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                                     | 描述               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| primitiveIds | string \| [IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md)&gt; | 区域的图元 ID 或区域图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveRegion.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取区域

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveRegion | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 区域的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md) \| undefined&gt;

区域图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveRegion.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取区域

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveRegion>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 区域的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md)&gt;&gt;

区域图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveRegion.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有区域

## 签名

```typescript
getAll(layer?: TPCB_LayersOfRegion, ruleType?: Array<EPCB_PrimitiveRegionRuleType>, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveRegion>>;
```

## 参数名

| 参数            | 类型                                                                                     | 描述                             |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------ |
| layer         | [TPCB\_LayersOfRegion](../types/TPCB_LayersOfRegion.md)                                | _（可选）_ 层                       |
| ruleType      | Array&lt;[EPCB\_PrimitiveRegionRuleType](../enums/EPCB_PrimitiveRegionRuleType.md)&gt; | _（可选）_ 区域规则类型，只会匹配所有规则类型均一致的图元 |
| primitiveLock | boolean                                                                                | _（可选）_ 是否锁定                    |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md)&gt;&gt;

区域图元对象数组

### getallprimitiveid

# PCB\_PrimitiveRegion.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有区域的图元 ID

## 签名

```typescript
getAllPrimitiveId(layer?: TPCB_LayersOfRegion, ruleType?: Array<EPCB_PrimitiveRegionRuleType>, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                                                     | 描述                             |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------ |
| layer         | [TPCB\_LayersOfRegion](../types/TPCB_LayersOfRegion.md)                                | _（可选）_ 层                       |
| ruleType      | Array&lt;[EPCB\_PrimitiveRegionRuleType](../enums/EPCB_PrimitiveRegionRuleType.md)&gt; | _（可选）_ 区域规则类型，只会匹配所有规则类型均一致的图元 |
| primitiveLock | boolean                                                                                | _（可选）_ 是否锁定                    |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

区域的图元 ID 数组

### modify

# PCB\_PrimitiveRegion.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改区域

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveRegion, property: {
        layer?: TPCB_LayersOfRegion;
        complexPolygon?: IPCB_Polygon;
        ruleType?: Array<EPCB_PrimitiveRegionRuleType>;
        regionName?: string;
        lineWidth?: number;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitiveRegion | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                             | 描述    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md)                                                                                                                                                                                                                                   | 图元 ID |
| property    | { layer?: [TPCB\_LayersOfRegion](../types/TPCB_LayersOfRegion.md); complexPolygon?: [IPCB\_Polygon](./IPCB_Polygon.md); ruleType?: Array&lt;[EPCB\_PrimitiveRegionRuleType](../enums/EPCB_PrimitiveRegionRuleType.md)&gt;; regionName?: string; lineWidth?: number; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md) \| undefined&gt;

区域图元对象，`undefined` 表示修改失败
