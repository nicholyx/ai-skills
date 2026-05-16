# ILIB\_CbbItem interface

复用模块属性

## 签名

```typescript
interface ILIB_CbbItem
```

## 属性

| 属性名                                  | 修饰符        | 类型                                                                                | 描述        |
| ------------------------------------ | ---------- | --------------------------------------------------------------------------------- | --------- |
| [boards](./ILIB_CbbItem.md)          |            | Array&lt;[IDMT\_BoardItem](./IDMT_BoardItem.md)&gt;                               | 下属板子      |
| [classification?](./ILIB_CbbItem.md) |            | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类 |
| [description?](./ILIB_CbbItem.md)    |            | string                                                                            | _（可选）_ 描述 |
| [libraryType](./ILIB_CbbItem.md)     | `readonly` | [ELIB\_LibraryType.CBB](../enums/ELIB_LibraryType.md)                             | 库类型       |
| [libraryUuid](./ILIB_CbbItem.md)     |            | string                                                                            | 所属库 UUID  |
| [name](./ILIB_CbbItem.md)            |            | string                                                                            | 复用模块名称    |
| [uuid](./ILIB_CbbItem.md)            |            | string                                                                            | 复用模块 UUID |

---

## 属性详情

### boards

# ILIB\_CbbItem.boards property

下属板子

## 签名

```typescript
boards: Array<IDMT_BoardItem>;
```

### classification

# ILIB\_CbbItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_CbbItem.description property

描述

## 签名

```typescript
description?: string;
```

### librarytype

# ILIB\_CbbItem.libraryType property

库类型

## 签名

```typescript
readonly libraryType: ELIB_LibraryType.CBB;
```

### libraryuuid

# ILIB\_CbbItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_CbbItem.name property

复用模块名称

## 签名

```typescript
name: string;
```

### uuid

# ILIB\_CbbItem.uuid property

复用模块 UUID

## 签名

```typescript
uuid: string;
```
