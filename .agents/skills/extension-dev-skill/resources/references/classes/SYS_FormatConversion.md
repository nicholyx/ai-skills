# SYS\_FormatConversion class

系统 / 格式转换（Chameleon）类

## 签名

```typescript
declare class SYS_FormatConversion
```

## 备注

与其它板级 EDA 软件进行交叉文件格式转换

## 方法

| 方法名                                                                                  | 修饰符 | 描述                                                   |
| ------------------------------------------------------------------------------------ | --- | ---------------------------------------------------- |
| [convertAltiumDesignerLibrariesToEasyEDAMultiFiles(file)](./SYS_FormatConversion.md) |     | **_(BETA)_** 转换 Altium Designer 库到多个嘉立创库文件（每个器件一个文件） |
| [convertAltiumDesignerLibrariesToEasyEDASingleFile(file)](./SYS_FormatConversion.md) |     | **_(BETA)_** 转换 Altium Designer 库到单个嘉立创库文件           |

---

## 方法详情

### convertaltiumdesignerlibrariestoeasyedamultifiles

# SYS\_FormatConversion.convertAltiumDesignerLibrariesToEasyEDAMultiFiles() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

转换 Altium Designer 库到多个嘉立创库文件（每个器件一个文件）

## 签名

```typescript
convertAltiumDesignerLibrariesToEasyEDAMultiFiles(file: File | Array<File>): Promise<Array<File>>;
```

## 参数名

| 参数   | 类型                        | 描述                  |
| ---- | ------------------------- | ------------------- |
| file | File \| Array&lt;File&gt; | Altium Designer 库文件 |



## 返回值

Promise&lt;Array&lt;File&gt;&gt;

多个嘉立创库文件

### convertaltiumdesignerlibrariestoeasyedasinglefile

# SYS\_FormatConversion.convertAltiumDesignerLibrariesToEasyEDASingleFile() method

> 此 API 当前处于 BETA 预览状态，希望得到开发者的反馈。它的任何功能都可能在接下来的开发进程中被修改，请不要将它用于任何正式环境。

转换 Altium Designer 库到单个嘉立创库文件

## 签名

```typescript
convertAltiumDesignerLibrariesToEasyEDASingleFile(file: File | Array<File>): Promise<File | undefined>;
```

## 参数名

| 参数   | 类型                        | 描述                  |
| ---- | ------------------------- | ------------------- |
| file | File \| Array&lt;File&gt; | Altium Designer 库文件 |



## 返回值

Promise&lt;File \| undefined&gt;

嘉立创库文件
