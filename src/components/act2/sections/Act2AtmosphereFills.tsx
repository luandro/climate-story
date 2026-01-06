import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, WORLD_SOURCES } from '../SankeyFlow';

interface Act2AtmosphereFillsProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  flowVisibility: number;
  atmosphereThickness: number;
  heatShimmer: number;
}

/**
 * ACT 2.3 - The Atmosphere Fills
 *
 * Visual:
 * - Top of screen becomes a semi-transparent "atmospheric layer"
 * - As flows accumulate: layer thickens, background darkens, heat shimmer increases
 *
 * Text (appears after visual builds):
 * "Quanto mais gases, mais calor fica retido."
 */
export function Act2AtmosphereFills({
  progress,
  isActive,
  reducedMotion,
  flowVisibility,
  atmosphereThickness,
  heatShimmer,
}: Act2AtmosphereFillsProps) {
  const { t } = useTranslation();

  // Text opacity: appears after atmosphere builds
  const textOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.3) : 0;

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
      {/* Atmospheric layer at top */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden"
        style={{
          height: `${20 + atmosphereThickness * 25}%`,
          background: `linear-gradient(to bottom,
            rgba(127, 29, 29, ${0.1 + atmosphereThickness * 0.3}) 0%,
            rgba(245, 158, 11, ${0.05 + atmosphereThickness * 0.15}) 40%,
            transparent 100%)`,
          transition: reducedMotion ? 'none' : 'all 0.8s ease-out',
        }}
      >
        {/* Heat shimmer effect */}
        {!reducedMotion && heatShimmer > 0 && (
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent 0%,
                rgba(255, 100, 50, ${heatShimmer * 0.05}) 2%,
                transparent 4%
              )`,
              animation: 'shimmer 3s ease-in-out infinite',
              opacity: heatShimmer,
            }}
          />
        )}
      </div>

      {/* Sankey visualization (simplified continuation) */}
      <div className="h-full flex">
        <div
          className="w-2/5 h-full relative"
          style={{ opacity: flowVisibility }}
        >
          {/* Activity icons */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {WORLD_SOURCES.map((source) => (
              <div key={source.id} className="flex items-center gap-2">
                <ActivityIcon
                  type={source.id as 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation'}
                  size={28}
                  reducedMotion={reducedMotion}
                />
              </div>
            ))}
          </div>

          {/* Flows SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="co2-atm-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(127, 29, 29, 0.7)" />
                <stop offset="100%" stopColor="rgba(127, 29, 29, 0.3)" />
              </linearGradient>
              <linearGradient id="ch4-atm-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.7)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0.3)" />
              </linearGradient>
            </defs>

            {WORLD_SOURCES.map((source, index) => {
              const startY = 80 + index * 60;
              const startX = 50;
              const endX = 180;
              const endY = 30 + index * 15;
              const flowWidth = (source.value / 100) * 30 + 3;

              return (
                <g key={source.id}>
                  <path
                    d={`M ${startX} ${startY}
                        Q ${startX + 60} ${startY},
                          ${(startX + endX) / 2} ${(startY + endY) / 2}
                        T ${endX} ${endY}`}
                    fill="none"
                    stroke={source.gasType === 'ch4' ? 'url(#ch4-atm-gradient)' : 'url(#co2-atm-gradient)'}
                    strokeWidth={flowWidth}
                    strokeLinecap="round"
                  />

                  {!reducedMotion && (
                    <circle
                      r={flowWidth / 3}
                      fill={source.gasType === 'ch4' ? '#F59E0B' : '#7F1D1D'}
                    >
                      <animateMotion
                        dur={`${2.5 + index * 0.3}s`}
                        repeatCount="indefinite"
                        path={`M ${startX} ${startY}
                              Q ${startX + 60} ${startY},
                                ${(startX + endX) / 2} ${(startY + endY) / 2}
                              T ${endX} ${endY}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Text content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div
            style={{
              opacity: textOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - textOpacity) * 15}px)`,
              transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            }}
          >
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 text-center max-w-md">
              {t.act2?.atmosphere?.text || 'Quanto mais gases, mais calor fica retido.'}
            </p>
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
