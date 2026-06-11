import "./index.scss";

import { Map, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";

import { Dot } from "@/components/dot";
import { Layout } from "@/components/layout";

import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "./constant";
import styles from "./index.module.scss";

/** 了科主要建筑标注（百度坐标已转 GCJ02） */
const MARKERS = [
{ id: 1, latitude: 41.107618, longitude: 123.061842, title: "龙源公寓G座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓G座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 2, latitude: 41.107402, longitude: 123.061385, title: "龙源公寓H座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓H座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 3, latitude: 41.107187, longitude: 123.062279, title: "龙源公寓M座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓M座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 4, latitude: 41.107025, longitude: 123.062600, title: "龙源食堂", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源食堂", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 5, latitude: 41.107592, longitude: 123.064391, title: "龙源公寓A座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓A座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 6, latitude: 41.107531, longitude: 123.062405, title: "龙源公寓F座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓F座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 7, latitude: 41.107339, longitude: 123.065008, title: "龙源公寓B座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓B座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 8, latitude: 41.107117, longitude: 123.064374, title: "龙源公寓C座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓C座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 9, latitude: 41.106850, longitude: 123.064884, title: "龙源公寓D座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓D座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 10, latitude: 41.106664, longitude: 123.064220, title: "龙源公寓E座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓E座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 11, latitude: 41.107436, longitude: 123.065888, title: "龙源公寓2A座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓2A座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 12, latitude: 41.107157, longitude: 123.066354, title: "龙源公寓2B座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓2B座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 13, latitude: 41.106954, longitude: 123.065656, title: "龙源公寓2C座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓2C座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 14, latitude: 41.106697, longitude: 123.066281, title: "龙源公寓2D座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓2D座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 15, latitude: 41.106534, longitude: 123.065543, title: "龙源公寓2E座", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "龙源公寓2E座", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 16, latitude: 41.104209, longitude: 123.051643, title: "辽宁科技大学研究生教学楼", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "辽宁科技大学研究生教学楼", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 17, latitude: 41.103545, longitude: 123.052134, title: "辽宁科技大学3号宿舍楼", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "辽宁科技大学3号宿舍楼", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 18, latitude: 41.103199, longitude: 123.051557, title: "春华居", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "春华居", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 19, latitude: 41.103347, longitude: 123.052258, title: "博远楼（29号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博远楼（29号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 20, latitude: 41.102723, longitude: 123.051353, title: "致远楼（13舍)", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "致远楼（13舍)", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 21, latitude: 41.102500, longitude: 123.051474, title: "15舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "15舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 22, latitude: 41.102584, longitude: 123.052088, title: "11舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "11舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 23, latitude: 41.102500, longitude: 123.051474, title: "辽宁科技大学研究生公寓", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "辽宁科技大学研究生公寓", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 24, latitude: 41.103535, longitude: 123.052757, title: "莘园餐厅", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "莘园餐厅", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 25, latitude: 41.103401, longitude: 123.052928, title: "27舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "27舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 26, latitude: 41.102733, longitude: 123.053085, title: "29舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "29舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 27, latitude: 41.103553, longitude: 123.053602, title: "21舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "21舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 28, latitude: 41.103187, longitude: 123.053671, title: "23舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "23舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 29, latitude: 41.102808, longitude: 123.053768, title: "25舍", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "25舍", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 30, latitude: 41.104056, longitude: 123.053044, title: "西篮球场", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "西篮球场", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 31, latitude: 41.103206, longitude: 123.054959, title: "训练馆（23号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "训练馆（23号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 32, latitude: 41.102614, longitude: 123.054394, title: "网球馆（25号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "网球馆（25号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 33, latitude: 41.102987, longitude: 123.056002, title: "蓝球馆", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "蓝球馆", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 34, latitude: 41.103401, longitude: 123.055476, title: "羽毛球馆（21号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "羽毛球馆（21号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 35, latitude: 41.104087, longitude: 123.055875, title: "博闻楼（11号楼）电子与信息工程学院", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博闻楼（11号楼）电子与信息工程学院", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 36, latitude: 41.105130, longitude: 123.055546, title: "博艺楼（13号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博艺楼（13号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 37, latitude: 41.105092, longitude: 123.056804, title: "博爱楼（9号楼 矿业工程学院）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博爱楼（9号楼 矿业工程学院）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 38, latitude: 41.105212, longitude: 123.057640, title: "博彩楼（7号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博彩楼（7号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 39, latitude: 41.104642, longitude: 123.057662, title: "思贤居（7舍）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "思贤居（7舍）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 40, latitude: 41.104387, longitude: 123.057272, title: "新建宿舍（天猫超市）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "新建宿舍（天猫超市）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 41, latitude: 41.103860, longitude: 123.057094, title: "新建宿舍2", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "新建宿舍2", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 42, latitude: 41.103124, longitude: 123.057354, title: "体育中心", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "体育中心", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 43, latitude: 41.102255, longitude: 123.057241, title: "棒垒球场", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "棒垒球场", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 44, latitude: 41.103776, longitude: 123.057898, title: "弘毅居（5舍）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "弘毅居（5舍）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 45, latitude: 41.103943, longitude: 123.058069, title: "知行居（3舍）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "知行居（3舍）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 46, latitude: 41.104358, longitude: 123.058444, title: "逸兴居（1舍）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "逸兴居（1舍）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 47, latitude: 41.104831, longitude: 123.058578, title: "桃园餐厅", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "桃园餐厅", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 48, latitude: 41.105210, longitude: 123.058814, title: "校医院", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "校医院", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 49, latitude: 41.102278, longitude: 123.058751, title: "主体育场", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "主体育场", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 50, latitude: 41.104546, longitude: 123.060732, title: "博学楼（1号楼)", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博学楼（1号楼)", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 51, latitude: 41.103111, longitude: 123.060030, title: "博识楼（5号楼 外国语学院 机算机与软件工程学院 经济与法律学院）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博识楼（5号楼 外国语学院 机算机与软件工程学院 经济与法律学院）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 52, latitude: 41.102354, longitude: 123.060878, title: "博观楼（", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博观楼（", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 53, latitude: 41.102046, longitude: 123.062339, title: "明信楼（4号楼 机械工程与自动化学院 工商管理学院）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "明信楼（4号楼 机械工程与自动化学院 工商管理学院）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 54, latitude: 41.102567, longitude: 123.063733, title: "明贤楼（6号楼 材料与冶金学院）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "明贤楼（6号楼 材料与冶金学院）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 55, latitude: 41.102925, longitude: 123.061763, title: "辽宁科技大学图书馆", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "辽宁科技大学图书馆", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 56, latitude: 41.104360, longitude: 123.062184, title: "博雅广场", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "博雅广场", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
  { id: 57, latitude: 41.103997, longitude: 123.063198, title: "明德楼（2号楼）", iconPath: "/static/marker.png", width: 24, height: 24, label: { content: "明德楼（2号楼）", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, textAlign: "center" } },
];

export default function Index() {
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [msg, setMsg] = useState("定位中");
  const [dot, setDot] = useState("#FFB800");

  useEffect(() => {
    Taro.getLocation({
      type: "gcj02",
      success: res => {
        setLongitude(res.longitude);
        setLatitude(res.latitude);
        setMsg("定位成功");
        setDot("#009688");
      },
      fail: () => {
        setMsg("定位失败");
        setDot("#FF5722");
      },
    });
  }, []);

  return (
    <React.Fragment>
      <Layout title="了科地图" topSpace>
        <View className={styles.tips}>
          <Dot background={dot}></Dot>
          <View>{msg}</View>
          <View>{longitude.toFixed(6)}</View>
          <View>{latitude.toFixed(6)}</View>
        </View>
        <View className={styles.mapContainer}>
          <Map
            className={styles.card}
            longitude={longitude}
            latitude={latitude}
            enable-building
            enable-poi={false}
            markers={MARKERS}
            onError={console.log}
            show-location
            show-scale
          ></Map>
        </View>
      </Layout>
    </React.Fragment>
  );
}

Index.onShareAppMessage = () => ({ title: "了科小站 - 校园地图", path: PATH.MAP });
Index.onShareTimeline = () => void 0;
