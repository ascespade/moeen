import { usePathname } from "next/navigation";
import Link from "next/link";

import { useT } from "@/components/providers/I18nProvider";

"use client";
  LayoutDashboard,
  MessagesSquare,
  Workflow,
  ShieldCheck,
  Settings,
  Users,
} from "lucide-react";

const adminItems = [
    href: "/dashboard",
    label: "nav.dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
    href: "/conversations",
    label: "nav.conversations",
    icon: <MessagesSquare className="h-4 w-4" />,
  },
  { href: "/flow", label: "nav.flow", icon: <Workflow className="h-4 w-4" /> },
    href: "/review",
    label: "nav.review",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
    href: "/settings",
    label: "nav.settings",
    icon: <Settings className="h-4 w-4" />,
  },
  { href: "/users", label: "nav.users", icon: <Users className="h-4 w-4" /> },
];
const staffItems = [
    href: "/dashboard",
    label: "nav.dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
    href: "/conversations",
    label: "nav.conversations",
    icon: <MessagesSquare className="h-4 w-4" />,
  },
];
const viewerItems = [
    href: "/dashboard",
    label: "nav.dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
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
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full fixed top-0 start-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 transition-all duration-300 lg:hidden"
      >
        <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand text-white grid place-items-center">
              م
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              مركز الهمم
            </span>
          </div>
        </div>
        <nav className="p-3 grid gap-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 h-11 rounded-lg inline-flex items-center gap-3 border transition-colors ${
                  active
                    ? "bg-brand text-white border-transparent"
                    : "border-gray-200 dark:border-gray-800 hover:bg-[var(--brand-surface)] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
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
      <aside className="hidden lg:block w-64 shrink-0 border-e border-gray-200 dark:border-gray-800 min-h-dvh p-4 grid grid-rows-[auto_1fr_auto] bg-white dark:bg-gray-900">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-brand text-white grid place-items-center">
              م
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              مركز الهمم
            </span>
          </div>
          <div className="text-xs text-gray-500 bg-surface dark:bg-gray-800 px-2 py-1 rounded-full inline-block">
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
                className={`px-3 h-11 rounded-lg inline-flex items-center gap-3 border transition-colors ${
                  active
                    ? "bg-brand text-white border-transparent"
                    : "border-gray-200 dark:border-gray-800 hover:bg-[var(--brand-surface)] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{t(item.label, item.label)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
          <div className="h-10 w-10 rounded-full bg-brand text-white grid place-items-center">
            م
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900 dark:text-white">
              مستخدم تجريبي
            </div>
            <button className="text-gray-500 hover:text-brand-primary transition-colors">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
