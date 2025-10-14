export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="mb-4 h-5 w-32" />
      <div className="grid h-40 grid-cols-12 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full self-end"
            style={{ height: `${20 + (i % 10) * 6}px` }}
          >
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
