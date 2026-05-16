# PCB\_Net class

PCB &amp; 封装 / 网络类

## 签名

```typescript
declare class PCB_Net
```

## 方法

| 方法名                                                        | 修饰符 | 描述                         |
| ---------------------------------------------------------- | --- | -------------------------- |
| [getAllNetName()](./PCB_Net.md)                            |     | 获取所有网络的网络名称                |
| [getAllNetsName()](./PCB_Net.md)                           |     | 获取所有网络的网络名称                |
| [getAllPrimitivesByNet(net, primitiveTypes)](./PCB_Net.md) |     | **_(BETA)_** 获取关联指定网络的所有图元 |
| [getNetLength(net)](./PCB_Net.md)                          |     | 获取指定网络的长度                  |
| [getNetlist(type)](./PCB_Net.md)                           |     | 获取网表                       |
| [highlightNet(net)](./PCB_Net.md)                          |     | **_(BETA)_** 高亮网络          |
| [selectNet(net)](./PCB_Net.md)                             |     | **_(BETA)_** 选中网络          |
| [setNetlist(type, netlist)](./PCB_Net.md)                  |     | 更新网表                       |
| [unhighlightNet(net)](./PCB_Net.md)                        |     | **_(BETA)_** 取消高亮网络        |

---

## 方法详情

### getallnetname

# PCB\_Net.getAllNetName() method

> 警告：此 API 现已弃用。
>
> 请使用 [getAllNetsName](./PCB_Net.md) 替代

获取所有网络的网络名称

## 签名

```typescript
getAllNetName(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

网络名称数组

### getallnetsname

# PCB\_Net.getAllNetsName() method

获取所有网络的网络名称

## 签名

```typescript
getAllNetsName(): Promise<Array<string>>;
```


## 返回值

Promise&lt;Array&lt;string&gt;&gt;

网络名称数组

### getallprimitivesbynet

# PCB\_Net.getAllPrimitivesByNet() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取关联指定网络的所有图元

## 签名

```typescript
getAllPrimitivesByNet(net: string, primitiveTypes?: Array<EPCB_PrimitiveType>): Promise<Array<IPCB_Primitive>>;
```

## 参数名

| 参数             | 类型                                                                 | 描述                                      |
| -------------- | ------------------------------------------------------------------ | --------------------------------------- |
| net            | string                                                             | 网络名称                                    |
| primitiveTypes | Array&lt;[EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md)&gt; | _（可选）_ 图元类型数组，如若指定图元类型不存在网络属性，返回的数据将恒为空 |



## 返回值

Promise&lt;Array&lt;[IPCB\_Primitive](../interfaces/IPCB_Primitive.md)&gt;&gt;

图元对象数组

### getnetlength

# PCB\_Net.getNetLength() method

获取指定网络的长度

## 签名

```typescript
getNetLength(net: string): Promise<number | undefined>;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| net | string | 网络名称 |



## 返回值

Promise&lt;number \| undefined&gt;

网络长度，`undefined` 为不存在该网络，`0` 为网络无长度

### getnetlist

# PCB\_Net.getNetlist() method

获取网表

## 签名

```typescript
getNetlist(type?: ESYS_NetlistType): Promise<string>;
```

## 参数名

| 参数   | 类型                                                | 描述          |
| ---- | ------------------------------------------------- | ----------- |
| type | [ESYS\_NetlistType](../enums/ESYS_NetlistType.md) | _（可选）_ 网表格式 |



## 返回值

Promise&lt;string&gt;

网表数据

### highlightnet

# PCB\_Net.highlightNet() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

高亮网络

## 签名

```typescript
highlightNet(net: string): Promise<boolean>;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| net | string | 网络名称 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

本接口的返回值为结果导向，如果该网络原先已高亮，也将返回 `true`

### selectnet

# PCB\_Net.selectNet() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

选中网络

## 签名

```typescript
selectNet(net: string): Promise<boolean>;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| net | string | 网络名称 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### setnetlist

# PCB\_Net.setNetlist() method

更新网表

## 签名

```typescript
setNetlist(type: ESYS_NetlistType | undefined, netlist: string): Promise<boolean>;
```

## 参数名

| 参数      | 类型                                                             | 描述   |
| ------- | -------------------------------------------------------------- | ---- |
| type    | [ESYS\_NetlistType](../enums/ESYS_NetlistType.md) \| undefined | 网表格式 |
| netlist | string                                                         | 网表数据 |



## 返回值

Promise&lt;boolean&gt;

### unhighlightnet

# PCB\_Net.unhighlightNet() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

取消高亮网络

## 签名

```typescript
unhighlightNet(net: string): Promise<boolean>;
```

## 参数名

| 参数  | 类型     | 描述   |
| --- | ------ | ---- |
| net | string | 网络名称 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

本接口的返回值为结果导向，如果该网络原先未高亮，也将返回 `true`
