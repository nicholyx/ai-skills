# ESYS\_ImportProjectViaSolderMaskExpansion enum

导入工程过孔阻焊扩展

## 签名

```typescript
declare enum ESYS_ImportProjectViaSolderMaskExpansion
```

## 枚举成员

| 成员                        | 值          | 描述    |
| ------------------------- | ---------- | ----- |
| ALL\_COVER\_OIL           | `"cover"`  | 全部盖油  |
| FOLLOW\_ORIGINAL\_SETTING | `"custom"` | 跟随源设置 |

## 备注

仅 `fileType` 为 `Altium Designer` 或 `Protel` 时才可以指定该属性，否则将被忽略
