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
    default: "badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success: "badge badge-success",
    warning: "badge badge-warning",
    danger: "badge badge-error",
    info: "badge badge-info",
    outline: "badge bg-transparent text-gray-700 border border-[var(--brand-border)] dark:text-gray-200 dark:border-gray-800",
    brand: "badge bg-[var(--brand-primary)] text-white border border-transparent",
    error: "badge badge-error",
  } as const;

  return (
    <span
      className={clsx(styles[variant], className)}
      {...props}
    />
  );
}

export default Badge;
