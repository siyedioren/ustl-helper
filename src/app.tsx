import "./styles/global.scss";

import Taro, { useError, useLaunch, usePageNotFound } from "@tarojs/taro";
import type { FC } from "react";

import { App as AppAPI } from "./utils/app";
import { CLOUD_ENV } from "./config/cloud";
import { PATH } from "./utils/constant";
import { Nav } from "./utils/nav";

const AppLauncher: FC = ({ children }) => {
  useLaunch(() => {
    // 初始化微信云开发（图书检索需要使用云函数代理请求图书馆 OPAC）
    Taro.cloud.init({
      env: CLOUD_ENV,
      traceUser: true,
    });
    AppAPI.update();
    AppAPI.init();
  });

  usePageNotFound(() => {
    Nav.launch(PATH.HOME);
  });

  // `children`是将要会渲染的页面
  return <>{children}</>;
};

export default AppLauncher;
