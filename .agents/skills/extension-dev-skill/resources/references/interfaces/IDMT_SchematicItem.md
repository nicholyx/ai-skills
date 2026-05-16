# IDMT\_SchematicItem interface

原理图属性

## 签名

```typescript
interface IDMT_SchematicItem
```

## 属性

| 属性名                                          | 修饰符        | 类型                                                                                                                  | 描述                    |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | --------------------- |
| [cbbSymbol?](./IDMT_SchematicItem.md)        |            | [ILIB\_SymbolItem](./ILIB_SymbolItem.md)                                                                            | _（可选）_ 复用模块原理图关联的模块符号 |
| [itemType](./IDMT_SchematicItem.md)          | `readonly` | [EDMT\_ItemType.SCHEMATIC](../enums/EDMT_ItemType.md) \| [EDMT\_ItemType.CBB\_SCHEMATIC](../enums/EDMT_ItemType.md) | 项目类型                  |
| [name](./IDMT_SchematicItem.md)              |            | string                                                                                                              | 原理图名称                 |
| [page](./IDMT_SchematicItem.md)              |            | Array&lt;[IDMT\_SchematicPageItem](./IDMT_SchematicPageItem.md)&gt;                                                 | 下属原理图图页               |
| [parentBoardUuid?](./IDMT_SchematicItem.md)  |            | string                                                                                                              | _（可选）_ 所属板子 UUID      |
| [parentProjectUuid](./IDMT_SchematicItem.md) |            | string                                                                                                              | 所属工程 UUID             |
| [uuid](./IDMT_SchematicItem.md)              |            | string                                                                                                              | 原理图 UUID              |

---

## 属性详情

### cbbsymbol

# IDMT\_SchematicItem.cbbSymbol property

复用模块原理图关联的模块符号

## 签名

```typescript
cbbSymbol?: ILIB_SymbolItem;
```

### itemtype

# IDMT\_SchematicItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.SCHEMATIC | EDMT_ItemType.CBB_SCHEMATIC;
```

### name

# IDMT\_SchematicItem.name property

原理图名称

## 签名

```typescript
name: string;
```

### page

# IDMT\_SchematicItem.page property

下属原理图图页

## 签名

```typescript
page: Array<IDMT_SchematicPageItem>;
```

### parentboarduuid

# IDMT\_SchematicItem.parentBoardUuid property

所属板子 UUID

## 签名

```typescript
parentBoardUuid?: string;
```

### parentprojectuuid

# IDMT\_SchematicItem.parentProjectUuid property

所属工程 UUID

## 签名

```typescript
parentProjectUuid: string;
```

### uuid

# IDMT\_SchematicItem.uuid property

原理图 UUID

## 签名

```typescript
uuid: string;
```
