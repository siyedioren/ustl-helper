import Taro from "@tarojs/taro";

const PREFIX = "USTL:";

const toNewKey = (key: string) => PREFIX + key;

export const Cache = {
  set: (key: string, data: any, ttlMinutes: number) => {
    Taro.setStorageSync(toNewKey(key), {
      data,
      expire: Date.now() + ttlMinutes * 60 * 1000,
    });
  },
  get: (key: string): any | null => {
    try {
      // 1. 先读新 key
      const cached = Taro.getStorageSync(toNewKey(key));
      if (cached) {
        if (Date.now() > cached.expire) {
          Taro.removeStorageSync(toNewKey(key));
          return null;
        }
        return cached.data;
      }

      // 2. 兼容旧 key：读到后迁移到新 key
      const oldCached = Taro.getStorageSync(key);
      if (oldCached) {
        if (Date.now() > oldCached.expire) {
          Taro.removeStorageSync(key);
          return null;
        }
        // 迁移到新 key
        Taro.setStorageSync(toNewKey(key), oldCached);
        Taro.removeStorageSync(key);
        return oldCached.data;
      }
      return null;
    } catch {
      return null;
    }
  },
  clear: () => Taro.clearStorageSync(),
  remove: (key: string) => {
    try {
      Taro.removeStorageSync(toNewKey(key));
      // 同时清理旧 key
      Taro.removeStorageSync(key);
    } catch {}
  },
};
