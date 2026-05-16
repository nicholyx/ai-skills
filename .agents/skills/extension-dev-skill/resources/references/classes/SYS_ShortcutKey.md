# SYS\_ShortcutKey class

系统 / 快捷键类

## 签名

```typescript
declare class SYS_ShortcutKey
```

## 备注

注册与管理系统快捷键

## 方法

| 方法名                                                                                              | 修饰符 | 描述                   |
| ------------------------------------------------------------------------------------------------ | --- | -------------------- |
| [getShortcutKeys(includeSystem)](./SYS_ShortcutKey.md)                                           |     | **_(BETA)_** 查询快捷键列表 |
| [registerShortcutKey(shortcutKey, title, callbackFn, documentType, scene)](./SYS_ShortcutKey.md) |     | **_(BETA)_** 注册快捷键   |
| [unregisterShortcutKey(shortcutKey)](./SYS_ShortcutKey.md)                                       |     | **_(BETA)_** 反注册快捷键  |

---

## 方法详情

### getshortcutkeys

# SYS\_ShortcutKey.getShortcutKeys() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

查询快捷键列表

## 签名

```typescript
getShortcutKeys(includeSystem?: boolean): Promise<Array<{
        shortcutKey: TSYS_ShortcutKeys;
        title: string;
        documentType: Array<ESYS_ShortcutKeyEffectiveEditorDocumentType>;
        scene: Array<ESYS_ShortcutKeyEffectiveEditorScene>;
    }>>;
```

## 参数名

| 参数            | 类型      | 描述               |
| ------------- | ------- | ---------------- |
| includeSystem | boolean | _（可选）_ 是否包含系统快捷键 |



## 返回值

Promise&lt;Array&lt;{ shortcutKey: [TSYS\_ShortcutKeys](../types/TSYS_ShortcutKeys.md); title: string; documentType: Array&lt;[ESYS\_ShortcutKeyEffectiveEditorDocumentType](../enums/ESYS_ShortcutKeyEffectiveEditorDocumentType.md)&gt;; scene: Array&lt;[ESYS\_ShortcutKeyEffectiveEditorScene](../enums/ESYS_ShortcutKeyEffectiveEditorScene.md)&gt;; }&gt;&gt;

快捷键列表

### registershortcutkey

# SYS\_ShortcutKey.registerShortcutKey() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

注册快捷键

## 签名

```typescript
registerShortcutKey(shortcutKey: TSYS_ShortcutKeys, title: string, callbackFn: (shortcutKey: TSYS_ShortcutKeys) => void | Promise<void>, documentType?: Array<ESYS_ShortcutKeyEffectiveEditorDocumentType>, scene?: Array<ESYS_ShortcutKeyEffectiveEditorScene>): Promise<boolean>;
```

## 参数名

| 参数           | 类型                                                                                                                   | 描述                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| shortcutKey  | [TSYS\_ShortcutKeys](../types/TSYS_ShortcutKeys.md)                                                                  | 快捷键，数组中包含多个元素则解析为组合快捷键，将按规则排序后存入缓存 |
| title        | string                                                                                                               | 快捷键标题，快捷键的友好名称                     |
| callbackFn   | (shortcutKey: [TSYS\_ShortcutKeys](../types/TSYS_ShortcutKeys.md)) =&gt; void \| Promise&lt;void&gt;                 | 回调函数                               |
| documentType | Array&lt;[ESYS\_ShortcutKeyEffectiveEditorDocumentType](../enums/ESYS_ShortcutKeyEffectiveEditorDocumentType.md)&gt; | _(Optional)_                       |
| scene        | Array&lt;[ESYS\_ShortcutKeyEffectiveEditorScene](../enums/ESYS_ShortcutKeyEffectiveEditorScene.md)&gt;               | _(Optional)_                       |



## 返回值

Promise&lt;boolean&gt;

注册操作是否成功

### unregistershortcutkey

# SYS\_ShortcutKey.unregisterShortcutKey() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

反注册快捷键

## 签名

```typescript
unregisterShortcutKey(shortcutKey: TSYS_ShortcutKeys): Promise<boolean>;
```

## 参数名

| 参数          | 类型                                                  | 描述                            |
| ----------- | --------------------------------------------------- | ----------------------------- |
| shortcutKey | [TSYS\_ShortcutKeys](../types/TSYS_ShortcutKeys.md) | 快捷键，不区分传入的排列顺序，将自动排序并查询匹配的快捷键 |



## 返回值

Promise&lt;boolean&gt;

反注册操作是否成功
