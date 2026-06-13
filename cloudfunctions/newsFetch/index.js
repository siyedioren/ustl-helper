const cloud = require('wx-server-sdk');
const https = require('https');
const { URL } = require('url');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTION = 'posts';

const BASE_URL = 'https://www.ustl.edu.cn/news/';

// 栏目 ID -> 来源名称
const CHANNEL_MAP = {
  '1002': '热点新闻',
  '1003': '综合消息',
  '1004': '深度报道',
  '1005': '院系速递',
};

const FALLBACK_POSTS = [
  { title: "【示例】教务处新闻标题1", source: "热点新闻", date: "2025-06-10", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/1", isTop: false },
  { title: "【示例】团委活动通知", source: "综合消息", date: "2025-06-09", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/2", isTop: false },
];

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

exports.main = async (event) => {
  try {
    const skip = event.skip || 0;
    const limit = event.limit || 50;

    // 尝试从官网抓取
    const html = await fetchHtml(BASE_URL);
    const fetched = parseNewsList(html);

    if (fetched.length > 0) {
      // 写入数据库作为缓存（首页聚合/旧逻辑可用）
      try {
        const { data: existing } = await db.collection(COLLECTION).limit(1).get();
        if (existing.length === 0) {
          // 首次写入，批量添加
          const batch = fetched.slice(0, 50).map(item => ({
            data: { ...item, createTime: Date.now() },
          }));
          for (const item of batch) {
            await db.collection(COLLECTION).add(item);
          }
        }
      } catch (dbErr) {
        // 数据库写入失败不影响返回
        console.log('db cache error:', dbErr);
      }

      const sliced = fetched.slice(skip, skip + limit);
      return {
        code: 0,
        data: sliced,
        total: fetched.length,
        hasMore: skip + sliced.length < fetched.length,
        message: 'success',
      };
    }

    // fallback
    const sliced = FALLBACK_POSTS.slice(skip, skip + limit);
    return { code: 0, data: sliced, total: FALLBACK_POSTS.length, hasMore: skip + sliced.length < FALLBACK_POSTS.length, message: 'fallback' };
  } catch (err) {
    // 出错时返回 fallback 并记录错误
    const skip = event.skip || 0;
    const limit = event.limit || 50;
    const sliced = FALLBACK_POSTS.slice(skip, skip + limit);
    return { code: 0, data: sliced, total: FALLBACK_POSTS.length, hasMore: skip + sliced.length < FALLBACK_POSTS.length, message: String(err) };
  }
};
