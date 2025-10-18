"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";

import { useT } from "@/hooks/useT";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;

}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service
    this.logError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // Send error to logging service
    fetch("/api/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(logger.error);
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
        />
      );

    return this.props.children;
  }

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  onGoHome: () => void;

}

function ErrorFallback({ error, onRetry, onGoHome }: ErrorFallbackProps) {
  const { t } = useT();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-gray-900 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-brand-error" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("error.boundary.title")}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("error.boundary.description")}
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
              {t("error.boundary.technical_details")}
            </summary>
            <pre className="text-xs text-brand-error dark:text-red-400 bg-surface dark:bg-red-900/20 p-3 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onRetry} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("error.boundary.retry")}
          </Button>
          <Button onClick={onGoHome} variant="outline" className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            {t("error.boundary.go_home")}
          </Button>
        </div>
      </Card>
    </div>
  );

// Hook for functional components
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    // Log error
    fetch("/api/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(logger.error);
  };

  return { handleError };
}}}}}}}}}}}
