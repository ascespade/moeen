// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ultimate E2E Self-Healing Runner',
  description: 'Comprehensive testing system with Playwright and Supawright. AI-powered auto-healing and intelligent test management.',
  keywords: 'E2E testing, Playwright, Supawright, auto-healing, testing automation, AI testing',
  authors: [{ name: 'Ultimate E2E Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}