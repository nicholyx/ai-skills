# SYS\_MessageBus class

系统 / 消息总线类

## 签名

```typescript
declare class SYS_MessageBus
```

## 备注


## 方法

| 方法名                                                           | 修饰符 | 描述                    |
| ------------------------------------------------------------- | --- | --------------------- |
| [createPrivateMessageBus()](./SYS_MessageBus.md)              |     | 创建私有消息总线              |
| [publish(topic, message)](./SYS_MessageBus.md)                |     | 私有消息总线：发布消息           |
| [publishPublic(topic, message)](./SYS_MessageBus.md)          |     | 公共消息总线：发布消息           |
| [pull(topic, callbackFn)](./SYS_MessageBus.md)                |     | 私有消息总线：拉消息            |
| [pullAsync(topic)](./SYS_MessageBus.md)                       |     | 私有消息总线：拉消息 Promise 版本 |
| [pullAsyncPublic(topic)](./SYS_MessageBus.md)                 |     | 公共消息总线：拉消息 Promise 版本 |
| [pullPublic(topic, callbackFn)](./SYS_MessageBus.md)          |     | 公共消息总线：拉消息            |
| [push(topic, message)](./SYS_MessageBus.md)                   |     | 私有消息总线：推消息            |
| [pushPublic(topic, message)](./SYS_MessageBus.md)             |     | 公共消息总线：推消息            |
| [removePrivateMessageBus()](./SYS_MessageBus.md)              |     | 移除私有消息总线              |
| [rpcCall(topic, message, timeout)](./SYS_MessageBus.md)       |     | 私有消息总线：调用 RPC 服务      |
| [rpcCallPublic(topic, message, timeout)](./SYS_MessageBus.md) |     | 公共消息总线：调用 RPC 服务      |
| [rpcService(topic, callbackFn)](./SYS_MessageBus.md)          |     | 私有消息总线：注册 RPC 服务      |
| [rpcServicePublic(topic, callbackFn)](./SYS_MessageBus.md)    |     | 公共消息总线：注册 RPC 服务      |
| [subscribe(topic, callbackFn)](./SYS_MessageBus.md)           |     | 私有消息总线：订阅消息           |
| [subscribeOnce(topic, callbackFn)](./SYS_MessageBus.md)       |     | 私有消息总线：订阅单次消息         |
| [subscribeOncePublic(topic, callbackFn)](./SYS_MessageBus.md) |     | 公共消息总线：订阅单次消息         |
| [subscribePublic(topic, callbackFn)](./SYS_MessageBus.md)     |     | 公共消息总线：订阅消息           |

---

## 方法详情

### createprivatemessagebus

# SYS\_MessageBus.createPrivateMessageBus() method

创建私有消息总线

## 签名

```typescript
createPrivateMessageBus(): void;
```


## 返回值

void

## 备注

一般无需调用该方法，在进行监听或发送消息时会自动创建私有消息总线

### publish

# SYS\_MessageBus.publish() method

私有消息总线：发布消息

## 签名

```typescript
publish(topic: string, message: any): void;
```

## 参数名

| 参数      | 类型     | 描述  |
| ------- | ------ | --- |
| topic   | string | 主题  |
| message | any    | 消息  |



## 返回值

void

## 备注

将消息广播给每一个 Subscriber

### publishpublic

# SYS\_MessageBus.publishPublic() method

公共消息总线：发布消息

## 签名

```typescript
publishPublic(topic: string, message: any): void;
```

## 参数名

| 参数      | 类型     | 描述  |
| ------- | ------ | --- |
| topic   | string | 主题  |
| message | any    | 消息  |



## 返回值

void

## 备注

将消息广播给每一个 Subscriber

### pull

# SYS\_MessageBus.pull() method

私有消息总线：拉消息

## 签名

```typescript
pull(topic: string, callbackFn: (message: any) => void): ISYS_MessageBusTask;
```

## 参数名

| 参数         | 类型                        | 描述       |
| ---------- | ------------------------- | -------- |
| topic      | string                    | 主题       |
| callbackFn | (message: any) =&gt; void | 拉到消息后的回调 |



## 返回值

[ISYS\_MessageBusTask](../interfaces/ISYS_MessageBusTask.md)

消息总线任务

## 备注

每次只能拉一个消息

### pullasync

# SYS\_MessageBus.pullAsync() method

私有消息总线：拉消息 Promise 版本

## 签名

```typescript
pullAsync(topic: string): Promise<any>;
```

## 参数名

| 参数    | 类型     | 描述  |
| ----- | ------ | --- |
| topic | string | 主题  |



## 返回值

Promise&lt;any&gt;

拉取到的消息

## 备注

每次只能拉一个消息，可以使用 `await` 等待消息拉取

### pullasyncpublic

# SYS\_MessageBus.pullAsyncPublic() method

公共消息总线：拉消息 Promise 版本

## 签名

```typescript
pullAsyncPublic(topic: string): Promise<any>;
```

## 参数名

| 参数    | 类型     | 描述  |
| ----- | ------ | --- |
| topic | string | 主题  |



## 返回值

Promise&lt;any&gt;

拉取到的消息

## 备注

每次只能拉一个消息，可以使用 `await` 等待消息拉取

### pullpublic

# SYS\_MessageBus.pullPublic() method

公共消息总线：拉消息

## 签名

```typescript
pullPublic(topic: string, callbackFn: (message: any) => void): ISYS_MessageBusTask;
```

## 参数名

| 参数         | 类型                        | 描述       |
| ---------- | ------------------------- | -------- |
| topic      | string                    | 主题       |
| callbackFn | (message: any) =&gt; void | 拉到消息后的回调 |



## 返回值

[ISYS\_MessageBusTask](../interfaces/ISYS_MessageBusTask.md)

