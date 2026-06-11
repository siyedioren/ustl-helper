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
  // 行政部门
  { name: "教务处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "学生处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "校团委", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "招生就业处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "财务处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },
  { name: "国际交流与合作处", phone: "XXX-XXXX-XXXX", category: "行政部门", desc: "示例描述" },

  // 后勤服务
  { name: "宿管中心", phone: "XXX-XXXX-XXXX", category: "后勤服务", desc: "示例描述" },
  { name: "食堂管理科", phone: "XXX-XXXX-XXXX", category: "后勤服务", desc: "示例描述" },
  { name: "物业维修", phone: "XXX-XXXX-XXXX", category: "后勤服务", desc: "示例描述" },
  { name: "水电充值中心", phone: "XXX-XXXX-XXXX", category: "后勤服务", desc: "示例描述" },

  // 安全医疗
  { name: "保卫处", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },
  { name: "校医院急诊", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },
  { name: "校医院门诊", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },
  { name: "心理咨询中心", phone: "XXX-XXXX-XXXX", category: "安全医疗", desc: "示例描述" },

  // 学院办公室
  { name: "计算机学院教务办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "计算机学院学工办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "土木工程学院教务办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "土木工程学院学工办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "机械工程学院教务办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "机械工程学院学工办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "材料学院教务办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },
  { name: "材料学院学工办", phone: "XXX-XXXX-XXXX", category: "学院办公室", desc: "示例描述" },

  // 图书馆
  { name: "图书馆借阅咨询", phone: "XXX-XXXX-XXXX", category: "图书馆", desc: "示例描述" },
  { name: "图书馆自习室管理", phone: "XXX-XXXX-XXXX", category: "图书馆", desc: "示例描述" },
  { name: "图书馆电子资源", phone: "XXX-XXXX-XXXX", category: "图书馆", desc: "示例描述" },

  // 其他
  { name: "网络信息中心", phone: "XXX-XXXX-XXXX", category: "其他", desc: "示例描述" },
  { name: "校园卡中心", phone: "XXX-XXXX-XXXX", category: "其他", desc: "示例描述" },
  { name: "快递驿站", phone: "XXX-XXXX-XXXX", category: "其他", desc: "示例描述" },
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
