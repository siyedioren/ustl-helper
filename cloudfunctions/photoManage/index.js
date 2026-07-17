const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

const COLLECTION = 'photos';

/** 把照片列表中的 cloud:// fileID 解析成临时 HTTPS URL */
async function resolvePhotos(photos) {
  if (!Array.isArray(photos) || photos.length === 0) {
    return photos;
  }
  const fileList = photos
    .map(p => p.image)
    .filter(url => url && url.startsWith('cloud://'));
  let urlMap = {};
  if (fileList.length > 0) {
    try {
      const tempRes = await cloud.getTempFileURL({ fileList });
      (tempRes.fileList || []).forEach(f => {
        urlMap[f.fileID] = f.tempFileURL || '';
      });
    } catch (e) {
      console.log('getTempFileURL error', e);
    }
  }
  return photos.map(p => ({
    ...p,
    image: urlMap[p.image] || p.image,
  })).filter(p => p.image);
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const action = event.action;

  try {
    if (action === 'listApproved') {
      const { skip = 0, limit = 50 } = event;
      const { data } = await db.collection(COLLECTION)
        .where({ status: 'approved' })
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(limit)
        .get();
      return { code: 0, data: await resolvePhotos(data) };
    }

    if (action === 'listPending') {
      const { skip = 0, limit = 50 } = event;
      const { data } = await db.collection(COLLECTION)
        .where({ status: 'pending' })
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(limit)
        .get();
      return { code: 0, data: await resolvePhotos(data) };
    }

    if (action === 'listFeatured') {
      const { limit = 5 } = event;
      const { data } = await db.collection(COLLECTION)
        .where({ status: 'approved', featured: true })
        .orderBy('createTime', 'desc')
        .limit(limit)
        .get();
      return { code: 0, data: await resolvePhotos(data) };
    }

    if (action === 'submit') {
      const { image, caption = '', author = '' } = event;
      if (!image) return { code: -1, message: '缺少图片' };
      const doc = {
        image,
        caption,
        author,
        status: 'pending',
        featured: false,
        openid: OPENID,
        createTime: db.serverDate(),
      };
      await db.collection(COLLECTION).add({ data: doc });
      return { code: 0, message: '投稿成功，等待审核' };
    }

    if (action === 'approve') {
      const { id } = event;
      if (!id) return { code: -1, message: '缺少id' };
      await db.collection(COLLECTION).doc(id).update({
        data: { status: 'approved' },
      });
      return { code: 0, message: '已通过' };
    }

    if (action === 'reject') {
      const { id } = event;
      if (!id) return { code: -1, message: '缺少id' };
      await db.collection(COLLECTION).doc(id).update({
        data: { status: 'rejected' },
      });
      return { code: 0, message: '已拒绝' };
    }

    if (action === 'setFeatured') {
      const { id, featured } = event;
      if (!id) return { code: -1, message: '缺少id' };
      await db.collection(COLLECTION).doc(id).update({
        data: { featured: !!featured },
      });
      return { code: 0, message: '已更新' };
    }

    if (action === 'delete') {
      const { id } = event;
      if (!id) return { code: -1, message: '缺少id' };
      await db.collection(COLLECTION).doc(id).remove();
      return { code: 0, message: '已删除' };
    }

    return { code: -1, message: '未知操作' };
  } catch (err) {
    return { code: -1, message: String(err) };
  }
};
