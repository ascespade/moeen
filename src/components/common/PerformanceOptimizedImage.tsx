"use client";

import { useState, useRef, useEffect } from "react";

}
interface PerformanceOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;

}

export function PerformanceOptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+",
  priority = false,
}: PerformanceOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "50px" },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isInView ? (
        <div
          className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <img
              src={placeholder}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-sm"
              style={{ width, height }}
            />
          )}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
          />
          {hasError && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500 text-sm">Failed to load</div>
            </div>
          )}
        </>
      )}
    </div>
  );

export default PerformanceOptimizedImage;
}}}