"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  FileText,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigationItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/patients", label: "المرضى", icon: Users },
  { href: "/appointments", label: "المواعيد", icon: Calendar },
  { href: "/chatbot", label: "الشات بوت", icon: MessageCircle },
  { href: "/reports", label: "التقارير", icon: BarChart3 },
  { href: "/claims", label: "المطالبات", icon: FileText },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`bg-[var(--panel)] border-l border-[var(--brand-border)] h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-[var(--brand-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">م</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-[var(--foreground)]">معين</h1>
                <p className="text-sm text-[var(--foreground)]/60">لوحة التحكم</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[var(--brand-primary)] text-white"
                        : "text-[var(--foreground)] hover:bg-[var(--brand-surface)]"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[var(--brand-border)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">أ</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  admin@mu3een.com
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Link
              href="/help"
              className="flex items-center gap-3 px-4 py-2 text-[var(--foreground)] hover:bg-[var(--brand-surface)] rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">المساعدة</span>}
            </Link>
            <Link
              href="/logout"
              className="flex items-center gap-3 px-4 py-2 text-[var(--foreground)] hover:bg-[var(--brand-surface)] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">تسجيل الخروج</span>}
            </Link>
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-[var(--foreground)] hover:bg-[var(--brand-surface)] rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}