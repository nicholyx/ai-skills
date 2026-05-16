# ISYS\_MessageBusTask interface

消息总线任务

## 签名

```typescript
interface ISYS_MessageBusTask
```

## 属性

| 属性名                                 | 修饰符 | 类型                                       | 描述      |
| ----------------------------------- | --- | ---------------------------------------- | ------- |
| [cancel](./ISYS_MessageBusTask.md)  |     | () =&gt; void                            | 调用以取消任务 |
| [execute](./ISYS_MessageBusTask.md) |     | (message: any) =&gt; Promise&lt;void&gt; | 任务处理    |
| [running](./ISYS_MessageBusTask.md) |     | () =&gt; boolean                         | 检查运行状态  |

---

## 属性详情

### cancel

# ISYS\_MessageBusTask.cancel property

调用以取消任务

## 签名

```typescript
cancel: () => void;
```

### execute

# ISYS\_MessageBusTask.execute property

任务处理

## 签名

```typescript
execute: (message: any) => Promise<void>;
```

### running

# ISYS\_MessageBusTask.running property

检查运行状态

## 签名

```typescript
running: () => boolean;
```
