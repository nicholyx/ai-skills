# IDMT\_ProjectItem interface

工程属性

## 签名

```typescript
interface IDMT_ProjectItem extends IDMT_BriefProjectItem
```
**扩展自：**[IDMT\_BriefProjectItem](./IDMT_BriefProjectItem.md)

## 属性

| 属性名                                         | 修饰符 | 类型                                                                                                                                                                                    | 描述            |
| ------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [collaborationMode?](./IDMT_ProjectItem.md) |     | [EDMT\_ProjectCollaborationMode](../enums/EDMT_ProjectCollaborationMode.md)                                                                                                           | _（可选）_ 工程协作模式 |
| [data](./IDMT_ProjectItem.md)               |     | Array&lt;[IDMT\_BoardItem](./IDMT_BoardItem.md) \| [IDMT\_SchematicItem](./IDMT_SchematicItem.md) \| [IDMT\_PcbItem](./IDMT_PcbItem.md) \| [IDMT\_PanelItem](./IDMT_PanelItem.md)&gt; | 工程内文档数据       |
| [description?](./IDMT_ProjectItem.md)       |     | string                                                                                                                                                                                | _（可选）_ 描述     |
| [name](./IDMT_ProjectItem.md)               |     | string                                                                                                                                                                                | 工程链接名称        |

---

## 属性详情

### collaborationmode

# IDMT\_ProjectItem.collaborationMode property

工程协作模式

## 签名

```typescript
collaborationMode?: EDMT_ProjectCollaborationMode;
```

### data

# IDMT\_ProjectItem.data property

工程内文档数据

## 签名

```typescript
data: Array<IDMT_BoardItem | IDMT_SchematicItem | IDMT_PcbItem | IDMT_PanelItem>;
```

### description

# IDMT\_ProjectItem.description property

描述

## 签名

```typescript
description?: string;
```

### name

# IDMT\_ProjectItem.name property

工程链接名称

## 签名

```typescript
name: string;
```
