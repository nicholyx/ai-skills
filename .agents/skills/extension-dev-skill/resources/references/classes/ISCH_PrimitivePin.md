# ISCH\_PrimitivePin class

引脚图元

## 签名

```typescript
declare class ISCH_PrimitivePin implements ISCH_Primitive
```
**实现自：**[ISCH\_Primitive](../interfaces/ISCH_Primitive.md)

## 备注

引脚图元仅符号编辑器可用，在原理图图页内，关联到符号的引脚被称为 [器件引脚图元](./ISCH_PrimitiveComponentPin.md)


## 属性

| 属性名                                     | 修饰符                       | 类型                                                            | 描述           |
| --------------------------------------- | ------------------------- | ------------------------------------------------------------- | ------------ |
| [async](./ISCH_PrimitivePin.md)         | `protected`               | boolean                                                       | 异步           |
| [pinColor](./ISCH_PrimitivePin.md)      | `protected`               | string \| null                                                | 引脚颜色         |
| [pinLength](./ISCH_PrimitivePin.md)     | `protected`               | number                                                        | 引脚长度         |
| [pinName](./ISCH_PrimitivePin.md)       | `protected`               | string                                                        | 引脚名称         |
| [pinNumber](./ISCH_PrimitivePin.md)     | `protected`               | string                                                        | 引脚编号         |
| [pinShape](./ISCH_PrimitivePin.md)      | `protected`               | [ESCH\_PrimitivePinShape](../enums/ESCH_PrimitivePinShape.md) | 引脚形状         |
| [pinType](./ISCH_PrimitivePin.md)       | `protected`               | [ESCH\_PrimitivePinType](../enums/ESCH_PrimitivePinType.md)   | 引脚类型         |
| [primitiveId?](./ISCH_PrimitivePin.md)  | `protected`               | string                                                        | _（可选）_ 图元 ID |
| [primitiveType](./ISCH_PrimitivePin.md) | `protected` `readonly` | [ESCH\_PrimitiveType](../enums/ESCH_PrimitiveType.md)         | 图元类型         |
| [rotation](./ISCH_PrimitivePin.md)      | `protected`               | number                                                        | 旋转角度         |
| [x](./ISCH_PrimitivePin.md)             | `protected`               | number                                                        | 坐标 X         |
| [y](./ISCH_PrimitivePin.md)             | `protected`               | number                                                        | 坐标 Y         |

## 方法

| 方法名                                                              | 修饰符 | 描述                          |
| ---------------------------------------------------------------- | --- | --------------------------- |
| [done()](./ISCH_PrimitivePin.md)                                 |     | **_(BETA)_** 将对图元的更改应用到画布   |
| [getState\_OtherProperty()](./ISCH_PrimitivePin.md)              |     | 获取属性状态：其它参数                 |
| [getState\_PinColor()](./ISCH_PrimitivePin.md)                   |     | 获取属性状态：引脚颜色                 |
| [getState\_PinLength()](./ISCH_PrimitivePin.md)                  |     | 获取属性状态：引脚长度                 |
| [getState\_PinName()](./ISCH_PrimitivePin.md)                    |     | 获取属性状态：引脚名称                 |
| [getState\_PinNumber()](./ISCH_PrimitivePin.md)                  |     | 获取属性状态：引脚编号                 |
| [getState\_PinShape()](./ISCH_PrimitivePin.md)                   |     | 获取属性状态：引脚形状                 |
| [getState\_pinType()](./ISCH_PrimitivePin.md)                    |     | 获取属性状态：引脚类型                 |
| [getState\_PrimitiveId()](./ISCH_PrimitivePin.md)                |     | 获取属性状态：图元 ID                |
| [getState\_PrimitiveType()](./ISCH_PrimitivePin.md)              |     | 获取属性状态：图元类型                 |
| [getState\_Rotation()](./ISCH_PrimitivePin.md)                   |     | 获取属性状态：旋转角度                 |
| [getState\_X()](./ISCH_PrimitivePin.md)                          |     | 获取属性状态：坐标 X                 |
| [getState\_Y()](./ISCH_PrimitivePin.md)                          |     | 获取属性状态：坐标 Y                 |
| [isAsync()](./ISCH_PrimitivePin.md)                              |     | 查询图元是否为异步图元                 |
| [reset()](./ISCH_PrimitivePin.md)                                |     | **_(BETA)_** 将异步图元重置为当前画布状态 |
| [setState\_OtherProperty(otherProperty)](./ISCH_PrimitivePin.md) |     | **_(BETA)_** 设置属性状态：其它参数    |
| [setState\_PinColor(pinColor)](./ISCH_PrimitivePin.md)           |     | **_(BETA)_** 设置属性状态：引脚颜色    |
| [setState\_PinLength(pinLength)](./ISCH_PrimitivePin.md)         |     | **_(BETA)_** 设置属性状态：引脚长度    |
| [setState\_PinName(pinName)](./ISCH_PrimitivePin.md)             |     | **_(BETA)_** 设置属性状态：引脚名称    |
| [setState\_PinNumber(pinNumber)](./ISCH_PrimitivePin.md)         |     | **_(BETA)_** 设置属性状态：引脚编号    |
| [setState\_PinShape(pinShape)](./ISCH_PrimitivePin.md)           |     | **_(BETA)_** 设置属性状态：引脚形状    |
| [setState\_PinType(pinType)](./ISCH_PrimitivePin.md)             |     | **_(BETA)_** 设置属性状态：引脚类型    |
| [setState\_Rotation(rotation)](./ISCH_PrimitivePin.md)           |     | **_(BETA)_** 设置属性状态：旋转角度    |
| [setState\_X(x)](./ISCH_PrimitivePin.md)                         |     | **_(BETA)_** 设置属性状态：坐标 X    |
| [setState\_Y(y)](./ISCH_PrimitivePin.md)                         |     | **_(BETA)_** 设置属性状态：坐标 Y    |
| [toAsync()](./ISCH_PrimitivePin.md)                              |     | 将图元转换为异步图元                  |
| [toSync()](./ISCH_PrimitivePin.md)                               |     | 将图元转换为同步图元                  |

