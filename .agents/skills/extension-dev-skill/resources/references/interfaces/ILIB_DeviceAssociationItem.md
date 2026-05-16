# ILIB\_DeviceAssociationItem interface

器件关联符号、封装属性

## 签名

```typescript
interface ILIB_DeviceAssociationItem
```

## 属性

| 属性名                                              | 修饰符 | 类型                                                                                            | 描述           |
| ------------------------------------------------ | --- | --------------------------------------------------------------------------------------------- | ------------ |
| [footprint?](./ILIB_DeviceAssociationItem.md)    |     | \{ uuid: string; libraryUuid: string; \}                                                      | _（可选）_ 封装    |
| [footprintUuid](./ILIB_DeviceAssociationItem.md) |     | string                                                                                        | 封装 UUID      |
| [images?](./ILIB_DeviceAssociationItem.md)       |     | Array&lt;string&gt;                                                                           | _(Optional)_ |
| [symbol](./ILIB_DeviceAssociationItem.md)        |     | { type: [ELIB\_SymbolType](../enums/ELIB_SymbolType.md); uuid: string; libraryUuid: string; } | 符号           |
| [symbolType](./ILIB_DeviceAssociationItem.md)    |     | [ELIB\_SymbolType](../enums/ELIB_SymbolType.md)                                               | 符号类型         |
| [symbolUuid](./ILIB_DeviceAssociationItem.md)    |     | string                                                                                        | 符号 UUID      |

---

## 属性详情

### footprint

# ILIB\_DeviceAssociationItem.footprint property

封装

## 签名

```typescript
footprint?: {
        uuid: string;
        libraryUuid: string;
    };
```

### footprintuuid

# ILIB\_DeviceAssociationItem.footprintUuid property

> 警告：此 API 现已弃用。
>
> 请使用 [footprint](./ILIB_DeviceSearchItem.md) 替代

封装 UUID

## 签名

```typescript
footprintUuid: string;
```

### images

# ILIB\_DeviceAssociationItem.images property

## 签名

```typescript
images?: Array<string>;
```

### symbol

# ILIB\_DeviceAssociationItem.symbol property

符号

## 签名

```typescript
symbol: {
        type: ELIB_SymbolType;
        uuid: string;
        libraryUuid: string;
    };
```

### symboltype

# ILIB\_DeviceAssociationItem.symbolType property

> 警告：此 API 现已弃用。
>
> 请使用 [symbol](./ILIB_DeviceSearchItem.md) 替代

符号类型

## 签名

```typescript
symbolType: ELIB_SymbolType;
```

### symboluuid

# ILIB\_DeviceAssociationItem.symbolUuid property

> 警告：此 API 现已弃用。
>
> 请使用 [symbol](./ILIB_DeviceSearchItem.md) 替代

符号 UUID

## 签名

```typescript
symbolUuid: string;
```
