# SYS\_Window class

系统 / 窗口类

## 签名

```typescript
declare class SYS_Window
```

## 备注

为了保证安全性，仅提供有限的窗口跳转与监听支持，更多操作请使用内联框架窗口 [SYS\_IFrame](./SYS_IFrame.md)

## 方法

| 方法名                                                          | 修饰符 | 描述                |
| ------------------------------------------------------------ | --- | ----------------- |
| [addEventListener(type, listener, options)](./SYS_Window.md) |     | 新增事件监听            |
| [getCurrentTheme()](./SYS_Window.md)                         |     | 获取当前主题            |
| [getUrlAnchor()](./SYS_Window.md)                            |     | 获取 URL 锚点         |
| [getUrlParam(key)](./SYS_Window.md)                          |     | 获取 URL 参数         |
| [open(url, target)](./SYS_Window.md)                         |     | 打开资源窗口            |
| [openUI(uiName, args)](./SYS_Window.md)                      |     | 打开 UI 窗口          |
| [removeEventListener(removableObject)](./SYS_Window.md)      |     | 移除事件监听            |
| [urlPushState(url)](./SYS_Window.md)                         |     | 追加新的 URL 历史记录栈信息  |
| [urlReplaceState(url)](./SYS_Window.md)                      |     | 修改当前的 URL 历史记录栈信息 |

---

## 方法详情

### addeventlistener

# SYS\_Window.addEventListener() method

新增事件监听

## 签名

```typescript
addEventListener(type: ESYS_WindowEventType, listener: (ev: any) => any, options?: {
        capture?: boolean;
        once?: boolean;
        passive?: boolean;
        signal?: AbortSignal;
    }): ISYS_WindowEventListenerRemovableObject | undefined;
```

## 参数名

| 参数       | 类型                                                                                | 描述                       |
| -------- | --------------------------------------------------------------------------------- | ------------------------ |
| type     | [ESYS\_WindowEventType](../enums/ESYS_WindowEventType.md)                         | 事件类型，当前支持 `blur` `focus` |
| listener | (ev: any) =&gt; any                                                               | 事件监听回调                   |
| options  | \{ capture?: boolean; once?: boolean; passive?: boolean; signal?: AbortSignal; \} | _（可选）_ 可选参数              |



## 返回值

[ISYS\_WindowEventListenerRemovableObject](../interfaces/ISYS_WindowEventListenerRemovableObject.md) \| undefined

事件监听方法，用于移除事件监听，如若为 `undefined` 则表示创建事件监听失败

### getcurrenttheme

# SYS\_Window.getCurrentTheme() method

获取当前主题

## 签名

```typescript
getCurrentTheme(): Promise<ESYS_Theme>;
```


## 返回值

Promise&lt;[ESYS\_Theme](../enums/ESYS_Theme.md)&gt;

当前主题

## 备注

获取当前 EDA 主题，\*\*浅色\*\* 或 \*\*深色\*\*

### geturlanchor

# SYS\_Window.getUrlAnchor() method

获取 URL 锚点

## 签名

```typescript
getUrlAnchor(): string;
```


## 返回值

string

URL 锚点值

### geturlparam

# SYS\_Window.getUrlParam() method

获取 URL 参数

## 签名

```typescript
getUrlParam(key: string): string | null;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| key | string | 参数名 |



## 返回值

string \| null

参数值

### open

# SYS\_Window.open() method

打开资源窗口

## 签名

```typescript
open(url: string, target?: ESYS_WindowOpenTarget): void;
```

## 参数名

| 参数     | 类型                                                          | 描述             |
| ------ | ----------------------------------------------------------- | -------------- |
| url    | string                                                      | 欲加载资源的 URL 或路径 |
| target | [ESYS\_WindowOpenTarget](../enums/ESYS_WindowOpenTarget.md) | _（可选）_ 上下文目标   |



## 返回值

void

### openui

# SYS\_Window.openUI() method

打开 UI 窗口

## 签名

```typescript
openUI(uiName: string, args?: {
        [key: string]: any;
    }): Promise<void>;
```

## 参数名

| 参数     | 类型                          | 描述            |
| ------ | --------------------------- | ------------- |
| uiName | string                      | UI 名称         |
| args   | \{ \[key: string\]: any; \} | _（可选）_ 可选参数对象 |



## 返回值

Promise&lt;void&gt;

## 备注

非公开接口使用提醒：本接口按原样提供，不提供参数的额外文档，参数可能在任何版本出现破坏性更改并不另行通知

### removeeventlistener

# SYS\_Window.removeEventListener() method

移除事件监听

## 签名

```typescript
removeEventListener(removableObject: ISYS_WindowEventListenerRemovableObject): void;
```

## 参数名

| 参数              | 类型                                                                                                   | 描述          |
| --------------- | ---------------------------------------------------------------------------------------------------- | ----------- |
| removableObject | [ISYS\_WindowEventListenerRemovableObject](../interfaces/ISYS_WindowEventListenerRemovableObject.md) | 窗口事件监听可移除对象 |



## 返回值

void

### urlpushstate

# SYS\_Window.urlPushState() method

追加新的 URL 历史记录栈信息

## 签名

```typescript
urlPushState(url: string): void;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| url | string | URL |



## 返回值

void

### urlreplacestate

# SYS\_Window.urlReplaceState() method

修改当前的 URL 历史记录栈信息

## 签名

```typescript
urlReplaceState(url: string): void;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| url | string | URL |



## 返回值

void
