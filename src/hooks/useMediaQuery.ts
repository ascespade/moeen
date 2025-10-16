import { _useState, useEffect } from "react";
// Media query hooks

export const __useMediaQuery = (_query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const __media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const __listener = () => setMatches(media.matches);

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);

  return matches;
};

export const __useBreakpoint = () => {
  const __isMobile = useMediaQuery("(max-width: 768px)");
  const __isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const __isDesktop = useMediaQuery("(min-width: 1025px)");
  const __isLargeDesktop = useMediaQuery("(min-width: 1440px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    current: isMobile
      ? "mobile"
      : isTablet
        ? "tablet"
        : isDesktop
          ? "desktop"
          : "large-desktop",
  };
};

export const __useDarkMode = (): boolean => {
  return useMediaQuery("(prefers-color-scheme: dark)");
};

export const __useReducedMotion = (): boolean => {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
};

export const __useHighContrast = (): boolean => {
  return useMediaQuery("(prefers-contrast: high)");
};

export const __usePrint = (): boolean => {
  return useMediaQuery("print");
};

export const __useHover = (): boolean => {
  return useMediaQuery("(_hover: hover)");
};

export const __useTouch = (): boolean => {
  return useMediaQuery("(_pointer: coarse)");
};
