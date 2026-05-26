import { View } from "@tarojs/components";
import React from "react";

import { Layout } from "@/components/layout";

import styles from "./index.module.scss";

export default function User() {
  return (
    <React.Fragment>
      <Layout title="关于" topSpace>
        <View className={styles.line}>
          <View>应用名称</View>
          <View className={styles.version}>辽科大助手</View>
        </View>
        <View className={styles.line}>
          <View>技术栈</View>
          <View className={styles.version}>Taro + 微信云开发</View>
        </View>
        <View className={styles.line}>
          <View>数据来源</View>
          <View className={styles.version}>辽宁科技大学图书馆 OPAC</View>
        </View>
      </Layout>
    </React.Fragment>
  );
}

User.onShareAppMessage = () => void 0;
User.onShareTimeline = () => void 0;
