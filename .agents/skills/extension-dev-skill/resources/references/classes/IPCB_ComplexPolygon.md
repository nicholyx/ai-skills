# IPCB\_ComplexPolygon class

复杂多边形

## 签名

```typescript
declare class IPCB_ComplexPolygon
```

## 备注

复杂多边形可以包含多个单多边形，通过 [fill-rule](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule) 将其组合，以实现多边形的布尔运算。 目前嘉立创 EDA 专业版固定使用 [nonzero](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule#nonzero) 这个 fill-rule。


## 方法

| 方法名                                                   | 修饰符 | 描述        |
| ----------------------------------------------------- | --- | --------- |
| [addSource(complexPolygon)](./IPCB_ComplexPolygon.md) |     | 添加多边形数据   |
| [getSource()](./IPCB_ComplexPolygon.md)               |     | 获取多边形数据   |
| [getSourceStrictComplex()](./IPCB_ComplexPolygon.md)  |     | 获取复杂多边形数据 |

---

## 方法详情

### addsource

# IPCB\_ComplexPolygon.addSource() method

添加多边形数据

## 签名

```typescript
addSource(complexPolygon: TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray> | IPCB_Polygon | Array<IPCB_Polygon>): IPCB_ComplexPolygon;
```

## 参数名

| 参数             | 类型                                                                                                                                                                                                                                       | 描述      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| complexPolygon | [TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt; \| [IPCB\_Polygon](./IPCB_Polygon.md) \| Array&lt;[IPCB\_Polygon](./IPCB_Polygon.md)&gt; | 复杂多边形数据 |



## 返回值

[IPCB\_ComplexPolygon](./IPCB_ComplexPolygon.md)

复杂多边形对象

### getsource

# IPCB\_ComplexPolygon.getSource() method

获取多边形数据

## 签名

```typescript
getSource(): TPCB_PolygonSourceArray | Array<TPCB_PolygonSourceArray>;
```


## 返回值

[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md) \| Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt;

单多边形或复杂多边形数据

## 备注

如遇仅包含单一的单多边形，将会化简最外层的数组

### getsourcestrictcomplex

# IPCB\_ComplexPolygon.getSourceStrictComplex() method

获取复杂多边形数据

## 签名

```typescript
getSourceStrictComplex(): Array<TPCB_PolygonSourceArray>;
```


## 返回值

Array&lt;[TPCB\_PolygonSourceArray](../types/TPCB_PolygonSourceArray.md)&gt;

复杂多边形数据

## 备注

强制返回复杂多边形格式数据，即使它仅包含单一的单多边形
