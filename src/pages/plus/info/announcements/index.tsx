import { Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";

import "./index.scss";

interface Announcement {
  title: string;
  source: string;
  category: string;
  isTop?: boolean;
  date: string;
  summary: string;
  content?: string;
  url: string;
}

const CATEGORIES = ["全部", "通知", "更新", "活动", "维护", "其他"];

const CATEGORY_COLORS: Record<string, string> = {
  通知: "rgb(var(--blue-6))",
  更新: "rgb(var(--green-6))",
  活动: "rgb(var(--orange-6))",
  维护: "rgb(var(--red-6))",
  其他: "rgb(var(--gray-6))",
};

const FALLBACK_DATA: Announcement[] = [];

export default function AnnouncementsIndex() {
  const [active, setActive] = useState(0);
  const [list, setList] = useState<Announcement[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchList = (category: string) => {
    setLoading(true);
    Taro.cloud.callFunction({ name: "newsFetch", data: { type: "announcement", category, skip: 0, limit: 50 } })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0 && Array.isArray(result.data)) {
          setList(result.data);
        }
      })
      .catch(() => {
        Toast.info("公告加载失败");
      })
      .finally(() => setLoading(false));
  };

  useLoad(() => {
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "info/announcements" } }).catch(() => {});
    fetchList("全部");
    Taro.cloud.callFunction({ name: "checkAdmin" })
      .then((res: any) => {
        if (res.result && res.result.isAdmin) setIsAdmin(true);
      })
      .catch(() => {});
  });

  const handleSwitchCategory = (idx: number) => {
    setActive(idx);
    fetchList(CATEGORIES[idx]);
  };

  const handleNavDetail = (item: Announcement) => {
    Nav.to(`/pages/plus/info/announcements/pages/detail/index?data=${encodeURIComponent(JSON.stringify(item))}`);
  };

  return (
    <View className="announcements-page">
      <View className="filter-bar">
        <View className="filter-btns">
          {CATEGORIES.map((cat, idx) => (
            <View key={idx} className={`filter-btn ${idx === active ? "filter-btn-active" : ""}`} onClick={() => handleSwitchCategory(idx)}>
              <Text>{cat}</Text>
            </View>
          ))}
        </View>
        {isAdmin && (
          <View className="admin-btn" onClick={() => Nav.to("/pages/plus/info/announcements/pages/admin/index")}>
            <Text>管理</Text>
          </View>
        )}
      </View>
      <View className="announcements-list">
        {list.map((item) => (
          <View key={item._id || item.title + item.date} className={`announcement-card ${item.isTop ? "announcement-card-top" : ""}`} onClick={() => handleNavDetail(item)}>
            <View className="announcement-header">
              <View className="announcement-title-row">
                {item.isTop && <View className="announcement-top-tag">置顶</View>}
                <Text className="announcement-title">{item.title}</Text>
              </View>
              <View className="announcement-source" style={{ background: CATEGORY_COLORS[item.category] || CATEGORY_COLORS["其他"] }}>
                {item.category}
              </View>
            </View>
            <Text className="announcement-date">{item.date}</Text>
            <Text className="announcement-summary">{item.summary}</Text>
          </View>
        ))}
        {loading && (
          <View className="loading-text">
            <Text>加载中...</Text>
          </View>
        )}
        {!loading && list.length === 0 && (
          <View className="loading-text">
            <Text>暂无公告</Text>
          </View>
        )}
      </View>
    </View>
  );
}
