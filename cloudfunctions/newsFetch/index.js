const cloud = require('wx-server-sdk');
const https = require('https');
const { URL } = require('url');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTION = 'posts';
const CACHE_COLLECTION = 'news_cache';
const CACHE_URL = 'https://www.ustl.edu.cn/news/';
const CACHE_MS = 30 * 60 * 1000; // 30 分钟

const BASE_URL = 'https://www.ustl.edu.cn/news/';

// 栏目 ID -> 来源名称
const CHANNEL_MAP = {
  '1002': '热点新闻',
  '1003': '综合消息',
  '1004': '深度报道',
  '1005': '院系速递',
};

const FALLBACK_POSTS = []; // 抓取失败时不再返回示例数据



/** 解码 HTML 实体 */
function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…');
}

/** 去除 HTML 标签 */
function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

/** 请求 HTML */
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchHtml(new URL(res.headers.location, url).href).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          resolve(Buffer.concat(chunks).toString('utf8'));
        } catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

/** 解析首页新闻列表 */
function parseNewsList(html) {
  const list = [];
  // 匹配：<li><a href="info/1002/12821.htm" title="完整标题" ...>标题</a><span>日期</span></li>
  const regex = /<li>\s*<a\s+href=["'](info\/(\d{4})\/(\d+)\.htm)["']\s+title=["']([^"']+)["'][^>]*target=["']_blank["'][^>]*>([\s\S]*?)<\/a>\s*<span>([^<]+)<\/span>\s*<\/li>/gi;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const [, relativePath, channelId, id, fullTitle, , date] = match;
    const source = CHANNEL_MAP[channelId] || '校园新闻';
    const title = decodeEntities(stripTags(fullTitle).trim());
    const url = new URL(relativePath, BASE_URL).href;

    list.push({
      title,
      source,
      date: date.trim(),
      summary: '',
      url,
      isTop: false,
    });
  }

  return list;
}

/** 抓取并解析新闻 */
async function fetchAndParseNews() {
  const html = await fetchHtml(BASE_URL);
  return parseNewsList(html);
}

/** 读取缓存 */
async function readCache() {
  try {
    const { data } = await db.collection(CACHE_COLLECTION)
      .where({ url: CACHE_URL })
      .limit(1)
      .get();
    if (data && data.length > 0) return data[0];
  } catch (e) {
    console.log('read cache error:', e);
  }
  return null;
}

/** 写入缓存 */
async function writeCache(list) {
  try {
    const now = Date.now();
    const cache = await readCache();
    const doc = {
      url: CACHE_URL,
      data: list,
      expireAt: now + CACHE_MS,
      updateTime: now,
    };
    if (cache && cache._id) {
      await db.collection(CACHE_COLLECTION).doc(cache._id).update({
        data: {
          data: list,
          expireAt: now + CACHE_MS,
          updateTime: now,
        },
      });
    } else {
      await db.collection(CACHE_COLLECTION).add({ data: doc });
    }
  } catch (e) {
    console.log('write cache error:', e);
  }
}

/** 带缓存的新闻获取 */
async function getNewsWithCache() {
  const cache = await readCache();
  const now = Date.now();

  // 缓存未过期，直接返回
  if (cache && cache.expireAt && cache.expireAt > now) {
    return {
      code: 0,
      data: cache.data || [],
      total: (cache.data || []).length,
      hasMore: false,
      message: 'success',
      fromCache: true,
    };
  }

  // 缓存已过期或不存在：如果有旧缓存，先返回旧数据，后台静默刷新
  if (cache && cache.data && cache.data.length > 0) {
    // 不 await，让云函数在返回后继续执行刷新
    fetchAndParseNews().then(list => {
      if (list.length > 0) writeCache(list);
    }).catch(err => console.log('background refresh error:', err));

    return {
      code: 0,
      data: cache.data,
      total: cache.data.length,
      hasMore: false,
      message: 'success',
      fromCache: true,
      stale: true,
    };
  }

  // 没有缓存，同步抓取
  const list = await fetchAndParseNews();
  if (list.length > 0) {
    await writeCache(list);
    return {
      code: 0,
      data: list,
      total: list.length,
      hasMore: false,
      message: 'success',
      fromCache: false,
    };
  }

  return {
    code: 0,
    data: [],
    total: 0,
    hasMore: false,
    message: 'empty',
  };
}

exports.main = async (event) => {
  try {
    const skip = event.skip || 0;
    const limit = event.limit || 50;
    const type = event.type || 'news';

    // ========== 公告：读取数据库中用户自己维护的公告 ==========
    if (type === 'announcement') {
      try {
        const category = event.category || '全部';
        let where = { type: 'announcement' };
        if (category !== '全部') {
          where.category = category;
        }

        const { data } = await db.collection(COLLECTION)
          .where(where)
          .orderBy('isTop', 'desc')
          .orderBy('date', 'desc')
          .skip(skip)
          .limit(limit)
          .get();

        const { total } = await db.collection(COLLECTION).where(where).count();

        if (data && data.length > 0) {
          // 保留 _id 供管理后台使用，同时返回业务字段
          const clean = data.map(item => ({
            _id: item._id,
            title: item.title,
            source: item.source,
            category: item.category || '其他',
            isTop: item.isTop || false,
            date: item.date,
            summary: item.summary || '',
            content: item.content || '',
            url: item.url,
          }));
          return { code: 0, data: clean, total, hasMore: skip + clean.length < total, message: 'success' };
        }
      } catch (dbErr) {
        console.log('announcement db error:', dbErr);
      }

      // 数据库无公告时返回空列表
      return { code: 0, data: [], total: 0, hasMore: false, message: 'empty' };
    }

    // ========== 新闻：从学校官网抓取（带缓存） ==========
    const result = await getNewsWithCache();
    const data = result.data || [];
    const sliced = data.slice(skip, skip + limit);
    return {
      code: 0,
      data: sliced,
      total: data.length,
      hasMore: skip + sliced.length < data.length,
      message: result.message,
      fromCache: result.fromCache,
      stale: result.stale,
    };
  } catch (err) {
    // 出错时返回空列表并记录错误
    const type = event.type || 'news';
    if (type === 'announcement') {
      return { code: 0, data: [], total: 0, hasMore: false, message: String(err) };
    }
    const skip = event.skip || 0;
    const limit = event.limit || 50;
    const sliced = FALLBACK_POSTS.slice(skip, skip + limit);
    return { code: 0, data: sliced, total: FALLBACK_POSTS.length, hasMore: skip + sliced.length < FALLBACK_POSTS.length, message: String(err) };
  }
};
