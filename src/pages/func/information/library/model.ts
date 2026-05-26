import Taro from "@tarojs/taro";

export type BookType = {
  id: string;
  infoList: string[];
  isbn: string;
  img: string;
};

export type SearchResult = {
  list: BookType[];
  page: number;
  totalPage: number;
};

/** 调用云函数查询图书馆馆藏 */
export const requestForBooks = (name: string, page: number): Promise<SearchResult> => {
  return Taro.cloud
    .callFunction({
      name: "librarySearch",
      data: { keyword: name, page },
    })
    .then(res => {
      const result = res.result as any;
      if (result.code !== 0) {
        throw new Error(result.msg || "查询失败");
      }
      return {
        list: (result.data.list || []).map((item: any) => ({
          id: item.id || "",
          infoList: item.infoList || [],
          isbn: item.isbn || "",
          img: item.img || "",
        })),
        page: result.data.page || 1,
        totalPage: result.data.totalPage || 1,
      };
    });
};

/** 辽科大图书馆无封面接口，直接返回空 */
export const requestForCovers = (isbnGroup: string[]) => {
  if (!isbnGroup.length) return Promise.resolve({} as Record<string, string>);
  return Promise.resolve(
    isbnGroup.reduce((pre, cur) => ({ ...pre, [cur]: "" }), {} as Record<string, string>)
  );
};