---

## 属性详情

### async

# ISCH\_PrimitivePin.async property

异步

## 签名

```typescript
protected async: boolean;
```

### pincolor

# ISCH\_PrimitivePin.pinColor property

引脚颜色

## 签名

```typescript
protected pinColor: string | null;
```

### pinlength

# ISCH\_PrimitivePin.pinLength property

引脚长度

## 签名

```typescript
protected pinLength: number;
```

### pinname

# ISCH\_PrimitivePin.pinName property

引脚名称

## 签名

```typescript
protected pinName: string;
```

### pinnumber

# ISCH\_PrimitivePin.pinNumber property

引脚编号

## 签名

```typescript
protected pinNumber: string;
```

### pinshape

# ISCH\_PrimitivePin.pinShape property

引脚形状

## 签名

```typescript
protected pinShape: ESCH_PrimitivePinShape;
```

### pintype

# ISCH\_PrimitivePin.pinType property

引脚类型

## 签名

```typescript
protected pinType: ESCH_PrimitivePinType;
```

### primitiveid

# ISCH\_PrimitivePin.primitiveId property

图元 ID

## 签名

```typescript
protected primitiveId?: string;
```

### primitivetype

# ISCH\_PrimitivePin.primitiveType property

图元类型

## 签名

```typescript
protected readonly primitiveType: ESCH_PrimitiveType;
```

### rotation

# ISCH\_PrimitivePin.rotation property

旋转角度

## 签名

```typescript
protected rotation: number;
```

### x

# ISCH\_PrimitivePin.x property

坐标 X

## 签名

```typescript
protected x: number;
```

### y

# ISCH\_PrimitivePin.y property

坐标 Y

## 签名

```typescript
protected y: number;
```


---

## 方法详情

### done

# ISCH\_PrimitivePin.done() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将对图元的更改应用到画布

## 签名

```typescript
done(): Promise<ISCH_PrimitivePin>;
```


## 返回值

Promise&lt;[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)&gt;

引脚图元对象

### getstate_otherproperty

# ISCH\_PrimitivePin.getState\_OtherProperty() method

获取属性状态：其它参数

## 签名

```typescript
getState_OtherProperty(): {
        [key: string]: string | number | boolean;
    } | undefined;
```


## 返回值

{ \[key: string\]: string \| number \| boolean; } \| undefined

其它参数

### getstate_pincolor

# ISCH\_PrimitivePin.getState\_PinColor() method

获取属性状态：引脚颜色

## 签名

```typescript
getState_PinColor(): string | null;
```


## 返回值

string \| null

引脚颜色

### getstate_pinlength

# ISCH\_PrimitivePin.getState\_PinLength() method

获取属性状态：引脚长度

## 签名

```typescript
getState_PinLength(): number;
```


## 返回值

number

引脚长度

### getstate_pinname

# ISCH\_PrimitivePin.getState\_PinName() method

获取属性状态：引脚名称

## 签名

```typescript
getState_PinName(): string;
```


## 返回值

string

引脚名称

### getstate_pinnumber

# ISCH\_PrimitivePin.getState\_PinNumber() method

获取属性状态：引脚编号

## 签名

```typescript
getState_PinNumber(): string;
```


## 返回值

string

引脚编号

### getstate_pinshape

# ISCH\_PrimitivePin.getState\_PinShape() method

获取属性状态：引脚形状

## 签名

```typescript
getState_PinShape(): ESCH_PrimitivePinShape;
```


## 返回值

[ESCH\_PrimitivePinShape](../enums/ESCH_PrimitivePinShape.md)

引脚形状

### getstate_pintype

# ISCH\_PrimitivePin.getState\_pinType() method

获取属性状态：引脚类型

## 签名

```typescript
getState_pinType(): ESCH_PrimitivePinType;
```


## 返回值

[ESCH\_PrimitivePinType](../enums/ESCH_PrimitivePinType.md)

引脚类型

