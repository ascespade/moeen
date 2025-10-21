// src/app/layout.tsx
import type { Metadata } from 'next';
import I18nProvider from '@/components/providers/I18nProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'مُعين - مساعدك الذكي في الرعاية الصحية',
  description:
    'نظام متكامل لإدارة المراكز الصحية مع أحدث التقنيات والذكاء الاصطناعي',
  keywords:
    'إدارة المراكز الصحية, الذكاء الاصطناعي, إدارة المرضى, المواعيد الطبية, السعودية',
  authors: [{ name: 'فريق مُعين' }],
  openGraph: {
    title: 'مُعين - مساعدك الذكي في الرعاية الصحية',
    description: 'نظام متكامل لإدارة المراكز الصحية مع أحدث التقنيات',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مُعين - مساعدك الذكي في الرعاية الصحية',
    description: 'نظام متكامل لإدارة المراكز الصحية مع أحدث التقنيات',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b35',
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
      <body className='antialiased bg-slate-50 text-slate-900'>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
