## 问题 1：LocalStorage 双重前缀 — 过期缓存永远删不掉

### 现象
`storage.ts` 的 `get` / `getPromise` 方法里：
1. 先调用 `convertKey(originKey)` 把 key 变成 `STORAGE:xxx`
2. 发现缓存过期，想删掉，于是调用 `this.removePromise(key)`，把**已经带前缀**的 key 传进去
3. `removePromise` 开头又做了一次 `convertKey(originKey)`，结果变成 `STORAGE:STORAGE:xxx`
4. 删除的是个不存在的 key，真正的过期缓存永远留在本地

### 影响
小程序本地存储不断堆积过期垃圾（天气缓存、每日金句缓存、新闻缓存等），最终可能触及 10MB 上限。

### 修复方案（最小改动）

**改 `get` 方法**：
```js
// 改前（错误）
const origin = convertToOrigin<T>(str);
if (origin === null) this.removePromise(key);  // key 已经是 STORAGE:xxx

// 改后（正确）
const origin = convertToOrigin<T>(str);
if (origin === null) this.removePromise(originKey);  // 传原始 key，让 removePromise 自己加前缀
```

**改 `getPromise` 方法**：
```js
// 改前（错误）
if (origin === null) this.removePromise(key);  // key 已经是 STORAGE:xxx

// 改后（正确）
if (origin === null) this.removePromise(originKey);  // 传原始 key
```

### 验证方式
在 `removePromise` 里加一行 `console.log('remove:', key)`，然后运行：
1. `LocalStorage.set('test', 'value', new Date(Date.now() - 1000))`  // 写入一个已过期缓存
2. `LocalStorage.get('test')`  // 触发过期检测和删除
3. 观察控制台输出的 key 应该是 `STORAGE:test`（改前会输出 `STORAGE:STORAGE:test`）

---

## 问题 2：图书馆云函数 https 请求可能挂死

### 现象
`librarySearch` 和 `libraryDetail` 两个云函数用 `https.request` / `https.get` 发送请求，但**没有设置 timeout 事件**。如果图书馆服务器响应卡住或网络抖动，请求会挂到云函数自身超时为止，前端用户一直转圈，没有"请求超时"的友好提示。

### 对比
`newsFetch` 云函数里写对了：
```js
req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
```
但图书馆两个云函数漏掉了这个。

### 修复方案

**librarySearch/index.js**：在 `req.on('error', reject)` 后面加一行
```js
req.on('error', reject);
req.on('timeout', () => { req.destroy(); reject(new Error('请求超时，请稍后重试')); });
req.write(postData);
req.end();
```

**libraryDetail/index.js**：在 `.on('error', reject)` 后面加
```js
https.get(`${DETAIL_BASE}?${id}`, (res) => { ... })
  .on('error', reject)
  .on('timeout', () => { req.destroy(); reject(new Error('请求超时')); });
```

> 注意 `libraryDetail` 用的是 `https.get`，返回的是 `ClientRequest` 对象，可以链式 `.on('timeout', ...)`。

### 前端配合（可选）
现在图书馆的 fallback 已经改成了 `code: 0 + 空数据 + 友好提示`。如果加了超时，reject 的 error 会被 catch 住，同样返回 `code: 0` 和 `msg: '请求超时，请稍后重试'`，前端不会白屏。

---

## 部署顺序

1. 先改 `storage.ts`（前端），本地构建验证
2. 再改两个图书馆云函数，部署到云端
3. 两者互不依赖，可以并行