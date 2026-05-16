# ILIB\_FootprintItem interface

封装属性

## 签名

```typescript
interface ILIB_FootprintItem
```

## 属性

| 属性名                                        | 修饰符        | 类型                                                                                | 描述        |
| ------------------------------------------ | ---------- | --------------------------------------------------------------------------------- | --------- |
| [classification?](./ILIB_FootprintItem.md) |            | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类 |
| [description?](./ILIB_FootprintItem.md)    |            | string                                                                            | _（可选）_ 描述 |
| [libraryType](./ILIB_FootprintItem.md)     | `readonly` | [ELIB\_LibraryType.FOOTPRINT](../enums/ELIB_LibraryType.md)                       | 库类型       |
| [libraryUuid](./ILIB_FootprintItem.md)     |            | string                                                                            | 所属库 UUID  |
| [name](./ILIB_FootprintItem.md)            |            | string                                                                            | 封装名称      |
| [uuid](./ILIB_FootprintItem.md)            |            | string                                                                            | 封装 UUID   |

---

## 属性详情

### classification

# ILIB\_FootprintItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_FootprintItem.description property

描述

## 签名

```typescript
description?: string;
```

### librarytype

# ILIB\_FootprintItem.libraryType property

库类型

## 签名

```typescript
readonly libraryType: ELIB_LibraryType.FOOTPRINT;
```

### libraryuuid

# ILIB\_FootprintItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_FootprintItem.name property

封装名称

## 签名

```typescript
name: string;
```

### uuid

# ILIB\_FootprintItem.uuid property

封装 UUID

## 签名

```typescript
uuid: string;
```
