# SYS\_ToastMessage class

> 警告：此 API 现已弃用。
>
> 即将移除吐司消息类，合并入 [消息通知类](./SYS_Message.md)

系统 / 吐司消息类

## 签名

```typescript
declare class SYS_ToastMessage
```

## 备注

在屏幕的边缘弹出简短的消息提醒，会在一定时间后自动消除

## 方法

| 方法名                                                                                                           | 修饰符 | 描述     |
| ------------------------------------------------------------------------------------------------------------- | --- | ------ |
| [showMessage(message, messageType, timer, bottomPanel, buttonTitle, buttonCallbackFn)](./SYS_ToastMessage.md) |     | 显示吐司消息 |

---

## 方法详情

### showmessage

# SYS\_ToastMessage.showMessage() method

> 警告：此 API 现已弃用。
>
> 请使用 [SYS\_Message.showToastMessage()](./SYS_Message.md) 方法替代

显示吐司消息

## 签名

```typescript
showMessage(message: string, messageType?: ESYS_ToastMessageType, timer?: number, bottomPanel?: ESYS_BottomPanelTab, buttonTitle?: string, buttonCallbackFn?: string): void;
```

## 参数名

| 参数               | 类型                                                          | 描述                            |
| ---------------- | ----------------------------------------------------------- | ----------------------------- |
| message          | string                                                      | 消息内容                          |
| messageType      | [ESYS\_ToastMessageType](../enums/ESYS_ToastMessageType.md) | _（可选）_ 消息类型                   |
| timer            | number                                                      | _（可选）_ 自动关闭倒计时秒数，`0` 为不自动关闭   |
| bottomPanel      | [ESYS\_BottomPanelTab](../enums/ESYS_BottomPanelTab.md)     | _（可选）_ 展开底部信息面板               |
| buttonTitle      | string                                                      | _（可选）_ 回调按钮标题                 |
| buttonCallbackFn | string                                                      | _（可选）_ 回调函数内容，字符串形式，会被自动解析并执行 |



## 返回值

void
