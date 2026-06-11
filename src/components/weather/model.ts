export type FutureWeather = {
  date: string;
  sky: string;
  max: number;
  min: number;
};

export type WeatherType = {
  sky: string;
  temp: number;
  min: number;
  max: number;
  feelsLike: number;
  humidity: number;
  windDir: string;
  windScale: string;
  isDay: boolean;
  precipitation: number;
  rainProb: number;
  future: FutureWeather[];
};

/** 天气状况 → emoji（区分昼夜） */
export const skyEmoji = (sky: string, isDay: boolean) => {
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

const LAT = 41.10392;
const LON = 123.06207;

const fallback: WeatherType = {
  sky: "晴",
  temp: 20,
  min: 15,
  max: 25,
  feelsLike: 20,
  humidity: 50,
  windDir: "南风",
  windScale: "2级",
  isDay: true,
  precipitation: 0,
  rainProb: 0,
  future: Array(7).fill({ date: "--", sky: "晴", max: 20, min: 15 }),
};

/** 本地缓存 Key */
const WEATHER_CACHE_KEY = "WEATHER_CACHE_V3";
const CACHE_MS = 60 * 1000; // 本地缓存 1 分钟

/** 读取本地缓存 */
const readCache = (): WeatherType | null => {
  try {
    const raw = wx.getStorageSync(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.ts < CACHE_MS) return data.payload;
  } catch { /* ignore */ }
  return null;
};

/** 写入本地缓存 */
const writeCache = (payload: WeatherType) => {
  try {
    wx.setStorageSync(WEATHER_CACHE_KEY, JSON.stringify({ ts: Date.now(), payload }));
  } catch { /* ignore */ }
};

/** 调用云函数获取天气（带本地缓存，先返回缓存再刷新） */
export const requestWeatherData = (): Promise<WeatherType> => {
  return new Promise(resolve => {
    const cached = readCache();
    if (cached) resolve(cached);

    wx.cloud.callFunction({
      name: "weather",
      success: res => {
        const result = res.result as any;
        if (result && result.code === 0 && result.data) {
          writeCache(result.data);
          if (!cached) resolve(result.data as WeatherType);
        } else if (!cached) {
          resolve(fallback);
        }
      },
      fail: () => {
        if (!cached) resolve(fallback);
      },
    });
  });
};
