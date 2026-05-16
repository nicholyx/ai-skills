# IPCB\_PrimitiveString class

文本图元

## 签名

```typescript
declare class IPCB_PrimitiveString implements IPCB_Primitive
```
**实现自：**[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)

## Constructors

| Constructor                                                                                                                                                                 | 修饰符 | 描述                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------- |
| [(constructor)(layer, x, y, text, fontFamily, fontSize, lineWidth, alignMode, rotation, reverse, expansion, mirror, primitiveLock, primitiveId)](./IPCB_PrimitiveString.md) |     | Constructs a new instance of the `IPCB_PrimitiveString` class |

## 方法

| 方法名                                                                 | 修饰符 | 描述                       |
| ------------------------------------------------------------------- | --- | ------------------------ |
| [getState\_AlignMode()](./IPCB_PrimitiveString.md)                  |     | 获取属性状态：对齐模式              |
| [getState\_Expansion()](./IPCB_PrimitiveString.md)                  |     | 获取属性状态：反相扩展              |
| [getState\_FontFamily()](./IPCB_PrimitiveString.md)                 |     | 获取属性状态：字体                |
| [getState\_FontSize()](./IPCB_PrimitiveString.md)                   |     | 获取属性状态：字号                |
| [getState\_Layer()](./IPCB_PrimitiveString.md)                      |     | 获取属性状态：层                 |
| [getState\_LineWidth()](./IPCB_PrimitiveString.md)                  |     | 获取属性状态：线宽                |
| [getState\_Mirror()](./IPCB_PrimitiveString.md)                     |     | 获取属性状态：是否镜像              |
| [getState\_PrimitiveId()](./IPCB_PrimitiveString.md)                |     | 获取属性状态：图元 ID             |
| [getState\_PrimitiveLock()](./IPCB_PrimitiveString.md)              |     | 获取属性状态：是否锁定              |
| [getState\_PrimitiveType()](./IPCB_PrimitiveString.md)              |     | 获取属性状态：图元类型              |
| [getState\_Reverse()](./IPCB_PrimitiveString.md)                    |     | 获取属性状态：是否反相              |
| [getState\_Rotation()](./IPCB_PrimitiveString.md)                   |     | 获取属性状态：旋转角度              |
| [getState\_Text()](./IPCB_PrimitiveString.md)                       |     | 获取属性状态：文本内容              |
| [getState\_X()](./IPCB_PrimitiveString.md)                          |     | 获取属性状态：坐标 X              |
| [getState\_Y()](./IPCB_PrimitiveString.md)                          |     | 获取属性状态：坐标 Y              |
| [isAsync()](./IPCB_PrimitiveString.md)                              |     | 查询图元是否为异步图元              |
| [setState\_AlignMode(alignMode)](./IPCB_PrimitiveString.md)         |     | **_(BETA)_** 设置属性状态：对齐模式 |
| [setState\_Expansion(expansion)](./IPCB_PrimitiveString.md)         |     | **_(BETA)_** 设置属性状态：反相扩展 |
| [setState\_FontFamily(fontFamily)](./IPCB_PrimitiveString.md)       |     | **_(BETA)_** 设置属性状态：字体   |
| [setState\_FontSize(fontSize)](./IPCB_PrimitiveString.md)           |     | **_(BETA)_** 设置属性状态：字号   |
| [setState\_Layer(layer)](./IPCB_PrimitiveString.md)                 |     | **_(BETA)_** 设置属性状态：层    |
| [setState\_LineWidth(lineWidth)](./IPCB_PrimitiveString.md)         |     | **_(BETA)_** 设置属性状态：线宽   |
| [setState\_Mirror(mirror)](./IPCB_PrimitiveString.md)               |     | **_(BETA)_** 设置属性状态：是否镜像 |
| [setState\_PrimitiveLock(primitiveLock)](./IPCB_PrimitiveString.md) |     | **_(BETA)_** 设置属性状态：是否锁定 |
| [setState\_Reverse(reverse)](./IPCB_PrimitiveString.md)             |     | **_(BETA)_** 设置属性状态：是否反相 |
| [setState\_Rotation(rotation)](./IPCB_PrimitiveString.md)           |     | **_(BETA)_** 设置属性状态：旋转角度 |
| [setState\_Text(text)](./IPCB_PrimitiveString.md)                   |     | **_(BETA)_** 设置属性状态：文本内容 |
| [setState\_X(x)](./IPCB_PrimitiveString.md)                         |     | **_(BETA)_** 设置属性状态：坐标 X |
| [setState\_Y(y)](./IPCB_PrimitiveString.md)                         |     | **_(BETA)_** 设置属性状态：坐标 Y |
| [toAsync()](./IPCB_PrimitiveString.md)                              |     | 将图元转换为异步图元               |
| [toSync()](./IPCB_PrimitiveString.md)                               |     | 将图元转换为同步图元               |

