import { useRef, useEffect, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useReducedMotion } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide-left' | 'slide-right' | 'scale' | 'none';

interface ScrollImageProps {
  src: string;
  alt: string;
  animation?: AnimationType;
  className?: string;
  parallaxSpeed?: number;
}

export function ScrollImage({
  src,
  alt,
  animation = 'fade',
  className,
  parallaxSpeed = 0.3,
}: ScrollImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, isInView } = useScrollProgress(containerRef);
  const reducedMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Calculate animation styles based on scroll progress
  const getAnimationStyles = (): React.CSSProperties => {
    if (reducedMotion || animation === 'none') {
      return { opacity: isInView ? 1 : 0 };
    }

    const normalizedProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
    const opacity = normalizedProgress;

    switch (animation) {
      case 'slide-left':
        return {
          opacity,
          transform: `translateX(${(1 - normalizedProgress) * 40}px)`,
        };
      case 'slide-right':
        return {
          opacity,
          transform: `translateX(${(normalizedProgress - 1) * 40}px)`,
        };
      case 'scale':
        return {
          opacity,
          transform: `scale(${0.95 + normalizedProgress * 0.05})`,
        };
      case 'fade':
      default:
        return { opacity };
    }
  };

  const parallaxOffset = reducedMotion ? 0 : (progress - 0.5) * 100 * parallaxSpeed;

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden',
        className
      )}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            ...getAnimationStyles(),
            transform: `${getAnimationStyles().transform || ''} translateY(${parallaxOffset}px)`,
            transition: reducedMotion ? 'opacity 0.2s' : 'transform 0.1s linear',
          }}
        />
      ) : (
        // Placeholder for missing images
        <div 
          className="w-full h-full flex items-center justify-center"
          style={getAnimationStyles()}
        >
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
        </div>
      )}
      
      {/* Overlay for better text readability */}
      <div className="doc-overlay" />
    </div>
  );
}
