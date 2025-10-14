import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  sizes,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  fill = false,
  style,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-center text-gray-500">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Image failed to load</span>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    priority,
    quality,
    placeholder,
    blurDataURL,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setIsLoading(false);
      setHasError(true);
    },
    className: `transition-opacity duration-300 ${
      isLoading ? "opacity-0" : "opacity-100"
    } ${className}`,
    style,
    ...(sizes && { sizes }),
    ...(fill ? { fill: true } : { width, height }),
  };

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={fill ? {} : { width, height }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <Image {...imageProps} alt={alt || ""} />
    </div>
  );
}

// Preset configurations for common use cases
export const ImagePresets = {
  avatar: {
    width: 40,
    height: 40,
    className: "rounded-full",
    quality: 80,
  },
  thumbnail: {
    width: 150,
    height: 150,
    className: "rounded-lg",
    quality: 75,
  },
  hero: {
    width: 800,
    height: 400,
    className: "rounded-lg",
    quality: 85,
    priority: true,
  },
  card: {
    width: 300,
    height: 200,
    className: "rounded-md",
    quality: 75,
  },
  gallery: {
    width: 400,
    height: 300,
    className: "rounded-lg",
    quality: 80,
  },
};

// Convenience components for common use cases
export function AvatarImage(
  props: Omit<
    OptimizedImageProps,
    "width" | "height" | "className" | "quality"
  >,
) {
  return <OptimizedImage {...ImagePresets.avatar} {...props} />;
}

export function ThumbnailImage(
  props: Omit<
    OptimizedImageProps,
    "width" | "height" | "className" | "quality"
  >,
) {
  return <OptimizedImage {...ImagePresets.thumbnail} {...props} />;
}

export function HeroImage(
  props: Omit<
    OptimizedImageProps,
    "width" | "height" | "className" | "quality" | "priority"
  >,
) {
  return <OptimizedImage {...ImagePresets.hero} {...props} />;
}

export function CardImage(
  props: Omit<
    OptimizedImageProps,
    "width" | "height" | "className" | "quality"
  >,
) {
  return <OptimizedImage {...ImagePresets.card} {...props} />;
}

export function GalleryImage(
  props: Omit<
    OptimizedImageProps,
    "width" | "height" | "className" | "quality"
  >,
) {
  return <OptimizedImage {...ImagePresets.gallery} {...props} />;
}

export default OptimizedImage;
