import { Text, View } from "@tarojs/components";
import { cs } from "laser-utils";
import { type FC, useEffect, useState } from "react";

import useStore from "@/store";
import { Toast } from "@/utils/toast";

import { Divider } from "../divider";
import styles from "./index.module.scss";
import { requestWeatherData, skyEmoji } from "./model";
import type { WeatherType } from "./model";

export const Weather: FC<{
  className?: string;
}> = props => {
  const [sky, setSky] = useState<string>("-");
  const [temp, setTemp] = useState<number>(0);
  const [detail, setDetail] = useState<string>("数据获取中");
  const [rainAlert, setRainAlert] = useState<string>("");
  const [future, setFuture] = useState<string[]>([]);

  const cachedWeather = useStore((state) => state.cache.weather);
  const setWeatherCache = useStore((state) => state.setWeather);

  const applyData = (res: WeatherType) => {
    setSky(res.sky);
    setTemp(res.temp);
    setDetail(
      `${res.sky}  体感${res.feelsLike}°C  湿度${res.humidity}%  ${res.windDir}${res.windScale}`
    );
    if (res.rainProb > 0) {
      setRainAlert(`未来2小时有雨 ${res.rainProb}%`);
    } else {
      setRainAlert("");
    }
    setFuture(res.future.map(item => item.sky));
  };

  const loadWeather = () => {
    // 优先从 store 读取（首页聚合接口可能已写入）
    if (cachedWeather) {
      applyData(cachedWeather);
    }

    requestWeatherData().then(res => {
      if (res) {
        applyData(res);
        setWeatherCache(res);
      }
    });
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <View className={cs(props.className)}>
      <View className={styles.overview}>
        <View className={styles.tempBox}>
          <View className={styles.bigEmoji}>{skyEmoji(sky, true)}</View>
        </View>
        <View className={styles.tempRange}>{String(temp)}°C</View>
        {rainAlert ? (
          <View className={cs("text-ellipsis", styles.rainAlert)}>
            <Text className="text-ellipsis">{rainAlert}</Text>
          </View>
        ) : (
          <View
            className={cs("text-ellipsis", styles.desc)}
            onClick={() => Toast.info(detail)}
          >
            <Text className="text-ellipsis">{sky}</Text>
          </View>
        )}
      </View>
      <Divider margin={9}></Divider>
      <View className={styles.list}>
        {future.map((item, idx) => (
          <View key={`${idx}-${item}`} className={styles.dayItem}>
            <View className={styles.dayEmoji}>{skyEmoji(item, true)}</View>
          </View>
        ))}
      </View>
    </View>
  );
};
