import { View } from "@tarojs/components";
import type { FC } from "react";
import { useEffect, useState } from "react";

import styles from "./index.module.scss";
import { requestOneSentence } from "./model";

export const Sentence: FC = () => {
  const [image, setImage] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    requestOneSentence().then(res => {
      if (res) {
        setImage(res.image);
        setNote(res.note);
        setContent(res.content);
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
