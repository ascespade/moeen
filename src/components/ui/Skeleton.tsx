import clsx from "clsx";

export function __Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 dark:bg-gray-800 rounded",
        className,
      )}
    />
  );
}

export default Skeleton;
