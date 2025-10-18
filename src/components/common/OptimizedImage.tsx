"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallback?: string;
  alt: string;
}

export default function OptimizedImage({
  src,
  fallback = "/logo.png",
  alt,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    if (!imageError && fallback) {
      setImageSrc(fallback);
      setImageError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={handleError}
      unoptimized={imageSrc === fallback}
    />
  );
}
