// src/app/layout.tsx
import type { Metadata } from 'next';
import I18nProvider from '@/components/providers/I18nProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ultimate E2E Self-Healing Runner',
  description:
    'Comprehensive testing system with Playwright and Supawright. AI-powered auto-healing and intelligent test management.',
  keywords:
    'E2E testing, Playwright, Supawright, auto-healing, testing automation, AI testing',
  authors: [{ name: 'Ultimate E2E Team' }],
  openGraph: {
    title: 'Ultimate E2E Self-Healing Runner',
    description: 'Comprehensive testing system with Playwright and Supawright',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultimate E2E Self-Healing Runner',
    description: 'Comprehensive testing system with Playwright and Supawright',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f8fafc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='antialiased font-inter bg-slate-50 text-slate-900'>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
