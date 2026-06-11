import Taro from "@tarojs/taro";

/**
 * 通过云函数获取云存储文件的临时下载链接（有效期 2 小时）
 * 前端直接调用 getTempFileURL 可能受权限限制，走云函数绕开
 * @param fileID 云文件 ID 或 cloud:// 路径
 */
export function getCloudFileURL(fileID: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: "getFileURL",
      data: { fileID },
      success: res => {
        const result = res.result as any;
        if (result && result.code === 0 && result.data) {
          resolve(result.data);
        } else {
          reject(new Error(result?.msg || "getFileURL failed"));
        }
      },
      fail: reject,
    });
  });
}
