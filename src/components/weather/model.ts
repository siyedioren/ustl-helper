export type WeatherType = {
  sky: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windDir: string;
  windScale: string;
  isDay: boolean;
  precipitation: number;
};

/** Open-Meteo 天气代码 → 中文 */
const parseWeatherCode = (code: number): string => {
  const map: Record<number, string> = {
    0: "晴",
    1: "多云",
    2: "多云",
    3: "阴",
    45: "雾",
    48: "雾",
    51: "毛毛雨",
    53: "小雨",
    55: "中雨",
    56: "冻雨",
    57: "冻雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "雨夹雪",
    67: "雨夹雪",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "小雪",
    80: "阵雨",
    81: "阵雨",
    82: "暴雨",
    85: "阵雪",
    86: "阵雪",
    95: "雷阵雨",
    96: "雷阵雨",
    99: "雷阵雨",
  };
  return map[code] || "多云";
};

/** 角度 → 中文风向 */
const parseWindDir = (deg: number): string => {
  const dirs = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  const index = Math.round(deg / 45) % 8;
  return dirs[index] + "风";
};

/** km/h → 蒲福风级 */
const toWindScale = (speed: number): string => {
  if (speed < 1) return "0级";
  if (speed < 6) return "1级";
  if (speed < 12) return "2级";
  if (speed < 20) return "3级";
  if (speed < 29) return "4级";
  if (speed < 39) return "5级";
  if (speed < 50) return "6级";
  if (speed < 62) return "7级";
  if (speed < 75) return "8级";
  if (speed < 89) return "9级";
  if (speed < 103) return "10级";
  if (speed < 118) return "11级";
  return "12级";
};

const LAT = 41.10392;
const LON = 123.06207;

const fallback: WeatherType = {
  sky: "晴",
  temp: 20,
  feelsLike: 20,
  humidity: 50,
  windDir: "南风",
  windScale: "2级",
  isDay: true,
  precipitation: 0,
};

/** Open-Meteo 免费天气 API，无需 Key */
export const requestWeatherData = (): Promise<WeatherType> => {
  return new Promise(resolve => {
    wx.request({
      url: `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day,precipitation&timezone=Asia%2FShanghai`,
      success: res => {
        const data = res.data as any;
        if (data && data.current) {
          const c = data.current;
          resolve({
            sky: parseWeatherCode(c.weather_code),
            temp: Math.round(c.temperature_2m),
            feelsLike: Math.round(c.apparent_temperature),
            humidity: Math.round(c.relative_humidity_2m) || 0,
            windDir: parseWindDir(c.wind_direction_10m),
            windScale: toWindScale(c.wind_speed_10m),
            isDay: c.is_day === 1,
            precipitation: Math.round(c.precipitation * 10) / 10,
          });
        } else {
          resolve(fallback);
        }
      },
      fail: () => resolve(fallback),
    });
  });
};
