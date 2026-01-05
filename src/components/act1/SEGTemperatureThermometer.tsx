import { useRef, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SEGTemperatureThermometerProps {
  baselineTemp?: number;
  brazilAnomaly: number;
  globalAnomaly?: number;
  className?: string;
}

export function SEGTemperatureThermometer({
  baselineTemp = 0,
  brazilAnomaly,
  globalAnomaly,
  className
}: SEGTemperatureThermometerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0.1 });
  const { t } = useTranslation();
  
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Calculate mercury height based on scroll progress
  // Animation completes at 80% scroll, leaving room for label fade-in
  const animationProgress = prefersReducedMotion ? 1 : Math.min(progress / 0.8, 1);
  const mercuryHeight = animationProgress * 100;
  
  // Show label after animation completes (after 80% scroll)
  const showLabel = progress > 0.8 || prefersReducedMotion;
  
  // Calculate color based on temperature progress
  // cold (blue) -> neutral (yellow) -> warm (orange) -> critical (red)
  const getTemperatureColor = (fillProgress: number) => {
    if (fillProgress < 0.3) {
      return 'var(--thermo-cold)';
    } else if (fillProgress < 0.6) {
      return 'var(--thermo-warm)';
    } else {
      return 'var(--thermo-critical)';
    }
  };

  const currentColor = getTemperatureColor(animationProgress);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-[300vh]', // Extended scroll height for sticky effect
        className
      )}
      role="img"
      aria-label={t.act1.thermometer.ariaLabel}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 px-6 max-w-6xl mx-auto w-full">
          {/* Thermometer Visual */}
          <div className="relative flex-shrink-0">
            {/* Thermometer container */}
            <div 
              className="relative w-20 md:w-24 h-[60vh] max-h-[500px] rounded-full bg-card/20 border-2 border-border overflow-hidden"
              style={{
                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              {/* Scale markers */}
              <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between py-8 px-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-muted-foreground/40" />
                  </div>
                ))}
              </div>
              
              {/* Mercury fill */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 md:w-14 rounded-full transition-all duration-300"
                style={{
                  height: `${mercuryHeight}%`,
                  background: `linear-gradient(
                    to top,
                    hsl(var(--thermo-cold)) 0%,
                    hsl(var(--thermo-warm)) 50%,
                    hsl(var(--thermo-critical)) 100%
                  )`,
                  boxShadow: `0 0 20px hsl(var(--thermo-warm) / 0.4)`
                }}
              />
              
              {/* Global average marker (optional) */}
              {globalAnomaly && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-muted-foreground/60 border-dashed"
                  style={{
                    bottom: `${(globalAnomaly / brazilAnomaly) * 100}%`,
                  }}
                >
                  <span className="absolute -right-2 translate-x-full text-xs text-muted-foreground whitespace-nowrap">
                    {t.act1.thermometer.globalAverage}
                  </span>
                </div>
              )}
            </div>
            
            {/* Thermometer bulb */}
            <div 
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-28 md:w-32 h-28 md:h-32 rounded-full border-2 border-border"
              style={{
                background: `radial-gradient(
                  circle at 30% 30%,
                  hsl(var(--thermo-warm)),
                  hsl(var(--thermo-critical))
                )`,
                boxShadow: `0 0 40px hsl(var(--thermo-critical) / 0.3)`
              }}
            />
          </div>
          
          {/* Temperature Label & Narrative */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            {/* Numeric value - fades in after animation */}
            <div 
              className={cn(
                'transition-all duration-700',
                showLabel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <span className="block text-6xl md:text-8xl font-bold font-display text-destructive">
                +{brazilAnomaly.toFixed(1)}
              </span>
              <span className="block text-xl md:text-2xl text-muted-foreground mt-2">
                {t.act1.thermometer.unit}
              </span>
            </div>
            
            {/* Narrative text - appears with label */}
            <p 
              className={cn(
                'mt-8 text-lg md:text-xl leading-relaxed transition-all duration-700 delay-200',
                showLabel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              {t.act1.thermometer.narrative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
