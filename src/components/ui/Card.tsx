import { cn } from '@/lib/utils';
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient' | 'interactive';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      shadow,
      borderRadius = 'lg',
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      relative overflow-hidden
      transition-all duration-300 ease-out
      border border-neutral-200 dark:border-neutral-700
    `;

    const variants = {
      default: `
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-50
      `,
      elevated: `
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-50
        shadow-xl hover:shadow-2xl
      `,
      outlined: `
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-50
        border-2 border-primary-500
      `,
      glass: `
        bg-white/70 dark:bg-neutral-900/70
        text-neutral-900 dark:text-neutral-50
        backdrop-blur-xl border-white/20
        shadow-lg
      `,
      gradient: `
        bg-gradient-to-br from-primary-50 to-primary-100
        dark:from-primary-950 dark:to-primary-900
        text-primary-900 dark:text-primary-50
        shadow-lg
      `,
      interactive: `
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-50
        shadow-md hover:shadow-lg
        hover:scale-[1.02] cursor-pointer
        focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
      `,
    };

    const paddings = {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
      '2xl': 'p-12',
    };

    const borderRadii = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    };

    const shadows = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };

    const hoverClass = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          borderRadii[borderRadius],
          shadow && shadows[shadow],
          hoverClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div className={cn('p-6 pt-0', className)} ref={ref} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
