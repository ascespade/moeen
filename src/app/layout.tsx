import { Cairo, Inter } from "next/font/google";
import "../styles/theme.css";
import type { Metadata } from "next";
import UIProvider from "@/components/providers/UIProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import { ThemeProvider } from "@/core/theme";
import { TranslationProvider } from "@/context/TranslationProvider";

export const metadata: Metadata = {
  title: "مُعين",
  description: "منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي",
};

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system">
          <TranslationProvider>
            <I18nProvider>
              <UIProvider>{children}</UIProvider>
            </I18nProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
