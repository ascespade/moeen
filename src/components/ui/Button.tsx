"use client";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonStyles = cva("btn", {
  variants: {
    variant: {
      primary: "btn-brand",
      secondary: "btn-secondary",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
      outline: "btn-outline",
      brand: "btn-brand",
      error: "bg-[var(--brand-error)] text-white hover:bg-red-700",
      primary: "bg-brand-primary text-white hover:bg-brand-primary-hover",
      secondary:
        "bg-white text-gray-900 border border-brand-border hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-800",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
    },
    size: {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}

export default Button;
