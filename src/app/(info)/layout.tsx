import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "معلومات - مُعين",
  description: "معلومات عن منصة الرعاية الصحية",
};

export default function __InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
