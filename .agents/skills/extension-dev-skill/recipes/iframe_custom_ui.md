# 创建自定义 UI（IFrame）

> **适用摘要**: 使用 iframe 创建自定义 UI 窗口，实现复杂的表格、表单、图表等界面。包含主进程与 iframe 之间的数据交换方法。

## 触发意图

- "创建自定义界面"
- "显示 HTML 表格"
- "做一个设置面板"
- "在插件中显示复杂 UI"

## 前置条件

| 条件 | 要求 |
|---|---|
| 插件类型 | 必须是扩展包（非独立脚本） |
| 文件位置 | HTML 文件放在扩展包的 `/iframe/` 目录 |

## 调用链

```
Step 1: 创建 iframe/index.html（UI 页面）
Step 2: 在主进程中准备数据，存入 sys_Storage
Step 3: 调用 sys_IFrame.openIFrame() 打开窗口
Step 4: iframe 中通过 eda 对象读取数据或直接调用 API
```

## 分步说明

### Step 1: 创建 HTML 文件

**文件**: `iframe/index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Plugin UI</title>
  <link rel="stylesheet" href="/iframe/style.css">
</head>
<body>
  <div id="app"></div>
  <script src="/iframe/app.js"></script>
</body>
</html>
```

> ⚠️ CSS/JS 路径必须使用完整路径（`/iframe/style.css`），不要用相对路径。

### Step 2: 数据交换

**方式 A（推荐）: 通过 sys_Storage**

主进程存数据：
```typescript
await eda.sys_Storage.setExtensionUserConfig('pluginData', JSON.stringify(data));
```

iframe 读数据：
```typescript
// iframe 中也可以直接使用 eda 对象
const raw = await eda.sys_Storage.getExtensionUserConfig('pluginData');
const data = JSON.parse(raw);
```

**方式 B: iframe 直接调用 eda API**

```typescript
// iframe 中直接使用 eda，无需 window.parent
const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
const components = await eda.sch_PrimitiveComponent.getAll();
```

> ⚠️ 主进程和 iframe 的 `window` 对象是隔离的！
> ❌ `(window as any).__data = data` — 不可用
> ❌ `window.parent.eda` — 不需要，直接用 `eda`

### Step 3: 打开 IFrame 窗口

**API**: `eda.sys_IFrame.openIFrame(htmlFileName, width?, height?, id?, props?)`

**参考**: `../resources/references/classes/SYS_IFrame.md`

```typescript
await eda.sys_IFrame.openIFrame('/iframe/index.html', 600, 400, 'my-ui', {
  title: 'My Plugin',
  maximizeButton: true,
  minimizeButton: true,
});
```

**参数说明**:
- `htmlFileName` — HTML 文件路径，从扩展根目录起始
- `width` / `height` — 窗口宽高（像素）
- `id` — 窗口 ID（用于后续关闭/隐藏/显示）
- `props.title` — 窗口标题
- `props.maximizeButton` — 是否显示最大化按钮
- `props.minimizeButton` — 是否显示最小化按钮

### Step 4: 关闭/控制窗口

```typescript
await eda.sys_IFrame.closeIFrame('my-ui');  // 关闭指定窗口
await eda.sys_IFrame.hideIFrame('my-ui');   // 隐藏
await eda.sys_IFrame.showIFrame('my-ui');   // 显示
await eda.sys_IFrame.closeIFrame();         // 关闭所有本扩展的窗口
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `openIFrame` 传入 query 参数 | 不支持 `?mode=add` 等查询参数 | 通过 `sys_Storage` 传递参数 |
| CSS/JS 加载失败 | 使用了相对路径 | 使用完整路径 `/iframe/style.css` |
| `window.__data` 读不到 | 主进程和 iframe window 隔离 | 使用 `sys_Storage` 或 iframe 直接调用 eda |
| `window.parent.eda` | 不需要，iframe 可直接访问 `eda` | 直接使用 `eda` 对象 |
| 独立脚本中调用 openIFrame | 仅扩展包可用 | 确保是扩展包项目，非独立脚本 |

## 变体

- **简单输入**: 不需要 iframe，使用 `eda.sys_Dialog.showInputDialog()` 更简单
- **简单选择**: 使用 `eda.sys_Dialog.showSelectDialog()`
- **多个 iframe 窗口**: 为每个窗口指定不同的 `id`
