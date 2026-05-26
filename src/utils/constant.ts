export { PATH } from "../config/page";

export const CACHE = {
  WEATHER: "WEATHER",
  SENTENCE: "SENTENCE",
  SENTENCE_LONG: "SENTENCE_LONG",
  USER: "USER",
  TIMETABLE_WEEK: "TIMETABLE:",
  ANNOUNCE_INDEX: "ANNOUNCE_INDEX",
  USER_INFO: "USER_INFO",
  PLUS_TABLE: "PLUS_TABLE",
  PLUS_LAST_LOGGED_IN: "PLUS_LAST_LOGGED_IN",
};

// 原 SHST 后端地址已移除，现使用微信云开发
export const DEV_HOST = "";
export const PROD_HOST = "";
export const REMOTE_STATIC = "";

// 简化日期工具，避免 laser-utils 预打包兼容问题
const pad = (n: number) => (n < 10 ? "0" + n : String(n));
export const TODAY = `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(new Date().getDate())}`;
