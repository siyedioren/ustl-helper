import { View } from "@tarojs/components";
import type { FC } from "react";
import { useEffect, useState } from "react";

import useStore from "@/store";

import styles from "./index.module.scss";
import { requestOneSentence } from "./model";

export const Sentence: FC = () => {
  const [image, setImage] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const cachedSentence = useStore((state) => state.cache.sentence);
  const setSentenceCache = useStore((state) => state.setSentence);

  useEffect(() => {
    // 优先从 store 读取（首页聚合接口可能已写入）
    if (cachedSentence && typeof cachedSentence === "string") {
      setContent(cachedSentence);
    }

    requestOneSentence().then(res => {
      if (res) {
        setImage(res.image);
        setNote(res.note);
        setContent(res.content);
        setSentenceCache(res.content);
      }
    });
  }, []);

  return (
    <View>
      <View className={styles.content}>{content}</View>
      <View className={styles.note}>{note}</View>
    </View>
  );
};
