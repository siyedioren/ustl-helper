const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const { data } = await db.collection('exams')
      .orderBy('sort', 'asc')
      .get();

    return {
      code: 0,
      data: data || [],
      message: 'success',
    };
  } catch (err) {
    return {
      code: -1,
      data: [],
      message: String(err),
    };
  }
};
