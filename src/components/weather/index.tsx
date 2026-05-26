import { View } from "@tarojs/components";
import { cs } from "@/utils/cs";
import { type FC, useEffect, useState } from "react";

import { Divider } from "../divider";
import styles from "./index.module.scss";
import { requestWeatherData } from "./model";

/** 天气状况 → emoji（区分昼夜） */
const skyEmoji = (sky: string, isDay: boolean) => {
  const dayMap: Record<string, string> = {
    晴: "☀️",
    多云: "⛅",
    阴: "☁️",
    阵雨: "🌦️",
    雷阵雨: "⛈️",
    毛毛雨: "🌧️",
    小雨: "🌧️",
    中雨: "🌧️",
    大雨: "🌧️",
    暴雨: "🌧️",
    雨夹雪: "🌨️",
    小雪: "❄️",
    中雪: "❄️",
    大雪: "❄️",
    暴雪: "❄️",
    雾: "🌫️",
    冻雨: "🌨️",
    阵雪: "🌨️",
  };
  const nightMap: Record<string, string> = {
    晴: "🌙",
    多云: "☁️",
    阴: "☁️",
    阵雨: "🌧️",
    雷阵雨: "⛈️",
    毛毛雨: "🌧️",
    小雨: "🌧️",
    中雨: "🌧️",
    大雨: "🌧️",
    暴雨: "🌧️",
    雨夹雪: "🌨️",
    小雪: "❄️",
    中雪: "❄️",
    大雪: "❄️",
    暴雪: "❄️",
    雾: "🌫️",
    冻雨: "🌨️",
    阵雪: "🌨️",
  };
  return isDay ? dayMap[sky] || "🌤️" : nightMap[sky] || "🌑";
};

export const Weather: FC<{
  className?: string;
}> = props => {
  const [temp, setTemp] = useState<number>(0);
  const [feelsLike, setFeelsLike] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [sky, setSky] = useState<string>("-");
  const [wind, setWind] = useState<string>("-");
  const [isDay, setIsDay] = useState<boolean>(true);
  const [precipitation, setPrecipitation] = useState<number>(0);

  useEffect(() => {
    requestWeatherData().then(res => {
      if (res) {
        setTemp(res.temp);
        setFeelsLike(res.feelsLike);
        setHumidity(res.humidity);
        setSky(res.sky);
        setWind(`${res.windDir} ${res.windScale}`);
        setIsDay(res.isDay);
        setPrecipitation(res.precipitation);
      }
    });
  }, []);

  return (
    <View className={cs(props.className)}>
      <View className={styles.overview}>
        <View className={styles.tempBox}>
          <View className={styles.bigEmoji}>{skyEmoji(sky, isDay)}</View>
          <View className={styles.sky}>{sky}</View>
        </View>
        <View className={styles.detail}>
          <View className={styles.bigTemp}>{temp}°C</View>
          <View>体感 {feelsLike}°C</View>
          <View>湿度 {humidity}%</View>
          <View>{wind}</View>
          {precipitation > 0 && <View>降水 {precipitation}mm</View>}
        </View>
      </View>
      <Divider margin={9}></Divider>
    </View>
  );
};
