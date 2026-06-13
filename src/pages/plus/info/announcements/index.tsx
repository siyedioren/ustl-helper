import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";

import "./index.scss";

interface Announcement {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

const CATEGORIES = ["全部", "热点新闻", "综合消息", "深度报道", "院系速递"];

const FALLBACK_DATA: Announcement[] = [
  { title: "【示例】热点新闻标题", source: "热点新闻", date: "2025-06-10", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/a1" },
  { title: "【示例】综合消息标题", source: "综合消息", date: "2025-06-09", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/a2" },
  { title: "【示例】深度报道标题", source: "深度报道", date: "2025-06-08", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/a3" },
  { title: "【示例】院系速递标题", source: "院系速递", date: "2025-06-07", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/a4" },
];

export default function AnnouncementsIndex() {
  const [active, setActive] = useState(0);
  const [list, setList] = useState<Announcement[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(false);

  useLoad(() => {
    setLoading(true);
    Taro.cloud.callFunction({ name: "newsFetch", data: { skip: 0, limit: 50 } })
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

  const handleNavDetail = (item: Announcement) => {
    Nav.to(`/pages/plus/info/announcements/pages/detail/index?data=${encodeURIComponent(JSON.stringify(item))}`);
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
          <View key={idx} className="announcement-card" onClick={() => handleNavDetail(item)}>
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
