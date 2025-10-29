'use client';

import { log } from '@/lib/logger';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    log.error('Error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
          <div className='max-w-md rounded-lg bg-white p-8 shadow-lg'>
            <h1 className='mb-4 text-2xl font-bold text-gray-900'>
              حدث خطأ ما
            </h1>
            <p className='mb-6 text-gray-600'>
              نعتذر، حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة أو المحاولة لاحقاً.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='w-full rounded-md bg-[var(--brand-default)] px-4 py-2 text-white hover:bg-[var(--brand-default)]/90'
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

