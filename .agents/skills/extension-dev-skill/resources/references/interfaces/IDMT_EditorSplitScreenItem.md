# IDMT\_EditorSplitScreenItem interface

编辑器分屏属性

## 签名

```typescript
interface IDMT_EditorSplitScreenItem
```

## 备注

[tabs](./IDMT_EditorSplitScreenItem.md) 和 [children](./IDMT_EditorSplitScreenItem.md) 并不同时存在，当 [tabs](./IDMT_EditorSplitScreenItem.md) 存在时，代表不存在分屏，[children](./IDMT_EditorSplitScreenItem.md) 将为 `undefined`

## 属性

| 属性名                                           | 修饰符 | 类型                                                                              | 描述             |
| --------------------------------------------- | --- | ------------------------------------------------------------------------------- | -------------- |
| [children?](./IDMT_EditorSplitScreenItem.md)  |     | Array&lt;[IDMT\_EditorSplitScreenItem](./IDMT_EditorSplitScreenItem.md)&gt;     | _（可选）_ 子分屏     |
| [direction?](./IDMT_EditorSplitScreenItem.md) |     | [EDMT\_EditorSplitScreenDirection](../enums/EDMT_EditorSplitScreenDirection.md) | _（可选）_ 分屏方向    |
| [fatherId?](./IDMT_EditorSplitScreenItem.md)  |     | string                                                                          | _（可选）_ 父级分屏 ID |
| [id](./IDMT_EditorSplitScreenItem.md)         |     | string                                                                          | 分屏 ID          |
| [tabs?](./IDMT_EditorSplitScreenItem.md)      |     | Array&lt;[IDMT\_EditorTabItem](./IDMT_EditorTabItem.md)&gt;                     | _（可选）_ 分屏内标签页  |

---

## 属性详情

### children

# IDMT\_EditorSplitScreenItem.children property

子分屏

## 签名

```typescript
children?: Array<IDMT_EditorSplitScreenItem>;
```

### direction

# IDMT\_EditorSplitScreenItem.direction property

分屏方向

## 签名

```typescript
direction?: EDMT_EditorSplitScreenDirection;
```

### fatherid

# IDMT\_EditorSplitScreenItem.fatherId property

父级分屏 ID

## 签名

```typescript
fatherId?: string;
```

### id

# IDMT\_EditorSplitScreenItem.id property

分屏 ID

## 签名

```typescript
id: string;
```

### tabs

# IDMT\_EditorSplitScreenItem.tabs property

分屏内标签页

## 签名

```typescript
tabs?: Array<IDMT_EditorTabItem>;
```
