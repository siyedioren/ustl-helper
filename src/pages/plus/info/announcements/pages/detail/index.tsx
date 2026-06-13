import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";

import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";

import "./index.scss";

interface AnnouncementDetail {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

const SOURCE_COLORS: Record<string, string> = {
  热点新闻: "rgb(var(--red-6))",
  综合消息: "rgb(var(--blue-6))",
  深度报道: "rgb(var(--purple-6))",
  院系速递: "rgb(var(--green-6))",
};

export default function AnnouncementDetail() {
  const [data, setData] = useState<AnnouncementDetail | null>(null);

  Taro.useLoad((options) => {
    if (options.data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(options.data));
        setData(parsed);
      } catch {
        Toast.info("数据解析失败");
      }
    }
  });

  if (!data) {
    return (
      <View className="detail-page">
        <Text style={{ color: "var(--color-text-3)", fontSize: "14px" }}>加载中...</Text>
      </View>
    );
  }

  const handleOpenUrl = () => {
    Nav.to(`/pages/app/webview/index?url=${encodeURIComponent(data.url)}`);
  };

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
      <View className="detail-link-btn" onClick={handleOpenUrl}>
        查看原文
      </View>
    </View>
  );
}
