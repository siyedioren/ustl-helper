import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useMemo } from "react";

import { Layout } from "@/components/layout";

import { BUILDINGS, BUS_SCHEDULE } from "../../constant";
import styles from "./index.module.scss";

export default function GuideBusDetail() {
  const { line } = Taro.useRouter().params;
  const lineName = line || "";

  const schedules = useMemo(
    () => BUS_SCHEDULE.filter(item => item.line === lineName),
    [lineName]
  );

  // 根据线路首站/末站名称匹配建筑坐标，用于地图导航
  const findBuildingByStop = (stopName: string) =>
    BUILDINGS.find(b => b.busStops && b.busStops.includes(stopName));

  const onOpenMap = () => {
    if (schedules.length === 0) return;
    const firstStop = schedules[0].route[0];
    const building = findBuildingByStop(firstStop);
    if (building) {
      Taro.openLocation({
        latitude: building.latitude,
        longitude: building.longitude,
        name: building.name,
        address: building.description,
      });
    } else {
      Taro.showToast({ title: "未找到站点位置", icon: "none" });
    }
  };

  if (!lineName || schedules.length === 0) {
    return (
      <Layout title="公交详情" topSpace>
        <View className={styles.empty}>未找到该线路信息</View>
      </Layout>
    );
  }

  // 去重后的站点顺序（保留第一次出现）
  const routeStops = useMemo(() => {
    const seen = new Set<string>();
    return schedules[0].route.filter(stop => {
      if (seen.has(stop)) return false;
      seen.add(stop);
      return true;
    });
  }, [schedules]);

  return (
    <React.Fragment>
      <Layout title="线路信息" topSpace>
        <View className={styles.lineTitle}>{lineName}</View>
        <View className={styles.lineTag}>校园公交</View>
      </Layout>

      <Layout title="运营时刻" topSpace>
        <View className={styles.scheduleList}>
          {schedules.map((item, idx) => (
            <View key={idx} className={styles.scheduleItem}>
              <View className={styles.scheduleHeader}>
                <Text className={styles.schedulePeriod}>{item.period}</Text>
                <Text className={styles.scheduleTime}>
                  {item.startTime} - {item.endTime}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Layout>

      <Layout title="途经站点" topSpace>
        <View className={styles.routeFlow}>
          {routeStops.map((stop, idx) => (
            <React.Fragment key={idx}>
              <View
                className={`${styles.routeStop} ${
                  findBuildingByStop(stop) ? styles.routeStopActive : ""
                }`}
              >
                {stop}
              </View>
              {idx < routeStops.length - 1 && (
                <Text className={styles.routeArrow}>→</Text>
              )}
            </React.Fragment>
          ))}
        </View>
      </Layout>

      <Layout title="地图导航" topSpace>
        <View className={styles.routeTitle}>
          点击按钮可在地图中查看线路始发站位置
        </View>
        <Button className={styles.navBtn} type="primary" onClick={onOpenMap}>
          在地图中打开
        </Button>
      </Layout>
    </React.Fragment>
  );
}

GuideBusDetail.onShareAppMessage = () => ({
  title: `了科校园导览 - ${Taro.useRouter().params.line || ""}`,
  path: `/pages/func/campus/guide/pages/bus/index?line=${Taro.useRouter().params.line || ""}`,
});
