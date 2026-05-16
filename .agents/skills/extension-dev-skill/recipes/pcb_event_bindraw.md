# PCB 事件注册：图元事件、鼠标事件、网络事件、交叉选择事件回调

> **适用摘要**: 在 PCB 中注册事件监听——图元事件（创建/删除/修改等）、鼠标事件（点击/移动等）、网络事件、交叉选择事件。仅扩展（Extension）环境可用，独立脚本不支持。

## 触发意图

- "监听 PCB 图元变化"
- "注册 PCB 鼠标点击事件"
- "监听网络选中事件"
- "监听交叉选择事件"
- "注册图元修改回调"
- "移除 PCB 事件监听"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3）或封装编辑器 |
| 运行环境 | 必须是扩展（Extension）环境，独立脚本不支持 |

## 调用链

```
确认当前文档为 PCB（扩展环境）
  → Step 1: pcb_Event.addPrimitiveEventListener(id, eventType, callFn, onlyOnce?) — 注册图元事件
  → Step 2: pcb_Event.addMouseEventListener(id, eventType, callFn, onlyOnce?) — 注册鼠标事件
  → Step 3: pcb_Event.addNetEventListener(id, eventType, callFn, onlyOnce?) — 注册网络事件
  → Step 4: pcb_Event.addCrossProbeSelectEventListener(id, callFn) — 注册交叉选择事件
  → Step 5: pcb_Event.isEventListenerAlreadyExist(id) — 检查事件是否已注册
  → Step 6: pcb_Event.removeEventListener(id) — 移除事件监听
```

## 分步说明

### Step 1: 注册图元事件监听（BETA）

**API**: `eda.pcb_Event.addPrimitiveEventListener(id, eventType, callFn, onlyOnce?)`

**参考**: `../resources/references/classes/PCB_Event.md`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `id` | string | 事件 ID，防止重复注册 |
| `eventType` | `'all'` \| `EPCB_PrimitiveEventType` | 事件类型 |
| `callFn` | `(eventType, props) => void` | 回调函数，`props` 包含 `primitiveId`, `primitiveType`, `net?`, `designator?`, `parentComponentPrimitiveId?`, `parentComponentDesignator?` |
| `onlyOnce` | boolean（可选） | 是否仅监听一次 |

**参考枚举**: `../resources/references/enums/EPCB_PrimitiveEventType.md`

**参考枚举**: `../resources/references/enums/EPCB_PrimitiveType.md`

**返回类型**: `void`

### Step 2: 注册鼠标事件监听（BETA）

**API**: `eda.pcb_Event.addMouseEventListener(id, eventType, callFn, onlyOnce?)`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `id` | string | 事件 ID |
| `eventType` | `'all'` \| `EPCB_MouseEventType` | 事件类型 |
| `callFn` | `(eventType, props) => void` | 回调函数，`props` 包含图元信息（同图元事件） |
| `onlyOnce` | boolean（可选） | 是否仅监听一次 |

**参考枚举**: `../resources/references/enums/EPCB_MouseEventType.md`

### Step 3: 注册网络事件监听（BETA）

**API**: `eda.pcb_Event.addNetEventListener(id, eventType, callFn, onlyOnce?)`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `id` | string | 事件 ID |
| `eventType` | `'all'` \| `EPCB_NetEventType` | 事件类型 |
| `callFn` | `(eventType, props) => void` | 回调函数，`props` 包含 `{ net: string }` |
| `onlyOnce` | boolean（可选） | 是否仅监听一次 |

**参考枚举**: `../resources/references/enums/EPCB_NetEventType.md`

> 网络选中事件仅在过滤面板选中网络选项并在画布选中网络时，或在工程设计→网络内选中网络时触发。

### Step 4: 注册交叉选择事件监听（BETA）

**API**: `eda.pcb_Event.addCrossProbeSelectEventListener(id, callFn)`

**参数说明**:
- `id` — 事件 ID
- `callFn` — `(props: any) => void | Promise<void>`

**返回类型**: `void`

