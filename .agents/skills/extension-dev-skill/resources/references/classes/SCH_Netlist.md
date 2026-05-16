# SCH\_Netlist class

原理图 &amp; 符号 / 网表类

## 签名

```typescript
declare class SCH_Netlist
```

## 备注

获取、更新网表

## 方法

| 方法名                                           | 修饰符 | 描述                |
| --------------------------------------------- | --- | ----------------- |
| [getNetlist(type)](./SCH_Netlist.md)          |     | 获取网表              |
| [setNetlist(type, netlist)](./SCH_Netlist.md) |     | **_(BETA)_** 更新网表 |

---

## 方法详情

### getnetlist

# SCH\_Netlist.getNetlist() method

> 警告：此 API 现已弃用。
>
> 请使用 [SCH\_ManufactureData.getNetlistFile()](./SCH_ManufactureData.md) 替代

获取网表

## 签名

```typescript
getNetlist(type?: ESYS_NetlistType): Promise<string>;
```

## 参数名

| 参数   | 类型                                                | 描述          |
| ---- | ------------------------------------------------- | ----------- |
| type | [ESYS\_NetlistType](../enums/ESYS_NetlistType.md) | _（可选）_ 网表格式 |



## 返回值

Promise&lt;string&gt;

网表数据

### setnetlist

# SCH\_Netlist.setNetlist() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

更新网表

## 签名

```typescript
setNetlist(type: ESYS_NetlistType | undefined, netlist: string): Promise<void>;
```

## 参数名

| 参数      | 类型                                                             | 描述   |
| ------- | -------------------------------------------------------------- | ---- |
| type    | [ESYS\_NetlistType](../enums/ESYS_NetlistType.md) \| undefined | 网表格式 |
| netlist | string                                                         | 网表数据 |



## 返回值

Promise&lt;void&gt;
