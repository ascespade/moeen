"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// Removed jotai and Icon for performance

const adminItems = [
  { href: "/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/conversations", label: "المحادثات", icon: "💬" },
  { href: "/flow", label: "منشئ التدفق", icon: "🔄" },
  { href: "/review", label: "مركز المراجعة", icon: "✨" },
  { href: "/settings", label: "الإعدادات", icon: "⚙️" },
  { href: "/users", label: "إدارة الفريق", icon: "👥" },
];
const staffItems = [
  { href: "/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/conversations", label: "المحادثات", icon: "💬" },
];
const viewerItems = [
  { href: "/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/conversations", label: "المحادثات", icon: "💬" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = "admin"; // Default role
  const items = role === "admin" ? adminItems : role === "staff" ? staffItems : viewerItems;

  return (
    <aside className="w-full lg:w-64 shrink-0 border-s lg:border-s-0 lg:border-e min-h-dvh p-4 grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6 animate-fadeInUp">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">م</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">مركز الهمم</span>
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block">Mu'ayin 🚀</div>
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`h-12 rounded-xl px-4 grid items-center transition-all duration-300 hover:scale-105 ${
                active 
                  ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" 
                  : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600"
              }`}
            >
              <span className="inline-flex items-center gap-3 font-medium">
                {item.icon}
                {item.label}
                {active && <span className="text-xs">✨</span>}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6 animate-fadeInUp">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">م</span>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-gray-800 dark:text-gray-200">مستخدم تجريبي</div>
          <button className="text-gray-500 hover:text-purple-600 transition-colors duration-200 hover:underline">تسجيل الخروج 🚪</button>
        </div>
      </div>
    </aside>
  );
}

