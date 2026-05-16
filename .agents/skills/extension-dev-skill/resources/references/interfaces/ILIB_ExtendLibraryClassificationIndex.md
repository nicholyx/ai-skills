# ILIB\_ExtendLibraryClassificationIndex interface

> 警告：此 API 现已弃用。
>
> - since EDA v3.2; dropped EDA v3.3

外部库分类索引

## 签名

```typescript
interface ILIB_ExtendLibraryClassificationIndex
```

## 备注

支持外部库使用名称或 UUID 作为分类的唯一 ID 索引

## 属性

| 属性名                                                                        | 修饰符 | 类型     | 描述               |
| -------------------------------------------------------------------------- | --- | ------ | ---------------- |
| [primaryClassificationName?](./ILIB_ExtendLibraryClassificationIndex.md)   |     | string | _（可选）_ 一级分类名称    |
| [primaryClassificationUuid?](./ILIB_ExtendLibraryClassificationIndex.md)   |     | string | _（可选）_ 一级分类 UUID |
| [secondaryClassificationName?](./ILIB_ExtendLibraryClassificationIndex.md) |     | string | _（可选）_ 二级分类名称    |
| [secondaryClassificationUuid?](./ILIB_ExtendLibraryClassificationIndex.md) |     | string | _（可选）_ 二级分类 UUID |

---

## 属性详情

### primaryclassificationname

# ILIB\_ExtendLibraryClassificationIndex.primaryClassificationName property

一级分类名称

## 签名

```typescript
primaryClassificationName?: string;
```

### primaryclassificationuuid

# ILIB\_ExtendLibraryClassificationIndex.primaryClassificationUuid property

一级分类 UUID

## 签名

```typescript
primaryClassificationUuid?: string;
```

### secondaryclassificationname

# ILIB\_ExtendLibraryClassificationIndex.secondaryClassificationName property

二级分类名称

## 签名

```typescript
secondaryClassificationName?: string;
```

### secondaryclassificationuuid

# ILIB\_ExtendLibraryClassificationIndex.secondaryClassificationUuid property

二级分类 UUID

## 签名

```typescript
secondaryClassificationUuid?: string;
```
