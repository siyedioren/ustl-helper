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
  hours: string;
  phone?: string;
  tags: string[];
  category: string;
  desc?: string;
}

const CATEGORIES = ["全部", "快递物流", "打印复印", "美食餐饮", "医疗健康", "数码维修", "休闲娱乐"];

const LIFE_DATA: LifeItem[] = [
  // 快递物流
  { name: "菜鸟驿站", address: "XXX", hours: "08:30 - 20:30", phone: "XXX-XXXX-XXXX", tags: ["菜鸟", "寄件", "取件"], category: "快递物流", desc: "示例描述" },
  { name: "妈妈驿站", address: "XXX", hours: "09:00 - 21:00", phone: "XXX-XXXX-XXXX", tags: ["圆通", "取件"], category: "快递物流", desc: "示例描述" },
  { name: "顺丰速运", address: "XXX", hours: "08:00 - 19:00", phone: "XXXXX", tags: ["顺丰", "寄件", "上门"], category: "快递物流", desc: "示例描述" },
  { name: "京东快递", address: "XXX", hours: "09:00 - 20:00", tags: ["京东", "取件"], category: "快递物流", desc: "示例描述" },
  // 打印复印
  { name: "学友打印店", address: "XXX", hours: "07:30 - 22:00", phone: "XXX-XXXX-XXXX", tags: ["打印", "复印", "胶装"], category: "打印复印", desc: "示例描述" },
  { name: "文印室（图书馆内）", address: "XXX", hours: "08:00 - 21:30", tags: ["自助打印", "扫描"], category: "打印复印", desc: "示例描述" },
  { name: "快印图文（校外）", address: "XXX", hours: "08:00 - 22:00", phone: "XXX-XXXX-XXXX", tags: ["大图", "彩印", "名片"], category: "打印复印", desc: "示例描述" },
  // 美食餐饮
  { name: "龙源食堂", address: "XXX", hours: "06:30 - 21:00", tags: ["食堂", "早餐", "大众餐"], category: "美食餐饮", desc: "示例描述" },
  { name: "一食堂（学府餐厅）", address: "XXX", hours: "06:30 - 20:30", tags: ["食堂", "快餐"], category: "美食餐饮", desc: "示例描述" },
  { name: "老地方烧烤", address: "XXX", hours: "16:00 - 02:00", phone: "XXX-XXXX-XXXX", tags: ["烧烤", "夜宵", "聚餐"], category: "美食餐饮", desc: "示例描述" },
  { name: "张亮麻辣烫", address: "XXX", hours: "10:00 - 22:00", tags: ["麻辣烫", "快餐"], category: "美食餐饮", desc: "示例描述" },
  { name: "必胜客", address: "XXX", hours: "10:00 - 21:30", phone: "XXX-XXXX-XXXX", tags: ["西餐", "披萨", "约会"], category: "美食餐饮", desc: "示例描述" },
  // 医疗健康
  { name: "校医院", address: "XXX", hours: "08:00 - 17:00（急诊24h）", phone: "XXX-XXXX-XXXX", tags: ["校医院", "医保", "急诊"], category: "医疗健康", desc: "示例描述" },
  { name: "成大方圆药店", address: "XXX", hours: "07:30 - 22:00", phone: "XXX-XXXX-XXXX", tags: ["药店", "OTC", "器械"], category: "医疗健康", desc: "示例描述" },
  { name: "仁和诊所", address: "XXX", hours: "08:00 - 20:00", phone: "XXX-XXXX-XXXX", tags: ["诊所", "输液", "感冒"], category: "医疗健康", desc: "示例描述" },
  // 数码维修
  { name: "小李手机维修", address: "XXX", hours: "09:00 - 21:00", phone: "XXX-XXXX-XXXX", tags: ["手机维修", "换屏", "贴膜"], category: "数码维修", desc: "示例描述" },
  { name: "快修电脑", address: "XXX", hours: "09:00 - 22:00", phone: "XXX-XXXX-XXXX", tags: ["电脑维修", "重装系统"], category: "数码维修", desc: "示例描述" },
  { name: "苹果授权服务点", address: "XXX", hours: "10:00 - 21:00", phone: "XXX-XXXX-XXXX", tags: ["苹果", "保修", "官方"], category: "数码维修", desc: "示例描述" },
  // 休闲娱乐
  { name: "万达广场", address: "XXX", hours: "10:00 - 21:30", tags: ["购物", "美食", "电影"], category: "休闲娱乐", desc: "示例描述" },
  { name: "万达影城", address: "XXX", hours: "10:00 - 次日02:00", phone: "XXX-XXXX-XXXX", tags: ["电影", "IMAX", "情侣"], category: "休闲娱乐", desc: "示例描述" },
  { name: "星聚会KTV", address: "XXX", hours: "12:00 - 次日02:00", phone: "XXX-XXXX-XXXX", tags: ["KTV", "聚会", "生日"], category: "休闲娱乐", desc: "示例描述" },
  { name: "千山风景区", address: "XXX", hours: "08:00 - 17:00", phone: "XXX-XXXX-XXXX", tags: ["景点", "登山", "周末"], category: "休闲娱乐", desc: "示例描述" },
];

export default function LifeIndex() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lifeData, setLifeData] = useState<LifeItem[]>(LIFE_DATA);
  const favorites = useStore((state) => state.favorites.life);
  const toggleFavorite = useStore((state) => state.toggleFavoriteLife);
  const addHistory = useStore((state) => state.addHistory);

  useLoad(() => {
    const cached = Cache.get("life_data");
    if (cached) {
      setLifeData(cached);
    }
    Cache.set("life_data", LIFE_DATA, 24 * 60);
  });

  const filtered = active === 0
    ? lifeData
    : lifeData.filter((item) => item.category === CATEGORIES[active]);

  const handleToggle = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const handleCall = (phone: string) => {
    Taro.makePhoneCall({ phoneNumber: phone });
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
            onClick={() => { setActive(idx); setExpanded(null); }}
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
            <View key={idx} className="life-card" onClick={() => handleCardClick(idx, item)}>
              <View className="card-header">
                <View className="card-title-wrap">
                  <Text className="card-name">{item.name}</Text>
                  <View className="card-tags">
                    {item.tags.map((tag, tidx) => (
                      <Text key={tidx} className="card-tag">{tag}</Text>
                    ))}
                  </View>
                </View>
                <View className="card-actions">
                  <Text
                    className={`fav-icon ${isFav ? "fav-active" : ""}`}
                    onClick={(e) => handleFavorite(e, item.name)}
                  >
                    {isFav ? "♥" : "♡"}
                  </Text>
                  <Text className="card-arrow">{isExpanded ? "▲" : "▼"}</Text>
                </View>
              </View>

              <View className="card-brief">
                <Text className="card-brief-text">{item.address}</Text>
                <Text className="card-brief-text">{item.hours}</Text>
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
                  <View className="detail-row">
                    <Text className="detail-label">营业：</Text>
                    <Text className="detail-value">{item.hours}</Text>
                  </View>
                  {item.phone && (
                    <View className="detail-row">
                      <Text className="detail-label">电话：</Text>
                      <Text
                        className="detail-phone"
                        onClick={(e) => { e.stopPropagation(); handleCall(item.phone!); }}
                      >
                        {item.phone}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
