import "./index.scss";

import { View } from "@tarojs/components";
import React from "react";

import { Icon } from "@/components/icon";
import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import { Nav } from "@/utils/nav";

import styles from "./index.module.scss";

export default function Func() {
  const onNav = (url: string) => Nav.to(url);

  return (
    <React.Fragment>
      {/* 校园服务 */}
      <Layout title="校园服务" color="rgb(var(--arcoblue-5))" inheritColor topSpace>
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
            <Icon type="star"></Icon>
            <View className={styles.text}>新生必看</View>
          </View>
        </View>
      </Layout>

      {/* 生活服务 */}
      <Layout title="生活服务" topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => onNav("/pages/plus/info/websites/index")}>
            <Icon type="link"></Icon>
            <View className={styles.text}>网址导航</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/phonebook/index")}>
            <Icon type="phone"></Icon>
            <View className={styles.text}>电话簿</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/life/index")}>
            <Icon type="location"></Icon>
            <View className={styles.text}>周边生活</View>
          </View>
        </View>
      </Layout>

      {/* 资讯动态 */}
      <Layout title="资讯动态" topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/news/index")}>
            <Icon type="gonggao"></Icon>
            <View className={styles.text}>校园新闻</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/announcements/index")}>
            <Icon type="notice"></Icon>
            <View className={styles.text}>往期公告</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/info/activities/index")}>
            <Icon type="calendar"></Icon>
            <View className={styles.text}>往期活动</View>
          </View>
        </View>
      </Layout>

      {/* 学业工具 */}
      <Layout title="学业工具" topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/tools/gpa/index")}>
            <Icon type="calc"></Icon>
            <View className={styles.text}>GPA计算器</View>
          </View>
          <View className={styles.iconBox} onClick={() => Nav.to("/pages/plus/tools/countdown/index")}>
            <Icon type="timer"></Icon>
            <View className={styles.text}>倒计时</View>
          </View>
        </View>
      </Layout>
    </React.Fragment>
  );
}

Func.onShareAppMessage = () => ({ title: "了科小站", path: PATH.FUNC });
Func.onShareTimeline = () => void 0;
