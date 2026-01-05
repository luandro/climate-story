import { useRef, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TimelineDataPoint {
  year: number;
  anomaly: number;
}

interface TemperatureTimelineMiniProps {
  data?: TimelineDataPoint[];
  className?: string;
}

// Demo data showing acceleration of warming
const DEMO_TIMELINE: TimelineDataPoint[] = [
  { year: 1900, anomaly: 0 },
  { year: 1920, anomaly: 0.1 },
  { year: 1940, anomaly: 0.15 },
  { year: 1960, anomaly: 0.2 },
  { year: 1980, anomaly: 0.4 },
  { year: 2000, anomaly: 0.8 },
  { year: 2010, anomaly: 1.1 },
  { year: 2020, anomaly: 1.4 },
  { year: 2024, anomaly: 1.6 },
];

export function TemperatureTimelineMini({
  data = DEMO_TIMELINE,
  className
}: TemperatureTimelineMiniProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, isInView } = useScrollProgress(containerRef, { threshold: 0.2 });
  const { t } = useTranslation();
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animate year progression based on scroll
  const animationProgress = prefersReducedMotion ? 1 : Math.min(progress / 0.9, 1);
  const visibleDataPoints = Math.ceil(animationProgress * data.length);
  
  // Find max anomaly for scaling
  const maxAnomaly = Math.max(...data.map(d => d.anomaly));
  
  // Calculate SVG path for the line
  const pathData = useMemo(() => {
    const visibleData = data.slice(0, visibleDataPoints);
    if (visibleData.length < 2) return '';
    
    const width = 100;
    const height = 40;
    const padding = 5;
    
    const xScale = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / maxAnomaly;
    
    return visibleData.map((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.anomaly * yScale);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data, visibleDataPoints, maxAnomaly]);

  // Get current year and temperature for display
  const currentIndex = Math.min(visibleDataPoints - 1, data.length - 1);
  const currentYear = data[currentIndex]?.year || data[0].year;
  const currentAnomaly = data[currentIndex]?.anomaly || 0;

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-[150vh]',
        className
      )}
      role="img"
      aria-label={t.act1.timeline.ariaLabel}
    >
      <div className="sticky top-1/2 -translate-y-1/2 px-6 max-w-4xl mx-auto">
        <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/30">
          {/* Year display */}
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-4xl md:text-5xl font-display font-bold tabular-nums">
              {currentYear}
            </span>
            <span 
              className={cn(
                'text-2xl md:text-3xl font-bold transition-colors duration-300',
                currentAnomaly > 1 ? 'text-destructive' : 'text-viz-warm'
              )}
            >
              +{currentAnomaly.toFixed(1)}°C
            </span>
          </div>
          
          {/* Mini timeline chart */}
          <div className="relative h-20 md:h-24">
            <svg 
              viewBox="0 0 100 40" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line 
                x1="5" y1="35" x2="95" y2="35" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                strokeWidth="0.5"
              />
              <line 
                x1="5" y1="20" x2="95" y2="20" 
                stroke="hsl(var(--muted-foreground) / 0.1)" 
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              
              {/* Temperature line */}
              <path
                d={pathData}
                fill="none"
                stroke="url(#tempGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              
              {/* Current point indicator */}
              {visibleDataPoints > 0 && (
                <circle
                  cx={5 + (currentIndex / (data.length - 1)) * 90}
                  cy={35 - (currentAnomaly / maxAnomaly) * 30}
                  r="3"
                  fill="hsl(var(--destructive))"
                  className="animate-pulse"
                />
              )}
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--thermo-cold))" />
                  <stop offset="50%" stopColor="hsl(var(--thermo-warm))" />
                  <stop offset="100%" stopColor="hsl(var(--thermo-critical))" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Year labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              <span>{data[0].year}</span>
              <span>{data[data.length - 1].year}</span>
            </div>
          </div>
          
          {/* Narrative text */}
          <p 
            className={cn(
              'mt-6 text-base md:text-lg text-muted-foreground transition-opacity duration-500',
              animationProgress > 0.7 ? 'opacity-100' : 'opacity-0'
            )}
          >
            {t.act1.timeline.narrative}
          </p>
        </div>
      </div>
    </div>
  );
}
