const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTION = 'posts';

const FALLBACK_POSTS = [
  { title: "【示例】教务处新闻标题1", source: "教务处", date: "2025-06-10", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/1", isTop: false },
  { title: "【示例】团委活动通知", source: "团委", date: "2025-06-09", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/2", isTop: false },
  { title: "【示例】学院学术讲座", source: "学院", date: "2025-06-08", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/3", isTop: false },
  { title: "【示例】教务处新闻标题2", source: "教务处", date: "2025-06-05", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/4", isTop: false },
  { title: "【示例】团委活动报道", source: "团委", date: "2025-06-03", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/5", isTop: false },
  { title: "【示例】学院比赛结果", source: "学院", date: "2025-06-01", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/6", isTop: false },
  { title: "【示例】教务处新闻标题3", source: "教务处", date: "2025-05-28", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/7", isTop: false },
  { title: "【示例】团委表彰通知", source: "团委", date: "2025-05-25", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/8", isTop: false },
  { title: "【示例】学院安全教育活动", source: "学院", date: "2025-05-20", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/9", isTop: false },
  { title: "【示例】教务处新闻标题4", source: "教务处", date: "2025-05-15", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/10", isTop: false },
];

exports.main = async (event, context) => {
  try {
    const skip = event.skip || 0;
    const limit = event.limit || 50;

    const { data } = await db.collection(COLLECTION)
      .orderBy('date', 'desc')
      .skip(skip)
      .limit(limit)
      .get();

    const { total } = await db.collection(COLLECTION).count();

    if (data && data.length > 0) {
      return { code: 0, data, total, hasMore: skip + data.length < total, message: 'success' };
    }

    const sliced = FALLBACK_POSTS.slice(skip, skip + limit);
    return { code: 0, data: sliced, total: FALLBACK_POSTS.length, hasMore: skip + sliced.length < FALLBACK_POSTS.length, message: 'success (fallback)' };
  } catch (err) {
    const skip = event.skip || 0;
    const limit = event.limit || 50;
    const sliced = FALLBACK_POSTS.slice(skip, skip + limit);
    return { code: 0, data: sliced, total: FALLBACK_POSTS.length, hasMore: skip + sliced.length < FALLBACK_POSTS.length, message: String(err) };
  }
};
