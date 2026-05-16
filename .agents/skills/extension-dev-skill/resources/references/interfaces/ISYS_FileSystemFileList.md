# ISYS\_FileSystemFileList interface

文件系统文件路径

## 签名

```typescript
interface ISYS_FileSystemFileList
```

## 属性

| 属性名                                           | 修饰符 | 类型                                                                    | 描述                                                   |
| --------------------------------------------- | --- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| [fileName](./ISYS_FileSystemFileList.md)      |     | string                                                                | 文件名（前后均无斜杠）                                          |
| [fullPath](./ISYS_FileSystemFileList.md)      |     | string                                                                | 完整路径，包含文件名的绝对路径                                      |
| [isDirectory](./ISYS_FileSystemFileList.md)   |     | boolean                                                               | 是否为目录                                                |
| [relativePath?](./ISYS_FileSystemFileList.md) |     | string                                                                | _（可选）_ 相对路径，不包含前面的传入路径和文件名（当没有传入路径时，不存在相对路径），且前后均无斜杠 |
| [subFiles?](./ISYS_FileSystemFileList.md)     |     | Array&lt;[ISYS\_FileSystemFileList](./ISYS_FileSystemFileList.md)&gt; | _（可选）_ 目录子文件                                         |

---

## 属性详情

### filename

# ISYS\_FileSystemFileList.fileName property

文件名（前后均无斜杠）

## 签名

```typescript
fileName: string;
```

### fullpath

# ISYS\_FileSystemFileList.fullPath property

完整路径，包含文件名的绝对路径

## 签名

```typescript
fullPath: string;
```

### isdirectory

# ISYS\_FileSystemFileList.isDirectory property

是否为目录

## 签名

```typescript
isDirectory: boolean;
```

### relativepath

# ISYS\_FileSystemFileList.relativePath property

相对路径，不包含前面的传入路径和文件名（当没有传入路径时，不存在相对路径），且前后均无斜杠

## 签名

```typescript
relativePath?: string;
```

### subfiles

# ISYS\_FileSystemFileList.subFiles property

目录子文件

## 签名

```typescript
subFiles?: Array<ISYS_FileSystemFileList>;
```
