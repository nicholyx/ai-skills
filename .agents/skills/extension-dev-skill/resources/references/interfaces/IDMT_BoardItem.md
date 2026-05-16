# IDMT\_BoardItem interface

板子属性

## 签名

```typescript
interface IDMT_BoardItem
```

## 属性

| 属性名                                      | 修饰符        | 类型                                                | 描述        |
| ---------------------------------------- | ---------- | ------------------------------------------------- | --------- |
| [itemType](./IDMT_BoardItem.md)          | `readonly` | [EDMT\_ItemType.BOARD](../enums/EDMT_ItemType.md) | 项目类型      |
| [name](./IDMT_BoardItem.md)              |            | string                                            | 板子名称      |
| [parentProjectUuid](./IDMT_BoardItem.md) |            | string                                            | 所属工程 UUID |
| [pcb](./IDMT_BoardItem.md)               |            | [IDMT\_PcbItem](./IDMT_PcbItem.md)                | 下属 PCB    |
| [schematic](./IDMT_BoardItem.md)         |            | [IDMT\_SchematicItem](./IDMT_SchematicItem.md)    | 下属原理图     |

---

## 属性详情

### itemtype

# IDMT\_BoardItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.BOARD;
```

### name

# IDMT\_BoardItem.name property

板子名称

## 签名

```typescript
name: string;
```

### parentprojectuuid

# IDMT\_BoardItem.parentProjectUuid property

所属工程 UUID

## 签名

```typescript
parentProjectUuid: string;
```

### pcb

# IDMT\_BoardItem.pcb property

下属 PCB

## 签名

```typescript
pcb: IDMT_PcbItem;
```

### schematic

# IDMT\_BoardItem.schematic property

下属原理图

## 签名

```typescript
schematic: IDMT_SchematicItem;
```
