import "./index.scss";

import { Button, Image, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import { Toast } from "@/utils/toast";

interface Photo {
  _id: string;
  image: string;
  caption?: string;
  author?: string;
  status?: string;
  featured?: boolean;
}

export default function GalleryAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Photo[]>([]);
  const [approved, setApproved] = useState<Photo[]>([]);

  useLoad(() => {
    Taro.cloud
      .callFunction({ name: "checkAdmin" })
      .then((res: any) => {
        if (res.result && res.result.isAdmin) {
          setIsAdmin(true);
          fetchData();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
      });
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      Taro.cloud.callFunction({ name: "photoManage", data: { action: "listPending", limit: 50 } }),
      Taro.cloud.callFunction({ name: "photoManage", data: { action: "listApproved", limit: 50 } }),
    ])
      .then(([pendingRes, approvedRes]: any) => {
        if (pendingRes.result && pendingRes.result.code === 0) {
          setPending(pendingRes.result.data || []);
        }
        if (approvedRes.result && approvedRes.result.code === 0) {
          setApproved(approvedRes.result.data || []);
        }
      })
      .catch(() => Toast.info("加载失败"))
      .finally(() => setLoading(false));
  };

  const callAction = (action: string, data: any, refresh = true) => {
    Taro.cloud
      .callFunction({ name: "photoManage", data: { action, ...data } })
      .then((res: any) => {
        if (res.result && res.result.code === 0) {
          Toast.info(res.result.message || "操作成功");
          if (refresh) fetchData();
        } else {
          Toast.info(res.result?.message || "操作失败");
        }
      })
      .catch(() => Toast.info("操作失败"));
  };

  if (!isAdmin) {
    return (
      <View className="admin-forbidden">
        <Text>{loading ? "校验中..." : "暂无权限"}</Text>
      </View>
    );
  }

  return (
    <View className="admin-page">
      <View className="admin-section">
        <View className="admin-title">待审核 ({pending.length})</View>
        {pending.length === 0 && <Text className="admin-empty">暂无待审核投稿</Text>}
        {pending.map((photo) => (
          <View key={photo._id} className="admin-card">
            <Image className="admin-image" src={photo.image} mode="aspectFill" />
            <View className="admin-info">
              <Text className="admin-caption">{photo.caption}</Text>
              <Text className="admin-author">投稿：{photo.author}</Text>
            </View>
            <View className="admin-actions">
              <Button size="mini" type="primary" onClick={() => callAction("approve", { id: photo._id })}>
                通过
              </Button>
              <Button size="mini" onClick={() => callAction("reject", { id: photo._id })}>
                拒绝
              </Button>
            </View>
          </View>
        ))}
      </View>

      <View className="admin-section">
        <View className="admin-title">已通过 ({approved.length})</View>
        {approved.length === 0 && <Text className="admin-empty">暂无已通过照片</Text>}
        {approved.map((photo) => (
          <View key={photo._id} className="admin-card">
            <Image className="admin-image" src={photo.image} mode="aspectFill" />
            <View className="admin-info">
              <Text className="admin-caption">{photo.caption}</Text>
              <Text className="admin-author">投稿：{photo.author}</Text>
            </View>
            <View className="admin-actions">
              <Button
                size="mini"
                type={photo.featured ? "primary" : "default"}
                onClick={() => callAction("setFeatured", { id: photo._id, featured: !photo.featured })}
              >
                {photo.featured ? "取消轮播" : "设为轮播"}
              </Button>
              <Button size="mini" type="warn" onClick={() => callAction("delete", { id: photo._id })}>
                删除
              </Button>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
