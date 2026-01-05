import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1PresentProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

// Climate stripes for background (all red for 2024)
const STRIPE_YEARS = Array.from({ length: 125 }, (_, i) => 1900 + i);

/**
 * ACT 1.3 - The Present Moment
 *
 * Visual: Thermometer at +1.6°C, red saturation, climate stripes almost entirely red
 * Main Text: "2024 foi o ano mais quente já registrado."
 * Subtext: "+1,6 °C em relação ao período pré-industrial"
 * Credibility: "Medições independentes da NASA, Copernicus e da OMM."
 * Interaction: Soft scroll friction/pause
 */
export function Act1Present({ progress, isActive, reducedMotion }: Act1PresentProps) {
  const { t } = useTranslation();

  // Get stripe color (mostly red for this section)
  const getStripeColor = (year: number) => {
    const yearProgress = (year - 1900) / 124;
    const temp = yearProgress * 1.6;

    if (temp < 0.2) return 'hsl(210, 70%, 55%)';
    if (temp < 0.4) return 'hsl(200, 60%, 50%)';
    if (temp < 0.6) return 'hsl(180, 40%, 50%)';
    if (temp < 0.8) return 'hsl(50, 60%, 50%)';
    if (temp < 1.0) return 'hsl(35, 70%, 50%)';
    if (temp < 1.2) return 'hsl(20, 80%, 50%)';
    if (temp < 1.4) return 'hsl(10, 85%, 50%)';
    return 'hsl(0, 90%, 45%)';
  };

  // Text animations
  const mainTextOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.2) : 0;
  const subTextOpacity = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.2) : 0;
  const credibilityOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.2) : 0;

  // Red pulse intensity
  const pulseIntensity = Math.sin(Date.now() / 1000) * 0.1 + 0.9;

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

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
        style={{
          opacity: 0.8 + progress * 0.2,
        }}
      />

      {/* Red glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(239, 68, 68, ${0.15 * pulseIntensity}) 0%, transparent 70%)`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Temperature display */}
        <div
          className={cn(
            'mb-8 text-center transition-all',
            reducedMotion ? '' : 'duration-500'
          )}
          style={{
            opacity: mainTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - mainTextOpacity) * 20}px)`,
          }}
        >
          <span className="text-7xl md:text-9xl font-bold font-display text-red-500">
            +1,6
          </span>
          <span className="text-3xl md:text-4xl text-white/80 ml-2">°C</span>
        </div>

        {/* Main text */}
        <h2
          className={cn(
            'text-2xl md:text-4xl lg:text-5xl font-display font-bold text-center text-white max-w-4xl mb-6 transition-all',
            reducedMotion ? '' : 'duration-500'
          )}
          style={{
            opacity: mainTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - mainTextOpacity) * 20}px)`,
          }}
        >
          {t.act1.present.mainText}
        </h2>

        {/* Subtext */}
        <p
          className={cn(
            'text-lg md:text-xl text-white/70 text-center max-w-2xl mb-12 transition-all',
            reducedMotion ? '' : 'duration-500'
          )}
          style={{
            opacity: subTextOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - subTextOpacity) * 15}px)`,
          }}
        >
          {t.act1.present.subText}
        </p>

        {/* Credibility micro-text */}
        <p
          className={cn(
            'text-sm text-white/40 text-center max-w-xl transition-all',
            reducedMotion ? '' : 'duration-500'
          )}
          style={{
            opacity: credibilityOpacity,
            transform: reducedMotion ? 'none' : `translateY(${(1 - credibilityOpacity) * 10}px)`,
          }}
        >
          {t.act1.present.credibility}
        </p>
      </div>
    </div>
  );
}
