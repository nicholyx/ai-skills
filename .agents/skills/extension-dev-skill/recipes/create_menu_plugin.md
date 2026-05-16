# 创建带菜单的基础插件

> **适用摘要**: 从零创建一个 EasyEDA Pro 扩展插件，包含 extension.json 菜单配置、入口文件、i18n 和构建配置。

## 触发意图

- "创建一个新插件"
- "初始化插件项目"
- "添加菜单项到原理图/PCB 编辑器"
- "创建扩展骨架"

## 前置条件

| 条件 | 要求 |
|---|---|
| 环境 | Node.js 20+, npm |
| 工作区 | 空目录或已有 pro-api-sdk 模板 |

## 调用链

```
Step 1: 初始化项目（clone pro-api-sdk 或手动创建）
Step 2: 配置 extension.json（菜单、元数据）
Step 3: 编写 src/index.ts 入口文件
Step 4: 配置 i18n（locales/en.json + locales/zh-Hans.json）
Step 5: npm run build
```

## 分步说明

### Step 1: 初始化项目

```bash
git clone https://github.com/easyeda/pro-api-sdk.git my-plugin
cd my-plugin
npm install
```

### Step 2: 配置 extension.json

**参考**: `../resources/guide/extension-json.md`

**关键规则**:
- 所有 `headerMenus[].id` 必须全局唯一（跨所有编辑器页面）
- 使用插件前缀：`myplugin-sch-export`, `myplugin-pcb-check`
- `registerFn` 对应 `src/index.ts` 中 `export` 的函数名

```json
{
  "name": "my-plugin",
  "uuid": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
  "displayName": "My Plugin",
  "description": "A sample EasyEDA Pro plugin",
  "version": "1.0.0",
  "publisher": "Developer",
  "entry": "build/index.js",
  "headerMenus": {
    "sch": [
      {
        "id": "myplugin-sch-main",
        "title": "My Plugin",
        "menuItems": [
          {
            "id": "myplugin-sch-action1",
            "title": "Run Action",
            "registerFn": "action1"
          }
        ]
      }
    ],
    "pcb": [
      {
        "id": "myplugin-pcb-main",
        "title": "My Plugin",
        "menuItems": [
          {
            "id": "myplugin-pcb-action1",
            "title": "Run Action PCB",
            "registerFn": "action1Pcb"
          }
        ]
      }
    ]
  }
}
```

> ⚠️ 所有 ID（包括嵌套的 menuItems）必须全局唯一。即使在不同编辑器页面（sch/pcb），也不能重复。
> ⚠️ 菜单 `title` 的值直接作为 `locales/extensionJson/` 中的翻译 key，不要使用 `%key%` 语法。

### Step 3: 编写入口文件

**文件**: `src/index.ts`

```typescript
const PLUGIN_TAG = '[MyPlugin]';

export async function action1() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo) {
      console.warn(PLUGIN_TAG, 'No active document');
      return;
    }
    // ... 业务逻辑
    await eda.sys_Dialog.showInformationMessage('Action completed!');
  } catch (err) {
    console.error(PLUGIN_TAG, 'action1 failed:', err);
    await eda.sys_Dialog.showInformationMessage('Operation failed.');
  }
}

export async function action1Pcb() {
  try {
    // PCB 专用逻辑
  } catch (err) {
    console.error(PLUGIN_TAG, 'action1Pcb failed:', err);
  }
}
```

### Step 4: 配置 i18n

**参考**: `../resources/guide/i18n.md`

菜单标题的翻译放在 `locales/extensionJson/` 目录下，代码中使用的翻译放在 `locales/` 根目录下。

**locales/extensionJson/en.json**（菜单标题翻译）:
```json
{
  "My Plugin": "My Plugin",
  "Run Action": "Run Action",
  "Run Action PCB": "Run Action PCB"
}
```

**locales/extensionJson/zh-Hans.json**（菜单标题翻译）:
```json
{
  "My Plugin": "我的插件",
  "Run Action": "执行操作",
  "Run Action PCB": "执行操作 PCB"
}
```

**locales/en.json**（代码中 `sys_I18n.text()` 使用的翻译）:
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

### Step 5: 构建

```bash
npm run build
```

输出文件在 `build/dist/*.eext`。

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 菜单只显示一个 | 不同页面使用了相同的 ID | 所有 ID 必须全局唯一，加插件前缀 |
| 点击菜单无反应 | `registerFn` 与导出函数名不匹配 | 确保 `src/index.ts` 中 `export` 了对应函数 |
| 菜单标题未翻译 | 翻译文件放错目录 | 菜单标题翻译放在 `locales/extensionJson/`，不是 `locales/` 根目录 |
| 构建失败 | TypeScript 类型错误 | 先运行 `node scripts/lint-eda-api.js src/` 检查，再 `npm run build` |

## 变体

- **仅原理图插件**: 只配置 `headerMenus.sch`
- **带 iframe UI 的插件**: 参考 `recipes/iframe_custom_ui.md`
- **带快捷键的插件**: 使用 `eda.sys_ShortcutKey` 注册快捷键
