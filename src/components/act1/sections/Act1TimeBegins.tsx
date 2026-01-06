import { useMemo } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1TimeBeginsProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

// Temperature data from 1900 to 2024
const TEMPERATURE_DATA = [
  { year: 1900, anomaly: 0.0 },
  { year: 1920, anomaly: 0.1 },
  { year: 1940, anomaly: 0.15 },
  { year: 1950, anomaly: 0.2 },
  { year: 1960, anomaly: 0.25 },
  { year: 1970, anomaly: 0.3 },
  { year: 1980, anomaly: 0.4 },
  { year: 1990, anomaly: 0.6 },
  { year: 2000, anomaly: 0.8 },
  { year: 2010, anomaly: 1.0 },
  { year: 2020, anomaly: 1.4 },
  { year: 2024, anomaly: 1.6 },
];

// Climate stripes data (simplified - showing transition from cold to warm)
const STRIPE_YEARS = Array.from({ length: 125 }, (_, i) => 1900 + i);

// Easing function for smooth intro
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * ACT 1.1 & 1.2 - Time Begins + Warming Over Time
 *
 * Visual: Vertical thermometer (LEFT), horizontal timeline (RIGHT)
 * Climate stripes fade in behind content
 * Year progression: 1900 -> 2024
 * Temperature: 0°C -> 1.6°C
 *
 * Intro: First 15% of progress = gentle fade-in/slide-in of elements
 */
