# ESCH\_DynamicSimulationEnginePushEventType enum

动态仿真引擎推送事件类型

## 签名

```typescript
declare enum ESCH_DynamicSimulationEnginePushEventType
```

## 枚举成员

| 成员               | 值                   | 描述                              |
| ---------------- | ------------------- | ------------------------------- |
| ENGINE\_ERROR    | `"ENGINE_ERROR"`    | 错误                              |
| ENGINE\_LOG      | `"ENGINE_LOG"`      | 实时日志                            |
| SESSION\_STATE   | `"SESSION_STATE"`   | 状态变化（RUNNING/PAUSED/STOPPED...） |
| STREAM\_DATA     | `"STREAM_DATA"`     | 实时数据帧（波形点/节点电压/内部量）             |
| STREAM\_SNAPSHOT | `"STREAM_SNAPSHOT"` | 一次快照（可选，用于 UI 刷新）               |
