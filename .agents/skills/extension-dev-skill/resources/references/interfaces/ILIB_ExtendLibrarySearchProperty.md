# ILIB\_ExtendLibrarySearchProperty interface

外部库搜索参数

## 签名

```typescript
interface ILIB_ExtendLibrarySearchProperty<T>
```

## 属性

| 属性名                                                | 修饰符 | 类型                                                                                                                                                                                         | 描述           |
| -------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| [page?](./ILIB_ExtendLibrarySearchProperty.md)     |     | number                                                                                                                                                                                     | _（可选）_ 页数    |
| [pageSize?](./ILIB_ExtendLibrarySearchProperty.md) |     | number                                                                                                                                                                                     | _（可选）_ 单页条目数 |
| [query](./ILIB_ExtendLibrarySearchProperty.md)     |     | T &amp; { wd?: string; listByTitles?: Array&lt;string&gt;; classification?: [ILIB\_ExtendLibraryClassificationIndex](./ILIB_ExtendLibraryClassificationIndex.md) \| Array&lt;string&gt;; } | 查询参数         |

---

## 属性详情

### page

# ILIB\_ExtendLibrarySearchProperty.page property

页数

## 签名

```typescript
page?: number;
```

### pagesize

# ILIB\_ExtendLibrarySearchProperty.pageSize property

单页条目数

## 签名

```typescript
pageSize?: number;
```

### query

# ILIB\_ExtendLibrarySearchProperty.query property

查询参数

## 签名

```typescript
query: T & {
        wd?: string;
        listByTitles?: Array<string>;
        classification?: ILIB_ExtendLibraryClassificationIndex | Array<string>;
    };
```
