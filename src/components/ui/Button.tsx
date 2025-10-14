"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonStyles = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-white hover:bg-brand-primary-hover",
        secondary:
          "bg-white text-gray-900 border border-brand-border hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-800",
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

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
