import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import { Toast } from "@/utils/toast";

interface Activity {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

const CATEGORIES = ["全部", "社团", "讲座", "比赛"];

const FALLBACK_DATA: Activity[] = [
  { title: "校园歌手大赛决赛", source: "社团", date: "2025-06-20", summary: "年度校园歌手大赛决赛将在大学生活动中心举行，欢迎观赛。", url: "https://example.com/ac1" },
  { title: "人工智能前沿讲座", source: "讲座", date: "2025-06-18", summary: "邀请知名教授讲解AI最新发展趋势，地点：图书馆报告厅。", url: "https://example.com/ac2" },
  { title: "创新创业大赛报名开启", source: "比赛", date: "2025-06-15", summary: "面向全校学生的创新创业大赛正式启动，奖金丰厚。", url: "https://example.com/ac3" },
  { title: "篮球联赛总决赛", source: "比赛", date: "2025-06-12", summary: "各学院篮球代表队将角逐总冠军，地点：体育馆。", url: "https://example.com/ac4" },
  { title: "心理健康主题沙龙", source: "社团", date: "2025-06-10", summary: "关注大学生心理健康，现场提供免费心理咨询服务。", url: "https://example.com/ac5" },
];

export default function ActivitiesIndex() {
  const [active, setActive] = useState(0);
  const [list, setList] = useState<Activity[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(false);

  useLoad(() => {
    setLoading(true);
    Taro.cloud.callFunction({ name: "newsFetch", data: { type: "activity", skip: 0, limit: 20 } })
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

  const handleCopy = (item: Activity) => {
    Taro.setClipboardData({ data: item.url });
    Toast.info("链接已复制");
  };

  return (
    <ScrollView className="activities-page" scrollY style={{ height: "100vh" }}>
      <View className="filter-bar">
        {CATEGORIES.map((cat, idx) => (
          <View key={idx} className={`filter-btn ${idx === active ? "filter-btn-active" : ""}`} onClick={() => setActive(idx)}>
            <Text>{cat}</Text>
          </View>
        ))}
      </View>
      <View className="activities-list">
        {filtered.map((item, idx) => (
          <View key={idx} className="activity-card" onClick={() => handleCopy(item)}>
            <View className="activity-header">
              <Text className="activity-title">{item.title}</Text>
              <View className="activity-source">{item.source}</View>
            </View>
            <Text className="activity-date">{item.date}</Text>
            <Text className="activity-summary">{item.summary}</Text>
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
