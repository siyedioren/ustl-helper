import Taro from "@tarojs/taro";

import { CLOUD_ENV } from "../config/cloud";
import { Toast } from "./toast";

export const App = {
  data: {
    project: "了科小站",
    tmp: {
      book: null as any,
    },
  },
  init: () => {
    // 初始化微信云开发
    Taro.cloud.init({
      env: CLOUD_ENV,
      traceUser: true,
    });
  },
  onload: (func: () => void) => {
    func();
    return Promise.resolve();
  },
  update: () => {
    if (!Taro.getUpdateManager) return;
    Taro.getUpdateManager().onCheckForUpdate(res => {
      console.log("Update:", res.hasUpdate);
      if (!res.hasUpdate) return void 0;
      Taro.getUpdateManager().onUpdateReady(() => {
        Toast.confirm("更新提示", "新版本已经准备好，单击确定重启应用").then(result => {
          if (result) Taro.getUpdateManager().applyUpdate();
        });
      });
      Taro.getUpdateManager().onUpdateFailed(() => {
        Toast.modal("提示", "检查到有新版本，但下载失败，请检查网络设置");
      });
    });
  },
};
