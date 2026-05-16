# 定时器与 WebSocket 操作

> **适用摘要**: 使用 `sys_Timer` 设置单次/循环定时器，使用 `sys_WebSocket` 注册 WebSocket 连接进行实时通信。

## 触发意图

- "设置定时器"
- "定时执行任务"
- "建立 WebSocket 连接"
- "实时通信"
- "周期性轮询"

## 前置条件

| 条件 | 要求 |
|---|---|
| 定时器 | 无特殊要求 |
| WebSocket | 必须启用扩展的外部交互权限 |

## 调用链

```
定时器:
  → sys_Timer.setTimeoutTimer(id, timeout, callFn) — 单次定时器
  → sys_Timer.setIntervalTimer(id, timeout, callFn) — 循环定时器
  → sys_Timer.clearTimeoutTimer(id) / clearIntervalTimer(id) — 清除定时器

WebSocket:
  → sys_WebSocket.register(id, serviceUri, receiveCallFn, connectedCallFn) — 注册连接
  → sys_WebSocket.send(id, data) — 发送数据
  → sys_WebSocket.close(id) — 关闭连接
```

## 分步说明

### 单次定时器

**API**: `eda.sys_Timer.setTimeoutTimer(id, timeout, callFn, ...args)`

**参考**: `../resources/references/classes/SYS_Timer.md`

**返回类型**: `boolean`

- `id` — 定时器 ID（用于定位和删除）
- `timeout` — 延迟时间（毫秒）
- `callFn` — 回调函数
- 相同 ID 的定时器会被覆盖（旧的自动清除）

### 循环定时器

**API**: `eda.sys_Timer.setIntervalTimer(id, timeout, callFn, ...args)`

### 注册 WebSocket

**API**: `eda.sys_WebSocket.register(id, serviceUri, receiveMessageCallFn?, connectedCallFn?, protocols?)`

**参考**: `../resources/references/classes/SYS_WebSocket.md`

> ⚠️ 不要尝试相同 ID 不同参数的连接，已存在的活跃连接不会更新参数。

### 发送 WebSocket 数据

**API**: `eda.sys_WebSocket.send(id, data, extensionUuid?)`

`data` 支持 `string` | `ArrayBuffer` | `Blob` | `ArrayBufferView`。

### 关闭 WebSocket

**API**: `eda.sys_WebSocket.close(id, code?, reason?, extensionUuid?)`

## 代码示例

```typescript
const PLUGIN_TAG = '[TimerWS]';

export async function setupTimers() {
  try {
    // 单次定时器：3 秒后执行
    const success = eda.sys_Timer.setTimeoutTimer(
      'my-timeout',
      3000,
      () => {
        console.warn(PLUGIN_TAG, 'Timeout triggered after 3s');
      }
    );

    if (!success) {
      console.warn(PLUGIN_TAG, 'Failed to set timeout timer');
    }

    // 循环定时器：每 5 秒执行
    eda.sys_Timer.setIntervalTimer(
      'my-interval',
      5000,
      () => {
        console.warn(PLUGIN_TAG, 'Interval tick');
      }
    );

    console.warn(PLUGIN_TAG, 'Timers set up');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Timer setup failed:', err);
  }
}

export async function clearTimers() {
  try {
    eda.sys_Timer.clearTimeoutTimer('my-timeout');
    eda.sys_Timer.clearIntervalTimer('my-interval');
    console.warn(PLUGIN_TAG, 'Timers cleared');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to clear timers:', err);
  }
}

export async function connectWebSocket() {
  try {
    eda.sys_WebSocket.register(
      'my-ws',
      'wss://echo.websocket.org',
      (event) => {
        console.warn(PLUGIN_TAG, 'WS message received:', event.data);
      },
      () => {
        console.warn(PLUGIN_TAG, 'WS connected');
        // 连接建立后发送数据
        eda.sys_WebSocket.send('my-ws', JSON.stringify({ type: 'hello' }));
      }
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'WebSocket connection failed:', err);
  }
}

export async function closeWebSocket() {
  try {
    eda.sys_WebSocket.close('my-ws', 1000, 'Normal closure');
    console.warn(PLUGIN_TAG, 'WebSocket closed');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to close WebSocket:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用 `setTimeout` / `setInterval` | 沙箱环境限制 | 使用 `eda.sys_Timer` |
| 定时器 ID 重复导致旧定时器被清除 | 设计如此 | 使用唯一 ID 或利用此特性更新定时器 |
| WebSocket 始终报错 | 未启用外部交互权限 | 启用扩展的外部交互权限 |
| 相同 ID 不同参数的 WS 连接不更新 | 已存在活跃连接时忽略新参数 | 先 `close()` 再重新 `register()` |
| 使用 `new WebSocket()` | 沙箱限制 | 使用 `eda.sys_WebSocket.register()` |

## 变体

- **带参数的定时器**: `setTimeoutTimer(id, timeout, callFn, arg1, arg2)` — 参数传递给回调
- **操作其他扩展的 WebSocket**: 传入 `extensionUuid` 参数（需知道目标扩展 UUID）
- **WebSocket 子协议**: 传入 `protocols` 参数指定子协议
