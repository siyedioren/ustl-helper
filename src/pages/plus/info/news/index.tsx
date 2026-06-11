import "./index.scss";

import { Text, View, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import useStore from "@/store";
import { Toast } from "@/utils/toast";
import { Cache } from "@/utils/cache";

interface NewsItem {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

const CATEGORIES = ["全部", "教务处", "团委", "学院"];

const SOURCE_COLORS: Record<string, string> = {
  教务处: "rgb(var(--blue-6))",
  团委: "rgb(var(--green-6))",
  学院: "rgb(var(--orange-6))",
};

const FALLBACK_NEWS: NewsItem[] = [
  { title: "【示例】教务处新闻标题1", source: "教务处", date: "2025-06-10", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/1" },
  { title: "【示例】团委活动通知", source: "团委", date: "2025-06-09", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/2" },
  { title: "【示例】学院学术讲座", source: "学院", date: "2025-06-08", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/3" },
  { title: "【示例】教务处新闻标题2", source: "教务处", date: "2025-06-05", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/4" },
  { title: "【示例】团委活动报道", source: "团委", date: "2025-06-03", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/5" },
  { title: "【示例】学院比赛结果", source: "学院", date: "2025-06-01", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/6" },
  { title: "【示例】教务处新闻标题3", source: "教务处", date: "2025-05-28", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/7" },
  { title: "【示例】团委表彰通知", source: "团委", date: "2025-05-25", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/8" },
  { title: "【示例】学院安全教育活动", source: "学院", date: "2025-05-20", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/9" },
  { title: "【示例】教务处新闻标题4", source: "教务处", date: "2025-05-15", summary: "此为示例摘要，后续可替换为真实新闻内容。", url: "https://example.com/news/10" },
];

export default function NewsIndex() {
  const [active, setActive] = useState(0);
  const [newsList, setNewsList] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const favorites = useStore((state) => state.favorites.news);
  const toggleFavorite = useStore((state) => state.toggleFavoriteNews);
  const addHistory = useStore((state) => state.addHistory);

  useLoad(() => {
    const cached = Cache.get("news_list");
    if (cached) {
      setNewsList(cached);
    }

    Taro.cloud.callFunction({ name: "newsFetch", data: { skip: 0, limit: 10 } }).then((res: any) => {
      const result = res.result;
      if (result && result.code === 0 && Array.isArray(result.data) && result.data.length > 0) {
        const mergedData = result.data;
        setNewsList(mergedData);
        setHasMore(result.hasMore !== undefined ? result.hasMore : result.data.length === 10);
        Cache.set("news_list", mergedData, 60);
      }
    }).catch(() => {
      Toast.info("新闻加载失败，显示本地数据");
    });
  });

  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    Taro.cloud.callFunction({
      name: "newsFetch",
      data: { skip: newsList.length, limit: 10 },
    }).then((res: any) => {
      const result = res.result;
      if (result && result.code === 0 && Array.isArray(result.data)) {
        const newList = [...newsList, ...result.data];
        setNewsList(newList);
        setHasMore(result.hasMore !== undefined ? result.hasMore : result.data.length === 10);
        setPage((prev) => prev + 1);
      }
    }).catch(() => {
      // ignore
    }).finally(() => {
      setLoading(false);
    });
  };

  const filtered = active === 0
    ? newsList
    : newsList.filter((item) => item.source === CATEGORIES[active]);

  const handleCopy = (item: NewsItem) => {
    Taro.setClipboardData({ data: item.url });
    Toast.info("链接已复制");
    addHistory({
      type: "news",
      id: item.title,
      title: item.title,
      time: Date.now(),
    });
  };

  const handleFavorite = (e: any, title: string) => {
    e.stopPropagation();
    toggleFavorite(title);
    const isFav = favorites.includes(title);
    Toast.info(isFav ? "已取消收藏" : "已收藏");
  };

  return (
    <ScrollView
      className="news-page"
      scrollY
      style={{ height: "100vh" }}
      onScrollToLower={loadMore}
    >
      {/* 分类筛选 */}
      <View className="filter-bar">
        {CATEGORIES.map((cat, idx) => (
          <View
            key={idx}
            className={`filter-btn ${idx === active ? "filter-btn-active" : ""}`}
            onClick={() => setActive(idx)}
          >
            <Text>{cat}</Text>
          </View>
        ))}
      </View>

      {/* 新闻列表 */}
      <View className="news-list">
        {filtered.map((item, idx) => {
          const isFav = favorites.includes(item.title);
          return (
            <View
              key={idx}
              className="news-card"
              onClick={() => handleCopy(item)}
            >
              <View className="news-header">
                <Text className="news-title">{item.title}</Text>
                <View className="news-actions">
                  <Text
                    className={`fav-icon ${isFav ? "fav-active" : ""}`}
                    onClick={(e) => handleFavorite(e, item.title)}
                  >
                    {isFav ? "♥" : "♡"}
                  </Text>
                  <View
                    className="news-source"
                    style={{ background: SOURCE_COLORS[item.source] || "rgb(var(--blue-6))" }}
                  >
                    <Text className="news-source-text">{item.source}</Text>
                  </View>
                </View>
              </View>
              <Text className="news-date">{item.date}</Text>
              <Text className="news-summary">{item.summary}</Text>
            </View>
          );
        })}
        {loading && (
          <View className="loading-text">
            <Text>加载中...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
