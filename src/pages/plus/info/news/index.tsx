import "./index.scss";

import { Text, View, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import useStore from "@/store";
import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";
import { Cache } from "@/utils/cache";

interface NewsItem {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

const CATEGORIES = ["全部", "热点新闻", "综合消息", "深度报道", "院系速递"];

const SOURCE_COLORS: Record<string, string> = {
  热点新闻: "rgb(var(--red-6))",
  综合消息: "rgb(var(--blue-6))",
  深度报道: "rgb(var(--purple-6))",
  院系速递: "rgb(var(--green-6))",
};

const FALLBACK_NEWS: NewsItem[] = [
  { title: "【示例】热点新闻标题", source: "热点新闻", date: "2025-06-10", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/news/1" },
  { title: "【示例】综合消息标题", source: "综合消息", date: "2025-06-09", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/news/2" },
  { title: "【示例】深度报道标题", source: "深度报道", date: "2025-06-08", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/news/3" },
  { title: "【示例】院系速递标题", source: "院系速递", date: "2025-06-07", summary: "此为示例摘要，真实数据将从辽宁科技大学新闻网抓取。", url: "https://example.com/news/4" },
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
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "info/news" } }).catch(() => {});
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

  const handleNavDetail = (item: NewsItem) => {
    addHistory({
      type: "news",
      id: item.title,
      title: item.title,
      time: Date.now(),
    });
    Nav.to(`/pages/plus/info/news/pages/detail/index?data=${encodeURIComponent(JSON.stringify(item))}`);
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
        {filtered.map((item) => {
          const isFav = favorites.includes(item.title);
          return (
            <View
              key={item.url || item.title}
              className="news-card"
              onClick={() => handleNavDetail(item)}
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
