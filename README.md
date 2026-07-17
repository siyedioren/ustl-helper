# 了科小站 · 辽科大校园助手

<p align="center">
  基于 Taro + 微信云开发的辽宁科技大学校园生活助手小程序
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Taro-3.6.19-0f5fff" alt="Taro 3.6.19">
  <img src="https://img.shields.io/badge/React-17-61dafb" alt="React 17">
  <img src="https://img.shields.io/badge/TypeScript-5.1-3178c6" alt="TypeScript 5.1">
  <img src="https://img.shields.io/badge/微信云开发-Cloud-07c160" alt="微信云开发">
</p>

---

## 简介

「了科小站」是面向辽宁科技大学在校师生的校园助手微信小程序，集校园地图、资讯聚合、学业工具、生活服务为一体，让新生不迷路、老生更高效。

> **小程序搜索**：微信搜索「了科小站」即可体验

## 功能模块

| 模块 | 说明 | 状态 |
|---|---|---|
| **首页聚合** | 精选校园风光、天气、公告、快捷入口 | ✅ |
| **校园地图** | 辽科大主要建筑标注，支持定位与导航 | ✅ |
| **校园导览** | 校园路线、建筑介绍、卫星图坐标 | ✅ |
| **新生攻略** | 入学流程、必看事项、常见问题 | ✅ |
| **校历** | 学期时间节点、假期安排 | ✅ |
| **校园公交** | 校内公交线路与站点导航 | ✅ |
| **GPA 计算器** | 绩点快速计算 | ✅ |
| **倒计时** | 考试、纪念日倒计时 | ✅ |
| **公告** | 学校公告聚合与分类筛选 | ✅ |
| **校园风光** | 照片投稿墙、精选展示、管理员审核 | ✅ |
| **常用网站** | 教务、图书馆、官网等快捷入口 | ✅ |
| **电话簿** | 校内常用电话 | ✅ |
| **周边生活** | 校园周边生活服务 | ✅ |
| **我的收藏/历史** | 个人收藏与浏览记录 | ✅ |

> **课表 / 成绩**：学校使用超星云教务系统，暂无法自动对接，后续将持续探索对接方案。

## 技术栈

- **跨端框架**：[Taro 3.6](https://taro.zone/) + React 17
- **语言**：TypeScript 5.1
- **状态管理**：Zustand 3.7
- **样式**：SCSS / CSS Modules
- **后端**：微信云开发（云函数 + 云数据库 + 云存储）
- **构建工具**：Webpack 5

## 项目结构

```
ustl helper/
├── cloudfunctions/          # 微信云函数
├── src/
│   ├── app.tsx             # 小程序入口
│   ├── app.config.ts       # 全局页面/TabBar 配置
│   ├── config/             # 配置文件（云开发环境等）
│   ├── pages/              # 页面
│   │   ├── index/          # 首页
│   │   ├── func/           # 功能页
│   │   ├── plus/           # 学业工具 / 资讯 / 生活（分包）
│   │   └── user/           # 我的
│   ├── static/             # 静态资源
│   ├── store/              # Zustand 状态管理
│   └── utils/              # 工具函数
├── project.config.json     # 微信小程序项目配置
├── package.json
└── CHANGELOG.md
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/siyedioren/ustl-helper.git
cd ustl-helper
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置微信云开发环境

1. 打开 `src/config/cloud.ts`，将 `CLOUD_ENV` 替换为你的**云开发环境 ID**：

```ts
export const CLOUD_ENV = "your-cloud-env-id";
```

2. 打开 `project.config.json`，将 `appid` 替换为你自己的**小程序 AppID**：

```json
{
  "appid": "your-appid"
}
```

> 本地敏感配置也可放在 `src/config/cloud.local.ts`（已加入 `.gitignore`），请确保不要将真实环境 ID 提交到仓库。

### 4. 本地开发

```bash
# 微信小程序
npm run dev:wx

# H5
npm run dev:h5
```

使用微信开发者工具导入 `dist/` 目录即可预览。

## 云函数部署

在微信开发者工具中，右键以下云函数 → **创建并部署：云端安装依赖**：

- `cloudfunctions/checkAdmin`
- `cloudfunctions/dataInit`
- `cloudfunctions/getBuildings`
- `cloudfunctions/getExams`
- `cloudfunctions/getFileURL`
- `cloudfunctions/homeAggregate`
- `cloudfunctions/login`
- `cloudfunctions/newsDetail`
- `cloudfunctions/photoManage`
- `cloudfunctions/postManage`
- `cloudfunctions/resolveFiles`
- `cloudfunctions/userStats`
- `cloudfunctions/weather`

## 数据库初始化

建筑坐标、校园导览、公告等数据存储在云数据库中。首次部署后，请在小程序管理员入口点击「初始化数据」，写入默认坐标与基础数据。

## 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)。

## 贡献

欢迎提交 Issue 或 Pull Request。如有功能建议或 Bug 反馈，也可以直接联系作者。

## 作者

- **Czy** — 项目开发与维护

## 许可证

本项目仅供学习交流使用，转载请注明出处。

---

> 辽科大校园助手，一「站」搞定校园生活。
