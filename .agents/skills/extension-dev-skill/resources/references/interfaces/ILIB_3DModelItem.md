# ILIB\_3DModelItem interface

3D 模型属性

## 签名

```typescript
interface ILIB_3DModelItem
```

## 属性

| 属性名                                      | 修饰符        | 类型                                                                                | 描述         |
| ---------------------------------------- | ---------- | --------------------------------------------------------------------------------- | ---------- |
| [classification?](./ILIB_3DModelItem.md) |            | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类  |
| [description?](./ILIB_3DModelItem.md)    |            | string                                                                            | _（可选）_ 描述  |
| [libraryType](./ILIB_3DModelItem.md)     | `readonly` | [ELIB\_LibraryType.MODEL](../enums/ELIB_LibraryType.md)                           | 库类型        |
| [libraryUuid](./ILIB_3DModelItem.md)     |            | string                                                                            | 所属库 UUID   |
| [name](./ILIB_3DModelItem.md)            |            | string                                                                            | 3D 模型名称    |
| [uuid](./ILIB_3DModelItem.md)            |            | string                                                                            | 3D 模型 UUID |

---

## 属性详情

### classification

# ILIB\_3DModelItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_3DModelItem.description property

描述

## 签名

```typescript
description?: string;
```

### librarytype

# ILIB\_3DModelItem.libraryType property

库类型

## 签名

```typescript
readonly libraryType: ELIB_LibraryType.MODEL;
```

### libraryuuid

# ILIB\_3DModelItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_3DModelItem.name property

3D 模型名称

## 签名

```typescript
name: string;
```

### uuid

# ILIB\_3DModelItem.uuid property

3D 模型 UUID

## 签名

```typescript
uuid: string;
```
