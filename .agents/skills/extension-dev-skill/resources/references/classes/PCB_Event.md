# PCB\_Event class

PCB &amp; 封装 / 事件类

## 签名

```typescript
declare class PCB_Event
```

## 备注

注册事件回调


## 方法

| 方法名                                                                          | 修饰符 | 描述                      |
| ---------------------------------------------------------------------------- | --- | ----------------------- |
| [addCrossProbeSelectEventListener(id, callFn)](./PCB_Event.md)               |     | **_(BETA)_** 新增交叉选择事件监听 |
| [addMouseEventListener(id, eventType, callFn, onlyOnce)](./PCB_Event.md)     |     | **_(BETA)_** 新增鼠标事件监听   |
| [addNetEventListener(id, eventType, callFn, onlyOnce)](./PCB_Event.md)       |     | **_(BETA)_** 新增网络事件监听   |
| [addPrimitiveEventListener(id, eventType, callFn, onlyOnce)](./PCB_Event.md) |     | **_(BETA)_** 新增图元事件监听   |
| [isEventListenerAlreadyExist(id)](./PCB_Event.md)                            |     | 查询事件监听是否存在              |
| [removeEventListener(id)](./PCB_Event.md)                                    |     | 移除事件监听                  |

---

## 方法详情

### addcrossprobeselecteventlistener

# PCB\_Event.addCrossProbeSelectEventListener() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

新增交叉选择事件监听

## 签名

```typescript
addCrossProbeSelectEventListener(id: string, callFn: (props: any) => void | Promise<void>): void;
```

## 参数名

| 参数     | 类型                                             | 描述               |
| ------ | ---------------------------------------------- | ---------------- |
| id     | string                                         | 事件 ID，用以防止重复注册事件 |
| callFn | (props: any) =&gt; void \| Promise&lt;void&gt; | 事件触发时的回调函数       |



## 返回值

void

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### addmouseeventlistener

# PCB\_Event.addMouseEventListener() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

新增鼠标事件监听

## 签名

```typescript
addMouseEventListener(id: string, eventType: 'all' | EPCB_MouseEventType, callFn: (eventType: EPCB_MouseEventType, props: [
        {
            primitiveId: string;
            primitiveType: EPCB_PrimitiveType;
            net?: string;
            designator?: string;
            parentComponentPrimitiveId?: string;
            parentComponentDesignator?: string;
        }
    ]) => void | Promise<void>, onlyOnce?: boolean): void;
```

## 参数名

| 参数        | 类型                                                                                                                                                                                                                                                                                           | 描述               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| id        | string                                                                                                                                                                                                                                                                                       | 事件 ID，用以防止重复注册事件 |
| eventType | 'all' \| EPCB\_MouseEventType                                                                                                                                                                                                                                                                | 事件类型             |
| callFn    | (eventType: EPCB\_MouseEventType, props: \[ { primitiveId: string; primitiveType: [EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md); net?: string; designator?: string; parentComponentPrimitiveId?: string; parentComponentDesignator?: string; } \]) =&gt; void \| Promise&lt;void&gt; | 事件触发时的回调函数       |
| onlyOnce  | boolean                                                                                                                                                                                                                                                                                      | _（可选）_ 是否仅监听一次   |



## 返回值

void

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### addneteventlistener

# PCB\_Event.addNetEventListener() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

新增网络事件监听

## 签名

```typescript
addNetEventListener(id: string, eventType: 'all' | EPCB_NetEventType, callFn: (eventType: EPCB_NetEventType, props: [{
        net: string;
    }]) => void | Promise<void>, onlyOnce?: boolean): void;
```

## 参数名

| 参数        | 类型                                                                                             | 描述               |
| --------- | ---------------------------------------------------------------------------------------------- | ---------------- |
| id        | string                                                                                         | 事件 ID，用以防止重复注册事件 |
| eventType | 'all' \| EPCB\_NetEventType                                                                    | 事件类型             |
| callFn    | (eventType: EPCB\_NetEventType, props: \[{ net: string; }\]) =&gt; void \| Promise&lt;void&gt; | 事件触发时的回调函数       |
| onlyOnce  | boolean                                                                                        | _（可选）_ 是否仅监听一次   |



## 返回值

void

## 备注

网络选中事件仅

①在过滤面板选中网络选项并在画布选中网络时

②在工程设计 -&gt; 网络内选中网络时

会被触发

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### addprimitiveeventlistener

# PCB\_Event.addPrimitiveEventListener() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

新增图元事件监听

## 签名

```typescript
addPrimitiveEventListener(id: string, eventType: 'all' | EPCB_PrimitiveEventType, callFn: (eventType: EPCB_PrimitiveEventType, props: [
        {
            primitiveId: string;
            primitiveType: EPCB_PrimitiveType;
            net?: string;
            designator?: string;
            parentComponentPrimitiveId?: string;
            parentComponentDesignator?: string;
        }
    ]) => void | Promise<void>, onlyOnce?: boolean): void;
```

## 参数名

| 参数        | 类型                                                                                                                                                                                                                                                                                               | 描述               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| id        | string                                                                                                                                                                                                                                                                                           | 事件 ID，用以防止重复注册事件 |
| eventType | 'all' \| EPCB\_PrimitiveEventType                                                                                                                                                                                                                                                                | 事件类型             |
| callFn    | (eventType: EPCB\_PrimitiveEventType, props: \[ { primitiveId: string; primitiveType: [EPCB\_PrimitiveType](../enums/EPCB_PrimitiveType.md); net?: string; designator?: string; parentComponentPrimitiveId?: string; parentComponentDesignator?: string; } \]) =&gt; void \| Promise&lt;void&gt; | 事件触发时的回调函数       |
| onlyOnce  | boolean                                                                                                                                                                                                                                                                                          | _（可选）_ 是否仅监听一次   |



## 返回值

void

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### iseventlisteneralreadyexist

# PCB\_Event.isEventListenerAlreadyExist() method

查询事件监听是否存在

## 签名

```typescript
isEventListenerAlreadyExist(id: string): boolean;
```

## 参数名

| 参数  | 类型     | 描述    |
| --- | ------ | ----- |
| id  | string | 事件 ID |



## 返回值

boolean

事件监听是否存在

### removeeventlistener

# PCB\_Event.removeEventListener() method

移除事件监听

## 签名

```typescript
removeEventListener(id: string): boolean;
```

## 参数名

| 参数  | 类型     | 描述    |
| --- | ------ | ----- |
| id  | string | 事件 ID |



## 返回值

boolean

是否移除指定事件监听
