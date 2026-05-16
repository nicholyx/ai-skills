# SYS\_Storage class

系统 / 存储类

## 签名

```typescript
declare class SYS_Storage
```

## 备注

可以进行扩展的用户配置存储、浏览器本地存储的操作接口


## 方法

| 方法名                                                     | 修饰符 | 描述         |
| ------------------------------------------------------- | --- | ---------- |
| [clearExtensionAllUserConfigs()](./SYS_Storage.md)      |     | 清除扩展所有用户配置 |
| [deleteExtensionUserConfig(key)](./SYS_Storage.md)      |     | 删除扩展用户配置   |
| [getExtensionAllUserConfigs()](./SYS_Storage.md)        |     | 获取扩展所有用户配置 |
| [getExtensionUserConfig(key)](./SYS_Storage.md)         |     | 获取扩展用户配置   |
| [setExtensionAllUserConfigs(configs)](./SYS_Storage.md) |     | 设置扩展所有用户配置 |
| [setExtensionUserConfig(key, value)](./SYS_Storage.md)  |     | 设置扩展用户配置   |

---

## 方法详情

### clearextensionalluserconfigs

# SYS\_Storage.clearExtensionAllUserConfigs() method

清除扩展所有用户配置

## 签名

```typescript
clearExtensionAllUserConfigs(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

此举会删除当前扩展的所有用户配置信息，请谨慎操作

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### deleteextensionuserconfig

# SYS\_Storage.deleteExtensionUserConfig() method

删除扩展用户配置

## 签名

```typescript
deleteExtensionUserConfig(key: string): Promise<boolean>;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| key | string | 配置项 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### getextensionalluserconfigs

# SYS\_Storage.getExtensionAllUserConfigs() method

获取扩展所有用户配置

## 签名

```typescript
getExtensionAllUserConfigs(): {
        [key: string]: any;
    };
```


## 返回值

\{ \[key: string\]: any; \}

扩展所有用户配置信息

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### getextensionuserconfig

# SYS\_Storage.getExtensionUserConfig() method

获取扩展用户配置

## 签名

```typescript
getExtensionUserConfig(key: string): any | undefined;
```

## 参数名

| 参数  | 类型     | 描述  |
| --- | ------ | --- |
| key | string | 配置项 |



## 返回值

any \| undefined

配置项对应的值，不存在将返回 `undefined`

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### setextensionalluserconfigs

# SYS\_Storage.setExtensionAllUserConfigs() method

设置扩展所有用户配置

## 签名

```typescript
setExtensionAllUserConfigs(configs: {
        [key: string]: any;
    }): Promise<boolean>;
```

## 参数名

| 参数      | 类型                          | 描述       |
| ------- | --------------------------- | -------- |
| configs | \{ \[key: string\]: any; \} | 扩展所有用户配置 |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

此举会覆盖当前扩展的所有用户配置信息，请谨慎操作

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### setextensionuserconfig

# SYS\_Storage.setExtensionUserConfig() method

设置扩展用户配置

## 签名

```typescript
setExtensionUserConfig(key: string, value: any): Promise<boolean>;
```

## 参数名

| 参数    | 类型     | 描述  |
| ----- | ------ | --- |
| key   | string | 配置项 |
| value | any    | 值   |



## 返回值

Promise&lt;boolean&gt;

操作是否成功

## 备注

新建扩展用户配置也使用本接口，在设置时如果不存在将会自动新建

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`
