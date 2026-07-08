# 辽科大校园助手 一口气改完方案

> 本文档是对「上次评审」剩余问题的完整修复方案，覆盖云函数、前端页面、工具函数三类改动。按此顺序执行即可。

---

## 一、云函数层

### 1. newsFetch 加缓存 + stale-while-revalidate
**文件**：`cloudfunctions/newsFetch/index.js`

**新增逻辑**：
1. 在 `news` 分支（非 `announcement`）前插入缓存读取逻辑。
2. 新建数据库集合 `news_cache`（无需预创建 schema，直接 `.add()` 即可）。
3. 缓存 TTL 设为 30 分钟（`30 * 60 * 1000`）。
4. 读取缓存：
   - 按 `createTime` 倒序取第一条。
   - 若未过期（`Date.now() - createTime < TTL`），直接返回缓存数据，message 为 `fromCache`。
   - 若已过期，也返回缓存数据（让用户立刻看到内容），message 为 `stale`，同时**不 await** 地触发后台重新抓取并写入缓存。
5. 若无缓存，走原有 `fetchHtml` → `parseNewsList` 流程，抓取成功后 `writeCache`。
6. `writeCache` 逻辑：先清理旧数据（保留最新 1 条，其余 `remove`），再写入新数据。

**关键注意**：
- `writeCache` 用 `try/catch` 包裹，缓存失败不影响主流程。
- 后台刷新时调用 `doFetchNews(0, 999)` 抓全量，避免分页导致缓存不完整。
- `announcement` 分支不动（公告走数据库，天然有持久化）。

---

### 2. postManage 加数据校验
**文件**：`cloudfunctions/postManage/index.js`

**新增 `sanitizeDoc(raw)` 函数**，在 `add` 和 `update` 的入口校验 `doc`：

| 字段 | 校验规则 |
|------|----------|
| `title` | 必须存在且为 string，trim 后非空，最大 200 字 |
| `summary` | 若为 string，trim 后最大 500 字 |
| `content` | 若为 string，trim 后最大 20000 字 |
| `category` | 只允许 `['通知','更新','活动','维护','其他']`，默认 `'其他'` |
| `source` | 若为 string，trim 后最大 100 字 |
| `isTop` | 必须为 boolean |
| `url` | 若存在且非空，必须以 `http` 或 `/` 开头 |
| `date` | 若存在，必须符合 `YYYY-MM-DD` 正则 |

**改动点**：
- `add` 和 `update` 的 `doc` 不再直接展开，而是先 `sanitizeDoc(doc)`。
- 校验失败抛 Error，由外层 `catch` 返回 `code: -1` 和具体错误信息。
- `update` 时从 `clean` 中剔除 `_id`（防止用户传 `_id` 覆盖）。

---

### 3. dataInit 扩展 markers + exams 初始化
**文件**：`cloudfunctions/dataInit/index.js`

**新增两个数据集合的初始化逻辑**：

```
posts       (已有)
admins      (已有)
swiper      (已有)
daily_sentence (已有)
markers     (新增)
exams       (新增)
```

**markers**：
- 把当前 `src/pages/func/campus/map/index.tsx` 里的 `MARKERS` 数组完整复制到云函数里作为一个常量 `MARKERS_DATA`。
- 初始化时检查 `db.collection('markers').count()`，若 `total === 0` 则 `batchAdd` 写入全部 84 条坐标数据。
- 数据结构：`{ id, title, latitude, longitude, category }`（`category` 可选，为后续分类预留）。

**exams**：
- 新建常量 `EXAMS_DATA`：
  ```js
  [
    { name: '英语四六级(上半年)', month: 6, day: 14 },
    { name: '英语四六级(下半年)', month: 12, day: 13 },
    { name: '全国计算机等级考试', month: 9, day: 21 },
    { name: '考研初试', month: 12, day: 21, note: '具体日期以研招网为准' },
  ]
  ```
- 初始化逻辑同 markers：检查 `exams` 集合是否为空，为空则批量写入。

**返回结果**：在 `results` 中增加 `markers: imported/skipped` 和 `exams: imported/skipped`。

---

### 4. 新建云函数：getMarkers
**新建文件**：`cloudfunctions/getMarkers/index.js`

**职责**：读取 `markers` 集合全部数据返回给前端地图页。

```js
exports.main = async () => {
  try {
    const { data } = await db.collection('markers').orderBy('id', 'asc').get();
    return { code: 0, data: data || [] };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
```

**配套**：`cloudfunctions/getMarkers/package.json` 复制其他云函数的即可。

---

### 5. 新建云函数：getExams
**新建文件**：`cloudfunctions/getExams/index.js`

**职责**：读取 `exams` 集合，前端根据当前日期动态计算具体年份和剩余天数。

```js
exports.main = async () => {
  try {
    const { data } = await db.collection('exams').orderBy('month', 'asc').get();
    return { code: 0, data: data || [] };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
```

