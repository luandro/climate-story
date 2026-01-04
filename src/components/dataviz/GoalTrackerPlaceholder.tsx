import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface GoalTrackerPlaceholderProps {
  target?: number;
  current?: number;
  projected?: number;
  className?: string;
}

export function GoalTrackerPlaceholder({
  target = 1.5,
  current = 1.1,
  projected = 2.7,
  className,
}: GoalTrackerPlaceholderProps) {
  const { t } = useTranslation();

  const maxValue = Math.max(projected, 3);
  const targetPercent = (target / maxValue) * 100;
  const currentPercent = (current / maxValue) * 100;
  const projectedPercent = (projected / maxValue) * 100;

  return (
    <div 
      className={cn('w-full max-w-md mx-auto p-6', className)}
      role="img"
      aria-label={t.dataviz.goalTracker.alt}
    >
      <h3 className="font-display text-xl font-semibold mb-6 text-center">
        {t.dataviz.goalTracker.title}
      </h3>
      
      {/* Vertical progress tracker */}
      <div className="relative h-64 flex justify-center">
        {/* Track */}
        <div className="w-4 h-full bg-muted rounded-full relative overflow-hidden">
          {/* Current progress fill */}
          <div 
            className="absolute bottom-0 w-full bg-accent rounded-full transition-all duration-700"
            style={{ height: `${currentPercent}%` }}
          />
        </div>
        
        {/* Markers */}
        <div className="absolute left-1/2 w-full max-w-xs -translate-x-1/2">
          {/* Projected marker */}
          <div 
            className="absolute left-0 right-0 flex items-center"
            style={{ bottom: `${projectedPercent}%` }}
          >
            <div className="flex-1 h-px bg-destructive" />
            <div className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded ml-4">
              {projected}°C Projected
            </div>
          </div>
          
          {/* Target marker */}
          <div 
            className="absolute left-0 right-0 flex items-center"
            style={{ bottom: `${targetPercent}%` }}
          >
            <div className="flex-1 h-px bg-accent" />
            <div className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded ml-4">
              {target}°C Target
            </div>
          </div>
          
          {/* Current marker */}
          <div 
            className="absolute left-0 right-0 flex items-center"
            style={{ bottom: `${currentPercent}%` }}
          >
            <div className="flex-1 h-px bg-primary" />
            <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded ml-4">
              {current}°C Now
            </div>
          </div>
        </div>
      </div>
      
      {/* Scale */}
      <div className="flex justify-between mt-4 text-sm text-muted-foreground">
        <span>0°C</span>
        <span>{maxValue}°C</span>
      </div>
    </div>
  );
}
