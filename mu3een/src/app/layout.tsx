import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import PrelineInit from "@/components/providers/PrelineInit";
import UIProvider from "@/components/providers/UIProvider";
import StatusBanner from "@/components/common/StatusBanner";

export const metadata: Metadata = {
  title: "مُعين",
  description: "منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي",
};

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700"], variable: "--font-cairo" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased`}>
        <UIProvider>
          <PrelineInit />
          <StatusBanner />
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
