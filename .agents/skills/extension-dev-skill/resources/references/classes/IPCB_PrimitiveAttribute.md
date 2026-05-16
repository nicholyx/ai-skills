# IPCB\_PrimitiveAttribute class

属性图元

## 签名

```typescript
declare class IPCB_PrimitiveAttribute implements IPCB_Primitive
```
**实现自：**[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)

## Constructors

| Constructor                                                                                                                                                                                                                       | 修饰符 | 描述                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------------------- |
| [(constructor)(layer, x, y, key, value, keyVisible, valueVisible, fontFamily, fontSize, lineWidth, alignMode, rotation, reverse, expansion, mirror, primitiveLock, primitiveId, parentPrimitiveId)](./IPCB_PrimitiveAttribute.md) |     | Constructs a new instance of the `IPCB_PrimitiveAttribute` class |

## 方法

| 方法名                                                                    | 修饰符 | 描述                             |
| ---------------------------------------------------------------------- | --- | ------------------------------ |
| [getState\_AlignMode()](./IPCB_PrimitiveAttribute.md)                  |     | 获取属性状态：对齐模式                    |
| [getState\_Expansion()](./IPCB_PrimitiveAttribute.md)                  |     | 获取属性状态：反相扩展                    |
| [getState\_FontFamily()](./IPCB_PrimitiveAttribute.md)                 |     | 获取属性状态：字体                      |
| [getState\_FontSize()](./IPCB_PrimitiveAttribute.md)                   |     | 获取属性状态：字号                      |
| [getState\_Key()](./IPCB_PrimitiveAttribute.md)                        |     | 获取属性状态：Key                     |
| [getState\_KeyVisible()](./IPCB_PrimitiveAttribute.md)                 |     | 获取属性状态：Key 是否可见                |
| [getState\_Layer()](./IPCB_PrimitiveAttribute.md)                      |     | 获取属性状态：层                       |
| [getState\_LineWidth()](./IPCB_PrimitiveAttribute.md)                  |     | 获取属性状态：线宽                      |
| [getState\_Mirror()](./IPCB_PrimitiveAttribute.md)                     |     | 获取属性状态：是否镜像                    |
| [getState\_ParentPrimitiveId()](./IPCB_PrimitiveAttribute.md)          |     | 获取属性状态：关联的父图元 ID               |
| [getState\_PrimitiveId()](./IPCB_PrimitiveAttribute.md)                |     | 获取属性状态：图元 ID                   |
| [getState\_PrimitiveLock()](./IPCB_PrimitiveAttribute.md)              |     | 获取属性状态：是否锁定                    |
| [getState\_PrimitiveType()](./IPCB_PrimitiveAttribute.md)              |     | 获取属性状态：图元类型                    |
| [getState\_Reverse()](./IPCB_PrimitiveAttribute.md)                    |     | 获取属性状态：是否反相                    |
| [getState\_Rotation()](./IPCB_PrimitiveAttribute.md)                   |     | 获取属性状态：旋转角度                    |
| [getState\_Value()](./IPCB_PrimitiveAttribute.md)                      |     | 获取属性状态：Value                   |
| [getState\_ValueVisible()](./IPCB_PrimitiveAttribute.md)               |     | 获取属性状态：Value 是否可见              |
| [getState\_X()](./IPCB_PrimitiveAttribute.md)                          |     | 获取属性状态：坐标 X                    |
| [getState\_Y()](./IPCB_PrimitiveAttribute.md)                          |     | 获取属性状态：坐标 Y                    |
| [isAsync()](./IPCB_PrimitiveAttribute.md)                              |     | 查询图元是否为异步图元                    |
| [setState\_AlignMode(alignMode)](./IPCB_PrimitiveAttribute.md)         |     | **_(BETA)_** 设置属性状态：对齐模式       |
| [setState\_Expansion(expansion)](./IPCB_PrimitiveAttribute.md)         |     | **_(BETA)_** 设置属性状态：反相扩展       |
| [setState\_FontFamily(fontFamily)](./IPCB_PrimitiveAttribute.md)       |     | **_(BETA)_** 设置属性状态：字体         |
| [setState\_FontSize(fontSize)](./IPCB_PrimitiveAttribute.md)           |     | **_(BETA)_** 设置属性状态：字号         |
| [setState\_Key(key)](./IPCB_PrimitiveAttribute.md)                     |     | **_(BETA)_** 设置属性状态：Key        |
| [setState\_KeyVisible(keyVisible)](./IPCB_PrimitiveAttribute.md)       |     | **_(BETA)_** 设置属性状态：Key 是否可见   |
| [setState\_Layer(layer)](./IPCB_PrimitiveAttribute.md)                 |     | **_(BETA)_** 设置属性状态：层          |
| [setState\_LineWidth(lineWidth)](./IPCB_PrimitiveAttribute.md)         |     | **_(BETA)_** 设置属性状态：线宽         |
| [setState\_Mirror(mirror)](./IPCB_PrimitiveAttribute.md)               |     | **_(BETA)_** 设置属性状态：是否镜像       |
| [setState\_PrimitiveLock(primitiveLock)](./IPCB_PrimitiveAttribute.md) |     | **_(BETA)_** 设置属性状态：是否锁定       |
| [setState\_Reverse(reverse)](./IPCB_PrimitiveAttribute.md)             |     | **_(BETA)_** 设置属性状态：是否反相       |
| [setState\_Rotation(rotation)](./IPCB_PrimitiveAttribute.md)           |     | **_(BETA)_** 设置属性状态：旋转角度       |
| [setState\_Value(value)](./IPCB_PrimitiveAttribute.md)                 |     | **_(BETA)_** 设置属性状态：Value      |
| [setState\_ValueVisible(valueVisible)](./IPCB_PrimitiveAttribute.md)   |     | **_(BETA)_** 设置属性状态：Value 是否可见 |
| [setState\_X(x)](./IPCB_PrimitiveAttribute.md)                         |     | **_(BETA)_** 设置属性状态：坐标 X       |
| [setState\_Y(y)](./IPCB_PrimitiveAttribute.md)                         |     | **_(BETA)_** 设置属性状态：坐标 Y       |
| [toAsync()](./IPCB_PrimitiveAttribute.md)                              |     | 将图元转换为异步图元                     |
| [toSync()](./IPCB_PrimitiveAttribute.md)                               |     | 将图元转换为同步图元                     |

