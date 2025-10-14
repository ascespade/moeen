import clsx from "clsx";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"
  | "brand"
  | "error";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const styles = {
    default:
      "badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success: "badge badge-success",
    warning: "badge badge-warning",
    danger: "badge badge-error",
    info: "badge badge-info",
    outline:
      "badge bg-transparent text-gray-700 border border-[var(--brand-border)] dark:text-gray-200 dark:border-gray-800",
    brand:
      "badge bg-[var(--brand-primary)] text-white border border-transparent",
    error: "badge badge-error",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    warning:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  } as const;

  return (
    <span
      className={clsx(styles[variant], className)}
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

export default Badge;
