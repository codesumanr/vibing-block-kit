import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlockProps } from '../../types';
import { Text } from '../../components/Text';
import clsx from 'clsx';

export interface ImageBlockProps extends BlockProps {
  src: string;
  alt?: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
  srcSet?: string;
  sizes?: string;
  rounded?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
  border?: boolean;
  loading?: 'eager' | 'lazy';
  zoomable?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  id,
  src,
  alt = '',
  caption,
  width,
  height,
  srcSet,
  sizes,
  rounded = false,
  shadow,
  border = false,
  loading = 'lazy',
  zoomable = false,
  className,
  ...props
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => setIsError(true);
  const handleLoad = () => setIsLoaded(true);

  return (
    <div
      className={clsx(
        'w-full',
        className
      )}
      data-block-id={id}
      {...props}
    >
      <motion.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ margin: 0 }}
      >
        {isError ? (
          <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded">
            Failed to load image
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            srcSet={srcSet}
            sizes={sizes}
            loading={loading}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            className={clsx(
              'w-full h-auto object-contain',
              rounded && 'rounded-md',
              border && 'border',
              shadow === 'sm' && 'shadow-sm',
              shadow === 'md' && 'shadow-md',
              shadow === 'lg' && 'shadow-lg',
              zoomable && 'cursor-zoom-in'
            )}
          />
        )}

        {caption && (
          <Text
            as="figcaption"
            size="sm"
            color="foreground-muted"
            className="mt-2 text-center"
          >
            {caption}
          </Text>
        )}
      </motion.figure>
    </div>
  );
};
