"use client";

import * as React from "react";

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="hs-tooltip inline-block">
      <span className="hs-tooltip-toggle inline-block cursor-default">
        {children}
      </span>
      <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible invisible rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-sm transition">
        {label}
      </span>
    </span>
  );
}

export default Tooltip;
