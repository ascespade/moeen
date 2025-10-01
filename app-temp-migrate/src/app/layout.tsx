import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/styles/index.css";
import UIProvider from "@/components/providers/UIProvider";
import StatusBanner from "@/components/common/StatusBanner";

export const metadata: Metadata = {
  title: "مُعين",
  description: "منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي",
};

// Reduce font payload by limiting weights
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-cairo" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={`${cairo.variable} antialiased`} suppressHydrationWarning>
        <UIProvider>
          <StatusBanner />
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