---

## 二、前端页面层

### 6. 地图页坐标走云端 + 错误处理
**文件**：`src/pages/func/campus/map/index.tsx`

**改动点**：

1. **移除硬编码 MARKERS**：把 `const MARKERS = [...]` 整段删掉。
2. **云端读取**：在 `useEffect(() => { ... }, [])` 中增加：
   ```js
   Taro.cloud.callFunction({ name: 'getMarkers' }).then((res: any) => {
     if (res.result?.code === 0 && Array.isArray(res.result.data)) {
       const cloudMarkers = res.result.data.map(m => ({
         id: m.id,
         latitude: m.latitude,
         longitude: m.longitude,
         title: m.title,
         iconPath: '/static/marker.png',
         width: 24,
         height: 24,
         label: {
           content: m.title,
           color: '#000000',
           fontSize: 12,
           borderRadius: 4,
           bgColor: '#ffffff',
           padding: 4,
           textAlign: 'center',
         },
       }));
       setMarkers(cloudMarkers);
     }
   }).catch(() => {
     // 云端失败，保持空数组或显示提示
     setMarkers([]);
     setMapErr('地图数据加载失败');
   });
   ```
3. **新增 state**：`const [markers, setMarkers] = useState([]);`
4. **错误处理**：把 `Map` 组件的 `onError={console.log}` 改成：
   ```js
   onError={(e) => {
     console.error('map error', e);
     setMapErr('地图加载异常，请检查定位权限');
   }}
   ```
5. **UI 层**：在 `Layout` 上方加一个错误提示区域（`mapErr` 非空时显示红色提示 + "重试" 按钮）。
6. **定位失败时引导用户**：`Taro.getLocation` 的 `fail` 回调里，除了改 `msg` 和 `dot`，还要检测 `errMsg` 是否包含 `"auth deny"` 或 `"auth denied"`，是的话提示 "请在设置中开启定位权限"。

---

### 7. 天气组件 setInterval 修复
**文件**：`src/components/weather/index.tsx`

**问题**：
- `setInterval(loadWeather, 60000)` 在小程序切后台不会暂停，切回前台可能累积多个定时器。
- 缓存存在时，请求回来的新数据不会更新 UI。

**改动点**：

1. **用页面可见性控制刷新**：
   ```js
   useEffect(() => {
     loadWeather();
     const timer = setInterval(() => {
       // 小程序没有 document.visibilityState，用 getApp().globalData 或简单处理
       loadWeather();
     }, 60 * 1000);
     return () => clearInterval(timer);
   }, []);
   ```
   目前先保持 `setInterval`，但**修复数据更新逻辑**（见下）。

2. **修复 applyData 逻辑**：`requestWeatherData` 在 `model.ts` 中返回数据后，无论是否有缓存都应更新 UI。
   - 在 `weather/index.tsx:45-49`：
     ```js
     requestWeatherData().then(res => {
       if (res) {
         applyData(res);
         setWeatherCache(res); // 即使 cachedWeather 存在，也更新缓存为新数据
       }
     });
     ```
   - 在 `model.ts` 的 `requestWeatherData` 中：当前逻辑是 `if (cached) resolve(cached);` 然后发起请求，请求回来后再 `if (!cached) resolve(...)`。这导致有缓存时请求回来的数据被丢弃。
   - **改为 Promise 方式返回最新数据**：让 `requestWeatherData` 始终返回云端最新数据（或 fallback），不要因为有缓存就不 resolve 第二次。
   - 最简改法：在 `weather/index.tsx` 中，`loadWeather` 函数里始终调用 `requestWeatherData`，拿到结果就 `applyData` + `setWeatherCache`。`model.ts` 里的本地缓存逻辑可以保留（作为云函数之外的兜底），但组件层以云端返回为准。

3. **建议**：如果天气数据不需要秒级更新，干脆去掉 `setInterval`，只在组件 mount 时加载一次。用户下拉刷新或切换页面时自然重新加载。小程序定时器在后台的运行行为不可控，能不用就不用。

---

### 8. 倒计时考试日期走云端
**文件**：`src/pages/plus/tools/countdown/index.tsx`

**改动点**：

1. **移除硬编码 EXAMS**：删掉 `const EXAMS = [...]`。
2. **云端读取**：在 `useLoad` 中：
   ```js
   Taro.cloud.callFunction({ name: 'getExams' }).then((res: any) => {
     if (res.result?.code === 0 && Array.isArray(res.result.data)) {
       const list = res.result.data.map(exam => ({
         name: exam.name,
         date: getExamDate(exam.month, exam.day),
       }));
       setExams(list);
     }
   }).catch(() => {
     // fallback: 保持空数组或硬编码兜底
     setExams([]);
   });
   ```
