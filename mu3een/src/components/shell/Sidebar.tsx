"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/(app)/dashboard", label: "داشبورد" },
  { href: "/(app)/conversations", label: "المحادثات" },
  { href: "/(app)/settings", label: "الإعدادات" },
  { href: "/(admin)/users", label: "المستخدمون" },
  { href: "/(admin)/channels", label: "القنوات" },
  { href: "/(admin)/logs", label: "السجلات" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full lg:w-64 shrink-0 border-s lg:border-s-0 lg:border-e min-h-dvh p-4">
      <div className="mb-6">
        <span className="text-lg font-semibold">مُعين</span>
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href.replace("/(app)", "").replace("/(admin)", ""));
          return (
            <Link
              key={item.href}
              href={item.href.replace("/(app)", "").replace("/(admin)", "")}
              className={`h-10 rounded-md px-3 grid items-center ${active ? "bg-gray-900 text-white" : "hover:bg-gray-100 dark:hover:bg-white/10"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

