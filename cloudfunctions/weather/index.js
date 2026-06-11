const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const COLLECTION = 'weather';

// 城市坐标映射（简化版，仅支持鞍山）
const CITY_COORDS = {
  '鞍山': { lat: 41.10392, lon: 123.06207 },
};

/** 请求 Open-Meteo API */
function fetchWeather(lat, lon) {
  return new Promise((resolve, reject) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&minutely_15=precipitation_probability&timezone=Asia%2FShanghai`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function parseWeatherCode(code) {
  const map = {
    0: '晴', 1: '多云', 2: '多云', 3: '阴',
    45: '雾', 48: '雾',
    51: '毛毛雨', 53: '小雨', 55: '中雨', 56: '冻雨', 57: '冻雨',
    61: '小雨', 63: '中雨', 65: '大雨', 66: '雨夹雪', 67: '雨夹雪',
    71: '小雪', 73: '中雪', 75: '大雪', 77: '小雪',
    80: '阵雨', 81: '阵雨', 82: '暴雨',
    85: '阵雪', 86: '阵雪',
    95: '雷阵雨', 96: '雷阵雨', 99: '雷阵雨',
  };
  return map[code] || '多云';
}

function parseWindDir(deg) {
  const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  return dirs[Math.round(deg / 45) % 8] + '风';
}

function toWindScale(speed) {
  if (speed < 1) return '0级';
  if (speed < 6) return '1级';
  if (speed < 12) return '2级';
  if (speed < 20) return '3级';
  if (speed < 29) return '4级';
  if (speed < 39) return '5级';
  if (speed < 50) return '6级';
  if (speed < 62) return '7级';
  if (speed < 75) return '8级';
  if (speed < 89) return '9级';
  if (speed < 103) return '10级';
  if (speed < 118) return '11级';
  return '12级';
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

exports.main = async (event) => {
  try {
    const city = event.city || '鞍山';
    const coords = CITY_COORDS[city] || CITY_COORDS['鞍山'];
    const todayKey = getTodayKey();

    // 1. 查当天缓存
    const { data: cacheList } = await db.collection(COLLECTION)
      .where({ dateKey: todayKey, city })
      .limit(1)
      .get();

    if (cacheList.length > 0) {
      return { code: 0, data: cacheList[0].data, fromCache: true };
    }

    // 2. 请求 API
    const raw = await fetchWeather(coords.lat, coords.lon);
    if (!raw || !raw.current || !raw.daily) {
      throw new Error('Open-Meteo 返回数据异常');
    }
    const c = raw.current;

    const future = [];
    const days = Math.min(raw.daily.time.length, 7);
    for (let i = 0; i < days; i++) {
      future.push({
        date: raw.daily.time[i],
        sky: parseWeatherCode(raw.daily.weather_code[i]),
        max: Math.round(raw.daily.temperature_2m_max[i]),
        min: Math.round(raw.daily.temperature_2m_min[i]),
      });
    }

    let rainProb = 0;
    if (raw.minutely_15 && raw.minutely_15.precipitation_probability) {
      const probs = raw.minutely_15.precipitation_probability.slice(0, 8);
      rainProb = Math.max(...probs);
    }

    const payload = {
      sky: parseWeatherCode(c.weather_code),
      temp: Math.round(c.temperature_2m),
      min: Math.round(raw.daily.temperature_2m_min[0]),
      max: Math.round(raw.daily.temperature_2m_max[0]),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: Math.round(c.relative_humidity_2m) || 0,
      windDir: parseWindDir(c.wind_direction_10m),
      windScale: toWindScale(c.wind_speed_10m),
      isDay: c.is_day === 1,
      precipitation: Math.round(c.precipitation * 10) / 10,
      rainProb: rainProb,
      future: future,
    };

    // 3. 写入缓存
    await db.collection(COLLECTION).add({
      data: {
        data: payload,
        dateKey: todayKey,
        city,
        updateTime: Date.now(),
      },
    });

    // 4. 清理旧数据
    const { data: oldList } = await db.collection(COLLECTION)
      .orderBy('updateTime', 'desc')
      .skip(10)
      .limit(100)
      .get();
    for (const item of oldList) {
      await db.collection(COLLECTION).doc(item._id).remove();
    }

    return { code: 0, data: payload, fromCache: false };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
