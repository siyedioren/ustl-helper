import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";

import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";
import { LocalStorage } from "@/utils/storage";

import "./index.scss";

interface NewsDetail {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

interface CachedContent {
  content: string;
  fetchAt: number;
}

const SOURCE_COLORS: Record<string, string> = {
  教务处: "rgb(var(--blue-6))",
  团委: "rgb(var(--green-6))",
  学院: "rgb(var(--orange-6))",
};

const CACHE_KEY_PREFIX = "news_content_";
const CACHE_DAYS = 7;

export default function NewsDetail() {
  const [data, setData] = useState<NewsDetail | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cached, setCached] = useState(false);

  Taro.useLoad((options) => {
    if (options.data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(options.data));
        setData(parsed);
        loadContent(parsed);
      } catch {
        Toast.info("数据解析失败");
      }
    }
  });

  const cacheKey = (url: string) => CACHE_KEY_PREFIX + url;

  const loadContent = (item: NewsDetail) => {
    if (!item.url) return;

    // 1. 先读本地缓存
    const cachedData = LocalStorage.get<CachedContent>(cacheKey(item.url));
    if (cachedData && cachedData.content) {
      setContent(cachedData.content);
      setCached(true);
      setExpanded(true);
    }

    // 2. 云端抓取最新正文
    setLoading(true);
    Taro.cloud
      .callFunction({ name: "newsDetail", data: { url: item.url } })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0 && result.data && result.data.content) {
          const newContent = result.data.content;
          setContent(newContent);
          setCached(true);
          setExpanded(true);

          // 缓存 7 天
          const expire = new Date();
          expire.setDate(expire.getDate() + CACHE_DAYS);
          LocalStorage.set<CachedContent>(cacheKey(item.url), {
            content: newContent,
            fetchAt: Date.now(),
          }, expire);
        } else {
          if (!content) {
            Toast.info("原文加载失败");
          }
        }
      })
      .catch(() => {
        if (!content) {
          Toast.info("原文加载失败，请检查网络");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenUrl = () => {
    if (!data?.url) return;
    Taro.setClipboardData({ data: data.url }).then(() => {
      Toast.info("链接已复制");
    });
  };

  if (!data) {
    return (
      <View className="detail-page">
        <Text style={{ color: "var(--color-text-3)", fontSize: "14px" }}>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="detail-page">
      <View className="detail-card">
        <View className="detail-title">{data.title}</View>
        <View className="detail-meta">
          <View
            className="detail-source"
            style={{ background: SOURCE_COLORS[data.source] || "rgb(var(--blue-6))" }}
          >
            <Text>{data.source}</Text>
          </View>
          <Text className="detail-date">{data.date}</Text>
        </View>
        <View className="detail-divider" />
        <View className="detail-content">{data.summary}</View>
      </View>

      {/* 原文区域 */}
      {content && (
        <View className="detail-card">
          <View className="detail-section-title">
            原文内容
            {cached && <Text className="detail-cache-tag">已缓存</Text>}
          </View>
          <View className={`detail-full-content ${expanded ? "" : "detail-content-fold"}`}>
            {content}
          </View>
          {content.split("\n").length > 8 && (
            <View className="detail-expand-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? "收起" : "展开全文"}
            </View>
          )}
        </View>
      )}

      {/* 操作按钮 */}
      <View className="detail-actions">
        {!content && (
          <View
            className="detail-link-btn"
            onClick={() => !loading && loadContent(data)}
          >
            {loading ? "加载中..." : "查看原文（离线缓存）"}
          </View>
        )}
        <View className="detail-link-btn detail-link-btn-secondary" onClick={handleOpenUrl}>
          复制原文链接
        </View>
      </View>
    </View>
  );
}
