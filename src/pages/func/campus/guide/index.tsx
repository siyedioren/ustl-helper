import type { CommonEventFunction, MapProps } from "@tarojs/components";
import { Map, ScrollView, View } from "@tarojs/components";
import React, { useMemo, useState } from "react";

import { cs } from "@/utils/cs";

import {
  BUILDINGS,
  Category,
  categoryColor,
  categoryLabel,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  GUIDE_CONFIG,
} from "./constant";
import styles from "./index.module.scss";

export default function GuideIndex() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [passiveIndex, setPassiveIndex] = useState(-1);

  const config = useMemo(() => {
    const part = GUIDE_CONFIG[activeTab];
    return {
      ...part,
      data: part.data.map((item, index) => ({
        latitude: item.latitude,
        longitude: item.longitude,
        title: item.name,
        id: index,
        iconPath: "/static/marker.png",
        width: 24,
        height: 24,
        label: {
          content: item.name,
          color: "#000000",
          fontSize: 10,
          borderRadius: 3,
          bgColor: "#ffffff",
          padding: 2,
          textAlign: "center",
        } as any,
      })),
    };
  }, [activeTab]);

  const onSwitchTab = (index: number) => {
    setActiveTab(index);
    setSelectIndex(-1);
    Promise.resolve(passiveIndex === 0 ? -1 : 0).then(setPassiveIndex);
  };

  const onMarkerTap: CommonEventFunction<MapProps.onMarkerTapEventDetail> = e => {
    const idx = Number(e.detail.markerId);
    setSelectIndex(idx);
    setPassiveIndex(idx);
  };

  return (
    <React.Fragment>
      {/* 分类 Tab */}
      <ScrollView scrollX enableFlex className={styles.tabBar}>
        <View className={styles.tabInner}>
          {GUIDE_CONFIG.map((item, index) => (
            <View
              key={index}
              className={cs(styles.tabItem, index === activeTab && styles.tabActive)}
              onClick={() => onSwitchTab(index)}
            >
              {item.name}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 地图 */}
      <Map
        scale={config.scale}
        className={styles.map}
        latitude={DEFAULT_LATITUDE}
        longitude={DEFAULT_LONGITUDE}
        onError={console.log}
        markers={config.data as MapProps.marker[]}
        includePoints={config.data}
        show-location
        onMarkerTap={onMarkerTap}
      />

      {/* 建筑列表 */}
      <ScrollView scrollY className={styles.list} scrollTop={passiveIndex >= 0 ? passiveIndex * 50 : 0}>
        {config.data.map((item, index) => {
          const raw = GUIDE_CONFIG[activeTab].data[index];
          return (
            <View
              key={index}
              className={cs(styles.listItem, selectIndex === index && styles.listActive)}
              onClick={() => setSelectIndex(selectIndex === index ? -1 : index)}
            >
              <View className={styles.row}>
                <View className={styles.name}>{item.title}</View>
                <View
                  className={styles.tag}
                  style={{ backgroundColor: categoryColor[raw.category] }}
                >
                  {categoryLabel[raw.category]}
                </View>
              </View>
              <View className={styles.desc}>{raw.description}</View>
            </View>
          );
        })}
      </ScrollView>
    </React.Fragment>
  );
}

GuideIndex.onShareAppMessage = () => ({
  title: "辽科大校园导览",
  path: "/pages/func/campus/guide/index",
});
