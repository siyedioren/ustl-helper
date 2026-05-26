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

  render() {
    return this.props.children;
  }
}
