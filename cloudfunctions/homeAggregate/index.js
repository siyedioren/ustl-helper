const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // 1. 读取轮播图
    const { data: swiperData } = await db.collection('swiper').limit(5).get();
    const swiper = swiperData && swiperData.length > 0 ? swiperData : [];

    // 2. 读取置顶公告
    const { data: postData } = await db.collection('posts')
      .where({ isTop: true })
      .orderBy('date', 'desc')
      .limit(1)
      .get();
    const post = postData && postData.length > 0 ? postData[0].title : '欢迎使用了科小站！';

    // 3. 调用 weather 云函数
    const weatherRes = await cloud.callFunction({
      name: 'weather',
      data: { city: event.city || '鞍山' },
    });
    const weather = weatherRes.result && weatherRes.result.code === 0
      ? weatherRes.result.data
      : null;

    // 4. 读取每日一句
    const { data: sentenceData } = await db.collection('daily_sentence')
      .limit(1)
      .get();
    const sentence = sentenceData && sentenceData.length > 0
      ? sentenceData[0]
      : { content: '越努力，越幸运。', author: '佚名' };

    return {
      code: 0,
      data: {
        swiper,
        post,
        weather,
        sentence,
      },
      message: 'success',
    };
  } catch (err) {
    return {
      code: -1,
      data: null,
      message: String(err),
    };
  }
};
