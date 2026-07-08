const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

const VALID_CATEGORIES = ['通知', '更新', '活动', '维护', '其他'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

async function checkAdmin(openid) {
  const { data } = await db.collection('admins')
    .where({ openid })
    .limit(1)
    .get();
  return data && data.length > 0;
}

function validateDoc(doc) {
  if (!doc || typeof doc !== 'object') {
    return '公告数据不能为空';
  }

  const { title, source, category, date, summary, content, url } = doc;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return '标题不能为空';
  }
  if (title.trim().length > 100) {
    return '标题不能超过 100 个字符';
  }

  if (!source || typeof source !== 'string' || source.trim().length === 0) {
    return '来源不能为空';
  }
  if (source.trim().length > 50) {
    return '来源不能超过 50 个字符';
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return '分类必须是：通知、更新、活动、维护、其他';
  }

  if (!date || !DATE_REGEX.test(date)) {
    return '日期格式必须是 YYYY-MM-DD';
  }

  if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
    return '摘要不能为空';
  }
  if (summary.trim().length > 500) {
    return '摘要不能超过 500 个字符';
  }

  if (content && typeof content === 'string' && content.length > 5000) {
    return '正文不能超过 5000 个字符';
  }

  if (url && typeof url === 'string' && url.trim().length > 0) {
    const trimmed = url.trim();
    const isMiniPath = trimmed.startsWith('/');
    const isHttp = /^https?:\/\//.test(trimmed);
    if (!isMiniPath && !isHttp) {
      return '链接必须是小程序页面路径（以 / 开头）或 http/https 网址';
    }
    if (trimmed.length > 500) {
      return '链接不能超过 500 个字符';
    }
  }

  return null;
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { action, id, doc } = event;

  try {
    const isAdmin = await checkAdmin(OPENID);
    if (!isAdmin) {
      return { code: 403, message: '无权限' };
    }

    if (action === 'add') {
      const error = validateDoc(doc);
      if (error) return { code: -1, message: error };

      const data = {
        ...doc,
        title: doc.title.trim(),
        source: doc.source.trim(),
        summary: doc.summary.trim(),
        type: doc.type || 'announcement',
        isTop: !!doc.isTop,
        date: doc.date || new Date().toISOString().slice(0, 10),
        createTime: db.serverDate(),
      };
      const res = await db.collection('posts').add({ data });
      return { code: 0, data: { _id: res._id }, message: 'success' };
    }

    if (action === 'update') {
      if (!id) return { code: -1, message: '缺少id' };
      const error = validateDoc(doc);
      if (error) return { code: -1, message: error };

      const data = { ...doc };
      delete data._id;
      data.title = data.title.trim();
      data.source = data.source.trim();
      data.summary = data.summary.trim();
      data.updateTime = db.serverDate();
      await db.collection('posts').doc(id).update({ data });
      return { code: 0, message: 'success' };
    }

    if (action === 'delete') {
      if (!id) return { code: -1, message: '缺少id' };
      await db.collection('posts').doc(id).remove();
      return { code: 0, message: 'success' };
    }

    if (action === 'get') {
      if (!id) return { code: -1, message: '缺少id' };
      const { data } = await db.collection('posts').doc(id).get();
      return { code: 0, data, message: 'success' };
    }

    return { code: -1, message: '未知操作' };
  } catch (err) {
    return { code: -1, message: String(err) };
  }
};
