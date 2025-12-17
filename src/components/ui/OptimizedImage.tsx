/**
 * OptimizedImage Component
 * Wrapper around Next.js Image with fallback support and error handling
 */

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc = '/images/hero/fallback-1.svg',
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setIsError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      loading={props.priority ? 'eager' : 'lazy'}
    />
  );
};
