/**
 * Unified Admin Page Template
 * قالب موحد لجميع صفحات Admin
 */

'use client';

import React from 'react';
import { AdminPageWrapper } from './page-wrapper';
import { AdminPageConfig } from './page-config';

interface PageTemplateProps {
  config: AdminPageConfig;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export function AdminPageTemplate({
  config,
  children,
  loading = false,
  error = null,
  loadingComponent,
  errorComponent,
}: PageTemplateProps) {
  if (loading) {
    return loadingComponent || (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 mx-auto'></div>
          <p className='text-sm text-gray-600'>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return errorComponent || (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>حدث خطأ: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageWrapper
      requiredPermissions={config.requiredPermissions}
      requiredRoles={config.requiredRoles}
      pageTitle={config.title}
    >
      {children}
    </AdminPageWrapper>
  );
}

