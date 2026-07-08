import "./index.scss";

import { Button, Image, Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState } from "react";

import { Icon } from "@/components/icon";
import { Layout } from "@/components/layout";
import { PATH } from "@/config/page";
import useStore from "@/store";
import { Nav } from "@/utils/nav";
import { Toast } from "@/utils/toast";

import styles from "./index.module.scss";

const THEME_OPTIONS = ["跟随系统", "浅色", "深色"];

export default function User() {
  const user = useStore((state) => state.user);
  const cache = useStore((state) => state.cache);
  const setUser = useStore((state) => state.setUser);
  const setCache = useStore((state) => state.setCache);
  const setTheme = useStore((state) => state.setTheme);
  const clearHistory = useStore((state) => state.clearHistory);
  const clearFavorites = useStore((state) => state.clearFavorites);
  const setGpaCourses = useStore((state) => state.setGpaCourses);
  const theme = useStore((state) => state.app.theme);
  const themeIndex = THEME_OPTIONS.indexOf(theme === "auto" ? "跟随系统" : theme === "dark" ? "深色" : "浅色");

  const [tempAvatar, setTempAvatar] = useState("");
  const [tempNickname, setTempNickname] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useLoad(() => {
    Taro.cloud.callFunction({ name: "checkAdmin" })
      .then((res: any) => {
        if (res.result && res.result.isAdmin) setIsAdmin(true);
      })
      .catch(() => {});
  });

  const handleChooseAvatar = (e: any) => {
    const url = e.detail?.avatarUrl || "";
    if (url) setTempAvatar(url);
  };

  const handleConfirmLogin = () => {
    if (!tempNickname.trim()) {
      Toast.info("请输入昵称");
      return;
    }

    const doLogin = (avatarUrl: string) => {
      Taro.login({
        success: (res) => {
          Taro.cloud
            .callFunction({ name: "login", data: { code: res.code } })
            .then((r: any) => {
              const openid = r.result?.openid || "";
              setUser({
                openid,
                avatar: avatarUrl,
                nickname: tempNickname.trim(),
                isLogin: true,
              });
              Toast.info("登录成功");
            })
            .catch(() => {
              Toast.info("登录失败，请重试");
            });
        },
        fail: () => {
          Toast.info("登录失败，请重试");
        },
      });
    };

    if (tempAvatar && (tempAvatar.startsWith("http://tmp/") || tempAvatar.startsWith("wxfile://"))) {
      Taro.cloud
        .uploadFile({
          cloudPath: `avatars/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png`,
          filePath: tempAvatar,
        })
        .then((res: any) => {
          doLogin(res.fileID);
        })
        .catch(() => {
          Toast.info("头像上传失败，使用临时链接");
          doLogin(tempAvatar);
        });
    } else {
      doLogin(tempAvatar);
    }
  };

  const handleLogout = () => {
    setUser({
      openid: null,
      avatar: "",
      nickname: "",
      isLogin: false,
    });
    Toast.info("已退出登录");
  };

  const onThemeChange = (e: any) => {
    const idx = e.detail.value as number;
    const map: Record<string, "auto" | "light" | "dark"> = {
      跟随系统: "auto",
      浅色: "light",
      深色: "dark",
    };
    setTheme(map[THEME_OPTIONS[idx]]);
    Toast.info(`主题已切换为${THEME_OPTIONS[idx]}`);
  };

  const handleClearCache = () => {
    setCache({ weather: null, sentence: "" });
    Toast.info("缓存已清除");
  };

  const handleResetData = () => {
    clearHistory();
    clearFavorites();
    setGpaCourses([]);
    Toast.info("数据已重置");
  };

  return (
    <React.Fragment>
      {/* 用户信息区 */}
      <View className={styles.userHeader}>
        {user.isLogin ? (
          <View className={styles.userInfo}>
            <Image className={styles.avatar} src={user.avatar || ""} mode="aspectFill" />
            <Text className={styles.nickname}>{user.nickname || "微信用户"}</Text>
          </View>
        ) : isLoggingIn ? (
          <View className={styles.userInfo}>
            <Button
              className={styles.avatarChooseBtn}
              openType="chooseAvatar"
              onChooseAvatar={handleChooseAvatar}
            >
              {tempAvatar ? (
                <Image className={styles.avatar} src={tempAvatar} mode="aspectFill" />
              ) : (
                <View className={styles.avatarPlaceholder}>
                  <Icon type="account" size={40} color="#999" />
                </View>
              )}
            </Button>
            <Input
              className={styles.nicknameInput}
              type="nickname"
              placeholder="请输入昵称"
              value={tempNickname}
              onBlur={(e) => setTempNickname(e.detail.value)}
            />
            <View className={styles.loginActions}>
              <Button
                className={styles.loginConfirmBtn}
                type="primary"
                size="mini"
                onClick={handleConfirmLogin}
              >
                确认登录
              </Button>
              <Button
                className={styles.loginCancelBtn}
                size="mini"
                onClick={() => {
                  setIsLoggingIn(false);
                  setTempAvatar("");
                  setTempNickname("");
                }}
              >
                取消
              </Button>
            </View>
          </View>
        ) : (
          <View className={styles.userInfo}>
            <Button
              className={styles.loginMainBtn}
              type="primary"
              size="mini"
              onClick={() => setIsLoggingIn(true)}
            >
              点击登录
            </Button>
          </View>
        )}
      </View>

      {/* 功能入口区 */}
      <Layout title="功能入口" topSpace>
        <View className={styles.entryList}>
          <View className={styles.entryItem} onClick={() => Nav.to("/pages/user/favorites/index")}>
            <View className={styles.entryLeft}>
              <View className={styles.entryIcon} style={{ background: "rgb(var(--arcoblue-1))" }}>
                <Icon type="shujia" size={20} color="rgb(var(--arcoblue-6))" />
              </View>
              <Text className={styles.entryLabel}>我的收藏</Text>
            </View>
            <Icon type="arrow-right" size={14} color="#c9cdd4" />
          </View>
          <View className={styles.entryItem} onClick={() => Nav.to("/pages/user/history/index")}>
            <View className={styles.entryLeft}>
              <View className={styles.entryIcon} style={{ background: "rgb(var(--green-1))" }}>
                <Icon type="jihua" size={20} color="rgb(var(--green-6))" />
              </View>
              <Text className={styles.entryLabel}>浏览历史</Text>
            </View>
            <Icon type="arrow-right" size={14} color="#c9cdd4" />
          </View>
          <View className={styles.entryItem} onClick={() => Nav.to("/pages/plus/tools/gpa/index")}>
            <View className={styles.entryLeft}>
              <View className={styles.entryIcon} style={{ background: "rgb(var(--orange-1))" }}>
                <Icon type="grade" size={20} color="rgb(var(--orange-6))" />
              </View>
              <Text className={styles.entryLabel}>GPA计算器</Text>
            </View>
            <Icon type="arrow-right" size={14} color="#c9cdd4" />
          </View>
        </View>
      </Layout>

      {/* 设置区 */}
      <Layout title="设置" topSpace>
        <View className={styles.line}>
          <Text>主题设置</Text>
          <Picker mode="selector" range={THEME_OPTIONS} value={themeIndex} onChange={onThemeChange}>
            <Text className={styles.version}>{THEME_OPTIONS[themeIndex]}</Text>
          </Picker>
        </View>
        <View className={styles.line} onClick={handleClearCache}>
          <Text>清除缓存</Text>
          <Text className={styles.version}>{cache.sentence ? "有缓存" : "无缓存"}</Text>
        </View>
        <View className={styles.line} onClick={handleResetData}>
          <Text>重置数据</Text>
          <Icon type="arrow-right" size={14} color="#999" />
        </View>
        <View className={styles.line} onClick={() => Toast.info("了科小站 v1.0")}>
          <Text>关于我们</Text>
          <Icon type="arrow-right" size={14} color="#999" />
        </View>
        {isAdmin && (
          <View className={styles.line} onClick={() => Nav.to("/pages/plus/info/stats/index")}>
            <Text>数据统计</Text>
            <Icon type="arrow-right" size={14} color="#999" />
          </View>
        )}
      </Layout>

      {/* 反馈区 */}
      <Layout title="反馈" topSpace>
        <View className={styles.line} onClick={() => Toast.info("功能开发中")}>
          <Text>问题反馈</Text>
          <Icon type="fankui" size={14} color="#999" />
        </View>
        <View className={styles.line} onClick={() => Toast.info("功能开发中")}>
          <Text>加入QQ群</Text>
          <Icon type="jia" size={14} color="#999" />
        </View>
        <View className={styles.line} onClick={() => Toast.info("功能开发中")}>
          <Text>赞赏支持</Text>
          <Icon type="zanshang" size={14} color="#999" />
        </View>
      </Layout>

      {/* 退出登录 */}
      {user.isLogin && (
        <View className={styles.logoutWrap}>
          <Button type="warn" size="mini" className={styles.logoutBtn} onClick={handleLogout}>
            退出登录
          </Button>
        </View>
      )}
    </React.Fragment>
  );
}

User.onShareAppMessage = () => ({ title: "了科小站", path: PATH.USER });
User.onShareTimeline = () => void 0;
