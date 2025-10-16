/**
 * Card Component - مكون البطاقة
 * Unified card component with multiple variants
 */

"use client";

import React, { forwardRef } from "react";

import { _cn } from "@/core/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  clickable?: boolean;
}

const __Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hover = false,
      clickable = false,
      ...props
    },
    ref,
  ) => {
    const __baseClasses = "rounded-lg border bg-white text-gray-950 shadow-sm";

    const __variants = {
      default: "border-gray-200",
      elevated: "border-gray-200 shadow-md",
      outlined: "border-2 border-gray-300",
      filled: "border-gray-200 bg-gray-50",
    };

    const __paddings = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    };

    const __interactiveClasses = clickable
      ? "cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      : hover
        ? "transition-shadow duration-200 hover:shadow-md"
        : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          interactiveClasses,
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const __CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  ),
);

CardHeader.displayName = "CardHeader";

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const __CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const __CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";

// Legacy exports for backward compatibility
export const __CardTitle = CardHeader;
export const __CardDescription = CardContent;

export { __Card as Card, __CardHeader as CardHeader, __CardContent as CardContent, __CardFooter as CardFooter };
