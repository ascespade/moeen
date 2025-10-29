'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import { AdminCard } from './AdminCard';

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
  cardTitle?: string;
  cardDescription?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
  };
  emptyState?: {
    icon?: string;
    title: string;
    description: string;
  };
  isLoading?: boolean;
}

export default function AdminTable({
  headers,
  children,
  className,
  cardTitle,
  cardDescription,
  pagination,
  emptyState,
  isLoading = false
}: AdminTableProps) {
  const hasContent = Boolean(children);
  
  return (
    <AdminCard className={className}>
      {/* Table Header */}
      {(cardTitle || cardDescription) && (
        <div className='mb-6'>
          {cardTitle && (
            <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
              {cardTitle}
            </h3>
          )}
          {cardDescription && (
            <p className='text-[var(--text-secondary)]'>
              {cardDescription}
            </p>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className='relative overflow-hidden rounded-lg border border-[var(--brand-border)]'>
        {isLoading ? (
          <div className='p-8 text-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[var(--brand-primary)] mx-auto mb-4'></div>
            <p className='text-[var(--text-secondary)]'>جاري التحميل...</p>
          </div>
        ) : hasContent ? (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-[var(--brand-surface)]'>
                  {headers.map((header, index) => (
                    <TableHead 
                      key={index} 
                      className='font-semibold text-[var(--text-primary)] border-b border-[var(--brand-border)]'
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {children}
              </TableBody>
            </Table>
          </div>
        ) : emptyState ? (
          <div className='py-16 text-center'>
            <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-surface)]'>
              <span className='text-3xl'>{emptyState.icon || '📋'}</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-[var(--text-primary)]'>
              {emptyState.title}
            </h3>
            <p className='text-[var(--text-secondary)] max-w-md mx-auto'>
              {emptyState.description}
            </p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      {pagination && hasContent && (
        <div className='flex items-center justify-between mt-6 pt-4 border-t border-[var(--brand-border)]'>
          <div className='text-sm text-[var(--text-secondary)]'>
            عرض {Math.min(pagination.itemsPerPage, pagination.totalItems)} من {pagination.totalItems} عنصر
          </div>
          
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className='border-[var(--brand-border)]'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            
            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={pagination.currentPage === page ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => pagination.onPageChange(page)}
                    className={cn(
                      'w-8 h-8 p-0',
                      pagination.currentPage === page 
                        ? 'bg-[var(--brand-primary)] text-white' 
                        : 'border-[var(--brand-border)]'
                    )}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant='outline'
              size='sm'
              onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className='border-[var(--brand-border)]'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </AdminCard>
  );
}

export { AdminTable };
