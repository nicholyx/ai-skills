# LIB\_Symbol class

综合库 / 符号类

## 签名

```typescript
declare class LIB_Symbol
```

## 方法

| 方法名                                                                                                      | 修饰符 | 描述                     |
| -------------------------------------------------------------------------------------------------------- | --- | ---------------------- |
| [copy(symbolUuid, libraryUuid, targetLibraryUuid, targetClassification, newSymbolName)](./LIB_Symbol.md) |     | **_(BETA)_** 复制符号      |
| [create(libraryUuid, symbolName, classification, symbolType, description)](./LIB_Symbol.md)              |     | **_(BETA)_** 创建符号      |
| [delete(symbolUuid, libraryUuid)](./LIB_Symbol.md)                                                       |     | **_(BETA)_** 删除符号      |
| [get(symbolUuid, libraryUuid)](./LIB_Symbol.md)                                                          |     | **_(BETA)_** 获取符号的所有属性 |
| [modify(symbolUuid, libraryUuid, symbolName, classification, description)](./LIB_Symbol.md)              |     | **_(BETA)_** 修改符号      |
| [openInEditor(symbolUuid, libraryUuid, splitScreenId)](./LIB_Symbol.md)                                  |     | **_(BETA)_** 在编辑器打开文档  |
| [search(key, libraryUuid, classification, symbolType, itemsOfPage, page)](./LIB_Symbol.md)               |     | **_(BETA)_** 搜索符号      |
| [updateDocumentSource(symbolUuid, libraryUuid, documentSource)](./LIB_Symbol.md)                         |     | **_(BETA)_** 更新符号的文档源码 |

---

## 方法详情

### copy

# LIB\_Symbol.copy() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

复制符号

## 签名

```typescript
copy(symbolUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex | Array<string>, newSymbolName?: string): Promise<string | undefined>;
```

## 参数名

| 参数                   | 类型                                                                                            | 描述                                                              |
| -------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| symbolUuid           | string                                                                                        | 符号 UUID                                                         |
| libraryUuid          | string                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| targetLibraryUuid    | string                                                                                        | 目标库 UUID                                                        |
| targetClassification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 目标库内的分类                                                  |
| newSymbolName        | string                                                                                        | _（可选）_ 新符号名称，如若目标库内存在重名符号将导致复制失败                                |



## 返回值

Promise&lt;string \| undefined&gt;

目标库内新符号的 UUID

### create

# LIB\_Symbol.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建符号

## 签名

```typescript
create(libraryUuid: string, symbolName: string, classification?: ILIB_ClassificationIndex | Array<string>, symbolType?: ELIB_SymbolType, description?: string): Promise<string | undefined>;
```

## 参数名

| 参数             | 类型                                                                                            | 描述                                                              |
| -------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| libraryUuid    | string                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| symbolName     | string                                                                                        | 符号名称                                                            |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类                                                       |
| symbolType     | [ELIB\_SymbolType](../enums/ELIB_SymbolType.md)                                               | _（可选）_ 符号类型                                                     |
| description    | string                                                                                        | _（可选）_ 描述                                                       |



## 返回值

Promise&lt;string \| undefined&gt;

符号 UUID

### delete

# LIB\_Symbol.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除符号

## 签名

```typescript
delete(symbolUuid: string, libraryUuid: string): Promise<boolean>;
```

## 参数名

| 参数          | 类型     | 描述                                                              |
| ----------- | ------ | --------------------------------------------------------------- |
| symbolUuid  | string | 符号 UUID                                                         |
| libraryUuid | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### get

# LIB\_Symbol.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取符号的所有属性

## 签名

```typescript
get(symbolUuid: string, libraryUuid?: string): Promise<ILIB_SymbolItem | undefined>;
```

## 参数名

| 参数          | 类型     | 描述                                                                     |
| ----------- | ------ | ---------------------------------------------------------------------- |
| symbolUuid  | string | 符号 UUID                                                                |
| libraryUuid | string | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;[ILIB\_SymbolItem](../interfaces/ILIB_SymbolItem.md) \| undefined&gt;

符号属性

### modify

# LIB\_Symbol.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改符号

## 签名

```typescript
modify(symbolUuid: string, libraryUuid: string, symbolName?: string, classification?: ILIB_ClassificationIndex | Array<string> | null, description?: string | null): Promise<boolean>;
```

## 参数名

| 参数             | 类型                                                                                                    | 描述                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| symbolUuid     | string                                                                                                | 符号 UUID                                                         |
| libraryUuid    | string                                                                                                | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| symbolName     | string                                                                                                | _（可选）_ 符号名称                                                     |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; \| null | _（可选）_ 分类                                                       |
| description    | string \| null                                                                                        | _（可选）_ 描述                                                       |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

如希望清除某些属性，则将其的值设置为 `null`

### openineditor

# LIB\_Symbol.openInEditor() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

在编辑器打开文档

## 签名

```typescript
openInEditor(symbolUuid: string, libraryUuid: string, splitScreenId?: string): Promise<string | undefined>;
```

## 参数名

| 参数            | 类型     | 描述                                                                                        |
| ------------- | ------ | ----------------------------------------------------------------------------------------- |
| symbolUuid    | string | 符号 UUID                                                                                   |
| libraryUuid   | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取                           |
| splitScreenId | string | _（可选）_ 分屏 ID，不填写则默认在最后输入焦点的分屏内打开，可以使用 [DMT\_EditorControl](./DMT_EditorControl.md) 内的接口获取 |



## 返回值

Promise&lt;string \| undefined&gt;

标签页 ID，对应 [IDMT\_EditorTabItem.tabId](../interfaces/IDMT_EditorTabItem.md)，可使用 [DMT\_EditorControl.getSplitScreenIdByTabId()](./DMT_EditorControl.md) 获取到分屏 ID

### search

# LIB\_Symbol.search() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

搜索符号

## 签名

```typescript
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex | Array<string>, symbolType?: ELIB_SymbolType, itemsOfPage?: number, page?: number): Promise<Array<ILIB_SymbolSearchItem>>;
```

## 参数名

| 参数             | 类型                                                                                            | 描述                                                                            |
| -------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| key            | string                                                                                        | 搜索关键字                                                                         |
| libraryUuid    | string                                                                                        | _（可选）_ 库 UUID，默认为系统库，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类，默认为全部                                                               |
| symbolType     | [ELIB\_SymbolType](../enums/ELIB_SymbolType.md)                                               | _（可选）_ 符号类型，默认为全部                                                             |
| itemsOfPage    | number                                                                                        | _（可选）_ 一页搜索结果的数量                                                              |
| page           | number                                                                                        | _（可选）_ 页数                                                                     |



## 返回值

Promise&lt;Array&lt;[ILIB\_SymbolSearchItem](../interfaces/ILIB_SymbolSearchItem.md)&gt;&gt;

搜索到的符号属性列表

### updatedocumentsource

# LIB\_Symbol.updateDocumentSource() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

更新符号的文档源码

## 签名

```typescript
updateDocumentSource(symbolUuid: string, libraryUuid: string, documentSource: string): Promise<boolean | undefined>;
```

## 参数名

| 参数             | 类型     | 描述                                                              |
| -------------- | ------ | --------------------------------------------------------------- |
| symbolUuid     | string | 符号 UUID                                                         |
| libraryUuid    | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| documentSource | string | 文档源码                                                            |



## 返回值

Promise&lt;boolean \| undefined&gt;

是否更新成功
