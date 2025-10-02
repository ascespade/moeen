"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    focusable?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

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
      <div ref={dialogRef} className={clsx(
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

