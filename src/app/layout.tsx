// src/app/layout.tsx
import I18nProvider from '@/components/providers/I18nProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import '@/styles/centralized.css';
import type { Metadata } from 'next';
import ScrollRestoration from './scroll-restoration';

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export const metadata: Metadata = {
  title: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة - جدة',
  description:
    'مركز الهمم لرعاية ذوي الاحتياجات الخاصة في جدة - حي الصفا. نقدم خدمات تأهيلية متخصصة تشمل جلسات التخاطب، التأهيل السمعي، تعديل السلوك، العلاج الوظيفي، والتكامل الحسي.',
  keywords:
    'مركز الهمم, رعاية صحية, إعاقات ذهنية, توحد, إدارة طبية, healthcare, autism, special needs',
  authors: [{ name: 'Hemam Center Development Team' }],
  openGraph: {
    title: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة - جدة',
    description: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة في جدة - حي الصفا. نقدم خدمات تأهيلية متخصصة',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة - جدة',
    description: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة في جدة - حي الصفا',
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
    <html lang='ar' dir='rtl' className='scroll-smooth' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' />
        {/* Import beautiful Arabic fonts from Google Fonts */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Noto+Sans+Arabic:wght@400;500;700;900&family=Amiri:wght@400;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='antialiased bg-background text-foreground font-sans' suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider>
            <ScrollRestoration />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
