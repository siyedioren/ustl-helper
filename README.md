# 辽科大校园助手（Ustl Helper）

基于 SHST-UNI-NEXT 改造的辽宁科技大学校园助手小程序。

## 功能模块

| 模块 | 状态 | 说明 |
|------|------|------|
| 校园地图 | ✅ | 辽科大在线地图，含主要建筑标注 |
| 图书检索 | ✅ | 对接图书馆汇文 OPAC，支持馆藏查询 |
| 课表/成绩 | ❌ | 学校使用超星云教务，暂无法自动对接 |

## 技术栈

- Taro 3.6 + React 17 + TypeScript
- 微信云开发（云函数代理图书馆 HTTP 请求）

## 敏感信息配置

1. 复制 `src/config/cloud.ts` 为 `src/config/cloud.local.ts`
2. 在 `cloud.local.ts` 中填入你的**微信云开发环境 ID**
3. `cloud.local.ts` 已被 `.gitignore` 排除，不会提交

```bash
# 本地配置示例
src/config/cloud.local.ts
export const CLOUD_ENV = "ustl-helper-xxx";
```

4. 打开 `project.config.json`，把 `appid` 换成你自己的小程序 AppID

## 云函数部署

在微信开发者工具中：
1. 右键 `cloudfunctions/librarySearch` → "创建并部署：云端安装依赖"
2. 右键 `cloudfunctions/libraryDetail` → "创建并部署：云端安装依赖"

## 地图坐标微调

`src/pages/func/sdust/map/index.tsx` 中的 Markers 为估算坐标，请根据实际位置微调。
