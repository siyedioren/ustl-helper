import "./index.scss";

import { Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import useStore from "@/store";
import { Cache } from "@/utils/cache";
import { Toast } from "@/utils/toast";

interface LifeItem {
  name: string;
  address: string;
  tags: string[];
  category: string;
  desc?: string;
  latitude: number;
  longitude: number;
}

const CATEGORIES = ["全部", "美食餐饮", "医疗健康", "购物休闲"];

const LIFE_DATA: LifeItem[] = [
  {
    name: "万达广场",
    address: "鞍山市立山区千山中路278号",
    tags: ["购物", "美食", "电影"],
    category: "购物休闲",
    desc: "集购物、餐饮、娱乐、休闲于一体的大型商业综合体，距离学校较近。",
    latitude: 41.11343,
    longitude: 123.065242,
  },
  {
    name: "大福鲜果",
    address: "龙源公寓附近",
    tags: ["水果", "零食"],
    category: "美食餐饮",
    desc: "主营新鲜水果、进口果切及休闲零食，支持校内配送。",
    latitude: 41.111877,
    longitude: 123.068371,
  },
  {
    name: "龙源北门小夜市",
    address: "龙源公寓北门",
    tags: ["夜宵", "小吃"],
    category: "美食餐饮",
    desc: "晚间开放的路边小吃摊聚集地，烧烤、炸串、饮品等种类丰富。",
    latitude: 41.111877,
    longitude: 123.068371,
  },
  {
    name: "鞍山市中心医院（铁东院区）",
    address: "鞍山市铁东区南中华路77号",
    tags: ["医院", "急诊"],
    category: "医疗健康",
    desc: "鞍山市综合性三级医院，设有急诊、内科、外科等科室。",
    latitude: 41.110289,
    longitude: 123.004922,
  },
];

const CACHE_KEY = "life_data_v2";

export default function LifeIndex() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lifeData, setLifeData] = useState<LifeItem[]>(LIFE_DATA);
  const favorites = useStore(state => state.favorites.life);
  const toggleFavorite = useStore(state => state.toggleFavoriteLife);
  const addHistory = useStore(state => state.addHistory);

  useLoad(() => {
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "info/life" } }).catch(() => {});
    const cached = Cache.get(CACHE_KEY);
    if (cached) {
      setLifeData(cached);
    }
    Cache.set(CACHE_KEY, LIFE_DATA, 24 * 60);
  });

  const filtered = active === 0 ? lifeData : lifeData.filter(item => item.category === CATEGORIES[active]);

  const handleToggle = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const handleOpenLocation = (e: any, item: LifeItem) => {
    e.stopPropagation();
    Taro.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      address: item.address,
    });
  };

  const handleFavorite = (e: any, name: string) => {
    e.stopPropagation();
    toggleFavorite(name);
    const isFav = favorites.includes(name);
    Toast.info(isFav ? "已取消收藏" : "已收藏");
  };

  const handleCardClick = (idx: number, item: LifeItem) => {
    handleToggle(idx);
    addHistory({
      type: "life",
      id: item.name,
      title: item.name,
      time: Date.now(),
    });
  };

  return (
    <View className="life-page">
      {/* 分类筛选 */}
      <View className="filter-bar">
        {CATEGORIES.map((cat, idx) => (
          <View
            key={idx}
            className={`filter-btn ${idx === active ? "filter-btn-active" : ""}`}
            onClick={() => {
              setActive(idx);
              setExpanded(null);
            }}
          >
            <Text>{cat}</Text>
          </View>
        ))}
      </View>

      {/* 列表 */}
      <View className="life-list">
        {filtered.map((item, idx) => {
          const isFav = favorites.includes(item.name);
          const isExpanded = expanded === idx;
          return (
            <View key={item.name} className="life-card" onClick={() => handleCardClick(idx, item)}>
              <View className="card-header">
                <View className="card-title-wrap">
                  <Text className="card-name">{item.name}</Text>
                  <View className="card-tags">
                    {item.tags.map((tag, tidx) => (
                      <Text key={tidx} className="card-tag">
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
                <View className="card-actions">
                  <Text
                    className={`fav-icon ${isFav ? "fav-active" : ""}`}
                    onClick={e => handleFavorite(e, item.name)}
                  >
                    {isFav ? "♥" : "♡"}
                  </Text>
                  <Text className="card-arrow">{isExpanded ? "▲" : "▼"}</Text>
                </View>
              </View>

              <View className="card-brief">
                <Text className="card-brief-text">{item.address}</Text>
              </View>

              {isExpanded && (
                <View className="card-detail">
                  {item.desc && (
                    <View className="detail-row">
                      <Text className="detail-label">简介：</Text>
                      <Text className="detail-value">{item.desc}</Text>
                    </View>
                  )}
                  <View className="detail-row">
                    <Text className="detail-label">地址：</Text>
                    <Text className="detail-value">{item.address}</Text>
                  </View>
                  <View className="detail-row" onClick={e => handleOpenLocation(e, item)}>
                    <Text className="detail-label">导航：</Text>
                    <Text className="detail-phone">在地图中打开</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
