# 修改 PCB 图元属性

> **适用摘要**: 修改 PCB 图元（器件、线、过孔、焊盘、文本等）的属性。PCB 支持两种修改方式：`modify()` 方法和 `setState_*().done()` 链式调用。

## 触发意图

- "修改 PCB 器件位置"
- "移动 PCB 走线"
- "修改过孔属性"
- "批量修改 PCB 图元"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3） |

## 调用链

```
确认当前文档为 PCB
  → Step 1: 获取目标图元（getAll / get / getPrimitiveAtPoint）
  → Step 2: 修改属性（方式 A: modify() 或 方式 B: setState chain）
```

## 两种修改方式

### 方式 A: 使用 modify() 方法（推荐用于器件）

**API**: `eda.pcb_PrimitiveComponent.modify(primitiveId, property)`

**参考**: `../resources/references/classes/PCB_PrimitiveComponent.md`

```typescript
await eda.pcb_PrimitiveComponent.modify(primitiveId, {
  x: 1000,
  y: 2000,
  rotation: 90,
  designator: 'U1',
});
```

### 方式 B: 使用 setState_*().done() 链（适用于所有图元）

PCB 图元支持链式调用 `setState_*` 方法，最后调用 `.done()` 提交修改。

```typescript
// 修改线段
line.setState_StartX(100).setState_StartY(200).setState_EndX(300).setState_EndY(400).done();

// 修改过孔
via.setState_X(500).setState_Y(600).done();

// 修改文本
text.setState_Content('Hello').setState_X(100).done();
```

> ⚠️ **必须调用 `.done()`**，否则修改不会生效。
> ⚠️ **SCH 不支持此方式**！SCH 必须使用 `modify()` 方法，参考 `recipes/modify_sch_component.md`。

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbModify]';

export async function moveAllComponentsRight() {
  try {
    const components = await eda.pcb_PrimitiveComponent.getAll();
    if (!components || components.length === 0) {
      console.warn(PLUGIN_TAG, 'No components found');
      return;
    }

    for (const comp of components) {
      const id = comp.getState_PrimitiveId();
      const currentX = comp.getState_X();

      // 方式 A: 使用 modify
      await eda.pcb_PrimitiveComponent.modify(id, {
        x: currentX + 100,
      });
    }

    await eda.pcb_Document.save(
      (await eda.dmt_SelectControl.getCurrentDocumentInfo())?.uuid ?? ''
    );
    console.warn(PLUGIN_TAG, 'All components moved');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to modify components:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| setState 修改不生效 | 忘记调用 `.done()` | 链式调用末尾必须加 `.done()` |
| 在 SCH 中使用 setState chain | SCH 不支持此方式 | SCH 必须使用 `modify()` 方法 |
| 坐标偏移 | 混淆数据原点和画布原点 | 使用 `pcb_Document.convertCanvasOriginToDataOrigin()` |

## 变体

- **修改原理图器件**: 参考 `recipes/modify_sch_component.md`（使用 `modify()` 方法）
- **修改选中的图元**: 先用 `pcb_SelectControl` 获取选中图元，再修改
- **按区域批量修改**: 用 `pcb_Document.getPrimitivesInRegion()` 获取区域内图元
