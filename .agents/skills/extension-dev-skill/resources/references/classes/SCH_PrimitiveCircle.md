# SCH\_PrimitiveCircle class

原理图 &amp; 符号 / 圆图元类

## 签名

```typescript
declare class SCH_PrimitiveCircle implements ISCH_PrimitiveAPI
```
**实现自：**[ISCH\_PrimitiveAPI](../interfaces/ISCH_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                            | 修饰符 | 描述                       |
| -------------------------------------------------------------------------------------------------------------- | --- | ------------------------ |
| [create(centerX, centerY, radius, color, fillColor, lineWidth, lineType, fillStyle)](./SCH_PrimitiveCircle.md) |     | **_(BETA)_** 创建圆         |
| [delete(primitiveIds)](./SCH_PrimitiveCircle.md)                                                               |     | **_(BETA)_** 删除圆         |
| [get(primitiveIds)](./SCH_PrimitiveCircle.md)                                                                  |     | **_(BETA)_** 获取圆         |
| [get(primitiveIds)](./SCH_PrimitiveCircle.md)                                                                  |     | **_(BETA)_** 获取圆         |
| [getAll()](./SCH_PrimitiveCircle.md)                                                                           |     | **_(BETA)_** 获取所有圆       |
| [getAllPrimitiveId()](./SCH_PrimitiveCircle.md)                                                                |     | **_(BETA)_** 获取所有圆的图元 ID |
| [modify(primitiveId, property)](./SCH_PrimitiveCircle.md)                                                      |     | **_(BETA)_** 修改圆         |

---

## 方法详情

### create

# SCH\_PrimitiveCircle.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建圆

## 签名

```typescript
create(centerX: number, centerY: number, radius: number, color?: string | null, fillColor?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null, fillStyle?: ESCH_PrimitiveFillStyle | null): Promise<ISCH_PrimitiveCircle>;
```

## 参数名

| 参数        | 类型                                                                      | 描述                                   |
| --------- | ----------------------------------------------------------------------- | ------------------------------------ |
| centerX   | number                                                                  | 圆心 X                                 |
| centerY   | number                                                                  | 圆心 Y                                 |
| radius    | number                                                                  | 半径                                   |
| color     | string \| null                                                          | _（可选）_ 颜色，`null` 表示默认                |
| fillColor | string \| null                                                          | _（可选）_ 填充颜色，`none` 表示无填充，`null` 表示默认 |
| lineWidth | number \| null                                                          | _（可选）_ 线宽，范围 `1-10`，`null` 表示默认      |
| lineType  | [ESCH\_PrimitiveLineType](../enums/ESCH_PrimitiveLineType.md) \| null   | _（可选）_ 线型，`null` 表示默认                |
| fillStyle | [ESCH\_PrimitiveFillStyle](../enums/ESCH_PrimitiveFillStyle.md) \| null | _（可选）_ 填充样式，`null` 表示默认              |



## 返回值

Promise&lt;[ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md)&gt;

圆图元对象

### delete

# SCH\_PrimitiveCircle.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除圆

## 签名

```typescript
delete(primitiveIds: string | ISCH_PrimitiveCircle | Array<string> | Array<ISCH_PrimitiveCircle>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                                     | 描述             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| primitiveIds | string \| [ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md) \| Array&lt;string&gt; \| Array&lt;[ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md)&gt; | 圆的图元 ID 或圆图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# SCH\_PrimitiveCircle.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取圆

## 签名

```typescript
get(primitiveIds: string): Promise<ISCH_PrimitiveCircle | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                  |
| ------------ | ------ | ----------------------------------- |
| primitiveIds | string | 圆的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md) \| undefined&gt;

圆图元对象，`undefined` 表示获取失败

### get_1

# SCH\_PrimitiveCircle.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取圆

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveCircle>>;
```

## 参数名

| 参数           | 类型                  | 描述                                  |
| ------------ | ------------------- | ----------------------------------- |
| primitiveIds | Array&lt;string&gt; | 圆的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md)&gt;&gt;

圆图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# SCH\_PrimitiveCircle.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有圆

## 签名

```typescript
getAll(): Promise<Array<ISCH_PrimitiveCircle>>;
```


## 返回值

Promise&lt;Array&lt;[ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md)&gt;&gt;

圆图元对象数组

### getallprimitiveid

# SCH\_PrimitiveCircle.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有圆的图元 ID

## 签名

```typescript
getAllPrimitiveId(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

圆的图元 ID 数组

### modify

# SCH\_PrimitiveCircle.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改圆

## 签名

```typescript
modify(primitiveId: string | ISCH_PrimitiveCircle, property: {
        centerX?: number;
        centerY?: number;
        radius?: number;
        color?: string | null;
        fillColor?: string | null;
        lineWidth?: number | null;
        lineType?: ESCH_PrimitiveLineType | null;
        fillStyle?: ESCH_PrimitiveFillStyle | null;
    }): Promise<ISCH_PrimitiveCircle | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                              | 描述    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md)                                                                                                                                                                                                                                                    | 图元 ID |
| property    | { centerX?: number; centerY?: number; radius?: number; color?: string \| null; fillColor?: string \| null; lineWidth?: number \| null; lineType?: [ESCH\_PrimitiveLineType](../enums/ESCH_PrimitiveLineType.md) \| null; fillStyle?: [ESCH\_PrimitiveFillStyle](../enums/ESCH_PrimitiveFillStyle.md) \| null; } | 修改参数  |



## 返回值

Promise&lt;[ISCH\_PrimitiveCircle](./ISCH_PrimitiveCircle.md) \| undefined&gt;

圆图元对象
