# ISCH\_PrimitiveComponent class

器件图元

## 签名

```typescript
declare class ISCH_PrimitiveComponent implements ISCH_Primitive
```
**实现自：**[ISCH\_Primitive](../interfaces/ISCH_Primitive.md)

## 备注


## 属性

| 属性名                                            | 修饰符         | 类型                                                  | 描述                     |
| ---------------------------------------------- | ----------- | --------------------------------------------------- | ---------------------- |
| [async](./ISCH_PrimitiveComponent.md)          | `protected` | boolean                                             | 异步                     |
| [designator?](./ISCH_PrimitiveComponent.md)    | `protected` | string                                              | _（可选）_ Component 属性：位号 |
| [mirror](./ISCH_PrimitiveComponent.md)         | `protected` | boolean                                             | 是否镜像                   |
| [name?](./ISCH_PrimitiveComponent.md)          | `protected` | string                                              | _（可选）_ Component 属性：名称 |
| [otherProperty?](./ISCH_PrimitiveComponent.md) | `protected` | \{ \[key: string\]: string \| number \| boolean; \} | _（可选）_ 其它参数            |
| [primitiveId?](./ISCH_PrimitiveComponent.md)   | `protected` | string                                              | _（可选）_ 图元 ID           |
| [rotation](./ISCH_PrimitiveComponent.md)       | `protected` | number                                              | 旋转角度                   |
| [x](./ISCH_PrimitiveComponent.md)              | `protected` | number                                              | 坐标 X                   |
| [y](./ISCH_PrimitiveComponent.md)              | `protected` | number                                              | 坐标 Y                   |

## 方法

