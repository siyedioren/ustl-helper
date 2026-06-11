import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import { Toast } from "@/utils/toast";

interface Announcement {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

const CATEGORIES = ["全部", "教务处", "学生处", "后勤"];

const FALLBACK_DATA: Announcement[] = [
  { title: "关于2025年暑假安排的通知", source: "教务处", date: "2025-06-15", summary: "请各位同学注意暑假起止时间，合理安排行程。", url: "https://example.com/a1" },
  { title: "图书馆暑期开放时间表", source: "后勤", date: "2025-06-14", summary: "暑期图书馆开放时间调整为每日 8:00-18:00。", url: "https://example.com/a2" },
  { title: "2025-2026学年校历发布", source: "教务处", date: "2025-06-10", summary: "新学年校历已发布，请查阅开学及放假安排。", url: "https://example.com/a3" },
  { title: "关于学生宿舍调整的通知", source: "学生处", date: "2025-06-08", summary: "下学期部分宿舍将进行整合调整，具体名单见通知。", url: "https://example.com/a4" },
  { title: "选课系统维护公告", source: "教务处", date: "2025-06-05", summary: "选课系统将于6月10日凌晨进行维护，预计2小时。", url: "https://example.com/a5" },
];

export default function AnnouncementsIndex() {
  const [active, setActive] = useState(0);
  const [list, setList] = useState<Announcement[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(false);

  useLoad(() => {
    setLoading(true);
    Taro.cloud.callFunction({ name: "newsFetch", data: { type: "announcement", skip: 0, limit: 20 } })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0 && Array.isArray(result.data) && result.data.length > 0) {
          setList(result.data);
        }
      })
      .catch(() => {
        // fallback
      })
      .finally(() => setLoading(false));
  });

  const filtered = active === 0 ? list : list.filter((item) => item.source === CATEGORIES[active]);

  const handleCopy = (item: Announcement) => {
    Taro.setClipboardData({ data: item.url });
    Toast.info("链接已复制");
  };

  return (
    <ScrollView className="announcements-page" scrollY style={{ height: "100vh" }}>
      <View className="filter-bar">
        {CATEGORIES.map((cat, idx) => (
          <View key={idx} className={`filter-btn ${idx === active ? "filter-btn-active" : ""}`} onClick={() => setActive(idx)}>
            <Text>{cat}</Text>
          </View>
        ))}
      </View>
      <View className="announcements-list">
        {filtered.map((item, idx) => (
          <View key={idx} className="announcement-card" onClick={() => handleCopy(item)}>
            <View className="announcement-header">
              <Text className="announcement-title">{item.title}</Text>
              <View className="announcement-source">{item.source}</View>
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
