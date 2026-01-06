import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1LandingProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 1.6 - Landing
 *
 * Visual: Cards dissolve, background becomes calm dark gray (not black)
 * Text (centered):
 *   "Isso não é um cenário futuro."
 *   "É o ponto em que já estamos."
 * Subtext: "O que vem a seguir depende do que fazemos agora."
 */
export function Act1Landing({ progress, isActive, reducedMotion }: Act1LandingProps) {
  const { t } = useTranslation();

  // Text animations with stagger
  const mainTextOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.25) : 0;
  const subTextOpacity = progress > 0.35 ? Math.min(1, (progress - 0.35) / 0.25) : 0;
  const followUpOpacity = progress > 0.6 ? Math.min(1, (progress - 0.6) / 0.25) : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        // Calm dark gray, not pure black
        background: 'linear-gradient(to bottom, #1a1a1a 0%, #262626 50%, #1f1f1f 100%)',
        opacity: sectionOpacity,
        zIndex: isActive ? 20 : 0,
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          {/* Main text - first line */}
          <h2
            className={cn(
              'text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 transition-all',
              reducedMotion ? '' : 'duration-700'
            )}
            style={{
              opacity: mainTextOpacity,
              transform: reducedMotion ? 'none' : `translateY(${(1 - mainTextOpacity) * 20}px)`,
            }}
          >
            {t.act1.landing.mainText}
          </h2>

          {/* Main text - second line */}
          <h2
            className={cn(
              'text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white/90 mb-12 transition-all',
              reducedMotion ? '' : 'duration-700'
            )}
            style={{
              opacity: subTextOpacity,
              transform: reducedMotion ? 'none' : `translateY(${(1 - subTextOpacity) * 20}px)`,
            }}
          >
            {t.act1.landing.subText}
          </h2>

          {/* Follow-up text */}
          <p
            className={cn(
              'text-lg md:text-xl text-white/50 transition-all',
              reducedMotion ? '' : 'duration-700'
            )}
            style={{
              opacity: followUpOpacity,
              transform: reducedMotion ? 'none' : `translateY(${(1 - followUpOpacity) * 15}px)`,
            }}
          >
            {t.act1.landing.followUp}
          </p>
        </div>
      </div>
    </div>
  );
}
