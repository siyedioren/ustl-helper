import { View } from "@tarojs/components";
import React from "react";

import { Icon } from "@/components/icon";
import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import { Nav } from "@/utils/nav";

import { FRESHMAN_CATEGORIES } from "./constant";
import styles from "./index.module.scss";

export default function FreshmanIndex() {
  const onNav = (id: number) => Nav.to(`${PATH.FRESHMAN_DETAIL}?id=${id}`);

  return (
    <React.Fragment>
      <Layout title="新生必看" topSpace color="rgb(var(--orangered-5))" inheritColor>
        <View className={styles.grid}>
          {FRESHMAN_CATEGORIES.map(item => (
            <View
              key={item.id}
              className={styles.card}
              onClick={() => onNav(item.id)}
            >
              <View className={styles.iconBox} style={{ backgroundColor: item.color }}>
                <Icon type={item.icon} size={24} color="#fff"></Icon>
              </View>
              <View className={styles.name}>{item.name}</View>
            </View>
          ))}
        </View>
      </Layout>
    </React.Fragment>
  );
}

FreshmanIndex.onShareAppMessage = () => ({
  title: "新生必看",
  path: PATH.FRESHMAN,
});
