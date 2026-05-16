# ILIB\_PanelLibraryItem interface

面板库属性

## 签名

```typescript
interface ILIB_PanelLibraryItem
```

## 属性

| 属性名                                           | 修饰符        | 类型                                                                                | 描述        |
| --------------------------------------------- | ---------- | --------------------------------------------------------------------------------- | --------- |
| [classification?](./ILIB_PanelLibraryItem.md) |            | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类 |
| [description?](./ILIB_PanelLibraryItem.md)    |            | string                                                                            | _（可选）_ 描述 |
| [libraryType](./ILIB_PanelLibraryItem.md)     | `readonly` | [ELIB\_LibraryType.PANEL\_LIBRARY](../enums/ELIB_LibraryType.md)                  | 库类型       |
| [libraryUuid](./ILIB_PanelLibraryItem.md)     |            | string                                                                            | 所属库 UUID  |
| [name](./ILIB_PanelLibraryItem.md)            |            | string                                                                            | 面板库名称     |
| [uuid](./ILIB_PanelLibraryItem.md)            |            | string                                                                            | 面板库 UUID  |

---

## 属性详情

### classification

# ILIB\_PanelLibraryItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_PanelLibraryItem.description property

描述

## 签名

```typescript
description?: string;
```

### librarytype

# ILIB\_PanelLibraryItem.libraryType property

库类型

## 签名

```typescript
readonly libraryType: ELIB_LibraryType.PANEL_LIBRARY;
```

### libraryuuid

# ILIB\_PanelLibraryItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_PanelLibraryItem.name property

面板库名称

## 签名

```typescript
name: string;
```

### uuid

# ILIB\_PanelLibraryItem.uuid property

面板库 UUID

## 签名

```typescript
uuid: string;
```
