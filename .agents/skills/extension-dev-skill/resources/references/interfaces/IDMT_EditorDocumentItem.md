# IDMT\_EditorDocumentItem interface

编辑器文档对象

## 签名

```typescript
interface IDMT_EditorDocumentItem
```

## 属性

| 属性名                                                | 修饰符 | 类型                                                              | 描述                 |
| -------------------------------------------------- | --- | --------------------------------------------------------------- | ------------------ |
| [documentType](./IDMT_EditorDocumentItem.md)       |     | [EDMT\_EditorDocumentType](../enums/EDMT_EditorDocumentType.md) | 文档类型               |
| [parentLibraryUuid?](./IDMT_EditorDocumentItem.md) |     | string                                                          | _（可选）_ 库文档所属库 UUID |
| [parentProjectUuid?](./IDMT_EditorDocumentItem.md) |     | string                                                          | _（可选）_ 文档所属工程 UUID |
| [tabId](./IDMT_EditorDocumentItem.md)              |     | string                                                          | 文档的标签页 ID          |
| [uuid](./IDMT_EditorDocumentItem.md)               |     | string                                                          | 文档 UUID            |

---

## 属性详情

### documenttype

# IDMT\_EditorDocumentItem.documentType property

文档类型

## 签名

```typescript
documentType: EDMT_EditorDocumentType;
```

### parentlibraryuuid

# IDMT\_EditorDocumentItem.parentLibraryUuid property

库文档所属库 UUID

## 签名

```typescript
parentLibraryUuid?: string;
```

### parentprojectuuid

# IDMT\_EditorDocumentItem.parentProjectUuid property

文档所属工程 UUID

## 签名

```typescript
parentProjectUuid?: string;
```

### tabid

# IDMT\_EditorDocumentItem.tabId property

文档的标签页 ID

## 签名

```typescript
tabId: string;
```

### uuid

# IDMT\_EditorDocumentItem.uuid property

文档 UUID

## 签名

```typescript
uuid: string;
```
