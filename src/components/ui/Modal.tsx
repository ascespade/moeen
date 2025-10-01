"use client";

import { useEffect } from "react";
import clsx from "clsx";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 grid place-items-center p-4 transition",
        open ? "visible" : "invisible"
      )}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      <div className={clsx("fixed inset-0 bg-black/40", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className={clsx(
        "relative z-10 w-full max-w-lg rounded-xl border border-brand-border bg-[var(--panel)] shadow-soft",
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      >
        {title && (
          <div className="px-4 py-3 border-b border-brand-border text-sm font-semibold">
            {title}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

