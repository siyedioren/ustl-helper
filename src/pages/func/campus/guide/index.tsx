import { Image, ScrollView, View } from "@tarojs/components";
import React, { useState } from "react";

import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import { Nav } from "@/utils/nav";
import { cs } from "@/utils/cs";

import { BUILDINGS, Category, categoryColor, categoryLabel } from "./constant";
import campusMap from "@/static/campus-map.jpg";
import styles from "./index.module.scss";

const categories: { key: Category | "ALL"; label: string }[] = [
  { key: "ALL", label: "全部" },
  { key: Category.TEACHING, label: "教学楼" },
  { key: Category.DORM, label: "宿舍" },
  { key: Category.DINING, label: "食堂" },
  { key: Category.SPORTS, label: "体育" },
  { key: Category.OTHER, label: "其他" },
];

export default function GuideIndex() {
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");

  const filteredBuildings =
    activeCategory === "ALL"
      ? BUILDINGS
      : BUILDINGS.filter(b => b.category === activeCategory);

  const onMarkerClick = (id: number) => {
    Nav.to(`${PATH.GUIDE_DETAIL}?id=${id}`);
  };

  return (
    <React.Fragment>
      {/* 分类筛选 */}
      <Layout title="校园导览" topSpace>
        <ScrollView scrollX className={styles.filterBar}>
          {categories.map(c => (
            <View
              key={c.key}
              className={cs(
                styles.filterItem,
                activeCategory === c.key && styles.filterItemActive
              )}
              onClick={() => setActiveCategory(c.key)}
            >
              {c.label}
            </View>
          ))}
        </ScrollView>
      </Layout>

      {/* 静态地图 */}
      <Layout title="地图概览" topSpace>
        <ScrollView scrollX scrollY className={styles.mapScroll}>
          <View className={styles.mapContainer}>
            <Image
              src={campusMap}
              className={styles.mapBackground}
              mode="scaleToFill"
            />
            {filteredBuildings.map(b => (
              <View
                key={b.id}
                className={styles.marker}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                }}
                onClick={() => onMarkerClick(b.id)}
              >
                <View
                  className={styles.markerDot}
                  style={{ backgroundColor: categoryColor[b.category] }}
                ></View>
                <View className={styles.markerLabel}>{b.name}</View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Layout>

      {/* 建筑列表 */}
      <Layout title="建筑列表" topSpace>
        {filteredBuildings.map(b => (
          <View
            key={b.id}
            className={styles.buildingCard}
            onClick={() => onMarkerClick(b.id)}
          >
            <View className={styles.buildingHeader}>
              <View className={styles.buildingName}>{b.name}</View>
              <View
                className={styles.buildingTag}
                style={{ backgroundColor: categoryColor[b.category] }}
              >
                {categoryLabel[b.category]}
              </View>
            </View>
            <View className={styles.buildingDesc}>{b.description}</View>
          </View>
        ))}
      </Layout>
    </React.Fragment>
  );
}

GuideIndex.onShareAppMessage = () => ({
  title: "辽科大校园导览",
  path: PATH.GUIDE,
});
