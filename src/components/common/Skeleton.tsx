import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`} />
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="grid grid-cols-12 gap-2 h-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-full self-end" style={{ height: `${20 + (i % 10) * 6}px` }}>
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}