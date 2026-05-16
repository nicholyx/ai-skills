# IPCB\_PrimitiveComponentPad class

器件焊盘图元

## 签名

```typescript
declare class IPCB_PrimitiveComponentPad extends IPCB_PrimitivePad
```
**扩展自：**[IPCB\_PrimitivePad](./IPCB_PrimitivePad.md)

## 备注

器件焊盘图元是一个特殊的图元，它指的是在 PCB 画布上关联到封装的焊盘

你只能通过 [器件类的 getAllPinsByPrimitiveId 方法](./PCB_PrimitiveComponent.md) 或 [器件图元的 getAllPads 方法](./IPCB_PrimitiveComponent.md) 获取到器件焊盘图元


## 属性

| 属性名                                              | 修饰符                       | 类型                                                                   | 描述   |
| ------------------------------------------------ | ------------------------- | -------------------------------------------------------------------- | ---- |
| [primitiveType](./IPCB_PrimitiveComponentPad.md) | `protected` `readonly` | [EPCB\_PrimitiveType.COMPONENT\_PAD](../enums/EPCB_PrimitiveType.md) | 图元类型 |

## 方法

| 方法名                                                                             | 修饰符 | 描述                        |
| ------------------------------------------------------------------------------- | --- | ------------------------- |
| [done()](./IPCB_PrimitiveComponentPad.md)                                       |     | **_(BETA)_** 将对图元的更改应用到画布 |
| [getConnectedPrimitives(onlyCentreConnection)](./IPCB_PrimitiveComponentPad.md) |     | **_(BETA)_** 获取连接的图元      |
| [getConnectedPrimitives(onlyCentreConnection)](./IPCB_PrimitiveComponentPad.md) |     |                           |
| [getState\_ParentComponentPrimitiveId()](./IPCB_PrimitiveComponentPad.md)       |     | 获取属性状态：父器件图元 ID           |
| [setState\_ParentComponentPrimitiveId()](./IPCB_PrimitiveComponentPad.md)       |     | 设置属性状态：父器件图元 ID           |

---

## 属性详情

### primitivetype

# IPCB\_PrimitiveComponentPad.primitiveType property

图元类型

## 签名

```typescript
protected readonly primitiveType: EPCB_PrimitiveType.COMPONENT_PAD;
```


---

## 方法详情

### done

# IPCB\_PrimitiveComponentPad.done() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

将对图元的更改应用到画布

## 签名

```typescript
done(): Promise<IPCB_PrimitiveComponentPad>;
```


## 返回值

Promise&lt;[IPCB\_PrimitiveComponentPad](./IPCB_PrimitiveComponentPad.md)&gt;

器件焊盘图元对象

### getconnectedprimitives

# IPCB\_PrimitiveComponentPad.getConnectedPrimitives() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取连接的图元

## 签名

```typescript
getConnectedPrimitives(onlyCentreConnection: true): Promise<Array<IPCB_PrimitiveLine | IPCB_PrimitiveArc | IPCB_PrimitiveVia>>;
```

## 参数名

| 参数                   | 类型   | 描述                                                               |
| -------------------- | ---- | ---------------------------------------------------------------- |
| onlyCentreConnection | true | 是否仅中心连接，如若为 `true` 则仅获取中心连接的图元（直线、圆弧线、过孔），如若为 `false` 则获取所有接触的图元 |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md) \| [IPCB\_PrimitiveArc](./IPCB_PrimitiveArc.md) \| [IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md)&gt;&gt;

## 备注

本接口可以获取到与焊盘直接接触的图元

### getconnectedprimitives_1

# IPCB\_PrimitiveComponentPad.getConnectedPrimitives() method

## 签名

```typescript
getConnectedPrimitives(onlyCentreConnection: false): Promise<Array<IPCB_PrimitiveLine | IPCB_PrimitiveArc | IPCB_PrimitiveVia | IPCB_PrimitivePolyline | IPCB_PrimitiveFill>>;
```

## 参数名

| 参数                   | 类型    | 描述  |
| -------------------- | ----- | --- |
| onlyCentreConnection | false |     |



## 返回值

Promise&lt;Array&lt;[IPCB\_PrimitiveLine](./IPCB_PrimitiveLine.md) \| [IPCB\_PrimitiveArc](./IPCB_PrimitiveArc.md) \| [IPCB\_PrimitiveVia](./IPCB_PrimitiveVia.md) \| [IPCB\_PrimitivePolyline](./IPCB_PrimitivePolyline.md) \| [IPCB\_PrimitiveFill](./IPCB_PrimitiveFill.md)&gt;&gt;

### getstate_parentcomponentprimitiveid

# IPCB\_PrimitiveComponentPad.getState\_ParentComponentPrimitiveId() method

获取属性状态：父器件图元 ID

## 签名

```typescript
getState_ParentComponentPrimitiveId(): string;
```


## 返回值

string

父器件图元 ID

### setstate_parentcomponentprimitiveid

# IPCB\_PrimitiveComponentPad.setState\_ParentComponentPrimitiveId() method

设置属性状态：父器件图元 ID

## 签名

```typescript
setState_ParentComponentPrimitiveId(): IPCB_PrimitiveComponentPad;
```


## 返回值

[IPCB\_PrimitiveComponentPad](./IPCB_PrimitiveComponentPad.md)

器件焊盘图元对象

## 备注

本器件焊盘图元属性不支持修改，本接口调用将不会有任何效果
