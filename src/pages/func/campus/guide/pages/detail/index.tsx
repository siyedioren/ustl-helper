import "./index.scss";

import { Button, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";

import { Layout } from "@/components/layout";

import { BUILDINGS, categoryColor, categoryLabel } from "../../constant";
import { BUILDINGS as MAP_BUILDINGS } from "../../../map/constant";
import styles from "./index.module.scss";

export default function GuideDetail() {
  const { id } = Taro.useRouter().params;
  const building = BUILDINGS.find(b => String(b.id) === id);

  if (!building) {
    return (
      <Layout title="建筑详情" topSpace>
        <View className={styles.empty}>未找到该建筑</View>
      </Layout>
    );
  }

  const onNavigate = () => {
    // 导览坐标是为了贴合卫星图校准过的，跳转到真实地图应使用地图页的 GPS 坐标
    const mapBuilding = MAP_BUILDINGS.find(b => String(b.id) === id);
    Taro.openLocation({
      latitude: mapBuilding ? mapBuilding.latitude : building.latitude,
      longitude: mapBuilding ? mapBuilding.longitude : building.longitude,
      name: building.name,
      address: building.description,
    });
  };

  return (
    <React.Fragment>
      <Layout title="基本信息" topSpace>
        <View className={styles.infoRow}>
          <View className={styles.infoLabel}>名称</View>
          <View className={styles.infoValue}>{building.name}</View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoLabel}>分类</View>
          <View
            className={styles.tag}
            style={{ backgroundColor: categoryColor[building.category] }}
          >
            {categoryLabel[building.category]}
          </View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoLabel}>简介</View>
          <View className={styles.infoValue}>{building.description}</View>
        </View>
      </Layout>

      <Layout title="位置导航" topSpace>
        <Button className={styles.navBtn} type="primary" onClick={onNavigate}>
          在地图中打开
        </Button>
      </Layout>

    </React.Fragment>
  );
}

GuideDetail.onShareAppMessage = () => ({
  title: "了科校园导览",
  path: `/pages/func/campus/guide/pages/detail/index?id=${Taro.useRouter().params.id}`,
});
