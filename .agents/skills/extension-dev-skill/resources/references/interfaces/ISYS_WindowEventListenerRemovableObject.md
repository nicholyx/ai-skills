# ISYS\_WindowEventListenerRemovableObject interface

窗口事件监听可移除对象

## 签名

```typescript
interface ISYS_WindowEventListenerRemovableObject
```

## 备注

本对象从 [addEventListener](../classes/SYS_Window.md) 获取，并可用于移除创建的事件监听，仅需将其传入 [removeEventListener](../classes/SYS_Window.md)

## 属性

| 属性名                                                      | 修饰符 | 类型                                                        | 描述           |
| -------------------------------------------------------- | --- | --------------------------------------------------------- | ------------ |
| [listener](./ISYS_WindowEventListenerRemovableObject.md) |     | (ev: any) =&gt; any                                       |              |
| [options?](./ISYS_WindowEventListenerRemovableObject.md) |     | \{ capture?: boolean; \}                                  | _(Optional)_ |
| [type](./ISYS_WindowEventListenerRemovableObject.md)     |     | [ESYS\_WindowEventType](../enums/ESYS_WindowEventType.md) |              |

---

## 属性详情

### listener

# ISYS\_WindowEventListenerRemovableObject.listener property

## 签名

```typescript
listener: (ev: any) => any;
```

### options

# ISYS\_WindowEventListenerRemovableObject.options property

## 签名

```typescript
options?: {
        capture?: boolean;
    };
```

### type

# ISYS\_WindowEventListenerRemovableObject.type property

## 签名

```typescript
type: ESYS_WindowEventType;
```
