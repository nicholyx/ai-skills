# SCH\_PrimitiveComponent class

原理图 &amp; 符号 / 器件图元类

## 签名

```typescript
declare class SCH_PrimitiveComponent implements ISCH_PrimitiveAPI
```
**实现自：**[ISCH\_PrimitiveAPI](../interfaces/ISCH_PrimitiveAPI.md)

## 备注


## 方法

| 方法名                                                                                                           | 修饰符 | 描述                                                    |
| ------------------------------------------------------------------------------------------------------------- | --- | ----------------------------------------------------- |
| [create(component, x, y, subPartName, rotation, mirror, addIntoBom, addIntoPcb)](./SCH_PrimitiveComponent.md) |     | **_(BETA)_** 创建器件                                     |
| [createNetFlag(identification, net, x, y, rotation, mirror)](./SCH_PrimitiveComponent.md)                     |     | **_(BETA)_** 创建网络标识                                   |
| [createNetPort(direction, net, x, y, rotation, mirror)](./SCH_PrimitiveComponent.md)                          |     | **_(BETA)_** 创建网络端口                                   |
| [createShortCircuitFlag(x, y, rotation, mirror)](./SCH_PrimitiveComponent.md)                                 |     | **_(BETA)_** 创建短接标识                                   |
| [delete(primitiveIds)](./SCH_PrimitiveComponent.md)                                                           |     | **_(BETA)_** 删除器件                                     |
| [get(primitiveIds)](./SCH_PrimitiveComponent.md)                                                              |     | **_(BETA)_** 获取器件                                     |
| [get(primitiveIds)](./SCH_PrimitiveComponent.md)                                                              |     | **_(BETA)_** 获取器件                                     |
| [getAll(componentType, allSchematicPages)](./SCH_PrimitiveComponent.md)                                       |     | **_(BETA)_** 获取所有器件                                   |
| [getAllPinsByPrimitiveId(primitiveId)](./SCH_PrimitiveComponent.md)                                           |     | **_(BETA)_** 获取器件关联的所有引脚                              |
| [getAllPrimitiveId(componentType, allSchematicPages)](./SCH_PrimitiveComponent.md)                            |     | **_(BETA)_** 获取所有器件的图元 ID                             |
| [getAllPropertyNames()](./SCH_PrimitiveComponent.md)                                                          |     | **_(BETA)_** 获取所有器件的所有属性名称集合                          |
| [modify(primitiveId, property)](./SCH_PrimitiveComponent.md)                                                  |     | **_(BETA)_** 修改器件                                     |
| [placeComponentWithMouse(component, subPartName)](./SCH_PrimitiveComponent.md)                                |     | **_(BETA)_** 使用鼠标放置器件                                 |
| [setNetFlagComponentUuid\_AnalogGround(component)](./SCH_PrimitiveComponent.md)                               |     | **_(BETA)_** 设置在扩展 API 中 AnalogGround 网络标识关联的器件 UUID  |
| [setNetFlagComponentUuid\_Ground(component)](./SCH_PrimitiveComponent.md)                                     |     | **_(BETA)_** 设置在扩展 API 中 Ground 网络标识关联的器件 UUID        |
| [setNetFlagComponentUuid\_Power(component)](./SCH_PrimitiveComponent.md)                                      |     | **_(BETA)_** 设置在扩展 API 中 Power 网络标识关联的器件 UUID         |
| [setNetFlagComponentUuid\_ProtectGround(component)](./SCH_PrimitiveComponent.md)                              |     | **_(BETA)_** 设置在扩展 API 中 ProtectGround 网络标识关联的器件 UUID |
| [setNetPortComponentUuid\_BI(component)](./SCH_PrimitiveComponent.md)                                         |     | **_(BETA)_** 设置在扩展 API 中 BI 网络端口关联的器件 UUID            |
| [setNetPortComponentUuid\_IN(component)](./SCH_PrimitiveComponent.md)                                         |     | **_(BETA)_** 设置在扩展 API 中 IN 网络端口关联的器件 UUID            |
| [setNetPortComponentUuid\_OUT(component)](./SCH_PrimitiveComponent.md)                                        |     | **_(BETA)_** 设置在扩展 API 中 OUT 网络端口关联的器件 UUID           |

