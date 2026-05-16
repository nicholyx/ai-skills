# PCB\_Primitive class

PCB &amp; 封装 / 图元类

## 签名

```typescript
declare class PCB_Primitive
```

## 备注

图元的统一操作

## 方法

| 方法名                                                   | 修饰符 | 描述                      |
| ----------------------------------------------------- | --- | ----------------------- |
| [getPrimitivesBBox(primitiveIds)](./PCB_Primitive.md) |     | **_(BETA)_** 获取图元的 BBox |

---

## 方法详情

### getprimitivesbbox

# PCB\_Primitive.getPrimitivesBBox() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取图元的 BBox

## 签名

```typescript
getPrimitivesBBox(primitiveIds: Array<string | IPCB_Primitive>): Promise<{
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    } | undefined>;
```

## 参数名

| 参数           | 类型                                                                        | 描述              |
| ------------ | ------------------------------------------------------------------------- | --------------- |
| primitiveIds | Array&lt;string \| [IPCB\_Primitive](../interfaces/IPCB_Primitive.md)&gt; | 图元 ID 数组或图元对象数组 |



## 返回值

Promise&lt;{ minX: number; minY: number; maxX: number; maxY: number; } \| undefined&gt;

图元的 BBox，如若图元不存在或没有 BBox，将会返回 `undefined` 的结果
