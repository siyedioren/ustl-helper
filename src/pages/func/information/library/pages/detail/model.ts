import Taro from "@tarojs/taro";

export type BookDetail = {
  name: string;
  info: string[];
  storage: string[];
};

/** 调用云函数查询图书详情 */
export const requestForBookDetail = (id: string): Promise<BookDetail | null> => {
  return Taro.cloud
    .callFunction({
      name: "libraryDetail",
      data: { id },
    })
    .then(res => {
      const result = res.result as any;
      if (result.code !== 0 || !result.data) return null;
      return {
        name: result.data.name || "",
        info: result.data.info || [],
        storage: result.data.storage || [],
      };
    })
    .catch(() => null);
};
