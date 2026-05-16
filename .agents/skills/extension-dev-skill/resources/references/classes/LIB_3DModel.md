# LIB\_3DModel class

综合库 / 3D 模型类

## 签名

```typescript
declare class LIB_3DModel
```

## 方法

| 方法名                                                                                                     | 修饰符 | 描述                         |
| ------------------------------------------------------------------------------------------------------- | --- | -------------------------- |
| [copy(modelUuid, libraryUuid, targetLibraryUuid, targetClassification, newModelName)](./LIB_3DModel.md) |     | **_(BETA)_** 复制 3D 模型      |
| [create(libraryUuid, modelFile, classification, unit)](./LIB_3DModel.md)                                |     | **_(BETA)_** 创建 3D 模型      |
| [delete(modelUuid, libraryUuid)](./LIB_3DModel.md)                                                      |     | **_(BETA)_** 删除 3D 模型      |
| [get(modelUuid, libraryUuid)](./LIB_3DModel.md)                                                         |     | **_(BETA)_** 获取 3D 模型的所有属性 |
| [modify(modelUuid, libraryUuid, modelName, classification, description)](./LIB_3DModel.md)              |     | **_(BETA)_** 修改 3D 模型      |
| [search(key, libraryUuid, classification, itemsOfPage, page)](./LIB_3DModel.md)                         |     | **_(BETA)_** 搜索 3D 模型      |

---

## 方法详情

### copy

# LIB\_3DModel.copy() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

复制 3D 模型

## 签名

```typescript
copy(modelUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex | Array<string>, newModelName?: string): Promise<string | undefined>;
```

## 参数名

| 参数                   | 类型                                                                                            | 描述                                                              |
| -------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| modelUuid            | string                                                                                        | 3D 模型 UUID                                                      |
| libraryUuid          | string                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| targetLibraryUuid    | string                                                                                        | 目标库 UUID                                                        |
| targetClassification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 目标库内的分类                                                  |
| newModelName         | string                                                                                        | _（可选）_ 新 3D 模型名称，如若目标库内存在重名 3D 模型将导致复制失败                        |



## 返回值

Promise&lt;string \| undefined&gt;

目标库内新 3D 模型的 UUID

### create

# LIB\_3DModel.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建 3D 模型

## 签名

```typescript
create(libraryUuid: string, modelFile: Blob, classification?: ILIB_ClassificationIndex | Array<string>, unit?: ESYS_Unit.MILLIMETER | ESYS_Unit.CENTIMETER | ESYS_Unit.METER | ESYS_Unit.MIL | ESYS_Unit.INCH): Promise<string[] | undefined>;
```

## 参数名

| 参数             | 类型                                                                                                                                                                                                                                   | 描述                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| libraryUuid    | string                                                                                                                                                                                                                               | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| modelFile      | Blob                                                                                                                                                                                                                                 | 3D 模型文件数据                                                       |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt;                                                                                                                                        | _（可选）_ 分类                                                       |
| unit           | [ESYS\_Unit.MILLIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.CENTIMETER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.METER](../enums/ESYS_Unit.md) \| [ESYS\_Unit.MIL](../enums/ESYS_Unit.md) \| [ESYS\_Unit.INCH](../enums/ESYS_Unit.md) | _(Optional)_                                                    |



## 返回值

Promise&lt;string\[\] \| undefined&gt;

3D 模型 UUID

### delete

# LIB\_3DModel.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除 3D 模型

## 签名

```typescript
delete(modelUuid: string, libraryUuid: string): Promise<boolean>;
```

## 参数名

| 参数          | 类型     | 描述                                                              |
| ----------- | ------ | --------------------------------------------------------------- |
| modelUuid   | string | 3D 模型 UUID                                                      |
| libraryUuid | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### get

# LIB\_3DModel.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取 3D 模型的所有属性

## 签名

```typescript
get(modelUuid: string, libraryUuid?: string): Promise<ILIB_3DModelItem | undefined>;
```

## 参数名

| 参数          | 类型     | 描述                                                                     |
| ----------- | ------ | ---------------------------------------------------------------------- |
| modelUuid   | string | 3D 模型 UUID                                                             |
| libraryUuid | string | _（可选）_ 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;[ILIB\_3DModelItem](../interfaces/ILIB_3DModelItem.md) \| undefined&gt;

3D 模型属性

### modify

# LIB\_3DModel.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改 3D 模型

## 签名

```typescript
modify(modelUuid: string, libraryUuid: string, modelName?: string, classification?: ILIB_ClassificationIndex | Array<string> | null, description?: string | null): Promise<boolean>;
```

## 参数名

| 参数             | 类型                                                                                                    | 描述                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| modelUuid      | string                                                                                                | 3D 模型 UUID                                                      |
| libraryUuid    | string                                                                                                | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| modelName      | string                                                                                                | _（可选）_ 3D 模型名称                                                  |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; \| null | _（可选）_ 分类                                                       |
| description    | string \| null                                                                                        | _（可选）_ 描述                                                       |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

如希望清除某些属性，则将其的值设置为 `null`

### search

# LIB\_3DModel.search() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

搜索 3D 模型

## 签名

```typescript
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex | Array<string>, itemsOfPage?: number, page?: number): Promise<Array<ILIB_3DModelSearchItem>>;
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

Promise&lt;Array&lt;[ILIB\_3DModelSearchItem](../interfaces/ILIB_3DModelSearchItem.md)&gt;&gt;

搜索到的 3D 模型属性列表
