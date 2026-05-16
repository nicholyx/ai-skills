# 工程管理：创建/打开/关闭工程，获取工程、团队、文件夹、工作区信息

> **适用摘要**: 管理工程（Project）——创建、打开工程，获取工程/团队/文件夹/工作区信息，移动工程到文件夹。跨工程操作和工程组织的基础。

## 触发意图

- "创建一个新工程"
- "打开指定工程"
- "获取当前工程信息"
- "获取所有工程列表"
- "获取团队信息"
- "创建文件夹"
- "移动工程到文件夹"
- "切换工作区"

## 前置条件

| 条件 | 要求 |
|---|---|
| 编辑器状态 | EDA 已启动，用户已登录 |
| 权限 | 创建工程/文件夹需要对应团队权限 |

## 调用链

```
EDA 已启动
  → 工程操作:
    → dmt_Project.getCurrentProjectInfo() — 获取当前工程信息
    → dmt_Project.getAllProjectsUuid(teamUuid?, folderUuid?) — 获取所有工程 UUID
    → dmt_Project.getProjectInfo(projectUuid) — 获取工程属性
    → dmt_Project.createProject(...) — 创建工程（BETA）
    → dmt_Project.openProject(projectUuid) — 打开工程
    → dmt_Project.moveProjectToFolder(projectUuid, folderUuid?) — 移动工程
  → 团队操作:
    → dmt_Team.getCurrentTeamInfo() — 获取当前团队
    → dmt_Team.getAllTeamsInfo() — 获取所有直接团队
  → 文件夹操作:
    → dmt_Folder.createFolder(folderName, teamUuid) — 创建文件夹（BETA）
    → dmt_Folder.getAllFoldersUuid(teamUuid) — 获取所有文件夹
  → 工作区操作:
    → dmt_Workspace.getCurrentWorkspaceInfo() — 获取当前工作区
    → dmt_Workspace.toggleToWorkspace(workspaceUuid?) — 切换工作区
```

## 分步说明

### Step 1: 获取当前工程信息

**API**: `eda.dmt_Project.getCurrentProjectInfo()`

**参考**: `../resources/references/classes/DMT_Project.md`

**返回类型**: `Promise<IDMT_ProjectItem | undefined>`

**参考接口**: `../resources/references/interfaces/IDMT_ProjectItem.md`

> 获取当前打开且拥有最后输入焦点的原理图、PCB、面板所关联的工程的详细属性。

### Step 2: 获取所有工程 UUID

**API**: `eda.dmt_Project.getAllProjectsUuid(teamUuid?, folderUuid?, workspaceUuid?)`

**参数说明**:
- `teamUuid`（可选）— 团队 UUID
- `folderUuid`（可选）— 文件夹 UUID
- `teamUuid` 和 `folderUuid` 需要且仅允许指定其一

**返回类型**: `Promise<Array<string>>`

### Step 3: 获取工程属性

**API**: `eda.dmt_Project.getProjectInfo(projectUuid)`

**返回类型**: `Promise<IDMT_BriefProjectItem | undefined>`

**参考接口**: `../resources/references/interfaces/IDMT_BriefProjectItem.md`

> 本接口只能读取简略的工程属性，如需详细的工程树，请使用 `getCurrentProjectInfo()`。

### Step 4: 打开工程

**API**: `eda.dmt_Project.openProject(projectUuid)`

**返回类型**: `Promise<boolean>`

> ⚠️ 打开新工程会直接丢失当前工程未保存的数据！

### Step 5: 创建工程（BETA）

**API**: `eda.dmt_Project.createProject(projectFriendlyName, projectName?, teamUuid?, folderUuid?, description?, collaborationMode?)`

**参考枚举**: `../resources/references/enums/EDMT_ProjectCollaborationMode.md`

**返回类型**: `Promise<string | undefined>` — 工程 UUID

### Step 6: 获取团队信息

**API**: `eda.dmt_Team.getCurrentTeamInfo()` / `eda.dmt_Team.getAllTeamsInfo()`

**参考**: `../resources/references/classes/DMT_Team.md`

**参考接口**: `../resources/references/interfaces/IDMT_TeamItem.md`

> 个人本质上也是一个名为"个人"的团队。

### Step 7: 文件夹操作

**API**: `eda.dmt_Folder.createFolder(folderName, teamUuid, parentFolderUuid?, description?)`（BETA）

**参考**: `../resources/references/classes/DMT_Folder.md`

**其他方法**:
- `getAllFoldersUuid(teamUuid)` — 获取所有文件夹 UUID（忽略层级，返回一维数组）
- `getFolderInfo(teamUuid, folderUuid)` — 获取文件夹详细属性
- `modifyFolderName(teamUuid, folderUuid, folderName)` — 修改文件夹名称
- `deleteFolder(teamUuid, folderUuid)` — 删除文件夹

### Step 8: 工作区操作

**API**: `eda.dmt_Workspace.getCurrentWorkspaceInfo()` / `eda.dmt_Workspace.toggleToWorkspace(workspaceUuid?)`

**参考**: `../resources/references/classes/DMT_Workspace.md`

**参考接口**: `../resources/references/interfaces/IDMT_WorkspaceItem.md`

## 代码示例

```typescript
const PLUGIN_TAG = '[ProjectManager]';

export async function projectManagementExample() {
  try {
    // 获取当前团队
    const team = await eda.dmt_Team.getCurrentTeamInfo();
    if (!team) {
      console.warn(PLUGIN_TAG, 'No current team');
      return;
    }

    // 获取团队下所有工程
    const projectUuids = await eda.dmt_Project.getAllProjectsUuid(team.uuid);
    console.warn(PLUGIN_TAG, `Found ${projectUuids.length} projects`);

    // 获取当前工程详细信息
    const currentProject = await eda.dmt_Project.getCurrentProjectInfo();
    if (!currentProject) {
      console.warn(PLUGIN_TAG, 'No project currently open');
      return;
    }
    console.warn(PLUGIN_TAG, `Current project: ${currentProject.name}`);

    // 创建新文件夹
    const folderUuid = await eda.dmt_Folder.createFolder(
      'MyFolder',
      team.uuid
    );
    if (!folderUuid) {
      console.warn(PLUGIN_TAG, 'Failed to create folder');
      return;
    }

    // 移动当前工程到新文件夹
    const moved = await eda.dmt_Project.moveProjectToFolder(
      currentProject.uuid,
      folderUuid
    );
    if (!moved) {
      console.warn(PLUGIN_TAG, 'Failed to move project');
    }
  } catch (err) {
    console.error(PLUGIN_TAG, 'Project management failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| `getCurrentProjectInfo` 返回 `undefined` | 没有打开任何工程 | 先打开一个工程 |
| `openProject` 丢失数据 | 切换工程前未保存 | 先保存当前工程所有文档 |
| `createProject` 返回 `undefined` | 工程名称重复或权限不足 | 检查 `projectName` 唯一性和团队权限 |
| `getAllProjectsUuid` 同时传入 teamUuid 和 folderUuid | 两者只能指定其一 | 只传其中一个参数 |
| 文件夹操作需要 teamUuid | 忘记传入 teamUuid | 先通过 `dmt_Team` 获取团队 UUID |

## 变体

- **获取所有参与的团队**: 使用 `eda.dmt_Team.getAllInvolvedTeamInfo()` 包含被邀请的团队
- **切换工作区**: 使用 `eda.dmt_Workspace.toggleToWorkspace()` 不传参切换到个人工作区
- **移动文件夹**: 使用 `eda.dmt_Folder.moveFolderToFolder(teamUuid, folderUuid, parentFolderUuid?)`
