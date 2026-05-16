# 数据存储：扩展用户配置存储

> **适用摘要**: 使用扩展用户配置存储持久化数据（键值对形式）。仅扩展包可用，独立脚本不支持。

## 触发意图

- "保存插件配置"
- "读取用户设置"
- "持久化存储数据"
- "在主进程和 iframe 之间传递数据"

## 前置条件

| 条件 | 要求 |
|---|---|
| 插件类型 | 必须是扩展包（非独立脚本） |

## 调用链

```
Step 1: sys_Storage.setExtensionUserConfig(key, value) — 存储数据
Step 2: sys_Storage.getExtensionUserConfig(key) — 读取数据
  → [可选] getExtensionAllUserConfigs() — 获取所有配置
  → [可选] deleteExtensionUserConfig(key) — 删除单个配置
  → [可选] clearExtensionAllUserConfigs() — 清除所有配置
```

## 分步说明

### Step 1: 存储数据

**API**: `eda.sys_Storage.setExtensionUserConfig(key, value)`

**参考**: `../resources/references/classes/SYS_Storage.md`

**返回类型**: `Promise<boolean>`

- `key` — 配置项名称（字符串）
- `value` — 任意值（对象需先 `JSON.stringify`）
- 如果 key 不存在会自动新建

### Step 2: 读取数据

**API**: `eda.sys_Storage.getExtensionUserConfig(key)`

**返回类型**: `any | undefined`

> ⚠️ **关键陷阱**: `getExtensionUserConfig()` 必须传入 `key` 参数，不传 key 不会返回所有配置，而是返回 `undefined`。获取所有配置请使用 `getExtensionAllUserConfigs()`。

### Step 3: 获取所有配置

**API**: `eda.sys_Storage.getExtensionAllUserConfigs()`

**返回类型**: `{ [key: string]: any }`

> 注意：此方法是同步的，不返回 Promise。

## 代码示例

```typescript
const PLUGIN_TAG = '[StorageDemo]';

export async function saveConfig() {
  try {
    // 存储简单值
    const success = await eda.sys_Storage.setExtensionUserConfig('theme', 'dark');
    if (!success) {
      console.warn(PLUGIN_TAG, 'Failed to save theme config');
      return;
    }

    // 存储复杂对象
    const settings = { fontSize: 14, autoSave: true, language: 'zh-CN' };
    await eda.sys_Storage.setExtensionUserConfig('settings', JSON.stringify(settings));

    console.warn(PLUGIN_TAG, 'Config saved successfully');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to save config:', err);
  }
}

export async function loadConfig() {
  try {
    // 读取单个配置
    const theme = eda.sys_Storage.getExtensionUserConfig('theme');
    if (theme === undefined) {
      console.warn(PLUGIN_TAG, 'Theme config not found, using default');
    }

    // 读取复杂对象
    const raw = eda.sys_Storage.getExtensionUserConfig('settings');
    if (raw) {
      const settings = JSON.parse(raw);
      console.warn(PLUGIN_TAG, 'Loaded settings:', settings.fontSize);
    }

    // 获取所有配置
    const allConfigs = eda.sys_Storage.getExtensionAllUserConfigs();
    console.warn(PLUGIN_TAG, 'All config keys:', Object.keys(allConfigs));
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to load config:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getExtensionUserConfig()` 返回 `undefined` | 未传入 key 参数 | 必须传入 key 字符串 |
| 独立脚本中调用抛出 Error | 仅扩展包可用 | 确保是扩展包项目 |
| 存储对象后读取为字符串 | 需要手动序列化/反序列化 | 存储时 `JSON.stringify`，读取时 `JSON.parse` |
| `getExtensionAllUserConfigs()` 加 `await` | 此方法是同步的 | 直接调用，不需要 `await` |

## 变体

- **iframe 数据交换**: 主进程存数据 → iframe 读数据（参考 `recipes/iframe_custom_ui.md`）
- **删除单个配置**: `eda.sys_Storage.deleteExtensionUserConfig(key)`
- **清除所有配置**: `eda.sys_Storage.clearExtensionAllUserConfigs()` — 谨慎使用
- **覆盖所有配置**: `eda.sys_Storage.setExtensionAllUserConfigs(configs)` — 会覆盖全部，谨慎使用
