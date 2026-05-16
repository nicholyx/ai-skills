# 外部 HTTP 请求：向外部服务器发起 cURL 请求

> **适用摘要**: 使用 `sys_ClientUrl` 向外部服务器发起 HTTP 请求（GET/POST/PUT/DELETE 等），需要目标站点允许 CORS。

## 触发意图

- "调用外部 API"
- "发送 HTTP 请求"
- "从服务器获取数据"
- "向服务器提交数据"

## 前置条件

| 条件 | 要求 |
|---|---|
| 权限 | 必须启用扩展的外部交互权限 |
| 目标服务器 | 必须允许跨源资源共享（CORS） |

## 调用链

```
Step 1: sys_ClientUrl.request(url, method, data, options) — 发起请求
Step 2: 处理 Response 对象（response.json() / response.text()）
```

## 分步说明

### Step 1: 发起请求

**API**: `eda.sys_ClientUrl.request(url, method?, data?, options?, succeedCallFn?)`

**参考**: `../resources/references/classes/SYS_ClientUrl.md`

**返回类型**: `Promise<Response>`

**参数说明**:
- `url` — 请求地址
- `method` — `'GET'` | `'POST'` | `'HEAD'` | `'PUT'` | `'DELETE'` | `'PATCH'`
- `data` — 请求体（`string` | `Blob` | `FormData` | `URLSearchParams`），GET/HEAD 时忽略
- `options` — `{ headers?: { [header: string]: any }, integrity?: string }`
- `succeedCallFn` — 请求成功后的回调函数

### Step 2: 处理响应

返回标准 Fetch `Response` 对象，使用 `.json()` / `.text()` / `.blob()` 解析。

## 代码示例

```typescript
const PLUGIN_TAG = '[HttpRequest]';

export async function fetchData() {
  try {
    // GET 请求
    const response = await eda.sys_ClientUrl.request(
      'https://api.example.com/data',
      'GET'
    );

    if (!response.ok) {
      console.warn(PLUGIN_TAG, 'Request failed:', response.status);
      return;
    }

    const data = await response.json();
    console.warn(PLUGIN_TAG, 'Received data:', data);
  } catch (err) {
    console.error(PLUGIN_TAG, 'HTTP request failed:', err);
  }
}

export async function postData() {
  try {
    // POST 请求（JSON）
    const body = JSON.stringify({ name: 'test', value: 42 });
    const response = await eda.sys_ClientUrl.request(
      'https://api.example.com/submit',
      'POST',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(PLUGIN_TAG, 'POST failed:', response.status);
      return;
    }

    const result = await response.json();
    console.warn(PLUGIN_TAG, 'POST result:', result);
    await eda.sys_Dialog.showInformationMessage('数据提交成功');
  } catch (err) {
    console.error(PLUGIN_TAG, 'POST request failed:', err);
  }
}

export async function uploadFormData() {
  try {
    // FormData 上传
    const formData = new FormData();
    formData.append('field1', 'value1');

    const response = await eda.sys_ClientUrl.request(
      'https://api.example.com/upload',
      'POST',
      formData
    );

    if (!response.ok) {
      console.warn(PLUGIN_TAG, 'Upload failed:', response.status);
      return;
    }

    console.warn(PLUGIN_TAG, 'Upload succeeded');
  } catch (err) {
    console.error(PLUGIN_TAG, 'Upload failed:', err);
  }
}
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|---|---|---|
| 始终抛出 Error | 未启用扩展的外部交互权限 | 在扩展设置中启用外部交互权限 |
| CORS 错误 | 目标服务器未允许跨域 | 在服务器端配置 CORS 头 |
| GET 请求带 body 无效 | GET/HEAD 方法忽略 data 参数 | 使用 URL 查询参数传递数据 |
| 使用 `fetch()` 或 `XMLHttpRequest` | 沙箱环境限制 | 必须使用 `eda.sys_ClientUrl.request()` |

## 变体

- **带认证的请求**: 在 `options.headers` 中添加 `Authorization` 头
- **下载文件**: 使用 `response.blob()` 获取文件数据，配合 `sys_FileSystem.saveFile()` 保存
- **URLSearchParams**: 使用 `new URLSearchParams()` 作为 data 发送表单编码数据
