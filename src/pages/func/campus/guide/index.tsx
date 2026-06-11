import "./index.scss";

import { Image, Input, MovableArea, MovableView, ScrollView, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useMemo, useState } from "react";

import { cs } from "laser-utils";
import { getCloudFileURL } from "@/utils/cloud";
import { Nav } from "@/utils/nav";
import { PATH } from "@/config/page";

import {
  categoryColor,
  categoryLabel,
  GUIDE_CONFIG,
  latLonToPercent,
} from "./constant";
import styles from "./index.module.scss";

/** 图片原始比例 */
const IMG_RATIO = 868 / 1672;

export default function GuideIndex() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [passiveIndex, setPassiveIndex] = useState(-1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [mapErr, setMapErr] = useState("");
  const [viewSize, setViewSize] = useState({ w: 375, h: 195 });

  useEffect(() => {
    const sys = Taro.getSystemInfoSync();
    setViewSize({ w: sys.windowWidth, h: sys.windowWidth * IMG_RATIO });
  }, []);

  useEffect(() => {
    getCloudFileURL(
      "cloud://cloudbase-d7gq1axbr37c483c4.636c-cloudbase-d7gq1axbr37c483c4-1438853995/static/campus_map.jpg"
    )
      .then(url => {
        setMapUrl(url);
        setMapErr("");
      })
      .catch(err => {
        setMapUrl("");
        setMapErr(String(err.message || err));
        console.error("地图加载失败:", err);
      });
  }, []);

  const filteredData = useMemo(() => {
    const part = GUIDE_CONFIG[activeTab];
    const keyword = searchKeyword.trim().toLowerCase();
    return keyword
      ? part.data.filter(
          b =>
            b.name.toLowerCase().includes(keyword) ||
            b.description.toLowerCase().includes(keyword)
        )
      : part.data;
  }, [activeTab, searchKeyword]);

  const onSwitchTab = (index: number) => {
    setActiveTab(index);
    setSelectIndex(-1);
    setSearchKeyword("");
    Promise.resolve(passiveIndex === 0 ? -1 : 0).then(setPassiveIndex);
  };

  const onMarkerClick = (index: number) => {
    const item = filteredData[index];
    if (item) Nav.to(`${PATH.GUIDE_DETAIL}?id=${item.id}`);
  };

  const onListItemClick = (index: number) => {
    const item = filteredData[index];
    if (item) Nav.to(`${PATH.GUIDE_DETAIL}?id=${item.id}`);
  };

  const onSearchInput = (e: any) => {
    setSearchKeyword(e.detail.value);
    setSelectIndex(-1);
  };

  return (
    <React.Fragment>
      {/* 搜索框 */}
      <View className={styles.searchBox}>
        <Input
          className={styles.searchInput}
          type="text"
          placeholder="搜索建筑名称"
          value={searchKeyword}
          onInput={onSearchInput}
        />
        {searchKeyword && (
          <View className={styles.clearBtn} onClick={() => setSearchKeyword("")}>
            ×
          </View>
        )}
      </View>

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

      {/* 可拖动缩放的静态地图 */}
      <View className={styles.mapArea} style={{ height: `${viewSize.h}px` }}>
        {!mapUrl && !mapErr && (
          <View className={styles.mapLoading}>地图加载中...</View>
        )}
        {mapErr && <View className={styles.mapError}>地图加载失败: {mapErr}</View>}
        {mapUrl && (
          <MovableArea className={styles.movableArea}>
            <MovableView
              className={styles.movableView}
              direction="all"
              scale
              scaleMin={0.5}
              scaleMax={4}
              style={{ width: `${viewSize.w}px`, height: `${viewSize.h}px` }}
            >
              <Image
                className={styles.mapImage}
                src={mapUrl}
                style={{ width: "100%", height: "100%" }}
                onError={e => console.error("图片加载错误:", e.detail)}
              />
              {filteredData.map((item, index) => {
                const pos = latLonToPercent(item.latitude, item.longitude);
                const isActive = selectIndex === index;
                return (
                  <View
                    key={item.id}
                    className={cs(styles.marker, isActive && styles.markerActive)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    onClick={() => onMarkerClick(index)}
                  >
                    <View
                      className={styles.markerDot}
                      style={{ backgroundColor: categoryColor[item.category] }}
                    />
                    {isActive && (
                      <View className={styles.markerLabel}>{item.name}</View>
                    )}
                  </View>
                );
              })}
            </MovableView>
          </MovableArea>
        )}
      </View>

      {/* 建筑列表 */}
      <ScrollView
        scrollY
        className={styles.list}
        scrollTop={passiveIndex >= 0 ? passiveIndex * 50 : 0}
      >
        {filteredData.length === 0 ? (
          <View className={styles.empty}>未找到相关建筑</View>
        ) : (
          filteredData.map((item, index) => (
            <View
              key={item.id}
              className={cs(styles.listItem, selectIndex === index && styles.listActive)}
              onClick={() => onListItemClick(index)}
            >
              <View className={styles.row}>
                <View className={styles.name}>{item.name}</View>
                <View
                  className={styles.tag}
                  style={{ backgroundColor: categoryColor[item.category] }}
                >
                  {categoryLabel[item.category]}
                </View>
              </View>
              <View className={styles.desc}>{item.description}</View>
            </View>
          ))
        )}
      </ScrollView>
    </React.Fragment>
  );
}

GuideIndex.onShareAppMessage = () => ({
  title: "了科校园导览",
  path: "/pages/func/campus/guide/index",
});
