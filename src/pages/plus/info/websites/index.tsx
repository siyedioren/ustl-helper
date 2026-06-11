import "./index.scss";

import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";

import { Layout } from "@/components/layout";
import useStore from "@/store";
import { Toast } from "@/utils/toast";

interface WebsiteItem {
  name: string;
  url: string;
  desc: string;
}

interface WebsiteCategory {
  name: string;
  items: WebsiteItem[];
}

const WEBSITES: WebsiteCategory[] = [
  {
    name: "学校官网",
    items: [
      { name: "辽宁科技大学官网", url: "https://www.ustl.edu.cn/", desc: "学校主页，新闻通知" },
      { name: "教务处", url: "https://jwc.ustl.edu.cn/", desc: "教务通知、考试安排、选课" },
      { name: "图书馆", url: "https://lib.ustl.edu.cn/", desc: "馆藏检索、借阅查询、自习室" },
      { name: "学生处", url: "https://xsc.ustl.edu.cn/", desc: "学生事务、奖助学金、心理健康" },
      { name: "团委", url: "https://tw.ustl.edu.cn/", desc: "社团活动、志愿服务、第二课堂" },
    ],
  },
  {
    name: "教学相关",
    items: [
      { name: "教务系统", url: "https://jwgl.ustl.edu.cn/", desc: "课表查询、成绩查询、考试安排" },
      { name: "学习通", url: "https://www.chaoxing.com/", desc: "在线学习、签到、作业、考试" },
      { name: "知网", url: "https://www.cnki.net/", desc: "论文检索、文献下载" },
      { name: "万方数据", url: "https://www.wanfangdata.com.cn/", desc: "学术论文、期刊检索" },
      { name: "维普网", url: "http://www.cqvip.com/", desc: "中文期刊服务平台" },
    ],
  },
  {
    name: "生活服务",
    items: [
      { name: "校园网认证", url: "https://auth.ustl.edu.cn/", desc: "校园网登录、流量查询" },
      { name: "一卡通查询", url: "https://ecard.ustl.edu.cn/", desc: "余额查询、消费记录、充值" },
      { name: "宿舍报修", url: "https://hq.ustl.edu.cn/repair", desc: "水电维修、家具报修" },
      { name: "快递查询", url: "https://www.kuaidi100.com/", desc: "通用快递查询平台" },
    ],
  },
  {
    name: "常用工具",
    items: [
      { name: "四六级报名", url: "https://cet-bm.neea.edu.cn/", desc: "全国大学英语四六级考试报名" },
      { name: "普通话报名", url: "https://bm.cltt.org/", desc: "普通话水平测试报名" },
      { name: "教资报名", url: "https://ntce.neea.edu.cn/", desc: "中小学教师资格考试报名" },
      { name: "研招网", url: "https://yz.chsi.com.cn/", desc: "研究生招生信息网" },
      { name: "学信网", url: "https://www.chsi.com.cn/", desc: "学籍学历查询、学位认证" },
      { name: "全国征兵网", url: "https://www.gfbzb.gov.cn/", desc: "兵役登记、征兵报名" },
    ],
  },
];

const CATEGORIES = ["全部", ...WEBSITES.map((c) => c.name)];

export default function WebsitesPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const favorites = useStore((state) => state.favorites.websites);
  const toggleFavorite = useStore((state) => state.toggleFavoriteWebsite);
  const addHistory = useStore((state) => state.addHistory);

  const handleCopy = (item: WebsiteItem) => {
    Taro.setClipboardData({
      data: item.url,
      success: () => {
        Toast.info("链接已复制，请在浏览器中打开");
      },
    });
    addHistory({
      type: "website",
      id: item.name,
      title: item.name,
      time: Date.now(),
    });
  };

  const handleFavorite = (e: any, name: string) => {
    e.stopPropagation();
    toggleFavorite(name);
    const isFav = favorites.includes(name);
    Toast.info(isFav ? "已取消收藏" : "已收藏");
  };

  const filteredWebsites =
    activeCategory === "全部"
      ? WEBSITES
      : WEBSITES.filter((c) => c.name === activeCategory);

  return (
    <React.Fragment>
      {/* 分类筛选 */}
      <View className="website-categories">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="mini"
            type={activeCategory === cat ? "primary" : "default"}
            className="category-btn"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </View>

      {/* 网站列表 */}
      {filteredWebsites.map((category) => (
        <Layout key={category.name} title={category.name} topSpace>
          {category.items.map((item) => {
            const isFav = favorites.includes(item.name);
            return (
              <View
                key={item.name}
                className="website-card"
                onClick={() => handleCopy(item)}
              >
                <View className="website-header">
                  <Text className="website-name">{item.name}</Text>
                  <View className="website-actions">
                    <Text
                      className={`fav-icon ${isFav ? "fav-active" : ""}`}
                      onClick={(e) => handleFavorite(e, item.name)}
                    >
                      {isFav ? "♥" : "♡"}
                    </Text>
                    <Text className="website-tag">{category.name}</Text>
                  </View>
                </View>
                <Text className="website-desc">{item.desc}</Text>
                <Text className="website-url">{item.url}</Text>
              </View>
            );
          })}
        </Layout>
      ))}
    </React.Fragment>
  );
}

WebsitesPage.onShareAppMessage = () => ({
  title: "了科小站 - 校园网址导航",
  path: "/pages/plus/info/websites/index",
});
