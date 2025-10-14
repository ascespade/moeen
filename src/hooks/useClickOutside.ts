import { useEffect, useRef } from "react";
// Click outside hook
import { useEffect, useRef } from "react";

export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  enabled: boolean = true,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler, enabled]);

  return ref;
};
