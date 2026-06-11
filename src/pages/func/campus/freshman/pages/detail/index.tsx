import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";

import { Layout } from "@/components/layout";
import { cs } from "laser-utils";

import { getCategoryById } from "../../constant";
import styles from "./index.module.scss";

export default function FreshmanDetail() {
  const { id } = Taro.useRouter().params;
  const category = getCategoryById(Number(id));
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  if (!category) {
    return (
      <Layout title="新生必看">
        <View className={styles.empty}>暂无内容</View>
      </Layout>
    );
  }

  const toggle = (sectionId: number) => {
    const next = new Set(expandedIds);
    if (next.has(sectionId)) next.delete(sectionId);
    else next.add(sectionId);
    setExpandedIds(next);
  };

  return (
    <React.Fragment>
      <Layout title={category.name} color={category.color} inheritColor topSpace>
        <View className={styles.list}>
          {category.sections.map((section, idx) => {
            const isExpanded = expandedIds.has(idx);
            return (
              <View key={idx} className={styles.item}>
                <View
                  className={styles.header}
                  onClick={() => toggle(idx)}
                >
                  <View className={styles.vertical} style={{ backgroundColor: category.color }} />
                  <View className={styles.title}>{section.title}</View>
                  <Text className={cs(styles.arrow, isExpanded && styles.arrowUp)}>▼</Text>
                </View>
                {isExpanded && (
                  <View className={styles.body}>
                    <View className={styles.content}>{section.content}</View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Layout>
    </React.Fragment>
  );
}

FreshmanDetail.onShareAppMessage = () => {
  const { id } = Taro.useRouter().params;
  const category = getCategoryById(Number(id));
  return {
    title: category ? `新生必看 - ${category.name}` : "新生必看",
    path: `/pages/func/campus/freshman/pages/detail/index?id=${id}`,
  };
};
