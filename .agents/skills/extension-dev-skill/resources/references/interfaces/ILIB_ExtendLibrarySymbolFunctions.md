# ILIB\_ExtendLibrarySymbolFunctions interface

外部库符号方法

## 签名

```typescript
interface ILIB_ExtendLibrarySymbolFunctions extends ILIB_ExtendLibraryFunctions
```
**扩展自：**[ILIB\_ExtendLibraryFunctions](./ILIB_ExtendLibraryFunctions.md)

## 属性

| 属性名                                                               | 修饰符 | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 描述        |
| ----------------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| [getList](./ILIB_ExtendLibrarySymbolFunctions.md)                 |     | (props: [ILIB\_ExtendLibrarySearchProperty](./ILIB_ExtendLibrarySearchProperty.md)&lt;{ symbolType?: [ELIB\_SymbolType](../enums/ELIB_SymbolType.md); }&gt;) =&gt; Promise&lt;[ILIB\_ExtendLibrarySearchResult](./ILIB_ExtendLibrarySearchResult.md)&lt;[ILIB\_ExtendLibraryItem](./ILIB_ExtendLibraryItem.md) &amp; [ILIB\_ExtendLibrarySearchResultDataLine](./ILIB_ExtendLibrarySearchResultDataLine.md) &amp; { symbolType: [ELIB\_SymbolType](../enums/ELIB_SymbolType.md); }&gt;&gt; |           |
| [getSupportedSymbolTypes](./ILIB_ExtendLibrarySymbolFunctions.md) |     | () =&gt; Promise&lt;Array&lt;[ELIB\_SymbolType](../enums/ELIB_SymbolType.md)&gt;&gt;                                                                                                                                                                                                                                                                                                                                                                                                       | 获取支持的符号类型 |

---

## 属性详情

### getlist

# ILIB\_ExtendLibrarySymbolFunctions.getList property

## 签名

```typescript
getList: (props: ILIB_ExtendLibrarySearchProperty<{
        symbolType?: ELIB_SymbolType;
    }>) => Promise<ILIB_ExtendLibrarySearchResult<ILIB_ExtendLibraryItem & ILIB_ExtendLibrarySearchResultDataLine & {
        symbolType: ELIB_SymbolType;
    }>>;
```

### getsupportedsymboltypes

# ILIB\_ExtendLibrarySymbolFunctions.getSupportedSymbolTypes property

获取支持的符号类型

## 签名

```typescript
getSupportedSymbolTypes: () => Promise<Array<ELIB_SymbolType>>;
```
