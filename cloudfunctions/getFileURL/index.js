const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { fileID } = event;
  if (!fileID) return { code: -1, msg: 'fileID 不能为空' };

  try {
    const res = await cloud.getTempFileURL({
      fileList: [fileID],
    });
    const url = res.fileList[0]?.tempFileURL;
    if (url) {
      return { code: 0, data: url };
    }
    return { code: -1, msg: res.fileList[0]?.errMsg || '获取失败' };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
