"use client";
import { useState } from "react";
import LiveDot from "./LiveDot";

export default function StatusBanner() {
  const [visible, setVisible] = useState(false);
  // Toggle this to simulate maintenance or critical notice
  if (!visible) return null;

  return (
    <div className="w-full border-b border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <LiveDot color="#F59E0B" />
          هناك صيانة مجدولة الساعة 11 مساءً. قد تتأثر الإشعارات.
        </div>
        <button
          className="h-8 rounded-md border border-amber-200 px-3 dark:border-amber-800"
          className="h-8 px-3 rounded-md border border-amber-200 dark:border-amber-800"
          onClick={() => setVisible(false)}
        >
          إخفاء
        </button>
      </div>
    </div>
  );
}
