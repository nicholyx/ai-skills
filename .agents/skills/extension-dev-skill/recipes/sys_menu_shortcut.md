# 顶部菜单与快捷键管理：注册/修改菜单、注册快捷键

> **适用摘要**: 动态管理顶部菜单（导入/替换/插入系统菜单项）和注册/管理快捷键。

## 触发意图

- "动态添加菜单项"
- "替换顶部菜单"
- "在系统菜单中插入自定义项"
- "注册快捷键"
- "查询已注册的快捷键"

## 前置条件

| 条件 | 要求 |
|---|---|
| 插件类型 | 扩展包 |
| 权限 | 系统菜单操作需启用外部交互权限 |

## 调用链

```
菜单管理:
  → sys_HeaderMenu.insertHeaderMenus(headerMenus) — 导入菜单
  → sys_HeaderMenu.replaceHeaderMenus(headerMenus) — 替换菜单
  → sys_HeaderMenu.removeHeaderMenus() — 移除菜单
  → [高级] sys_HeaderMenu.insertSystemHeaderMenuItem() — 插入系统菜单项

快捷键管理:
  → sys_ShortcutKey.registerShortcutKey(key, title, callbackFn, documentType?, scene?)
  → sys_ShortcutKey.unregisterShortcutKey(key)
  → sys_ShortcutKey.getShortcutKeys(includeSystem?)
```

## 分步说明

### 导入顶部菜单

**API**: `eda.sys_HeaderMenu.insertHeaderMenus(headerMenus)`

**参考**: `../resources/references/classes/SYS_HeaderMenu.md`

**参数类型**: `ISYS_HeaderMenus`

**参考接口**: `../resources/references/interfaces/ISYS_HeaderMenus.md`

### 替换顶部菜单

**API**: `eda.sys_HeaderMenu.replaceHeaderMenus(headerMenus)`

等同于先 `removeHeaderMenus()` 再 `insertHeaderMenus()`。

### 插入系统菜单项（BETA）

**API**: `eda.sys_HeaderMenu.insertSystemHeaderMenuItem(env, id, props)`

**参考枚举**: `../resources/references/enums/ESYS_HeaderMenuEnvironment.md`

> ⚠️ 系统菜单一旦新增无法有效删除，需重启 EDA 恢复。ID 会被自动加上扩展 UUID 前缀。

### 注册快捷键

**API**: `eda.sys_ShortcutKey.registerShortcutKey(shortcutKey, title, callbackFn, documentType?, scene?)`

**参考**: `../resources/references/classes/SYS_ShortcutKey.md`

**参考枚举**:
- `../resources/references/enums/ESYS_ShortcutKeyEffectiveEditorDocumentType.md` — 快捷键生效的文档类型
- `../resources/references/enums/ESYS_ShortcutKeyEffectiveEditorScene.md` — 快捷键生效的编辑器场景

**参考类型**: `../resources/references/types/TSYS_ShortcutKeys.md`

### 查询快捷键

**API**: `eda.sys_ShortcutKey.getShortcutKeys(includeSystem?)`

返回所有已注册快捷键列表。

## 代码示例

```typescript
const PLUGIN_TAG = '[MenuShortcut]';

export async function setupMenus() {
  try {
    await eda.sys_HeaderMenu.insertHeaderMenus({
      sch: [
        {
          id: 'myplugin-sch-tools',
          title: 'My Tools',
          menuItems: [
            {
              id: 'myplugin-sch-action1',
              title: 'Action 1',
              registerFn: 'schAction1',
            },
          ],
        },
      ],
    });

    console.warn(PLUGIN_TAG, 'Menus registered');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to setup menus:', err);
  }
}

export async function registerShortcuts() {
  try {
    const success = await eda.sys_ShortcutKey.registerShortcutKey(
      ['Ctrl', 'Shift', 'K'],
      'My Plugin Action',
      async (key) => {
        console.warn(PLUGIN_TAG, 'Shortcut triggered:', key);
        await eda.sys_Dialog.showInformationMessage('快捷键触发成功！');
      }
    );

    if (success) {
      console.warn(PLUGIN_TAG, 'Shortcut registered');
    } else {
      console.warn(PLUGIN_TAG, 'Shortcut registration failed (may conflict)');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to register shortcut:', err);
  }
}

export async function listShortcuts() {
  try {
    const shortcuts = await eda.sys_ShortcutKey.getShortcutKeys(false);
    console.warn(PLUGIN_TAG, `Found ${shortcuts.length} custom shortcuts`);

    for (const sc of shortcuts) {
      console.warn(PLUGIN_TAG, `  ${sc.title}: ${sc.shortcutKey}`);
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to list shortcuts:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 菜单不显示 | ID 重复（跨编辑器页面也不能重复） | 所有 ID 加插件前缀，全局唯一 |
| 系统菜单项无法删除 | 设计如此，需重启 EDA | 使用 `removeSystemHeaderMenuItem()` 或重启 |
| 快捷键注册失败 | 与已有快捷键冲突 | 选择不冲突的组合键 |
| `insertSystemHeaderMenuItem` 报错 | 未启用外部交互权限 | 启用扩展的外部交互权限 |
| 不能在高级菜单下新增 | API 限制 | 选择其他一级菜单 |

## 变体

- **仅原理图菜单**: 只配置 `headerMenus.sch`
- **限定快捷键生效范围**: 传入 `documentType` 和 `scene` 参数限制快捷键仅在特定编辑器/场景生效
- **反注册快捷键**: `eda.sys_ShortcutKey.unregisterShortcutKey(shortcutKey)`
- **静态菜单配置**: 在 `extension.json` 中配置（参考 `recipes/create_menu_plugin.md`）
