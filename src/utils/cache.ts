import Taro from "@tarojs/taro";

export const Cache = {
  set: (key: string, data: any, ttlMinutes: number) => {
    Taro.setStorageSync(key, {
      data,
      expire: Date.now() + ttlMinutes * 60 * 1000,
    });
  },
  get: (key: string): any | null => {
    try {
      const cached = Taro.getStorageSync(key);
      if (!cached) return null;
      if (Date.now() > cached.expire) {
        Taro.removeStorageSync(key);
        return null;
      }
      return cached.data;
    } catch {
      return null;
    }
  },
  clear: () => Taro.clearStorageSync(),
  remove: (key: string) => {
    try {
      Taro.removeStorageSync(key);
    } catch {}
  },
};
