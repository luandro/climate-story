import { useTranslation } from '@/contexts/LanguageContext';
import { useGlobalScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

interface ScrollProgressIndicatorProps {
  className?: string;
}

export function ScrollProgressIndicator({ className }: ScrollProgressIndicatorProps) {
  const { t } = useTranslation();
  const { progress } = useGlobalScrollProgress();

  return (
    <div 
      className={cn('fixed top-0 left-0 right-0 z-50 h-1', className)}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t.accessibility.scrollProgress}
    >
      <div 
        className="h-full bg-primary transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
