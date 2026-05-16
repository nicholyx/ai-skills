# ILIB\_3DModelSearchItem interface

搜索到的 3D 模型属性

## 签名

```typescript
interface ILIB_3DModelSearchItem
```

## 属性

| 属性名                                            | 修饰符 | 类型                                                                                | 描述         |
| ---------------------------------------------- | --- | --------------------------------------------------------------------------------- | ---------- |
| [ascription](./ILIB_3DModelSearchItem.md)      |     | string                                                                            | 归属         |
| [classification?](./ILIB_3DModelSearchItem.md) |     | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类  |
| [description?](./ILIB_3DModelSearchItem.md)    |     | string                                                                            | _（可选）_ 描述  |
| [lastModifiedBy](./ILIB_3DModelSearchItem.md)  |     | string                                                                            | 前次修改者      |
| [libraryUuid](./ILIB_3DModelSearchItem.md)     |     | string                                                                            | 所属库 UUID   |
| [name](./ILIB_3DModelSearchItem.md)            |     | string                                                                            | 3D 模型名称    |
| [ordinal](./ILIB_3DModelSearchItem.md)         |     | number                                                                            | 排序         |
| [updateTimestamp](./ILIB_3DModelSearchItem.md) |     | number                                                                            | 更新时间戳      |
| [uuid](./ILIB_3DModelSearchItem.md)            |     | string                                                                            | 3D 模型 UUID |

---

## 属性详情

### ascription

# ILIB\_3DModelSearchItem.ascription property

归属

## 签名

```typescript
ascription: string;
```

### classification

# ILIB\_3DModelSearchItem.classification property

分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_3DModelSearchItem.description property

描述

## 签名

```typescript
description?: string;
```

### lastmodifiedby

# ILIB\_3DModelSearchItem.lastModifiedBy property

前次修改者

## 签名

```typescript
lastModifiedBy: string;
```

### libraryuuid

# ILIB\_3DModelSearchItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### name

# ILIB\_3DModelSearchItem.name property

3D 模型名称

## 签名

```typescript
name: string;
```

### ordinal

# ILIB\_3DModelSearchItem.ordinal property

排序

## 签名

```typescript
ordinal: number;
```

### updatetimestamp

# ILIB\_3DModelSearchItem.updateTimestamp property

更新时间戳

## 签名

```typescript
updateTimestamp: number;
```

### uuid

# ILIB\_3DModelSearchItem.uuid property

3D 模型 UUID

## 签名

```typescript
uuid: string;
```
