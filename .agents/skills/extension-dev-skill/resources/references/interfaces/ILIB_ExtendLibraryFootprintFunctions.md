# ILIB\_ExtendLibraryFootprintFunctions interface

外部库封装方法

## 签名

```typescript
interface ILIB_ExtendLibraryFootprintFunctions extends ILIB_ExtendLibraryFunctions
```
**扩展自：**[ILIB\_ExtendLibraryFunctions](./ILIB_ExtendLibraryFunctions.md)

## 属性

| 属性名                                                  | 修饰符 | 类型                                                                                                                                                                                                                                                                                                                                                   | 描述  |
| ---------------------------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| [getList](./ILIB_ExtendLibraryFootprintFunctions.md) |     | (props: [ILIB\_ExtendLibrarySearchProperty](./ILIB_ExtendLibrarySearchProperty.md)&lt;{}&gt;) =&gt; Promise&lt;[ILIB\_ExtendLibrarySearchResult](./ILIB_ExtendLibrarySearchResult.md)&lt;[ILIB\_ExtendLibraryItem](./ILIB_ExtendLibraryItem.md) &amp; [ILIB\_ExtendLibrarySearchResultDataLine](./ILIB_ExtendLibrarySearchResultDataLine.md)&gt;&gt; |     |

---

## 属性详情

### getlist

# ILIB\_ExtendLibraryFootprintFunctions.getList property

## 签名

```typescript
getList: (props: ILIB_ExtendLibrarySearchProperty<{}>) => Promise<ILIB_ExtendLibrarySearchResult<ILIB_ExtendLibraryItem & ILIB_ExtendLibrarySearchResultDataLine>>;
```
