"use client";

import { Component, ReactNode } from "react";
// Icons removed for performance

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4 text-brand-error text-6xl">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">حدث خطأ غير متوقع</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || "حدث خطأ في التطبيق"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="btn-brand px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              🔄 إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
