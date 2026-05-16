# SYS\_LoadingAndProgressBar class

系统 / 加载与进度条类

## 签名

```typescript
declare class SYS_LoadingAndProgressBar
```

## 方法

| 方法名                                                                | 修饰符 | 描述            |
| ------------------------------------------------------------------ | --- | ------------- |
| [destroyLoading()](./SYS_LoadingAndProgressBar.md)                 |     | 销毁无进度加载覆盖     |
| [destroyProgressBar()](./SYS_LoadingAndProgressBar.md)             |     | 销毁进度条         |
| [showLoading()](./SYS_LoadingAndProgressBar.md)                    |     | 显示无进度加载覆盖     |
| [showProgressBar(progress, title)](./SYS_LoadingAndProgressBar.md) |     | 显示进度条或设置进度条进度 |

---

## 方法详情

### destroyloading

# SYS\_LoadingAndProgressBar.destroyLoading() method

销毁无进度加载覆盖

## 签名

```typescript
destroyLoading(): void;
```


## 返回值

void

### destroyprogressbar

# SYS\_LoadingAndProgressBar.destroyProgressBar() method

销毁进度条

## 签名

```typescript
destroyProgressBar(): void;
```


## 返回值

void

### showloading

# SYS\_LoadingAndProgressBar.showLoading() method

显示无进度加载覆盖

## 签名

```typescript
showLoading(): void;
```


## 返回值

void

## 备注

没有进度指示，但会存在与进度条一致的灰色覆盖，阻止用户进一步操作

### showprogressbar

# SYS\_LoadingAndProgressBar.showProgressBar() method

显示进度条或设置进度条进度

## 签名

```typescript
showProgressBar(progress?: number, title?: string): void;
```

## 参数名

| 参数       | 类型     | 描述                      |
| -------- | ------ | ----------------------- |
| progress | number | _（可选）_ 进度值，取值范围 `0-100` |
| title    | string | _（可选）_ 进度条标题            |



## 返回值

void

## 备注

当进度达到 `100` 时，进度条将自动销毁
