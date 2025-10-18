"use client";


import React, { forwardRef } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * Button Component - مكون الزر
 * Unified button component with multiple variants and states
 */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
      secondary:
        "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500",
      outline:
        "border border-gray-300 bg-transparent hover:bg-surface focus-visible:ring-gray-500",
      ghost: "hover:bg-surface focus-visible:ring-gray-500",
      destructive:
        "bg-brand-error text-white hover:bg-brand-error focus-visible:ring-red-500",
      link: "text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      xl: "h-14 px-8 text-lg",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";


export { Button };
