import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImageUrl } from '@/utils/imageUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  priority?: boolean;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  priority = false,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  ...props
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(() => optimizeImageUrl(src, width));
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(optimizeImageUrl(src, width));
    setLoaded(false);
    setFailed(false);
  }, [src, width]);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (!failed && fallbackSrc && currentSrc !== fallbackSrc) {
      setFailed(true);
      setLoaded(false);
      setCurrentSrc(optimizeImageUrl(fallbackSrc, width));
      return;
    }
    setLoaded(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-300/60 dark:bg-slate-700/60">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        {...props}
      />
    </div>
  );
}
