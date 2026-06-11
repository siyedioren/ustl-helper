import Taro from "@tarojs/taro";

import { PATH } from "./constant";

const fail = (e: TaroGeneral.CallbackResult) => console.log(e);

export const Nav = {
  /** 跳转到指定页面 */
  to: (url: string) => Taro.navigateTo({ url, fail }),
  /** 打开指定 Tab 页 */
  tab: (url: string) => Taro.switchTab({ url, fail }),
  /** 重载小程序到指定页面 */
  launch: (url: string) => Taro.reLaunch({ url, fail }),
  /** 返回上 1/N 页 */
  back: (delta = 1) => Taro.navigateBack({ delta, fail }),
  /** 重定向到指定页 */
  redirect: (url: string) => Taro.redirectTo({ url, fail }),
  /** 使用 WebView 打开页面 */
  webview: (url: string) =>
    Taro.navigateTo({
      url: PATH.WEBVIEW + "?url=" + encodeURIComponent(url),
      fail,
    }),
};
