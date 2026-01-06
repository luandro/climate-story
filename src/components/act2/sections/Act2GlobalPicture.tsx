import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, WORLD_SOURCES } from '../SankeyFlow';

interface Act2GlobalPictureProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  flowVisibility: number;
  atmosphereThickness: number;
}

/**
 * ACT 2.4 - The Global Picture
 *
 * State:
 * - Sankey fully visible
 * - Balanced proportions
 *
 * Highlight:
 * - Fossil fuels dominate (Energy + Transport + Industry flows are the widest)
 *
 * Text: "No mundo, a principal causa é clara: a queima de combustíveis fósseis."
 * Micro-text: "Carvão, petróleo e gás."
 */
export function Act2GlobalPicture({
  progress,
  isActive,
  reducedMotion,
  flowVisibility,
  atmosphereThickness,
}: Act2GlobalPictureProps) {
  const { t } = useTranslation();

  // Highlight fossil fuel flows (energy, transport, industry)
  const highlightProgress = Math.min(1, progress * 1.5);

  // Text opacities
  const mainTextOpacity = progress > 0.2 ? Math.min(1, (progress - 0.2) / 0.3) : 0;
  const microTextOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.3) : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  // Calculate total fossil fuel percentage
  const fossilFuelSources = ['energy', 'transport', 'industry'];
  const fossilTotal = WORLD_SOURCES
    .filter(s => fossilFuelSources.includes(s.id))
    .reduce((sum, s) => sum + s.value, 0);

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
      {/* Atmospheric layer (maintained) */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: `${20 + atmosphereThickness * 25}%`,
          background: `linear-gradient(to bottom,
            rgba(127, 29, 29, ${0.1 + atmosphereThickness * 0.3}) 0%,
            rgba(245, 158, 11, ${0.05 + atmosphereThickness * 0.15}) 40%,
            transparent 100%)`,
        }}
      />

      {/* Sankey visualization with fossil fuel highlight */}
      <div className="h-full flex">
        <div
          className="w-2/5 h-full relative"
          style={{ opacity: flowVisibility }}
        >
          {/* Activity icons with highlight */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {WORLD_SOURCES.map((source) => {
              const isFossil = fossilFuelSources.includes(source.id);
              const iconOpacity = isFossil
                ? 1
                : 1 - highlightProgress * 0.6;

              return (
                <div
                  key={source.id}
                  className="flex items-center gap-2"
                  style={{
                    opacity: iconOpacity,
                    transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
                  }}
                >
                  <ActivityIcon
                    type={source.id as 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation'}
                    size={28}
                    reducedMotion={reducedMotion}
                    className={isFossil && highlightProgress > 0.5 ? 'text-white' : ''}
                  />
                </div>
              );
            })}
          </div>

          {/* Flows SVG with fossil fuel emphasis */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="fossil-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(75, 85, 99, 0.9)" />
                <stop offset="100%" stopColor="rgba(75, 85, 99, 0.5)" />
              </linearGradient>
              <linearGradient id="other-flow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(127, 29, 29, 0.4)" />
                <stop offset="100%" stopColor="rgba(127, 29, 29, 0.2)" />
              </linearGradient>
              <filter id="glow-global">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {WORLD_SOURCES.map((source, index) => {
              const startY = 80 + index * 60;
              const startX = 50;
              const endX = 180;
              const endY = 30 + index * 15;
              const baseWidth = (source.value / 100) * 30 + 3;

              const isFossil = fossilFuelSources.includes(source.id);
              const flowWidth = isFossil ? baseWidth * (1 + highlightProgress * 0.3) : baseWidth;
              const flowOpacity = isFossil ? 1 : 1 - highlightProgress * 0.5;

              return (
                <g key={source.id} style={{ opacity: flowOpacity }}>
                  <path
                    d={`M ${startX} ${startY}
                        Q ${startX + 60} ${startY},
                          ${(startX + endX) / 2} ${(startY + endY) / 2}
                        T ${endX} ${endY}`}
                    fill="none"
                    stroke={isFossil ? 'url(#fossil-highlight)' : 'url(#other-flow)'}
                    strokeWidth={flowWidth}
                    strokeLinecap="round"
                    filter={isFossil && highlightProgress > 0.5 ? 'url(#glow-global)' : 'none'}
                    style={{
                      transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
                    }}
                  />

                  {!reducedMotion && isFossil && (
                    <circle
                      r={flowWidth / 3}
                      fill="#4B5563"
                    >
                      <animateMotion
                        dur={`${2 + index * 0.2}s`}
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
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          {/* Percentage indicator */}
          <div
            className="mb-4"
            style={{
              opacity: mainTextOpacity,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white/90">
              ~{fossilTotal}%
            </div>
            <div className="text-sm text-white/50 text-center mt-1">
              {t.act2?.global?.percentLabel || 'das emissões globais'}
            </div>
          </div>

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
              {t.act2?.global?.text || 'No mundo, a principal causa é clara:'}
              <br />
              <span className="font-semibold">
                {t.act2?.global?.emphasis || 'a queima de combustíveis fósseis.'}
              </span>
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
            <p className="text-sm text-white/50 text-center">
              {t.act2?.global?.microText || 'Carvão, petróleo e gás.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
