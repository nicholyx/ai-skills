# IDMT\_SchematicPageItem interface

原理图图页属性

## 签名

```typescript
interface IDMT_SchematicPageItem
```

## 属性

| 属性名                                                | 修饰符        | 类型                                                                                | 描述         |
| -------------------------------------------------- | ---------- | --------------------------------------------------------------------------------- | ---------- |
| [itemType](./IDMT_SchematicPageItem.md)            | `readonly` | [EDMT\_ItemType.SCHEMATIC\_PAGE](../enums/EDMT_ItemType.md)                       | 项目类型       |
| [name](./IDMT_SchematicPageItem.md)                |            | string                                                                            | 原理图图页名称    |
| [parentSchematicUuid](./IDMT_SchematicPageItem.md) |            | string                                                                            | 所属原理图 UUID |
| [showTitleBlock](./IDMT_SchematicPageItem.md)      |            | boolean                                                                           | 是否显示明细表    |
| [titleBlockData](./IDMT_SchematicPageItem.md)      |            | \{ \[key: string\]: \{ showTitle: boolean; showValue: boolean; value: any; \}; \} | 明细表数据      |
| [uuid](./IDMT_SchematicPageItem.md)                |            | string                                                                            | 原理图图页 UUID |

---

## 属性详情

### itemtype

# IDMT\_SchematicPageItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.SCHEMATIC_PAGE;
```

### name

# IDMT\_SchematicPageItem.name property

原理图图页名称

## 签名

```typescript
name: string;
```

### parentschematicuuid

# IDMT\_SchematicPageItem.parentSchematicUuid property

所属原理图 UUID

## 签名

```typescript
parentSchematicUuid: string;
```

### showtitleblock

# IDMT\_SchematicPageItem.showTitleBlock property

是否显示明细表

## 签名

```typescript
showTitleBlock: boolean;
```

### titleblockdata

# IDMT\_SchematicPageItem.titleBlockData property

明细表数据

## 签名

```typescript
titleBlockData: {
        [key: string]: {
            showTitle: boolean;
            showValue: boolean;
            value: any;
        };
    };
```

### uuid

# IDMT\_SchematicPageItem.uuid property

原理图图页 UUID

## 签名

```typescript
uuid: string;
```
