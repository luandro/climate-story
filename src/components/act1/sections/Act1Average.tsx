import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1AverageProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 1.4 - The Average Hides Reality
 *
 * Visual: Screen splits vertically (50/50)
 * LEFT: Global thermometer locked at +1.6°C (label: "Média global")
 * RIGHT: Brazil thermometer rises from 1.8 -> 2.0 -> 2.2°C (Brazil heat map overlay)
 * Center Text: "A média global não conta a história inteira."
 * Follow-up: "Algumas regiões do Brasil já vivem um mundo acima de 2 °C."
 */
export function Act1Average({ progress, isActive, reducedMotion }: Act1AverageProps) {
  const { t } = useTranslation();

  // Brazil temperature rises during section
  const brazilTemp = 1.8 + progress * 0.4; // 1.8 -> 2.2

  // Thermometer fill percentages (max at 3°C scale)
  const globalFill = (1.6 / 3) * 100;
  const brazilFill = (brazilTemp / 3) * 100;

  // Text visibility
  const centerTextOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.2) : 0;
  const followUpOpacity = progress > 0.6 ? Math.min(1, (progress - 0.6) / 0.2) : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  // Split animation - starts collapsed, expands
  const splitProgress = Math.min(1, progress / 0.3);

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-gray-950 transition-opacity duration-700',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        opacity: sectionOpacity,
        zIndex: isActive ? 30 : 0,
      }}
    >
      {/* Split container */}
      <div className="h-full flex">
        {/* LEFT - Global */}
        <div
          className="h-full flex flex-col items-center justify-center relative"
          style={{
            width: `${50 * splitProgress}%`,
            minWidth: splitProgress > 0.5 ? '40%' : '0%',
            transition: reducedMotion ? 'none' : 'width 0.5s ease-out',
          }}
        >
          {/* Subtle blue tint */}
          <div className="absolute inset-0 bg-blue-950/30" />

          <div
            className="relative z-10 flex flex-col items-center"
            style={{
              opacity: splitProgress,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            {/* Label */}
            <span className="text-sm md:text-base text-white/60 mb-4 uppercase tracking-wider">
              {t.act1.average.globalLabel}
            </span>

            {/* Thermometer */}
            <div className="relative w-12 md:w-16 h-[30vh] max-h-[250px] rounded-full bg-white/10 border border-white/20 overflow-hidden mb-4">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-10 rounded-full bg-gradient-to-t from-yellow-500 to-orange-500"
                style={{
                  height: `${globalFill}%`,
                }}
              />
            </div>

            {/* Temperature value */}
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-bold text-orange-400">+1,6</span>
              <span className="text-lg text-white/60 ml-1">°C</span>
            </div>
          </div>
        </div>

        {/* CENTER - Divider line + Text */}
        <div
          className="flex flex-col items-center justify-center px-4 md:px-8"
          style={{
            opacity: splitProgress,
          }}
        >
          {/* Vertical divider */}
          <div className="w-px h-[30vh] bg-white/20 mb-8" />

          {/* Center text */}
          <div className="text-center max-w-xs md:max-w-md">
            <p
              className={cn(
                'text-lg md:text-xl text-white/90 mb-4 transition-all',
                reducedMotion ? '' : 'duration-500'
              )}
              style={{
                opacity: centerTextOpacity,
                transform: reducedMotion ? 'none' : `translateY(${(1 - centerTextOpacity) * 10}px)`,
              }}
            >
              {t.act1.average.centerText}
            </p>

            <p
              className={cn(
                'text-base md:text-lg text-red-400 transition-all',
                reducedMotion ? '' : 'duration-500'
              )}
              style={{
                opacity: followUpOpacity,
                transform: reducedMotion ? 'none' : `translateY(${(1 - followUpOpacity) * 10}px)`,
              }}
            >
              {t.act1.average.followUp}
            </p>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-[30vh] bg-white/20 mt-8" />
        </div>

        {/* RIGHT - Brazil */}
        <div
          className="h-full flex flex-col items-center justify-center relative"
          style={{
            width: `${50 * splitProgress}%`,
            minWidth: splitProgress > 0.5 ? '40%' : '0%',
            transition: reducedMotion ? 'none' : 'width 0.5s ease-out',
          }}
        >
          {/* Heat map overlay hint */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, rgba(239, 68, 68, ${0.15 + progress * 0.15}) 0%, transparent 70%)`,
            }}
          />

          <div
            className="relative z-10 flex flex-col items-center"
            style={{
              opacity: splitProgress,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            {/* Label */}
            <span className="text-sm md:text-base text-white/60 mb-4 uppercase tracking-wider">
              {t.act1.average.brazilLabel}
            </span>

            {/* Thermometer */}
            <div className="relative w-12 md:w-16 h-[30vh] max-h-[250px] rounded-full bg-white/10 border border-white/20 overflow-hidden mb-4">
              <div
                className={cn(
                  'absolute bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-10 rounded-full bg-gradient-to-t from-red-600 to-red-500 transition-all',
                  reducedMotion ? '' : 'duration-300'
                )}
                style={{
                  height: `${brazilFill}%`,
                  boxShadow: brazilTemp > 2 ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
                }}
              />

              {/* 2°C warning line */}
              <div
                className="absolute left-0 right-0 h-px bg-red-400/50 border-t border-dashed border-red-400/50"
                style={{
                  bottom: `${(2 / 3) * 100}%`,
                }}
              >
                <span className="absolute -right-1 translate-x-full text-[10px] text-red-400/80 whitespace-nowrap">
                  2°C
                </span>
              </div>
            </div>

            {/* Temperature value */}
            <div className="text-center">
              <span
                className={cn(
                  'text-3xl md:text-4xl font-bold transition-colors',
                  brazilTemp >= 2 ? 'text-red-500' : 'text-orange-400',
                  reducedMotion ? '' : 'duration-300'
                )}
              >
                +{brazilTemp.toFixed(1).replace('.', ',')}
              </span>
              <span className="text-lg text-white/60 ml-1">°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
