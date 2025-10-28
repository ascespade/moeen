// src/app/layout.tsx
import I18nProvider from '@/components/providers/I18nProvider';
import '@/styles/centralized.css';
import type { Metadata } from 'next';

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
      </head>
      <body className='antialiased bg-background text-foreground'>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