export function Act1TimeBegins({ progress, isActive, reducedMotion }: Act1TimeBeginsProps) {
  const { t } = useTranslation();

  // Intro animation: first 15% of section is fade-in
  const introProgress = Math.min(1, progress / 0.15);
  const introOpacity = reducedMotion ? 1 : easeOutCubic(introProgress);
  const introTranslateY = reducedMotion ? 0 : (1 - easeOutCubic(introProgress)) * 30;

  // Content progress: starts after intro (15% to 100% mapped to 0-1)
  const contentProgress = progress < 0.15 ? 0 : (progress - 0.15) / 0.85;

  // Map content progress to year (0 = 1900, 1 = 2024)
  const currentYear = Math.round(1900 + contentProgress * 124);

  // Calculate current temperature anomaly based on interpolation with boundary validation
  const currentTemperature = useMemo(() => {
    const firstDataPoint = TEMPERATURE_DATA[0];
    const lastDataPoint = TEMPERATURE_DATA[TEMPERATURE_DATA.length - 1];

    // Boundary validation: clamp to data range
    if (currentYear <= firstDataPoint.year) {
      return firstDataPoint.anomaly;
    }
    if (currentYear >= lastDataPoint.year) {
      return lastDataPoint.anomaly;
    }

    // Find the two data points to interpolate between
    for (let i = 0; i < TEMPERATURE_DATA.length - 1; i++) {
      const curr = TEMPERATURE_DATA[i];
      const next = TEMPERATURE_DATA[i + 1];
      if (currentYear >= curr.year && currentYear <= next.year) {
        // Prevent division by zero
        const yearRange = next.year - curr.year;
        if (yearRange === 0) return curr.anomaly;

        const yearProgress = (currentYear - curr.year) / yearRange;
        return curr.anomaly + yearProgress * (next.anomaly - curr.anomaly);
      }
    }

    // Fallback (should not reach here with proper data)
    return lastDataPoint.anomaly;
  }, [currentYear]);

  // Thermometer fill percentage (0-100)
  const thermometerFill = (currentTemperature / 1.6) * 100;

  // Get color based on temperature with smooth interpolation
  const getTemperatureColor = (temp: number) => {
    if (temp < 0.3) return 'from-blue-500 to-blue-400';
    if (temp < 0.6) return 'from-blue-400 to-yellow-400';
    if (temp < 1.0) return 'from-yellow-400 to-orange-500';
    return 'from-orange-500 to-red-600';
  };

  // Get stripe color for a year with smoother color transitions
  const getStripeColor = (year: number) => {
    const yearProgress = (year - 1900) / 124;
    const temp = yearProgress * 1.6;

    // Smooth HSL interpolation from blue to red
    // Blue: hsl(210, 70%, 55%) -> Red: hsl(0, 90%, 45%)
    const hue = 210 - (temp / 1.6) * 210;
    const saturation = 70 + (temp / 1.6) * 20;
    const lightness = 55 - (temp / 1.6) * 10;

    return `hsl(${Math.max(0, hue)}, ${saturation}%, ${lightness}%)`;
  };

  // Narrative text visibility (adjusted for content progress)
  const showText1 = contentProgress > 0.3 && contentProgress < 0.75;
  const showText2 = contentProgress > 0.6;

  // Climate stripes visibility (fade in after intro and some content progress)
  const stripesOpacity = Math.min(1, Math.max(0, (contentProgress - 0.2) / 0.3)) * introOpacity;

  // Overall section opacity
  const sectionOpacity = isActive ? 1 : 0;

  // Visible stripe count based on current year
  const visibleStripes = Math.max(0, currentYear - 1900 + 1);

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-black transition-opacity duration-700',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        opacity: sectionOpacity,
        zIndex: isActive ? 40 : 0,
      }}
    >
      {/* Climate Stripes Background */}
      <div
        className="absolute inset-0 flex"
        style={{
          opacity: stripesOpacity * 0.3,
          transition: reducedMotion ? 'none' : 'opacity 1s ease-out',
        }}
        aria-hidden="true"
      >
        {STRIPE_YEARS.slice(0, visibleStripes).map((year, i) => (
          <div
            key={year}
            className="flex-1 h-full"
            style={{
              backgroundColor: getStripeColor(year),
              opacity: i < visibleStripes ? 1 : 0,
              transition: reducedMotion ? 'none' : 'background-color 0.5s ease-out',
            }}
          />
        ))}
      </div>

      {/* Main Content with intro animation */}
      <div
        className="relative z-10 h-full flex items-center justify-center px-6"
        style={{
          opacity: introOpacity,
          transform: `translateY(${introTranslateY}px)`,
          transition: reducedMotion ? 'none' : 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full max-w-6xl">
          {/* LEFT: Thermometer */}
          <div
            className="flex-shrink-0 flex flex-col items-center"
            style={{
              opacity: introOpacity,
              transform: `translateX(${reducedMotion ? 0 : (1 - introOpacity) * -20}px)`,
              transition: reducedMotion ? 'none' : 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            {/* Temperature value */}
            <div className="mb-4 text-center">
              <span className="text-4xl md:text-5xl font-bold tabular-nums text-white">
                +{currentTemperature.toFixed(1)}
              </span>
              <span className="text-lg text-white/70 ml-1">°C</span>
            </div>

            {/* Thermometer container */}
            <div className="relative w-16 md:w-20 h-[40vh] max-h-[350px] rounded-full bg-white/10 border border-white/20 overflow-hidden">
              {/* Scale markers */}
              <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between py-4 px-2">
                {[1.5, 1.0, 0.5, 0].map((temp) => (
                  <div key={temp} className="flex items-center gap-1">
                    <div className="w-2 h-px bg-white/30" />
                    <span className="text-[10px] text-white/40">{temp}</span>
                  </div>
                ))}
              </div>

              {/* Mercury fill */}
              <div
                className={cn(
                  'absolute bottom-0 left-1/2 -translate-x-1/2 w-10 md:w-12 rounded-full bg-gradient-to-t',
                  getTemperatureColor(currentTemperature)
                )}
                style={{
                  height: `${Math.min(100, thermometerFill)}%`,
                  boxShadow: currentTemperature > 1.0
                    ? '0 0 20px rgba(239, 68, 68, 0.4)'
                    : '0 0 10px rgba(59, 130, 246, 0.3)',
                  transition: reducedMotion ? 'none' : 'height 0.3s ease-out, box-shadow 0.5s ease-out',
                }}
              />
            </div>

            {/* Thermometer bulb */}
            <div
              className={cn(
                'w-20 md:w-24 h-20 md:h-24 -mt-4 rounded-full bg-gradient-to-br',
                currentTemperature > 1.0
                  ? 'from-orange-500 to-red-600'
                  : currentTemperature > 0.5
                  ? 'from-yellow-400 to-orange-500'
                  : 'from-blue-400 to-blue-500'
              )}
              style={{
                boxShadow: currentTemperature > 1.0
                  ? '0 0 30px rgba(239, 68, 68, 0.5)'
                  : '0 0 20px rgba(59, 130, 246, 0.3)',
                transition: reducedMotion ? 'none' : 'box-shadow 0.5s ease-out',
              }}
            />
          </div>

          {/* RIGHT: Timeline + Narrative */}
          <div
            className="flex-1 max-w-xl"
            style={{
              opacity: introOpacity,
              transform: `translateX(${reducedMotion ? 0 : (1 - introOpacity) * 20}px)`,
              transition: reducedMotion ? 'none' : 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            {/* Year display */}
            <div className="mb-8">
              <span className="text-6xl md:text-8xl font-bold font-display tabular-nums text-white">
                {currentYear}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full"
                style={{
                  width: `${contentProgress * 100}%`,
                  transition: reducedMotion ? 'none' : 'width 0.1s ease-out',
                }}
              />
              {/* Year markers */}
              <div className="absolute inset-0 flex justify-between items-center">
                {[1900, 1950, 1980, 2000, 2024].map((year) => (
                  <div
                    key={year}
                    className="w-1 h-3 bg-white/30 rounded-full"
                    style={{
                      opacity: currentYear >= year ? 1 : 0.3,
                      transition: reducedMotion ? 'none' : 'opacity 0.3s ease-out',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Year labels */}
            <div className="flex justify-between text-xs text-white/50 mb-8">
              <span>1900</span>
              <span>2024</span>
            </div>

            {/* Narrative text */}
            <div className="space-y-4">
              <p
                className="text-lg md:text-xl text-white/80"
                style={{
                  opacity: showText1 ? 1 : 0,
                  transform: showText1 ? 'translateY(0)' : 'translateY(10px)',
                  transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
                }}
              >
                {t.act1.warming.text1}
              </p>
              <p
                className="text-lg md:text-xl text-white"
                style={{
                  opacity: showText2 ? 1 : 0,
                  transform: showText2 ? 'translateY(0)' : 'translateY(10px)',
                  transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
                }}
              >
                {t.act1.warming.text2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Micro-text hint */}
      <div
        className="absolute bottom-8 right-8 text-xs text-white/40"
        style={{
          opacity: progress < 0.25 ? 1 : 0,
          transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
        }}
      >
        {t.act1.timeBegins.microText}
      </div>
    </div>
  );
}
