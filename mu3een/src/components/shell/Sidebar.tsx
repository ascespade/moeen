"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { roleAtom } from "@/components/providers/UIProvider";

const adminItems = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/conversations", label: "المحادثات" },
  { href: "/flow", label: "منشئ التدفق" },
  { href: "/review", label: "مركز المراجعة" },
  { href: "/settings", label: "الإعدادات" },
  { href: "/users", label: "إدارة الفريق" },
];
const staffItems = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/conversations", label: "المحادثات" },
];
const viewerItems = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/conversations", label: "المحادثات" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role] = useAtom(roleAtom);
  const items = role === "admin" ? adminItems : role === "staff" ? staffItems : viewerItems;

  return (
    <aside className="w-full lg:w-64 shrink-0 border-s lg:border-s-0 lg:border-e min-h-dvh p-4 grid grid-rows-[auto_1fr_auto]">
      <div className="mb-2">
        <span className="text-lg font-semibold">مركز الهمم</span>
        <div className="text-xs text-gray-500">Mu’ayin</div>
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`h-10 rounded-md px-3 grid items-center ${active ? "bg-gray-900 text-white" : "hover:bg-gray-100 dark:hover:bg-white/10"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 pt-4 border-t mt-4">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="text-sm">
          <div className="font-medium">مستخدم تجريبي</div>
          <button className="text-gray-500 hover:underline">تسجيل الخروج</button>
        </div>
      </div>
    </aside>
  );
}

