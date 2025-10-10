"use client";
import { useEffect, useState } from "react";
export default function DirectionToggle() {
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");

  useEffect(() => {
    const html = document.documentElement;
    const current = (html.getAttribute("dir") as "rtl" | "ltr") || "rtl";
    setDir(current);
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const next = dir === "rtl" ? "ltr" : "rtl";
    html.setAttribute("dir", next);
    html.setAttribute("lang", next === "rtl" ? "ar" : "en");
    setDir(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="hs-tooltip fixed bottom-4 end-4 z-50 inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-4 py-2 text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label="Toggle direction"
    >
      {dir === "rtl" ? "RTL" : "LTR"}
    </button>
  );
}
