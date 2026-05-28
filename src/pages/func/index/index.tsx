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
      <Layout title="学习工具" color="rgb(var(--red-5))" inheritColor topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => onNav(PATH.LIBRARY)}>
            <Icon type="lib"></Icon>
            <View className={styles.text}>图书检索</View>
          </View>
        </View>
      </Layout>

      <Layout title="校园生活" color="rgb(var(--green-5))" inheritColor topSpace>
        <View className={styles.funcRow}>
          <View className={styles.iconBox} onClick={() => Nav.tab(PATH.MAP)}>
            <Icon type="map"></Icon>
            <View className={styles.text}>校园地图</View>
          </View>
          <View className={styles.iconBox} onClick={() => onNav(PATH.GUIDE)}>
            <Icon type="nav"></Icon>
            <View className={styles.text}>校园导览</View>
          </View>
        </View>
      </Layout>
    </React.Fragment>
  );
}

Func.onShareAppMessage = () => ({ title: "辽科大助手", path: PATH.FUNC });
Func.onShareTimeline = () => void 0;
