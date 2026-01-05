import { useRef, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Thermometer, HeartPulse, Droplets } from 'lucide-react';

interface HeatImpactCalloutsProps {
  className?: string;
}

export function HeatImpactCallouts({ className }: HeatImpactCalloutsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0.1 });
  const { t } = useTranslation();
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const callouts = [
    {
      id: 'extreme-heat',
      icon: Thermometer,
      text: t.act1.impacts.extremeHeat,
    },
    {
      id: 'health',
      icon: HeartPulse,
      text: t.act1.impacts.health,
    },
    {
      id: 'drought',
      icon: Droplets,
      text: t.act1.impacts.drought,
    },
  ];

  // Stagger the appearance of callouts based on scroll
  const getCalloutOpacity = (index: number) => {
    if (prefersReducedMotion) return 1;
    
    const staggerOffset = index * 0.2;
    const calloutProgress = (progress - staggerOffset) / 0.3;
    return Math.max(0, Math.min(1, calloutProgress));
  };

  const getCalloutTransform = (index: number) => {
    if (prefersReducedMotion) return 'translateY(0)';
    
    const opacity = getCalloutOpacity(index);
    const translateY = (1 - opacity) * 30;
    return `translateY(${translateY}px)`;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-[150vh]',
        className
      )}
      role="list"
      aria-label={t.act1.impacts.ariaLabel}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Section intro */}
          <p 
            className={cn(
              'text-center text-lg md:text-xl text-muted-foreground mb-12 transition-opacity duration-500',
              progress > 0.1 || prefersReducedMotion ? 'opacity-100' : 'opacity-0'
            )}
          >
            {t.act1.impacts.intro}
          </p>
          
          {/* Callout cards */}
          <div className="space-y-6">
            {callouts.map((callout, index) => {
              const Icon = callout.icon;
              const opacity = getCalloutOpacity(index);
              const transform = getCalloutTransform(index);
              
              return (
                <div
                  key={callout.id}
                  role="listitem"
                  className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-xl bg-card/10 backdrop-blur-sm border border-border/30 transition-all duration-500"
                  style={{ 
                    opacity, 
                    transform,
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-destructive" />
                  </div>
                  <span className="text-lg md:text-xl font-medium">
                    {callout.text}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Closing note - no explanation yet */}
          <p 
            className={cn(
              'mt-12 text-center text-muted-foreground italic transition-all duration-700',
              progress > 0.8 || prefersReducedMotion ? 'opacity-100' : 'opacity-0'
            )}
          >
            {t.act1.impacts.closing}
          </p>
        </div>
      </div>
    </div>
  );
}
