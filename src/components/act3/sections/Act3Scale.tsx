import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3ScaleProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 3.1 - Not All Solutions Are Equal
 *
 * Visual:
 * - Empty horizontal scale appears
 * - Label: "Impacto real na redução de emissões"
 *
 * Text:
 * "Nem todas as soluções têm o mesmo peso."
 * "Algumas atuam na superfície. Outras mudam o sistema."
 */
export function Act3Scale({
  progress,
  isActive,
  reducedMotion,
}: Act3ScaleProps) {
  const { t } = useTranslation();

  // Text opacity
  const textOpacity = progress < 0.3
    ? progress / 0.3
    : progress > 0.7
      ? 1 - (progress - 0.7) / 0.3
      : 1;

  // Scale bar visibility
  const scaleVisibility = progress > 0.2 ? Math.min(1, (progress - 0.2) / 0.3) : 0;

  // Follow-up text
  const followUpOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.3) : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-500',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        opacity: sectionOpacity,
        zIndex: isActive ? 15 : 0,
      }}
    >
      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* Main text */}
        <p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 text-center max-w-2xl font-light mb-12"
          style={{
            opacity: textOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - textOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
          }}
        >
          {t.act3?.scale?.text || 'Nem todas as soluções têm o mesmo peso.'}
        </p>

        {/* Impact scale visualization */}
        <div
          className="w-full max-w-xl"
          style={{
            opacity: scaleVisibility,
            transform: reducedMotion
              ? 'none'
              : `scaleX(${scaleVisibility})`,
            transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
          }}
        >
          {/* Scale bar */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            {/* Gradient fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${scaleVisibility * 100}%`,
                background: 'linear-gradient(to right, rgba(156, 163, 175, 0.3), rgba(34, 197, 94, 0.6))',
              }}
            />
            {/* Scale markers */}
            <div className="absolute inset-0 flex justify-between px-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-px h-full bg-white/20"
                  style={{
                    opacity: scaleVisibility,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scale label */}
          <p
            className="text-sm text-white/50 text-center mt-3"
            style={{ opacity: scaleVisibility }}
          >
            {t.act3?.scale?.scaleLabel || 'Impacto real na redução de emissões'}
          </p>

          {/* Scale ends labels */}
          <div
            className="flex justify-between mt-1 text-xs text-white/40"
            style={{ opacity: scaleVisibility }}
          >
            <span>Superficial</span>
            <span>Sistêmico</span>
          </div>
        </div>

        {/* Follow-up text */}
        <p
          className="text-lg md:text-xl text-white/60 text-center max-w-md mt-12"
          style={{
            opacity: followUpOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - followUpOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.scale?.followUp || 'Algumas atuam na superfície. Outras mudam o sistema.'}
        </p>
      </div>
    </div>
  );
}