---

## 构造函数详情

### _constructor_

# IPCB\_PrimitiveAttribute.(constructor)

Constructs a new instance of the `IPCB_PrimitiveAttribute` class

## 签名

```typescript
constructor(layer: TPCB_LayersOfImage, x: number | null, y: number | null, key: string, value: string, keyVisible: boolean, valueVisible: boolean, fontFamily: string, fontSize: number, lineWidth: number, alignMode: EPCB_PrimitiveStringAlignMode, rotation: number, reverse: boolean, expansion: number, mirror: boolean, primitiveLock: boolean, primitiveId: string, parentPrimitiveId: string);
```

## 参数名

| 参数                | 类型                                                                          | 描述  |
| ----------------- | --------------------------------------------------------------------------- | --- |
| layer             | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md)                       |     |
| x                 | number \| null                                                              |     |
| y                 | number \| null                                                              |     |
| key               | string                                                                      |     |
| value             | string                                                                      |     |
| keyVisible        | boolean                                                                     |     |
| valueVisible      | boolean                                                                     |     |
| fontFamily        | string                                                                      |     |
| fontSize          | number                                                                      |     |
| lineWidth         | number                                                                      |     |
| alignMode         | [EPCB\_PrimitiveStringAlignMode](../enums/EPCB_PrimitiveStringAlignMode.md) |     |
| rotation          | number                                                                      |     |
| reverse           | boolean                                                                     |     |
| expansion         | number                                                                      |     |
| mirror            | boolean                                                                     |     |
| primitiveLock     | boolean                                                                     |     |
| primitiveId       | string                                                                      |     |
| parentPrimitiveId | string                                                                      |     |


---

## 方法详情

### getstate_alignmode

# IPCB\_PrimitiveAttribute.getState\_AlignMode() method

获取属性状态：对齐模式

## 签名

```typescript
getState_AlignMode(): EPCB_PrimitiveStringAlignMode;
```


## 返回值

[EPCB\_PrimitiveStringAlignMode](../enums/EPCB_PrimitiveStringAlignMode.md)

对齐模式

### getstate_expansion

# IPCB\_PrimitiveAttribute.getState\_Expansion() method

获取属性状态：反相扩展

## 签名

```typescript
getState_Expansion(): number;
```


