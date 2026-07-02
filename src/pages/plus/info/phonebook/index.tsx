import "./index.scss";

import { Input, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useMemo, useState } from "react";

import { Cache } from "@/utils/cache";

interface PhoneItem {
  name: string;
  phone: string;
  category: string;
  desc?: string;
}

const CATEGORIES = ["全部", "行政部门", "后勤服务", "安全医疗", "学院办公室", "图书馆", "其他"];

const PHONE_DATA: PhoneItem[] = [
  { name: "校内宿舍物业经理", phone: "13804926228", category: "后勤服务" },
  { name: "校内宿舍24小时报修 / 维修电话", phone: "5928444", category: "后勤服务", desc: "小号：888444" },
  { name: "学校报警", phone: "5928110", category: "安全医疗", desc: "小号：888110" },
  { name: "校医电话", phone: "5929221", category: "安全医疗" },
];

export default function PhonebookIndex() {
  const [active, setActive] = useState(0);
  const [keyword, setKeyword] = useState("");

  useLoad(() => {
    const cached = Cache.get("phonebook_data");
    if (cached) {
      // 数据已硬编码，无需更新状态
    }
    Cache.set("phonebook_data", PHONE_DATA, 24 * 60);
  });

  const filtered = useMemo(() => {
    let list = PHONE_DATA;
    if (active !== 0) {
      list = list.filter((item) => item.category === CATEGORIES[active]);
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(kw) ||
          item.category.toLowerCase().includes(kw) ||
          (item.desc && item.desc.toLowerCase().includes(kw))
      );
    }
    return list;
  }, [active, keyword]);

  const handleCall = (phone: string) => {
    Taro.makePhoneCall({ phoneNumber: phone });
  };

  return (
    <View className="phonebook-page">
      {/* 搜索框 */}
      <View className="search-bar">
        <Input
          className="search-input"
          type="text"
          placeholder="搜索部门名称..."
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
        />
      </View>

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

      {/* 电话列表 */}
      <View className="phone-list">
        {filtered.map((item, idx) => (
          <View key={idx} className="phone-card">
            <View className="phone-main">
              <View className="phone-info">
                <Text className="phone-name">{item.name}</Text>
                {item.desc && <Text className="phone-desc">{item.desc}</Text>}
              </View>
              <View className="phone-tag">{item.category}</View>
            </View>
            <View
              className="phone-number"
              onClick={() => handleCall(item.phone)}
            >
              <Text className="phone-icon">📞</Text>
              <Text className="phone-num-text">{item.phone}</Text>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View className="phone-empty">
            <Text>未找到匹配的部门或电话</Text>
          </View>
        )}
      </View>
    </View>
  );
}
