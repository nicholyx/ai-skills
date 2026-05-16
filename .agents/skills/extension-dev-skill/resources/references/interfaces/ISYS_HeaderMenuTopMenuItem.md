# ISYS\_HeaderMenuTopMenuItem interface

顶部一级菜单项

## 签名

```typescript
interface ISYS_HeaderMenuTopMenuItem
```

## 属性

| 属性名                                            | 修饰符 | 类型                                                                                    | 描述                            |
| ---------------------------------------------- | --- | ------------------------------------------------------------------------------------- | ----------------------------- |
| [id](./ISYS_HeaderMenuTopMenuItem.md)          |     | string                                                                                | 菜单项 ID，不可重复                   |
| [menuItems?](./ISYS_HeaderMenuTopMenuItem.md)  |     | Array&lt;[ISYS\_HeaderMenuSub1MenuItem](./ISYS_HeaderMenuSub1MenuItem.md) \| null&gt; | _（可选）_ 子菜单项                   |
| [registerFn?](./ISYS_HeaderMenuTopMenuItem.md) |     | string                                                                                | _（可选）_ 注册方法名称（需要在扩展入口文件导出该方法） |
| [title](./ISYS_HeaderMenuTopMenuItem.md)       |     | string                                                                                | 菜单项标题                         |

---

## 属性详情

### id

# ISYS\_HeaderMenuTopMenuItem.id property

菜单项 ID，不可重复

## 签名

```typescript
id: string;
```

### menuitems

# ISYS\_HeaderMenuTopMenuItem.menuItems property

子菜单项

## 签名

```typescript
menuItems?: Array<ISYS_HeaderMenuSub1MenuItem | null>;
```

### title

# ISYS\_HeaderMenuTopMenuItem.title property

菜单项标题

## 签名

```typescript
title: string;
```


---

## 方法详情

### registerfn

# ISYS\_HeaderMenuTopMenuItem.registerFn property

注册方法名称（需要在扩展入口文件导出该方法）

## 签名

```typescript
registerFn?: string;
```
