# SYS\_ClientUrl class

系统 / 外部请求类

## 签名

```typescript
declare class SYS_ClientUrl
```

## 备注

向外部服务器发起安全的 cURL 请求


## 方法

| 方法名                                                                      | 修饰符 | 描述     |
| ------------------------------------------------------------------------ | --- | ------ |
| [request(url, method, data, options, succeedCallFn)](./SYS_ClientUrl.md) |     | 发起即时请求 |

---

## 方法详情

### request

# SYS\_ClientUrl.request() method

发起即时请求

## 签名

```typescript
request(url: string, method?: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'PATCH', data?: string | Blob | FormData | URLSearchParams, options?: {
        headers?: {
            [header: string]: any;
        };
        integrity?: string;
    }, succeedCallFn?: (data: Response) => void | Promise<void>): Promise<Response>;
```

## 参数名

| 参数            | 类型                                                                  | 描述                                                                                                                                          |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| url           | string                                                              | 请求地址                                                                                                                                        |
| method        | 'GET' \| 'POST' \| 'HEAD' \| 'PUT' \| 'DELETE' \| 'PATCH'           | _（可选）_ 请求方法                                                                                                                                 |
| data          | string \| Blob \| FormData \| URLSearchParams                       | _（可选）_ 请求发送的数据，可以是直接数据或 [URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams) 对象，如果 method 为 `HEAD` 或 `GET`，本参数将被忽略 |
| options       | \{ headers?: \{ \[header: string\]: any; \}; integrity?: string; \} | _（可选）_ 请求参数                                                                                                                                 |
| succeedCallFn | (data: Response) =&gt; void \| Promise&lt;void&gt;                  | _（可选）_ 请求成功后回调的函数                                                                                                                           |



## 返回值

Promise&lt;Response&gt;

Fetch 的返回结果

## 备注

请注意，需要在被请求的站点上允许跨源资源共享（CORS），否则接口将始终返回错误结果。

更多信息，请查阅 [跨源资源共享 (CORS) - MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)。

注意：本接口需要使用者启用扩展的外部交互权限，如若未启用将始终 `throw Error`
