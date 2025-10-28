"use client";

import { _AlertTriangle, RefreshCw } from "lucide-react";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (_error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(_props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to monitoring service
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined as unknown as Error,
      errorInfo: undefined as unknown as ErrorInfo,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <div className="text-center">
              <h1 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                We&apos;re sorry, but something unexpected happened. Please try
                again.
              </p>

              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--brand-primary)] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center px-4 py-2 border border-[var(--brand-border)] text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-[var(--brand-surface)] focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Reload Page
                </button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
