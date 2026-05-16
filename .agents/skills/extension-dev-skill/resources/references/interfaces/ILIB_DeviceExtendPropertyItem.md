# ILIB\_DeviceExtendPropertyItem interface

器件扩展属性

## 签名

```typescript
interface ILIB_DeviceExtendPropertyItem
```

## 属性

| 属性名                                                   | 修饰符 | 类型                                                               | 描述            |
| ----------------------------------------------------- | --- | ---------------------------------------------------------------- | ------------- |
| [addIntoBom?](./ILIB_DeviceExtendPropertyItem.md)     |     | boolean                                                          | _（可选）_ 加入 BOM |
| [addIntoPcb?](./ILIB_DeviceExtendPropertyItem.md)     |     | boolean                                                          | _（可选）_ 转到 PCB |
| [designator?](./ILIB_DeviceExtendPropertyItem.md)     |     | string                                                           | _（可选）_ 位号     |
| [manufacturer?](./ILIB_DeviceExtendPropertyItem.md)   |     | string                                                           | _（可选）_ 制造商    |
| [manufacturerId?](./ILIB_DeviceExtendPropertyItem.md) |     | string                                                           | _（可选）_ 制造商编号  |
| [name?](./ILIB_DeviceExtendPropertyItem.md)           |     | string                                                           | _（可选）_ 名称     |
| [net?](./ILIB_DeviceExtendPropertyItem.md)            |     | string                                                           | _（可选）_ 网络     |
| [otherProperty?](./ILIB_DeviceExtendPropertyItem.md)  |     | \{ \[key: string\]: boolean \| number \| string \| undefined; \} | _（可选）_ 其它参数   |
| [supplier?](./ILIB_DeviceExtendPropertyItem.md)       |     | string                                                           | _（可选）_ 供应商    |
| [supplierId?](./ILIB_DeviceExtendPropertyItem.md)     |     | string                                                           | _（可选）_ 供应商编号  |

---

## 属性详情

### addintobom

# ILIB\_DeviceExtendPropertyItem.addIntoBom property

加入 BOM

## 签名

```typescript
addIntoBom?: boolean;
```

### addintopcb

# ILIB\_DeviceExtendPropertyItem.addIntoPcb property

转到 PCB

## 签名

```typescript
addIntoPcb?: boolean;
```

### designator

# ILIB\_DeviceExtendPropertyItem.designator property

位号

## 签名

```typescript
designator?: string;
```

### manufacturer

# ILIB\_DeviceExtendPropertyItem.manufacturer property

制造商

## 签名

```typescript
manufacturer?: string;
```

### manufacturerid

# ILIB\_DeviceExtendPropertyItem.manufacturerId property

制造商编号

## 签名

```typescript
manufacturerId?: string;
```

### name

# ILIB\_DeviceExtendPropertyItem.name property

名称

## 签名

```typescript
name?: string;
```

### net

# ILIB\_DeviceExtendPropertyItem.net property

网络

## 签名

```typescript
net?: string;
```

### otherproperty

# ILIB\_DeviceExtendPropertyItem.otherProperty property

其它参数

## 签名

```typescript
otherProperty?: {
        [key: string]: boolean | number | string | undefined;
    };
```

### supplier

# ILIB\_DeviceExtendPropertyItem.supplier property

供应商

## 签名

```typescript
supplier?: string;
```

### supplierid

# ILIB\_DeviceExtendPropertyItem.supplierId property

供应商编号

## 签名

```typescript
supplierId?: string;
```
