# 运行环境信息：获取 EDA 版本、主题、语言、用户信息

> **适用摘要**: 获取 EasyEDA Pro 运行环境参数，包括版本号、编译日期、用户信息、运行模式（在线/离线/客户端/浏览器）。

## 触发意图

- "获取 EDA 版本号"
- "判断是客户端还是浏览器"
- "获取当前用户信息"
- "判断在线/离线模式"
- "判断是嘉立创版还是 EasyEDA 版"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求 |

## 调用链

```
eda.sys_Environment
  → getEditorCurrentVersion() — 版本号
  → getEditorCompliedDate() — 编译日期
  → getUserInfo() — 用户信息
  → isClient() / isWeb() — 运行环境
  → isOnlineMode() / isOfflineMode() / isHalfOfflineMode() — 网络模式
  → isJLCEDAProEdition() / isEasyEDAProEdition() — 产品版本
  → isProPrivateEdition() — 是否私有部署
```

## 分步说明

### 获取版本信息

**API**: `eda.sys_Environment.getEditorCurrentVersion()` / `getEditorCompliedDate()`

**参考**: `../resources/references/classes/SYS_Environment.md`

**返回类型**: `string`（同步方法）

### 获取用户信息

**API**: `eda.sys_Environment.getUserInfo()`

**返回类型**: `{ username?: string, nickname?: string, avatar?: string, uuid?: string, customerCode?: string }`

### 判断运行环境

- `isClient()` — 是否客户端（Electron）
- `isWeb()` — 是否浏览器环境
- `isOnlineMode()` — 在线模式
- `isOfflineMode()` — 全离线模式
- `isHalfOfflineMode()` — 半离线模式

### 判断产品版本

- `isJLCEDAProEdition()` — 嘉立创 EDA 专业版
- `isEasyEDAProEdition()` — EasyEDA Pro 版
- `isProPrivateEdition()` — 私有化部署版

## 代码示例

```typescript
const PLUGIN_TAG = '[EnvInfo]';

export async function showEnvironmentInfo() {
  try {
    const version = eda.sys_Environment.getEditorCurrentVersion();
    const compileDate = eda.sys_Environment.getEditorCompliedDate();
    const userInfo = eda.sys_Environment.getUserInfo();
    const isClient = eda.sys_Environment.isClient();
    const isOnline = eda.sys_Environment.isOnlineMode();

    const envType = isClient ? '客户端' : '浏览器';
    const modeType = isOnline ? '在线' : eda.sys_Environment.isHalfOfflineMode() ? '半离线' : '全离线';

    console.warn(PLUGIN_TAG, `Version: ${version}, Compiled: ${compileDate}`);
    console.warn(PLUGIN_TAG, `User: ${userInfo.nickname ?? 'Unknown'}`);
    console.warn(PLUGIN_TAG, `Environment: ${envType}, Mode: ${modeType}`);

    await eda.sys_Dialog.showInformationMessage(
      `版本: ${version}\n环境: ${envType}\n模式: ${modeType}\n用户: ${userInfo.nickname ?? '未登录'}`
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get environment info:', err);
  }
}

export async function checkCompatibility() {
  try {
    // 根据环境决定功能可用性
    const isClient = eda.sys_Environment.isClient();
    if (!isClient) {
      console.warn(PLUGIN_TAG, 'File system operations not available in browser');
      await eda.sys_Dialog.showInformationMessage('部分功能仅在客户端可用');
      return;
    }

    const isPrivate = eda.sys_Environment.isProPrivateEdition();
    if (isPrivate) {
      console.warn(PLUGIN_TAG, 'Running in private deployment, some features may be limited');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Compatibility check failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getUserInfo()` 字段为 `undefined` | 用户未登录或离线模式 | 添加 null 检查 |
| 文件系统 API 在浏览器报错 | 仅客户端可用 | 先用 `isClient()` 检查环境 |
| `getByLcscIds()` 在私有部署报错 | 私有部署不支持 | 用 `isProPrivateEdition()` 检查 |
| 所有方法都是同步的 | 设计如此 | 不需要 `await` |

## 变体

- **获取主题**: 使用 `eda.sys_Window.getCurrentTheme()` 获取当前主题（浅色/深色）
- **获取语言**: 使用 `eda.sys_I18n.getCurrentLanguage()` 获取当前语言
- **条件功能**: 根据 `isClient()` / `isOnlineMode()` 动态启用/禁用功能
