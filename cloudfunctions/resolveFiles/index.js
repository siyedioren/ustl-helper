const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const list = event.list || [];
  if (list.length === 0) {
    return { code: 0, data: [] };
  }

  try {
    const res = await cloud.getTempFileURL({ fileList: list });
    const urls = res.fileList.map((item) => {
      // 只有解析成功才返回 URL，否则返回空字符串，前端会 fallback 到默认图
      if (item.status === 'ok' || item.status === 'success' || item.tempFileURL) {
        return item.tempFileURL || '';
      }
      return '';
    });
    return { code: 0, data: urls };
  } catch (err) {
    return { code: -1, message: String(err) };
  }
};
