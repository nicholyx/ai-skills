# SYS\_PanelControl class

系统 / 面板控制类

## 签名

```typescript
declare class SYS_PanelControl
```

## 方法

| 方法名                                                        | 修饰符 | 描述          |
| ---------------------------------------------------------- | --- | ----------- |
| [closeBottomPanel()](./SYS_PanelControl.md)                |     | 关闭底部面板      |
| [closeLeftPanel()](./SYS_PanelControl.md)                  |     | 关闭左侧面板      |
| [closeRightPanel()](./SYS_PanelControl.md)                 |     | 关闭右侧面板      |
| [isBottomPanelLocked()](./SYS_PanelControl.md)             |     | 查询底部面板是否已锁定 |
| [isLeftPanelLocked()](./SYS_PanelControl.md)               |     | 查询左侧面板是否已锁定 |
| [isRightPanelLocked()](./SYS_PanelControl.md)              |     | 查询右侧面板是否已锁定 |
| [openBottomPanel(tab)](./SYS_PanelControl.md)              |     | 打开底部面板      |
| [openLeftPanel(tab)](./SYS_PanelControl.md)                |     | 打开左侧面板      |
| [openRightPanel(tab)](./SYS_PanelControl.md)               |     | 打开右侧面板      |
| [toggleBottomPanelLockState(state)](./SYS_PanelControl.md) |     | 切换底部面板锁定状态  |
| [toggleLeftPanelLockState(state)](./SYS_PanelControl.md)   |     | 切换左侧面板锁定状态  |
| [toggleRightPanelLockState(state)](./SYS_PanelControl.md)  |     | 切换右侧面板锁定状态  |

---

## 方法详情

### closebottompanel

# SYS\_PanelControl.closeBottomPanel() method

关闭底部面板

## 签名

```typescript
closeBottomPanel(): void;
```


## 返回值

void

### closeleftpanel

# SYS\_PanelControl.closeLeftPanel() method

关闭左侧面板

## 签名

```typescript
closeLeftPanel(): void;
```


## 返回值

void

### closerightpanel

# SYS\_PanelControl.closeRightPanel() method

关闭右侧面板

## 签名

```typescript
closeRightPanel(): void;
```


## 返回值

void

### isbottompanellocked

# SYS\_PanelControl.isBottomPanelLocked() method

查询底部面板是否已锁定

## 签名

```typescript
isBottomPanelLocked(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

是否已锁定

### isleftpanellocked

# SYS\_PanelControl.isLeftPanelLocked() method

查询左侧面板是否已锁定

## 签名

```typescript
isLeftPanelLocked(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

是否已锁定

### isrightpanellocked

# SYS\_PanelControl.isRightPanelLocked() method

查询右侧面板是否已锁定

## 签名

```typescript
isRightPanelLocked(): Promise<boolean>;
```


## 返回值

Promise&lt;boolean&gt;

是否已锁定

### openbottompanel

# SYS\_PanelControl.openBottomPanel() method

打开底部面板

## 签名

```typescript
openBottomPanel(tab?: ESYS_BottomPanelTab): void;
```

## 参数名

| 参数  | 类型                                                      | 描述                      |
| --- | ------------------------------------------------------- | ----------------------- |
| tab | [ESYS\_BottomPanelTab](../enums/ESYS_BottomPanelTab.md) | _（可选）_ 标签页，如若不指定则不切换标签页 |



## 返回值

void

### openleftpanel

# SYS\_PanelControl.openLeftPanel() method

打开左侧面板

## 签名

```typescript
openLeftPanel(tab?: ESYS_LeftPanelTab): void;
```

## 参数名

| 参数  | 类型                                                  | 描述                      |
| --- | --------------------------------------------------- | ----------------------- |
| tab | [ESYS\_LeftPanelTab](../enums/ESYS_LeftPanelTab.md) | _（可选）_ 标签页，如若不指定则不切换标签页 |



## 返回值

void

### openrightpanel

# SYS\_PanelControl.openRightPanel() method

打开右侧面板

## 签名

```typescript
openRightPanel(tab?: ESYS_RightPanelTab): void;
```

## 参数名

| 参数  | 类型                                                    | 描述                      |
| --- | ----------------------------------------------------- | ----------------------- |
| tab | [ESYS\_RightPanelTab](../enums/ESYS_RightPanelTab.md) | _（可选）_ 标签页，如若不指定则不切换标签页 |



## 返回值

void

### togglebottompanellockstate

# SYS\_PanelControl.toggleBottomPanelLockState() method

切换底部面板锁定状态

## 签名

```typescript
toggleBottomPanelLockState(state?: boolean): void;
```

## 参数名

| 参数    | 类型      | 描述                       |
| ----- | ------- | ------------------------ |
| state | boolean | _（可选）_ 是否锁定，如若不指定则反置当前状态 |



## 返回值

void

### toggleleftpanellockstate

# SYS\_PanelControl.toggleLeftPanelLockState() method

切换左侧面板锁定状态

## 签名

```typescript
toggleLeftPanelLockState(state?: boolean): void;
```

## 参数名

| 参数    | 类型      | 描述                       |
| ----- | ------- | ------------------------ |
| state | boolean | _（可选）_ 是否锁定，如若不指定则反置当前状态 |



## 返回值

void

### togglerightpanellockstate

# SYS\_PanelControl.toggleRightPanelLockState() method

切换右侧面板锁定状态

## 签名

```typescript
toggleRightPanelLockState(state?: boolean): void;
```

## 参数名

| 参数    | 类型      | 描述                       |
| ----- | ------- | ------------------------ |
| state | boolean | _（可选）_ 是否锁定，如若不指定则反置当前状态 |



## 返回值

void
