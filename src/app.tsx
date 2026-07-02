import "./styles/global.scss";

import Taro, { useLaunch, usePageNotFound } from "@tarojs/taro";
import { useEffect } from "react";
import type { FC } from "react";

import { ErrorBoundary } from "./components/error";
import { App as AppAPI } from "./utils/app";
import { CLOUD_ENV } from "./config/cloud";
import { PATH } from "./utils/constant";
import { Nav } from "./utils/nav";
import useStore from "./store";

const AppLauncher: FC = ({ children }) => {
  useLaunch(() => {
    // 初始化微信云开发（图书检索需要使用云函数代理请求图书馆 OPAC）
    Taro.cloud.init({
      env: CLOUD_ENV,
      traceUser: true,
    });
    AppAPI.update();
    AppAPI.init();

    // 设置全局 store 初始值（不覆盖持久化的 theme）
    useStore.getState().setApp({
      term: "2024-2025-2",
      termStart: "2025-02-24",
    });

  });

  const theme = useStore((state) => state.app.theme);

  useEffect(() => {
    const applyTheme = (currentTheme: "light" | "dark") => {
      Taro.setNavigationBarColor({
        frontColor: currentTheme === "dark" ? "#ffffff" : "#000000",
        backgroundColor: currentTheme === "dark" ? "#1a1a1a" : "#ffffff",
      });
      Taro.setTabBarStyle({
        color: currentTheme === "dark" ? "#666666" : "#999999",
        selectedColor: "#1890ff",
        backgroundColor: currentTheme === "dark" ? "#000000" : "#ffffff",
        borderStyle: currentTheme === "dark" ? "black" : "white",
      });
    };

    if (theme === "auto") {
      const systemInfo = Taro.getSystemInfoSync();
      applyTheme(systemInfo.theme || "light");

      const listener = (res: { theme: "light" | "dark" }) => applyTheme(res.theme);
      Taro.onThemeChange(listener);
      return () => {
        Taro.offThemeChange(listener);
      };
    }

    applyTheme(theme);
  }, [theme]);

  usePageNotFound(() => {
    Nav.launch(PATH.HOME);
  });

  // `children`是将要会渲染的页面
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default AppLauncher;
