import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1PresentProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  /** Global temperature progress (0=0°C, 1=+1.6°C) - LOCKED at 1.0 during plateau */
  temperatureProgress?: number;
  /** Global stripes opacity from continuous interpolation */
  stripesOpacity?: number;
  /** Whether we're in the scroll plateau (zero visual change) */
  inPlateau?: boolean;
  /** Progress through the plateau (0-1), for any subtle UI hints */
  plateauProgress?: number;
}

// Climate stripes for background (all red for 2024)
const STRIPE_YEARS = Array.from({ length: 125 }, (_, i) => 1900 + i);

/**
 * ACT 1.3 - The Present Moment (SCROLL PLATEAU)
 *
 * This section implements the SCROLL PLATEAU - a "dead zone" where:
 * - Scrolling continues but all visuals stay LOCKED at peak
 * - Temperature stays at +1.6°C (no change)
 * - Stripes stay fully red (no change)
 * - All text stays at full opacity (no change)
 * - This creates the "heavy, final, impossible to rush through" feeling
 *
 * Visual: Thermometer at +1.6°C, red saturation, climate stripes almost entirely red
 * Main Text: "2024 foi o ano mais quente já registrado."
 */
export function Act1Present({
  progress,
  isActive,
  reducedMotion,
  temperatureProgress = 1, // Default to peak when used for plateau
  stripesOpacity = 0.4,    // Default to full opacity
  inPlateau = false,
  plateauProgress = 0,
}: Act1PresentProps) {
  const { t } = useTranslation();

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

  /**
   * PLATEAU BEHAVIOR: During the plateau (inPlateau=true), ALL visuals are LOCKED.
   * Text opacities are all 1.0, no animation, no change whatsoever.
   * The user scrolls but nothing happens - this creates the "heavy, final" feeling.
   */

  // During plateau: all text at full opacity (locked)
  // Before/after plateau: animate based on progress
  const mainTextOpacity = inPlateau || temperatureProgress >= 1 ? 1 : Math.min(1, temperatureProgress * 1.5);
  const subTextOpacity = inPlateau || temperatureProgress >= 1 ? 1 : Math.min(1, Math.max(0, (temperatureProgress - 0.5) * 2));
  const credibilityOpacity = inPlateau || temperatureProgress >= 1 ? 1 : Math.min(1, Math.max(0, (temperatureProgress - 0.7) * 3.3));

  // Section opacity - continuous, no sudden jumps
  const sectionOpacity = isActive ? 1 : Math.max(0, 1 - progress * 2);

  // Only render when visible
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
      {/* Climate Stripes Background - all stripes visible, mostly red at peak */}
      <div className="absolute inset-0 flex" aria-hidden="true">
        {STRIPE_YEARS.map((year) => (
          <div
            key={year}
            className="flex-1 h-full"
            style={{
              backgroundColor: getStripeColor(year),
              opacity: stripesOpacity,
            }}
          />
        ))}
      </div>

      {/* Dark overlay for readability - constant during plateau */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
        style={{
          opacity: 0.9,
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

        {/* Plateau indicator - subtle hint to keep scrolling (only shows during plateau) */}
        {inPlateau && (
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            style={{
              opacity: 0.3,
            }}
          >
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
              <div
                className="w-1 h-3 bg-white/30 rounded-full mt-2"
                style={{
                  animation: !reducedMotion ? 'bounce 1.5s ease-in-out infinite' : 'none',
                }}
              />
            </div>
          </div>
        )}
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
