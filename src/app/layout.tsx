import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import UIProvider from "@/components/providers/UIProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import { DesignSystemProvider } from "@/components/providers/DesignSystemProvider";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "مُعين",
  description: "منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي",
  other: {
    "font-display": "swap",
  },
};

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <DesignSystemProvider>
          <ThemeProvider>
            <I18nProvider>
              <UIProvider>{children}</UIProvider>
            </I18nProvider>
          </ThemeProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
