# SYS\_Tool class

系统 / 工具类

## 签名

```typescript
declare class SYS_Tool
```

## 方法

| 方法名                                                    | 修饰符 | 描述                |
| ------------------------------------------------------ | --- | ----------------- |
| [netlistComparison(netlist1, netlist2)](./SYS_Tool.md) |     | **_(BETA)_** 网表对比 |

---

## 方法详情

### netlistcomparison

# SYS\_Tool.netlistComparison() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

网表对比

## 签名

```typescript
netlistComparison(netlist1: string | {
        projectUuid: string;
        documentUuid: string;
    } | File, netlist2: string | {
        projectUuid: string;
        documentUuid: string;
    } | File): Promise<Array<{
        type: 'Net' | 'Component';
        object: string;
        netlist1Name: Array<string>;
        netlist2Name: Array<string>;
    }>>;
```

## 参数名

| 参数       | 类型                                                               | 描述                                                                       |
| -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| netlist1 | string \| { projectUuid: string; documentUuid: string; } \| File | 网表 1，可以为：①当前工程内的原理图、PCB 的 UUID；②其它工程的工程 UUID 和原理图、PCB UUID；③原理图、PCB 文件数据 |
| netlist2 | string \| { projectUuid: string; documentUuid: string; } \| File | 网表 2，可以为：①当前工程内的原理图、PCB 的 UUID；②其它工程的工程 UUID 和原理图、PCB UUID；③原理图、PCB 文件数据 |



## 返回值

Promise&lt;Array&lt;{ type: 'Net' \| 'Component'; object: string; netlist1Name: Array&lt;string&gt;; netlist2Name: Array&lt;string&gt;; }&gt;&gt;

网表对比结果
