export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

export function ChartSkeleton() {
  return (
    <div className='p-4'>
      <Skeleton className='h-5 w-32 mb-4' />
      <div className='grid grid-cols-12 gap-2 h-40'>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className='w-full self-end'
            style={{ height: `${20 + (i % 10) * 6}px` }}
          >
            <Skeleton className='w-full h-full' />
          </div>
        ))}
      </div>
    </div>
  );
}
