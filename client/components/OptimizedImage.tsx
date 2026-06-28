import { useState } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImageUrl } from '@/utils/imageUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const optimizedSrc = optimizeImageUrl(src, width);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200/80">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-300" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
}
