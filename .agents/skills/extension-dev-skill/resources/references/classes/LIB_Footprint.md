# LIB\_Footprint class

综合库 / 封装类

## 签名

```typescript
declare class LIB_Footprint
```

## 方法

| 方法名                                                                                                               | 修饰符 | 描述                     |
| ----------------------------------------------------------------------------------------------------------------- | --- | ---------------------- |
| [copy(footprintUuid, libraryUuid, targetLibraryUuid, targetClassification, newFootprintName)](./LIB_Footprint.md) |     | **_(BETA)_** 复制封装      |
| [create(libraryUuid, footprintName, classification, description)](./LIB_Footprint.md)                             |     | **_(BETA)_** 创建封装      |
| [delete(footprintUuid, libraryUuid)](./LIB_Footprint.md)                                                          |     | **_(BETA)_** 删除封装      |
| [get(footprintUuid, libraryUuid)](./LIB_Footprint.md)                                                             |     | **_(BETA)_** 获取封装的所有属性 |
| [modify(footprintUuid, libraryUuid, footprintName, classification, description)](./LIB_Footprint.md)              |     | **_(BETA)_** 修改封装      |
| [openInEditor(footprintUuid, libraryUuid, splitScreenId)](./LIB_Footprint.md)                                     |     | **_(BETA)_** 在编辑器打开文档  |
| [search(key, libraryUuid, classification, itemsOfPage, page)](./LIB_Footprint.md)                                 |     | **_(BETA)_** 搜索封装      |
| [updateDocumentSource(footprintUuid, libraryUuid, documentSource)](./LIB_Footprint.md)                            |     | **_(BETA)_** 更新封装的文档源码 |

---

## 方法详情

### copy

# LIB\_Footprint.copy() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

复制封装

## 签名

```typescript
copy(footprintUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex | Array<string>, newFootprintName?: string): Promise<string | undefined>;
```

## 参数名

| 参数                   | 类型                                                                                            | 描述                                                              |
| -------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| footprintUuid        | string                                                                                        | 封装 UUID                                                         |
| libraryUuid          | string                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| targetLibraryUuid    | string                                                                                        | 目标库 UUID                                                        |
| targetClassification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 目标库内的分类                                                  |
| newFootprintName     | string                                                                                        | _（可选）_ 新封装名称，如若目标库内存在重名封装将导致复制失败                                |



## 返回值

Promise&lt;string \| undefined&gt;

目标库内新封装的 UUID

### create

# LIB\_Footprint.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建封装

## 签名

```typescript
create(libraryUuid: string, footprintName: string, classification?: ILIB_ClassificationIndex | Array<string>, description?: string): Promise<string | undefined>;
```

## 参数名

| 参数             | 类型                                                                                            | 描述                                                              |
| -------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| libraryUuid    | string                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| footprintName  | string                                                                                        | 封装名称                                                            |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类                                                       |
| description    | string                                                                                        | _（可选）_ 描述                                                       |



## 返回值

Promise&lt;string \| undefined&gt;

封装 UUID

### delete

# LIB\_Footprint.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除封装

## 签名

```typescript
delete(footprintUuid: string, libraryUuid: string): Promise<boolean>;
```

## 参数名

| 参数            | 类型     | 描述                                                              |
| ------------- | ------ | --------------------------------------------------------------- |
| footprintUuid | string | 封装 UUID                                                         |
| libraryUuid   | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### get

# LIB\_Footprint.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取封装的所有属性

## 签名

```typescript
get(footprintUuid: string, libraryUuid?: string): Promise<ILIB_FootprintItem | undefined>;
```

## 参数名

| 参数            | 类型     | 描述                                                                     |
| ------------- | ------ | ---------------------------------------------------------------------- |
| footprintUuid | string | 封装 UUID                                                                |
| libraryUuid   | string | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;[ILIB\_FootprintItem](../interfaces/ILIB_FootprintItem.md) \| undefined&gt;

封装属性

### modify

# LIB\_Footprint.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改封装

## 签名

```typescript
modify(footprintUuid: string, libraryUuid: string, footprintName?: string, classification?: ILIB_ClassificationIndex | Array<string> | null, description?: string | null): Promise<boolean>;
```

## 参数名

| 参数             | 类型                                                                                                    | 描述                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| footprintUuid  | string                                                                                                | 封装 UUID                                                         |
| libraryUuid    | string                                                                                                | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| footprintName  | string                                                                                                | _（可选）_ 封装名称                                                     |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; \| null | _（可选）_ 分类                                                       |
| description    | string \| null                                                                                        | _（可选）_ 描述                                                       |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

如希望清除某些属性，则将其的值设置为 `null`

### openineditor

# LIB\_Footprint.openInEditor() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

在编辑器打开文档

## 签名

```typescript
openInEditor(footprintUuid: string, libraryUuid: string, splitScreenId?: string): Promise<string | undefined>;
```

## 参数名

| 参数            | 类型     | 描述                                                                                        |
| ------------- | ------ | ----------------------------------------------------------------------------------------- |
| footprintUuid | string | 封装 UUID                                                                                   |
| libraryUuid   | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取                           |
| splitScreenId | string | _（可选）_ 分屏 ID，不填写则默认在最后输入焦点的分屏内打开，可以使用 [DMT\_EditorControl](./DMT_EditorControl.md) 内的接口获取 |



## 返回值

Promise&lt;string \| undefined&gt;

标签页 ID，对应 [IDMT\_EditorTabItem.tabId](../interfaces/IDMT_EditorTabItem.md)，可使用 [DMT\_EditorControl.getSplitScreenIdByTabId()](./DMT_EditorControl.md) 获取到分屏 ID

### search

# LIB\_Footprint.search() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

搜索封装

## 签名

```typescript
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex | Array<string>, itemsOfPage?: number, page?: number): Promise<Array<ILIB_FootprintSearchItem>>;
```

## 参数名

| 参数             | 类型                                                                                            | 描述                                                                            |
| -------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| key            | string                                                                                        | 搜索关键字                                                                         |
| libraryUuid    | string                                                                                        | _（可选）_ 库 UUID，默认为系统库，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 分类，默认为全部                                                               |
| itemsOfPage    | number                                                                                        | _（可选）_ 一页搜索结果的数量                                                              |
| page           | number                                                                                        | _（可选）_ 页数                                                                     |



## 返回值

Promise&lt;Array&lt;[ILIB\_FootprintSearchItem](../interfaces/ILIB_FootprintSearchItem.md)&gt;&gt;

搜索到的封装属性列表

### updatedocumentsource

# LIB\_Footprint.updateDocumentSource() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

更新封装的文档源码

## 签名

```typescript
updateDocumentSource(footprintUuid: string, libraryUuid: string, documentSource: string): Promise<boolean | undefined>;
```

## 参数名

| 参数             | 类型     | 描述                                                              |
| -------------- | ------ | --------------------------------------------------------------- |
| footprintUuid  | string | 封装 UUID                                                         |
| libraryUuid    | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| documentSource | string | 文档源码                                                            |



## 返回值

Promise&lt;boolean \| undefined&gt;

是否更新成功
