# 库器件搜索与管理：搜索器件、获取器件信息、获取器件关联（符号/封装）

> **适用摘要**: 在综合库中搜索器件、获取器件详细属性、查看器件关联的符号和封装信息。注意画布元件 UUID ≠ 库器件 UUID。

## 触发意图

- "搜索库中的器件"
- "获取器件的符号和封装关联"
- "通过立创 C 编号查找器件"
- "获取器件详细属性"
- "从画布元件找到对应的库器件"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 无特殊要求，库操作不依赖当前文档 |
| 库权限 | 需要有对应库的访问权限 |

## 调用链

```
Step 1: [可选] lib_LibrariesList.getSystemLibraryUuid() — 获取系统库 UUID
Step 2: lib_Device.search(key, libraryUuid) — 搜索器件
Step 3: lib_Device.get(deviceUuid, libraryUuid) — 获取器件详细属性（含关联信息）
  → 从返回值获取 symbolUuid, footprintUuid 等关联信息
```

## 分步说明

### Step 1: 获取库 UUID

**API**: `eda.lib_LibrariesList.getSystemLibraryUuid()`

**参考**: `../resources/references/classes/LIB_LibrariesList.md`

**返回类型**: `Promise<string | undefined>`

> ⚠️ 如果不传 `libraryUuid`，`search()` 默认搜索系统库。

### Step 2: 搜索器件

**API**: `eda.lib_Device.search(key, libraryUuid?, classification?, symbolType?, itemsOfPage?, page?)`

**参考**: `../resources/references/classes/LIB_Device.md`

**返回类型**: `Promise<Array<ILIB_DeviceSearchItem>>`

**参考接口**: `../resources/references/interfaces/ILIB_DeviceSearchItem.md`

> ⚠️ **关键陷阱**: 画布上元件的 UUID（通过 `sch_PrimitiveComponent.getAll()` 获取）是画布实例 UUID，**不是**库器件 UUID。必须通过 `lib_Device.search()` 或 `lib_Device.getByLcscIds()` 获取库器件 UUID。

### Step 3: 获取器件详细属性

**API**: `eda.lib_Device.get(deviceUuid, libraryUuid?)`

**参考**: `../resources/references/classes/LIB_Device.md`

**返回类型**: `Promise<ILIB_DeviceItem | undefined>`

**参考接口**: `../resources/references/interfaces/ILIB_DeviceItem.md`

### 变体: 通过立创 C 编号获取器件

**API**: `eda.lib_Device.getByLcscIds(lcscIds, libraryUuid?, allowMultiMatch?)`

支持单个或批量 C 编号查询。

## 代码示例

```typescript
const PLUGIN_TAG = '[LibDeviceSearch]';

export async function searchDevice() {
  try {
    // 搜索器件
    const devices = await eda.lib_Device.search('STM32F103');
    if (!devices || devices.length === 0) {
      console.warn(PLUGIN_TAG, 'No devices found');
      await eda.sys_Dialog.showInformationMessage('未找到匹配的器件');
      return;
    }

    console.warn(PLUGIN_TAG, `Found ${devices.length} devices`);

    // 获取第一个器件的详细信息（含关联符号/封装）
    const firstDevice = devices[0];
    const deviceInfo = await eda.lib_Device.get(firstDevice.uuid);
    if (!deviceInfo) {
      console.warn(PLUGIN_TAG, 'Failed to get device info');
      return;
    }

    console.warn(PLUGIN_TAG, 'Device info:', deviceInfo.name);
    await eda.sys_Dialog.showInformationMessage(
      `器件: ${deviceInfo.name}\n共找到 ${devices.length} 个结果`
    );
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to search device:', err);
  }
}

export async function getDeviceByLcsc() {
  try {
    // 通过立创 C 编号获取器件
    const device = await eda.lib_Device.getByLcscIds('C8304');
    if (!device) {
      console.warn(PLUGIN_TAG, 'Device not found by LCSC ID');
      return;
    }

    console.warn(PLUGIN_TAG, 'Found device by LCSC ID');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Failed to get device by LCSC ID:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 用画布元件 UUID 调用 `lib_Device.get()` | 画布实例 UUID ≠ 库器件 UUID | 使用 `lib_Device.search()` 获取库 UUID |
| `search()` 返回空数组 | 关键字不匹配或库 UUID 错误 | 检查关键字拼写，确认 libraryUuid 正确 |
| `getByLcscIds()` 报错 | 私有化部署环境不支持 | 仅在线/半离线环境可用 |
| `get()` 返回 `undefined` | 器件 UUID 无效或无权限 | 确认 UUID 来源正确，检查库访问权限 |

## 变体

- **批量获取器件**: 使用 `getByLcscIds(lcscIds: Array<string>)` 传入 C 编号数组
- **按分类搜索**: 传入 `classification` 参数缩小搜索范围
- **创建/修改器件**: 使用 `lib_Device.create()` / `lib_Device.modify()`
- **复制器件到其他库**: 使用 `lib_Device.copy(deviceUuid, libraryUuid, targetLibraryUuid)`
