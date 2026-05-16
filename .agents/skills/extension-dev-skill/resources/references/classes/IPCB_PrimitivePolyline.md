# IPCB\_PrimitivePolyline class

折线图元

## 签名

```typescript
declare class IPCB_PrimitivePolyline implements IPCB_Primitive
```
**实现自：**[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)

## 备注


## 方法

| 方法名                                                                   | 修饰符 | 描述                          |
| --------------------------------------------------------------------- | --- | --------------------------- |
| [convertToFill()](./IPCB_PrimitivePolyline.md)                        |     | **_(BETA)_** 转换到：填充图元       |
| [convertToPour()](./IPCB_PrimitivePolyline.md)                        |     | **_(BETA)_** 转换到：覆铜边框图元     |
| [convertToRegion()](./IPCB_PrimitivePolyline.md)                      |     | **_(BETA)_** 转换到：区域图元       |
| [done()](./IPCB_PrimitivePolyline.md)                                 |     | **_(BETA)_** 将对图元的更改应用到画布   |
| [getState\_Layer()](./IPCB_PrimitivePolyline.md)                      |     | 获取属性状态：层                    |
| [getState\_LineWidth()](./IPCB_PrimitivePolyline.md)                  |     | 获取属性状态：线宽                   |
| [getState\_Net()](./IPCB_PrimitivePolyline.md)                        |     | 获取属性状态：网络名称                 |
| [getState\_Polygon()](./IPCB_PrimitivePolyline.md)                    |     | 获取属性状态：单多边形                 |
| [getState\_PrimitiveId()](./IPCB_PrimitivePolyline.md)                |     | 获取属性状态：图元 ID                |
| [getState\_PrimitiveLock()](./IPCB_PrimitivePolyline.md)              |     | 获取属性状态：是否锁定                 |
| [getState\_PrimitiveType()](./IPCB_PrimitivePolyline.md)              |     | 获取属性状态：图元类型                 |
| [isAsync()](./IPCB_PrimitivePolyline.md)                              |     | 查询图元是否为异步图元                 |
| [reset()](./IPCB_PrimitivePolyline.md)                                |     | **_(BETA)_** 将异步图元重置为当前画布状态 |
| [setState\_Layer(layer)](./IPCB_PrimitivePolyline.md)                 |     | **_(BETA)_** 设置属性状态：层       |
| [setState\_LineWidth(lineWidth)](./IPCB_PrimitivePolyline.md)         |     | **_(BETA)_** 设置属性状态：线宽      |
| [setState\_Net(net)](./IPCB_PrimitivePolyline.md)                     |     | **_(BETA)_** 设置属性状态：网络名称    |
| [setState\_Polygon(polygon)](./IPCB_PrimitivePolyline.md)             |     | **_(BETA)_** 设置属性状态：单多边形    |
| [setState\_PrimitiveLock(primitiveLock)](./IPCB_PrimitivePolyline.md) |     | **_(BETA)_** 设置属性状态：是否锁定    |
| [toAsync()](./IPCB_PrimitivePolyline.md)                              |     | 将图元转换为异步图元                  |
| [toSync()](./IPCB_PrimitivePolyline.md)                               |     | 将图元转换为同步图元                  |

---

## 方法详情

### converttofill

# IPCB\_PrimitivePolyline.convertToFill() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

转换到：填充图元

## 签名

```typescript
convertToFill(): Promise<IPCB_PrimitiveFill>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md)&gt;

填充图元对象

### converttopour

# IPCB\_PrimitivePolyline.convertToPour() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

转换到：覆铜边框图元

## 签名

```typescript
convertToPour(): Promise<IPCB_PrimitivePour>;
```


## 返回值

Promise&lt;[IPCB\_PrimitivePour](./IPCB_PrimitivePour.md)&gt;

覆铜边框图元对象

### converttoregion

# IPCB\_PrimitivePolyline.convertToRegion() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

转换到：区域图元

## 签名

```typescript
convertToRegion(): Promise<IPCB_PrimitiveRegion>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveRegion](./IPCB_PrimitiveRegion.md)&gt;

区域图元对象

### done

