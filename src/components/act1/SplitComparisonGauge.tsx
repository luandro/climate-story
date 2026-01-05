import { useRef, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SplitComparisonGaugeProps {
  globalAnomaly: number;
  brazilAnomaly: number;
  className?: string;
}

export function SplitComparisonGauge({
  globalAnomaly,
  brazilAnomaly,
  className
}: SplitComparisonGaugeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0.2 });
  const { t } = useTranslation();
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const animationProgress = prefersReducedMotion ? 1 : Math.min(progress / 0.8, 1);
  
  // Scale for visual representation (max at 3°C)
  const maxScale = 3;
  const globalHeight = (globalAnomaly / maxScale) * 100;
  const brazilHeight = (brazilAnomaly / maxScale) * 100;
  
  // Animated heights
  const animatedGlobalHeight = globalHeight * animationProgress;
  const animatedBrazilHeight = brazilHeight * animationProgress;
  
  const showLabels = animationProgress > 0.7 || prefersReducedMotion;

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-[200vh]',
        className
      )}
      role="img"
      aria-label={t.act1.comparison.ariaLabel}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Title */}
          <h3 className="text-center text-xl md:text-2xl font-display font-semibold mb-12 text-muted-foreground">
            {t.act1.comparison.title}
          </h3>
          
          {/* Comparison bars */}
          <div className="flex items-end justify-center gap-8 md:gap-16 h-[40vh] max-h-[400px]">
            {/* Global Average */}
            <div className="flex flex-col items-center flex-1 max-w-[200px]">
              <div className="relative w-full h-full flex items-end justify-center">
                {/* Bar container */}
                <div className="relative w-20 md:w-28 h-full bg-card/10 rounded-t-lg overflow-hidden border border-border/30">
                  {/* Filled portion */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${animatedGlobalHeight}%`,
                      background: 'linear-gradient(to top, hsl(var(--thermo-cold)), hsl(var(--thermo-warm)))'
                    }}
                  />
                </div>
                
                {/* Value label */}
                <div 
                  className={cn(
                    'absolute -top-16 left-1/2 -translate-x-1/2 text-center transition-all duration-500',
                    showLabels ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                >
                  <span className="text-3xl md:text-4xl font-bold text-viz-warm">
                    +{globalAnomaly.toFixed(1)}
                  </span>
                  <span className="text-lg text-muted-foreground">°C</span>
                </div>
              </div>
              
              {/* Label */}
              <div className="mt-4 text-center">
                <span className="text-sm md:text-base font-medium">{t.act1.comparison.globalLabel}</span>
              </div>
            </div>
            
            {/* Brazil Regional */}
            <div className="flex flex-col items-center flex-1 max-w-[200px]">
              <div className="relative w-full h-full flex items-end justify-center">
                {/* Bar container */}
                <div className="relative w-20 md:w-28 h-full bg-card/10 rounded-t-lg overflow-hidden border border-border/30">
                  {/* Filled portion */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${animatedBrazilHeight}%`,
                      background: 'linear-gradient(to top, hsl(var(--thermo-warm)), hsl(var(--thermo-critical)))'
                    }}
                  />
                </div>
                
                {/* Value label */}
                <div 
                  className={cn(
                    'absolute -top-16 left-1/2 -translate-x-1/2 text-center transition-all duration-500',
                    showLabels ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                >
                  <span className="text-3xl md:text-4xl font-bold text-destructive">
                    +{brazilAnomaly.toFixed(1)}
                  </span>
                  <span className="text-lg text-muted-foreground">°C</span>
                </div>
              </div>
              
              {/* Label */}
              <div className="mt-4 text-center">
                <span className="text-sm md:text-base font-medium">{t.act1.comparison.brazilLabel}</span>
              </div>
            </div>
          </div>
          
          {/* Narrative */}
          <p 
            className={cn(
              'mt-12 text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700',
              showLabels ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            {t.act1.comparison.narrative}
          </p>
        </div>
      </div>
    </div>
  );
}
