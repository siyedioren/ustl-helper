import { ScrollView, Text, View } from "@tarojs/components";
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

const CATEGORIES = ["全部", "通知", "其他"];

const CATEGORY_COLORS: Record<string, string> = {
  通知: "rgb(var(--blue-6))",
  更新: "rgb(var(--green-6))",
  活动: "rgb(var(--orange-6))",
  维护: "rgb(var(--red-6))",
  其他: "rgb(var(--gray-6))",
};

const FALLBACK_DATA: Announcement[] = [
  { title: "关于2025年暑假安排的通知", source: "教务处", category: "通知", isTop: false, date: "2025-06-15", summary: "请各位同学注意暑假起止时间，合理安排行程。", url: "https://example.com/a1" },
  { title: "图书馆暑期开放时间表", source: "后勤", category: "通知", isTop: false, date: "2025-06-14", summary: "暑期图书馆开放时间调整为每日 8:00-18:00。", url: "https://example.com/a2" },
  { title: "2025-2026学年校历发布", source: "教务处", category: "通知", isTop: false, date: "2025-06-10", summary: "新学年校历已发布，请查阅开学及放假安排。", url: "https://example.com/a3" },
  { title: "关于学生宿舍调整的通知", source: "学生处", category: "通知", isTop: false, date: "2025-06-08", summary: "下学期部分宿舍将进行整合调整，具体名单见通知。", url: "https://example.com/a4" },
  { title: "选课系统维护公告", source: "教务处", category: "维护", isTop: false, date: "2025-06-05", summary: "选课系统将于6月10日凌晨进行维护，预计2小时。", url: "https://example.com/a5" },
];

export default function AnnouncementsIndex() {
  const [active, setActive] = useState(0);
  const [list, setList] = useState<Announcement[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(false);

  const fetchList = (category: string) => {
    setLoading(true);
    Taro.cloud.callFunction({ name: "newsFetch", data: { type: "announcement", category, skip: 0, limit: 50 } })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0 && Array.isArray(result.data) && result.data.length > 0) {
          setList(result.data);
        }
      })
      .catch(() => {
        Toast.info("公告加载失败");
      })
      .finally(() => setLoading(false));
  };

  useLoad(() => {
    fetchList("全部");
  });

  const handleSwitchCategory = (idx: number) => {
    setActive(idx);
    fetchList(CATEGORIES[idx]);
  };

  const handleNavDetail = (item: Announcement) => {
    Nav.to(`/pages/plus/info/announcements/pages/detail/index?data=${encodeURIComponent(JSON.stringify(item))}`);
  };

  return (
    <ScrollView className="announcements-page" scrollY style={{ height: "100vh" }}>
      <View className="filter-bar">
        {CATEGORIES.map((cat, idx) => (
          <View key={idx} className={`filter-btn ${idx === active ? "filter-btn-active" : ""}`} onClick={() => handleSwitchCategory(idx)}>
            <Text>{cat}</Text>
          </View>
        ))}
      </View>
      <View className="announcements-list">
        {list.map((item, idx) => (
          <View key={idx} className={`announcement-card ${item.isTop ? "announcement-card-top" : ""}`} onClick={() => handleNavDetail(item)}>
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
      </View>
    </ScrollView>
  );
}
