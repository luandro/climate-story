import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SankeyPlaceholderProps {
  sources?: Array<{ name: string; value: number }>;
  className?: string;
}

export function SankeyPlaceholder({
  sources = [
    { name: 'Energy', value: 40 },
    { name: 'Transport', value: 25 },
    { name: 'Industry', value: 20 },
    { name: 'Agriculture', value: 15 },
  ],
  className,
}: SankeyPlaceholderProps) {
  const { t } = useTranslation();
  
  const total = sources.reduce((sum, s) => sum + s.value, 0);
  const colors = [
    'bg-viz-warm',
    'bg-viz-neutral',
    'bg-primary',
    'bg-viz-positive',
  ];

  return (
    <div 
      className={cn('w-full max-w-2xl mx-auto p-6', className)}
      role="img"
      aria-label={t.dataviz.sankey.alt}
    >
      <h3 className="font-display text-xl font-semibold mb-6 text-center">
        {t.dataviz.sankey.title}
      </h3>
      
      {/* Simplified Sankey representation */}
      <div className="space-y-4">
        {sources.map((source, index) => {
          const widthPercent = (source.value / total) * 100;
          
          return (
            <div key={source.name} className="flex items-center gap-4">
              <span className="w-24 text-sm text-right text-muted-foreground">
                {source.name}
              </span>
              <div className="flex-1 h-8 bg-muted rounded overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded transition-all duration-700',
                    colors[index % colors.length]
                  )}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium">
                {source.value}%
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Flow indicator placeholder */}
      <div className="mt-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-px w-16 bg-border" />
          <span className="text-xs">Emissions Flow</span>
          <div className="h-px w-16 bg-border" />
        </div>
      </div>
    </div>
  );
}
