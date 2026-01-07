import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3CleanEnergyProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  isHighlighted: boolean;
}

/**
 * ACT 3.6 - Clean Energy
 *
 * Visual:
 * - Sun icon with radiating energy
 * - Cost comparison bar
 *
 * Text:
 * "A transição energética já está em curso."
 * "Hoje, a energia solar é em média 41% mais barata que a alternativa fóssil mais barata."
 */
export function Act3CleanEnergy({
  progress,
  isActive,
  reducedMotion,
  isHighlighted,
}: Act3CleanEnergyProps) {
  const { t } = useTranslation();

  // Text opacity
  const textOpacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.8
      ? 1 - (progress - 0.8) / 0.2
      : 1;

  // Data callout
  const dataOpacity = progress > 0.4
    ? Math.min(1, (progress - 0.4) / 0.2)
    : 0;

  // Source
  const sourceOpacity = progress > 0.7
    ? Math.min(1, (progress - 0.7) / 0.2)
    : 0;

  // Sun visualization
  const sunProgress = progress > 0.1
    ? Math.min(1, (progress - 0.1) / 0.4)
    : 0;

  // Yellow glow intensity
  const glowIntensity = isHighlighted ? 0.5 : 0.3;

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
      {/* Sun visualization */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2"
        style={{
          opacity: sunProgress,
          transform: reducedMotion
            ? 'translateX(-50%)'
            : `translateX(-50%) scale(${0.5 + sunProgress * 0.5})`,
          transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
        }}
      >
        {/* Sun glow */}
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(250, 204, 21, ${glowIntensity}) 0%, rgba(251, 146, 60, ${glowIntensity * 0.5}) 50%, transparent 70%)`,
            boxShadow: `0 0 60px rgba(250, 204, 21, ${glowIntensity})`,
          }}
        />

        {/* Sun rays */}
        {!reducedMotion && [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-t from-yellow-400/40 to-transparent origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
              opacity: sunProgress * 0.6,
              animation: `act3-pulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-32 md:pt-40">
        {/* Main text */}
        <p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 text-center max-w-2xl font-light"
          style={{
            opacity: textOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - textOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
          }}
        >
          {t.act3?.cleanEnergy?.text || 'A transição energética já está em curso.'}
        </p>

        {/* Data callout with comparison */}
        <div
          className="mt-8 w-full max-w-md"
          style={{
            opacity: dataOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - dataOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          <div className="px-6 py-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-base md:text-lg text-yellow-200 text-center mb-4">
              {t.act3?.cleanEnergy?.data || 'Hoje, a energia solar é em média 41% mais barata que a alternativa fóssil mais barata.'}
            </p>

            {/* Cost comparison visualization */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-16">Fóssil</span>
                <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-16">Solar</span>
                <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: '59%' }}
                  />
                </div>
                <span className="text-xs text-green-400 font-medium">-41%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Source */}
        <p
          className="text-sm text-white/40 text-center mt-6"
          style={{
            opacity: sourceOpacity,
          }}
        >
          {t.act3?.cleanEnergy?.source || 'IRENA (2024)'}
        </p>
      </div>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes act3-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -100%) rotate(var(--rotation, 0deg)) scaleY(1);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -100%) rotate(var(--rotation, 0deg)) scaleY(1.2);
          }
        }
      `}</style>
    </div>
  );
}