## 返回值

number

反相扩展

### getstate_fontfamily

# IPCB\_PrimitiveAttribute.getState\_FontFamily() method

获取属性状态：字体

## 签名

```typescript
getState_FontFamily(): string;
```


## 返回值

string

字体

### getstate_fontsize

# IPCB\_PrimitiveAttribute.getState\_FontSize() method

获取属性状态：字号

## 签名

```typescript
getState_FontSize(): number;
```


## 返回值

number

字号

### getstate_key

# IPCB\_PrimitiveAttribute.getState\_Key() method

获取属性状态：Key

## 签名

```typescript
getState_Key(): string;
```


## 返回值

string

Key

### getstate_keyvisible

# IPCB\_PrimitiveAttribute.getState\_KeyVisible() method

获取属性状态：Key 是否可见

## 签名

```typescript
getState_KeyVisible(): boolean;
```


## 返回值

boolean

Key 是否可见

### getstate_layer

# IPCB\_PrimitiveAttribute.getState\_Layer() method

获取属性状态：层

## 签名

```typescript
getState_Layer(): TPCB_LayersOfImage;
```


## 返回值

[TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md)

层

### getstate_linewidth

# IPCB\_PrimitiveAttribute.getState\_LineWidth() method

获取属性状态：线宽

## 签名

```typescript
getState_LineWidth(): number;
```


## 返回值

number

线宽

### getstate_mirror

# IPCB\_PrimitiveAttribute.getState\_Mirror() method

获取属性状态：是否镜像

## 签名

```typescript
getState_Mirror(): boolean;
```


## 返回值

boolean

是否镜像

### getstate_parentprimitiveid

# IPCB\_PrimitiveAttribute.getState\_ParentPrimitiveId() method

获取属性状态：关联的父图元 ID

## 签名

```typescript
getState_ParentPrimitiveId(): string;
```


## 返回值

string

关联的父图元 ID

### getstate_primitiveid

# IPCB\_PrimitiveAttribute.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivelock

# IPCB\_PrimitiveAttribute.getState\_PrimitiveLock() method

获取属性状态：是否锁定

## 签名

```typescript
getState_PrimitiveLock(): boolean;
```


## 返回值

boolean

是否锁定

### getstate_primitivetype

# IPCB\_PrimitiveAttribute.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): EPCB_PrimitiveType;
```


## 返回值

[EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md)

图元类型

### getstate_reverse

# IPCB\_PrimitiveAttribute.getState\_Reverse() method

获取属性状态：是否反相

## 签名

```typescript
getState_Reverse(): boolean;
```


## 返回值

boolean

是否反相

### getstate_rotation

# IPCB\_PrimitiveAttribute.getState\_Rotation() method

获取属性状态：旋转角度

## 签名

```typescript
getState_Rotation(): number;
```


## 返回值

number

旋转角度

### getstate_value

# IPCB\_PrimitiveAttribute.getState\_Value() method

获取属性状态：Value

## 签名

```typescript
getState_Value(): string;
```


## 返回值

string

值

### getstate_valuevisible

# IPCB\_PrimitiveAttribute.getState\_ValueVisible() method

获取属性状态：Value 是否可见

## 签名

```typescript
getState_ValueVisible(): boolean;
```


## 返回值

boolean

Value 是否可见

### getstate_x

# IPCB\_PrimitiveAttribute.getState\_X() method

获取属性状态：坐标 X

## 签名

```typescript
getState_X(): number | null;
```


## 返回值

number \| null

坐标 X

### getstate_y

# IPCB\_PrimitiveAttribute.getState\_Y() method

获取属性状态：坐标 Y

## 签名

```typescript
getState_Y(): number | null;
```


## 返回值

number \| null

坐标 Y

### isasync

# IPCB\_PrimitiveAttribute.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### setstate_alignmode

# IPCB\_PrimitiveAttribute.setState\_AlignMode() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：对齐模式

## 签名

```typescript
setState_AlignMode(alignMode: EPCB_PrimitiveStringAlignMode): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数        | 类型                                                                          | 描述   |
| --------- | --------------------------------------------------------------------------- | ---- |
| alignMode | [EPCB\_PrimitiveStringAlignMode](../enums/EPCB_PrimitiveStringAlignMode.md) | 对齐模式 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_expansion

