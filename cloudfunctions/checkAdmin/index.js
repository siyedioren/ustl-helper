const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  try {
    const { data } = await db.collection('admins')
      .where({ openid: OPENID })
      .limit(1)
      .get();

    return {
      code: 0,
      isAdmin: data && data.length > 0,
      openid: OPENID,
    };
  } catch (err) {
    return {
      code: -1,
      isAdmin: false,
      message: String(err),
    };
  }
};
