"use client";

import { useState } from "react";

import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallback?: string;
  alt: string;

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
}}
