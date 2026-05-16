# ILIB\_ExtendLibraryFunctions interface

外部库方法

## 签名

```typescript
interface ILIB_ExtendLibraryFunctions
```

## 属性

| 属性名                                                       | 修饰符 | 类型                                                                                                                                                                                                    | 描述     |
| --------------------------------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| [getClassificationTree](./ILIB_ExtendLibraryFunctions.md) |     | () =&gt; Promise&lt;Array&lt;{ name: string; uuid?: string; children?: Array&lt;{ name: string; uuid?: string; }&gt; \| undefined; }&gt;&gt;                                                          | 获取分类树  |
| [getDetail](./ILIB_ExtendLibraryFunctions.md)             |     | (uuid: string) =&gt; Promise&lt;any&gt;                                                                                                                                                               | 获取详细信息 |
| [getList](./ILIB_ExtendLibraryFunctions.md)               |     | (props: [ILIB\_ExtendLibrarySearchProperty](./ILIB_ExtendLibrarySearchProperty.md)&lt;any&gt;) =&gt; Promise&lt;[ILIB\_ExtendLibrarySearchResult](./ILIB_ExtendLibrarySearchResult.md)&lt;any&gt;&gt; | 获取列表   |

---

## 属性详情

### getclassificationtree

# ILIB\_ExtendLibraryFunctions.getClassificationTree property

获取分类树

## 签名

```typescript
getClassificationTree: () => Promise<Array<{
        name: string;
        uuid?: string;
        children?: Array<{
            name: string;
            uuid?: string;
        }> | undefined;
    }>>;
```

### getdetail

# ILIB\_ExtendLibraryFunctions.getDetail property

获取详细信息

## 签名

```typescript
getDetail: (uuid: string) => Promise<any>;
```

### getlist

# ILIB\_ExtendLibraryFunctions.getList property

获取列表

## 签名

```typescript
getList: (props: ILIB_ExtendLibrarySearchProperty<any>) => Promise<ILIB_ExtendLibrarySearchResult<any>>;
```
