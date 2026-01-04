import { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CompareToggleProps {
  beforeSrc?: string;
  afterSrc?: string;
  className?: string;
}

export function CompareToggle({
  beforeSrc = '/assets/demo/before.png',
  afterSrc = '/assets/demo/after.png',
  className,
}: CompareToggleProps) {
  const { t } = useTranslation();
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className={cn('w-full max-w-2xl mx-auto p-6', className)}>
      <fieldset>
        <legend className="sr-only">{t.components.compareToggle.label}</legend>
        
        {/* Toggle buttons */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setShowAfter(false)}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-medium transition-all',
              !showAfter 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            aria-pressed={!showAfter}
          >
            {t.components.compareToggle.before}
          </button>
          <button
            type="button"
            onClick={() => setShowAfter(true)}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-medium transition-all',
              showAfter 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            aria-pressed={showAfter}
          >
            {t.components.compareToggle.after}
          </button>
        </div>
      </fieldset>
      
      {/* Image comparison area */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        {/* Before image */}
        <div 
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            showAfter ? 'opacity-0' : 'opacity-100'
          )}
        >
          <div className="w-full h-full bg-gradient-to-br from-viz-warm/30 to-viz-neutral/30 flex items-center justify-center">
            <span className="text-lg text-muted-foreground">
              {t.components.compareToggle.before}
            </span>
          </div>
        </div>
        
        {/* After image */}
        <div 
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            showAfter ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="w-full h-full bg-gradient-to-br from-viz-positive/30 to-viz-cold/30 flex items-center justify-center">
            <span className="text-lg text-muted-foreground">
              {t.components.compareToggle.after}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
