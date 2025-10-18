export function Skeleton({ className }: { className?: string }) {
import clsx from "clsx";

  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 dark:bg-gray-800 rounded",
        className,
      )}
    />
  );
}

