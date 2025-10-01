import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-[16rem_1fr] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
