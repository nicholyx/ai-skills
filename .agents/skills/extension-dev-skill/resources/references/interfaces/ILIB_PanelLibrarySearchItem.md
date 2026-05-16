# ILIB\_PanelLibrarySearchItem interface

搜索到的面板库属性

## 签名

```typescript
interface ILIB_PanelLibrarySearchItem
```

## 属性

| 属性名                                                 | 修饰符 | 类型                                                                                | 描述        |
| --------------------------------------------------- | --- | --------------------------------------------------------------------------------- | --------- |
| [ascription](./ILIB_PanelLibrarySearchItem.md)      |     | string                                                                            | 归属        |
| [classification?](./ILIB_PanelLibrarySearchItem.md) |     | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类 |
| [description?](./ILIB_PanelLibrarySearchItem.md)    |     | string                                                                            | _（可选）_ 描述 |
| [lastModifiedBy](./ILIB_PanelLibrarySearchItem.md)  |     | string                                                                            | 前次修改者     |
| [libraryUuid](./ILIB_PanelLibrarySearchItem.md)     |     | string                                                                            | 所属库 UUID  |
| [name](./ILIB_PanelLibrarySearchItem.md)            |     | string                                                                            | 面板库名称     |
| [ordinal](./ILIB_PanelLibrarySearchItem.md)         |     | number                                                                            | 排序        |
| [updateTimestamp](./ILIB_PanelLibrarySearchItem.md) |     | number                                                                            | 更新时间戳     |
| [uuid](./ILIB_PanelLibrarySearchItem.md)            |     | string                                                                            | 面板库 UUID  |

---

## 属性详情

### ascription

# ILIB\_PanelLibrarySearchItem.ascription property

归属

## 签名

```typescript
ascription: string;
```

### classification

# ILIB\_PanelLibrarySearchItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_PanelLibrarySearchItem.description property

描述

## 签名

```typescript
description?: string;
```

### lastmodifiedby

# ILIB\_PanelLibrarySearchItem.lastModifiedBy property

前次修改者

## 签名

```typescript
lastModifiedBy: string;
```

### libraryuuid

# ILIB\_PanelLibrarySearchItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_PanelLibrarySearchItem.name property

面板库名称

## 签名

```typescript
name: string;
```

### ordinal

# ILIB\_PanelLibrarySearchItem.ordinal property

排序

## 签名

```typescript
ordinal: number;
```

### updatetimestamp

# ILIB\_PanelLibrarySearchItem.updateTimestamp property

更新时间戳

## 签名

```typescript
updateTimestamp: number;
```

### uuid

# ILIB\_PanelLibrarySearchItem.uuid property

面板库 UUID

## 签名

```typescript
uuid: string;
```
