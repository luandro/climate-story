import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, WORLD_SOURCES } from '../SankeyFlow';

interface Act2EmissionsFlowProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  flowVisibility: number;
  activitiesOpacity: number;
}

/**
 * ACT 2.2 - Emissions Start Flowing
 *
 * Visual:
 * - Sankey flows emerge from each activity
 * - Flows move upward toward atmosphere space
 *
 * Color coding:
 * - CO₂ → gray/dark red
 * - Metano (CH₄) → orange
 * - Óxido nitroso (N₂O) → yellow
 *
 * Text: "Cada atividade libera gases que ficam presos na atmosfera."
 * Micro-text: "Eles retêm calor. É isso que aquece o planeta."
 */
export function Act2EmissionsFlow({
  progress,
  isActive,
  reducedMotion,
  flowVisibility,
  activitiesOpacity,
}: Act2EmissionsFlowProps) {
  const { t } = useTranslation();

  // Flow emergence based on progress
  const flowProgress = Math.min(1, progress * 1.5);

  // Text opacities
  const mainTextOpacity = progress > 0.2 ? Math.min(1, (progress - 0.2) / 0.3) : 0;
  const microTextOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.3) : 0;

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
      <div className="h-full flex">
        {/* Left side: Activities with flows */}
        <div
          className="w-2/5 h-full relative"
          style={{ opacity: activitiesOpacity }}
        >
          {/* Activity icons */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {WORLD_SOURCES.map((source, index) => (
              <div key={source.id} className="flex items-center gap-2">
                <ActivityIcon
                  type={source.id}
                  size={28}
                  reducedMotion={reducedMotion}
                />
              </div>
            ))}
          </div>

          {/* Sankey flows SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="co2-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(127, 29, 29, 0.7)" />
                <stop offset="100%" stopColor="rgba(127, 29, 29, 0.3)" />
              </linearGradient>
              <linearGradient id="ch4-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
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

              // Stagger flow appearance
              const staggerDelay = index * 0.1;
              const localProgress = Math.max(0, flowProgress - staggerDelay) / (1 - staggerDelay);
              const pathLength = localProgress;

              return (
                <g key={source.id} style={{ opacity: flowVisibility }}>
                  <path
                    d={`M ${startX} ${startY}
                        Q ${startX + 60} ${startY},
                          ${(startX + endX) / 2} ${(startY + endY) / 2}
                        T ${endX} ${endY}`}
                    fill="none"
                    stroke={source.gasType === 'ch4' ? 'url(#ch4-gradient)' : 'url(#co2-gradient)'}
                    strokeWidth={flowWidth * flowProgress}
                    strokeLinecap="round"
                    strokeDasharray={`${pathLength * 200} 200`}
                    style={{
                      transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
                    }}
                  />

                  {/* Animated particle */}
                  {!reducedMotion && flowProgress > 0.3 && (
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

        {/* Right side: Text */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div
            style={{
              opacity: mainTextOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - mainTextOpacity) * 15}px)`,
              transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            }}
          >
            <p className="text-lg md:text-xl text-white/90 text-center max-w-md">
              {t.act2?.emissions?.text || ''}
            </p>
          </div>

          <div
            style={{
              opacity: microTextOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - microTextOpacity) * 10}px)`,
              transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            }}
          >
            <p className="text-sm md:text-base text-white/50 text-center max-w-sm">
              {t.act2?.emissions?.microText || ''}
            </p>
          </div>

          {/* Gas type legend */}
          <div
            className="flex gap-6 mt-4"
            style={{
              opacity: microTextOpacity * 0.8,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-900/70" />
              <span className="text-xs text-white/40">CO₂</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="text-xs text-white/40">CH₄</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