---

## 方法详情

### create

# SCH\_PrimitiveComponent.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建器件

## 签名

```typescript
create(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem, x: number, y: number, subPartName?: string, rotation?: number, mirror?: boolean, addIntoBom?: boolean, addIntoPcb?: boolean): Promise<ISCH_PrimitiveComponent$1 | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                 | 描述              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| component   | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件           |
| x           | number                                                                                                                                                             | 坐标 X            |
| y           | number                                                                                                                                                             | 坐标 Y            |
| subPartName | string                                                                                                                                                             | _（可选）_ 子图块名称    |
| rotation    | number                                                                                                                                                             | _（可选）_ 旋转角度     |
| mirror      | boolean                                                                                                                                                            | _（可选）_ 是否镜像     |
| addIntoBom  | boolean                                                                                                                                                            | _（可选）_ 是否加入 BOM |
| addIntoPcb  | boolean                                                                                                                                                            | _（可选）_ 是否转到 PCB |



## 返回值

Promise&lt;ISCH\_PrimitiveComponent$1 \| undefined&gt;

器件图元对象

### createnetflag

# SCH\_PrimitiveComponent.createNetFlag() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建网络标识

## 签名

```typescript
createNetFlag(identification: 'Power' | 'Ground' | 'AnalogGround' | 'ProtectGround', net: string, x: number, y: number, rotation?: number, mirror?: boolean): Promise<ISCH_PrimitiveComponent$1 | undefined>;
```

## 参数名

| 参数             | 类型                                                       | 描述          |
| -------------- | -------------------------------------------------------- | ----------- |
| identification | 'Power' \| 'Ground' \| 'AnalogGround' \| 'ProtectGround' | 标识类型        |
| net            | string                                                   | 网络名称        |
| x              | number                                                   | 坐标 X        |
| y              | number                                                   | 坐标 Y        |
| rotation       | number                                                   | _（可选）_ 旋转角度 |
| mirror         | boolean                                                  | _（可选）_ 是否镜像 |



## 返回值

Promise&lt;ISCH\_PrimitiveComponent$1 \| undefined&gt;

器件图元对象

### createnetport

# SCH\_PrimitiveComponent.createNetPort() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建网络端口

## 签名

```typescript
createNetPort(direction: 'IN' | 'OUT' | 'BI', net: string, x: number, y: number, rotation?: number, mirror?: boolean): Promise<ISCH_PrimitiveComponent$1 | undefined>;
```

## 参数名

| 参数        | 类型                    | 描述          |
| --------- | --------------------- | ----------- |
| direction | 'IN' \| 'OUT' \| 'BI' | 端口方向        |
| net       | string                | 网络名称        |
| x         | number                | 坐标 X        |
| y         | number                | 坐标 Y        |
| rotation  | number                | _（可选）_ 旋转角度 |
| mirror    | boolean               | _（可选）_ 是否镜像 |



## 返回值

Promise&lt;ISCH\_PrimitiveComponent$1 \| undefined&gt;

器件图元对象

### createshortcircuitflag

# SCH\_PrimitiveComponent.createShortCircuitFlag() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建短接标识

## 签名

```typescript
createShortCircuitFlag(x: number, y: number, rotation?: number, mirror?: boolean): Promise<ISCH_PrimitiveComponent$1 | undefined>;
```

## 参数名

| 参数       | 类型      | 描述          |
| -------- | ------- | ----------- |
| x        | number  | 坐标 X        |
| y        | number  | 坐标 Y        |
| rotation | number  | _（可选）_ 旋转角度 |
| mirror   | boolean | _（可选）_ 是否镜像 |



## 返回值

Promise&lt;ISCH\_PrimitiveComponent$1 \| undefined&gt;

器件图元对象

### delete

# SCH\_PrimitiveComponent.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除器件

## 签名

```typescript
delete(primitiveIds: string | ISCH_PrimitiveComponent$1 | Array<string> | Array<ISCH_PrimitiveComponent$1>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                     | 描述               |
| ------------ | ------------------------------------------------------------------------------------------------------ | ---------------- |
| primitiveIds | string \| ISCH\_PrimitiveComponent$1 \| Array&lt;string&gt; \| Array&lt;ISCH\_PrimitiveComponent$1&gt; | 器件的图元 ID 或器件图元对象 |



## 返回值

Promise&lt;boolean&gt;

删除操作是否成功

### get

# SCH\_PrimitiveComponent.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件

## 签名

```typescript
get(primitiveIds: string): Promise<ISCH_PrimitiveComponent$1 | undefined>;
```

## 参数名

| 参数           | 类型     | 描述                                   |
| ------------ | ------ | ------------------------------------ |
| primitiveIds | string | 器件的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;ISCH\_PrimitiveComponent$1 \| undefined&gt;

器件图元对象，`undefined` 表示获取失败

### get_1

# SCH\_PrimitiveComponent.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件

## 签名

```typescript
get(primitiveIds: Array<string>): Promise<Array<ISCH_PrimitiveComponent$1>>;
```

## 参数名

| 参数           | 类型                  | 描述                                   |
| ------------ | ------------------- | ------------------------------------ |
| primitiveIds | Array&lt;string&gt; | 器件的图元 ID，可以为字符串或字符串数组，如若为数组，则返回的也是数组 |



## 返回值

Promise&lt;Array&lt;ISCH\_PrimitiveComponent$1&gt;&gt;

器件图元对象，空数组表示获取失败

## 备注

如若传入多个图元 ID，任意图元 ID 未匹配到不影响其它图元的返回，即可能返回少于传入的图元 ID 数量的图元对象

### getall

# SCH\_PrimitiveComponent.getAll() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有器件

## 签名

```typescript
getAll(componentType?: ESCH_PrimitiveComponentType$1, allSchematicPages?: boolean): Promise<Array<ISCH_PrimitiveComponent$1>>;
```

## 参数名

| 参数                | 类型                                                                        | 描述                    |
| ----------------- | ------------------------------------------------------------------------- | --------------------- |
| componentType     | [ESCH\_PrimitiveComponentType$1](../enums/ESCH_PrimitiveComponentType.md) | _（可选）_ 器件类型           |
| allSchematicPages | boolean                                                                   | _（可选）_ 是否获取所有原理图图页的器件 |



## 返回值

Promise&lt;Array&lt;ISCH\_PrimitiveComponent$1&gt;&gt;

器件图元对象数组

### getallpinsbyprimitiveid

# SCH\_PrimitiveComponent.getAllPinsByPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件关联的所有引脚

## 签名

```typescript
getAllPinsByPrimitiveId(primitiveId: string): Promise<Array<ISCH_PrimitiveComponentPin> | undefined>;
```

## 参数名

| 参数          | 类型     | 描述      |
| ----------- | ------ | ------- |
| primitiveId | string | 器件图元 ID |



## 返回值

Promise&lt;Array&lt;[ISCH\_PrimitiveComponentPin](./ISCH_PrimitiveComponentPin.md)&gt; \| undefined&gt;

器件引脚图元数组

### getallprimitiveid

# SCH\_PrimitiveComponent.getAllPrimitiveId() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有器件的图元 ID

## 签名

```typescript
getAllPrimitiveId(componentType?: ESCH_PrimitiveComponentType$1, allSchematicPages?: boolean): Promise<Array<string>>;
```

## 参数名

| 参数                | 类型                                                                        | 描述                    |
| ----------------- | ------------------------------------------------------------------------- | --------------------- |
| componentType     | [ESCH\_PrimitiveComponentType$1](../enums/ESCH_PrimitiveComponentType.md) | _（可选）_ 器件类型           |
| allSchematicPages | boolean                                                                   | _（可选）_ 是否获取所有原理图图页的器件 |



## 返回值

Promise&lt;Array&lt;string&gt;&gt;

器件的图元 ID 数组

### getallpropertynames

# SCH\_PrimitiveComponent.getAllPropertyNames() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有器件的所有属性名称集合

## 签名

```typescript
getAllPropertyNames(): Promise<string[]>;
```


## 返回值

Promise&lt;string\[\]&gt;

所有器件的所有属性名称集合

### modify

# SCH\_PrimitiveComponent.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改器件

## 签名

```typescript
modify(primitiveId: string | ISCH_PrimitiveComponent$1, property: {
        x?: number;
        y?: number;
        rotation?: number;
        mirror?: boolean;
        addIntoBom?: boolean;
        addIntoPcb?: boolean;
        designator?: string | null;
        name?: string | null;
        uniqueId?: string | null;
        manufacturer?: string | null;
        manufacturerId?: string | null;
        supplier?: string | null;
        supplierId?: string | null;
        otherProperty?: {
            [key: string]: string | number | boolean;
        };
    }): Promise<ISCH_PrimitiveComponent$1 | undefined>;
```

## 参数名

| 参数          | 类型                                                                                                                                                                                                                                                                                                                                                                                         | 描述    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| primitiveId | string \| ISCH\_PrimitiveComponent$1                                                                                                                                                                                                                                                                                                                                                       | 图元 ID |
| property    | \{ x?: number; y?: number; rotation?: number; mirror?: boolean; addIntoBom?: boolean; addIntoPcb?: boolean; designator?: string \| null; name?: string \| null; uniqueId?: string \| null; manufacturer?: string \| null; manufacturerId?: string \| null; supplier?: string \| null; supplierId?: string \| null; otherProperty?: \{ \[key: string\]: string \| number \| boolean; \}; \} |       |



## 返回值

Promise&lt;ISCH\_PrimitiveComponent$1 \| undefined&gt;

器件图元对象

## 备注

仅当器件类型为 [COMPONENT](../enums/ESCH_PrimitiveComponentType.md) 时允许使用该方法进行修改

### placecomponentwithmouse

# SCH\_PrimitiveComponent.placeComponentWithMouse() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用鼠标放置器件

## 签名

```typescript
placeComponentWithMouse(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem, subPartName?: string): Promise<boolean>;
```

## 参数名

| 参数          | 类型                                                                                             | 描述           |
| ----------- | ---------------------------------------------------------------------------------------------- | ------------ |
| component   | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) | 关联库器件        |
| subPartName | string                                                                                         | _(Optional)_ |