### Step 5: 检查事件是否已注册

**API**: `eda.pcb_Event.isEventListenerAlreadyExist(id)`

**返回类型**: `boolean`

### Step 6: 移除事件监听

**API**: `eda.pcb_Event.removeEventListener(id)`

**返回类型**: `boolean` — 是否成功移除

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbEvent]';

export async function registerPcbEvents() {
  try {
    const primitiveEventId = 'my-plugin-pcb-primitive-event';
    const mouseEventId = 'my-plugin-pcb-mouse-event';
    const netEventId = 'my-plugin-pcb-net-event';
    const crossProbeEventId = 'my-plugin-pcb-cross-probe-event';

    // 检查并清理已有事件
    if (eda.pcb_Event.isEventListenerAlreadyExist(primitiveEventId)) {
      console.warn(PLUGIN_TAG, 'Primitive event already registered, removing first');
      eda.pcb_Event.removeEventListener(primitiveEventId);
    }

    // 注册图元事件监听（监听所有图元事件）
    eda.pcb_Event.addPrimitiveEventListener(
      primitiveEventId,
      'all',
      (eventType, props) => {
        console.warn(
          PLUGIN_TAG,
          `Primitive event: ${eventType}`,
          `ID: ${props[0]?.primitiveId}, Type: ${props[0]?.primitiveType}`
        );
      }
    );

    // 注册鼠标事件监听
    eda.pcb_Event.addMouseEventListener(
      mouseEventId,
      'all',
      (eventType, props) => {
        console.warn(PLUGIN_TAG, `Mouse event: ${eventType}`, props);
      }
    );

    // 注册网络事件监听
    eda.pcb_Event.addNetEventListener(
      netEventId,
      'all',
      (eventType, props) => {
        console.warn(PLUGIN_TAG, `Net event: ${eventType}, net: ${props[0]?.net}`);
      }
    );

    // 注册交叉选择事件监听
    eda.pcb_Event.addCrossProbeSelectEventListener(
      crossProbeEventId,
      (props) => {
        console.warn(PLUGIN_TAG, 'Cross probe event:', props);
      }
    );

    console.warn(PLUGIN_TAG, 'All PCB events registered');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to register PCB events:', err);
  }
}

export async function cleanupPcbEvents() {
  try {
    eda.pcb_Event.removeEventListener('my-plugin-pcb-primitive-event');
    eda.pcb_Event.removeEventListener('my-plugin-pcb-mouse-event');
    eda.pcb_Event.removeEventListener('my-plugin-pcb-net-event');
    eda.pcb_Event.removeEventListener('my-plugin-pcb-cross-probe-event');
    console.warn(PLUGIN_TAG, 'All PCB events cleaned up');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to cleanup PCB events:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `throw Error` 异常 | 在独立脚本环境中调用 | 事件监听仅扩展环境可用，不支持独立脚本 |
| 事件重复注册 | 未检查 `isEventListenerAlreadyExist` | 注册前先检查，或先移除再注册 |
| 回调不触发 | eventType 不匹配 | 使用 `'all'` 监听所有事件，或确认具体枚举值 |
| 网络事件不触发 | 触发条件特殊 | 网络事件仅在过滤面板选中网络或工程设计→网络内选中时触发 |
| 忘记移除事件 | 插件卸载时未清理 | 在插件卸载逻辑中调用 `removeEventListener` |
| 在 SCH 中调用 `pcb_Event` | 文档类型不匹配 | SCH 使用 `sch_Event` |

## 变体

- **仅监听一次**: 设置 `onlyOnce = true`，事件触发一次后自动移除
- **监听特定图元事件**: 传入具体的 `EPCB_PrimitiveEventType` 枚举值而非 `'all'`
- **原理图事件**: 使用 `eda.sch_Event` 类，参考 `recipes/sch_event_bindraw.md`
- **PCB 比 SCH 多网络事件和交叉选择事件**: SCH 没有 `addNetEventListener` 和 `addCrossProbeSelectEventListener`
