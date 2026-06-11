const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

const POSTS = [
  { title: "【示例】教务处新闻标题1", source: "教务处", date: "2025-06-10", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/1", isTop: false },
  { title: "【示例】团委活动通知", source: "团委", date: "2025-06-09", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/2", isTop: false },
  { title: "【示例】学院学术讲座", source: "学院", date: "2025-06-08", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/3", isTop: false },
  { title: "【示例】教务处新闻标题2", source: "教务处", date: "2025-06-05", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/4", isTop: false },
  { title: "【示例】团委活动报道", source: "团委", date: "2025-06-03", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/5", isTop: false },
  { title: "【示例】学院比赛结果", source: "学院", date: "2025-06-01", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/6", isTop: false },
  { title: "【示例】教务处新闻标题3", source: "教务处", date: "2025-05-28", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/7", isTop: false },
  { title: "【示例】团委表彰通知", source: "团委", date: "2025-05-25", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/8", isTop: false },
  { title: "【示例】学院安全教育活动", source: "学院", date: "2025-05-20", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/9", isTop: false },
  { title: "【示例】教务处新闻标题4", source: "教务处", date: "2025-05-15", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/10", isTop: true },
];

const LIFE_GUIDES = [
  { name: "菜鸟驿站", address: "XXX", hours: "08:30 - 20:30", phone: "XXX-XXXX-XXXX", tags: ["菜鸟", "寄件", "取件"], category: "快递物流", desc: "示例描述" },
  { name: "妈妈驿站", address: "XXX", hours: "09:00 - 21:00", phone: "XXX-XXXX-XXXX", tags: ["圆通", "取件"], category: "快递物流", desc: "示例描述" },
  { name: "顺丰速运", address: "XXX", hours: "08:00 - 19:00", phone: "XXXXX", tags: ["顺丰", "寄件", "上门"], category: "快递物流", desc: "示例描述" },
  { name: "京东快递", address: "XXX", hours: "09:00 - 20:00", tags: ["京东", "取件"], category: "快递物流", desc: "示例描述" },
  { name: "学友打印店", address: "XXX", hours: "07:30 - 22:00", phone: "XXX-XXXX-XXXX", tags: ["打印", "复印", "胶装"], category: "打印复印", desc: "示例描述" },
  { name: "文印室（图书馆内）", address: "XXX", hours: "08:00 - 21:30", tags: ["自助打印", "扫描"], category: "打印复印", desc: "示例描述" },
  { name: "快印图文（校外）", address: "XXX", hours: "08:00 - 22:00", phone: "XXX-XXXX-XXXX", tags: ["大图", "彩印", "名片"], category: "打印复印", desc: "示例描述" },
  { name: "龙源食堂", address: "XXX", hours: "06:30 - 21:00", tags: ["食堂", "早餐", "大众餐"], category: "美食餐饮", desc: "示例描述" },
  { name: "一食堂（学府餐厅）", address: "XXX", hours: "06:30 - 20:30", tags: ["食堂", "快餐"], category: "美食餐饮", desc: "示例描述" },
  { name: "老地方烧烤", address: "XXX", hours: "16:00 - 02:00", phone: "XXX-XXXX-XXXX", tags: ["烧烤", "夜宵", "聚餐"], category: "美食餐饮", desc: "示例描述" },
];

const PHONEBOOK = [
  { name: "教务处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "学生处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "校团委", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "招生就业处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "财务处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "宿管中心", phone: "XXX-XXXX-XXXX", category: "后勤服务", desc: "示例描述" },
  { name: "食堂管理科", phone: "XXX-XXXX-XXXX", category: "后勤服务", desc: "示例描述" },
  { name: "保卫处", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },
  { name: "校医院急诊", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },
  { name: "心理咨询中心", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },
];

const SWIPER = [
  { image: "/static/banner/banner1.png", url: "" },
  { image: "/static/banner/banner2.png", url: "" },
  { image: "/static/banner/banner3.png", url: "" },
];

const DAILY_SENTENCE = [
  { content: "越努力，越幸运。", author: "佚名" },
  { content: "不积跬步，无以至千里。", author: "荀子" },
  { content: "书山有路勤为径，学海无涯苦作舟。", author: "韩愈" },
  { content: "天行健，君子以自强不息。", author: "《周易》" },
  { content: "千里之行，始于足下。", author: "老子" },
  { content: "业精于勤，荒于嬉。", author: "韩愈" },
  { content: "宝剑锋从磨砺出，梅花香自苦寒来。", author: "佚名" },
];

async function hasData(collection) {
  const { total } = await db.collection(collection).count();
  return total > 0;
}

async function batchAdd(collection, docs) {
  const tasks = docs.map((doc) => db.collection(collection).add({ data: doc }));
  await Promise.all(tasks);
}

exports.main = async () => {
  const results = [];

  try {
    if (!(await hasData('posts'))) {
      await batchAdd('posts', POSTS);
      results.push('posts: imported');
    } else {
      results.push('posts: already has data');
    }

    if (!(await hasData('life_guides'))) {
      await batchAdd('life_guides', LIFE_GUIDES);
      results.push('life_guides: imported');
    } else {
      results.push('life_guides: already has data');
    }

    if (!(await hasData('phonebook'))) {
      await batchAdd('phonebook', PHONEBOOK);
      results.push('phonebook: imported');
    } else {
      results.push('phonebook: already has data');
    }

    if (!(await hasData('swiper'))) {
      await batchAdd('swiper', SWIPER);
      results.push('swiper: imported');
    } else {
      results.push('swiper: already has data');
    }

    if (!(await hasData('daily_sentence'))) {
      await batchAdd('daily_sentence', DAILY_SENTENCE);
      results.push('daily_sentence: imported');
    } else {
      results.push('daily_sentence: already has data');
    }

    return { code: 0, data: results, message: 'success' };
  } catch (err) {
    return { code: -1, data: results, message: String(err) };
  }
};
