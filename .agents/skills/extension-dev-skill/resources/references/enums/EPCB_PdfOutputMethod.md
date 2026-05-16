# EPCB\_PdfOutputMethod enum

PDF 输出方式

## 签名

```typescript
declare enum EPCB_PdfOutputMethod
```

## 枚举成员

| 成员                          | 值                            | 描述                                |
| --------------------------- | ---------------------------- | --------------------------------- |
| MULTI\_PAGE\_PDF            | `"A Multi Page PDF"`         | 单个多页 PDF                          |
| MULTIPLE\_SINGLE\_PAGE\_PDF | `"Multiple Single Page PDF"` | 多个单页 PDF（将会输出包含所有分解图层 PDF 文件的压缩包） |
| SINGLE\_PAGE\_PDF           | `"A Single Page PDF"`        | 单个单页 PDF（将会输出包含每层一个 PDF 文件的压缩包）   |