---

## 构造函数详情

### _constructor_

# IPCB\_PrimitiveString.(constructor)

Constructs a new instance of the `IPCB_PrimitiveString` class

## 签名

```typescript
constructor(layer: TPCB_LayersOfImage, x: number, y: number, text: string, fontFamily?: string, fontSize?: number, lineWidth?: number, alignMode?: EPCB_PrimitiveStringAlignMode, rotation?: number, reverse?: boolean, expansion?: number, mirror?: boolean, primitiveLock?: boolean, primitiveId?: string);
```

## 参数名

| 参数            | 类型                                                                          | 描述           |
| ------------- | --------------------------------------------------------------------------- | ------------ |
| layer         | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md)                       |              |
| x             | number                                                                      |              |
| y             | number                                                                      |              |
| text          | string                                                                      |              |
| fontFamily    | string                                                                      | _(Optional)_ |
| fontSize      | number                                                                      | _(Optional)_ |
| lineWidth     | number                                                                      | _(Optional)_ |
| alignMode     | [EPCB\_PrimitiveStringAlignMode](../enums/EPCB_PrimitiveStringAlignMode.md) | _(Optional)_ |
| rotation      | number                                                                      | _(Optional)_ |
| reverse       | boolean                                                                     | _(Optional)_ |
| expansion     | number                                                                      | _(Optional)_ |
| mirror        | boolean                                                                     | _(Optional)_ |
| primitiveLock | boolean                                                                     | _(Optional)_ |
| primitiveId   | string                                                                      | _(Optional)_ |


---

## 方法详情

### getstate_alignmode

# IPCB\_PrimitiveString.getState\_AlignMode() method

获取属性状态：对齐模式

## 签名

```typescript
getState_AlignMode(): EPCB_PrimitiveStringAlignMode;
```


## 返回值

[EPCB\_PrimitiveStringAlignMode](../enums/EPCB_PrimitiveStringAlignMode.md)

对齐模式

### getstate_expansion

# IPCB\_PrimitiveString.getState\_Expansion() method

获取属性状态：反相扩展

## 签名

```typescript
getState_Expansion(): number;
```


## 返回值

number

反相扩展

### getstate_fontfamily

# IPCB\_PrimitiveString.getState\_FontFamily() method

获取属性状态：字体

## 签名

```typescript
getState_FontFamily(): string;
```


## 返回值

string

字体

### getstate_fontsize

# IPCB\_PrimitiveString.getState\_FontSize() method

获取属性状态：字号

## 签名

```typescript
getState_FontSize(): number;
```


## 返回值

number

字号

### getstate_layer

# IPCB\_PrimitiveString.getState\_Layer() method

获取属性状态：层

## 签名

```typescript
getState_Layer(): TPCB_LayersOfImage;
```


## 返回值

[TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md)

层

### getstate_linewidth

# IPCB\_PrimitiveString.getState\_LineWidth() method

获取属性状态：线宽

## 签名

```typescript
getState_LineWidth(): number;
```


## 返回值

number

线宽

### getstate_mirror

# IPCB\_PrimitiveString.getState\_Mirror() method

获取属性状态：是否镜像

## 签名

```typescript
getState_Mirror(): boolean;
```


## 返回值

boolean

是否镜像

### getstate_primitiveid

# IPCB\_PrimitiveString.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivelock

# IPCB\_PrimitiveString.getState\_PrimitiveLock() method

获取属性状态：是否锁定

## 签名

```typescript
getState_PrimitiveLock(): boolean;
```


## 返回值

boolean

是否锁定

### getstate_primitivetype

