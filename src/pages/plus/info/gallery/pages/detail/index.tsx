import "./index.scss";

import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

interface Photo {
  _id?: string;
  image: string;
  caption?: string;
  author?: string;
  createTime?: any;
}

export default function GalleryDetail() {
  const { data } = Taro.useRouter().params;
  let photo: Photo | null = null;
  try {
    if (data) photo = JSON.parse(decodeURIComponent(data));
  } catch (e) {
    photo = null;
  }

  if (!photo) {
    return (
      <View className="detail-page">
        <Text className="detail-empty">照片信息不存在</Text>
      </View>
    );
  }

  const dateStr = photo.createTime
    ? new Date(photo.createTime).toLocaleDateString("zh-CN")
    : "";

  return (
    <View className="detail-page">
      <Image className="detail-image" src={photo.image} mode="widthFix" />
      <View className="detail-info">
        {photo.caption && <Text className="detail-caption">{photo.caption}</Text>}
        <View className="detail-meta">
          {photo.author && <Text className="detail-author">投稿：{photo.author}</Text>}
          {dateStr && <Text className="detail-date">{dateStr}</Text>}
        </View>
      </View>
    </View>
  );
}
