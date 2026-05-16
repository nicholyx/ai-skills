# ILIB\_SymbolSearchItem interface

搜索到的符号属性

## 签名

```typescript
interface ILIB_SymbolSearchItem
```

## 属性

| 属性名                                           | 修饰符 | 类型                                                                                | 描述        |
| --------------------------------------------- | --- | --------------------------------------------------------------------------------- | --------- |
| [ascription](./ILIB_SymbolSearchItem.md)      |     | string                                                                            | 归属        |
| [classification?](./ILIB_SymbolSearchItem.md) |     | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类 |
| [description?](./ILIB_SymbolSearchItem.md)    |     | string                                                                            | _（可选）_ 描述 |
| [lastModifiedBy](./ILIB_SymbolSearchItem.md)  |     | string                                                                            | 前次修改者     |
| [libraryUuid](./ILIB_SymbolSearchItem.md)     |     | string                                                                            | 所属库 UUID  |
| [name](./ILIB_SymbolSearchItem.md)            |     | string                                                                            | 符号名称      |
| [ordinal](./ILIB_SymbolSearchItem.md)         |     | number                                                                            | 排序        |
| [type](./ILIB_SymbolSearchItem.md)            |     | [ELIB\_SymbolType](../enums/ELIB_SymbolType.md)                                   | 符号类型      |
| [updateTimestamp](./ILIB_SymbolSearchItem.md) |     | number                                                                            | 更新时间戳     |
| [uuid](./ILIB_SymbolSearchItem.md)            |     | string                                                                            | 符号 UUID   |

---

## 属性详情

### ascription

# ILIB\_SymbolSearchItem.ascription property

归属

## 签名

```typescript
ascription: string;
```

### classification

# ILIB\_SymbolSearchItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_SymbolSearchItem.description property

描述

## 签名

```typescript
description?: string;
```

### lastmodifiedby

# ILIB\_SymbolSearchItem.lastModifiedBy property

前次修改者

## 签名

```typescript
lastModifiedBy: string;
```

### libraryuuid

# ILIB\_SymbolSearchItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_SymbolSearchItem.name property

符号名称

## 签名

```typescript
name: string;
```

### ordinal

# ILIB\_SymbolSearchItem.ordinal property

排序

## 签名

```typescript
ordinal: number;
```

### type

# ILIB\_SymbolSearchItem.type property

符号类型

## 签名

```typescript
type: ELIB_SymbolType;
```

### updatetimestamp

# ILIB\_SymbolSearchItem.updateTimestamp property

更新时间戳

## 签名

```typescript
updateTimestamp: number;
```

### uuid

# ILIB\_SymbolSearchItem.uuid property

符号 UUID

## 签名

```typescript
uuid: string;
```
