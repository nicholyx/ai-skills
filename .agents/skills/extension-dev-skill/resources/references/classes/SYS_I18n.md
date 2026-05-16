# SYS\_I18n class

系统 / 多语言类

## 签名

```typescript
declare class SYS_I18n
```

## 备注

使用多语言系统展示多语言文本


## 方法

| 方法名                                                                      | 修饰符 | 描述              |
| ------------------------------------------------------------------------ | --- | --------------- |
| [addLanguageChangedEventListener(id, callFn, onlyOnce)](./SYS_I18n.md)   |     | 新增语言切换事件监听      |
| [getAllSupportedLanguages()](./SYS_I18n.md)                              |     | 查询所有支持的语言       |
| [getCurrentLanguage()](./SYS_I18n.md)                                    |     | 获取当前语言环境        |
| [importMultilingual(language, source)](./SYS_I18n.md)                    |     | 导入多语言           |
| [importMultilingualLanguage(namespace, language, source)](./SYS_I18n.md) |     | 导入多语言：指定命名空间和语言 |
| [importMultilingualNamespace(namespace, source)](./SYS_I18n.md)          |     | 导入多语言：指定命名空间    |
| [isEventListenerAlreadyExist(id)](./SYS_I18n.md)                         |     | 查询事件监听是否存在      |
| [isLanguageSupported(language)](./SYS_I18n.md)                           |     | 检查语言是否受支持       |
| [removeEventListener(id)](./SYS_I18n.md)                                 |     | 移除事件监听          |
| [text(tag, namespace, language, args)](./SYS_I18n.md)                    |     | 输出语言文本          |

---

## 方法详情

### addlanguagechangedeventlistener

# SYS\_I18n.addLanguageChangedEventListener() method

新增语言切换事件监听

## 签名

```typescript
addLanguageChangedEventListener(id: string, callFn: (newLanguage: string, lastLanguage: string) => void | Promise<void>, onlyOnce: boolean): void;
```

## 参数名

| 参数       | 类型                                                                            | 描述               |
| -------- | ----------------------------------------------------------------------------- | ---------------- |
| id       | string                                                                        | 事件 ID，用以防止重复注册事件 |
| callFn   | (newLanguage: string, lastLanguage: string) =&gt; void \| Promise&lt;void&gt; | 事件触发时的回调函数       |
| onlyOnce | boolean                                                                       |                  |



## 返回值

void

### getallsupportedlanguages

# SYS\_I18n.getAllSupportedLanguages() method

查询所有支持的语言

## 签名

```typescript
getAllSupportedLanguages(): Array<string>;
```


## 返回值

Array&lt;string&gt;

所有支持的语言列表

### getcurrentlanguage

# SYS\_I18n.getCurrentLanguage() method

获取当前语言环境

## 签名

```typescript
getCurrentLanguage(): Promise<string>;
```


## 返回值

Promise&lt;string&gt;

语言

## 备注

能够获取到的语言受 EDA 当前支持语言限制，其它 API 支持的语言需要显式指定 `language` 参数才能使用

### importmultilingual

# SYS\_I18n.importMultilingual() method

导入多语言

## 签名

```typescript
importMultilingual(language: string, source: ISYS_LanguageKeyValuePairs): boolean;
```

## 参数名

| 参数       | 类型                                                                         | 描述          |
| -------- | -------------------------------------------------------------------------- | ----------- |
| language | string                                                                     | 语言          |
| source   | [ISYS\_LanguageKeyValuePairs](../interfaces/ISYS_LanguageKeyValuePairs.md) | 欲导入的多语言数据对象 |



## 返回值

boolean

导入是否成功

## 备注

注意：本接口仅扩展有效，在独立脚本环境内调用将始终 `throw Error`

### importmultilinguallanguage

# SYS\_I18n.importMultilingualLanguage() method

导入多语言：指定命名空间和语言

## 签名

```typescript
importMultilingualLanguage(namespace: string, language: string, source: ISYS_LanguageKeyValuePairs): boolean;
```

## 参数名

| 参数        | 类型                                                                         | 描述          |
| --------- | -------------------------------------------------------------------------- | ----------- |
| namespace | string                                                                     | 命名空间        |
| language  | string                                                                     | 语言          |
| source    | [ISYS\_LanguageKeyValuePairs](../interfaces/ISYS_LanguageKeyValuePairs.md) | 欲导入的多语言数据对象 |



## 返回值

boolean

导入是否成功

### importmultilingualnamespace

# SYS\_I18n.importMultilingualNamespace() method

导入多语言：指定命名空间

## 签名

```typescript
importMultilingualNamespace(namespace: string, source: ISYS_MultilingualLanguagesData): boolean;
```

## 参数名

| 参数        | 类型                                                                                 | 描述          |
| --------- | ---------------------------------------------------------------------------------- | ----------- |
| namespace | string                                                                             | 命名空间        |
| source    | [ISYS\_MultilingualLanguagesData](../interfaces/ISYS_MultilingualLanguagesData.md) | 欲导入的多语言数据对象 |



## 返回值

boolean

导入是否成功

### iseventlisteneralreadyexist

# SYS\_I18n.isEventListenerAlreadyExist() method

查询事件监听是否存在

## 签名

```typescript
isEventListenerAlreadyExist(id: string): boolean;
```

## 参数名

| 参数  | 类型     | 描述    |
| --- | ------ | ----- |
| id  | string | 事件 ID |



## 返回值

boolean

事件监听是否存在

### islanguagesupported

# SYS\_I18n.isLanguageSupported() method

检查语言是否受支持

## 签名

```typescript
isLanguageSupported(language: string): boolean;
```

## 参数名

| 参数       | 类型     | 描述  |
| -------- | ------ | --- |
| language | string | 语言  |



## 返回值

boolean

是否受支持

### removeeventlistener

# SYS\_I18n.removeEventListener() method

移除事件监听

## 签名

```typescript
removeEventListener(id: string): boolean;
```

## 参数名

| 参数  | 类型     | 描述    |
| --- | ------ | ----- |
| id  | string | 事件 ID |



## 返回值

boolean

是否移除指定事件监听

### text

# SYS\_I18n.text() method

输出语言文本

## 签名

```typescript
text(tag: string, namespace?: string, language?: string, ...args: Array<any>): string;
```

## 参数名

| 参数        | 类型               | 描述                                            |
| --------- | ---------------- | --------------------------------------------- |
| tag       | string           | 文本标签，对应多语言文件键值对中的键                            |
| namespace | string           | _（可选）_ 文本命名空间，在扩展运行环境内默认为扩展的 UUID，否则为系统默认命名空间 |
| language  | string           | _（可选）_ 语言，`undefined` 为 EDA 当前的显示语言           |
| args      | Array&lt;any&gt; | 语言文本中替换占位符的参数                                 |



## 返回值

string

语言文本

## 备注

可以使用 `${1}` 格式的占位符表示参数；

语言优先级：当前显示语言 &gt; 系统默认语言 &gt; 数据集中第一个搜索到的包含该文本标签的语言 &gt; 文本标签(tag)
