# SCH\_SimulationEngine class

原理图 &amp; 符号 / 仿真引擎类

## 签名

```typescript
declare class SCH_SimulationEngine
```

## 备注

控制仿真引擎的对接和交互

## 方法

| 方法名                                                     | 修饰符 | 描述        |
| ------------------------------------------------------- | --- | --------- |
| [pushData(eventType, props)](./SCH_SimulationEngine.md) |     | 向仿真内核发送数据 |

---

## 方法详情

### pushdata

# SCH\_SimulationEngine.pushData() method

向仿真内核发送数据

## 签名

```typescript
pushData(eventType: ESCH_DynamicSimulationEnginePushEventType | ESCH_SpiceSimulationEnginePushEventType, props: {
        [key: string]: any;
    }): void;
```

## 参数名

| 参数        | 类型                                                                                                                                                                                                     | 描述   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| eventType | [ESCH\_DynamicSimulationEnginePushEventType](../enums/ESCH_DynamicSimulationEnginePushEventType.md) \| [ESCH\_SpiceSimulationEnginePushEventType](../enums/ESCH_SpiceSimulationEnginePushEventType.md) | 事件类型 |
| props     | \{ \[key: string\]: any; \}                                                                                                                                                                            | 数据   |



## 返回值

void
