"use client";

import { useEffect, useState } from "react";

export default function DirectionToggle() {
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="fixed bottom-4 end-4 z-50 hs-tooltip inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[var(--brand-primary)] text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label="Toggle direction"
    >
      {dir === "rtl" ? "RTL" : "LTR"}
    </button>
  );
