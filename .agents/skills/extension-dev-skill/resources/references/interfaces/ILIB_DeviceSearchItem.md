# ILIB\_DeviceSearchItem interface

搜索到的器件属性

## 签名

```typescript
interface ILIB_DeviceSearchItem
```

## 属性

| 属性名                                               | 修饰符 | 类型                                                                                | 描述                |
| ------------------------------------------------- | --- | --------------------------------------------------------------------------------- | ----------------- |
| [classification?](./ILIB_DeviceSearchItem.md)     |     | [ILIB\_ClassificationIndex](./ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 器件分类       |
| [description?](./ILIB_DeviceSearchItem.md)        |     | string                                                                            | _（可选）_ 描述         |
| [footprint?](./ILIB_DeviceSearchItem.md)          |     | \{ name: string; uuid: string; libraryUuid: string; \}                            | _（可选）_ 关联封装       |
| [footprintName?](./ILIB_DeviceSearchItem.md)      |     | string                                                                            | _（可选）_ 关联封装名称     |
| [footprintUuid](./ILIB_DeviceSearchItem.md)       |     | string                                                                            | 关联封装 UUID         |
| [imageUuid?](./ILIB_DeviceSearchItem.md)          |     | string                                                                            | _（可选）_ 关联图片 UUID  |
| [jlcInventory?](./ILIB_DeviceSearchItem.md)       |     | number                                                                            | _（可选）_ 嘉立创库存      |
| [jlcLibraryCategory?](./ILIB_DeviceSearchItem.md) |     | [ELIB\_DeviceJlcLibraryCategory](../enums/ELIB_DeviceJlcLibraryCategory.md)       | _（可选）_ 嘉立创库类别     |
| [jlcPrice?](./ILIB_DeviceSearchItem.md)           |     | number                                                                            | _（可选）_ 嘉立创价格      |
| [lcscInventory?](./ILIB_DeviceSearchItem.md)      |     | number                                                                            | _（可选）_ 立创商城库存     |
| [lcscPrice?](./ILIB_DeviceSearchItem.md)          |     | number                                                                            | _（可选）_ 立创商城价格     |
| [libraryUuid](./ILIB_DeviceSearchItem.md)         |     | string                                                                            | 所属库 UUID          |
| [manufacturer?](./ILIB_DeviceSearchItem.md)       |     | string                                                                            | _（可选）_ 制造商        |
| [manufacturerId?](./ILIB_DeviceSearchItem.md)     |     | string                                                                            | _（可选）_ 制造商编号      |
| [model3D?](./ILIB_DeviceSearchItem.md)            |     | \{ name: string; uuid: string; libraryUuid: string; \}                            | _（可选）_ 关联 3D 模型   |
| [model3DName?](./ILIB_DeviceSearchItem.md)        |     | string                                                                            | _（可选）_ 关联 3D 模型名称 |
| [model3DUuid](./ILIB_DeviceSearchItem.md)         |     | string                                                                            | 关联 3D 模型 UUID     |
| [name](./ILIB_DeviceSearchItem.md)                |     | string                                                                            | 器件名称              |
| [ordinal](./ILIB_DeviceSearchItem.md)             |     | number                                                                            | 排序                |
| [otherProperty?](./ILIB_DeviceSearchItem.md)      |     | \{ \[key: string\]: boolean \| number \| string \| undefined; \}                  | _（可选）_ 其它参数       |
| [supplier?](./ILIB_DeviceSearchItem.md)           |     | string                                                                            | _（可选）_ 供应商        |
| [supplierId?](./ILIB_DeviceSearchItem.md)         |     | string                                                                            | _（可选）_ 供应商编号      |
| [symbol](./ILIB_DeviceSearchItem.md)              |     | \{ name: string; uuid: string; libraryUuid: string; \}                            | 关联符号              |
| [symbolName](./ILIB_DeviceSearchItem.md)          |     | string                                                                            | 关联符号名称            |
| [symbolUuid](./ILIB_DeviceSearchItem.md)          |     | string                                                                            | 关联符号 UUID         |
| [uuid](./ILIB_DeviceSearchItem.md)                |     | string                                                                            | 器件 UUID           |

---

## 属性详情

### classification

# ILIB\_DeviceSearchItem.classification property

器件分类

## 签名

```typescript
classification?: ILIB_ClassificationIndex | Array<string>;
```

### description

# ILIB\_DeviceSearchItem.description property

描述

## 签名

```typescript
description?: string;
```

### footprint

# ILIB\_DeviceSearchItem.footprint property

关联封装

## 签名

```typescript
footprint?: {
        name: string;
        uuid: string;
        libraryUuid: string;
    };
```

### footprintname

# ILIB\_DeviceSearchItem.footprintName property

> 警告：此 API 现已弃用。
>
> 请使用 [footprint](./ILIB_DeviceSearchItem.md) 替代

关联封装名称

## 签名

```typescript
footprintName?: string;
```

### footprintuuid

# ILIB\_DeviceSearchItem.footprintUuid property

> 警告：此 API 现已弃用。
>
> 请使用 [footprint](./ILIB_DeviceSearchItem.md) 替代

关联封装 UUID

## 签名

```typescript
footprintUuid: string;
```

### imageuuid

# ILIB\_DeviceSearchItem.imageUuid property

关联图片 UUID

## 签名

```typescript
imageUuid?: string;
```

### jlcinventory

# ILIB\_DeviceSearchItem.jlcInventory property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

嘉立创库存

## 签名

```typescript
jlcInventory?: number;
```

### jlclibrarycategory

# ILIB\_DeviceSearchItem.jlcLibraryCategory property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

嘉立创库类别

## 签名

```typescript
jlcLibraryCategory?: ELIB_DeviceJlcLibraryCategory;
```

### jlcprice

# ILIB\_DeviceSearchItem.jlcPrice property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

嘉立创价格

## 签名

```typescript
jlcPrice?: number;
```

### lcscinventory

# ILIB\_DeviceSearchItem.lcscInventory property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

立创商城库存

## 签名

```typescript
lcscInventory?: number;
```

### lcscprice

# ILIB\_DeviceSearchItem.lcscPrice property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

立创商城价格

## 签名

```typescript
lcscPrice?: number;
```

### libraryuuid

# ILIB\_DeviceSearchItem.libraryUuid property

所属库 UUID

## 签名

```typescript
libraryUuid: string;
```

### manufacturer

# ILIB\_DeviceSearchItem.manufacturer property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

制造商

## 签名

```typescript
manufacturer?: string;
```

### manufacturerid

# ILIB\_DeviceSearchItem.manufacturerId property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

制造商编号

## 签名

```typescript
manufacturerId?: string;
```

### model3d

# ILIB\_DeviceSearchItem.model3D property

关联 3D 模型

## 签名

```typescript
model3D?: {
        name: string;
        uuid: string;
        libraryUuid: string;
    };
```

### model3dname

# ILIB\_DeviceSearchItem.model3DName property

> 警告：此 API 现已弃用。
>
> 请使用 [model3D](./ILIB_DeviceSearchItem.md) 替代

关联 3D 模型名称

## 签名

```typescript
model3DName?: string;
```

### model3duuid

# ILIB\_DeviceSearchItem.model3DUuid property

> 警告：此 API 现已弃用。
>
> 请使用 [model3D](./ILIB_DeviceSearchItem.md) 替代

关联 3D 模型 UUID

## 签名

```typescript
model3DUuid: string;
```

### name

# ILIB\_DeviceSearchItem.name property

器件名称

## 签名

```typescript
name: string;
```

### ordinal

# ILIB\_DeviceSearchItem.ordinal property

排序

## 签名

```typescript
ordinal: number;
```

### otherproperty

# ILIB\_DeviceSearchItem.otherProperty property

其它参数

## 签名

```typescript
otherProperty?: {
        [key: string]: boolean | number | string | undefined;
    };
```

### supplier

# ILIB\_DeviceSearchItem.supplier property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

供应商

## 签名

```typescript
supplier?: string;
```

### supplierid

# ILIB\_DeviceSearchItem.supplierId property

> 警告：此 API 现已弃用。
>
> 在 `otherProperty` 中替代

供应商编号

## 签名

```typescript
supplierId?: string;
```

### symbol

# ILIB\_DeviceSearchItem.symbol property

关联符号

## 签名

```typescript
symbol: {
        name: string;
        uuid: string;
        libraryUuid: string;
    };
```

### symbolname

# ILIB\_DeviceSearchItem.symbolName property

> 警告：此 API 现已弃用。
>
> 请使用 [symbol](./ILIB_DeviceSearchItem.md) 替代

关联符号名称

## 签名

```typescript
symbolName: string;
```

### symboluuid

# ILIB\_DeviceSearchItem.symbolUuid property

> 警告：此 API 现已弃用。
>
> 请使用 [symbol](./ILIB_DeviceSearchItem.md) 替代

关联符号 UUID

## 签名

```typescript
symbolUuid: string;
```

### uuid

# ILIB\_DeviceSearchItem.uuid property

器件 UUID

## 签名

```typescript
uuid: string;
```