3. **新增 state**：`const [exams, setExams] = useState<Exam[]>([]);`
4. **四六级日期修正**：
   - `getExamDate(6, 14)` 只算了上半年，下半年（12 月）没算。
   - 云端 `exams` 集合里写两条：`英语四六级(上半年)` 和 `英语四六级(下半年)`，各带 `month/day`。
   - 前端 `getExamDate` 逻辑不变（自动跨到明年）。
5. **考研日期**：云端存 `month: 12, day: 21, note: '具体以研招网为准'`，前端计算时加上 `note` 显示。

---

### 9. 所有列表改用稳定 key
**涉及文件**：
- `src/pages/plus/info/news/index.tsx`
- `src/pages/plus/info/announcements/index.tsx`
- `src/pages/plus/info/life/index.tsx`
- `src/pages/plus/info/websites/index.tsx`（网站列表没有 map，但有 category 遍历，不影响）

**具体改法**：

| 文件 | 当前 key | 改为 |
|------|----------|------|
| `news/index.tsx:129` | `key={idx}` | `key={item.url}`（url 是唯一的） |
| `announcements/index.tsx:89` | `key={idx}` | `key={item._id || item.title}`（公告有 `_id`，新闻没有） |
| `life/index.tsx:137` | `key={idx}` | `key={item.name}`（name 在当前数据里是唯一的） |

**注意**：如果数据里真的可能出现重复 key（比如新闻列表里 url 重复），可以拼接：`key={item.url + '-' + idx}`。优先用业务唯一字段，次选 `业务字段 + index`。

---

## 三、工具函数层

### 10. Cache 工具 key 统一前缀
**文件**：`src/utils/cache.ts`

**改动点**：

1. 在 `set` 和 `get` 中给 key 加前缀：
   ```js
   const PREFIX = 'USTL:';
   const fullKey = PREFIX + key;
   ```
2. 所有调用方不用改（因为接口不变，内部自动加前缀）。
3. **升级兼容**：读取时先尝试 `PREFIX + key`，若不存在再尝试旧 key（无前缀），读取成功后迁移到新 key 并删除旧 key。这样不会丢失现有用户的数据。

**迁移代码思路**：
```js
get: (key: string): any | null => {
  const fullKey = PREFIX + key;
  let cached = tryRead(fullKey);
  if (cached) return cached;
  // 兼容旧 key
  cached = tryRead(key);
  if (cached) {
    tryRead.set(fullKey, cached); // 迁移
    Taro.removeStorageSync(key);   // 清理旧 key
    return cached;
  }
  return null;
}
```

---

### 11. 网址导航：复制后增加"用 web-view 打开"选项
**文件**：`src/pages/plus/info/websites/index.tsx`

**当前问题**：点击卡片只复制 URL，用户需要手动切到浏览器粘贴。

**改法**：点击后弹出 ActionSheet 或两个按钮：
1. "复制链接"（保持现有行为）
2. "在小程序内打开"（调用 `Nav.webview(item.url)`，前提是该域名已配置业务域名）

如果业务域名没配置，第二条可以不要，或者提示 "请复制后到浏览器打开"。

最简改法：把 `handleCopy` 改成 `handleClick`，显示 `Taro.showActionSheet`：
```js
Taro.showActionSheet({
  itemList: ['复制链接', '在小程序内打开'],
  success: (res) => {
    if (res.tapIndex === 0) { /* 复制 */ }
    if (res.tapIndex === 1) { Nav.webview(item.url); }
  }
});
```

---

## 四、部署顺序建议

1. **先改云函数**（不依赖前端）：
   - dataInit 扩展 → 部署后执行一次初始化
   - 新建 getMarkers / getExams → 部署
   - newsFetch 缓存 → 部署
   - postManage 校验 → 部署

2. **再改前端**（依赖云函数已部署）：
   - map 页改云端读取
   - countdown 页改云端读取
   - weather setInterval 修复
   - 列表 key 修复
   - cache key 前缀
   - 网址导航交互优化

3. **最后**：本地构建 `npm run dev:wx` 验证，然后上传代码到微信开发者工具真机测试。

---

## 五、数据库集合清单（需在云开发控制台确认）

| 集合名 | 用途 | 是否需预创建 |
|--------|------|-------------|
| `posts` | 公告、置顶文章 | 已有 |
| `admins` | 管理员 openid | 已有 |
| `swiper` | 首页轮播图 | 已有 |
| `daily_sentence` | 每日金句 | 已有 |
| `weather` | 天气缓存 | 已有（weather 云函数在用） |
| `news_cache` | 新闻抓取缓存 | **新增** |
| `markers` | 地图坐标 | **新增** |
| `exams` | 考试日期 | **新增** |

前 5 个已有，后 3 个需在云开发控制台「数据库」中创建空集合，或让 `dataInit` 云函数自动创建（首次写入时会自动创建集合）。
