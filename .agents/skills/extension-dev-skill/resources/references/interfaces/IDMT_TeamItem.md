# IDMT\_TeamItem interface

团队属性

## 签名

```typescript
interface IDMT_TeamItem
```

## 属性

| 属性名                            | 修饰符        | 类型                                               | 描述                 |
| ------------------------------ | ---------- | ------------------------------------------------ | ------------------ |
| [identity](./IDMT_TeamItem.md) |            | number                                           | 当前用户在团队内的身份（权限组）ID |
| [itemType](./IDMT_TeamItem.md) | `readonly` | [EDMT\_ItemType.TEAM](../enums/EDMT_ItemType.md) | 项目类型               |
| [name](./IDMT_TeamItem.md)     |            | string                                           | 团队名称               |
| [uuid](./IDMT_TeamItem.md)     |            | string                                           | 团队 UUID            |

---

## 属性详情

### identity

# IDMT\_TeamItem.identity property

当前用户在团队内的身份（权限组）ID

## 签名

```typescript
identity: number;
```

### itemtype

# IDMT\_TeamItem.itemType property

项目类型

## 签名

```typescript
readonly itemType: EDMT_ItemType.TEAM;
```

### name

# IDMT\_TeamItem.name property

团队名称

## 签名

```typescript
name: string;
```

### uuid

# IDMT\_TeamItem.uuid property

团队 UUID

## 签名

```typescript
uuid: string;
```
