'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  animate?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function AdminCard({ 
  children, 
  className,
  gradient = false,
  hover = true,
  animate = true,
  padding = 'md'
}: AdminCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div 
      className={cn(
        // Base styles
        'bg-[var(--panel)] border border-[var(--brand-border)] rounded-xl shadow-lg',
        
        // Gradient background (optional)
        gradient && 'bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent',
        
        // Hover effects
        hover && 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
        
        // Animation
        animate && 'animate-fadeInUp',
        
        // Padding
        paddingClasses[padding],
        
        // Custom classes
        className
      )}
    >
      {children}
    </div>
  );
}

export { AdminCard };
