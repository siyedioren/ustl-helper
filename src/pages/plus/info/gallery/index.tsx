import "./index.scss";

import { Button, Image, Input, Text, Textarea, View } from "@tarojs/components";
import Taro, { useLoad, useReachBottom } from "@tarojs/taro";
import { useState } from "react";

import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";

interface Photo {
  _id?: string;
  image: string;
  caption?: string;
  author?: string;
  status?: string;
  createTime?: any;
}

export default function GalleryIndex() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [tempImage, setTempImage] = useState("");
  const [caption, setCaption] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPhotos = (skip = 0) => {
    if (loading) return;
    setLoading(true);
    Taro.cloud
      .callFunction({ name: "photoManage", data: { action: "listApproved", skip, limit: 12 } })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0 && Array.isArray(result.data)) {
          const data = result.data;
          if (skip === 0) {
            setPhotos(data);
          } else {
            setPhotos((prev) => [...prev, ...data]);
          }
          setHasMore(data.length === 12);
        }
      })
      .catch(() => Toast.info("加载失败"))
      .finally(() => setLoading(false));
  };

  useLoad(() => {
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "info/gallery" } }).catch(() => {});
    fetchPhotos(0);
    Taro.cloud.callFunction({ name: "checkAdmin" })
      .then((res: any) => {
        if (res.result && res.result.isAdmin) setIsAdmin(true);
      })
      .catch(() => {});
  });

  useReachBottom(() => {
    if (hasMore && !loading) fetchPhotos(photos.length);
  });

  const MAX_SIZE = 1024 * 1024; // 1MB

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
    })
      .then((res: any) => {
        const file = res.tempFiles && res.tempFiles[0];
        if (file && file.size > MAX_SIZE) {
          Toast.info("图片过大，请选择 1MB 以内的图片");
          return;
        }
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          setTempImage(res.tempFilePaths[0]);
        }
      })
      .catch(() => {});
  };

  const handleSubmit = () => {
    if (!tempImage) {
      Toast.info("请先选择图片");
      return;
    }
    if (!caption.trim()) {
      Toast.info("请填写图片说明");
      return;
    }
    if (!author.trim()) {
      Toast.info("请填写作者昵称");
      return;
    }
    setSubmitting(true);
    const cloudPath = `photos/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
    Taro.cloud
      .uploadFile({ cloudPath, filePath: tempImage })
      .then((uploadRes: any) => {
        return Taro.cloud.callFunction({
          name: "photoManage",
          data: {
            action: "submit",
            image: uploadRes.fileID,
            caption: caption.trim(),
            author: author.trim(),
          },
        });
      })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0) {
          Toast.info("投稿成功，等待审核");
          setShowSubmit(false);
          setTempImage("");
          setCaption("");
          setAuthor("");
        } else {
          Toast.info(result?.message || "投稿失败");
        }
      })
      .catch(() => Toast.info("投稿失败"))
      .finally(() => setSubmitting(false));
  };

  const handleOpenDetail = (photo: Photo) => {
    Nav.to(`/pages/plus/info/gallery/pages/detail/index?data=${encodeURIComponent(JSON.stringify(photo))}`);
  };

  return (
    <View className="gallery-page">
      <View className="gallery-header">
        <View className="gallery-tip">
          <Text>分享你镜头里的校园，优秀作品将登上首页轮播</Text>
        </View>
        <View className="gallery-actions">
          <Button className="submit-btn" type="primary" size="mini" onClick={() => setShowSubmit(true)}>
            我要投稿
          </Button>
          {isAdmin && (
            <Button className="admin-btn" size="mini" onClick={() => Nav.to("/pages/plus/info/gallery/pages/admin/index")}>
              管理
            </Button>
          )}
        </View>
      </View>

      {photos.length === 0 && !loading && (
        <View className="empty-text">暂无照片，快来投稿吧～</View>
      )}

      <View className="photo-grid">
        {photos.map((photo) => (
          <View key={photo._id} className="photo-card" onClick={() => handleOpenDetail(photo)}>
            <Image className="photo-image" src={photo.image} mode="aspectFill" lazyLoad />
            <View className="photo-info">
              <Text className="photo-caption" numberOfLines={1}>{photo.caption}</Text>
              {photo.author && <Text className="photo-author">投稿：{photo.author}</Text>}
            </View>
          </View>
        ))}
      </View>

      {loading && <View className="loading-text">加载中...</View>}

      {showSubmit && (
        <View className="submit-mask" onClick={() => setShowSubmit(false)}>
          <View className="submit-panel" onClick={(e) => e.stopPropagation()}>
            <View className="submit-title">投稿校园风光</View>
            <View className="upload-tip">单张图片建议 ≤ 1MB</View>
          {!tempImage ? (
              <View className="upload-area" onClick={handleChooseImage}>
                <Text className="upload-plus">+</Text>
                <Text className="upload-hint">点击选择图片</Text>
              </View>
            ) : (
              <Image className="upload-preview" src={tempImage} mode="aspectFill" onClick={handleChooseImage} />
            )}
            <View className="form-item">
              <Text className="form-label">图片说明</Text>
              <Textarea
                className="form-input"
                placeholder="一句话描述这张照片"
                maxlength={50}
                value={caption}
                onInput={(e) => setCaption(e.detail.value)}
              />
            </View>
            <View className="form-item">
              <Text className="form-label">作者昵称</Text>
              <Input
                className="form-input"
                placeholder="你的名字或昵称"
                maxlength={20}
                value={author}
                onInput={(e) => setAuthor(e.detail.value)}
              />
            </View>
            <Button className="submit-confirm" type="primary" loading={submitting} disabled={submitting} onClick={handleSubmit}>
              {submitting ? "投稿中" : "确认投稿"}
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
