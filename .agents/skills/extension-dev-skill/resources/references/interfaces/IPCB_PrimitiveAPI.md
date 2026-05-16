# IPCB\_PrimitiveAPI interface

PCB 图元接口

## 签名

```typescript
interface IPCB_PrimitiveAPI
```

## 属性

| 属性名                                         | 修饰符 | 类型                                                                                                                                                                                                                                                                                                                     | 描述  |
| ------------------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| [create](./IPCB_PrimitiveAPI.md)            |     | (...args: any\[\]) =&gt; [IPCB\_Primitive](./IPCB_Primitive.md) \| undefined \| Promise&lt;[IPCB\_Primitive](./IPCB_Primitive.md)&gt; \| Promise&lt;[IPCB\_Primitive](./IPCB_Primitive.md) \| undefined&gt;                                                                                                            |     |
| [delete](./IPCB_PrimitiveAPI.md)            |     | (primitiveIds: string \| any \| Array&lt;string&gt; \| Array&lt;any&gt;) =&gt; boolean \| Promise&lt;boolean&gt;                                                                                                                                                                                                       |     |
| [get](./IPCB_PrimitiveAPI.md)               |     | { (primitiveIds: string): [IPCB\_Primitive](./IPCB_Primitive.md) \| undefined \| Promise&lt;[IPCB\_Primitive](./IPCB_Primitive.md) \| undefined&gt;; (primitiveIds: Array&lt;string&gt;): Array&lt;[IPCB\_Primitive](./IPCB_Primitive.md)&gt; \| Promise&lt;Array&lt;[IPCB\_Primitive](./IPCB_Primitive.md)&gt;&gt;; } |     |
| [getAll](./IPCB_PrimitiveAPI.md)            |     | (...args: any\[\]) =&gt; Array&lt;[IPCB\_Primitive](./IPCB_Primitive.md)&gt; \| Promise&lt;Array&lt;[IPCB\_Primitive](./IPCB_Primitive.md)&gt;&gt;                                                                                                                                                                     |     |
| [getAllPrimitiveId](./IPCB_PrimitiveAPI.md) |     | (...args: any\[\]) =&gt; Array&lt;string&gt; \| Promise&lt;Array&lt;string&gt;&gt;                                                                                                                                                                                                                                     |     |
| [modify](./IPCB_PrimitiveAPI.md)            |     | (primitiveId: string \| any, ...args: any\[\]) =&gt; [IPCB\_Primitive](./IPCB_Primitive.md) \| undefined \| Promise&lt;[IPCB\_Primitive](./IPCB_Primitive.md)&gt; \| Promise&lt;[IPCB\_Primitive](./IPCB_Primitive.md) \| undefined&gt;                                                                                |     |

---

## 属性详情

### create

# IPCB\_PrimitiveAPI.create property

## 签名

```typescript
create: (...args: any[]) => IPCB_Primitive | undefined | Promise<IPCB_Primitive> | Promise<IPCB_Primitive | undefined>;
```

### delete

# IPCB\_PrimitiveAPI.delete property

## 签名

```typescript
delete: (primitiveIds: string | any | Array<string> | Array<any>) => boolean | Promise<boolean>;
```

### get

# IPCB\_PrimitiveAPI.get property

## 签名

```typescript
get: {
        (primitiveIds: string): IPCB_Primitive | undefined | Promise<IPCB_Primitive | undefined>;
        (primitiveIds: Array<string>): Array<IPCB_Primitive> | Promise<Array<IPCB_Primitive>>;
    };
```

### getall

# IPCB\_PrimitiveAPI.getAll property

## 签名

```typescript
getAll: (...args: any[]) => Array<IPCB_Primitive> | Promise<Array<IPCB_Primitive>>;
```

### getallprimitiveid

# IPCB\_PrimitiveAPI.getAllPrimitiveId property

## 签名

```typescript
getAllPrimitiveId: (...args: any[]) => Array<string> | Promise<Array<string>>;
```

### modify

# IPCB\_PrimitiveAPI.modify property

## 签名

```typescript
modify: (primitiveId: string | any, ...args: any[]) => IPCB_Primitive | undefined | Promise<IPCB_Primitive> | Promise<IPCB_Primitive | undefined>;
```
