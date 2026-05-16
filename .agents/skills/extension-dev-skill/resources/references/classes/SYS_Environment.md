# SYS\_Environment class

系统 / 运行环境类

## 签名

```typescript
declare class SYS_Environment
```

## 备注

获取嘉立创 EDA 专业版运行环境参数

## 方法

| 方法名                                               | 修饰符 | 描述                 |
| ------------------------------------------------- | --- | ------------------ |
| [getEditorCompliedDate()](./SYS_Environment.md)   |     | 获取编辑器编译日期          |
| [getEditorCurrentVersion()](./SYS_Environment.md) |     | 获取编辑器当前版本          |
| [getUserInfo()](./SYS_Environment.md)             |     | 获取用户信息             |
| [isClient()](./SYS_Environment.md)                |     | 是否处于客户端环境          |
| [isEasyEDAProEdition()](./SYS_Environment.md)     |     | 是否为 EasyEDA Pro 版本 |
| [isHalfOfflineMode()](./SYS_Environment.md)       |     | 是否为半离线模式           |
| [isJLCEDAProEdition()](./SYS_Environment.md)      |     | 是否为 嘉立创EDA 专业版本    |
| [isOfflineMode()](./SYS_Environment.md)           |     | 是否为全离线模式           |
| [isOnlineMode()](./SYS_Environment.md)            |     | 是否为在线模式            |
| [isProPrivateEdition()](./SYS_Environment.md)     |     | 是否为私有化部署版本         |
| [isWeb()](./SYS_Environment.md)                   |     | 是否处于浏览器环境          |

---

## 方法详情

### geteditorcomplieddate

# SYS\_Environment.getEditorCompliedDate() method

获取编辑器编译日期

## 签名

```typescript
getEditorCompliedDate(): string;
```


## 返回值

string

编辑器编译日期

### geteditorcurrentversion

# SYS\_Environment.getEditorCurrentVersion() method

获取编辑器当前版本

## 签名

```typescript
getEditorCurrentVersion(): string;
```


## 返回值

string

编辑器当前版本

### getuserinfo

# SYS\_Environment.getUserInfo() method

获取用户信息

## 签名

```typescript
getUserInfo(): {
        username?: string;
        nickname?: string;
        avatar?: string;
        uuid?: string;
        customerCode?: string;
    };
```


## 返回值

\{ username?: string; nickname?: string; avatar?: string; uuid?: string; customerCode?: string; \}

用户信息

### isclient

# SYS\_Environment.isClient() method

是否处于客户端环境

## 签名

```typescript
isClient(): boolean;
```


## 返回值

boolean

是否处于客户端环境

### iseasyedaproedition

# SYS\_Environment.isEasyEDAProEdition() method

是否为 EasyEDA Pro 版本

## 签名

```typescript
isEasyEDAProEdition(): boolean;
```


## 返回值

boolean

是否为 EasyEDA Pro 版本

### ishalfofflinemode

# SYS\_Environment.isHalfOfflineMode() method

是否为半离线模式

## 签名

```typescript
isHalfOfflineMode(): boolean;
```


## 返回值

boolean

是否为半离线模式

### isjlcedaproedition

# SYS\_Environment.isJLCEDAProEdition() method

是否为 嘉立创EDA 专业版本

## 签名

```typescript
isJLCEDAProEdition(): boolean;
```


## 返回值

boolean

是否为嘉立创EDA 专业版本

### isofflinemode

# SYS\_Environment.isOfflineMode() method

是否为全离线模式

## 签名

```typescript
isOfflineMode(): boolean;
```


## 返回值

boolean

是否为全离线模式

### isonlinemode

# SYS\_Environment.isOnlineMode() method

是否为在线模式

## 签名

```typescript
isOnlineMode(): boolean;
```


## 返回值

boolean

是否为在线模式

### isproprivateedition

# SYS\_Environment.isProPrivateEdition() method

是否为私有化部署版本

## 签名

```typescript
isProPrivateEdition(): boolean;
```


## 返回值

boolean

是否为私有化部署版本

### isweb

# SYS\_Environment.isWeb() method

是否处于浏览器环境

## 签名

```typescript
isWeb(): boolean;
```


## 返回值

boolean

是否处于浏览器环境
