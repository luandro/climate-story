import { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface ImpactSandboxPlaceholderProps {
  parameters?: string[];
  className?: string;
}

export function ImpactSandboxPlaceholder({
  parameters = ['energy', 'transport', 'diet', 'consumption'],
  className,
}: ImpactSandboxPlaceholderProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(parameters.map((p) => [p, 50]))
  );

  const updateValue = (param: string, newValue: number[]) => {
    setValues((prev) => ({ ...prev, [param]: newValue[0] }));
  };

  const totalImpact = Object.values(values).reduce((sum, v) => sum + v, 0) / parameters.length;

  return (
    <div className={cn('w-full max-w-lg mx-auto p-6', className)}>
      <h3 className="font-display text-xl font-semibold mb-2 text-center">
        {t.components.impactSandbox.title}
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        {t.components.impactSandbox.instruction}
      </p>
      
      {/* Parameter sliders */}
      <div className="space-y-6">
        {parameters.map((param) => (
          <div key={param}>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium capitalize">
                {param}
              </label>
              <span className="text-sm text-muted-foreground">
                {values[param]}%
              </span>
            </div>
            <Slider
              value={[values[param]]}
              onValueChange={(v) => updateValue(param, v)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>
      
      {/* Total impact display */}
      <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20">
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Projected Impact</span>
          <div className="text-3xl font-bold text-accent mt-1">
            {totalImpact.toFixed(0)}%
          </div>
          <span className="text-xs text-muted-foreground">reduction potential</span>
        </div>
      </div>
    </div>
  );
}
