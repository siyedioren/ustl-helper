const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  return {
    code: 0,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
  };
};
