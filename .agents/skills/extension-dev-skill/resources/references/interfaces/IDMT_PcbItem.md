# IDMT\_PcbItem interface

PCB 属性

## 签名

```typescript
interface IDMT_PcbItem
```

## 属性

| 属性名                                    | 修饰符        | 类型                                                                                                      | 描述            |
| -------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- | ------------- |
| [itemType](./IDMT_PcbItem.md)          | `readonly` | [EDMT\_ItemType.PCB](../enums/EDMT_ItemType.md) \| [EDMT\_ItemType.CBB\_PCB](../enums/EDMT_ItemType.md) | 项目类型          |
| [name](./IDMT_PcbItem.md)              |            | string                                                                                                  | PCB 名称        |
| [parentBoardName?](./IDMT_PcbItem.md)  |            | string                                                                                                  | _（可选）_ 所属板子名称 |
| [parentProjectUuid](./IDMT_PcbItem.md) |            | string                                                                                                  | 所属工程 UUID     |
| [uuid](./IDMT_PcbItem.md)              |            | string                                                                                                  | PCB UUID      |

---

## 属性详情

### itemtype

# IDMT\_PcbItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.PCB | EDMT_ItemType.CBB_PCB;
```

### name

# IDMT\_PcbItem.name property

PCB 名称

## 签名

```typescript
name: string;
```

### parentboardname

# IDMT\_PcbItem.parentBoardName property

所属板子名称

## 签名

```typescript
parentBoardName?: string;
```

### parentprojectuuid

# IDMT\_PcbItem.parentProjectUuid property

所属工程 UUID

## 签名

```typescript
parentProjectUuid: string;
```

### uuid

# IDMT\_PcbItem.uuid property

PCB UUID

## 签名

```typescript
uuid: string;
```
