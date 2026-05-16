# IPCB\_PrimitiveImage class

图像图元

## 签名

```typescript
declare class IPCB_PrimitiveImage implements IPCB_Primitive
```
**实现自：**[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)

## 备注


## 方法

| 方法名                                                                | 修饰符 | 描述                               |
| ------------------------------------------------------------------ | --- | -------------------------------- |
| [done()](./IPCB_PrimitiveImage.md)                                 |     | **_(BETA)_** 将对图元的更改应用到画布        |
| [getState\_ComplexPolygon()](./IPCB_PrimitiveImage.md)             |     | 获取属性状态：图像源数据（复杂多边形）              |
| [getState\_Height()](./IPCB_PrimitiveImage.md)                     |     | 获取属性状态：高                         |
| [getState\_HorizonMirror()](./IPCB_PrimitiveImage.md)              |     | 获取属性状态：是否水平镜像                    |
| [getState\_Layer()](./IPCB_PrimitiveImage.md)                      |     | 获取属性状态：层                         |
| [getState\_PrimitiveId()](./IPCB_PrimitiveImage.md)                |     | 获取属性状态：图元 ID                     |
| [getState\_PrimitiveLock()](./IPCB_PrimitiveImage.md)              |     | 获取属性状态：是否锁定                      |
| [getState\_PrimitiveType()](./IPCB_PrimitiveImage.md)              |     | 获取属性状态：图元类型                      |
| [getState\_Rotation()](./IPCB_PrimitiveImage.md)                   |     | 获取属性状态：旋转角度                      |
| [getState\_Width()](./IPCB_PrimitiveImage.md)                      |     | 获取属性状态：宽                         |
| [getState\_X()](./IPCB_PrimitiveImage.md)                          |     | 获取属性状态：BBox 左上点坐标 X              |
| [getState\_Y()](./IPCB_PrimitiveImage.md)                          |     | 获取属性状态：BBox 左上点坐标 Y              |
| [isAsync()](./IPCB_PrimitiveImage.md)                              |     | 查询图元是否为异步图元                      |
| [reset()](./IPCB_PrimitiveImage.md)                                |     | **_(BETA)_** 将异步图元重置为当前画布状态      |
| [setState\_Height(height)](./IPCB_PrimitiveImage.md)               |     | **_(BETA)_** 设置属性状态：高            |
| [setState\_HorizonMirror(horizonMirror)](./IPCB_PrimitiveImage.md) |     | **_(BETA)_** 设置属性状态：是否水平镜像       |
| [setState\_Layer(layer)](./IPCB_PrimitiveImage.md)                 |     | **_(BETA)_** 设置属性状态：层            |
| [setState\_PrimitiveLock(primitiveLock)](./IPCB_PrimitiveImage.md) |     | **_(BETA)_** 设置属性状态：是否锁定         |
| [setState\_Rotation(rotation)](./IPCB_PrimitiveImage.md)           |     | **_(BETA)_** 设置属性状态：旋转角度         |
| [setState\_Width(width)](./IPCB_PrimitiveImage.md)                 |     | **_(BETA)_** 设置属性状态：宽            |
| [setState\_X(x)](./IPCB_PrimitiveImage.md)                         |     | **_(BETA)_** 设置属性状态：BBox 左上点坐标 X |
| [setState\_Y(y)](./IPCB_PrimitiveImage.md)                         |     | **_(BETA)_** 设置属性状态：BBox 左上点坐标 Y |
| [toAsync()](./IPCB_PrimitiveImage.md)                              |     | 将图元转换为异步图元                       |
| [toSync()](./IPCB_PrimitiveImage.md)                               |     | 将图元转换为同步图元                       |

---

## 方法详情

### done

# IPCB\_PrimitiveImage.done() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将对图元的更改应用到画布

## 签名

```typescript
done(): Promise<IPCB_PrimitiveImage>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)&gt;

图像图元对象

### getstate_complexpolygon

# IPCB\_PrimitiveImage.getState\_ComplexPolygon() method

获取属性状态：图像源数据（复杂多边形）

## 签名

```typescript
getState_ComplexPolygon(): TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray>;
```


## 返回值

[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt;

图像源数据（复杂多边形）

### getstate_height

# IPCB\_PrimitiveImage.getState\_Height() method

获取属性状态：高

## 签名

```typescript
getState_Height(): number;
```


## 返回值

number

高

### getstate_horizonmirror

# IPCB\_PrimitiveImage.getState\_HorizonMirror() method

获取属性状态：是否水平镜像

## 签名

```typescript
getState_HorizonMirror(): boolean;
```


## 返回值

boolean

是否水平镜像

### getstate_layer

# IPCB\_PrimitiveImage.getState\_Layer() method

获取属性状态：层

## 签名

```typescript
getState_Layer(): TPCB_LayersOfImage;
```


## 返回值

[TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md)

层

### getstate_primitiveid

# IPCB\_PrimitiveImage.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivelock

# IPCB\_PrimitiveImage.getState\_PrimitiveLock() method

获取属性状态：是否锁定

## 签名

```typescript
getState_PrimitiveLock(): boolean;
```


## 返回值

boolean

是否锁定

### getstate_primitivetype

# IPCB\_PrimitiveImage.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): EPCB_PrimitiveType;
```