# IPCB\_PrimitiveString.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): EPCB_PrimitiveType;
```


## 返回值

[EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md)

图元类型

### getstate_reverse

# IPCB\_PrimitiveString.getState\_Reverse() method

获取属性状态：是否反相

## 签名

```typescript
getState_Reverse(): boolean;
```


## 返回值

boolean

是否反相

### getstate_rotation

# IPCB\_PrimitiveString.getState\_Rotation() method

获取属性状态：旋转角度

## 签名

```typescript
getState_Rotation(): number;
```


## 返回值

number

旋转角度

### getstate_text

# IPCB\_PrimitiveString.getState\_Text() method

获取属性状态：文本内容

## 签名

```typescript
getState_Text(): string;
```


## 返回值

string

文本内容

### getstate_x

# IPCB\_PrimitiveString.getState\_X() method

获取属性状态：坐标 X

## 签名

```typescript
getState_X(): number;
```


## 返回值

number

坐标 X

### getstate_y

# IPCB\_PrimitiveString.getState\_Y() method

获取属性状态：坐标 Y

## 签名

```typescript
getState_Y(): number;
```


## 返回值

number

坐标 Y

### isasync

# IPCB\_PrimitiveString.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### setstate_alignmode

# IPCB\_PrimitiveString.setState\_AlignMode() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：对齐模式

## 签名

```typescript
setState_AlignMode(alignMode: EPCB_PrimitiveStringAlignMode): IPCB_PrimitiveString;
```

## 参数名

| 参数        | 类型                                                                          | 描述   |
| --------- | --------------------------------------------------------------------------- | ---- |
| alignMode | [EPCB\_PrimitiveStringAlignMode](../enums/EPCB_PrimitiveStringAlignMode.md) | 对齐模式 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_expansion

# IPCB\_PrimitiveString.setState\_Expansion() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：反相扩展

## 签名

```typescript
setState_Expansion(expansion: number): IPCB_PrimitiveString;
```

## 参数名

| 参数        | 类型     | 描述   |
| --------- | ------ | ---- |
| expansion | number | 反相扩展 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_fontfamily

# IPCB\_PrimitiveString.setState\_FontFamily() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：字体

## 签名

```typescript
setState_FontFamily(fontFamily: string): IPCB_PrimitiveString;
```

## 参数名

| 参数         | 类型     | 描述  |
| ---------- | ------ | --- |
| fontFamily | string | 字体  |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_fontsize

# IPCB\_PrimitiveString.setState\_FontSize() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：字号

## 签名

```typescript
setState_FontSize(fontSize: number): IPCB_PrimitiveString;
```

## 参数名

| 参数       | 类型     | 描述  |
| -------- | ------ | --- |
| fontSize | number | 字号  |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_layer

# IPCB\_PrimitiveString.setState\_Layer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：层

## 签名

```typescript
setState_Layer(layer: TPCB_LayersOfImage): IPCB_PrimitiveString;
```

## 参数名

| 参数    | 类型                                                    | 描述  |
| ----- | ----------------------------------------------------- | --- |
| layer | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md) | 层   |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_linewidth

# IPCB\_PrimitiveString.setState\_LineWidth() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：线宽

## 签名

```typescript
setState_LineWidth(lineWidth: number): IPCB_PrimitiveString;
```

## 参数名

| 参数        | 类型     | 描述  |
| --------- | ------ | --- |
| lineWidth | number | 线宽  |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_mirror

# IPCB\_PrimitiveString.setState\_Mirror() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否镜像

## 签名

```typescript
setState_Mirror(mirror: boolean): IPCB_PrimitiveString;
```

## 参数名

| 参数     | 类型      | 描述   |
| ------ | ------- | ---- |
| mirror | boolean | 是否镜像 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_primitivelock

# IPCB\_PrimitiveString.setState\_PrimitiveLock() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否锁定

## 签名

```typescript
setState_PrimitiveLock(primitiveLock: boolean): IPCB_PrimitiveString;
```

## 参数名

| 参数            | 类型      | 描述   |
| ------------- | ------- | ---- |
| primitiveLock | boolean | 是否锁定 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_reverse

# IPCB\_PrimitiveString.setState\_Reverse() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否反相

## 签名

```typescript
setState_Reverse(reverse: boolean): IPCB_PrimitiveString;
```

## 参数名

| 参数      | 类型      | 描述   |
| ------- | ------- | ---- |
| reverse | boolean | 是否反相 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_rotation

# IPCB\_PrimitiveString.setState\_Rotation() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：旋转角度

## 签名

```typescript
setState_Rotation(rotation: number): IPCB_PrimitiveString;
```

## 参数名

| 参数       | 类型     | 描述   |
| -------- | ------ | ---- |
| rotation | number | 旋转角度 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_text

# IPCB\_PrimitiveString.setState\_Text() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：文本内容

## 签名

```typescript
setState_Text(text: string): IPCB_PrimitiveString;
```

## 参数名

| 参数   | 类型     | 描述   |
| ---- | ------ | ---- |
| text | string | 文本内容 |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_x

# IPCB\_PrimitiveString.setState\_X() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 X

## 签名

```typescript
setState_X(x: number): IPCB_PrimitiveString;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| x   | number | 坐标 X |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### setstate_y

# IPCB\_PrimitiveString.setState\_Y() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 Y

## 签名

```typescript
setState_Y(y: number): IPCB_PrimitiveString;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| y   | number | 坐标 Y |



## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### toasync

# IPCB\_PrimitiveString.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): IPCB_PrimitiveString;
```


## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象

### tosync

# IPCB\_PrimitiveString.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): IPCB_PrimitiveString;
```


## 返回值

[IPCB\_PrimitiveString](./IPCB_PrimitiveString.md)

文本图元对象
