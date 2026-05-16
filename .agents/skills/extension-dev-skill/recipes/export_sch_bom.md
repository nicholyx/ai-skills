# 导出原理图 BOM 表

> **适用摘要**: 从原理图获取所有器件信息，生成 BOM（物料清单），包含位号、名称、封装、制造商等。

## 触发意图

- "导出 BOM"
- "生成物料清单"
- "统计所有器件及其属性"
- "获取器件的制造商和供应商信息"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 数据范围 | 建议使用 `allSchematicPages: true` 获取完整 BOM |

## 调用链

```
确认当前文档为原理图
  → Step 1: dmt_SelectControl.getCurrentDocumentInfo() — 确认文档类型
  → Step 2: sch_PrimitiveComponent.getAll(undefined, true) — 获取所有图页器件
  → Step 3: 遍历器件，提取 BOM 字段
  → Step 4: 格式化输出（对话框展示 / iframe 表格 / 存储导出）
```

## 分步说明

### Step 1: 确认文档类型

参考 `recipes/get_current_document.md`

### Step 2: 获取所有器件

**API**: `eda.sch_PrimitiveComponent.getAll(undefined, true)`

**参考**: `../resources/references/classes/SCH_PrimitiveComponent.md`

传入 `allSchematicPages: true` 获取所有图页的器件。

### Step 3: 提取 BOM 字段

从每个器件图元对象提取：
- `getState_Designator()` — 位号
- `getState_Name()` — 器件名称/值
- `getState_Component()` — 关联库信息

### Step 4: 输出结果

- **简单文本**: 使用 `eda.sys_Dialog.showInformationMessage()` 展示摘要
- **复杂表格**: 使用 `eda.sys_IFrame.openIFrame()` 展示 HTML 表格
- **存储数据**: 使用 `eda.sys_Storage.setExtensionUserConfig()` 保存

> `showInformationMessage()` 不支持 HTML 渲染，复杂内容必须用 iframe。

## 代码示例

```typescript
const PLUGIN_TAG = '[BomExport]';

interface BomItem {
  designator: string;
  name: string;
  quantity: number;
}

export async function exportBom() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      await eda.sys_Dialog.showInformationMessage('Please open a schematic page.');
      return;
    }

    const components = await eda.sch_PrimitiveComponent.getAll(undefined, true);
    if (!components || components.length === 0) {
      console.warn(PLUGIN_TAG, 'No components found');
      await eda.sys_Dialog.showInformationMessage('No components found.');
      return;
    }

    // 按名称分组统计
    const bomMap = new Map<string, BomItem>();
    for (const comp of components) {
      const name = comp.getState_Name() ?? 'Unknown';
      const designator = comp.getState_Designator() ?? '';

      if (bomMap.has(name)) {
        const item = bomMap.get(name)!;
        item.quantity++;
        item.designator += `, ${designator}`;
      } else {
        bomMap.set(name, { designator, name, quantity: 1 });
      }
    }

    const bomList = Array.from(bomMap.values());
    const summary = bomList
      .map(item => `${item.name} x${item.quantity} (${item.designator})`)
      .join('\n');

    await eda.sys_Dialog.showInformationMessage(
      `BOM Summary (${bomList.length} unique parts, ${components.length} total):\n\n${summary}`
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to export BOM:', err);
    await eda.sys_Dialog.showInformationMessage('BOM export failed.');
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| BOM 不完整 | 未传 `allSchematicPages: true` | 第二个参数传 `true` 获取所有图页 |
| HTML 表格不显示 | 用 `showInformationMessage` 传 HTML | 复杂内容必须用 iframe |
| 器件名称为空 | 部分器件未设置名称 | 添加 null 检查，使用默认值 |

## 变体

- **导出为 CSV**: 将 BOM 数据格式化为 CSV 字符串，通过 iframe 提供下载
- **包含自定义属性**: 使用 `getAllPropertyNames()` 获取所有属性名，再逐一读取
- **仅导出特定类型**: 传入 `componentType` 参数过滤
