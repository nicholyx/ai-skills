# IPCB\_BomPropertiesTableColumns interface

BOM 列的属性及排序规则

## 签名

```typescript
interface IPCB_BomPropertiesTableColumns
```

## 属性

| 属性名                                                 | 修饰符 | 类型                      | 描述                          |
| --------------------------------------------------- | --- | ----------------------- | --------------------------- |
| [group?](./IPCB_BomPropertiesTableColumns.md)       |     | null \| 'Yes' \| 'No'   | _（可选）_ 是否分组                 |
| [orderWeight?](./IPCB_BomPropertiesTableColumns.md) |     | number                  | _（可选）_ 排列权重（大权重优先在 BOM 的左侧） |
| [property](./IPCB_BomPropertiesTableColumns.md)     |     | string                  | 属性                          |
| [sort?](./IPCB_BomPropertiesTableColumns.md)        |     | null \| 'asc' \| 'desc' | _（可选）_ 排序规则                 |
| [title?](./IPCB_BomPropertiesTableColumns.md)       |     | string                  | _（可选）_ 显示名称                 |

---

## 属性详情

### group

# IPCB\_BomPropertiesTableColumns.group property

是否分组

## 签名

```typescript
group?: null | 'Yes' | 'No';
```

### orderweight

# IPCB\_BomPropertiesTableColumns.orderWeight property

排列权重（大权重优先在 BOM 的左侧）

## 签名

```typescript
orderWeight?: number;
```

### property

# IPCB\_BomPropertiesTableColumns.property property

属性

## 签名

```typescript
property: string;
```

### sort

# IPCB\_BomPropertiesTableColumns.sort property

排序规则

## 签名

```typescript
sort?: null | 'asc' | 'desc';
```

### title

# IPCB\_BomPropertiesTableColumns.title property

显示名称

## 签名

```typescript
title?: string;
```
