export default defineAppConfig({
  pages: [
    "pages/index/index/index",
    "pages/func/index/index",
    "pages/func/campus/map/index",
    "pages/user/index/index",
    "pages/user/favorites/index",
    "pages/user/history/index",
    "pages/app/404/index",
    "pages/func/campus/guide/index",
    "pages/func/campus/guide/pages/detail/index",
    "pages/func/campus/calendar/index",
    "pages/func/campus/freshman/index",
    "pages/func/campus/freshman/pages/detail/index",
    "pages/app/webview/index",
  ],
  subPackages: [
    {
      root: "pages/plus",
      pages: [
        "tools/gpa/index",
        "tools/countdown/index",
        "info/websites/index",
        "info/life/index",
        "info/phonebook/index",
        "info/news/index",
        "info/news/pages/detail/index",
        "info/announcements/index",
        "info/announcements/pages/detail/index",
      ],
    },
  ],
  window: {
    // @ts-expect-error color var
    navigationBarTextStyle: "@navigationBarTextStyle",
    navigationBarTitleText: "了科小站",
    navigationBarBackgroundColor: "@navigationBarBackgroundColor",
    backgroundColor: "@backgroundColor",
  },
  tabBar: {
    color: "@tabBarColor",
    selectedColor: "@tabBarSelectedColor",
    backgroundColor: "@backgroundColor",
    list: [
      {
        iconPath: "./static/index.png",
        selectedIconPath: "./static/index-active.png",
        pagePath: "pages/index/index/index",
        text: "首页",
      },
      {
        iconPath: "./static/func.png",
        selectedIconPath: "./static/func-active.png",
        pagePath: "pages/func/index/index",
        text: "功能",
      },
      {
        iconPath: "./static/plus.png",
        selectedIconPath: "./static/plus-active.png",
        pagePath: "pages/func/campus/map/index",
        text: "校园",
      },
      {
        iconPath: "./static/user.png",
        selectedIconPath: "./static/user-active.png",
        pagePath: "pages/user/index/index",
        text: "我的",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
  darkmode: true,
  themeLocation: "config/theme.json",
  permission: {
    "scope.userLocation": {
      desc: "您的位置信息将用于校园地图定位功能",
    },
  },
  requiredPrivateInfos: ["getLocation"],
});
