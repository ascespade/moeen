import { _useEffect, useRef } from "react";
// Click outside hook

export const __useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  enabled: boolean = true,
) => {
  const __ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const __handleClickOutside = (_event: Event) => {
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
