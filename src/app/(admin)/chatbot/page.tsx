'use client';

import React from 'react';
import { AdminPageWrapper } from '@/lib/admin/page-wrapper';
import { ADMIN_PAGES } from '@/lib/admin/page-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bot, Settings, MessageSquare, BarChart3 } from 'lucide-react';
import Link from 'next/link';

function ChatbotPageContent() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>إدارة المساعد الذكي</h1>
        <p className='text-muted-foreground mt-2'>
          إدارة وتكوين المساعد الذكي للرد على الاستفسارات
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>إجمالي المحادثات</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>محادثة نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>معدل الاستجابة</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0%</div>
            <p className='text-xs text-muted-foreground'>معدل نجاح</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>إعدادات المساعد</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href='/admin/chatbot/settings'>
              <Button variant='outline' className='w-full'>
                <Settings className='h-4 w-4 mr-2' />
                فتح الإعدادات
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التحليلات</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href='/admin/chatbot/analytics'>
              <Button variant='outline' className='w-full'>
                <BarChart3 className='h-4 w-4 mr-2' />
                عرض التحليلات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const pageConfig = ADMIN_PAGES.chatbot;
  return (
    <AdminPageWrapper
      requiredPermissions={pageConfig.requiredPermissions}
      pageTitle={pageConfig.title}
    >
      <ChatbotPageContent />
    </AdminPageWrapper>
  );
}
