import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام - مُعين",
  description: "الشروط والأحكام وسياسة الخصوصية",
};

export default function __LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