消息总线任务

## 备注

每次只能拉一个消息

### push

# SYS\_MessageBus.push() method

私有消息总线：推消息

## 签名

```typescript
push(topic: string, message: any): void;
```

## 参数名

| 参数      | 类型     | 描述  |
| ------- | ------ | --- |
| topic   | string | 主题  |
| message | any    | 消息  |



## 返回值

void

## 备注

每个消息只有一个 Puller 可以收到

### pushpublic

# SYS\_MessageBus.pushPublic() method

公共消息总线：推消息

## 签名

```typescript
pushPublic(topic: string, message: any): void;
```

## 参数名

| 参数      | 类型     | 描述  |
| ------- | ------ | --- |
| topic   | string | 主题  |
| message | any    | 消息  |



## 返回值

void

## 备注

每个消息只有一个 Puller 可以收到

### removeprivatemessagebus

# SYS\_MessageBus.removePrivateMessageBus() method

移除私有消息总线

## 签名

```typescript
removePrivateMessageBus(): void;
```


## 返回值

void

## 备注

一般无需调用该方法，除非你知道自己在做什么

### rpccall

# SYS\_MessageBus.rpcCall() method

私有消息总线：调用 RPC 服务

## 签名

```typescript
rpcCall(topic: string, message?: any, timeout?: number): Promise<any>;
```

## 参数名

| 参数      | 类型     | 描述        |
| ------- | ------ | --------- |
| topic   | string | 主题        |
| message | any    | _（可选）_ 消息 |
| timeout | number | _（可选）_ 超时 |



## 返回值

Promise&lt;any&gt;

RPC 服务返回

### rpccallpublic

# SYS\_MessageBus.rpcCallPublic() method

公共消息总线：调用 RPC 服务

## 签名

```typescript
rpcCallPublic(topic: string, message?: any, timeout?: number): Promise<any>;
```

## 参数名

| 参数      | 类型     | 描述        |
| ------- | ------ | --------- |
| topic   | string | 主题        |
| message | any    | _（可选）_ 消息 |
| timeout | number | _（可选）_ 超时 |



## 返回值

Promise&lt;any&gt;

RPC 服务返回

### rpcservice

# SYS\_MessageBus.rpcService() method

私有消息总线：注册 RPC 服务

## 签名

```typescript
rpcService(topic: string, callbackFn: (...args: Array<any>) => any | Promise<any>): void;
```

## 参数名

| 参数         | 类型                                                          | 描述        |
| ---------- | ----------------------------------------------------------- | --------- |
| topic      | string                                                      | 主题        |
| callbackFn | (...args: Array&lt;any&gt;) =&gt; any \| Promise&lt;any&gt; | 接收到消息后的回调 |



## 返回值

void

### rpcservicepublic

# SYS\_MessageBus.rpcServicePublic() method

公共消息总线：注册 RPC 服务

## 签名

```typescript
rpcServicePublic(topic: string, callbackFn: (...args: Array<any>) => any | Promise<any>): void;
```

## 参数名

| 参数         | 类型                                                          | 描述        |
| ---------- | ----------------------------------------------------------- | --------- |
| topic      | string                                                      | 主题        |
| callbackFn | (...args: Array&lt;any&gt;) =&gt; any \| Promise&lt;any&gt; | 接收到消息后的回调 |



## 返回值

void

### subscribe

# SYS\_MessageBus.subscribe() method

私有消息总线：订阅消息

## 签名

```typescript
subscribe(topic: string, callbackFn: (message: any) => void): ISYS_MessageBusTask;
```

## 参数名

| 参数         | 类型                        | 描述        |
| ---------- | ------------------------- | --------- |
| topic      | string                    | 主题        |
| callbackFn | (message: any) =&gt; void | 接收到消息后的回调 |



## 返回值

[ISYS\_MessageBusTask](../interfaces/ISYS_MessageBusTask.md)

消息总线任务

## 备注

持久性订阅消息

### subscribeonce

# SYS\_MessageBus.subscribeOnce() method

私有消息总线：订阅单次消息

## 签名

```typescript
subscribeOnce(topic: string, callbackFn: (message: any) => void): ISYS_MessageBusTask;
```

## 参数名

| 参数         | 类型                        | 描述        |
| ---------- | ------------------------- | --------- |
| topic      | string                    | 主题        |
| callbackFn | (message: any) =&gt; void | 接收到消息后的回调 |



## 返回值

[ISYS\_MessageBusTask](../interfaces/ISYS_MessageBusTask.md)

消息总线任务

### subscribeoncepublic

# SYS\_MessageBus.subscribeOncePublic() method

公共消息总线：订阅单次消息

## 签名

```typescript
subscribeOncePublic(topic: string, callbackFn: (message: any) => void): ISYS_MessageBusTask;
```

## 参数名

| 参数         | 类型                        | 描述        |
| ---------- | ------------------------- | --------- |
| topic      | string                    | 主题        |
| callbackFn | (message: any) =&gt; void | 接收到消息后的回调 |



## 返回值

[ISYS\_MessageBusTask](../interfaces/ISYS_MessageBusTask.md)

消息总线任务

### subscribepublic

# SYS\_MessageBus.subscribePublic() method

公共消息总线：订阅消息

## 签名

```typescript
subscribePublic(topic: string, callbackFn: (message: any) => void): ISYS_MessageBusTask;
```

## 参数名

| 参数         | 类型                        | 描述        |
| ---------- | ------------------------- | --------- |
| topic      | string                    | 主题        |
| callbackFn | (message: any) =&gt; void | 接收到消息后的回调 |



## 返回值

[ISYS\_MessageBusTask](../interfaces/ISYS_MessageBusTask.md)

消息总线任务

## 备注

持久性订阅消息
