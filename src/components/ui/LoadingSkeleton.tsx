'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  count?: number;
}

export function LoadingSkeleton({
  className = '',
  width = '100%',
  height = '20px',
  count = 1,
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
          style={{ width, height }}
          aria-label="جاري التحميل..."
          role="status"
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4" role="status" aria-label="جاري تحميل البطاقة...">
      <LoadingSkeleton height="24px" width="60%" />
      <LoadingSkeleton height="16px" count={3} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="جاري تحميل الجدول...">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton height="40px" width="100%" />
        </div>
      ))}
    </div>
  );
}
