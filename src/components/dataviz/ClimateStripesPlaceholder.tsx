import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ClimateStripesPlaceholderProps {
  startYear?: number;
  endYear?: number;
  className?: string;
}

export function ClimateStripesPlaceholder({
  startYear = 1850,
  endYear = 2024,
  className,
}: ClimateStripesPlaceholderProps) {
  const { t } = useTranslation();
  const years = endYear - startYear;
  
  // Generate placeholder stripes with a gradient from cold (blue) to warm (red)
  const stripes = Array.from({ length: Math.min(years, 174) }, (_, i) => {
    const progress = i / (years - 1);
    // Simulate temperature anomaly progression
    const hue = 210 - progress * 210; // From blue (210) to red (0)
    const saturation = 60 + progress * 30;
    const lightness = 50 + (1 - progress) * 20;
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });

  return (
    <div 
      className={cn('w-full max-w-4xl mx-auto p-6', className)}
      role="img"
      aria-label={t.dataviz.climateStripes.alt}
    >
      <h3 className="font-display text-xl font-semibold mb-4 text-center">
        {t.dataviz.climateStripes.title}
      </h3>
      
      <div className="flex h-32 md:h-48 w-full rounded overflow-hidden shadow-lg">
        {stripes.map((color, index) => (
          <div
            key={index}
            className="flex-1 h-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>{startYear}</span>
        <span>{endYear}</span>
      </div>
    </div>
  );
}
