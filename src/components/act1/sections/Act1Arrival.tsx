import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1ArrivalProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  /** Continuous opacity from global visual state (no discrete transitions) */
  continuousOpacity?: number;
}

/**
 * ACT 1.0 - Arrival (Silence Before Data)
 *
 * Visual: Fullscreen black, no UI, no charts, no scroll indicator
 * Text: Centered - "Em 2024, o planeta cruzou um limite que nunca deveria ter sido normal."
 * Behavior: Text fades continuously based on global scroll progress (no discrete enter/exit)
 */
export function Act1Arrival({ progress, isActive, reducedMotion, continuousOpacity }: Act1ArrivalProps) {
  const { t } = useTranslation();

  // Use continuous opacity from parent if provided, otherwise fall back to local calculation
  const opacity = continuousOpacity !== undefined
    ? continuousOpacity
    : (() => {
        if (reducedMotion) return isActive ? 1 : 0;
        if (progress < 0.3) return progress / 0.3;
        if (progress > 0.7) return 1 - (progress - 0.7) / 0.3;
        return 1;
      })();

  // Only render when visible
  if (opacity <= 0 && !isActive) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-500',
        !isActive && progress >= 1 ? 'pointer-events-none' : ''
      )}
      style={{
        opacity: isActive ? 1 : progress < 1 ? 1 : 0,
        zIndex: isActive ? 50 : 0,
      }}
    >
      <p
        className="text-center text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl px-8 leading-relaxed font-display"
        style={{
          opacity,
          transform: reducedMotion ? 'none' : `translateY(${(1 - opacity) * 20}px)`,
          transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {t.act1.arrival.text}
      </p>
    </div>
  );
}
