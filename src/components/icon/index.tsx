import type { ITouchEvent } from "@tarojs/components";
import { Image, Text } from "@tarojs/components";
import { cs } from "laser-utils";
import type { FC } from "react";

import styles from "./index.modules.scss";

/** 有 PNG 图标文件的 type 映射 */
const PNG_MAP: Record<string, string> = {
  account: "user",
  add: "add",
  "arrow-left": "arrow-left",
  "arrow-lift": "arrow-left",
  "arrow-right": "arrow-right",
  bell: "bell",
  book: "book",
  bus: "compass",
  calc: "calculator",
  calendar: "calendar",
  camera: "camera",
  cancel: "cancel",
  chat: "chat",
  checkbox: "checkbox",
  clock: "clock",
  close: "close",
  compass: "compass",
  copy: "copy",
  delete: "delete",
  download: "download",
  edit: "edit",
  empty: "empty",
  error: "error",
  eye: "eye",
  fankui: "feedback",
  feedback: "feedback",
  file: "file",
  filter: "filter",
  gonggao: "notice",
  grade: "calculator",
  heart: "heart",
  history: "history",
  image: "image",
  info: "info",
  jia: "chat",
  jihua: "history",
  library: "library",
  link: "link",
  loading: "loading",
  location: "location",
  logout: "logout",
  map: "location",
  minus: "minus",
  more: "more",
  nav: "compass",
  notice: "notice",
  phone: "phone",
  pin: "pin",
  refresh: "refresh",
  scan: "scan",
  search: "search",
  setting: "setting",
  share: "share",
  shujia: "book",
  sort: "sort",
  star: "star",
  success: "success",
  theme: "theme",
  timer: "timer",
  "to-top": "to-top",
  trash: "trash",
  upload: "upload",
  user: "user",
  x: "close",
  zanshang: "heart",
  "zoom-in": "zoom-in",
};

export const Icon: FC<{
  type: string;
  size?: number;
  className?: string;
  space?: boolean;
  dilute?: boolean;
  color?: string;
  onClick?: (event: ITouchEvent) => void;
}> = props => {
  const pngName = PNG_MAP[props.type];

  // 如果有对应的 PNG 图标，使用 Image 组件显示
  if (pngName) {
    return (
      <Image
        src={`/static/icon/${pngName}.png`}
        className={cs(styles.pngIcon, props.className)}
        style={{
          width: props.size ? `${props.size}px` : "28px",
          height: props.size ? `${props.size}px` : "28px",
        }}
        onClick={props.onClick}
        mode="aspectFit"
      />
    );
  }

  // 回退到 iconfont 字体图标
  return (
    <Text
      className={cs(
        "shst-icon",
        `icon-${props.type}`,
        props.space && styles.space,
        props.dilute && styles.dilute,
        props.className
      )}
      onClick={props.onClick}
      style={{ fontSize: props.size || 28, color: props.color }}
    ></Text>
  );
};
