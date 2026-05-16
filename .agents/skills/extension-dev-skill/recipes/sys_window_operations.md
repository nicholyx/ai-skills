# 窗口操作：打开 URL、窗口事件、右键菜单、面板控制、消息总线

> **适用摘要**: 使用 `sys_Window` 打开 URL 和监听窗口事件，使用 `sys_RightClickMenu` 修改右键菜单，使用 `sys_PanelControl` 控制面板，使用 `sys_MessageBus` 进行扩展间通信。

## 触发意图

- "打开外部链接"
- "监听窗口焦点事件"
- "获取当前主题"
- "修改右键菜单"
- "控制左/右/底部面板"
- "扩展间消息通信"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求 |
| 权限 | 右键菜单操作需启用外部交互权限 |

## 调用链

```
窗口操作:
  → sys_Window.open(url, target?) — 打开 URL
  → sys_Window.getCurrentTheme() — 获取主题
  → sys_Window.addEventListener(type, listener) — 监听事件

右键菜单:
  → sys_RightClickMenu.changeMenu(menuId, menuItems) — 修改右键菜单

面板控制:
  → sys_PanelControl.openLeftPanel(tab?) / closeLeftPanel()
  → sys_PanelControl.openRightPanel(tab?) / closeRightPanel()
  → sys_PanelControl.openBottomPanel(tab?) / closeBottomPanel()

消息总线:
  → sys_MessageBus.subscribe(topic, callbackFn) — 订阅消息
  → sys_MessageBus.publish(topic, message) — 发布消息
```

## 分步说明

### 打开 URL

**API**: `eda.sys_Window.open(url, target?)`

**参考**: `../resources/references/classes/SYS_Window.md`

**参考枚举**: `../resources/references/enums/ESYS_WindowOpenTarget.md`

> ⚠️ **关键陷阱**: 必须使用 `eda.sys_Window.open()` 而不是 `window.open()`，沙箱环境限制了原生 `window` 方法。

### 获取主题

**API**: `eda.sys_Window.getCurrentTheme()`

**返回类型**: `Promise<ESYS_Theme>`

**参考枚举**: `../resources/references/enums/ESYS_Theme.md`

### 窗口事件监听

**API**: `eda.sys_Window.addEventListener(type, listener, options?)`

当前支持事件类型: `blur`, `focus`

**移除监听**: `eda.sys_Window.removeEventListener(removableObject)`

### 右键菜单（BETA）

**API**: `eda.sys_RightClickMenu.changeMenu(menuId, menuItems)`

**参考**: `../resources/references/classes/SYS_RightClickMenu.md`

当前仅支持底部菜单器件/符号/封装/复用模块列表项目的右键菜单修改。

### 面板控制

**API**: `eda.sys_PanelControl`

**参考**: `../resources/references/classes/SYS_PanelControl.md`

**参考枚举**:
- `../resources/references/enums/ESYS_LeftPanelTab.md`
- `../resources/references/enums/ESYS_RightPanelTab.md`
- `../resources/references/enums/ESYS_BottomPanelTab.md`

### 消息总线

**API**: `eda.sys_MessageBus`

**参考**: `../resources/references/classes/SYS_MessageBus.md`

**私有消息总线**: `subscribe` / `publish` / `push` / `pull` — 仅本扩展内通信

**公共消息总线**: `subscribePublic` / `publishPublic` / `pushPublic` / `pullPublic` — 跨扩展通信

**RPC 模式**: `rpcService` / `rpcCall` — 请求-响应模式

## 代码示例

```typescript
const PLUGIN_TAG = '[WindowOps]';

export async function openExternalUrl() {
  try {
    // 必须使用 eda.sys_Window.open()，不要用 window.open()
    eda.sys_Window.open('https://docs.easyeda.com');
    console.warn(PLUGIN_TAG, 'URL opened');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to open URL:', err);
  }
}

export async function getThemeInfo() {
  try {
    const theme = await eda.sys_Window.getCurrentTheme();
    console.warn(PLUGIN_TAG, 'Current theme:', theme);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get theme:', err);
  }
}

export async function controlPanels() {
  try {
    // 打开底部面板
    eda.sys_PanelControl.openBottomPanel();

    // 锁定右侧面板
    eda.sys_PanelControl.toggleRightPanelLockState(true);

    console.warn(PLUGIN_TAG, 'Panels configured');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to control panels:', err);
  }
}

export async function setupMessageBus() {
  try {
    // 订阅消息（私有总线）
    const task = eda.sys_MessageBus.subscribe('my-topic', (message) => {
      console.warn(PLUGIN_TAG, 'Received message:', message);
    });

    // 发布消息
    eda.sys_MessageBus.publish('my-topic', { action: 'update', data: 42 });

    // 公共消息总线（跨扩展）
    eda.sys_MessageBus.subscribePublic('shared-topic', (message) => {
      console.warn(PLUGIN_TAG, 'Public message:', message);
    });
  } catch (err) {
    console.error(PLUGIN_TAG, 'MessageBus setup failed:', err);
  }
}

export async function setupRpc() {
  try {
    // 注册 RPC 服务
    eda.sys_MessageBus.rpcService('my-rpc', async (data) => {
      console.warn(PLUGIN_TAG, 'RPC called with:', data);
      return { result: 'ok', processed: true };
    });

    // 调用 RPC 服务
    const result = await eda.sys_MessageBus.rpcCall('my-rpc', { query: 'test' }, 5000);
    console.warn(PLUGIN_TAG, 'RPC result:', result);
  } catch (err) {
    console.error(PLUGIN_TAG, 'RPC failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 使用 `window.open()` | 沙箱限制 | 使用 `eda.sys_Window.open()` |
| 右键菜单修改无效 | 仅支持底部库列表右键菜单 | 检查 menuId 是否正确 |
| 消息总线消息丢失 | 先发布后订阅 | 确保先订阅再发布 |
| `addEventListener` 返回 `undefined` | 不支持的事件类型 | 仅支持 `blur` 和 `focus` |
| 右键菜单操作报错 | 未启用外部交互权限 | 启用扩展的外部交互权限 |

## 变体

- **URL 操作**: `getUrlParam(key)` / `getUrlAnchor()` / `urlPushState()` / `urlReplaceState()`
- **单次订阅**: `subscribeOnce()` / `subscribeOncePublic()` — 只接收一次消息
- **拉消息模式**: `pull()` / `pullAsync()` — 每次只拉一条消息
- **面板锁定查询**: `isLeftPanelLocked()` / `isRightPanelLocked()` / `isBottomPanelLocked()`
