import { ReactNode, useRef } from 'react';
import { useIntersectionObserver, useReducedMotion } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface NarrativeBlockProps {
  heading?: string;
  body?: string;
  children?: ReactNode;
  className?: string;
  alignment?: 'left' | 'center' | 'right';
  animation?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'none';
}

const alignmentClasses = {
  left: 'items-start text-left ml-6 md:ml-12 lg:ml-20',
  center: 'items-center text-center mx-auto',
  right: 'items-end text-right mr-6 md:mr-12 lg:mr-20',
};

const animationClasses = {
  fade: 'animate-fade-in',
  'slide-left': 'animate-slide-in-left',
  'slide-right': 'animate-slide-in-right',
  'slide-up': 'animate-slide-in-up',
  none: '',
};

export function NarrativeBlock({
  heading,
  body,
  children,
  className,
  alignment = 'left',
  animation = 'fade',
}: NarrativeBlockProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true,
  });
  const reducedMotion = useReducedMotion();

  const shouldAnimate = isIntersecting && !reducedMotion && animation !== 'none';

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'narrative-block',
        'flex flex-col justify-center',
        'px-6 md:px-8',
        'max-w-xl',
        alignmentClasses[alignment],
        className
      )}
    >
      <div
        className={cn(
          'relative z-10 p-6 md:p-8 rounded-lg',
          'bg-background/80 backdrop-blur-sm',
          'shadow-lg',
          'opacity-0',
          shouldAnimate && animationClasses[animation]
        )}
        style={{
          animationDelay: reducedMotion ? '0ms' : '200ms',
        }}
      >
        {heading && (
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
            {heading}
          </h2>
        )}
        {body && (
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {body}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
