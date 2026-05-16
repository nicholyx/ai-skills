# ILIB\_DeviceItem interface

器件属性

## 签名

```typescript
interface ILIB_DeviceItem
```

## 属性

| 属性名                                     | 修饰符        | 类型                                                                                | 描述          |
| --------------------------------------- | ---------- | --------------------------------------------------------------------------------- | ----------- |
| [association](./ILIB_DeviceItem.md)     |            | [ILIB\_DeviceAssociationItem](./ILIB_DeviceAssociationItem.md)                    | 关联          |
| [classification?](./ILIB_DeviceItem.md) |            | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 器件分类 |
| [description?](./ILIB_DeviceItem.md)    |            | string                                                                            | _（可选）_ 描述   |
| [libraryType](./ILIB_DeviceItem.md)     | `readonly` | [ELIB\_LibraryType.DEVICE](../enums/ELIB_LibraryType.md)                          | 库类型         |
| [libraryUuid](./ILIB_DeviceItem.md)     |            | string                                                                            | 所属库 UUID    |
| [name](./ILIB_DeviceItem.md)            |            | string                                                                            | 器件名称        |
| [property](./ILIB_DeviceItem.md)        |            | [ILIB\_DeviceExtendPropertyItem](./ILIB_DeviceExtendPropertyItem.md)              | 扩展属性        |
| [uuid](./ILIB_DeviceItem.md)            |            | string                                                                            | 器件 UUID     |

---

## 属性详情

### association

# ILIB\_DeviceItem.association property

关联

## 签名

```typescript
association: ILIB_DeviceAssociationItem;
```

### classification

# ILIB\_DeviceItem.classification property

器件分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_DeviceItem.description property

描述

## 签名

```typescript
description?: string;
```

### librarytype

# ILIB\_DeviceItem.libraryType property

库类型

## 签名

```typescript
readonly libraryType: ELIB_LibraryType.DEVICE;
```

### libraryuuid

# ILIB\_DeviceItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_DeviceItem.name property

器件名称

## 签名

```typescript
name: string;
```

### property

# ILIB\_DeviceItem.property property

扩展属性

## 签名

```typescript
property: ILIB_DeviceExtendPropertyItem;
```

### uuid

# ILIB\_DeviceItem.uuid property

器件 UUID

## 签名

```typescript
uuid: string;
```
