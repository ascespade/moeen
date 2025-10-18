import './globals.css';
import { Inter } from 'next/font/google';
import MoeenChatbot from '@/components/chatbot/MoeenChatbot';
import { generateMetadata as genMeta, pageMetadata, generateStructuredData } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = genMeta(pageMetadata.home);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateStructuredData('website');

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className={inter.className}>
        {children}
        <MoeenChatbot position="bottom-right" />
      </body>
    </html>
  );
}
