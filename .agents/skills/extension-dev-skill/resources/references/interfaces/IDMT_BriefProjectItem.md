# IDMT\_BriefProjectItem interface

简略工程属性

## 签名

```typescript
interface IDMT_BriefProjectItem
```

## 属性

| 属性名                                        | 修饰符        | 类型                                                                                                              | 描述                |
| ------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------- | ----------------- |
| [folderUuid?](./IDMT_BriefProjectItem.md)  |            | string                                                                                                          | _（可选）_ 所属文件夹 UUID |
| [friendlyName](./IDMT_BriefProjectItem.md) |            | string                                                                                                          | 工程友好名称            |
| [itemType](./IDMT_BriefProjectItem.md)     | `readonly` | [EDMT\_ItemType.PROJECT](../enums/EDMT_ItemType.md) \| [EDMT\_ItemType.CBB\_PROJECT](../enums/EDMT_ItemType.md) | 项目类型              |
| [teamUuid](./IDMT_BriefProjectItem.md)     |            | string                                                                                                          | 所属团队 UUID         |
| [uuid](./IDMT_BriefProjectItem.md)         |            | string                                                                                                          | 工程 UUID           |

---

## 属性详情

### folderuuid

# IDMT\_BriefProjectItem.folderUuid property

所属文件夹 UUID

## 签名

```typescript
folderUuid?: string;
```

### friendlyname

# IDMT\_BriefProjectItem.friendlyName property

工程友好名称

## 签名

```typescript
friendlyName: string;
```

### itemtype

# IDMT\_BriefProjectItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.PROJECT | EDMT_ItemType.CBB_PROJECT;
```

### teamuuid

# IDMT\_BriefProjectItem.teamUuid property

所属团队 UUID

## 签名

```typescript
teamUuid: string;
```

### uuid

# IDMT\_BriefProjectItem.uuid property

工程 UUID

## 签名

```typescript
uuid: string;
```
