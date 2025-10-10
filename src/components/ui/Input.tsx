import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends all input attributes
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "block w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500",
        className,
      )}
      {...props}
    />
  );
}

export default Input;
