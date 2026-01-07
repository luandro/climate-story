import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3EntryProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 3.0 - The Turn
 *
 * Visual:
 * - Transition from Act 2's dark atmosphere
 * - Green particles begin to appear (hope)
 *
 * Text:
 * "A boa notícia: existem formas comprovadas de mudar esse cenário."
 * Follow-up: "Algumas são tecnológicas. Outras são sociais. Outras são territoriais."
 */
export function Act3Entry({
  progress,
  isActive,
  reducedMotion,
}: Act3EntryProps) {
  const { t } = useTranslation();

  // Main text opacity
  const mainTextOpacity = progress < 0.3
    ? progress / 0.3
    : 1;

  // Follow-up text appears sequentially
  const followUp1Opacity = progress > 0.4 ? Math.min(1, (progress - 0.4) / 0.2) : 0;
  const followUp2Opacity = progress > 0.55 ? Math.min(1, (progress - 0.55) / 0.2) : 0;
  const followUp3Opacity = progress > 0.7 ? Math.min(1, (progress - 0.7) / 0.2) : 0;

  // Green glow intensity
  const glowIntensity = Math.min(0.3, progress * 0.4);

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
      {/* Green particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {!reducedMotion && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-green-500/30"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${20 + (i * 11) % 60}%`,
              opacity: glowIntensity * (0.3 + (i % 3) * 0.2),
              animation: reducedMotion
                ? 'none'
                : `act3-float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Central green glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(34, 197, 94, ${glowIntensity}) 0%, transparent 50%)`,
        }}
      />

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* Main text */}
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: mainTextOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - mainTextOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
          }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light mb-2">
            {t.act3?.entry?.text || 'A boa notícia:'}
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl text-green-400 font-medium">
            {t.act3?.entry?.emphasis || 'existem formas comprovadas de mudar esse cenário.'}
          </p>
        </div>

        {/* Follow-up texts */}
        <div className="mt-12 space-y-3 text-center">
          <p
            className="text-lg md:text-xl text-white/60"
            style={{
              opacity: followUp1Opacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - followUp1Opacity) * 10}px)`,
              transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            }}
          >
            {t.act3?.entry?.followUp1 || 'Algumas são tecnológicas.'}
          </p>
          <p
            className="text-lg md:text-xl text-white/60"
            style={{
              opacity: followUp2Opacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - followUp2Opacity) * 10}px)`,
              transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            }}
          >
            {t.act3?.entry?.followUp2 || 'Outras são sociais.'}
          </p>
          <p
            className="text-lg md:text-xl text-white/60"
            style={{
              opacity: followUp3Opacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - followUp3Opacity) * 10}px)`,
              transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            }}
          >
            {t.act3?.entry?.followUp3 || 'Outras são territoriais.'}
          </p>
        </div>
      </div>

      {/* CSS for float animation */}
      <style>{`
        @keyframes act3-float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
