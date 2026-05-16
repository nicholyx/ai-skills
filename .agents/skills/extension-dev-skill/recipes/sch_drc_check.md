# 原理图 DRC 检查：设计规则检查

> **适用摘要**: 对当前原理图执行 DRC（Design Rule Check）设计规则检查，可选择是否显示 UI 和是否返回详细错误信息。

## 触发意图

- "运行原理图 DRC 检查"
- "检查原理图设计规则"
- "获取 DRC 错误列表"
- "静默执行 DRC"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开原理图图页（documentType === 1） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为原理图
  → Step 1: sch_Drc.check(strict, userInterface, includeVerboseError) — 执行 DRC 检查
  → Step 2: 根据 includeVerboseError 处理返回值
```

## 分步说明

### Step 1: 执行 DRC 检查（BETA）

**API**: `eda.sch_Drc.check(strict, userInterface, includeVerboseError)`

**参考**: `../resources/references/classes/SCH_Drc.md`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `strict` | boolean | 是否严格检查（当前原理图统一为严格检查模式） |
| `userInterface` | boolean | 是否显示 UI（呼出底部 DRC 窗口） |
| `includeVerboseError` | boolean | 是否返回详细错误信息 |

**返回类型**:
- `includeVerboseError = false` → `Promise<boolean>` — DRC 是否通过
- `includeVerboseError = true` → `Promise<Array<any>>` — 详细错误信息数组

### Step 2: 处理结果

- 当 `includeVerboseError = false` 时，返回 `true` 表示通过，`false` 表示有错误
- 当 `includeVerboseError = true` 时，始终返回数组，空数组表示通过

## 代码示例

```typescript
const PLUGIN_TAG = '[SchDrc]';

export async function runDrcCheck() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 1) {
      console.warn(PLUGIN_TAG, 'Not a schematic page');
      return;
    }

    // 方式 1: 静默检查，仅获取通过/失败
    const passed = await eda.sch_Drc.check(true, false, false);
    if (passed) {
      console.warn(PLUGIN_TAG, 'DRC check passed');
      await eda.sys_Dialog.showInformationMessage('DRC check passed!');
    } else {
      console.warn(PLUGIN_TAG, 'DRC check failed');
    }

    // 方式 2: 获取详细错误信息
    const errors = await eda.sch_Drc.check(true, false, true);
    if (errors.length === 0) {
      console.warn(PLUGIN_TAG, 'No DRC errors');
    } else {
      console.warn(PLUGIN_TAG, `Found ${errors.length} DRC errors`);
      for (const error of errors) {
        console.warn(PLUGIN_TAG, 'DRC error:', error);
      }
    }

    // 方式 3: 显示 UI 窗口
    // await eda.sch_Drc.check(true, true, false);
  } catch (err) {
    console.error(PLUGIN_TAG, 'DRC check failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| DRC 结果不符合预期 | `strict` 参数设置不当 | 当前原理图统一为严格检查，传 `true` |
| 返回值类型混淆 | `includeVerboseError` 为 `true` 时返回数组 | 根据第三个参数判断返回值类型 |
| 在 PCB 中调用 `sch_Drc` | 文档类型不匹配 | PCB DRC 使用 `pcb_Drc` |

## 变体

- **带 UI 的 DRC 检查**: 设置 `userInterface = true` 呼出底部 DRC 窗口
- **PCB DRC 检查**: 使用 `eda.pcb_Drc` 类（参考 PCB 相关文档）
- **DRC 后自动修复**: 结合详细错误信息，针对性修改图元属性
