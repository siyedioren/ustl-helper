import Taro from "@tarojs/taro";

export interface BannerItem {
  image: string;
  author?: string;
}

function isCloudFileID(value: string): boolean {
  return value && value.startsWith("cloud://");
}

export async function resolveCloudUrls(list: (string | BannerItem)[]): Promise<BannerItem[]> {
  const normalized: BannerItem[] = list.map((item) =>
    typeof item === "string" ? { image: item } : { ...item }
  );

  const cloudIds: string[] = [];
  const indexMap: number[] = [];
  normalized.forEach((item, idx) => {
    if (isCloudFileID(item.image)) {
      cloudIds.push(item.image);
      indexMap.push(idx);
    }
  });

  if (cloudIds.length === 0) {
    return normalized;
  }

  try {
    const res: any = await Taro.cloud.callFunction({
      name: "resolveFiles",
      data: { list: cloudIds },
    });
    if (res.result && res.result.code === 0 && Array.isArray(res.result.data)) {
      res.result.data.forEach((url: string, i: number) => {
        normalized[indexMap[i]].image = url;
      });
    } else {
      console.log("resolveFiles returned error:", res.result);
    }
  } catch (err) {
    // 解析失败时清空 cloud:// 地址，避免 Image 把它当成相对路径拼接
    console.log("resolve cloud files error:", err);
    indexMap.forEach((idx) => {
      normalized[idx].image = "";
    });
  }

  return normalized;
}