# IPCB\_PrimitiveAttribute.setState\_Expansion() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：反相扩展

## 签名

```typescript
setState_Expansion(expansion: number): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数        | 类型     | 描述   |
| --------- | ------ | ---- |
| expansion | number | 反相扩展 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_fontfamily

# IPCB\_PrimitiveAttribute.setState\_FontFamily() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：字体

## 签名

```typescript
setState_FontFamily(fontFamily: string): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数         | 类型     | 描述  |
| ---------- | ------ | --- |
| fontFamily | string | 字体  |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_fontsize

# IPCB\_PrimitiveAttribute.setState\_FontSize() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：字号

## 签名

```typescript
setState_FontSize(fontSize: number): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数       | 类型     | 描述  |
| -------- | ------ | --- |
| fontSize | number | 字号  |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_key

# IPCB\_PrimitiveAttribute.setState\_Key() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：Key

## 签名

```typescript
setState_Key(key: string): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| key | string | Key |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_keyvisible

# IPCB\_PrimitiveAttribute.setState\_KeyVisible() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：Key 是否可见

## 签名

```typescript
setState_KeyVisible(keyVisible: boolean): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数         | 类型      | 描述       |
| ---------- | ------- | -------- |
| keyVisible | boolean | Key 是否可见 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_layer

# IPCB\_PrimitiveAttribute.setState\_Layer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：层

## 签名

```typescript
setState_Layer(layer: TPCB_LayersOfImage): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数    | 类型                                                    | 描述  |
| ----- | ----------------------------------------------------- | --- |
| layer | [TPCB\_LayersOfImage](../types/TPCB_LayersOfImage.md) | 层   |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_linewidth

# IPCB\_PrimitiveAttribute.setState\_LineWidth() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：线宽

## 签名

```typescript
setState_LineWidth(lineWidth: number): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数        | 类型     | 描述  |
| --------- | ------ | --- |
| lineWidth | number | 线宽  |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_mirror

# IPCB\_PrimitiveAttribute.setState\_Mirror() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否镜像

## 签名

```typescript
setState_Mirror(mirror: boolean): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数     | 类型      | 描述   |
| ------ | ------- | ---- |
| mirror | boolean | 是否镜像 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_primitivelock

# IPCB\_PrimitiveAttribute.setState\_PrimitiveLock() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否锁定

## 签名

```typescript
setState_PrimitiveLock(primitiveLock: boolean): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数            | 类型      | 描述   |
| ------------- | ------- | ---- |
| primitiveLock | boolean | 是否锁定 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_reverse

# IPCB\_PrimitiveAttribute.setState\_Reverse() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否反相

## 签名

```typescript
setState_Reverse(reverse: boolean): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数      | 类型      | 描述   |
| ------- | ------- | ---- |
| reverse | boolean | 是否反相 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_rotation

# IPCB\_PrimitiveAttribute.setState\_Rotation() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：旋转角度

## 签名

```typescript
setState_Rotation(rotation: number): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数       | 类型     | 描述   |
| -------- | ------ | ---- |
| rotation | number | 旋转角度 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_value

# IPCB\_PrimitiveAttribute.setState\_Value() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：Value

## 签名

```typescript
setState_Value(value: string): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数    | 类型     | 描述  |
| ----- | ------ | --- |
| value | string | 值   |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_valuevisible

# IPCB\_PrimitiveAttribute.setState\_ValueVisible() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：Value 是否可见

## 签名

```typescript
setState_ValueVisible(valueVisible: boolean): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数           | 类型      | 描述         |
| ------------ | ------- | ---------- |
| valueVisible | boolean | Value 是否可见 |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_x

# IPCB\_PrimitiveAttribute.setState\_X() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 X

## 签名

```typescript
setState_X(x: number): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| x   | number | 坐标 X |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### setstate_y

# IPCB\_PrimitiveAttribute.setState\_Y() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 Y

## 签名

```typescript
setState_Y(y: number): IPCB_PrimitiveAttribute;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| y   | number | 坐标 Y |



## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### toasync

# IPCB\_PrimitiveAttribute.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): IPCB_PrimitiveAttribute;
```


## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象

### tosync

# IPCB\_PrimitiveAttribute.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): IPCB_PrimitiveAttribute;
```


## 返回值

[IPCB\_PrimitiveAttribute](./IPCB_PrimitiveAttribute.md)

属性图元对象
