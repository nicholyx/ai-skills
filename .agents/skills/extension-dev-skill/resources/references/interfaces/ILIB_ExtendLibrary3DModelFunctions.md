# ILIB\_ExtendLibrary3DModelFunctions interface

外部库 3D 模型方法

## 签名

```typescript
interface ILIB_ExtendLibrary3DModelFunctions extends ILIB_ExtendLibraryFunctions
```
**扩展自：**[ILIB\_ExtendLibraryFunctions](./ILIB_ExtendLibraryFunctions.md)

## 属性

| 属性名                                                | 修饰符 | 类型                                                                                                                                                                                                                                                                                                                                                                                          | 描述  |
| -------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| [getList](./ILIB_ExtendLibrary3DModelFunctions.md) |     | (props: [ILIB\_ExtendLibrarySearchProperty](./ILIB_ExtendLibrarySearchProperty.md)&lt;{}&gt;) =&gt; Promise&lt;[ILIB\_ExtendLibrarySearchResult](./ILIB_ExtendLibrarySearchResult.md)&lt;[ILIB\_ExtendLibraryItemIndex](./ILIB_ExtendLibraryItemIndex.md) &amp; [ILIB\_ExtendLibrarySearchResultDataLine](./ILIB_ExtendLibrarySearchResultDataLine.md) &amp; { modelType: 'step'; }&gt;&gt; |     |

---

## 属性详情

### getlist

# ILIB\_ExtendLibrary3DModelFunctions.getList property

## 签名

```typescript
getList: (props: ILIB_ExtendLibrarySearchProperty<{}>) => Promise<ILIB_ExtendLibrarySearchResult<ILIB_ExtendLibraryItemIndex & ILIB_ExtendLibrarySearchResultDataLine & {
        modelType: 'step';
    }>>;
```
