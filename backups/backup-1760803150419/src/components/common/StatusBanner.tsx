"use client";
import { useState } from "react";
import LiveDot from "./LiveDot";

export default function StatusBanner() {
  const [visible, setVisible] = useState(false);
  // Toggle this to simulate maintenance or critical notice
  if (!visible) return null;

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
      <div className="max-w-screen-xl mx-auto px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LiveDot color="#F59E0B" />
          هناك صيانة مجدولة الساعة 11 مساءً. قد تتأثر الإشعارات.
        </div>
        <button
          className="h-8 px-3 rounded-md border border-amber-200 dark:border-amber-800"
          onClick={() => setVisible(false)}
        >
          إخفاء
        </button>
      </div>
    </div>
  );
}
