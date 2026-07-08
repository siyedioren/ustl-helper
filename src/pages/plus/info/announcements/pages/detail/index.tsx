import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";

import { Toast } from "@/utils/toast";

import "./index.scss";

interface AnnouncementDetail {
  title: string;
  source: string;
  date: string;
  summary: string;
  content?: string;
  url: string;
}

const SOURCE_COLORS: Record<string, string> = {
  教务处: "rgb(var(--blue-6))",
  学生处: "rgb(var(--green-6))",
  后勤: "rgb(var(--orange-6))",
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
      {data.content && (
        <View className="detail-card">
          <View className="detail-section-title">公告正文</View>
          <View className="detail-full-content">{data.content}</View>
        </View>
      )}

      {data.url && (
        <View className="detail-card">
          <View className="detail-link-btn" onClick={() => {
            if (data.url.startsWith("http")) {
              Taro.setClipboardData({ data: data.url, success: () => Toast.info("链接已复制") });
            } else {
              Taro.navigateTo({ url: data.url });
            }
          }}>
            {data.url.startsWith("http") ? "复制链接" : "查看详情"}
          </View>
        </View>
      )}

    </View>
  );
}
