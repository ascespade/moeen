"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "لوحة التحكم", href: "/dashboard", icon: "📊" },
  { name: "المحادثات", href: "/conversations", icon: "💬", badge: "3" },
  { name: "القنوات", href: "/channels", icon: "📱" },
  { name: "منشئ التدفق", href: "/flow", icon: "🔄" },
  { name: "المراجعة", href: "/review", icon: "⭐" },
  { name: "المستخدمين", href: "/users", icon: "👥" },
  { name: "السجلات", href: "/logs", icon: "📋" },
  { name: "الإعدادات", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      id="app-sidebar" 
      className={`hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
    >
      <div className="px-6">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg text-white grid place-items-center bg-blue-600">م</div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">مُعين</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
        <ul className="space-y-1.5">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  pathname === item.href ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium text-white bg-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 pt-4 border-t border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">م</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">مدير النظام</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@muayin.com</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}