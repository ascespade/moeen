import "./globals.css";
import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";

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
      <body className={`${cairo.variable} ${inter.variable} antialiased`} style={{
        fontFamily: 'Cairo, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5',
        direction: 'rtl',
        textAlign: 'right'
      }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
