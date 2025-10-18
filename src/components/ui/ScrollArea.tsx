import clsx from "clsx";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  // Extends all div attributes

export function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return (
    <div
      className={clsx(
        "overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800",
        className,
      )}
      {...props}
    />
  );

export default ScrollArea;
}}
