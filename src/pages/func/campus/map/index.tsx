import "./index.scss";

import { Map, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";

import { Dot } from "@/components/dot";
import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import { Toast } from "@/utils/toast";

import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "./constant";
import styles from "./index.module.scss";



interface Building {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function toMarker(building: Building) {
  return {
    id: building.id,
    latitude: building.latitude,
    longitude: building.longitude,
    title: building.name,
    iconPath: "/static/marker.png",
    width: 24,
    height: 24,
    label: {
      content: building.name,
      color: "#000000",
      fontSize: 12,
      borderRadius: 4,
      bgColor: "#ffffff",
      padding: 4,
      textAlign: "center",
    },
  };
}

export default function Index() {
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [msg, setMsg] = useState("定位中");
  const [dot, setDot] = useState("#FFB800");
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuildings = () => {
    setLoading(true);
    setError("");
    Taro.cloud.callFunction({ name: "getBuildings" })
      .then((res: any) => {
        const result = res.result;
        if (result && result.code === 0 && Array.isArray(result.data)) {
          setMarkers(result.data.map(toMarker));
        } else {
          setError("建筑坐标加载失败");
        }
      })
      .catch(() => {
        setError("建筑坐标加载失败，请检查网络");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "campus/map" } }).catch(() => {});
    fetchBuildings();
    Taro.getLocation({
      type: "gcj02",
      success: res => {
        setLongitude(res.longitude);
        setLatitude(res.latitude);
        setMsg("定位成功");
        setDot("#009688");
      },
      fail: (err) => {
        setMsg("定位失败");
        setDot("#FF5722");
        if (err.errMsg && err.errMsg.includes("auth")) {
          setError("定位权限被拒绝，请前往设置开启位置权限");
        }
      },
    });
  }, []);

  const handleOpenSetting = () => {
    Taro.openSetting();
  };

  const handleMapError = (err: any) => {
    console.log("map error:", err);
    setError("地图加载失败，请重试");
  };

  return (
    <React.Fragment>
      <Layout title="了科地图" topSpace>
        <View className={styles.tips}>
          <Dot background={dot}></Dot>
          <View>{msg}</View>
          <View>{longitude.toFixed(6)}</View>
          <View>{latitude.toFixed(6)}</View>
        </View>

        {error && (
          <View className={styles.errorBox}>
            <Text className={styles.errorText}>{error}</Text>
            {error.includes("权限") && (
              <Text className={styles.errorBtn} onClick={handleOpenSetting}>
                去开启
              </Text>
            )}
            <Text className={styles.errorBtn} onClick={fetchBuildings}>
              重试
            </Text>
          </View>
        )}

        {loading && <View className={styles.loadingText}>加载建筑坐标...</View>}

        <View className={styles.mapContainer}>
          <Map
            className={styles.card}
            longitude={longitude}
            latitude={latitude}
            enable-building
            enable-poi={false}
            markers={markers}
            onError={handleMapError}
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
