/**
 * SVG 图标映射表
 * key: 代码中使用的 Icon type
 * value: @/assets/svg/ 目录下的文件名（不含 .svg 后缀）
 *
 * 如果某个 type 没有对应 SVG，Icon 组件会自动 fallback 到 iconfont
 * 需要补充新图标时，只需在这里添加映射即可
 */

export const SVG_MAP: Record<string, string> = {
  // ===== 首页核心功能 =====
  map: "map",                 // 校园地图
  nav: "nav",                 // 校园导览 / 导航
  calendar: "calendar",       // 校历 / 日历
  gonggao: "notice",          // 新生必看 / 公告 / 通知 / 网址导航 / 电话簿 / 校园新闻

  // ===== 快捷工具 =====
  calc: "calculator",         // GPA计算器（急需，原 iconfont 缺失）
  clock: "clock",             // 考试倒计时 / 历史记录

  // ===== 箭头 =====
  "arrow-right": "arrow-right",
  "arrow-left": "arrow-left",
  "arrow-lift": "arrow-left", // 兼容代码里的拼写错误

  // ===== 操作按钮 =====
  x: "close",                 // 关闭 / 叉号
  star: "star",               // 收藏
  heart: "heart",             // 赞赏 / 爱心
  search: "search",           // 搜索
  phone: "phone",             // 电话 / 拨打
  setting: "setting",         // 设置 / 主题 / 齿轮
  refresh: "refresh",         // 刷新
  delete: "delete",           // 删除 / 垃圾桶

  // ===== 文件操作 =====
  upload: "upload",
  download: "download",

  // ===== 状态提示 =====
  loading: "loading",
  error: "error",
  success: "check",            // 对勾 / 成功
  info: "info",                // 信息 / 关于
  warning: "warning",          // 警告 / 三角

  // ===== 用户中心 =====
  theme: "palette",            // 主题 / 调色板
  clear: "trash",              // 清除缓存
  feedback: "message",           // 反馈 / 消息
  qq: "chat",                  // QQ群 / 聊天
  logout: "logout",            // 退出登录

  // ===== 页面内操作 =====
  link: "link",                // 链接 / 网址导航内
  location: "pin",             // 位置 / 定位
  time: "time",                // 时间 / 计时器
  share: "share",              // 分享
  copy: "copy",                // 复制
  add: "plus",                 // 添加 / 加号
  empty: "empty",              // 空状态

  // ===== 其他常用 =====
  edit: "edit",                // 编辑 / 铅笔
  eye: "eye",                  // 查看 / 眼睛
  more: "more",                // 更多 / 省略号
  filter: "filter",            // 筛选 / 漏斗
  sort: "sort",                // 排序
  top: "top",                  // 返回顶部
  scan: "scan",                // 扫码
  camera: "camera",             // 相机
  image: "image",              // 图片
  file: "file",                // 文件
  help: "help",                // 帮助 / 问号
  tip: "tip",                  // 提示 / 灯泡
  notice: "notice",            // 通知 / 铃铛

  // ===== tabBar（如果未来想用 SVG 替换 PNG）=====
  home: "home",
  func: "app",
  campus: "campus",
  user: "user",
  "index-active": "home-fill",
  "func-active": "app-fill",
  "plus-active": "campus-fill",
  "user-active": "user-fill",
};

/**
 * 检查某个 type 是否有对应的 SVG
 */
export function hasSvg(type: string): boolean {
  return type in SVG_MAP;
}

/**
 * 获取 SVG 文件路径
 * 注意：这是给 Icon 组件内部使用的，外部不要直接调用
 */
export function getSvgFileName(type: string): string | undefined {
  return SVG_MAP[type];
}
