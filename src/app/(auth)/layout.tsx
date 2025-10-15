import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - مُعين",
  description: "منصة الرعاية الصحية المتخصصة",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}

