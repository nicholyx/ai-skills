# 原理图仿真引擎：控制仿真、注册事件

> **适用摘要**: 使用 `sch_SimulationEngine` 向仿真内核发送数据和控制仿真流程，使用 `sch_Utils` 获取原理图工具方法。

## 触发意图

- "控制仿真引擎"
- "向仿真内核发送数据"
- "动态仿真交互"
- "SPICE 仿真控制"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图文档（documentType === 1） |
| 仿真环境 | 仿真引擎已启动 |

## 调用链

```
Step 1: 确认当前文档为原理图
Step 2: sch_SimulationEngine.pushData(eventType, props) — 向仿真内核发送数据
```

## 分步说明

### Step 1: 确认文档类型

参考 `recipes/get_current_document.md` 获取当前文档信息，确认 `documentType === 1`（原理图）。

### Step 2: 向仿真内核发送数据

**API**: `eda.sch_SimulationEngine.pushData(eventType, props)`

**参考**: `../resources/references/classes/SCH_SimulationEngine.md`

**参数**:
- `eventType` — 事件类型枚举
  - `ESCH_DynamicSimulationEnginePushEventType` — 动态仿真事件类型
  - `ESCH_SpiceSimulationEnginePushEventType` — SPICE 仿真事件类型
- `props` — 数据对象 `{ [key: string]: any }`

**参考枚举**:
- `../resources/references/enums/ESCH_DynamicSimulationEnginePushEventType.md`
- `../resources/references/enums/ESCH_SpiceSimulationEnginePushEventType.md`

### SCH_Utils

**API**: `eda.sch_Utils`

**参考**: `../resources/references/classes/SCH_Utils.md`

原理图工具类，提供辅助方法。

## 代码示例

```typescript
const PLUGIN_TAG = '[SimEngine]';

export async function controlSimulation() {
  try {
    // 确认当前是原理图
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic document');
      await eda.sys_Dialog.showInformationMessage('请在原理图中使用此功能');
      return;
    }

    // 向仿真内核发送数据
    eda.sch_SimulationEngine.pushData(0, {
      action: 'start',
      parameters: {
        duration: 1000,
      },
    });

    console.warn(PLUGIN_TAG, 'Simulation data pushed');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Simulation control failed:', err);
  }
}

export async function pushSimulationEvent() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic document');
      return;
    }

    // 发送仿真事件数据
    eda.sch_SimulationEngine.pushData(0, {
      componentId: 'R1',
      value: 1000,
    });

    console.warn(PLUGIN_TAG, 'Simulation event pushed');
    await eda.sys_Dialog.showInformationMessage('仿真数据已发送');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to push simulation event:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `pushData` 无效果 | 仿真引擎未启动 | 确保仿真环境已启动 |
| 在 PCB 中调用 | 仿真仅支持原理图 | 检查 `documentType === 1` |
| eventType 值错误 | 使用了错误的枚举 | 查阅对应枚举文档确认值 |
| props 格式不正确 | 仿真内核期望特定数据结构 | 参考仿真引擎文档确认数据格式 |

## 变体

- **动态仿真**: 使用 `ESCH_DynamicSimulationEnginePushEventType` 枚举值
- **SPICE 仿真**: 使用 `ESCH_SpiceSimulationEnginePushEventType` 枚举值
- **结合事件监听**: 配合 `sch_Event` 监听仿真状态变化（参考 `recipes/sch_event_bindraw.md`）
