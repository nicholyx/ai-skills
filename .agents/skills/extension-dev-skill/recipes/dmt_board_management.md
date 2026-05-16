# 板子管理：创建、删除、复制板子及获取板子信息

> **适用摘要**: 在当前工程内管理板子（Board）——创建、删除、复制板子，获取板子信息，修改板子名称。多板设计的基础操作。

## 触发意图

- "创建一个新板子"
- "删除指定板子"
- "复制板子"
- "获取当前板子信息"
- "获取工程内所有板子"
- "修改板子名称"
- 任何涉及多板设计管理的场景

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | 用户已打开一个工程 |
| 权限 | 无特殊权限要求 |

## 调用链

```
确认当前已打开工程
  → Step 1: dmt_Board.getAllBoardsInfo() — 获取所有板子信息
  → Step 2: dmt_Board.getCurrentBoardInfo() — 获取当前板子信息
  → [可选] Step 3: dmt_Board.createBoard() — 创建板子（BETA）
  → [可选] Step 4: dmt_Board.copyBoard() — 复制板子
  → [可选] Step 5: dmt_Board.deleteBoard() — 删除板子
  → [可选] Step 6: dmt_Board.modifyBoardName() — 修改板子名称
```

## 分步说明

### Step 1: 获取所有板子信息

**API**: `eda.dmt_Board.getAllBoardsInfo()`

**参考**: `../resources/references/classes/DMT_Board.md`

**返回类型**: `Promise<Array<IDMT_BoardItem>>`

**参考接口**: `../resources/references/interfaces/IDMT_BoardItem.md`

### Step 2: 获取当前板子信息

**API**: `eda.dmt_Board.getCurrentBoardInfo()`

**参考**: `../resources/references/classes/DMT_Board.md`

**返回类型**: `Promise<IDMT_BoardItem | undefined>`

> 将会获取当前打开且拥有最后输入焦点的原理图、PCB 所关联的板子的详细属性。

### Step 3: 创建板子（BETA）

**API**: `eda.dmt_Board.createBoard(schematicUuid?, pcbUuid?)`

**参数说明**:
- `schematicUuid`（可选）— 关联原理图 UUID
- `pcbUuid`（可选）— 关联 PCB UUID

**返回类型**: `Promise<string | undefined>` — 板子名称，`undefined` 表示创建失败

### Step 4: 复制板子

**API**: `eda.dmt_Board.copyBoard(sourceBoardName)`

**参数说明**:
- `sourceBoardName` — 源板子名称

**返回类型**: `Promise<string | undefined>` — 新板子名称，`undefined` 表示复制失败

### Step 5: 删除板子

**API**: `eda.dmt_Board.deleteBoard(boardName)`

**返回类型**: `Promise<boolean>` — 操作是否成功

> 如若指定板子不存在，接口将返回 `false`。

### Step 6: 修改板子名称

**API**: `eda.dmt_Board.modifyBoardName(originalBoardName, boardName)`

**返回类型**: `Promise<boolean>` — 是否修改成功

## 代码示例

```typescript
const PLUGIN_TAG = '[BoardManager]';

export async function manageBoardsExample() {
  try {
    // 获取所有板子信息
    const boards = await eda.dmt_Board.getAllBoardsInfo();
    if (!boards || boards.length === 0) {
      console.warn(PLUGIN_TAG, 'No boards found in project');
      return;
    }
    console.warn(PLUGIN_TAG, `Found ${boards.length} boards`);

    // 获取当前板子信息
    const currentBoard = await eda.dmt_Board.getCurrentBoardInfo();
    if (!currentBoard) {
      console.warn(PLUGIN_TAG, 'No active board');
      return;
    }

    // 复制当前板子
    const newBoardName = await eda.dmt_Board.copyBoard(currentBoard.boardName);
    if (!newBoardName) {
      console.warn(PLUGIN_TAG, 'Failed to copy board');
      return;
    }
    console.warn(PLUGIN_TAG, `Board copied as: ${newBoardName}`);

    // 修改新板子名称
    const renamed = await eda.dmt_Board.modifyBoardName(newBoardName, 'MyNewBoard');
    if (!renamed) {
      console.warn(PLUGIN_TAG, 'Failed to rename board');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Board management failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `deleteBoard` 返回 `false` | 指定板子名称不存在 | 先用 `getAllBoardsInfo()` 确认板子名称 |
| `getCurrentBoardInfo` 返回 `undefined` | 没有打开任何文档或焦点不在原理图/PCB 上 | 确保焦点在某个板子关联的文档上 |
| `createBoard` 返回 `undefined` | 创建失败（BETA 接口限制） | 检查参数是否正确，确认工程已打开 |
| `modifyBoardName` 返回 `false` | 原板子名称不存在或新名称冲突 | 确认原名称正确且新名称不重复 |

## 变体

- **获取指定板子信息**: 使用 `eda.dmt_Board.getBoardInfo(boardName)` 按名称查询
- **创建板子并关联原理图/PCB**: 传入 `schematicUuid` 和 `pcbUuid` 参数
- **批量管理板子**: 遍历 `getAllBoardsInfo()` 结果进行批量操作
