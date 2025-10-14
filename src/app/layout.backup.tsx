import { Cairo, Inter } from "next/font/google";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { I18nProvider } from "@/components/providers/I18nProvider";
import type { Metadata } from "next";

import "@/styles/index.css";
import UIProvider from "@/components/providers/UIProvider";
import StatusBanner from "@/components/common/StatusBanner";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "مُعين",
  description: "منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي",
};

// Reduce font payload by limiting weights
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-cairo",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme-mode') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#content"
          className="sr-only fixed start-2 top-2 z-[1000] rounded bg-gray-900 px-3 py-2 text-white focus:not-sr-only"
          className="sr-only focus:not-sr-only fixed top-2 start-2 z-[1000] bg-gray-900 text-white px-3 py-2 rounded"
        >
          تخطي إلى المحتوى
        </a>
        <ErrorBoundary>
          <UIProvider>
            <I18nProvider locale={"ar"}>
              <StatusBanner />
              {children}
            </I18nProvider>
          </UIProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
