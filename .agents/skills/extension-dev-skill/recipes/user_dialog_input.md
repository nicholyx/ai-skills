# 获取用户输入（内置对话框）

> **适用摘要**: 通过内置对话框获取用户输入，包括文本输入、选择列表、确认操作。比 iframe 更简单轻量。

## 触发意图

- "让用户输入一个值"
- "让用户选择一个选项"
- "弹出确认对话框"
- "获取用户输入的文本"

## 前置条件

| 条件 | 要求 |
|---|---|
| 权限 | 无特殊要求 |

## 可用对话框类型

### 1. 文本输入 — showInputDialog

**API**: `eda.sys_Dialog.showInputDialog(beforeContent?, afterContent?, title?, type?, value?, otherProperty?, callbackFn?)`

**参考**: `../resources/references/classes/SYS_Dialog.md`

```typescript
eda.sys_Dialog.showInputDialog(
  'Please enter component designator:',  // 输入框上方文字
  '',                                     // 输入框下方文字
  'Input Designator',                     // 窗口标题
  'text',                                 // 输入类型
  'R1',                                   // 默认值
  { placeholder: 'e.g. R1, C2, U3' },    // 其他属性
  (value) => {                            // 回调函数
    if (value !== undefined) {
      // 用户点击了确认，value 为输入的字符串
      handleInput(value);
    }
    // value === undefined 表示用户点击了取消
  }
);
```

**支持的输入类型**: `text`, `number`, `color`, `date`, `datetime-local`, `email`, `password`, `tel`, `time`, `url`, `week`

### 2. 单选/多选 — showSelectDialog

**API**: `eda.sys_Dialog.showSelectDialog(options, beforeContent?, afterContent?, title?, defaultOption?, multiple?, callbackFn?)`

```typescript
// 单选
eda.sys_Dialog.showSelectDialog(
  ['Option A', 'Option B', 'Option C'],
  'Select an option:',
  '',
  'Choose',
  'Option A',    // 默认选项
  false,         // 单选
  (value) => {
    // value: string
    console.warn(PLUGIN_TAG, 'Selected:', value);
  }
);

// 带显示文本的选项
eda.sys_Dialog.showSelectDialog(
  [
    { value: 'top', displayContent: 'Top Layer' },
    { value: 'bottom', displayContent: 'Bottom Layer' },
  ],
  'Select layer:',
  '',
  'Layer',
  undefined,
  false,
  (value) => { /* value 是 'top' 或 'bottom' */ }
);

// 多选
eda.sys_Dialog.showSelectDialog(
  ['R1', 'R2', 'C1', 'C2'],
  'Select components to modify:',
  '',
  'Multi-Select',
  ['R1'],        // 默认选中
  true,          // 多选
  (values) => {
    // values: Array<string>
    console.warn(PLUGIN_TAG, 'Selected:', values);
  }
);
```

### 3. 确认操作 — showConfirmationMessage

**API**: `eda.sys_Dialog.showConfirmationMessage(content, title?, mainButtonTitle?, buttonTitle?, callbackFn?)`

```typescript
eda.sys_Dialog.showConfirmationMessage(
  'Are you sure you want to delete all selected components?',
  'Confirm Delete',
  'Delete',       // 主按钮文字
  'Cancel',       // 取消按钮文字
  (confirmed) => {
    if (confirmed) {
      // 用户点击了主按钮
      performDelete();
    }
  }
);
```

### 4. 消息提示 — showInformationMessage

**API**: `eda.sys_Dialog.showInformationMessage(content, title?, buttonTitle?)`

```typescript
// 纯文本消息，不支持 HTML
eda.sys_Dialog.showInformationMessage(
  'Operation completed successfully!\nProcessed 42 components.',
  'Success',
  'OK'
);
```

> ⚠️ `showInformationMessage` 不支持 HTML 渲染。需要 HTML 内容请使用 iframe。

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用 `alert()` / `confirm()` | 浏览器原生 API 在沙箱中被禁止 | 使用 `eda.sys_Dialog.*` |
| HTML 标签显示为文本 | `showInformationMessage` 不渲染 HTML | 使用 iframe 展示 HTML |
| 回调不触发 | 忘记传 callbackFn 参数 | 确保传入回调函数 |
| 输入值类型错误 | `showInputDialog` 回调值始终为 string | 需要数字时手动 `parseInt` / `parseFloat` |

## 变体

- **复杂表单**: 使用 iframe，参考 `recipes/iframe_custom_ui.md`
- **Toast 通知**: 使用 `eda.sys_Message.showToastMessage()` 或 `eda.sys_ToastMessage`
