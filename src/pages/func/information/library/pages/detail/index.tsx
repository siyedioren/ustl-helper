import { Image, View } from "@tarojs/components";
import { cs } from "@/utils/cs";
import React, { useState } from "react";

import { Layout } from "@/components/layout";
import { useOnLoad } from "@/hooks/use-onload";
import { App } from "@/utils/app";

import type { BookType } from "../../model";
import styles from "./index.module.scss";
import type { BookDetail } from "./model";
import { requestForBookDetail } from "./model";

export default function Index() {
  const [book, setBook] = useState<BookType | null>(null);
  const [detail, setDetail] = useState<BookDetail | null>(null);

  useOnLoad(e => {
    const bookTmp = App.data.tmp.book as BookType;
    const id = e.id;
    if (!bookTmp || !id) return void 0;
    App.data.tmp.book = null;
    setBook(bookTmp);
    requestForBookDetail(id).then(res => {
      if (!res) return void 0;
      setDetail(res);
    });
  });

  return (
    <React.Fragment>
      {book && (
        <Layout title="图书信息">
          <View className="y-center">
            <View className={cs(styles.img, "a-lmr a-flex-none")}>
              <Image className={cs(styles.img, "x-center y-center")} src={book.img}></Image>
            </View>
            <View className="tips-con">
              {detail && (
                <>
                  <View className="a-fontsize-16">{detail.name || book.infoList[0] || ""}</View>
                  {detail.info.map((item, idx) => (
                    <View key={idx} className="a-color-grey a-mt-6">{item}</View>
                  ))}
                </>
              )}
            </View>
          </View>
        </Layout>
      )}
      {detail && detail.storage.length > 0 && (
        <Layout topSpace title="馆藏信息">
          <View className="tips-con">
            {detail.storage.map((item, index) => (
              <View key={index}>
                {index !== 0 && <View className="a-gap-15"></View>}
                <View className="a-color-grey">{item}</View>
              </View>
            ))}
          </View>
        </Layout>
      )}
    </React.Fragment>
  );
}
