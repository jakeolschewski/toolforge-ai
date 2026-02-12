// Optimized Image component with lazy loading and blur placeholders
// Wraps Next.js Image with performance best practices

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

// Generate a simple blur data URL
function generateBlurDataURL(width: number = 8, height: number = 8): string {
  // Create a simple gray blur placeholder
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#f3f4f6'; // gray-100
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  quality = 85,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder image
  const placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';

  const imageProps = {
    src: hasError ? placeholderSrc : src,
    alt,
    quality,
    priority,
    loading: priority ? undefined : ('lazy' as const),
    onLoadingComplete: () => setIsLoading(false),
    onError: () => {
      setHasError(true);
      setIsLoading(false);
    },
    className: `${className} ${isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-300`,
    style: {
      objectFit,
    },
    sizes: sizes || (fill ? '100vw' : undefined),
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(),
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  if (!width || !height) {
    console.warn('OptimizedImage: width and height are required when fill is false');
    return null;
  }

  return <Image {...imageProps} width={width} height={height} />;
}

// Predefined sizes for common use cases
export const ImageSizes = {
  thumbnail: 'w-24 h-24',
  small: 'w-48 h-48',
  medium: 'w-96 h-96',
  large: 'w-full',
  hero: 'w-full h-96 md:h-[32rem]',
};

// Responsive sizes strings for different layouts
export const ResponsiveSizes = {
  thumbnail: '(max-width: 640px) 96px, 128px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  hero: '100vw',
  full: '100vw',
};
