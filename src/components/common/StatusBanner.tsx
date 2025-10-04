"use client";

import React, { useState } from "react";

export default function StatusBanner() {
  const [visible, setVisible] = useState(false);
  
  // Toggle this to simulate maintenance or critical notice
  if (!visible) return null;

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
      <div className="max-w-screen-xl mx-auto px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          هناك صيانة مجدولة الساعة 11 مساءً. قد تتأثر الإشعارات.
        </div>
        <button 
          className="h-8 px-3 rounded-md border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-800/30" 
          onClick={() => setVisible(false)}
        >
          إخفاء
        </button>
      </div>
    </div>
  );
}