# ESCH\_DynamicSimulationEnginePullEventType enum

动态仿真引擎拉取事件类型

## 签名

```typescript
declare enum ESCH_DynamicSimulationEnginePullEventType
```

## 枚举成员

| 成员                    | 值                       | 描述       |
| --------------------- | ----------------------- | -------- |
| COMPONENT\_UPDATE     | `"COMPONENT_UPDATE"`    | 更新元件属性   |
| SESSION\_PAUSE        | `"SESSION_PAUSE"`       | 暂停       |
| SESSION\_RESUME       | `"SESSION_RESUME"`      | 恢复       |
| SESSION\_START        | `"SESSION_START"`       | 开始动态仿真会话 |
| SESSION\_STATE\_QUERY | `"SESSION_STATE_QUERY"` | 查询动态仿真状态 |
| SESSION\_STOP         | `"SESSION_STOP"`        | 停止并释放资源  |
| SPEED\_SET            | `"SPEED_SET"`           | 设置速度     |
