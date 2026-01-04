import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TemperatureGaugePlaceholderProps {
  current?: number;
  target?: number;
  max?: number;
  className?: string;
}

export function TemperatureGaugePlaceholder({
  current = 1.1,
  target = 1.5,
  max = 3,
  className,
}: TemperatureGaugePlaceholderProps) {
  const { t } = useTranslation();
  
  const currentPercent = (current / max) * 100;
  const targetPercent = (target / max) * 100;

  return (
    <div 
      className={cn('w-full max-w-md mx-auto p-6', className)}
      role="img"
      aria-label={t.dataviz.temperatureGauge.alt}
    >
      <h3 className="font-display text-xl font-semibold mb-6 text-center">
        {t.dataviz.temperatureGauge.title}
      </h3>
      
      {/* Gauge visualization */}
      <div className="relative">
        {/* Background track */}
        <div className="h-8 rounded-full bg-gradient-to-r from-viz-cold via-viz-neutral to-viz-warm overflow-hidden">
          {/* Current value indicator */}
          <div 
            className="absolute top-0 h-8 bg-foreground/20 transition-all duration-700"
            style={{ width: `${currentPercent}%` }}
          />
        </div>
        
        {/* Target marker */}
        <div 
          className="absolute top-0 h-8 w-1 bg-foreground"
          style={{ left: `${targetPercent}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
            {target}°C
          </div>
        </div>
        
        {/* Current value marker */}
        <div 
          className="absolute top-0 h-8 w-1 bg-accent transition-all duration-700"
          style={{ left: `${currentPercent}%` }}
        >
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap text-accent">
            {current}°C
          </div>
        </div>
      </div>
      
      {/* Scale labels */}
      <div className="flex justify-between mt-12 text-sm text-muted-foreground">
        <span>0°C</span>
        <span>{max}°C</span>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        {t.dataviz.temperatureGauge.unit}
      </p>
    </div>
  );
}
