# PCB DRC 检查：设计规则检查、网络类、差分对、等长网络组、焊盘对组

> **适用摘要**: 对当前 PCB 执行 DRC（Design Rule Check）设计规则检查，管理网络类、差分对、等长网络组、焊盘对组，以及获取/修改/保存设计规则配置。

## 触发意图

- "运行 PCB DRC 检查"
- "获取 DRC 错误列表"
- "创建/管理网络类"
- "创建/管理差分对"
- "创建等长网络组"
- "管理焊盘对组"
- "获取/修改设计规则配置"
- "获取网络规则"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 当前打开 PCB 文档（documentType === 3） |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前文档为 PCB
  → DRC 检查:
    → pcb_Drc.check(strict, userInterface, includeVerboseError) — 执行 DRC
  → 网络类管理:
    → pcb_Drc.getAllNetClasses() / createNetClass() / deleteNetClass()
    → pcb_Drc.addNetToNetClass() / removeNetFromNetClass()
  → 差分对管理:
    → pcb_Drc.getAllDifferentialPairs() / createDifferentialPair() / deleteDifferentialPair()
  → 等长网络组管理:
    → pcb_Drc.getAllEqualLengthNetGroups() / createEqualLengthNetGroup() / deleteEqualLengthNetGroup()
  → 焊盘对组管理:
    → pcb_Drc.getAllPadPairGroups() / createPadPairGroup() / deletePadPairGroup()
  → 规则配置:
    → pcb_Drc.getCurrentRuleConfiguration() / saveRuleConfiguration() / overwriteCurrentRuleConfiguration()
  → 规则查询:
    → pcb_Drc.getNetRules() / getNetByNetRules() / getRegionRules()
```

## 分步说明

### Step 1: 执行 DRC 检查（BETA）

**API**: `eda.pcb_Drc.check(strict, userInterface, includeVerboseError)`

**参考**: `../resources/references/classes/PCB_Drc.md`

**参数说明**:

| 参数 | 类型 | 说明 |
|---|---|---|
| `strict` | boolean | 是否严格检查（当前 PCB 统一为严格检查模式） |
| `userInterface` | boolean | 是否显示 UI（呼出底部 DRC 窗口） |
| `includeVerboseError` | boolean | 是否返回详细错误信息 |

**返回类型**:
- `includeVerboseError = false` → `Promise<boolean>` — DRC 是否通过
- `includeVerboseError = true` → `Promise<Array<any>>` — 详细错误信息数组

### Step 2: 网络类管理（BETA）

**获取所有**: `eda.pcb_Drc.getAllNetClasses()` → `Promise<Array<IPCB_NetClassItem>>`

**参考接口**: `../resources/references/interfaces/IPCB_NetClassItem.md`

**创建**: `eda.pcb_Drc.createNetClass(netClassName, nets, color)`

**删除**: `eda.pcb_Drc.deleteNetClass(netClassName)`

**添加网络**: `eda.pcb_Drc.addNetToNetClass(netClassName, net)`

**移除网络**: `eda.pcb_Drc.removeNetFromNetClass(netClassName, net)`

**改名**: `eda.pcb_Drc.modifyNetClassName(originalName, newName)`

### Step 3: 差分对管理（BETA）

**获取所有**: `eda.pcb_Drc.getAllDifferentialPairs()` → `Promise<Array<IPCB_DifferentialPairItem> | {...}>`

**参考接口**: `../resources/references/interfaces/IPCB_DifferentialPairItem.md`

**创建**: `eda.pcb_Drc.createDifferentialPair(name, positiveNet, negativeNet)`

**删除**: `eda.pcb_Drc.deleteDifferentialPair(name)`

**修改正/负网络**: `modifyDifferentialPairPositiveNet(name, net)` / `modifyDifferentialPairNegativeNet(name, net)`

### Step 4: 等长网络组管理（BETA）

**获取所有**: `eda.pcb_Drc.getAllEqualLengthNetGroups()` → `Promise<Array<IPCB_EqualLengthNetGroupItem>>`

**参考接口**: `../resources/references/interfaces/IPCB_EqualLengthNetGroupItem.md`

**创建**: `eda.pcb_Drc.createEqualLengthNetGroup(name, nets, color)`

**删除**: `eda.pcb_Drc.deleteEqualLengthNetGroup(name)`

**添加/移除网络**: `addNetToEqualLengthNetGroup(name, net)` / `removeNetFromEqualLengthNetGroup(name, net)`

### Step 5: 焊盘对组管理（BETA）

**获取所有**: `eda.pcb_Drc.getAllPadPairGroups()` → `Promise<Array<IPCB_PadPairGroupItem>>`

**参考接口**: `../resources/references/interfaces/IPCB_PadPairGroupItem.md`

**创建**: `eda.pcb_Drc.createPadPairGroup(name, padPairs)`

**焊盘对格式**: `[string, string]` — 三种用法:
- 游离焊盘-游离焊盘: `['e0', 'e1']`
- 器件焊盘-器件焊盘: `['R1:1', 'R1:2']`
- 器件焊盘-游离焊盘: `['R1:1', 'e1']`

**获取最短导线长度**: `eda.pcb_Drc.getPadPairGroupMinWireLength(name)`

### Step 6: 规则配置管理（BETA）

**获取当前配置**: `eda.pcb_Drc.getCurrentRuleConfiguration()` → `Promise<{...} | undefined>`

**获取配置名称**: `eda.pcb_Drc.getCurrentRuleConfigurationName()` → `Promise<string | undefined>`

**获取所有配置**: `eda.pcb_Drc.getAllRuleConfigurations(includeSystem?)`

**保存配置**: `eda.pcb_Drc.saveRuleConfiguration(config, name, allowOverwrite)`

**覆写当前配置**: `eda.pcb_Drc.overwriteCurrentRuleConfiguration(config)` — ⚠️ 注意数据丢失风险

### Step 7: 规则查询（BETA）

**网络规则**: `eda.pcb_Drc.getNetRules()` / `overwriteNetRules(rules)`

**网络-网络规则**: `eda.pcb_Drc.getNetByNetRules()` / `overwriteNetByNetRules(rules)`

**区域规则**: `eda.pcb_Drc.getRegionRules()` / `overwriteRegionRules(rules)`

> ⚠️ `overwrite*` 方法会覆写所有规则，注意数据丢失风险。

## 代码示例

```typescript
const PLUGIN_TAG = '[PcbDrc]';

