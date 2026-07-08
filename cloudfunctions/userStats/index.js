const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

async function checkAdmin(openid) {
  const { data } = await db.collection('admins')
    .where({ openid })
    .limit(1)
    .get();
  return data && data.length > 0;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr, offsetDays) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function track(openid) {
  const date = getTodayKey();
  const { data } = await db.collection('user_visits')
    .where({ openid, date })
    .limit(1)
    .get();
  if (data.length === 0) {
    await db.collection('user_visits').add({
      data: {
        openid,
        date,
        visitTime: Date.now(),
        createTime: db.serverDate(),
      },
    });
  }
  return { code: 0 };
}

async function pageView(openid, page) {
  const date = getTodayKey();
  await db.collection('page_views').add({
    data: {
      openid,
      page,
      date,
      createTime: db.serverDate(),
    },
  });
  return { code: 0 };
}

async function stats(openid) {
  const isAdmin = await checkAdmin(openid);
  if (!isAdmin) return { code: 403, message: '无权限' };

  const today = getTodayKey();
  const weekAgo = getDateKey(-6);
  const monthAgo = getDateKey(-29);

  // 总用户数
  const { total: totalUsers } = await db.collection('user_visits')
    .where({ _id: _.exists(true) })
    .count();

  // 日活
  const { total: dau } = await db.collection('user_visits')
    .where({ date: today })
    .count();

  // 周活
  const { total: wau } = await db.collection('user_visits')
    .where({ date: _.gte(weekAgo) })
    .count();

  // 月活
  const { total: mau } = await db.collection('user_visits')
    .where({ date: _.gte(monthAgo) })
    .count();

  return {
    code: 0,
    data: { totalUsers, dau, wau, mau, date: today },
  };
}

async function pageStats(openid) {
  const isAdmin = await checkAdmin(openid);
  if (!isAdmin) return { code: 403, message: '无权限' };

  const today = getTodayKey();
  const { data } = await db.collection('page_views')
    .where({ date: today })
    .get();

  const map = new Map();
  data.forEach(item => {
    const entry = map.get(item.page) || { page: item.page, pv: 0, uvSet: new Set() };
    entry.pv += 1;
    entry.uvSet.add(item.openid);
    map.set(item.page, entry);
  });

  const list = Array.from(map.values())
    .map(item => ({ page: item.page, pv: item.pv, uv: item.uvSet.size }))
    .sort((a, b) => b.pv - a.pv);

  return { code: 0, data: list };
}

async function retention(openid, baseDate) {
  const isAdmin = await checkAdmin(openid);
  if (!isAdmin) return { code: 403, message: '无权限' };

  const date = baseDate || getTodayKey();
  const baseUsers = await db.collection('user_visits')
    .where({ date })
    .get();
  const baseOpenids = baseUsers.data.map(item => item.openid);
  if (baseOpenids.length === 0) {
    return { code: 0, data: { baseDate: date, retention: { 1: 0, 3: 0, 7: 0 } } };
  }

  const result = {};
  for (const days of [1, 3, 7]) {
    const targetDate = addDays(date, days);
    const { total } = await db.collection('user_visits')
      .where({
        date: targetDate,
        openid: _.in(baseOpenids),
      })
      .count();
    result[days] = Number((total / baseOpenids.length * 100).toFixed(2));
  }

  return { code: 0, data: { baseDate: date, retention: result } };
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { action, page, baseDate } = event;

  try {
    if (action === 'track') return await track(OPENID);
    if (action === 'pageView') return await pageView(OPENID, page);
    if (action === 'stats') return await stats(OPENID);
    if (action === 'pageStats') return await pageStats(OPENID);
    if (action === 'retention') return await retention(OPENID, baseDate);
    return { code: -1, message: '未知操作' };
  } catch (err) {
    return { code: -1, message: String(err) };
  }
};
