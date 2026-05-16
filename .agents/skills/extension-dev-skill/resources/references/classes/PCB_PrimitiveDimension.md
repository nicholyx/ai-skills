# PCB\_PrimitiveDimension class

PCB &amp; 封装 / 尺寸标注图元类

## 签名

```typescript
declare class PCB_PrimitiveDimension implements IPCB_PrimitiveAPI
```
**实现自：**[IPCB\_PrimitiveAPI](../interfaces/IPCB_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                                   | 修饰符 | 描述                          |
| --------------------------------------------------------------------------------------------------------------------- | --- | --------------------------- |
| [create(dimensionType, coordinateSet, layer, unit, lineWidth, precision, primitiveLock)](./PCB_PrimitiveDimension.md) |     | 创建尺寸标注                      |
| [delete(primitiveIds)](./PCB_PrimitiveDimension.md)                                                                   |     | **_(BETA)_** 删除尺寸标注         |
| [get(primitiveIds)](./PCB_PrimitiveDimension.md)                                                                      |     | **_(BETA)_** 获取尺寸标注         |
| [get(primitiveIds)](./PCB_PrimitiveDimension.md)                                                                      |     | **_(BETA)_** 获取尺寸标注         |
| [getAll(layer, primitiveLock)](./PCB_PrimitiveDimension.md)                                                           |     | **_(BETA)_** 获取所有尺寸标注       |
| [getAllPrimitiveId(layer, primitiveLock)](./PCB_PrimitiveDimension.md)                                                |     | **_(BETA)_** 获取所有尺寸标注的图元 ID |
| [modify(primitiveId, property)](./PCB_PrimitiveDimension.md)                                                          |     | **_(BETA)_** 修改尺寸标注         |

---

## 方法详情

### create

# PCB\_PrimitiveDimension.create() method

创建尺寸标注

## 签名

```typescript
create(dimensionType: EPCB_PrimitiveDimensionType, coordinateSet: TPCB_PrimitiveDimensionCoordinateSet, layer?: TPCB_LayersOfDimension, unit?: ESYS_Unit.MILLIMETER | ESYS_Unit.CENTIMETER | ESYS_Unit.INCH | ESYS_Unit.MIL, lineWidth?: number, precision?: number, primitiveLock?: boolean): Promise<IPCB_PrimitiveDimension | undefined>;
```

## 参数名

| 参数            | 类型                                                                                                                                                                                      | 描述                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| dimensionType | [EPCB\_PrimitiveDimensionType](../enums/EPCB_PrimitiveDimensionType.md)                                                                                                                 | 尺寸标注类型                 |
| coordinateSet | [TPCB\_PrimitiveDimensionCoordinateSet](../types/TPCB_PrimitiveDimensionCoordinateSet.md)                                                                                               | 尺寸标注坐标集                |
| layer         | [TPCB\_LayersOfDimension](../types/TPCB_LayersOfDimension.md)                                                                                                                           | _（可选）_ 层               |
| unit          | [ESYS\_Unit.MILLIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.CENTIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.INCH](../enums/ESYS_Unit.md) \| [ESYS\_Unit.MIL](../enums/ESYS_Unit.md) | _（可选）_ 单位              |
| lineWidth     | number                                                                                                                                                                                  | _（可选）_ 线宽              |
| precision     | number                                                                                                                                                                                  | _（可选）_ 精度，取值范围 `0`-`4` |
| primitiveLock | boolean                                                                                                                                                                                 | _（可选）_ 是否锁定            |



## 返回值

Promise&lt;[IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md) \| undefined&gt;

尺寸标注图元对象

### delete

# PCB\_PrimitiveDimension.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除尺寸标注

## 签名

```typescript
delete(primitiveIds: string | IPCB_PrimitiveDimension | Array<string> | Array<IPCB_PrimitiveDimension>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                                                 | 描述                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| primitiveIds | string \| [IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md) \| Array&lt;string&gt; \| Array&lt;[IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md)&gt; | 尺寸标注的图元 ID 或尺寸标注图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# PCB\_PrimitiveDimension.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取尺寸标注

## 签名

```typescript
get(primitiveIds: string): Promise<IPCB_PrimitiveDimension | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                     |
| ------------ | ------ | -------------------------------------- |
| primitiveIds | string | 尺寸标注的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md) \| undefined&gt;

尺寸标注图元对象，`undefined` 表示获取失败

### get_1

# PCB\_PrimitiveDimension.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取尺寸标注

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<IPCB_PrimitiveDimension>>;
```

## 参数名

| 参数           | 类型                  | 描述                                     |
| ------------ | ------------------- | -------------------------------------- |
| primitiveIds | Array&lt;string&gt; | 尺寸标注的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md)&gt;&gt;

尺寸标注图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# PCB\_PrimitiveDimension.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有尺寸标注

## 签名

```typescript
getAll(layer?: TPCB_LayersOfDimension, primitiveLock?: boolean): Promise<Array<IPCB_PrimitiveDimension>>;
```

## 参数名

| 参数            | 类型                                                            | 描述          |
| ------------- | ------------------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfDimension](../types/TPCB_LayersOfDimension.md) | _（可选）_ 层    |
| primitiveLock | boolean                                                       | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md)&gt;&gt;

尺寸标注图元对象数组

### getallprimitiveid

# PCB\_PrimitiveDimension.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有尺寸标注的图元 ID

## 签名

```typescript
getAllPrimitiveId(layer?: TPCB_LayersOfDimension, primitiveLock?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数            | 类型                                                            | 描述          |
| ------------- | ------------------------------------------------------------- | ----------- |
| layer         | [TPCB\_LayersOfDimension](../types/TPCB_LayersOfDimension.md) | _（可选）_ 层    |
| primitiveLock | boolean                                                       | _（可选）_ 是否锁定 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

尺寸标注的图元 ID 数组

### modify

# PCB\_PrimitiveDimension.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改尺寸标注

## 签名

```typescript
modify(primitiveId: string | IPCB_PrimitiveDimension, property: {
        dimensionType?: EPCB_PrimitiveDimensionType;
        coordinateSet?: TPCB_PrimitiveDimensionCoordinateSet;
        layer?: TPCB_LayersOfDimension;
        unit?: ESYS_Unit.MILLIMETER | ESYS_Unit.CENTIMETER | ESYS_Unit.INCH | ESYS_Unit.MIL;
        lineWidth?: number;
        precision?: number;
        primitiveLock?: boolean;
    }): Promise<IPCB_PrimitiveDimension | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 描述    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 图元 ID |
| property    | { dimensionType?: [EPCB\_PrimitiveDimensionType](../enums/EPCB_PrimitiveDimensionType.md); coordinateSet?: [TPCB\_PrimitiveDimensionCoordinateSet](../types/TPCB_PrimitiveDimensionCoordinateSet.md); layer?: [TPCB\_LayersOfDimension](../types/TPCB_LayersOfDimension.md); unit?: [ESYS\_Unit.MILLIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.CENTIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.INCH](../enums/ESYS_Unit.md) \| [ESYS\_Unit.MIL](../enums/ESYS_Unit.md); lineWidth?: number; precision?: number; primitiveLock?: boolean; } | 修改参数  |



## 返回值

Promise&lt;[IPCB\_PrimitiveDimension](./IPCB_PrimitiveDimension.md) \| undefined&gt;

尺寸标注图元对象
