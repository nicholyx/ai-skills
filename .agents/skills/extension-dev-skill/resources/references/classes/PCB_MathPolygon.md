# PCB\_MathPolygon class

PCB &amp; 封装 / 多边形数学类

## 签名

```typescript
declare class PCB_MathPolygon
```

## 方法

| 方法名                                                                                                                                                                            | 修饰符 | 描述                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | -------------------------- |
| [calculateBBoxHeight(complexPolygon)](./PCB_MathPolygon.md)                                                                                                                    |     |                            |
| [calculateBBoxWidth(complexPolygon)](./PCB_MathPolygon.md)                                                                                                                     |     |                            |
| [convertImageToComplexPolygon(imageBlob, imageWidth, imageHeight, tolerance, simplification, smoothing, despeckling, whiteAsBackgroundColor, inversion)](./PCB_MathPolygon.md) |     | **_(BETA)_** 将图像转换为复杂多边形对象 |
| [createComplexPolygon(complexPolygon)](./PCB_MathPolygon.md)                                                                                                                   |     | 创建复杂多边形                    |
| [createPolygon(polygon)](./PCB_MathPolygon.md)                                                                                                                                 |     | 创建单多边形                     |
| [splitPolygon(complexPolygons)](./PCB_MathPolygon.md)                                                                                                                          |     | 拆分单多边形                     |

---

## 方法详情

### calculatebboxheight

# PCB\_MathPolygon.calculateBBoxHeight() method

## 签名

```typescript
calculateBBoxHeight(complexPolygon: TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray>): number;
```

## 参数名

| 参数             | 类型                                                                                                                                              | 描述  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| complexPolygon | [TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt; |     |



## 返回值

number

### calculatebboxwidth

# PCB\_MathPolygon.calculateBBoxWidth() method

## 签名

```typescript
calculateBBoxWidth(complexPolygon: TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray>): number;
```

## 参数名

| 参数             | 类型                                                                                                                                              | 描述  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| complexPolygon | [TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt; |     |



## 返回值

number

### convertimagetocomplexpolygon

# PCB\_MathPolygon.convertImageToComplexPolygon() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将图像转换为复杂多边形对象

## 签名

```typescript
convertImageToComplexPolygon(imageBlob: Blob, imageWidth: number, imageHeight: number, tolerance?: number, simplification?: number, smoothing?: number, despeckling?: number, whiteAsBackgroundColor?: boolean, inversion?: boolean): Promise<IPCB_ComplexPolygon | undefined>;
```

## 参数名

| 参数                     | 类型      | 描述                           |
| ---------------------- | ------- | ---------------------------- |
| imageBlob              | Blob    | 图像 Blob 文件，可以使用  方法从文件系统读取文件 |
| imageWidth             | number  | 图像宽度                         |
| imageHeight            | number  | 图像高度                         |
| tolerance              | number  | _（可选）_ 容差，取值范围 `0`-`1`       |
| simplification         | number  | _（可选）_ 简化，取值范围 `0`-`1`       |
| smoothing              | number  | _（可选）_ 平滑，取值范围 `0`-`1.33`    |
| despeckling            | number  | _（可选）_ 去斑，取值范围 `0`-`5`       |
| whiteAsBackgroundColor | boolean | _（可选）_ 是否白色作为背景色             |
| inversion              | boolean | _（可选）_ 是否反相                  |



## 返回值

Promise&lt;[IPCB\_ComplexPolygon](./IPCB_ComplexPolygon.md) \| undefined&gt;

复杂多边形对象

### createcomplexpolygon

# PCB\_MathPolygon.createComplexPolygon() method

创建复杂多边形

## 签名

```typescript
createComplexPolygon(complexPolygon: TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray> | IPCB_Polygon | Array<IPCB_Polygon>): IPCB_ComplexPolygon | undefined;
```

## 参数名

| 参数             | 类型                                                                                                                                                                                                                                       | 描述      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| complexPolygon | [TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt; \| [IPCB\_Polygon](./IPCB_Polygon.md) \| Array&lt;[IPCB\_Polygon](./IPCB_Polygon.md)&gt; | 复杂多边形数据 |



## 返回值

[IPCB\_ComplexPolygon](./IPCB_ComplexPolygon.md) \| undefined

复杂多边形对象，`undefined` 表示数据不合法

### createpolygon

# PCB\_MathPolygon.createPolygon() method

创建单多边形

## 签名

```typescript
createPolygon(polygon: TPCB_PolygonSourceArray): IPCB_Polygon | undefined;
```

## 参数名

| 参数      | 类型                                                              | 描述     |
| ------- | --------------------------------------------------------------- | ------ |
| polygon | [TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) | 单多边形数据 |



## 返回值

[IPCB\_Polygon](./IPCB_Polygon.md) \| undefined

单多边形对象，`undefined` 表示数据不合法

### splitpolygon

# PCB\_MathPolygon.splitPolygon() method

拆分单多边形

## 签名

```typescript
splitPolygon(...complexPolygons: Array<IPCB_ComplexPolygon>): Array<IPCB_Polygon>;
```

## 参数名

| 参数              | 类型                                                            | 描述    |
| --------------- | ------------------------------------------------------------- | ----- |
| complexPolygons | Array&lt;[IPCB\_ComplexPolygon](./IPCB_ComplexPolygon.md)&gt; | 复杂多边形 |



## 返回值

Array&lt;[IPCB\_Polygon](./IPCB_Polygon.md)&gt;

单多边形数组
