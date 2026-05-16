# LIB\_Device class

综合库 / 器件类

## 签名

```typescript
declare class LIB_Device
```

## 方法

| 方法名                                                                                                                | 修饰符 | 描述                           |
| ------------------------------------------------------------------------------------------------------------------ | --- | ---------------------------- |
| [copy(deviceUuid, libraryUuid, targetLibraryUuid, targetClassification, newDeviceName)](./LIB_Device.md)           |     | **_(BETA)_** 复制器件            |
| [create(libraryUuid, deviceName, classification, association, description, property)](./LIB_Device.md)             |     | **_(BETA)_** 创建器件            |
| [delete(deviceUuid, libraryUuid)](./LIB_Device.md)                                                                 |     | **_(BETA)_** 删除器件            |
| [get(deviceUuid, libraryUuid)](./LIB_Device.md)                                                                    |     | **_(BETA)_** 获取器件的所有属性       |
| [getByLcscIds(lcscIds, libraryUuid, allowMultiMatch)](./LIB_Device.md)                                             |     | **_(BETA)_** 使用立创 C 编号获取器件   |
| [getByLcscIds(lcscIds, libraryUuid, allowMultiMatch)](./LIB_Device.md)                                             |     | **_(BETA)_** 使用立创 C 编号批量获取器件 |
| [modify(deviceUuid, libraryUuid, deviceName, classification, association, description, property)](./LIB_Device.md) |     | **_(BETA)_** 修改器件            |
| [search(key, libraryUuid, classification, symbolType, itemsOfPage, page)](./LIB_Device.md)                         |     | **_(BETA)_** 搜索器件            |

---

## 方法详情

### copy

# LIB\_Device.copy() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

复制器件

## 签名

```typescript
copy(deviceUuid: string, libraryUuid: string, targetLibraryUuid: string, targetClassification?: ILIB_ClassificationIndex | Array<string>, newDeviceName?: string): Promise<string | undefined>;
```

## 参数名

| 参数                   | 类型                                                                                            | 描述                                                              |
| -------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| deviceUuid           | string                                                                                        | 器件 UUID                                                         |
| libraryUuid          | string                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| targetLibraryUuid    | string                                                                                        | 目标库 UUID                                                        |
| targetClassification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; | _（可选）_ 目标库内的分类                                                  |
| newDeviceName        | string                                                                                        | _（可选）_ 新器件名称，如若目标库内存在重名器件将导致复制失败                                |



## 返回值

Promise&lt;string \| undefined&gt;

目标库内新器件的 UUID

### create

# LIB\_Device.create() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

创建器件

## 签名

```typescript
create(libraryUuid: string, deviceName: string, classification?: ILIB_ClassificationIndex | Array<string>, association?: {
        symbolType?: ELIB_SymbolType;
        symbolUuid?: string;
        symbol?: {
            uuid: string;
            libraryUuid: string;
        };
        footprintUuid?: string;
        footprint?: {
            uuid: string;
            libraryUuid: string;
        };
        model3D?: {
            uuid: string;
            libraryUuid: string;
        };
        imageData?: File | Blob;
    }, description?: string, property?: ILIB_DeviceExtendPropertyItem): Promise<string | undefined>;
```

## 参数名

| 参数             | 类型                                                                                                                                                                                                                                                                                              | 描述                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| libraryUuid    | string                                                                                                                                                                                                                                                                                          | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取                                  |
| deviceName     | string                                                                                                                                                                                                                                                                                          | 器件名称                                                                                             |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt;                                                                                                                                                                                                   | _（可选）_ 分类                                                                                        |
| association    | { symbolType?: [ELIB\_SymbolType](../enums/ELIB_SymbolType.md); symbolUuid?: string; symbol?: { uuid: string; libraryUuid: string; }; footprintUuid?: string; footprint?: { uuid: string; libraryUuid: string; }; model3D?: { uuid: string; libraryUuid: string; }; imageData?: File \| Blob; } | _（可选）_ 关联符号、封装、图像，指定 `symbolType` 则创建新符号，无需新建符号则无需指定 `symbolType`，但请注意，如若不新建符号也不指定符号的关联信息将无法创建器件 |
| description    | string                                                                                                                                                                                                                                                                                          | _（可选）_ 描述                                                                                        |
| property       | [ILIB\_DeviceExtendPropertyItem](../interfaces/ILIB_DeviceExtendPropertyItem.md)                                                                                                                                                                                                                | _（可选）_ 其它参数，仅 `designator`、`addIntoBom`、`addIntoPcb` 存在默认值                                       |



## 返回值

Promise&lt;string \| undefined&gt;

器件 UUID

### delete

# LIB\_Device.delete() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

删除器件

## 签名

```typescript
delete(deviceUuid: string, libraryUuid: string): Promise<boolean>;
```

## 参数名

| 参数          | 类型     | 描述                                                              |
| ----------- | ------ | --------------------------------------------------------------- |
| deviceUuid  | string | 器件 UUID                                                         |
| libraryUuid | string | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

### get

# LIB\_Device.get() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

获取器件的所有属性

## 签名

```typescript
get(deviceUuid: string, libraryUuid?: string): Promise<ILIB_DeviceItem | undefined>;
```

## 参数名

| 参数          | 类型     | 描述                                                                            |
| ----------- | ------ | ----------------------------------------------------------------------------- |
| deviceUuid  | string | 器件 UUID                                                                       |
| libraryUuid | string | _（可选）_ 库 UUID，默认为系统库，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |



## 返回值

Promise&lt;[ILIB\_DeviceItem](../interfaces/ILIB_DeviceItem.md) \| undefined&gt;

