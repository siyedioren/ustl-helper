import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { ErrorInfo } from "react";
import { Component } from "react";

import { Report } from "@/utils/report";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    try {
      Report.error(error, String(errorInfo));
    } catch (e) {
      console.error(e);
    }
  }

  handleGoBack = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) {
      Taro.navigateBack();
    } else {
      Taro.reLaunch({ url: "/pages/index/index/index" });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="error-page">
          <View className="error-icon">⚠️</View>
          <View className="error-text">页面出错了，请返回重试</View>
          <View className="error-btn" onClick={this.handleGoBack}>
            返回首页
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
