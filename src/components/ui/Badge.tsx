import clsx from "clsx";

import { _COMPONENT_CLASSES } from "@/lib/centralized-theme";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"
  | "brand"
  | "error";

export function __Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const __styles = {
    default: `${COMPONENT_CLASSES.badge} bg-brand-surface text-foreground`,
    primary: COMPONENT_CLASSES["badge-brand"],
    secondary: `${COMPONENT_CLASSES.badge} bg-brand-surface text-foreground border border-brand-border`,
    destructive: `${COMPONENT_CLASSES.badge} bg-brand-error/10 text-brand-error`,
    success: COMPONENT_CLASSES["badge-success"],
    warning: COMPONENT_CLASSES["badge-warning"],
    danger: COMPONENT_CLASSES["badge-error"],
    info: COMPONENT_CLASSES["badge-info"],
    outline: `${COMPONENT_CLASSES.badge} bg-transparent text-foreground border border-brand-border`,
    brand: `${COMPONENT_CLASSES.badge} bg-brand-primary text-white`,
    error: COMPONENT_CLASSES["badge-error"],
  } as const;

  return <span className={clsx(styles[variant], className)} {...props} />;
}

export default Badge;
