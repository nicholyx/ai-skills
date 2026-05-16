# ISYS\_RightClickMenuItem interface

右键菜单项

## 签名

```typescript
interface ISYS_RightClickMenuItem
```

## 属性

| 属性名                                         | 修饰符 | 类型                                                                            | 描述                            |
| ------------------------------------------- | --- | ----------------------------------------------------------------------------- | ----------------------------- |
| [icon?](./ISYS_RightClickMenuItem.md)       |     | string                                                                        | _（可选）_ 菜单项图标                  |
| [id](./ISYS_RightClickMenuItem.md)          |     | string                                                                        | 菜单项 ID，不可重复                   |
| [menuItems?](./ISYS_RightClickMenuItem.md)  |     | Array&lt;[ISYS\_RightClickMenuItem](./ISYS_RightClickMenuItem.md) \| null&gt; | _（可选）_ 子菜单项                   |
| [registerFn?](./ISYS_RightClickMenuItem.md) |     | string                                                                        | _（可选）_ 注册方法名称（需要在扩展入口文件导出该方法） |
| [title?](./ISYS_RightClickMenuItem.md)      |     | string                                                                        | _（可选）_ 菜单项标题                  |

---

## 属性详情

### icon

# ISYS\_RightClickMenuItem.icon property

菜单项图标

## 签名

```typescript
icon?: string;
```

### id

# ISYS\_RightClickMenuItem.id property

菜单项 ID，不可重复

## 签名

```typescript
id: string;
```

### menuitems

# ISYS\_RightClickMenuItem.menuItems property

子菜单项

## 签名

```typescript
menuItems?: Array<ISYS_RightClickMenuItem | null>;
```

### title

# ISYS\_RightClickMenuItem.title property

菜单项标题

## 签名

```typescript
title?: string;
```


---

## 方法详情

### registerfn

# ISYS\_RightClickMenuItem.registerFn property

注册方法名称（需要在扩展入口文件导出该方法）

## 签名

```typescript
registerFn?: string;
```
