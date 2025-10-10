"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  Workflow,
  ShieldCheck,
  Settings,
  Users,
} from "lucide-react";
import { useT } from "@/components/providers/I18nProvider";

const adminItems = [
  {
    href: "/dashboard",
    label: "nav.dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/conversations",
    label: "nav.conversations",
    icon: <MessagesSquare className="h-4 w-4" />,
  },
  { href: "/flow", label: "nav.flow", icon: <Workflow className="h-4 w-4" /> },
  {
    href: "/review",
    label: "nav.review",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    href: "/settings",
    label: "nav.settings",
    icon: <Settings className="h-4 w-4" />,
  },
  { href: "/users", label: "nav.users", icon: <Users className="h-4 w-4" /> },
];
const staffItems = [
  {
    href: "/dashboard",
    label: "nav.dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/conversations",
    label: "nav.conversations",
    icon: <MessagesSquare className="h-4 w-4" />,
  },
];
const viewerItems = [
  {
    href: "/dashboard",
    label: "nav.dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/conversations",
    label: "nav.conversations",
    icon: <MessagesSquare className="h-4 w-4" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = "admin";
  const items =
    role === "admin" ? adminItems : role === "staff" ? staffItems : viewerItems;
  const { t } = useT();

  return (
    <>
      {/* Overlay sidebar for mobile */}
      <div
        id="app-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 fixed bottom-0 start-0 top-0 z-50 w-72 -translate-x-full border-e border-gray-200 bg-white transition-all duration-300 lg:hidden dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
          <div className="inline-flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
              م
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              مركز الهمم
            </span>
          </div>
        </div>
        <nav className="grid gap-1 p-3">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-11 items-center gap-3 rounded-lg border px-3 transition-colors ${
                  active
                    ? "border-transparent bg-blue-600 text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
                data-hs-overlay="#app-sidebar"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{t(item.label, item.label)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <aside className="grid hidden min-h-dvh w-64 shrink-0 grid-rows-[auto_1fr_auto] border-e border-gray-200 bg-white p-4 lg:block dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
              م
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              مركز الهمم
            </span>
          </div>
          <div className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800">
            Mu&apos;ayin
          </div>
        </div>
        <nav className="grid gap-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-11 items-center gap-3 rounded-lg border px-3 transition-colors ${
                  active
                    ? "border-transparent bg-blue-600 text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{t(item.label, item.label)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 flex items-center gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white">
            م
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900 dark:text-white">
              مستخدم تجريبي
            </div>
            <button className="text-gray-500 transition-colors hover:text-blue-600">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
