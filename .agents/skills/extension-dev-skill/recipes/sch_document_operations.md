# 原理图文档操作：保存、从 PCB 导入变更、自动布局、自动布线

> **适用摘要**: 对原理图文档进行整体操作——保存文档、从 PCB 导入变更（反向标注）、自动布局、自动布线。

## 触发意图

- "保存原理图"
- "从 PCB 导入变更"
- "反向标注"
- "自动布局原理图"
- "自动布线原理图"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 导入变更 | 原理图需关联 PCB（非游离原理图） |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_Document.save() — 保存文档
  → Step 2: sch_Document.importChanges() — 从 PCB 导入变更
  → Step 3: sch_Document.autoLayout(props?) — 自动布局（BETA）
  → Step 4: sch_Document.autoRouting(props?) — 自动布线（BETA）
```

## 分步说明

### Step 1: 保存文档

**API**: `eda.sch_Document.save()`

**参考**: `../resources/references/classes/SCH_Document.md`

**返回类型**: `Promise<boolean>` — 保存失败、上传失败等错误均返回 `false`

### Step 2: 从 PCB 导入变更

**API**: `eda.sch_Document.importChanges()`

**返回类型**: `Promise<boolean>` — 导入失败或游离原理图返回 `false`

> 此操作将 PCB 端的变更（如位号修改、器件增删）同步回原理图。

### Step 3: 自动布局（BETA）

**API**: `eda.sch_Document.autoLayout(props?)`

**参数说明**（均可选）:
- `uuids` — 指定器件 UUID 数组，仅对这些器件布局
- `netlist` — 网表数据，用于辅助布局
- `designatorDeviceTypeMap` — 位号到器件类型的映射，可选值: `'resistor'`, `'capacitor'`, `'inductive'`, `'diode'`, `'triode'`, `'oscillator'`, `'chip'`, `'otherDevice'`

**返回类型**: `Promise<any>`

### Step 4: 自动布线（BETA）

**API**: `eda.sch_Document.autoRouting(props?)`

**参数说明**: 与 `autoLayout` 相同

**返回类型**: `Promise<any>`

## 代码示例

```typescript
const PLUGIN_TAG = '[SchDoc]';

export async function schDocumentOperations() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      return;
    }

    // 从 PCB 导入变更
    const imported = await eda.sch_Document.importChanges();
    if (!imported) {
      console.warn(PLUGIN_TAG, 'Import changes failed (may be a floating schematic)');
    }

    // 自动布局
    const layoutResult = await eda.sch_Document.autoLayout();
    console.warn(PLUGIN_TAG, 'Auto layout result:', layoutResult);

    // 自动布线
    const routingResult = await eda.sch_Document.autoRouting();
    console.warn(PLUGIN_TAG, 'Auto routing result:', routingResult);

    // 保存文档
    const saved = await eda.sch_Document.save();
    if (!saved) {
      console.warn(PLUGIN_TAG, 'Save failed');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Schematic document operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `importChanges` 返回 `false` | 游离原理图（未关联 PCB） | 确保原理图关联了板子和 PCB |
| `save` 返回 `false` | 保存或上传失败 | 检查网络连接和权限 |
| `autoLayout` 无效果 | 没有可布局的器件 | 确保原理图中有器件 |
| 在 PCB 文档中调用 `sch_Document` | 文档类型不匹配 | PCB 使用 `pcb_Document`，SCH 使用 `sch_Document` |

## 变体

- **仅对选中器件自动布局**: 传入 `uuids` 参数指定器件范围
- **带器件类型提示的布局**: 传入 `designatorDeviceTypeMap` 帮助布局算法识别器件类型
- **PCB 文档保存**: PCB 使用 `eda.pcb_Document.save(uuid)` 需要传入文档 UUID
