# 通知与消息：吐司消息、消息框、加载/进度条

> **适用摘要**: 使用 `sys_Message` 显示吐司消息和鼠标跟随提示，使用 `sys_LoadingAndProgressBar` 显示加载覆盖和进度条。`sys_ToastMessage` 和 `sys_MessageBox` 已弃用。

## 触发意图

- "显示提示消息"
- "弹出吐司通知"
- "显示加载动画"
- "显示进度条"
- "显示鼠标跟随提示"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求 |

## 调用链

```
吐司消息:
  → sys_Message.showToastMessage(message, type?, timer?)

鼠标跟随提示:
  → sys_Message.showFollowMouseTip(tip, msTimeout?)
  → sys_Message.removeFollowMouseTip(tip?)

加载覆盖:
  → sys_LoadingAndProgressBar.showLoading()
  → sys_LoadingAndProgressBar.destroyLoading()

进度条:
  → sys_LoadingAndProgressBar.showProgressBar(progress?, title?)
  → sys_LoadingAndProgressBar.destroyProgressBar()
```

## 分步说明

### 吐司消息

**API**: `eda.sys_Message.showToastMessage(message, messageType?, timer?, bottomPanel?, buttonTitle?, buttonCallbackFn?)`

**参考**: `../resources/references/classes/SYS_Message.md`

**参考枚举**:
- `../resources/references/enums/ESYS_ToastMessageType.md` — 消息类型（info/warning/error）
- `../resources/references/enums/ESYS_BottomPanelTab.md` — 底部面板标签页

### 鼠标跟随提示（BETA）

**显示**: `eda.sys_Message.showFollowMouseTip(tip, msTimeout?)`

**移除**: `eda.sys_Message.removeFollowMouseTip(tip?)`

同一时间只能展示一条提示，新提示会覆盖旧提示。

### 加载覆盖

**API**: `eda.sys_LoadingAndProgressBar`

**参考**: `../resources/references/classes/SYS_LoadingAndProgressBar.md`

- `showLoading()` — 显示无进度加载覆盖（阻止用户操作）
- `destroyLoading()` — 销毁加载覆盖

### 进度条

- `showProgressBar(progress?, title?)` — 显示进度条，`progress` 取值 `0-100`
- `destroyProgressBar()` — 销毁进度条

> 进度达到 `100` 时自动销毁。

### 已弃用 API

- `eda.sys_ToastMessage` → 请使用 `eda.sys_Message.showToastMessage()`
- `eda.sys_MessageBox` → 请使用 `eda.sys_Dialog`（参考 `../resources/references/classes/SYS_Dialog.md`）

## 代码示例

```typescript
const PLUGIN_TAG = '[Notification]';

export async function showNotifications() {
  try {
    // 吐司消息（5 秒后自动关闭）
    eda.sys_Message.showToastMessage('操作完成！', 0, 5);

    // 警告类型吐司
    eda.sys_Message.showToastMessage('请注意检查数据', 1, 3);

    // 错误类型吐司
    eda.sys_Message.showToastMessage('操作失败', 2, 0); // 不自动关闭
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to show notification:', err);
  }
}

export async function showMouseTip() {
  try {
    // 显示鼠标跟随提示（3 秒后自动消失）
    await eda.sys_Message.showFollowMouseTip('请选择一个元件', 3000);

    // 或持续显示直到手动移除
    await eda.sys_Message.showFollowMouseTip('正在等待操作...');
    // ... 操作完成后移除
    await eda.sys_Message.removeFollowMouseTip();
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to show mouse tip:', err);
  }
}

export async function processWithProgress() {
  try {
    const items = new Array(20).fill(null);

    eda.sys_LoadingAndProgressBar.showProgressBar(0, '正在处理...');

    for (let i = 0; i < items.length; i++) {
      // 模拟处理
      const progress = Math.round(((i + 1) / items.length) * 100);
      eda.sys_LoadingAndProgressBar.showProgressBar(progress, `处理中 ${i + 1}/${items.length}`);
    }

    // 进度到 100 会自动销毁，也可手动销毁
    console.warn(PLUGIN_TAG, 'Processing complete');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Processing failed:', err);
    eda.sys_LoadingAndProgressBar.destroyProgressBar();
  }
}

export async function showLoadingOverlay() {
  try {
    eda.sys_LoadingAndProgressBar.showLoading();

    // 执行耗时操作...
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();

    eda.sys_LoadingAndProgressBar.destroyLoading();
    console.warn(PLUGIN_TAG, 'Loading complete');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Operation failed:', err);
    eda.sys_LoadingAndProgressBar.destroyLoading();
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用 `sys_ToastMessage` | 已弃用 | 改用 `sys_Message.showToastMessage()` |
| 使用 `sys_MessageBox` | 已弃用 | 改用 `sys_Dialog` |
| 加载覆盖未销毁 | 异常时未调用 `destroyLoading()` | 在 `catch` 块中也调用 `destroyLoading()` |
| 进度条不消失 | 进度值未达到 100 | 确保最终设置 `progress = 100` 或手动 `destroyProgressBar()` |
| 鼠标提示被覆盖 | 同一时间只能显示一条 | 设计如此，新提示自动替换旧提示 |

## 变体

- **带按钮的吐司**: 传入 `buttonTitle` 和 `buttonCallbackFn` 参数
- **展开底部面板**: 传入 `bottomPanel` 参数自动展开底部信息面板
- **确认对话框**: 使用 `eda.sys_Dialog.showConfirmationMessage()`（参考 `recipes/user_dialog_input.md`）