## 返回值

[EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md)

图元类型

### getstate_rotation

# IPCB\_PrimitiveImage.getState\_Rotation() method

获取属性状态：旋转角度

## 签名

```typescript
getState_Rotation(): number;
```


## 返回值

number

旋转角度

### getstate_width

# IPCB\_PrimitiveImage.getState\_Width() method

获取属性状态：宽

## 签名

```typescript
getState_Width(): number;
```


## 返回值

number

宽

### getstate_x

# IPCB\_PrimitiveImage.getState\_X() method

获取属性状态：BBox 左上点坐标 X

## 签名

```typescript
getState_X(): number;
```


## 返回值

number

BBox 左上点坐标 X

### getstate_y

# IPCB\_PrimitiveImage.getState\_Y() method

获取属性状态：BBox 左上点坐标 Y

## 签名

```typescript
getState_Y(): number;
```


## 返回值

number

BBox 左上点坐标 Y

### isasync

# IPCB\_PrimitiveImage.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### reset

# IPCB\_PrimitiveImage.reset() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将异步图元重置为当前画布状态

## 签名

```typescript
reset(): Promise<IPCB_PrimitiveImage>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)&gt;

图像图元对象

### setstate_height

# IPCB\_PrimitiveImage.setState\_Height() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：高

## 签名

```typescript
setState_Height(height: number): IPCB_PrimitiveImage;
```

## 参数名

| 参数     | 类型     | 描述  |
| ------ | ------ | --- |
| height | number | 高   |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_horizonmirror

# IPCB\_PrimitiveImage.setState\_HorizonMirror() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否水平镜像

## 签名

```typescript
setState_HorizonMirror(horizonMirror: boolean): IPCB_PrimitiveImage;
```

## 参数名

| 参数            | 类型      | 描述     |
| ------------- | ------- | ------ |
| horizonMirror | boolean | 是否水平镜像 |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_layer

# IPCB\_PrimitiveImage.setState\_Layer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：层

## 签名

```typescript
setState_Layer(layer: TPCB_LayersOfImage): IPCB_PrimitiveImage;
```

## 参数名

| 参数    | 类型                                                    | 描述  |
| ----- | ----------------------------------------------------- | --- |
| layer | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md) | 层   |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_primitivelock

# IPCB\_PrimitiveImage.setState\_PrimitiveLock() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否锁定

## 签名

```typescript
setState_PrimitiveLock(primitiveLock: boolean): IPCB_PrimitiveImage;
```

## 参数名

| 参数            | 类型      | 描述   |
| ------------- | ------- | ---- |
| primitiveLock | boolean | 是否锁定 |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_rotation

# IPCB\_PrimitiveImage.setState\_Rotation() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：旋转角度

## 签名

```typescript
setState_Rotation(rotation: number): IPCB_PrimitiveImage;
```

## 参数名

| 参数       | 类型     | 描述   |
| -------- | ------ | ---- |
| rotation | number | 旋转角度 |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_width

# IPCB\_PrimitiveImage.setState\_Width() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：宽

## 签名

```typescript
setState_Width(width: number): IPCB_PrimitiveImage;
```

## 参数名

| 参数    | 类型     | 描述  |
| ----- | ------ | --- |
| width | number | 宽   |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_x

# IPCB\_PrimitiveImage.setState\_X() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：BBox 左上点坐标 X

## 签名

```typescript
setState_X(x: number): IPCB_PrimitiveImage;
```

## 参数名

| 参数  | 类型     | 描述           |
| --- | ------ | ------------ |
| x   | number | BBox 左上点坐标 X |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### setstate_y

# IPCB\_PrimitiveImage.setState\_Y() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：BBox 左上点坐标 Y

## 签名

```typescript
setState_Y(y: number): IPCB_PrimitiveImage;
```

## 参数名

| 参数  | 类型     | 描述           |
| --- | ------ | ------------ |
| y   | number | BBox 左上点坐标 Y |



## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### toasync

# IPCB\_PrimitiveImage.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): IPCB_PrimitiveImage;
```


## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象

### tosync

# IPCB\_PrimitiveImage.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): IPCB_PrimitiveImage;
```


## 返回值

[IPCB\_PrimitiveImage](./IPCB_PrimitiveImage.md)

图像图元对象
