# ESYS\_ImportProjectBoardOutlineSource enum

导入工程板边框来源

## 签名

```typescript
declare enum ESYS_ImportProjectBoardOutlineSource
```

## 枚举成员

| 成员                         | 值              | 描述          |
| -------------------------- | -------------- | ----------- |
| FROM\_KEEPOUT\_LAYER       | `"keepout"`    | 从 Keepout 层 |
| FROM\_MECHANICAL\_LAYER\_1 | `"mechanical"` | 从机械层 1      |

## 备注

仅 `fileType` 为 `Altium Designer` 或 `Protel` 时才可以指定该属性，否则将被忽略
