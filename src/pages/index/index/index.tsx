import { View } from "@tarojs/components";
import React from "react";

import { Icon } from "@/components/icon";
import { Layout } from "@/components/layout";
import { Sentence } from "@/components/sentence";
import { Weather } from "@/components/weather";
import { PATH } from "@/config/page";
import { Nav } from "@/utils/nav";

import styles from "./index.module.scss";

const now = new Date();
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
  now.getDate()
).padStart(2, "0")} 星期${weekDays[now.getDay()]}`;

export default function Index() {
  const onNav = (url: string) => Nav.to(url);

  return (
    <React.Fragment>
      {/* 天气 + 日期 */}
      <Layout title={dateStr}>
        <Weather></Weather>
      </Layout>

      {/* 功能入口 */}
      <Layout title="常用功能" topSpace color="rgb(var(--arcoblue-5))" inheritColor>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => onNav(PATH.LIBRARY)}>
            <Icon type="lib"></Icon>
            <View className={styles.text}>图书检索</View>
          </View>
          <View className={styles.iconBox} onClick={() => onNav(PATH.MAP)}>
            <Icon type="map"></Icon>
            <View className={styles.text}>校园地图</View>
          </View>
          <View className={styles.iconBox} onClick={() => onNav(PATH.GUIDE)}>
            <Icon type="nav"></Icon>
            <View className={styles.text}>校园导览</View>
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
          <View>辽科大助手</View>
          <View className="a-lmt">基于 Taro + 微信云开发</View>
          <View className="a-lmt">图书馆数据来源于辽宁科技大学图书馆 OPAC</View>
        </View>
      </Layout>
    </React.Fragment>
  );
}

Index.onShareAppMessage = () => ({ title: "辽科大助手", path: PATH.HOME });
Index.onShareTimeline = () => void 0;
