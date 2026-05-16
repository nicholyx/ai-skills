# 原理图事件注册：图元事件、鼠标事件回调

> **适用摘要**: 在原理图中注册事件监听——图元事件（创建/删除/修改等）和鼠标事件（点击/移动等）。仅扩展（Extension）环境可用，独立脚本不支持。

## 触发意图

- "监听原理图图元变化"
- "注册鼠标点击事件"
- "监听器件创建/删除"
- "注册图元修改回调"
- "移除事件监听"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1）或符号编辑器 |
| 运行环境 | 必须是扩展（Extension）环境，独立脚本不支持 |

## 调用链

```
确认当前文档为原理图（扩展环境）
  → Step 1: sch_Event.addPrimitiveEventListener(id, eventType, callFn) — 注册图元事件
  → Step 2: sch_Event.addMouseEventListener(id, eventType, callFn) — 注册鼠标事件
  → Step 3: sch_Event.isEventListenerAlreadyExist(id) — 检查事件是否已注册
  → Step 4: sch_Event.removeEventListener(id) — 移除事件监听
```

## 分步说明

### Step 1: 注册图元事件监听（BETA）

**API**: `eda.sch_Event.addPrimitiveEventListener(id, eventType, callFn, onlyOnce?)`

**参考**: `../resources/references/classes/SCH_Event.md`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `id` | string | 事件 ID，防止重复注册 |
| `eventType` | `'all'` \| `ESCH_PrimitiveEventType` | 事件类型 |
| `callFn` | `(eventType, props) => void` | 回调函数，`props.primitiveIds` 包含相关图元 ID |
| `onlyOnce` | boolean（可选） | 是否仅监听一次 |

**参考枚举**: `../resources/references/enums/ESCH_PrimitiveEventType.md`

**返回类型**: `void`

### Step 2: 注册鼠标事件监听

**API**: `eda.sch_Event.addMouseEventListener(id, eventType, callFn, onlyOnce?)`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `id` | string | 事件 ID |
| `eventType` | `'all'` \| `ESCH_MouseEventType` | 事件类型 |
| `callFn` | `(eventType) => void` | 回调函数 |
| `onlyOnce` | boolean（可选） | 是否仅监听一次 |

**参考枚举**: `../resources/references/enums/ESCH_MouseEventType.md`

### Step 3: 检查事件是否已注册

**API**: `eda.sch_Event.isEventListenerAlreadyExist(id)`

**返回类型**: `boolean`

### Step 4: 移除事件监听

**API**: `eda.sch_Event.removeEventListener(id)`

**返回类型**: `boolean` — 是否成功移除

## 代码示例

```typescript
const PLUGIN_TAG = '[SchEvent]';

export async function registerSchEvents() {
  try {
    const eventId = 'my-plugin-primitive-event';

    // 检查是否已注册
    if (eda.sch_Event.isEventListenerAlreadyExist(eventId)) {
      console.warn(PLUGIN_TAG, 'Event already registered, removing first');
      eda.sch_Event.removeEventListener(eventId);
    }

    // 注册图元事件监听（监听所有图元事件）
    eda.sch_Event.addPrimitiveEventListener(
      eventId,
      'all',
      (eventType, props) => {
        console.warn(
          PLUGIN_TAG,
          `Primitive event: ${eventType}, primitiveIds:`,
          props.primitiveIds
        );
      }
    );

    // 注册鼠标事件监听
    const mouseEventId = 'my-plugin-mouse-event';
    eda.sch_Event.addMouseEventListener(
      mouseEventId,
      'all',
      (eventType) => {
        console.warn(PLUGIN_TAG, `Mouse event: ${eventType}`);
      }
    );

    console.warn(PLUGIN_TAG, 'Events registered');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to register events:', err);
  }
}

export async function cleanupEvents() {
  try {
    eda.sch_Event.removeEventListener('my-plugin-primitive-event');
    eda.sch_Event.removeEventListener('my-plugin-mouse-event');
    console.warn(PLUGIN_TAG, 'Events cleaned up');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to cleanup events:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `throw Error` 异常 | 在独立脚本环境中调用 | 事件监听仅扩展环境可用，不支持独立脚本 |
| 事件重复注册 | 未检查 `isEventListenerAlreadyExist` | 注册前先检查，或先移除再注册 |
| 回调不触发 | eventType 不匹配 | 使用 `'all'` 监听所有事件，或确认具体枚举值 |
| 忘记移除事件 | 插件卸载时未清理 | 在插件卸载逻辑中调用 `removeEventListener` |

## 变体

- **仅监听一次**: 设置 `onlyOnce = true`，事件触发一次后自动移除
- **监听特定图元事件**: 传入具体的 `ESCH_PrimitiveEventType` 枚举值而非 `'all'`
- **仿真引擎事件**: 使用 `eda.sch_Event.addSimulationEnginePullEventListener()` 注册仿真引擎拉取事件（BETA）
