# 国际化（i18n）：多语言支持、注册语言数据、获取翻译文本

> **适用摘要**: 使用 `sys_I18n` 实现插件多语言支持，包括导入语言数据、获取翻译文本、监听语言切换事件。

## 触发意图

- "添加多语言支持"
- "获取当前语言"
- "注册翻译数据"
- "监听语言切换"
- "输出多语言文本"

## 前置条件

| 条件 | 要求 |
|---|---|
| 插件类型 | `importMultilingual()` 仅扩展包可用 |
| 语言文件 | 需准备 `locales/en.json` + `locales/zh-Hans.json` |

## 调用链

```
Step 1: 准备语言文件（locales/en.json, locales/zh-Hans.json）
Step 2: [可选] sys_I18n.importMultilingual(language, source) — 动态导入语言数据
Step 3: sys_I18n.text(tag, namespace?, language?) — 获取翻译文本
Step 4: [可选] sys_I18n.addLanguageChangedEventListener() — 监听语言切换
```

## 分步说明

### Step 1: 准备语言文件

**参考指南**: `../resources/guide/i18n.md`

在 `locales/` 目录下创建语言文件：

**locales/en.json**:
```json
{
  "myplugin.title": "My Plugin",
  "myplugin.greeting": "Hello, ${1}!"
}
```

**locales/zh-Hans.json**:
```json
{
  "myplugin.title": "我的插件",
  "myplugin.greeting": "你好，${1}！"
}
```

### Step 2: 获取翻译文本

**API**: `eda.sys_I18n.text(tag, namespace?, language?, ...args)`

**参考**: `../resources/references/classes/SYS_I18n.md`

**返回类型**: `string`

- `tag` — 文本标签（对应 JSON 中的 key）
- `namespace` — 命名空间（扩展环境默认为扩展 UUID）
- `language` — 语言（默认为当前显示语言）
- `args` — 替换 `${1}`, `${2}` 等占位符的参数

**语言优先级**: 当前显示语言 → 系统默认语言 → 数据集中第一个匹配语言 → tag 本身

### Step 3: 获取当前语言

**API**: `eda.sys_I18n.getCurrentLanguage()`

**返回类型**: `Promise<string>`

### Step 4: 动态导入语言数据

**API**: `eda.sys_I18n.importMultilingual(language, source)` — 按语言导入

**API**: `eda.sys_I18n.importMultilingualNamespace(namespace, source)` — 按命名空间导入

### Step 5: 监听语言切换

**API**: `eda.sys_I18n.addLanguageChangedEventListener(id, callFn, onlyOnce)`

## 代码示例

```typescript
const PLUGIN_TAG = '[I18nDemo]';

export async function showLocalizedMessage() {
  try {
    // 获取当前语言
    const lang = await eda.sys_I18n.getCurrentLanguage();
    console.warn(PLUGIN_TAG, 'Current language:', lang);

    // 获取翻译文本
    const title = eda.sys_I18n.text('myplugin.title');
    const greeting = eda.sys_I18n.text('myplugin.greeting', undefined, undefined, 'World');

    await eda.sys_Dialog.showInformationMessage(`${title}\n${greeting}`);
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to show localized message:', err);
  }
}

export async function dynamicImportLanguage() {
  try {
    // 动态导入语言数据
    const success = eda.sys_I18n.importMultilingual('en', {
      'myplugin.dynamic.msg': 'Dynamic message',
    });

    eda.sys_I18n.importMultilingual('zh-Hans', {
      'myplugin.dynamic.msg': '动态消息',
    });

    if (success) {
      const msg = eda.sys_I18n.text('myplugin.dynamic.msg');
      console.warn(PLUGIN_TAG, 'Dynamic text:', msg);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to import language:', err);
  }
}

export async function listenLanguageChange() {
  try {
    eda.sys_I18n.addLanguageChangedEventListener(
      'myplugin-lang-change',
      (newLang, lastLang) => {
        console.warn(PLUGIN_TAG, `Language changed: ${lastLang} → ${newLang}`);
        // 更新 UI 文本等
      },
      false // 持续监听
    );

    console.warn(PLUGIN_TAG, 'Language change listener registered');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to register listener:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `text()` 返回 tag 本身 | 未找到对应翻译 | 检查 key 是否匹配，确认语言数据已导入 |
| `importMultilingual()` 抛出 Error | 在独立脚本中调用 | 仅扩展包可用 |
| 菜单标题未翻译 | 翻译文件放错目录 | 菜单标题翻译放在 `locales/extensionJson/`，代码翻译放在 `locales/` |
| 占位符未替换 | 未传入 args 参数 | 使用 `text(tag, undefined, undefined, arg1, arg2)` |
| 监听器重复注册 | 未检查是否已存在 | 先用 `isEventListenerAlreadyExist(id)` 检查 |

## 变体

- **按命名空间导入**: `importMultilingualNamespace(namespace, source)` — 适合多模块插件
- **按命名空间+语言导入**: `importMultilingualLanguage(namespace, language, source)`
- **检查语言支持**: `isLanguageSupported(language)` — 检查 EDA 是否支持指定语言
- **获取所有支持语言**: `getAllSupportedLanguages()` — 返回语言列表
- **移除监听器**: `removeEventListener(id)`
