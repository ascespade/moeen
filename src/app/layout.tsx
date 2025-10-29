// src/app/layout.tsx
import I18nProvider from '@/components/providers/I18nProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import '@/styles/centralized.css';
import type { Metadata } from 'next';

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export const metadata: Metadata = {
  title: 'مركز الهمم للإعاقات الذهنية والتوحد - Hemam Center',
  description:
    'نظام إدارة رعاية صحية شامل لمركز الهمم. منصة متكاملة لإدارة المرضى، المواعيد، السجلات الطبية، والمزيد.',
  keywords:
    'مركز الهمم, رعاية صحية, إعاقات ذهنية, توحد, إدارة طبية, healthcare, autism, special needs',
  authors: [{ name: 'Hemam Center Development Team' }],
  openGraph: {
    title: 'مركز الهمم للإعاقات الذهنية والتوحد',
    description: 'نظام إدارة رعاية صحية شامل',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مركز الهمم للإعاقات الذهنية والتوحد',
    description: 'نظام إدارة رعاية صحية شامل',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e46c0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ar' dir='rtl' className='scroll-smooth'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className='antialiased bg-background text-foreground'>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