器件属性

### getbylcscids

# LIB\_Device.getByLcscIds() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用立创 C 编号获取器件

## 签名

```typescript
getByLcscIds<T extends boolean>(lcscIds: string, libraryUuid?: string, allowMultiMatch?: T): Promise<T extends true ? ILIB_DeviceSearchItem | undefined : Array<ILIB_DeviceSearchItem>>;
```

## 参数名

| 参数              | 类型     | 描述                                                                            |
| --------------- | ------ | ----------------------------------------------------------------------------- |
| lcscIds         | string | 立创 C 编号                                                                       |
| libraryUuid     | string | _（可选）_ 库 UUID，默认为系统库，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| allowMultiMatch | T      | _（可选）_ 是否允许单个立创 C 编号匹配多个结果                                                    |



## 返回值

Promise&lt;T extends true ? [ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md) \| undefined : Array&lt;[ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md)&gt;&gt;

搜索到的器件属性

## 备注

默认情况下，如果在同一个库内匹配到多个相同 C 编号的器件，将只会返回第一个结果；

如果希望返回多个结果，请将 `allowMultiMatch` 置为 `true`；

私有化部署环境暂无法使用本接口

### getbylcscids_1

# LIB\_Device.getByLcscIds() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

使用立创 C 编号批量获取器件

## 签名

```typescript
getByLcscIds(lcscIds: Array<string>, libraryUuid?: string, allowMultiMatch?: boolean): Promise<Array<ILIB_DeviceSearchItem>>;
```

## 参数名

| 参数              | 类型                  | 描述                                                                            |
| --------------- | ------------------- | ----------------------------------------------------------------------------- |
| lcscIds         | Array&lt;string&gt; | 立创 C 编号数组                                                                     |
| libraryUuid     | string              | _（可选）_ 库 UUID，默认为系统库，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| allowMultiMatch | boolean             | _（可选）_ 是否允许单个立创 C 编号匹配多个结果                                                    |



## 返回值

Promise&lt;Array&lt;[ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md)&gt;&gt;

搜索到的器件属性的列表

## 备注

默认情况下，如果在同一个库内匹配到多个相同 C 编号的器件，将只会返回第一个结果；

如果希望返回多个结果，请将 `allowMultiMatch` 置为 `true`；

私有化部署环境暂无法使用本接口

### modify

# LIB\_Device.modify() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

修改器件

## 签名

```typescript
modify(deviceUuid: string, libraryUuid: string, deviceName?: string, classification?: ILIB_ClassificationIndex | Array<string> | null, association?: {
        symbolUuid?: string;
        symbol?: {
            uuid: string;
            libraryUuid: string;
        };
        footprintUuid?: string | null;
        footprint?: {
            uuid: string;
            libraryUuid: string;
        } | null;
        model3D?: {
            uuid: string;
            libraryUuid: string;
        } | null;
        imageData?: File | Blob | null;
    }, description?: string | null, property?: {
        name?: string | null;
        designator?: string;
        addIntoBom?: boolean;
        addIntoPcb?: boolean;
        net?: string;
        manufacturer?: string | null;
        manufacturerId?: string | null;
        supplier?: string | null;
        supplierId?: string | null;
        otherProperty?: {
            [key: string]: boolean | number | string | undefined | null;
        };
    }): Promise<boolean>;
```

## 参数名

| 参数             | 类型                                                                                                                                                                                                                                                                                                                            | 描述                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| deviceUuid     | string                                                                                                                                                                                                                                                                                                                        | 器件 UUID                                                         |
| libraryUuid    | string                                                                                                                                                                                                                                                                                                                        | 库 UUID，可以使用 [LIB\_LibrariesList](./LIB_LibrariesList.md) 内的接口获取 |
| deviceName     | string                                                                                                                                                                                                                                                                                                                        | _（可选）_ 器件名称                                                     |
| classification | [ILIB\_ClassificationIndex](../interfaces/ILIB_ClassificationIndex.md) \| Array&lt;string&gt; \| null                                                                                                                                                                                                                         | _（可选）_ 分类                                                       |
| association    | \{ symbolUuid?: string; symbol?: \{ uuid: string; libraryUuid: string; \}; footprintUuid?: string \| null; footprint?: \{ uuid: string; libraryUuid: string; \} \| null; model3D?: \{ uuid: string; libraryUuid: string; \} \| null; imageData?: File \| Blob \| null; \}                                                     | _（可选）_ 关联符号、封装、图像                                               |
| description    | string \| null                                                                                                                                                                                                                                                                                                                | _（可选）_ 描述                                                       |
| property       | \{ name?: string \| null; designator?: string; addIntoBom?: boolean; addIntoPcb?: boolean; net?: string; manufacturer?: string \| null; manufacturerId?: string \| null; supplier?: string \| null; supplierId?: string \| null; otherProperty?: \{ \[key: string\]: boolean \| number \| string \| undefined \| null; \}; \} | _（可选）_ 其它参数                                                     |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

如希望清除某些属性，则将其的值设置为 `null`

### search

# LIB\_Device.search() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

搜索器件

## 签名

```typescript
search(key: string, libraryUuid?: string, classification?: ILIB_ClassificationIndex | Array<string>, symbolType?: ELIB_SymbolType, itemsOfPage?: number, page?: number): Promise<Array<ILIB_DeviceSearchItem>>;
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

Promise&lt;Array&lt;[ILIB\_DeviceSearchItem](../interfaces/ILIB_DeviceSearchItem.md)&gt;&gt;

搜索到的器件属性的列表
