import { View, Button } from "@tarojs/components";
import React from "react";

import { Layout } from "@/components/layout";
import "./index.scss";
import { PATH } from "@/config/page";
import { Nav } from "@/utils/nav";

export default function NotFound() {
  return (
    <React.Fragment>
      <Layout title="提示" topSpace>
        <View className="a-flex a-flex-center a-flex-column a-lmt">
          <View className="a-fontsize-18 a-color-grey">页面不存在</View>
          <View className="a-lmt">
            <Button type="primary" size="mini" onClick={() => Nav.tab(PATH.HOME)}>
              返回首页
            </Button>
          </View>
        </View>
      </Layout>
    </React.Fragment>
  );
}

NotFound.onShareAppMessage = () => void 0;
NotFound.onShareTimeline = () => void 0;
