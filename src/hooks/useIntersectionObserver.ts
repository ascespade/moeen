import { useEffect, useRef, useState } from "react";

// Intersection Observer hook

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {},
) => {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<Element | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry || null);
  };

  useEffect(() => {
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const currentObserver = new IntersectionObserver(
      updateEntry,
      observerParams,
    );

    observer.current = currentObserver;
    currentObserver.observe(node);

    return () => {
      currentObserver.disconnect();
    };
  }, [node, threshold, root, rootMargin, frozen]);

  const prevNode = useRef<Element | null>(null);

  useEffect(() => {
    if (prevNode.current) {
      observer.current?.unobserve(prevNode.current);
    }

    if (node) {
      observer.current?.observe(node);
    }

    prevNode.current = node;
  }, [node]);

  return [setNode, entry] as const;
};

export const useInView = (options: UseIntersectionObserverOptions = {}) => {
  const [ref, entry] = useIntersectionObserver(options);
  return [ref, !!entry?.isIntersecting] as const;
};

export const useLazyLoad = (options: UseIntersectionObserverOptions = {}) => {
  const [ref, inView] = useInView(options);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (inView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [inView, hasLoaded]);

  return [ref, hasLoaded] as const;
};
