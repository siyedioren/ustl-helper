import "./index.scss";

import { Image, Swiper, SwiperItem, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState } from "react";

import { Icon } from "@/components/icon";
import { Layout } from "@/components/layout";
import { Sentence } from "@/components/sentence";
import { Weather } from "@/components/weather";
import { PATH } from "@/config/page";
import useStore from "@/store";
import { Nav } from "@/utils/nav";

import styles from "./index.module.scss";

function getDateStr() {
  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} 星期${weekDays[now.getDay()]}`;
}

const DEFAULT_SWIPER = [
  "/static/banner/banner1.png",
  "/static/banner/banner2.png",
  "/static/banner/banner3.png",
];

export default function Index() {
  const onNav = (url: string) => Nav.to(url);
  const [swiperImages, setSwiperImages] = useState<string[]>(DEFAULT_SWIPER);
  const [noticeText, setNoticeText] = useState("欢迎使用了科小站！更多功能开发中...");
  const setWeather = useStore((state) => state.setWeather);
  const setSentence = useStore((state) => state.setSentence);

  useLoad(() => {
    Taro.cloud.callFunction({ name: "homeAggregate" }).then((res: any) => {
      const result = res.result;
      if (result && result.code === 0 && result.data) {
        const data = result.data;
        if (data.swiper && data.swiper.length > 0) {
          setSwiperImages(data.swiper.map((s: any) => s.image || s));
        }
        if (data.post) {
          setNoticeText(data.post);
        }
        if (data.weather) {
          setWeather(data.weather);
        }
        if (data.sentence) {
          setSentence(data.sentence.content || data.sentence);
        }
      }
    }).catch(() => {
      // fallback 保持现有硬编码逻辑
    });
  });

  return (
    <React.Fragment>
      {/* Banner 轮播 */}
      <Swiper className={styles.banner} indicatorColor="#999" indicatorActiveColor="#333" circular indicatorDots autoplay>
        {swiperImages.map((src, idx) => (
          <SwiperItem key={idx}>
            <Image className={styles.bannerImg} src={src} mode="aspectFill" lazyLoad={idx > 0} />
          </SwiperItem>
        ))}
      </Swiper>

      {/* 公告栏 */}
      <View className={styles.notice}>
        <View className={styles.noticeDot} />
        <View className={styles.noticeText}>{noticeText}</View>
      </View>

      {/* 天气 + 日期 */}
      <Layout title={getDateStr()}>
        <Weather></Weather>
      </Layout>

      {/* 功能入口 */}
      <Layout title="常用功能" topSpace color="rgb(var(--arcoblue-5))" inheritColor>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => Nav.tab(PATH.MAP)}>
            <Icon type="map"></Icon>
            <View className={styles.text}>校园地图</View>
          </View>
          <View className={styles.iconBox} onClick={() => onNav(PATH.GUIDE)}>
            <Icon type="nav"></Icon>
            <View className={styles.text}>校园导览</View>
          </View>
          <View className={styles.iconBox} onClick={() => onNav(PATH.CALENDAR)}>
            <Icon type="calendar"></Icon>
            <View className={styles.text}>校历</View>
          </View>
          <View className={styles.iconBox} onClick={() => onNav(PATH.FRESHMAN)}>
            <Icon type="gonggao"></Icon>
            <View className={styles.text}>新生必看</View>
          </View>
        </View>
      </Layout>

      {/* 快捷工具 */}
      <Layout title="快捷工具" topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => onNav("/pages/plus/info/websites/index")}>
            <Icon type="gonggao"></Icon>
            <View className={styles.text}>网址导航</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/phonebook/index")}>
            <Icon type="gonggao"></Icon>
            <View className={styles.text}>电话簿</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/tools/gpa/index")}>
            <Icon type="calc"></Icon>
            <View className={styles.text}>GPA计算器</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/life/index")}>
            <Icon type="map"></Icon>
            <View className={styles.text}>周边生活</View>
          </View>
        </View>
      </Layout>

      {/* 校园资讯 */}
      <Layout title="校园资讯" topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/news/index")}>
            <Icon type="gonggao"></Icon>
            <View className={styles.text}>校园新闻</View>
          </View>
        </View>
      </Layout>

      {/* 每日一句 */}
      <Layout title="每日一句" topSpace>
        <Sentence></Sentence>
      </Layout>

      {/* 关于 */}
      <Layout title="关于" topSpace>
        <View className="a-color-grey a-fontsize-14">
          <View>了科小站</View>
          <View className="a-lmt">基于 Taro + 微信云开发</View>
          <View className="a-lmt">图书馆数据来源于辽宁科技大学图书馆 OPAC</View>
        </View>
      </Layout>
    </React.Fragment>
  );
}

Index.onShareAppMessage = () => ({ title: "了科小站", path: PATH.HOME });
Index.onShareTimeline = () => void 0;
