# IPCB\_PrimitiveComponent class

器件图元

## 签名

```typescript
declare class IPCB_PrimitiveComponent implements IPCB_Primitive
```
**实现自：**[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)

## 备注


## 方法

| 方法名                                                                      | 修饰符 | 描述                           |
| ------------------------------------------------------------------------ | --- | ---------------------------- |
| [done()](./IPCB_PrimitiveComponent.md)                                   |     | **_(BETA)_** 将对图元的更改应用到画布    |
| [getAllPins()](./IPCB_PrimitiveComponent.md)                             |     | **_(BETA)_** 获取器件关联的所有焊盘     |
| [getState\_AddIntoBom()](./IPCB_PrimitiveComponent.md)                   |     | 获取属性状态：是否加入 BOM              |
| [getState\_Component()](./IPCB_PrimitiveComponent.md)                    |     | 获取属性状态：关联库器件                 |
| [getState\_Designator()](./IPCB_PrimitiveComponent.md)                   |     | 获取属性状态：位号                    |
| [getState\_Footprint()](./IPCB_PrimitiveComponent.md)                    |     | 获取属性状态：关联库封装                 |
| [getState\_Layer()](./IPCB_PrimitiveComponent.md)                        |     | 获取属性状态：层                     |
| [getState\_Manufacturer()](./IPCB_PrimitiveComponent.md)                 |     | 获取属性状态：制造商                   |
| [getState\_ManufacturerId()](./IPCB_PrimitiveComponent.md)               |     | 获取属性状态：制造商编号                 |
| [getState\_Model3D()](./IPCB_PrimitiveComponent.md)                      |     | 获取属性状态：关联库 3D 模型             |
| [getState\_Name()](./IPCB_PrimitiveComponent.md)                         |     | 获取属性状态：名称                    |
| [getState\_OtherProperty()](./IPCB_PrimitiveComponent.md)                |     | 获取属性状态：其它参数                  |
| [getState\_Pads()](./IPCB_PrimitiveComponent.md)                         |     | 获取属性状态：焊盘                    |
| [getState\_PrimitiveId()](./IPCB_PrimitiveComponent.md)                  |     | 获取属性状态：图元 ID                 |
| [getState\_PrimitiveLock()](./IPCB_PrimitiveComponent.md)                |     | 获取属性状态：是否锁定                  |
| [getState\_PrimitiveType()](./IPCB_PrimitiveComponent.md)                |     | 获取属性状态：图元类型                  |
| [getState\_Rotation()](./IPCB_PrimitiveComponent.md)                     |     | 获取属性状态：旋转角度                  |
| [getState\_Supplier()](./IPCB_PrimitiveComponent.md)                     |     | 获取属性状态：供应商                   |
| [getState\_SupplierId()](./IPCB_PrimitiveComponent.md)                   |     | 获取属性状态：供应商编号                 |
| [getState\_UniqueId()](./IPCB_PrimitiveComponent.md)                     |     | 获取属性状态：唯一 ID                 |
| [getState\_X()](./IPCB_PrimitiveComponent.md)                            |     | 获取属性状态：坐标 X                  |
| [getState\_Y()](./IPCB_PrimitiveComponent.md)                            |     | 获取属性状态：坐标 Y                  |
| [isAsync()](./IPCB_PrimitiveComponent.md)                                |     | 查询图元是否为异步图元                  |
| [reset()](./IPCB_PrimitiveComponent.md)                                  |     | **_(BETA)_** 将异步图元重置为当前画布状态  |
| [setState\_AddIntoBom(addIntoBom)](./IPCB_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：是否加入 BOM |
| [setState\_Designator(designator)](./IPCB_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：位号       |
| [setState\_Layer(layer)](./IPCB_PrimitiveComponent.md)                   |     | **_(BETA)_** 设置属性状态：层        |
| [setState\_Manufacturer(manufacturer)](./IPCB_PrimitiveComponent.md)     |     | **_(BETA)_** 设置属性状态：制造商      |
| [setState\_ManufacturerId(manufacturerId)](./IPCB_PrimitiveComponent.md) |     | **_(BETA)_** 设置属性状态：制造商编号    |
| [setState\_Name(name)](./IPCB_PrimitiveComponent.md)                     |     | **_(BETA)_** 设置属性状态：名称       |
| [setState\_OtherProperty(otherProperty)](./IPCB_PrimitiveComponent.md)   |     | **_(BETA)_** 设置属性状态：其它参数     |
| [setState\_PrimitiveLock(primitiveLock)](./IPCB_PrimitiveComponent.md)   |     | **_(BETA)_** 设置属性状态：是否锁定     |
| [setState\_Rotation(rotation)](./IPCB_PrimitiveComponent.md)             |     | **_(BETA)_** 设置属性状态：旋转角度     |
| [setState\_Supplier(supplier)](./IPCB_PrimitiveComponent.md)             |     | **_(BETA)_** 设置属性状态：供应商      |
| [setState\_SupplierId(supplierId)](./IPCB_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：供应商编号    |
| [setState\_UniqueId(uniqueId)](./IPCB_PrimitiveComponent.md)             |     | **_(BETA)_** 设置属性状态：唯一 ID    |
| [setState\_X(x)](./IPCB_PrimitiveComponent.md)                           |     | **_(BETA)_** 设置属性状态：坐标 X     |
| [setState\_Y(y)](./IPCB_PrimitiveComponent.md)                           |     | **_(BETA)_** 设置属性状态：坐标 Y     |
| [toAsync()](./IPCB_PrimitiveComponent.md)                                |     | 将图元转换为异步图元                   |
| [toSync()](./IPCB_PrimitiveComponent.md)                                 |     | 将图元转换为同步图元                   |

---

## 方法详情

### done

# IPCB\_PrimitiveComponent.done() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将对图元的更改应用到画布

## 签名

```typescript
done(): Promise<IPCB_PrimitiveComponent>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)&gt;

器件图元对象

### getallpins

# IPCB\_PrimitiveComponent.getAllPins() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件关联的所有焊盘

## 签名

```typescript
getAllPins(): Promise<Array<IPCB_PrimitiveComponentPad>>;
```


## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveComponentPad](./IPCB_PrimitiveComponentPad.md)&gt;&gt;

器件焊盘图元数组

### getstate_addintobom

# IPCB\_PrimitiveComponent.getState\_AddIntoBom() method

获取属性状态：是否加入 BOM

## 签名

```typescript
getState_AddIntoBom(): boolean;
```


## 返回值

boolean

是否加入 BOM

### getstate_component

# IPCB\_PrimitiveComponent.getState\_Component() method

获取属性状态：关联库器件

## 签名

```typescript
getState_Component(): {
        libraryUuid: string;
        uuid: string;
    };
```


## 返回值

\{ libraryUuid: string; uuid: string; \}

关联库器件

### getstate_designator

# IPCB\_PrimitiveComponent.getState\_Designator() method

获取属性状态：位号

## 签名

```typescript
getState_Designator(): string | undefined;
```


## 返回值

string \| undefined

位号

### getstate_footprint

# IPCB\_PrimitiveComponent.getState\_Footprint() method

获取属性状态：关联库封装

## 签名

```typescript
getState_Footprint(): {
        libraryUuid: string;
        uuid: string;
    } | undefined;
```


## 返回值

{ libraryUuid: string; uuid: string; } \| undefined

关联库封装

### getstate_layer

# IPCB\_PrimitiveComponent.getState\_Layer() method

获取属性状态：层

## 签名

```typescript
getState_Layer(): TPCB_LayersOfComponent;
```


## 返回值

[TPCB\_LayersOfComponent](../types/TPCB_LayersOfComponent.md)

层

### getstate_manufacturer

# IPCB\_PrimitiveComponent.getState\_Manufacturer() method

获取属性状态：制造商

## 签名

```typescript
getState_Manufacturer(): string | undefined;
```


## 返回值

string \| undefined

制造商

### getstate_manufacturerid

# IPCB\_PrimitiveComponent.getState\_ManufacturerId() method

获取属性状态：制造商编号

## 签名

```typescript
getState_ManufacturerId(): string | undefined;
```


## 返回值

string \| undefined

制造商编号

### getstate_model3d

# IPCB\_PrimitiveComponent.getState\_Model3D() method

获取属性状态：关联库 3D 模型

## 签名

```typescript
getState_Model3D(): {
        libraryUuid: string;
        uuid: string;
    } | undefined;
```


## 返回值

{ libraryUuid: string; uuid: string; } \| undefined

关联库 3D 模型

### getstate_name

# IPCB\_PrimitiveComponent.getState\_Name() method

获取属性状态：名称

## 签名

```typescript
getState_Name(): string | undefined;
```


## 返回值

string \| undefined

名称

### getstate_otherproperty

# IPCB\_PrimitiveComponent.getState\_OtherProperty() method

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

### getstate_pads

# IPCB\_PrimitiveComponent.getState\_Pads() method

获取属性状态：焊盘

## 签名

```typescript
getState_Pads(): Array<{
        primitiveId: string;
        net: string;
        padNumber: string;
    }> | undefined;
```


## 返回值

Array&lt;{ primitiveId: string; net: string; padNumber: string; }&gt; \| undefined

焊盘

### getstate_primitiveid

# IPCB\_PrimitiveComponent.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivelock

# IPCB\_PrimitiveComponent.getState\_PrimitiveLock() method

获取属性状态：是否锁定

## 签名

```typescript
getState_PrimitiveLock(): boolean;
```


## 返回值

boolean

是否锁定

### getstate_primitivetype

# IPCB\_PrimitiveComponent.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): EPCB_PrimitiveType;
```


## 返回值

[EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md)

图元类型

### getstate_rotation

# IPCB\_PrimitiveComponent.getState\_Rotation() method

获取属性状态：旋转角度

## 签名

```typescript
getState_Rotation(): number;
```


## 返回值

number

旋转角度

### getstate_supplier

# IPCB\_PrimitiveComponent.getState\_Supplier() method

获取属性状态：供应商

## 签名

```typescript
getState_Supplier(): string | undefined;
```


## 返回值

string \| undefined

供应商

### getstate_supplierid

# IPCB\_PrimitiveComponent.getState\_SupplierId() method

获取属性状态：供应商编号

## 签名

```typescript
getState_SupplierId(): string | undefined;
```


## 返回值

string \| undefined

供应商编号

### getstate_uniqueid

# IPCB\_PrimitiveComponent.getState\_UniqueId() method

获取属性状态：唯一 ID

## 签名

```typescript
getState_UniqueId(): string | undefined;
```


## 返回值

string \| undefined

唯一 ID

### getstate_x

# IPCB\_PrimitiveComponent.getState\_X() method

获取属性状态：坐标 X

## 签名

```typescript
getState_X(): number;
```


## 返回值

number

坐标 X

### getstate_y

# IPCB\_PrimitiveComponent.getState\_Y() method

获取属性状态：坐标 Y

## 签名

```typescript
getState_Y(): number;
```


## 返回值

number

坐标 Y

### isasync

# IPCB\_PrimitiveComponent.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### reset

# IPCB\_PrimitiveComponent.reset() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将异步图元重置为当前画布状态

## 签名

```typescript
reset(): Promise<IPCB_PrimitiveComponent>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)&gt;

器件图元对象

### setstate_addintobom

# IPCB\_PrimitiveComponent.setState\_AddIntoBom() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否加入 BOM

## 签名

```typescript
setState_AddIntoBom(addIntoBom: boolean): IPCB_PrimitiveComponent;
```

## 参数名

| 参数         | 类型      | 描述       |
| ---------- | ------- | -------- |
| addIntoBom | boolean | 是否加入 BOM |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_designator

# IPCB\_PrimitiveComponent.setState\_Designator() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：位号

## 签名

```typescript
setState_Designator(designator: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数         | 类型                  | 描述  |
| ---------- | ------------------- | --- |
| designator | string \| undefined | 位号  |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_layer

# IPCB\_PrimitiveComponent.setState\_Layer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：层

## 签名

```typescript
setState_Layer(layer: TPCB_LayersOfComponent): IPCB_PrimitiveComponent;
```

## 参数名

| 参数    | 类型                                                            | 描述  |
| ----- | ------------------------------------------------------------- | --- |
| layer | [TPCB\_LayersOfComponent](../types/TPCB_LayersOfComponent.md) | 层   |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_manufacturer

# IPCB\_PrimitiveComponent.setState\_Manufacturer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：制造商

## 签名

```typescript
setState_Manufacturer(manufacturer: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数           | 类型                  | 描述  |
| ------------ | ------------------- | --- |
| manufacturer | string \| undefined | 制造商 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_manufacturerid

# IPCB\_PrimitiveComponent.setState\_ManufacturerId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：制造商编号

## 签名

```typescript
setState_ManufacturerId(manufacturerId: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数             | 类型                  | 描述    |
| -------------- | ------------------- | ----- |
| manufacturerId | string \| undefined | 制造商编号 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_name

# IPCB\_PrimitiveComponent.setState\_Name() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：名称

## 签名

```typescript
setState_Name(name: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数   | 类型                  | 描述  |
| ---- | ------------------- | --- |
| name | string \| undefined | 名称  |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_otherproperty

# IPCB\_PrimitiveComponent.setState\_OtherProperty() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：其它参数

## 签名

```typescript
setState_OtherProperty(otherProperty: {
        [key: string]: string | number | boolean;
    }): IPCB_PrimitiveComponent;
```

## 参数名

| 参数            | 类型                                                  | 描述   |
| ------------- | --------------------------------------------------- | ---- |
| otherProperty | \{ \[key: string\]: string \| number \| boolean; \} | 其它参数 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_primitivelock

# IPCB\_PrimitiveComponent.setState\_PrimitiveLock() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否锁定

## 签名

```typescript
setState_PrimitiveLock(primitiveLock: boolean): IPCB_PrimitiveComponent;
```

## 参数名

| 参数            | 类型      | 描述   |
| ------------- | ------- | ---- |
| primitiveLock | boolean | 是否锁定 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_rotation

# IPCB\_PrimitiveComponent.setState\_Rotation() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：旋转角度

## 签名

```typescript
setState_Rotation(rotation: number): IPCB_PrimitiveComponent;
```

## 参数名

| 参数       | 类型     | 描述   |
| -------- | ------ | ---- |
| rotation | number | 旋转角度 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_supplier

# IPCB\_PrimitiveComponent.setState\_Supplier() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：供应商

## 签名

```typescript
setState_Supplier(supplier: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数       | 类型                  | 描述  |
| -------- | ------------------- | --- |
| supplier | string \| undefined | 供应商 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_supplierid

# IPCB\_PrimitiveComponent.setState\_SupplierId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：供应商编号

## 签名

```typescript
setState_SupplierId(supplierId: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数         | 类型                  | 描述    |
| ---------- | ------------------- | ----- |
| supplierId | string \| undefined | 供应商编号 |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_uniqueid

# IPCB\_PrimitiveComponent.setState\_UniqueId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：唯一 ID

## 签名

```typescript
setState_UniqueId(uniqueId: string | undefined): IPCB_PrimitiveComponent;
```

## 参数名

| 参数       | 类型                  | 描述    |
| -------- | ------------------- | ----- |
| uniqueId | string \| undefined | 唯一 ID |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_x

# IPCB\_PrimitiveComponent.setState\_X() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 X

## 签名

```typescript
setState_X(x: number): IPCB_PrimitiveComponent;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| x   | number | 坐标 X |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### setstate_y

# IPCB\_PrimitiveComponent.setState\_Y() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 Y

## 签名

```typescript
setState_Y(y: number): IPCB_PrimitiveComponent;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| y   | number | 坐标 Y |



## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### toasync

# IPCB\_PrimitiveComponent.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): IPCB_PrimitiveComponent;
```


## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象

### tosync

# IPCB\_PrimitiveComponent.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): IPCB_PrimitiveComponent;
```


## 返回值

[IPCB\_PrimitiveComponent](./IPCB_PrimitiveComponent.md)

器件图元对象
