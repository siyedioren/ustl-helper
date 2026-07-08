import { Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";

import styles from "./index.module.scss";

interface StatsData {
  totalUsers: number;
  dau: number;
  wau: number;
  mau: number;
  date: string;
}

interface PageStat {
  page: string;
  pv: number;
  uv: number;
}

export default function StatsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);

  useLoad(() => {
    Taro.cloud.callFunction({ name: "checkAdmin" })
      .then((res: any) => {
        if (res.result && res.result.isAdmin) {
          setIsAdmin(true);
          fetchStats();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
      });
  });

  const fetchStats = () => {
    setLoading(true);
    Promise.all([
      Taro.cloud.callFunction({ name: "userStats", data: { action: "stats" } }),
      Taro.cloud.callFunction({ name: "userStats", data: { action: "pageStats" } }),
    ])
      .then(([statsRes, pageRes]: any) => {
        if (statsRes.result && statsRes.result.code === 0) {
          setStats(statsRes.result.data);
        }
        if (pageRes.result && pageRes.result.code === 0 && Array.isArray(pageRes.result.data)) {
          setPageStats(pageRes.result.data.slice(0, 5));
        }
      })
      .finally(() => setLoading(false));
  };

  if (!isAdmin) {
    return (
      <View className={styles.forbidden}>
        <Text>暂无权限访问该页面</Text>
      </View>
    );
  }

  return (
    <View className={styles.statsPage}>
      <View className={styles.card}>
        <View className={styles.cardTitle}>用户概览</View>
        {stats ? (
          <View className={styles.grid}>
            <View className={styles.gridItem}>
              <Text className={styles.gridValue}>{stats.totalUsers}</Text>
              <Text className={styles.gridLabel}>总用户</Text>
            </View>
            <View className={styles.gridItem}>
              <Text className={styles.gridValue}>{stats.dau}</Text>
              <Text className={styles.gridLabel}>今日日活</Text>
            </View>
            <View className={styles.gridItem}>
              <Text className={styles.gridValue}>{stats.wau}</Text>
              <Text className={styles.gridLabel}>近7天活跃</Text>
            </View>
            <View className={styles.gridItem}>
              <Text className={styles.gridValue}>{stats.mau}</Text>
              <Text className={styles.gridLabel}>近30天活跃</Text>
            </View>
          </View>
        ) : (
          <View className={styles.loading}>加载中...</View>
        )}
      </View>

      <View className={styles.card}>
        <View className={styles.cardTitle}>今日页面 TOP5</View>
        {pageStats.length === 0 ? (
          <View className={styles.loading}>暂无数据</View>
        ) : (
          pageStats.map((item) => (
            <View key={item.page} className={styles.pageItem}>
              <Text className={styles.pageName}>{item.page}</Text>
              <Text className={styles.pageNums}>PV {item.pv} · UV {item.uv}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
