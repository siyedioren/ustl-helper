import "./index.scss";

import { Text, View } from "@tarojs/components";
import { useState } from "react";

import useStore from "@/store";
import { Toast } from "@/utils/toast";

const TABS = [
  { key: "websites", label: "网址导航" },
  { key: "life", label: "周边生活" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function FavoritesIndex() {
  const [active, setActive] = useState<TabKey>("websites");
  const favorites = useStore((state) => state.favorites);
  const toggleWebsite = useStore((state) => state.toggleFavoriteWebsite);
  const toggleLife = useStore((state) => state.toggleFavoriteLife);


  const list = favorites[active];

  const handleRemove = (name: string) => {
    if (active === "websites") toggleWebsite(name);
    if (active === "life") toggleLife(name);

    Toast.info("已取消收藏");
  };

  return (
    <View className="fav-page">
      {/* Tab 切换 */}
      <View className="fav-tabs">
        {TABS.map((tab) => (
          <View
            key={tab.key}
            className={`fav-tab ${active === tab.key ? "fav-tab-active" : ""}`}
            onClick={() => setActive(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* 列表 */}
      <View className="fav-list">
        {list.length === 0 ? (
          <View className="fav-empty">
            <Text>暂无收藏</Text>
          </View>
        ) : (
          list.map((name, idx) => (
            <View key={idx} className="fav-item">
              <Text className="fav-name">{name}</Text>
              <Text
                className="fav-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(name);
                }}
              >
                取消收藏
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
