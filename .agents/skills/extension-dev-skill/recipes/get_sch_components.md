# 获取原理图所有器件信息

> **适用摘要**: 获取当前原理图（或所有图页）的全部器件，包括位号、封装名、值、自定义属性等。BOM 导出、器件统计、批量检查的基础。

## 触发意图

- "获取原理图所有器件"
- "列出所有元器件的位号和封装"
- "统计原理图器件数量"
- "读取器件属性"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_PrimitiveComponent.getAll() — 获取所有器件图元对象
  → Step 2: 遍历器件，调用 getState_* 方法读取属性
  → [可选] Step 3: sch_PrimitiveComponent.getAllPinsByPrimitiveId() — 获取引脚
```

## 分步说明

### Step 1: 获取所有器件

**API**: `eda.sch_PrimitiveComponent.getAll(componentType?, allSchematicPages?)`

**参考**: `../resources/references/classes/SCH_PrimitiveComponent.md`

**参数说明**:
- `componentType`（可选）— 器件类型过滤，参考 `../resources/references/enums/ESCH_PrimitiveComponentType.md`
- `allSchematicPages`（可选）— `true` 获取所有图页的器件，`false`/省略 仅当前图页

**返回类型**: `Promise<Array<ISCH_PrimitiveComponent$1>>`

> ⚠️ `getAll()` 返回的是 `ISCH_PrimitiveComponent$1` 接口，拥有 `getState_Designator()` 等方法。
> `get()` 返回的是 `ISCH_PrimitiveComponent$1`，但单个获取时注意 undefined 检查。

### Step 2: 读取器件属性

**从每个器件图元对象获取**:
- `getState_Designator()` — 位号（如 R1, C2, U3）
- `getState_Name()` — 器件名称
- `getState_Component()` — 关联库器件信息（含 uuid, libraryUuid）
- `getState_X()` / `getState_Y()` — 坐标
- `getState_Rotation()` — 旋转角度
- `getState_Mirror()` — 是否镜像
- `getState_PrimitiveId()` — 图元 ID

> 完整属性列表请查阅 `../resources/references/interfaces/ISCH_Primitive.md` 及器件图元的具体接口文档。

### [可选] Step 3: 获取器件引脚

**API**: `eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(primitiveId)`

**返回类型**: `Promise<Array<ISCH_PrimitiveComponentPin> | undefined>`

**参考**: `../resources/references/classes/ISCH_PrimitiveComponentPin.md`

> 注意：`eda.sch_PrimitivePin.getAll()` 仅在符号编辑器可用，原理图中获取引脚必须通过 `getAllPinsByPrimitiveId`。

## 代码示例

```typescript
const PLUGIN_TAG = '[MyPlugin]';

export async function listAllComponents() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      await eda.sys_Dialog.showInformationMessage('Please open a schematic page.');
      return;
    }

    // 获取所有图页的器件
    const components = await eda.sch_PrimitiveComponent.getAll(undefined, true);
    if (!components || components.length === 0) {
      console.warn(PLUGIN_TAG, 'No components found');
      await eda.sys_Dialog.showInformationMessage('No components found in schematic.');
      return;
    }

    const result: Array<{ designator: string; name: string }> = [];
    for (const comp of components) {
      result.push({
        designator: comp.getState_Designator() ?? '',
        name: comp.getState_Name() ?? '',
      });
    }

    console.warn(PLUGIN_TAG, `Found ${result.length} components`);
    // ... 后续处理
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get components:', err);
    await eda.sys_Dialog.showInformationMessage('Failed to get components.');
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 调用 `eda.sch_Primitive.getAllPrimitiveId()` | `SCH_Primitive` 是抽象类，没有此方法 | 使用具体类 `eda.sch_PrimitiveComponent.getAllPrimitiveId()` |
| 只获取到当前图页的器件 | 未传 `allSchematicPages: true` | 第二个参数传 `true` |
| `getState_Designator()` 不存在 | 使用了 `get()` 而非 `getAll()` 的返回值 | 确保使用 `getAll()` 返回的对象 |
| 引脚获取失败 | 使用了 `eda.sch_PrimitivePin.getAll()` | 原理图中必须用 `getAllPinsByPrimitiveId(primitiveId)` |

## 变体

- **仅获取特定类型器件**: 传入 `componentType` 参数过滤（参考 `ESCH_PrimitiveComponentType` 枚举）
- **获取器件 ID 列表（不需要属性）**: 使用 `eda.sch_PrimitiveComponent.getAllPrimitiveId()` 更轻量
- **获取所有属性名称**: 使用 `eda.sch_PrimitiveComponent.getAllPropertyNames()` 获取属性名集合
