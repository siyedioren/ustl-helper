import "./index.scss";

import { Map, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";

import { Dot } from "@/components/dot";
import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import { Toast } from "@/utils/toast";

import { BUILDINGS, DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "./constant";
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
  const [error, setError] = useState("");
  const [showLocation, setShowLocation] = useState(false);

  const handleLocate = () => {
    Taro.getLocation({ type: "gcj02", isHighAccuracy: true })
      .then((res) => {
        setLongitude(res.longitude);
        setLatitude(res.latitude);
        setMsg("定位成功");
        setDot("#009688");
        setShowLocation(true);
        setError("");
      })
      .catch((err) => {
        setMsg("定位失败");
        setDot("#FF5722");
        setShowLocation(false);
        const errMsg = err && err.errMsg ? err.errMsg : String(err);
        if (errMsg.includes("auth") || errMsg.includes("authorize")) {
          setError("定位权限被拒绝，请前往设置开启位置权限");
        } else if (errMsg.includes("requiredPrivateInfos") || errMsg.includes("not declared") || errMsg.includes("暂未开通")) {
          setError("小程序后台未开通定位接口，请在微信公众平台申请开通 getLocation");
        } else if (errMsg.includes("system") || errMsg.includes("定位服务")) {
          setError("手机系统定位未开启，请检查系统设置");
        } else {
          setError("定位失败，已显示默认校园中心位置");
        }
      });
  };

  useEffect(() => {
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "campus/map" } }).catch(() => {});
    setMarkers(BUILDINGS.map(toMarker));

    Taro.getSetting()
      .then((res) => {
        const auth = res.authSetting && res.authSetting["scope.userLocation"];
        if (auth === true) {
          handleLocate();
        } else if (auth === false) {
          setMsg("定位权限被拒绝");
          setDot("#FF5722");
          setError("定位权限被拒绝，请前往设置开启位置权限");
        } else {
          Taro.authorize({ scope: "scope.userLocation" })
            .then(handleLocate)
            .catch(() => {
              setMsg("定位授权失败");
              setDot("#FF5722");
              setError("需要位置权限才能定位到当前位置");
            });
        }
      })
      .catch(() => handleLocate());
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
            <View className={styles.errorText}>{error}</View>
            {error.includes("权限") && (
              <View className={styles.errorBtn} onClick={handleOpenSetting}>
                去开启
              </View>
            )}
          </View>
        )}

        <View className={styles.mapContainer}>
          <Map
            className={styles.card}
            longitude={longitude}
            latitude={latitude}
            enable-building
            enable-poi={false}
            markers={markers}
            onError={handleMapError}
            show-location={showLocation}
            show-scale
          ></Map>
        </View>
      </Layout>
    </React.Fragment>
  );
}

Index.onShareAppMessage = () => ({ title: "了科小站 - 校园地图", path: PATH.MAP });
Index.onShareTimeline = () => void 0;
