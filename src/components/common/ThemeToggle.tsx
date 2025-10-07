"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme-mode") as Mode) || "light";
    applyMode(saved);
  }, []);

  const applyMode = (m: Mode) => {
    const html = document.documentElement;
    if (m === "system") {
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", m);
    }
    localStorage.setItem("theme-mode", m);
    setMode(m);
  };

  return (
    <div className="fixed bottom-4 start-4 z-50 flex items-center gap-2 p-1 rounded-full border border-[var(--brand-border)] bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <button onClick={() => applyMode("light")} className={`px-3 py-1 rounded-full text-sm ${mode === "light" ? 'bg-[var(--brand-primary)] text-white' : ''}`}>فاتح</button>
      <button onClick={() => applyMode("dark")} className={`px-3 py-1 rounded-full text-sm ${mode === "dark" ? 'bg-[var(--brand-primary)] text-white' : ''}`}>داكن</button>
      <button onClick={() => applyMode("system")} className={`px-3 py-1 rounded-full text-sm ${mode === "system" ? 'bg-[var(--brand-primary)] text-white' : ''}`}>نظام</button>
    </div>
  );
}

