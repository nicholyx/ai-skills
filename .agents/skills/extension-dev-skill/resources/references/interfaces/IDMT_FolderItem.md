# IDMT\_FolderItem interface

文件夹属性

## 签名

```typescript
interface IDMT_FolderItem
```

## 属性

| 属性名                                          | 修饰符        | 类型                                                 | 描述                  |
| -------------------------------------------- | ---------- | -------------------------------------------------- | ------------------- |
| [childrenFoldersUuid?](./IDMT_FolderItem.md) |            | Array&lt;string&gt;                                | _（可选）_ 子文件夹 UUID 列表 |
| [description?](./IDMT_FolderItem.md)         |            | string                                             | _（可选）_ 文件夹描述        |
| [itemType](./IDMT_FolderItem.md)             | `readonly` | [EDMT\_ItemType.FOLDER](../enums/EDMT_ItemType.md) | 项目类型                |
| [name](./IDMT_FolderItem.md)                 |            | string                                             | 文件夹名称               |
| [parentFolderUuid](./IDMT_FolderItem.md)     |            | string                                             | 父文件夹 UUID           |
| [teamUuid](./IDMT_FolderItem.md)             |            | string                                             | 所属团队 UUID           |
| [uuid](./IDMT_FolderItem.md)                 |            | string                                             | 文件夹 UUID            |

---

## 属性详情

### childrenfoldersuuid

# IDMT\_FolderItem.childrenFoldersUuid property

子文件夹 UUID 列表

## 签名

```typescript
childrenFoldersUuid?: Array<string>;
```

### description

# IDMT\_FolderItem.description property

文件夹描述

## 签名

```typescript
description?: string;
```

### itemtype

# IDMT\_FolderItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.FOLDER;
```

### name

# IDMT\_FolderItem.name property

文件夹名称

## 签名

```typescript
name: string;
```

### parentfolderuuid

# IDMT\_FolderItem.parentFolderUuid property

父文件夹 UUID

## 签名

```typescript
parentFolderUuid: string;
```

### teamuuid

# IDMT\_FolderItem.teamUuid property

所属团队 UUID

## 签名

```typescript
teamUuid: string;
```

### uuid

# IDMT\_FolderItem.uuid property

文件夹 UUID

## 签名

```typescript
uuid: string;
```
