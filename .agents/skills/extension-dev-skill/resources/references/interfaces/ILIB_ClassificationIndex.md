# ILIB\_ClassificationIndex interface

> 警告：此 API 现已弃用。
>
> - since EDA v3.2; dropped EDA v3.3

分类索引

## 签名

```typescript
interface ILIB_ClassificationIndex
```

## 备注

本分类索引用于索引指定库内的分类，其中库 UUID 和库类型仅作针对于本索引的识别用途，防止将不同库内的索引互相引用从而引发错误

## 属性

| 属性名                                                           | 修饰符 | 类型                                                | 描述               |
| ------------------------------------------------------------- | --- | ------------------------------------------------- | ---------------- |
| [libraryType](./ILIB_ClassificationIndex.md)                  |     | [ELIB\_LibraryType](../enums/ELIB_LibraryType.md) | 库类型              |
| [libraryUuid](./ILIB_ClassificationIndex.md)                  |     | string                                            | 库 UUID           |
| [primaryClassificationUuid](./ILIB_ClassificationIndex.md)    |     | string                                            | 一级分类 UUID        |
| [secondaryClassificationUuid?](./ILIB_ClassificationIndex.md) |     | string                                            | _（可选）_ 二级分类 UUID |

---

## 属性详情

### librarytype

# ILIB\_ClassificationIndex.libraryType property

库类型

## 签名

```typescript
libraryType: ELIB_LibraryType;
```

### libraryuuid

# ILIB\_ClassificationIndex.libraryUuid property

库 UUID

## 签名

```typescript
libraryUuid: string;
```

### primaryclassificationuuid

# ILIB\_ClassificationIndex.primaryClassificationUuid property

一级分类 UUID

## 签名

```typescript
primaryClassificationUuid: string;
```

### secondaryclassificationuuid

# ILIB\_ClassificationIndex.secondaryClassificationUuid property

二级分类 UUID

## 签名

```typescript
secondaryClassificationUuid?: string;
```
