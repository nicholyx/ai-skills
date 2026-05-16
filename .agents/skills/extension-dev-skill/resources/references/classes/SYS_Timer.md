# SYS\_Timer class

系统 / 定时器类

## 签名

```typescript
declare class SYS_Timer
```

## 备注

设置定时器


## 方法

| 方法名                                                           | 修饰符 | 描述        |
| ------------------------------------------------------------- | --- | --------- |
| [clearIntervalTimer(id)](./SYS_Timer.md)                      |     | 清除指定循环定时器 |
| [clearTimeoutTimer(id)](./SYS_Timer.md)                       |     | 清除指定单次定时器 |
| [setIntervalTimer(id, timeout, callFn, args)](./SYS_Timer.md) |     | 设置循环定时器   |
| [setTimeoutTimer(id, timeout, callFn, args)](./SYS_Timer.md)  |     | 设置单次定时器   |

---

## 方法详情

### clearintervaltimer

# SYS\_Timer.clearIntervalTimer() method

清除指定循环定时器

## 签名

```typescript
clearIntervalTimer(id: string): boolean;
```

## 参数名

| 参数  | 类型     | 描述     |
| --- | ------ | ------ |
| id  | string | 定时器 ID |



## 返回值

boolean

定时器是否清除成功

### cleartimeouttimer

# SYS\_Timer.clearTimeoutTimer() method

清除指定单次定时器

## 签名

```typescript
clearTimeoutTimer(id: string): boolean;
```

## 参数名

| 参数  | 类型     | 描述     |
| --- | ------ | ------ |
| id  | string | 定时器 ID |



## 返回值

boolean

定时器是否清除成功

### setintervaltimer

# SYS\_Timer.setIntervalTimer() method

设置循环定时器

## 签名

```typescript
setIntervalTimer(id: string, timeout: number, callFn: (...args: any) => void, ...args: any): boolean;
```

## 参数名

| 参数      | 类型                        | 描述                    |
| ------- | ------------------------- | --------------------- |
| id      | string                    | 定时器 ID，用于定位&amp;删除定时器 |
| timeout | number                    | 定时时间，单位 ms            |
| callFn  | (...args: any) =&gt; void | 定时调用函数                |
| args    | any                       | 传给定时调用函数的参数           |



## 返回值

boolean

定时器是否设置成功

## 备注

如果遇到 ID 重复的定时器，则之前设置的定时器将被清除

### settimeouttimer

# SYS\_Timer.setTimeoutTimer() method

设置单次定时器

## 签名

```typescript
setTimeoutTimer(id: string, timeout: number, callFn: (...args: any) => void, ...args: any): boolean;
```

## 参数名

| 参数      | 类型                        | 描述          |
| ------- | ------------------------- | ----------- |
| id      | string                    | 定时器 ID      |
| timeout | number                    | 定时时间，单位 ms  |
| callFn  | (...args: any) =&gt; void | 定时调用函数      |
| args    | any                       | 传给定时调用函数的参数 |



## 返回值

boolean

定时器是否设置成功

## 备注

如果遇到 ID 重复的定时器，则之前设置的定时器将被清除
