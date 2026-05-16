# PCB\_Layer class

PCB &amp; 封装 / 图层操作类

## 签名

```typescript
declare class PCB_Layer
```

## 方法

| 方法名                                                              | 修饰符 | 描述                       |
| ---------------------------------------------------------------- | --- | ------------------------ |
| [addCustomLayer()](./PCB_Layer.md)                               |     | **_(BETA)_** 新增自定义层      |
| [getAllLayers()](./PCB_Layer.md)                                 |     | **_(BETA)_** 获取所有图层的详细属性 |
| [lockLayer(layer)](./PCB_Layer.md)                               |     | **_(BETA)_** 锁定层         |
| [modifyLayer(layer, property)](./PCB_Layer.md)                   |     | **_(BETA)_** 修改图层属性      |
| [removeLayer(layer)](./PCB_Layer.md)                             |     | **_(BETA)_** 移除层         |
| [selectLayer(layer)](./PCB_Layer.md)                             |     | 选中图层                     |
| [setInactiveLayerDisplayMode(displayMode)](./PCB_Layer.md)       |     | **_(BETA)_** 设置非激活层展示模式  |
| [setInactiveLayerTransparency(transparency)](./PCB_Layer.md)     |     | **_(BETA)_** 设置非激活层透明度   |
| [setLayerColorConfiguration(colorConfiguration)](./PCB_Layer.md) |     | **_(BETA)_** 设置层颜色配置     |
| [setLayerInvisible(layer, setOtherLayerVisible)](./PCB_Layer.md) |     | **_(BETA)_** 将层设置为不可见    |
| [setLayerVisible(layer, setOtherLayerInvisible)](./PCB_Layer.md) |     | **_(BETA)_** 将层设置为可见     |
| [setPcbType(pcbType)](./PCB_Layer.md)                            |     | **_(BETA)_** 设置 PCB 类型   |
| [setTheNumberOfCopperLayers(numberOfLayers)](./PCB_Layer.md)     |     | **_(BETA)_** 设置铜箔层数      |
| [unlockLayer(layer)](./PCB_Layer.md)                             |     | **_(BETA)_** 取消锁定层       |

---

## 方法详情

### addcustomlayer

# PCB\_Layer.addCustomLayer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

新增自定义层

## 签名

```typescript
addCustomLayer(): Promise<TPCB_LayersOfCustom | undefined>;
```


## 返回值

Promise&lt;[TPCB\_LayersOfCustom](../types/TPCB_LayersOfCustom.md) \| undefined&gt;

新增的自定义层的图层 ID，如若为 `undefined` 则为新增失败，可能是自定义层数量已达到上限

### getalllayers

# PCB\_Layer.getAllLayers() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取所有图层的详细属性

## 签名

```typescript
getAllLayers(): Promise<Array<IPCB_LayerItem>>;
```


## 返回值

Promise&lt;Array&lt;[IPCB\_LayerItem](../interfaces/IPCB_LayerItem.md)&gt;&gt;

所有图层的详细属性

### locklayer

# PCB\_Layer.lockLayer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

锁定层

## 签名

```typescript
lockLayer(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>): Promise<boolean>;
```

## 参数名

| 参数    | 类型                                                                                                                                                          | 描述                       |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| layer | [TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md) \| Array&lt;[TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md)&gt; | _（可选）_ 层，如若不指定任何层则默认为所有层 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### modifylayer

# PCB\_Layer.modifyLayer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改图层属性

## 签名

```typescript
modifyLayer(layer: TPCB_LayersInTheSelectable, property: {
        name?: string;
        type?: TPCB_LayerTypesOfInnerLayer;
        color?: string;
        transparency?: number;
    }): Promise<boolean>;
```

## 参数名

| 参数       | 类型                                                                                                                                        | 描述  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --- |
| layer    | [TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md)                                                                     | 层   |
| property | { name?: string; type?: [TPCB\_LayerTypesOfInnerLayer](../types/TPCB_LayerTypesOfInnerLayer.md); color?: string; transparency?: number; } | 属性  |



## 返回值

Promise&lt;boolean&gt;

修改后的图层属性，如若为 `undefined` 则代表修改失败或图层不存在

## 备注

仅内层和自定义层允许修改名称；仅内层允许修改类型, 透明度仅支持0-100之间的数

### removelayer

# PCB\_Layer.removeLayer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

移除层

## 签名

```typescript
removeLayer(layer: TPCB_LayersOfCustom): Promise<boolean>;
```

## 参数名

| 参数    | 类型                                                      | 描述  |
| ----- | ------------------------------------------------------- | --- |
| layer | [TPCB\_LayersOfCustom](../types/TPCB_LayersOfCustom.md) | 层   |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

当前仅支持移除自定义层

### selectlayer

# PCB\_Layer.selectLayer() method

选中图层

## 签名

```typescript
selectLayer(layer: TPCB_LayersInTheSelectable): Promise<boolean>;
```

## 参数名

