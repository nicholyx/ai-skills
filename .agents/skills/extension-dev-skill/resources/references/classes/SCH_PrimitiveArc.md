# SCH\_PrimitiveArc class

原理图 &amp; 符号 / 圆弧图元类

## 签名

```typescript
declare class SCH_PrimitiveArc implements ISCH_PrimitiveAPI
```
**实现自：**[ISCH\_PrimitiveAPI](../interfaces/ISCH_PrimitiveAPI.md)

## 方法

| 方法名                                                                                                                        | 修饰符 | 描述                        |
| -------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| [create(startX, startY, referenceX, referenceY, endX, endY, color, fillColor, lineWidth, lineType)](./SCH_PrimitiveArc.md) |     | **_(BETA)_** 创建圆弧         |
| [delete(primitiveIds)](./SCH_PrimitiveArc.md)                                                                              |     | **_(BETA)_** 删除圆弧         |
| [get(primitiveIds)](./SCH_PrimitiveArc.md)                                                                                 |     | **_(BETA)_** 获取圆弧         |
| [get(primitiveIds)](./SCH_PrimitiveArc.md)                                                                                 |     | **_(BETA)_** 获取圆弧         |
| [getAll()](./SCH_PrimitiveArc.md)                                                                                          |     | **_(BETA)_** 获取所有圆弧       |
| [getAllPrimitiveId()](./SCH_PrimitiveArc.md)                                                                               |     | **_(BETA)_** 获取所有圆弧的图元 ID |
| [modify(primitiveId, property)](./SCH_PrimitiveArc.md)                                                                     |     | **_(BETA)_** 修改圆弧         |

---

## 方法详情

### create

# SCH\_PrimitiveArc.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建圆弧

## 签名

```typescript
create(startX: number, startY: number, referenceX: number, referenceY: number, endX: number, endY: number, color?: string | null, fillColor?: string | null, lineWidth?: number | null, lineType?: ESCH_PrimitiveLineType | null): Promise<ISCH_PrimitiveArc | undefined>;
```

## 参数名

| 参数         | 类型                                                                    | 描述                                   |
| ---------- | --------------------------------------------------------------------- | ------------------------------------ |
| startX     | number                                                                | 起始点 X                                |
| startY     | number                                                                | 起始点 Y                                |
| referenceX | number                                                                | 参考点 X                                |
| referenceY | number                                                                | 参考点 Y                                |
| endX       | number                                                                | 终止点 X                                |
| endY       | number                                                                | 终止点 Y                                |
| color      | string \| null                                                        | _（可选）_ 颜色，`null` 表示默认                |
| fillColor  | string \| null                                                        | _（可选）_ 填充颜色，`none` 表示无填充，`null` 表示默认 |
| lineWidth  | number \| null                                                        | _（可选）_ 线宽，范围 `1-10`，`null` 表示默认      |
| lineType   | [ESCH\_PrimitiveLineType](../enums/ESCH_PrimitiveLineType.md) \| null | _（可选）_ 线型，`null` 表示默认                |



## 返回值

Promise&lt;[ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md) \| undefined&gt;

圆弧图元对象

### delete

# SCH\_PrimitiveArc.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除圆弧

## 签名

```typescript
delete(primitiveIds: string | ISCH_PrimitiveArc | Array<string> | Array<ISCH_PrimitiveArc>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                                         | 描述               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| primitiveIds | string \| [ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md) \| Array&lt;string&gt; \| Array&lt;[ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md)&gt; | 圆弧的图元 ID 或圆弧图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# SCH\_PrimitiveArc.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取圆弧

## 签名

```typescript
get(primitiveIds: string): Promise<ISCH_PrimitiveArc | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 圆弧的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;[ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md) \| undefined&gt;

圆弧图元对象，`undefined` 表示获取失败

### get_1

# SCH\_PrimitiveArc.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取圆弧

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveArc>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 圆弧的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;[ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md)&gt;&gt;

圆弧图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# SCH\_PrimitiveArc.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有圆弧

## 签名

```typescript
getAll(): Promise<Array<ISCH_PrimitiveArc>>;
```


## 返回值

Promise&lt;Array&lt;[ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md)&gt;&gt;

圆弧图元对象数组

### getallprimitiveid

# SCH\_PrimitiveArc.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有圆弧的图元 ID

## 签名

```typescript
getAllPrimitiveId(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

圆弧的图元 ID 数组

### modify

# SCH\_PrimitiveArc.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改圆弧

## 签名

```typescript
modify(primitiveId: string | ISCH_PrimitiveArc, property: {
        startX?: number;
        startY?: number;
        referenceX?: number;
        referenceY?: number;
        endX?: number;
        endY?: number;
        color?: string | null;
        fillColor?: string | null;
        lineWidth?: number | null;
        lineType?: ESCH_PrimitiveLineType | null;
    }): Promise<ISCH_PrimitiveArc | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                              | 描述    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| primitiveId | string \| [ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md)                                                                                                                                                                                                                          | 图元 ID |
| property    | { startX?: number; startY?: number; referenceX?: number; referenceY?: number; endX?: number; endY?: number; color?: string \| null; fillColor?: string \| null; lineWidth?: number \| null; lineType?: [ESCH\_PrimitiveLineType](../enums/ESCH_PrimitiveLineType.md) \| null; } | 修改参数  |



## 返回值

Promise&lt;[ISCH\_PrimitiveArc](./ISCH_PrimitiveArc.md) \| undefined&gt;

圆弧图元对象
