import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "@/styles/index.css";
import UIProvider from "@/components/providers/UIProvider";
import StatusBanner from "@/components/common/StatusBanner";
import "@/app/globals.css";
import { I18nProvider } from "@/components/providers/I18nProvider";

export const metadata: Metadata = {
  title: "مُعين - المساعد الذكي لمركز الهمم",
  description: "نظام ذكي متكامل يجمع بين التكنولوجيا المتقدمة والرعاية الإنسانية لخدمة مجتمع مركز الهمم",
  keywords: ["مساعد ذكي", "مركز الهمم", "رعاية صحية", "ذكاء اصطناعي", "WhatsApp", "chatbot"],
  authors: [{ name: "فريق مُعين" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Reduce font payload by limiting weights
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-cairo" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={`${cairo.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        <a href="#content" className="sr-only focus:not-sr-only fixed top-2 start-2 z-[1000] bg-gray-900 text-white px-3 py-2 rounded">تخطي إلى المحتوى</a>
        <UIProvider>
          <I18nProvider locale={"ar"}>
            <StatusBanner />
            {children}
          </I18nProvider>
        </UIProvider>
      </body>
    </html>
  );
}
