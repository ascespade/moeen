import React from 'react';

interface LiveDotProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LiveDot({ 
  color = '#10B981', 
  size = 'md', 
  className = '' 
}: LiveDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div 
        className="w-full h-full rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
      <div 
        className="absolute inset-0 rounded-full animate-ping opacity-75"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}