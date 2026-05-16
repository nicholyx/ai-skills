# 修改原理图器件属性

> **适用摘要**: 修改原理图器件的位号、名称、坐标、自定义属性等。SCH 修改必须使用 `modify()` 方法，不能用 `setState_*`。

## 触发意图

- "修改器件位号"
- "批量修改原理图器件属性"
- "移动原理图器件位置"
- "设置器件自定义属性"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 器件类型 | 仅 `COMPONENT` 类型允许修改（网络标识、网络端口不可修改） |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_PrimitiveComponent.getAll() 或 get() — 获取目标器件
  → Step 2: sch_PrimitiveComponent.modify(primitiveId, property) — 提交修改
```

> ⚠️ **关键区别**: SCH 的 `setState_*` 方法不会提交修改！必须使用 `modify()` 方法。
> 这是 SCH 和 PCB 最大的行为差异。

## 分步说明

### Step 1: 获取目标器件

参考 `recipes/get_sch_components.md` 获取器件列表或单个器件。

### Step 2: 调用 modify() 提交修改

**API**: `eda.sch_PrimitiveComponent.modify(primitiveId, property)`

**参考**: `../resources/references/classes/SCH_PrimitiveComponent.md`

**参数说明**:
- `primitiveId` — 器件图元 ID（string）或器件图元对象
- `property` — 要修改的属性对象：

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` | number | 坐标 X |
| `y` | number | 坐标 Y |
| `rotation` | number | 旋转角度 |
| `mirror` | boolean | 是否镜像 |
| `addIntoBom` | boolean | 是否加入 BOM |
| `addIntoPcb` | boolean | 是否转到 PCB |
| `designator` | string \| null | 位号 |
| `name` | string \| null | 器件名称 |
| `uniqueId` | string \| null | 唯一 ID |
| `manufacturer` | string \| null | 制造商 |
| `manufacturerId` | string \| null | 制造商编号 |
| `supplier` | string \| null | 供应商 |
| `supplierId` | string \| null | 供应商编号 |
| `otherProperty` | `{ [key: string]: string \| number \| boolean }` | 自定义属性 |

## 代码示例

```typescript
const PLUGIN_TAG = '[MyPlugin]';

export async function renameDesignator() {
  try {
    const components = await eda.sch_PrimitiveComponent.getAll();
    if (!components || components.length === 0) {
      console.warn(PLUGIN_TAG, 'No components found');
      return;
    }

    for (const comp of components) {
      const id = comp.getState_PrimitiveId();
      const oldDesignator = comp.getState_Designator();

      // 修改位号：必须使用 modify()，不能用 setState_*
      const result = await eda.sch_PrimitiveComponent.modify(id, {
        designator: `NEW_${oldDesignator}`,
      });

      if (!result) {
        console.warn(PLUGIN_TAG, `Failed to modify component ${oldDesignator}`);
      }
    }

    await eda.sch_Document.save();
    console.warn(PLUGIN_TAG, 'All components renamed');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to modify components:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `setState_Designator()` 不生效 | SCH 的 setState 不提交修改 | 必须使用 `eda.sch_PrimitiveComponent.modify()` |
| 修改网络标识/端口失败 | modify 仅支持 COMPONENT 类型 | 检查器件类型，网络标识/端口不可修改 |
| 自定义属性未生效 | 属性名拼写错误或类型不匹配 | 使用 `getAllPropertyNames()` 确认属性名 |

## 变体

- **PCB 器件修改**: PCB 使用 `eda.pcb_PrimitiveComponent.modify()` 或 `setState_*().done()` 链式调用，参考 `recipes/modify_pcb_primitive.md`
- **批量修改**: 循环调用 `modify()`，每次传入不同的 primitiveId