# IPCB\_PrimitivePolyline.done() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将对图元的更改应用到画布

## 签名

```typescript
done(): Promise<IPCB_PrimitivePolyline>;
```


## 返回值

Promise&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)&gt;

折线图元对象

### getstate_layer

# IPCB\_PrimitivePolyline.getState\_Layer() method

获取属性状态：层

## 签名

```typescript
getState_Layer(): TPCB_LayersOfLine;
```


## 返回值

[TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md)

层

### getstate_linewidth

# IPCB\_PrimitivePolyline.getState\_LineWidth() method

获取属性状态：线宽

## 签名

```typescript
getState_LineWidth(): number;
```


## 返回值

number

线宽

### getstate_net

# IPCB\_PrimitivePolyline.getState\_Net() method

获取属性状态：网络名称

## 签名

```typescript
getState_Net(): string;
```


## 返回值

string

网络名称

### getstate_polygon

# IPCB\_PrimitivePolyline.getState\_Polygon() method

获取属性状态：单多边形

## 签名

```typescript
getState_Polygon(): IPCB_Polygon;
```


## 返回值

[IPCB\_Polygon](./IPCB_Polygon.md)

单多边形

### getstate_primitiveid

# IPCB\_PrimitivePolyline.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivelock

# IPCB\_PrimitivePolyline.getState\_PrimitiveLock() method

获取属性状态：是否锁定

## 签名

```typescript
getState_PrimitiveLock(): boolean;
```


## 返回值

boolean

是否锁定

### getstate_primitivetype

# IPCB\_PrimitivePolyline.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): EPCB_PrimitiveType;
```


## 返回值

[EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md)

图元类型

### isasync

# IPCB\_PrimitivePolyline.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### reset

# IPCB\_PrimitivePolyline.reset() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将异步图元重置为当前画布状态

## 签名

```typescript
reset(): Promise<IPCB_PrimitivePolyline>;
```


## 返回值

Promise&lt;[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)&gt;

折线图元对象

### setstate_layer

# IPCB\_PrimitivePolyline.setState\_Layer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：层

## 签名

```typescript
setState_Layer(layer: TPCB_LayersOfLine): IPCB_PrimitivePolyline;
```

## 参数名

| 参数    | 类型                                                  | 描述  |
| ----- | --------------------------------------------------- | --- |
| layer | [TPCB\_LayersOfLine](../types/TPCB_LayersOfLine.md) | 层   |



## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象

### setstate_linewidth

# IPCB\_PrimitivePolyline.setState\_LineWidth() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：线宽

## 签名

```typescript
setState_LineWidth(lineWidth: number): IPCB_PrimitivePolyline;
```

## 参数名

| 参数        | 类型     | 描述  |
| --------- | ------ | --- |
| lineWidth | number | 线宽  |



## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象

### setstate_net

# IPCB\_PrimitivePolyline.setState\_Net() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：网络名称

## 签名

```typescript
setState_Net(net: string): IPCB_PrimitivePolyline;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| net | string | 网络名称 |



## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象

### setstate_polygon

# IPCB\_PrimitivePolyline.setState\_Polygon() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：单多边形

## 签名

```typescript
setState_Polygon(polygon: IPCB_Polygon): IPCB_PrimitivePolyline;
```

## 参数名

| 参数      | 类型                                 | 描述   |
| ------- | ---------------------------------- | ---- |
| polygon | [IPCB\_Polygon](./IPCB_Polygon.md) | 单多边形 |



## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象

### setstate_primitivelock

# IPCB\_PrimitivePolyline.setState\_PrimitiveLock() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否锁定

## 签名

```typescript
setState_PrimitiveLock(primitiveLock: boolean): IPCB_PrimitivePolyline;
```

## 参数名

| 参数            | 类型      | 描述   |
| ------------- | ------- | ---- |
| primitiveLock | boolean | 是否锁定 |



## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象

### toasync

# IPCB\_PrimitivePolyline.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): IPCB_PrimitivePolyline;
```


## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象

### tosync

# IPCB\_PrimitivePolyline.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): IPCB_PrimitivePolyline;
```


## 返回值

[IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md)

折线图元对象
