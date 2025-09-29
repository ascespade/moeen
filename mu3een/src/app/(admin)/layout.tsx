import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-[16rem_1fr] container-app">
      <Sidebar />
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
}