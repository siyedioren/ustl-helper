import "./index.scss";

import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";

import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import { Nav } from "@/utils/nav";

import { BUILDINGS, BUS_SCHEDULE, categoryColor, categoryLabel } from "../../constant";
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
    Taro.openLocation({
      latitude: building.latitude,
      longitude: building.longitude,
      name: building.name,
      address: building.description,
    });
  };

  // 把 content 按 \n 拆分成段落
  const paragraphs = building.content ? building.content.split("\n").filter(p => p.trim()) : [];

  // 根据建筑关联的公交站点，筛选经过的班次
  const busStops = building.busStops || [];
  const busSchedules = BUS_SCHEDULE.filter(schedule =>
    busStops.some(stop => schedule.route.includes(stop))
  );

  // 同一线路合并为一条卡片，并按高峰期/平峰期分组
  const busLineMap = new Map<string, typeof busSchedules>();
  busSchedules.forEach(schedule => {
    const list = busLineMap.get(schedule.line) || [];
    list.push(schedule);
    busLineMap.set(schedule.line, list);
  });
  const busLines = Array.from(busLineMap.entries()).map(([line, schedules]) => ({
    line,
    peak: schedules.filter(s => s.period === "高峰期"),
    normal: schedules.filter(s => s.period === "平峰期"),
  }));

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

      {paragraphs.length > 0 && (
        <Layout title="详细介绍" topSpace>
          <View className={styles.content}>
            {paragraphs.map((p, idx) => (
              <View
                key={idx}
                className={
                  p.startsWith("【") && p.endsWith("】")
                    ? styles.contentHeading
                    : styles.contentPara
                }
              >
                {p}
              </View>
            ))}
          </View>
        </Layout>
      )}

      <Layout title="位置导航" topSpace>
        <Button className={styles.navBtn} type="primary" onClick={onNavigate}>
          在地图中打开
        </Button>
      </Layout>

      <Layout title="校园公交" topSpace>
        {busLines.length === 0 ? (
          <View className={styles.busEmpty}>附近暂无公交信息</View>
        ) : (
          <View className={styles.busList}>
            {busLines.map(({ line, peak, normal }, idx) => (
              <View
                key={idx}
                className={styles.busItem}
                onClick={() => Nav.to(`${PATH.GUIDE_BUS}?line=${encodeURIComponent(line)}`)}
              >
                <View className={styles.busHeader}>
                  <View className={styles.busLine}>{line}</View>
                  <View className={styles.busPeriod}>公交</View>
                </View>
                {peak.length > 0 && (
                  <View className={styles.busPeriodGroup}>
                    <Text className={styles.periodLabelPeak}>高峰期</Text>
                    <Text className={styles.periodTime}>
                      {peak.map(s => `${s.startTime}-${s.endTime}`).join(" / ")}
                    </Text>
                  </View>
                )}
                {normal.length > 0 && (
                  <View className={styles.busPeriodGroup}>
                    <Text className={styles.periodLabelNormal}>平峰期</Text>
                    <Text className={styles.periodTime}>
                      {normal.map(s => `${s.startTime}-${s.endTime}`).join(" / ")}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Layout>
    </React.Fragment>
  );
}

GuideDetail.onShareAppMessage = () => ({
  title: "了科校园导览",
  path: `/pages/func/campus/guide/pages/detail/index?id=${Taro.useRouter().params.id}`,
});
