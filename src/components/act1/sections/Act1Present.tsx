import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1PresentProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

// Climate stripes for background (all red for 2024)
const STRIPE_YEARS = Array.from({ length: 125 }, (_, i) => 1900 + i);

// Easing function for smooth transitions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * ACT 1.3 - The Present Moment
 *
 * Visual: Thermometer at +1.6°C, red saturation, climate stripes almost entirely red
 * Main Text: "2024 foi o ano mais quente já registrado."
 * Subtext: "+1,6 °C em relação ao período pré-industrial"
 * Credibility: "Medições independentes da NASA, Copernicus e da OMM."
 *
 * DWELL: Last 45% of section progress is a "hold" where visuals stay constant
 * This creates breathing room at the peak before moving to the split-screen
 */
export function Act1Present({ progress, isActive, reducedMotion }: Act1PresentProps) {
  const { t } = useTranslation();

  // Content progress: 0-55% of section = animation, 55-100% = dwell (capped at 1)
  // This creates a "breathing room" where user scrolls but visuals stay at peak
  const contentProgress = Math.min(1, progress / 0.55);
  const isDwelling = progress > 0.55;

  // Get stripe color with smooth HSL interpolation
  const getStripeColor = (year: number) => {
    const yearProgress = (year - 1900) / 124;
    const temp = yearProgress * 1.6;

    // Smooth HSL interpolation from blue to red
    const hue = 210 - (temp / 1.6) * 210;
    const saturation = 70 + (temp / 1.6) * 20;
    const lightness = 55 - (temp / 1.6) * 10;

    return `hsl(${Math.max(0, hue)}, ${saturation}%, ${lightness}%)`;
  };

  // Text animations with easing (all reach full opacity before dwell starts)
  const mainTextOpacity = contentProgress > 0.1
    ? easeOutCubic(Math.min(1, (contentProgress - 0.1) / 0.25))
    : 0;
  const subTextOpacity = contentProgress > 0.35
    ? easeOutCubic(Math.min(1, (contentProgress - 0.35) / 0.25))
    : 0;
  const credibilityOpacity = contentProgress > 0.6
    ? easeOutCubic(Math.min(1, (contentProgress - 0.6) / 0.25))
    : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  // During dwell, add a subtle "breathing" effect to indicate the pause
  const dwellPulse = isDwelling && !reducedMotion ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        opacity: sectionOpacity,
        zIndex: isActive ? 35 : 0,
      }}
    >
      {/* Climate Stripes Background - fully visible, mostly red */}
      <div className="absolute inset-0 flex" aria-hidden="true">
        {STRIPE_YEARS.map((year) => (
          <div
            key={year}
            className="flex-1 h-full"
            style={{
              backgroundColor: getStripeColor(year),
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Dark overlay for readability - slightly lighter during dwell */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
        style={{
          opacity: 0.75 + contentProgress * 0.15,
          transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
        }}
      />

      {/* Red glow effect - uses CSS animation for performance */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          !reducedMotion && 'animate-pulse-glow'
        )}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Temperature display */}
        <div
          className="mb-8 text-center"
          style={{
            opacity: mainTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - mainTextOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <span className="text-7xl md:text-9xl font-bold font-display text-red-500">
            +1,6
          </span>
          <span className="text-3xl md:text-4xl text-white/80 ml-2">°C</span>
        </div>

        {/* Main text */}
        <h2
          className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-center text-white max-w-4xl mb-6"
          style={{
            opacity: mainTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - mainTextOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          {t.act1.present.mainText}
        </h2>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl text-white/70 text-center max-w-2xl mb-12"
          style={{
            opacity: subTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - subTextOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          {t.act1.present.subText}
        </p>

        {/* Credibility micro-text */}
        <p
          className="text-sm text-white/40 text-center max-w-xl"
          style={{
            opacity: credibilityOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - credibilityOpacity) * 10}px)`,
            transition: reducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          {t.act1.present.credibility}
        </p>

        {/* Dwell indicator - subtle hint to keep scrolling */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          style={{
            opacity: dwellPulse * 0.4,
            transition: 'opacity 0.8s ease-out',
          }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div
              className="w-1 h-3 bg-white/30 rounded-full mt-2"
              style={{
                animation: isDwelling && !reducedMotion ? 'bounce 1.5s ease-in-out infinite' : 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional CSS for bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
