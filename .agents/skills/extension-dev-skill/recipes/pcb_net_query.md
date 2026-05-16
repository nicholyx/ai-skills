# 查询 PCB 网络信息

> **适用摘要**: 查询 PCB 中的网络（Net）信息，包括网络名称、网络类、差分对等。

## 触发意图

- "获取 PCB 所有网络"
- "查询网络类信息"
- "获取差分对列表"
- "查找某个网络的所有图元"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3） |

## 调用链

```
确认当前文档为 PCB
  → pcb_Net.getAll() — 获取所有网络信息
  → [可选] pcb_Net.getAllNetClass() — 获取网络类
  → [可选] pcb_Net.getAllDifferentialPair() — 获取差分对
```

## 分步说明

### 获取所有网络

**API**: `eda.pcb_Net.getAll()`

**参考**: `../resources/references/classes/PCB_Net.md`

**返回类型**: `Promise<Array<IPCB_NetInfo>>`

**返回接口参考**: `../resources/references/interfaces/IPCB_NetInfo.md`

> ⚠️ 引脚/焊盘没有 `getState_Net()` 方法。获取网络信息必须通过 `pcb_Net`。

## 代码示例

```typescript
const PLUGIN_TAG = '[NetQuery]';

export async function queryNets() {
  try {
    const nets = await eda.pcb_Net.getAll();
    if (!nets || nets.length === 0) {
      console.warn(PLUGIN_TAG, 'No nets found');
      return;
    }

    for (const net of nets) {
      const name = net.getNetName();
      console.warn(PLUGIN_TAG, `Net: ${name}`);
    }

    await eda.sys_Dialog.showInformationMessage(`Found ${nets.length} nets in PCB.`);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to query nets:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 在焊盘上调用 `getState_Net()` | 焊盘/引脚没有此方法 | 使用 `eda.pcb_Net.getAll()` 获取网络 |
| SCH 中获取网络 | SCH 网络在导线上 | 使用 `eda.sch_PrimitiveWire.getAll()` → `wire.getState_Net()` |
