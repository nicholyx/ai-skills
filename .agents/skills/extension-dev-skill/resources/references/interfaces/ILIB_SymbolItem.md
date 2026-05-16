# ILIB\_SymbolItem interface

符号属性

## 签名

```typescript
interface ILIB_SymbolItem
```

## 属性

| 属性名                                     | 修饰符        | 类型                                                                                | 描述                              |
| --------------------------------------- | ---------- | --------------------------------------------------------------------------------- | ------------------------------- |
| [cbbUuid?](./ILIB_SymbolItem.md)        |            | string                                                                            | _（可选）_ 所属复用模块 UUID，仅复用模块符号存在该属性 |
| [classification?](./ILIB_SymbolItem.md) |            | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类                       |
| [description?](./ILIB_SymbolItem.md)    |            | string                                                                            | _（可选）_ 描述                       |
| [libraryType](./ILIB_SymbolItem.md)     | `readonly` | [ELIB\_LibraryType.SYMBOL](../enums/ELIB_LibraryType.md)                          | 库类型                             |
| [libraryUuid](./ILIB_SymbolItem.md)     |            | string                                                                            | 所属库 UUID                        |
| [name](./ILIB_SymbolItem.md)            |            | string                                                                            | 符号名称                            |
| [type](./ILIB_SymbolItem.md)            |            | [ELIB\_SymbolType](../enums/ELIB_SymbolType.md)                                   | 符号类型                            |
| [uuid](./ILIB_SymbolItem.md)            |            | string                                                                            | 符号 UUID                         |

---

## 属性详情

### cbbuuid

# ILIB\_SymbolItem.cbbUuid property

所属复用模块 UUID，仅复用模块符号存在该属性

## 签名

```typescript
cbbUuid?: string;
```

### classification

# ILIB\_SymbolItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_SymbolItem.description property

描述

## 签名

```typescript
description?: string;
```

### librarytype

# ILIB\_SymbolItem.libraryType property

库类型

## 签名

```typescript
readonly libraryType: ELIB_LibraryType.SYMBOL;
```

### libraryuuid

# ILIB\_SymbolItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_SymbolItem.name property

符号名称

## 签名

```typescript
name: string;
```

### type

# ILIB\_SymbolItem.type property

符号类型

## 签名

```typescript
type: ELIB_SymbolType;
```

### uuid

# ILIB\_SymbolItem.uuid property

符号 UUID

## 签名

```typescript
uuid: string;
```