### getstate_primitiveid

# ISCH\_PrimitivePin.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivetype

# ISCH\_PrimitivePin.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): ESCH_PrimitiveType;
```


## 返回值

[ESCH\_PrimitiveType](../enums/ESCH_PrimitiveType.md)

图元类型

### getstate_rotation

# ISCH\_PrimitivePin.getState\_Rotation() method

获取属性状态：旋转角度

## 签名

```typescript
getState_Rotation(): number;
```


## 返回值

number

旋转角度

### getstate_x

# ISCH\_PrimitivePin.getState\_X() method

获取属性状态：坐标 X

## 签名

```typescript
getState_X(): number;
```


## 返回值

number

坐标 X

### getstate_y

# ISCH\_PrimitivePin.getState\_Y() method

获取属性状态：坐标 Y

## 签名

```typescript
getState_Y(): number;
```


## 返回值

number

坐标 Y

### isasync

# ISCH\_PrimitivePin.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### reset

# ISCH\_PrimitivePin.reset() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将异步图元重置为当前画布状态

## 签名

```typescript
reset(): Promise<ISCH_PrimitivePin>;
```


## 返回值

Promise&lt;[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)&gt;

引脚图元对象

### setstate_otherproperty

# ISCH\_PrimitivePin.setState\_OtherProperty() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：其它参数

## 签名

```typescript
setState_OtherProperty(otherProperty: {
        [key: string]: string | number | boolean;
    }): ISCH_PrimitivePin;
```

## 参数名

| 参数            | 类型                                                  | 描述   |
| ------------- | --------------------------------------------------- | ---- |
| otherProperty | \{ \[key: string\]: string \| number \| boolean; \} | 其它参数 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_pincolor

# ISCH\_PrimitivePin.setState\_PinColor() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：引脚颜色

## 签名

```typescript
setState_PinColor(pinColor: string | null): ISCH_PrimitivePin;
```

## 参数名

| 参数       | 类型             | 描述   |
| -------- | -------------- | ---- |
| pinColor | string \| null | 引脚颜色 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_pinlength

# ISCH\_PrimitivePin.setState\_PinLength() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：引脚长度

## 签名

```typescript
setState_PinLength(pinLength: number): ISCH_PrimitivePin;
```

## 参数名

| 参数        | 类型     | 描述   |
| --------- | ------ | ---- |
| pinLength | number | 引脚长度 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_pinname

# ISCH\_PrimitivePin.setState\_PinName() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：引脚名称

## 签名

```typescript
setState_PinName(pinName: string): ISCH_PrimitivePin;
```

## 参数名

| 参数      | 类型     | 描述   |
| ------- | ------ | ---- |
| pinName | string | 引脚名称 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_pinnumber

# ISCH\_PrimitivePin.setState\_PinNumber() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：引脚编号

## 签名

```typescript
setState_PinNumber(pinNumber: string): ISCH_PrimitivePin;
```

## 参数名

| 参数        | 类型     | 描述   |
| --------- | ------ | ---- |
| pinNumber | string | 引脚编号 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_pinshape

# ISCH\_PrimitivePin.setState\_PinShape() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：引脚形状

## 签名

```typescript
setState_PinShape(pinShape: ESCH_PrimitivePinShape): ISCH_PrimitivePin;
```

## 参数名

| 参数       | 类型                                                            | 描述   |
| -------- | ------------------------------------------------------------- | ---- |
| pinShape | [ESCH\_PrimitivePinShape](../enums/ESCH_PrimitivePinShape.md) | 引脚形状 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_pintype

# ISCH\_PrimitivePin.setState\_PinType() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：引脚类型

## 签名

```typescript
setState_PinType(pinType: ESCH_PrimitivePinType): ISCH_PrimitivePin;
```

## 参数名

| 参数      | 类型                                                          | 描述   |
| ------- | ----------------------------------------------------------- | ---- |
| pinType | [ESCH\_PrimitivePinType](../enums/ESCH_PrimitivePinType.md) | 引脚类型 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_rotation

# ISCH\_PrimitivePin.setState\_Rotation() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：旋转角度

## 签名

```typescript
setState_Rotation(rotation: number): ISCH_PrimitivePin;
```

## 参数名

| 参数       | 类型     | 描述   |
| -------- | ------ | ---- |
| rotation | number | 旋转角度 |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_x

# ISCH\_PrimitivePin.setState\_X() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 X

## 签名

```typescript
setState_X(x: number): ISCH_PrimitivePin;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| x   | number | 坐标 X |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### setstate_y

# ISCH\_PrimitivePin.setState\_Y() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 Y

## 签名

```typescript
setState_Y(y: number): ISCH_PrimitivePin;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| y   | number | 坐标 Y |



## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### toasync

# ISCH\_PrimitivePin.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): ISCH_PrimitivePin;
```


## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象

### tosync

# ISCH\_PrimitivePin.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): ISCH_PrimitivePin;
```


## 返回值

[ISCH\_PrimitivePin](./ISCH_PrimitivePin.md)

引脚图元对象