## 返回值

Promise&lt;boolean&gt;

是否找到器件

## 备注

本接口模拟前端点击放置按钮，指定的器件将绑定到当前鼠标，并在用户后续点击时放置于画布

本接口的返回时机并不会等待用户的放置操作，一旦器件被绑定到鼠标，本接口将立即返回 `true` 的结果

### setnetflagcomponentuuid_analogground

# SCH\_PrimitiveComponent.setNetFlagComponentUuid\_AnalogGround() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 AnalogGround 网络标识关联的器件 UUID

## 签名

```typescript
setNetFlagComponentUuid_AnalogGround(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetflagcomponentuuid_ground

# SCH\_PrimitiveComponent.setNetFlagComponentUuid\_Ground() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 Ground 网络标识关联的器件 UUID

## 签名

```typescript
setNetFlagComponentUuid_Ground(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetflagcomponentuuid_power

# SCH\_PrimitiveComponent.setNetFlagComponentUuid\_Power() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 Power 网络标识关联的器件 UUID

## 签名

```typescript
setNetFlagComponentUuid_Power(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetflagcomponentuuid_protectground

# SCH\_PrimitiveComponent.setNetFlagComponentUuid\_ProtectGround() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 ProtectGround 网络标识关联的器件 UUID

## 签名

```typescript
setNetFlagComponentUuid_ProtectGround(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetportcomponentuuid_bi

# SCH\_PrimitiveComponent.setNetPortComponentUuid\_BI() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 BI 网络端口关联的器件 UUID

## 签名

```typescript
setNetPortComponentUuid_BI(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetportcomponentuuid_in

# SCH\_PrimitiveComponent.setNetPortComponentUuid\_IN() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 IN 网络端口关联的器件 UUID

## 签名

```typescript
setNetPortComponentUuid_IN(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetportcomponentuuid_out

# SCH\_PrimitiveComponent.setNetPortComponentUuid\_OUT() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置在扩展 API 中 OUT 网络端口关联的器件 UUID

## 签名

```typescript
setNetPortComponentUuid_OUT(component: {
        libraryUuid: string;
        uuid: string;
    } | ILIB_DeviceItem | ILIB_DeviceSearchItem): Promise<boolean>;
```

## 参数名

| 参数        | 类型                                                                                                                                                                 | 描述    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| component | { libraryUuid: string; uuid: string; } \| [ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) | 关联库器件 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功