export async function runPcbDrcCheck() {
  try {
    const docInfo = await eda.dmt_SelectControl.getCurrentDocumentInfo();
    if (!docInfo || docInfo.documentType !== 3) {
      console.warn(PLUGIN_TAG, 'Not a PCB document');
      return;
    }

    // 方式 1: 静默检查，仅获取通过/失败
    const passed = await eda.pcb_Drc.check(true, false, false);
    if (passed) {
      console.warn(PLUGIN_TAG, 'DRC check passed');
      await eda.sys_Dialog.showInformationMessage('DRC check passed!');
    } else {
      console.warn(PLUGIN_TAG, 'DRC check failed');
    }

    // 方式 2: 获取详细错误信息
    const errors = await eda.pcb_Drc.check(true, false, true);
    if (errors.length === 0) {
      console.warn(PLUGIN_TAG, 'No DRC errors');
    } else {
      console.warn(PLUGIN_TAG, `Found ${errors.length} DRC errors`);
      for (const error of errors) {
        console.warn(PLUGIN_TAG, 'DRC error:', error);
      }
    }

    // 创建网络类
    const created = await eda.pcb_Drc.createNetClass(
      'PowerNets',
      ['VCC', 'GND'],
      '#FF0000'
    );
    if (created) {
      console.warn(PLUGIN_TAG, 'Net class created');
    }

    // 创建差分对
    await eda.pcb_Drc.createDifferentialPair(
      'USB_DP_DN',
      'USB_DP',
      'USB_DN'
    );

    // 获取当前规则配置名称
    const configName = await eda.pcb_Drc.getCurrentRuleConfigurationName();
    console.warn(PLUGIN_TAG, 'Current rule config:', configName);
  } catch (err) {
    console.error(PLUGIN_TAG, 'PCB DRC operation failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| DRC 结果不符合预期 | `strict` 参数设置不当 | 当前 PCB 统一为严格检查，传 `true` |
| 返回值类型混淆 | `includeVerboseError` 为 `true` 时返回数组 | 根据第三个参数判断返回值类型 |
| 在 SCH 中调用 `pcb_Drc` | 文档类型不匹配 | SCH DRC 使用 `sch_Drc` |
| `overwriteCurrentRuleConfiguration` 数据丢失 | 覆写操作会替换所有规则 | 先 `getCurrentRuleConfiguration()` 备份再修改 |
| 焊盘对格式错误 | 器件焊盘格式不对 | 器件焊盘用 `R1:1` 格式（位号:引脚编号），游离焊盘用 `e0` |
| `getAllDifferentialPairs` 返回值变化 | EDA v3.4 BREAKING CHANGE | v3.4 起返回值类型更改为对象 |

## 变体

- **带 UI 的 DRC 检查**: 设置 `userInterface = true` 呼出底部 DRC 窗口
- **SCH DRC 检查**: 使用 `eda.sch_Drc` 类，参考 `recipes/sch_drc_check.md`
- **DRC 后自动修复**: 结合详细错误信息，针对性修改图元属性
- **导出规则配置**: 获取配置后保存为 JSON 文件备份