| 参数    | 类型                                                                    | 描述  |
| ----- | --------------------------------------------------------------------- | --- |
| layer | [TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md) | 层   |



## 返回值

Promise&lt;boolean&gt;

操作是否成功，不存在指定层将返回 `false`

### setinactivelayerdisplaymode

# PCB\_Layer.setInactiveLayerDisplayMode() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置非激活层展示模式

## 签名

```typescript
setInactiveLayerDisplayMode(displayMode?: EPCB_InactiveLayerDisplayMode): Promise<boolean>;
```

## 参数名

| 参数          | 类型                                                                          | 描述          |
| ----------- | --------------------------------------------------------------------------- | ----------- |
| displayMode | [EPCB\_InactiveLayerDisplayMode](../enums/EPCB_InactiveLayerDisplayMode.md) | _（可选）_ 展示模式 |



## 返回值

Promise&lt;boolean&gt;

是否设置成功

### setinactivelayertransparency

# PCB\_Layer.setInactiveLayerTransparency() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置非激活层透明度

## 签名

```typescript
setInactiveLayerTransparency(transparency: number): Promise<boolean>;
```

## 参数名

| 参数           | 类型     | 描述             |
| ------------ | ------ | -------------- |
| transparency | number | 透明度，范围 `0-100` |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setlayercolorconfiguration

# PCB\_Layer.setLayerColorConfiguration() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置层颜色配置

## 签名

```typescript
setLayerColorConfiguration(colorConfiguration: EPCB_LayerColorConfiguration): Promise<boolean>;
```

## 参数名

| 参数                 | 类型                                                                        | 描述   |
| ------------------ | ------------------------------------------------------------------------- | ---- |
| colorConfiguration | [EPCB\_LayerColorConfiguration](../enums/EPCB_LayerColorConfiguration.md) | 颜色配置 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setlayerinvisible

# PCB\_Layer.setLayerInvisible() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将层设置为不可见

## 签名

```typescript
setLayerInvisible(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>, setOtherLayerVisible?: boolean): Promise<boolean>;
```

## 参数名

| 参数                   | 类型                                                                                                                                                          | 描述                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| layer                | [TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md) \| Array&lt;[TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md)&gt; | _（可选）_ 层，如若不指定任何层则默认为所有层 |
| setOtherLayerVisible | boolean                                                                                                                                                     | _（可选）_ 是否将其它层设置为可见       |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setlayervisible

# PCB\_Layer.setLayerVisible() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将层设置为可见

## 签名

```typescript
setLayerVisible(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>, setOtherLayerInvisible?: boolean): Promise<boolean>;
```

## 参数名

| 参数                     | 类型                                                                                                                                                          | 描述                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| layer                  | [TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md) \| Array&lt;[TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md)&gt; | _（可选）_ 层，如若不指定任何层则默认为所有层 |
| setOtherLayerInvisible | boolean                                                                                                                                                     | _（可选）_ 是否将其它层设置为不可见      |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setpcbtype

# PCB\_Layer.setPcbType() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置 PCB 类型

## 签名

```typescript
setPcbType(pcbType: EPCB_PcbPlateType): Promise<boolean>;
```

## 参数名

| 参数      | 类型                                                  | 描述     |
| ------- | --------------------------------------------------- | ------ |
| pcbType | [EPCB\_PcbPlateType](../enums/EPCB_PcbPlateType.md) | PCB 类型 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

此处主要是为了适配 FPC 软板的设计，如若将 PCB 类型设置为 FPC 软板，将会新增 FPC 补强层图层。

请注意：

1. 嘉立创暂不支持超过 2 层铜箔层的 FPC 软板生产；

2. 将 PCB 类型从 FPC 软板切换为普通板材时需要预先删除 FPC 补强层上的任何图元，否则将无法切换并返回 `false` 的结果。

### setthenumberofcopperlayers

# PCB\_Layer.setTheNumberOfCopperLayers() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

设置铜箔层数

## 签名

```typescript
setTheNumberOfCopperLayers(numberOfLayers: 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32): Promise<boolean>;
```

## 参数名

| 参数             | 类型                                                                                       | 描述  |
| -------------- | ---------------------------------------------------------------------------------------- | --- |
| numberOfLayers | 2 \| 4 \| 6 \| 8 \| 10 \| 12 \| 14 \| 16 \| 18 \| 20 \| 22 \| 24 \| 26 \| 28 \| 30 \| 32 | 层数  |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

新建的 PCB 文档默认拥有两层铜箔层

### unlocklayer

# PCB\_Layer.unlockLayer() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

取消锁定层

## 签名

```typescript
unlockLayer(layer?: TPCB_LayersInTheSelectable | Array<TPCB_LayersInTheSelectable>): Promise<boolean>;
```

## 参数名

| 参数    | 类型                                                                                                                                                          | 描述                       |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| layer | [TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md) \| Array&lt;[TPCB\_LayersInTheSelectable](../types/TPCB_LayersInTheSelectable.md)&gt; | _（可选）_ 层，如若不指定任何层则默认为所有层 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功
