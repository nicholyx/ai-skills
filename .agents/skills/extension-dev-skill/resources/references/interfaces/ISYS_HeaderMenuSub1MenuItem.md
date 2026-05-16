# ISYS\_HeaderMenuSub1MenuItem interface

顶部二级菜单项

## 签名

```typescript
interface ISYS_HeaderMenuSub1MenuItem
```

## 属性

| 属性名                                             | 修饰符 | 类型                                                                                    | 描述                            |
| ----------------------------------------------- | --- | ------------------------------------------------------------------------------------- | ----------------------------- |
| [icon?](./ISYS_HeaderMenuSub1MenuItem.md)       |     | string                                                                                | _（可选）_ 菜单项图标                  |
| [id](./ISYS_HeaderMenuSub1MenuItem.md)          |     | string                                                                                | 菜单项 ID，不可重复                   |
| [menuItems?](./ISYS_HeaderMenuSub1MenuItem.md)  |     | Array&lt;[ISYS\_HeaderMenuSub2MenuItem](./ISYS_HeaderMenuSub2MenuItem.md) \| null&gt; | _（可选）_ 子菜单项                   |
| [registerFn?](./ISYS_HeaderMenuSub1MenuItem.md) |     | string                                                                                | _（可选）_ 注册方法名称（需要在扩展入口文件导出该方法） |
| [title](./ISYS_HeaderMenuSub1MenuItem.md)       |     | string                                                                                | 菜单项标题                         |

---

## 属性详情

### icon

# ISYS\_HeaderMenuSub1MenuItem.icon property

菜单项图标

## 签名

```typescript
icon?: string;
```

### id

# ISYS\_HeaderMenuSub1MenuItem.id property

菜单项 ID，不可重复

## 签名

```typescript
id: string;
```

### menuitems

# ISYS\_HeaderMenuSub1MenuItem.menuItems property

子菜单项

## 签名

```typescript
menuItems?: Array<ISYS_HeaderMenuSub2MenuItem | null>;
```

### title

# ISYS\_HeaderMenuSub1MenuItem.title property

菜单项标题

## 签名

```typescript
title: string;
```


---

## 方法详情

### registerfn

# ISYS\_HeaderMenuSub1MenuItem.registerFn property

注册方法名称（需要在扩展入口文件导出该方法）

## 签名

```typescript
registerFn?: string;
```