| 方法名                                                                      | 修饰符 | 描述                           |
| ------------------------------------------------------------------------ | --- | ---------------------------- |
| [done()](./ISCH_PrimitiveComponent.md)                                   |     | **_(BETA)_** 将对图元的更改应用到画布    |
| [getState\_AddIntoBom()](./ISCH_PrimitiveComponent.md)                   |     | 获取属性状态：是否加入 BOM              |
| [getState\_AddIntoPcb()](./ISCH_PrimitiveComponent.md)                   |     | 获取属性状态：是否转到 PCB              |
| [getState\_Component()](./ISCH_PrimitiveComponent.md)                    |     | 获取属性状态：关联库器件                 |
| [getState\_ComponentType()](./ISCH_PrimitiveComponent.md)                |     | 获取属性状态：器件类型                  |
| [getState\_Designator()](./ISCH_PrimitiveComponent.md)                   |     | 获取属性状态：位号                    |
| [getState\_Footprint()](./ISCH_PrimitiveComponent.md)                    |     | 获取属性状态：关联库封装                 |
| [getState\_Manufacturer()](./ISCH_PrimitiveComponent.md)                 |     | 获取属性状态：制造商                   |
| [getState\_ManufacturerId()](./ISCH_PrimitiveComponent.md)               |     | 获取属性状态：制造商编号                 |
| [getState\_Mirror()](./ISCH_PrimitiveComponent.md)                       |     | 获取属性状态：是否镜像                  |
| [getState\_Name()](./ISCH_PrimitiveComponent.md)                         |     | 获取属性状态：名称                    |
| [getState\_Net()](./ISCH_PrimitiveComponent.md)                          |     | 获取属性状态：网络名称                  |
| [getState\_OtherProperty()](./ISCH_PrimitiveComponent.md)                |     | 获取属性状态：其它参数                  |
| [getState\_PrimitiveId()](./ISCH_PrimitiveComponent.md)                  |     | 获取属性状态：图元 ID                 |
| [getState\_PrimitiveType()](./ISCH_PrimitiveComponent.md)                |     | 获取属性状态：图元类型                  |
| [getState\_Rotation()](./ISCH_PrimitiveComponent.md)                     |     | 获取属性状态：旋转角度                  |
| [getState\_SubPartName()](./ISCH_PrimitiveComponent.md)                  |     | 获取属性状态：子图块名称                 |
| [getState\_Supplier()](./ISCH_PrimitiveComponent.md)                     |     | 获取属性状态：供应商                   |
| [getState\_SupplierId()](./ISCH_PrimitiveComponent.md)                   |     | 获取属性状态：供应商编号                 |
| [getState\_Symbol()](./ISCH_PrimitiveComponent.md)                       |     | 获取属性状态：关联库符号                 |
| [getState\_UniqueId()](./ISCH_PrimitiveComponent.md)                     |     | 获取属性状态：唯一 ID                 |
| [getState\_X()](./ISCH_PrimitiveComponent.md)                            |     | 获取属性状态：坐标 X                  |
| [getState\_Y()](./ISCH_PrimitiveComponent.md)                            |     | 获取属性状态：坐标 Y                  |
| [isAsync()](./ISCH_PrimitiveComponent.md)                                |     | 查询图元是否为异步图元                  |
| [reset()](./ISCH_PrimitiveComponent.md)                                  |     | **_(BETA)_** 将异步图元重置为当前画布状态  |
| [setState\_AddIntoBom(addIntoBom)](./ISCH_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：是否加入 BOM |
| [setState\_AddIntoPcb(addIntoPcb)](./ISCH_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：是否转到 PCB |
| [setState\_Designator(designator)](./ISCH_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：位号       |
| [setState\_Manufacturer(manufacturer)](./ISCH_PrimitiveComponent.md)     |     | **_(BETA)_** 设置属性状态：制造商      |
| [setState\_ManufacturerId(manufacturerId)](./ISCH_PrimitiveComponent.md) |     | **_(BETA)_** 设置属性状态：制造商编号    |
| [setState\_Mirror(mirror)](./ISCH_PrimitiveComponent.md)                 |     | **_(BETA)_** 设置属性状态：是否镜像     |
| [setState\_Name(name)](./ISCH_PrimitiveComponent.md)                     |     | **_(BETA)_** 设置属性状态：名称       |
| [setState\_Net(net)](./ISCH_PrimitiveComponent.md)                       |     | **_(BETA)_** 设置属性状态：网络名称     |
| [setState\_OtherProperty(otherProperty)](./ISCH_PrimitiveComponent.md)   |     | **_(BETA)_** 设置属性状态：其它参数     |
| [setState\_Rotation(rotation)](./ISCH_PrimitiveComponent.md)             |     | **_(BETA)_** 设置属性状态：旋转角度     |
| [setState\_Supplier(supplier)](./ISCH_PrimitiveComponent.md)             |     | **_(BETA)_** 设置属性状态：供应商      |
| [setState\_SupplierId(supplierId)](./ISCH_PrimitiveComponent.md)         |     | **_(BETA)_** 设置属性状态：供应商编号    |
| [setState\_UniqueId(uniqueId)](./ISCH_PrimitiveComponent.md)             |     | **_(BETA)_** 设置属性状态：唯一 ID    |
| [setState\_X(x)](./ISCH_PrimitiveComponent.md)                           |     | **_(BETA)_** 设置属性状态：坐标 X     |
| [setState\_Y(y)](./ISCH_PrimitiveComponent.md)                           |     | **_(BETA)_** 设置属性状态：坐标 Y     |
| [toAsync()](./ISCH_PrimitiveComponent.md)                                |     | 将图元转换为异步图元                   |
| [toSync()](./ISCH_PrimitiveComponent.md)                                 |     | 将图元转换为同步图元                   |

---

## 属性详情

### async

# ISCH\_PrimitiveComponent.async property

异步

## 签名

```typescript
protected async: boolean;
```

### designator

# ISCH\_PrimitiveComponent.designator property

Component 属性：位号

## 签名

```typescript
protected designator?: string;
```

### mirror

# ISCH\_PrimitiveComponent.mirror property

是否镜像

## 签名

```typescript
protected mirror: boolean;
```

### name

# ISCH\_PrimitiveComponent.name property

Component 属性：名称

## 签名

```typescript
protected name?: string;
```

### otherproperty

# ISCH\_PrimitiveComponent.otherProperty property

其它参数

## 签名

```typescript
protected otherProperty?: {
        [key: string]: string | number | boolean;
    };
```

### primitiveid

# ISCH\_PrimitiveComponent.primitiveId property

图元 ID

## 签名

```typescript
protected primitiveId?: string;
```

### rotation

# ISCH\_PrimitiveComponent.rotation property

旋转角度

## 签名

```typescript
protected rotation: number;
```

### x

# ISCH\_PrimitiveComponent.x property

坐标 X

## 签名

```typescript
protected x: number;
```

### y

# ISCH\_PrimitiveComponent.y property

坐标 Y

## 签名

```typescript
protected y: number;
```


---

## 方法详情

### done

# ISCH\_PrimitiveComponent.done() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将对图元的更改应用到画布

## 签名

```typescript
done(): Promise<ISCH_PrimitiveComponent>;
```


## 返回值

Promise&lt;[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)&gt;

器件图元对象

### getstate_addintobom

# ISCH\_PrimitiveComponent.getState\_AddIntoBom() method

获取属性状态：是否加入 BOM

## 签名

```typescript
getState_AddIntoBom(): boolean | undefined;
```


## 返回值

boolean \| undefined

是否加入 BOM

### getstate_addintopcb

# ISCH\_PrimitiveComponent.getState\_AddIntoPcb() method

获取属性状态：是否转到 PCB

## 签名

```typescript
getState_AddIntoPcb(): boolean | undefined;
```


## 返回值

boolean \| undefined

是否转到 PCB

### getstate_component

# ISCH\_PrimitiveComponent.getState\_Component() method

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

### getstate_componenttype

# ISCH\_PrimitiveComponent.getState\_ComponentType() method

获取属性状态：器件类型

## 签名

```typescript
getState_ComponentType(): ESCH_PrimitiveComponentType;
```


## 返回值

ESCH\_PrimitiveComponentType

器件类型

### getstate_designator

# ISCH\_PrimitiveComponent.getState\_Designator() method

获取属性状态：位号

## 签名

```typescript
getState_Designator(): string | undefined;
```


## 返回值

string \| undefined

位号

### getstate_footprint

# ISCH\_PrimitiveComponent.getState\_Footprint() method

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

### getstate_manufacturer

# ISCH\_PrimitiveComponent.getState\_Manufacturer() method

获取属性状态：制造商

## 签名

```typescript
getState_Manufacturer(): string | undefined;
```


## 返回值

string \| undefined

制造商

### getstate_manufacturerid

# ISCH\_PrimitiveComponent.getState\_ManufacturerId() method

获取属性状态：制造商编号

## 签名

```typescript
getState_ManufacturerId(): string | undefined;
```


## 返回值

string \| undefined

制造商编号

### getstate_mirror

# ISCH\_PrimitiveComponent.getState\_Mirror() method

获取属性状态：是否镜像

## 签名

```typescript
getState_Mirror(): boolean;
```


## 返回值

boolean

是否镜像

### getstate_name

# ISCH\_PrimitiveComponent.getState\_Name() method

获取属性状态：名称

## 签名

```typescript
getState_Name(): string | undefined;
```


## 返回值

string \| undefined

名称

### getstate_net

# ISCH\_PrimitiveComponent.getState\_Net() method

获取属性状态：网络名称

## 签名

```typescript
getState_Net(): string | undefined;
```


## 返回值

string \| undefined

网络名称

### getstate_otherproperty

# ISCH\_PrimitiveComponent.getState\_OtherProperty() method

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

### getstate_primitiveid

# ISCH\_PrimitiveComponent.getState\_PrimitiveId() method

获取属性状态：图元 ID

## 签名

```typescript
getState_PrimitiveId(): string;
```


## 返回值

string

图元 ID

### getstate_primitivetype

# ISCH\_PrimitiveComponent.getState\_PrimitiveType() method

获取属性状态：图元类型

## 签名

```typescript
getState_PrimitiveType(): ESCH_PrimitiveType;
```


## 返回值

[ESCH\_PrimitiveType](../enums/ESCH_PrimitiveType.md)

图元类型

### getstate_rotation

# ISCH\_PrimitiveComponent.getState\_Rotation() method

获取属性状态：旋转角度

## 签名

```typescript
getState_Rotation(): number;
```


## 返回值

number

旋转角度

### getstate_subpartname

# ISCH\_PrimitiveComponent.getState\_SubPartName() method

获取属性状态：子图块名称

## 签名

```typescript
getState_SubPartName(): string | undefined;
```


## 返回值

string \| undefined

子图块名称

### getstate_supplier

# ISCH\_PrimitiveComponent.getState\_Supplier() method

获取属性状态：供应商

## 签名

```typescript
getState_Supplier(): string | undefined;
```


## 返回值

string \| undefined

供应商

### getstate_supplierid

# ISCH\_PrimitiveComponent.getState\_SupplierId() method

获取属性状态：供应商编号

## 签名

```typescript
getState_SupplierId(): string | undefined;
```


## 返回值

string \| undefined

供应商编号

### getstate_symbol

# ISCH\_PrimitiveComponent.getState\_Symbol() method

获取属性状态：关联库符号

## 签名

```typescript
getState_Symbol(): {
        libraryUuid: string;
        uuid: string;
    } | undefined;
```


## 返回值

{ libraryUuid: string; uuid: string; } \| undefined

关联库符号

### getstate_uniqueid

# ISCH\_PrimitiveComponent.getState\_UniqueId() method

获取属性状态：唯一 ID

## 签名

```typescript
getState_UniqueId(): string | undefined;
```


## 返回值

string \| undefined

唯一 ID

### getstate_x

# ISCH\_PrimitiveComponent.getState\_X() method

获取属性状态：坐标 X

## 签名

```typescript
getState_X(): number;
```


## 返回值

number

坐标 X

### getstate_y

# ISCH\_PrimitiveComponent.getState\_Y() method

获取属性状态：坐标 Y

## 签名

```typescript
getState_Y(): number;
```


## 返回值

number

坐标 Y

### isasync

# ISCH\_PrimitiveComponent.isAsync() method

查询图元是否为异步图元

## 签名

```typescript
isAsync(): boolean;
```


## 返回值

boolean

是否为异步图元

### reset

# ISCH\_PrimitiveComponent.reset() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将异步图元重置为当前画布状态

## 签名

```typescript
reset(): Promise<ISCH_PrimitiveComponent>;
```


## 返回值

Promise&lt;[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)&gt;

器件图元对象

### setstate_addintobom

# ISCH\_PrimitiveComponent.setState\_AddIntoBom() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否加入 BOM

## 签名

```typescript
setState_AddIntoBom(addIntoBom: boolean | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数         | 类型                   | 描述       |
| ---------- | -------------------- | -------- |
| addIntoBom | boolean \| undefined | 是否加入 BOM |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_addintopcb

# ISCH\_PrimitiveComponent.setState\_AddIntoPcb() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否转到 PCB

## 签名

```typescript
setState_AddIntoPcb(addIntoPcb: boolean | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数         | 类型                   | 描述       |
| ---------- | -------------------- | -------- |
| addIntoPcb | boolean \| undefined | 是否转到 PCB |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_designator

# ISCH\_PrimitiveComponent.setState\_Designator() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：位号

## 签名

```typescript
setState_Designator(designator: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数         | 类型                  | 描述  |
| ---------- | ------------------- | --- |
| designator | string \| undefined | 位号  |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_manufacturer

# ISCH\_PrimitiveComponent.setState\_Manufacturer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：制造商

## 签名

```typescript
setState_Manufacturer(manufacturer: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数           | 类型                  | 描述  |
| ------------ | ------------------- | --- |
| manufacturer | string \| undefined | 制造商 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_manufacturerid

# ISCH\_PrimitiveComponent.setState\_ManufacturerId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：制造商编号

## 签名

```typescript
setState_ManufacturerId(manufacturerId: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数             | 类型                  | 描述    |
| -------------- | ------------------- | ----- |
| manufacturerId | string \| undefined | 制造商编号 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_mirror

# ISCH\_PrimitiveComponent.setState\_Mirror() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：是否镜像

## 签名

```typescript
setState_Mirror(mirror: boolean): ISCH_PrimitiveComponent;
```

## 参数名

| 参数     | 类型      | 描述   |
| ------ | ------- | ---- |
| mirror | boolean | 是否镜像 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_name

# ISCH\_PrimitiveComponent.setState\_Name() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：名称

## 签名

```typescript
setState_Name(name: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数   | 类型                  | 描述  |
| ---- | ------------------- | --- |
| name | string \| undefined | 名称  |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_net

# ISCH\_PrimitiveComponent.setState\_Net() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：网络名称

## 签名

```typescript
setState_Net(net: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数  | 类型                  | 描述   |
| --- | ------------------- | ---- |
| net | string \| undefined | 网络名称 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_otherproperty

# ISCH\_PrimitiveComponent.setState\_OtherProperty() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：其它参数

## 签名

```typescript
setState_OtherProperty(otherProperty: {
        [key: string]: string | number | boolean;
    }): ISCH_PrimitiveComponent;
```

## 参数名

| 参数            | 类型                                                  | 描述   |
| ------------- | --------------------------------------------------- | ---- |
| otherProperty | \{ \[key: string\]: string \| number \| boolean; \} | 其它参数 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_rotation

# ISCH\_PrimitiveComponent.setState\_Rotation() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：旋转角度

## 签名

```typescript
setState_Rotation(rotation: number): ISCH_PrimitiveComponent;
```

## 参数名

| 参数       | 类型     | 描述   |
| -------- | ------ | ---- |
| rotation | number | 旋转角度 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_supplier

# ISCH\_PrimitiveComponent.setState\_Supplier() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：供应商

## 签名

```typescript
setState_Supplier(supplier: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数       | 类型                  | 描述  |
| -------- | ------------------- | --- |
| supplier | string \| undefined | 供应商 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_supplierid

# ISCH\_PrimitiveComponent.setState\_SupplierId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：供应商编号

## 签名

```typescript
setState_SupplierId(supplierId: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数         | 类型                  | 描述    |
| ---------- | ------------------- | ----- |
| supplierId | string \| undefined | 供应商编号 |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_uniqueid

# ISCH\_PrimitiveComponent.setState\_UniqueId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：唯一 ID

## 签名

```typescript
setState_UniqueId(uniqueId: string | undefined): ISCH_PrimitiveComponent;
```

## 参数名

| 参数       | 类型                  | 描述    |
| -------- | ------------------- | ----- |
| uniqueId | string \| undefined | 唯一 ID |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_x

# ISCH\_PrimitiveComponent.setState\_X() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 X

## 签名

```typescript
setState_X(x: number): ISCH_PrimitiveComponent;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| x   | number | 坐标 X |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### setstate_y

# ISCH\_PrimitiveComponent.setState\_Y() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置属性状态：坐标 Y

## 签名

```typescript
setState_Y(y: number): ISCH_PrimitiveComponent;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| y   | number | 坐标 Y |



## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

器件图元对象

### toasync

# ISCH\_PrimitiveComponent.toAsync() method

将图元转换为异步图元

## 签名

```typescript
toAsync(): ISCH_PrimitiveComponent;
```


## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

圆弧线图元对象

### tosync

# ISCH\_PrimitiveComponent.toSync() method

将图元转换为同步图元

## 签名

```typescript
toSync(): ISCH_PrimitiveComponent;
```


## 返回值

[ISCH\_PrimitiveComponent](./ISCH_PrimitiveComponent.md)

圆弧线图元对象
