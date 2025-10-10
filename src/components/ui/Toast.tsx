import { useEffect, useState } from 'react';
"use client";


import clsx from "clsx";

export function Toast({
  message,
  open,
  onOpenChange,
}: {
  message: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [visible, setVisible] = useState(open);
  useEffect(() => setVisible(open), [open]);
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => onOpenChange(false), 2500);
    return () => clearTimeout(id);
  }, [visible, onOpenChange]);

  return (
    <div
      className={clsx(
        "fixed bottom-4 start-1/2 z-50 -translate-x-1/2 transition",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="shadow-soft rounded-md bg-gray-900 px-4 py-2 text-white">
        {message}
      </div>
    </div>
  );
}

export default Toast;
