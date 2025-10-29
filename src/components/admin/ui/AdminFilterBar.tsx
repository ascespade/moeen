'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { Filter, RefreshCw, Search } from 'lucide-react';
import { ReactNode } from 'react';
import { AdminCard } from './AdminCard';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminFilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  onRefresh?: () => void;
  onApplyFilters?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function AdminFilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'البحث...',
  filters = [],
  onRefresh,
  onApplyFilters,
  children,
  className
}: AdminFilterBarProps) {
  return (
    <AdminCard className={cn('mb-6', className)} padding="md">
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Search Input */}
        {onSearchChange && (
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]' />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className='pr-10 h-10 border-[var(--brand-border)] focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]'
              />
            </div>
          </div>
        )}
        
        {/* Filter Selects */}
        <div className='flex gap-3'>
          {filters.map((filter, index) => (
            <Select key={index} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className='w-40 h-10 border-[var(--brand-border)]'>
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant='outline'
              onClick={onRefresh}
              className='h-10 border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
            >
              <RefreshCw className='h-4 w-4' />
            </Button>
          )}
          
          {/* Apply Filters Button */}
          {onApplyFilters && (
            <Button
              onClick={onApplyFilters}
              className='h-10 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
            >
              <Filter className='h-4 w-4 ml-2' />
              تطبيق الفلاتر
            </Button>
          )}
          
          {/* Custom children */}
          {children}
        </div>
      </div>
    </AdminCard>
  );
}

export { AdminFilterBar };
