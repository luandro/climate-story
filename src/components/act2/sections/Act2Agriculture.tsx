import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, BRAZIL_SOURCES } from '../SankeyFlow';

interface Act2AgricultureProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  selectedRegion: 'world' | 'brazil';
  focusedSource: 'deforestation' | 'agriculture' | null;
}

/**
 * ACT 2.7 - Focus: Agropecuária
 *
 * Visual emphasis:
 * - Switch highlight to Agricultura → Metano
 * - Methane flow glows slightly warmer
 *
 * Text: "A criação intensiva de gado libera metano,"
 * Follow-up: "um gás muito mais potente que o CO₂ no curto prazo."
 *
 * No percentages here — potency is enough.
 */
export function Act2Agriculture({
  progress,
  isActive,
  reducedMotion,
  selectedRegion,
  focusedSource,
}: Act2AgricultureProps) {
  const { t } = useTranslation();

  const sources = BRAZIL_SOURCES;

  // Text opacities
  const mainTextOpacity = progress > 0.15 ? Math.min(1, (progress - 0.15) / 0.25) : 0;
  const followUpOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.3) : 0;

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
      {/* Atmospheric layer with orange/methane tint */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '35%',
          background: `linear-gradient(to bottom,
            rgba(245, 158, 11, 0.25) 0%,
            rgba(217, 119, 6, 0.1) 50%,
            transparent 100%)`,
        }}
      />

      {/* Sankey visualization with agriculture focus */}
      <div className="h-full flex">
        <div className="w-2/5 h-full relative">
          {/* Activity icons */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {sources.map((source) => {
              const isAgriculture = source.id === 'agriculture';
              const opacity = isAgriculture ? 1 : 0.2;

              return (
                <div
                  key={source.id}
                  className="flex items-center gap-2"
                  style={{
                    opacity,
                    transform: isAgriculture ? 'scale(1.15)' : 'scale(1)',
                    transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
                  }}
                >
                  <ActivityIcon
                    type={source.id as 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation'}
                    size={isAgriculture ? 36 : 28}
                    reducedMotion={reducedMotion}
                    className={isAgriculture ? 'text-amber-500' : ''}
                  />
                </div>
              );
            })}
          </div>

          {/* Flows SVG with agriculture emphasis */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="agriculture-focus" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 1)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0.6)" />
              </linearGradient>
              <linearGradient id="dimmed-agri" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(107, 114, 128, 0.15)" />
                <stop offset="100%" stopColor="rgba(107, 114, 128, 0.05)" />
              </linearGradient>
              <filter id="methane-glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0.3 0 0 0
                          0.5 1 0 0 0
                          0 0 0.5 0 0
                          0 0 0 1 0"
                />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {sources.map((source, index) => {
              const startY = 80 + index * 60;
              const startX = 50;
              const endX = 180;
              const endY = 30 + index * 15;

              const isAgriculture = source.id === 'agriculture';
              const flowWidth = isAgriculture
                ? (source.value / 100) * 50 + 8
                : (source.value / 100) * 25 + 2;

              return (
                <g key={source.id}>
                  <path
                    d={`M ${startX} ${startY}
                        Q ${startX + 60} ${startY},
                          ${(startX + endX) / 2} ${(startY + endY) / 2}
                        T ${endX} ${endY}`}
                    fill="none"
                    stroke={isAgriculture ? 'url(#agriculture-focus)' : 'url(#dimmed-agri)'}
                    strokeWidth={flowWidth}
                    strokeLinecap="round"
                    filter={isAgriculture ? 'url(#methane-glow)' : 'none'}
                    style={{
                      transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
                    }}
                  >
                    {/* Warm glow animation for agriculture */}
                    {isAgriculture && !reducedMotion && (
                      <animate
                        attributeName="stroke-opacity"
                        values="0.8;1;0.8"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    )}
                  </path>

                  {/* Animated particles for agriculture only */}
                  {!reducedMotion && isAgriculture && (
                    <>
                      <circle r={5} fill="#F59E0B">
                        <animateMotion
                          dur="2.5s"
                          repeatCount="indefinite"
                          path={`M ${startX} ${startY}
                                Q ${startX + 60} ${startY},
                                  ${(startX + endX) / 2} ${(startY + endY) / 2}
                                T ${endX} ${endY}`}
                        />
                      </circle>
                      <circle r={3} fill="#FCD34D">
                        <animateMotion
                          dur="2.5s"
                          repeatCount="indefinite"
                          begin="0.4s"
                          path={`M ${startX} ${startY}
                                Q ${startX + 60} ${startY},
                                  ${(startX + endX) / 2} ${(startY + endY) / 2}
                                T ${endX} ${endY}`}
                        />
                      </circle>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Text content */}
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
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 text-center max-w-md leading-relaxed">
              {t.act2?.agriculture?.text || 'A criação intensiva de gado libera'}
              {' '}
              <span className="text-amber-400 font-medium">
                {t.act2?.agriculture?.methane || 'metano'}
              </span>,
            </p>
          </div>

          <div
            style={{
              opacity: followUpOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - followUpOpacity) * 10}px)`,
              transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            }}
          >
            <p className="text-base md:text-lg text-white/60 text-center max-w-sm">
              {t.act2?.agriculture?.followUp || 'um gás muito mais potente que o CO₂ no curto prazo.'}
            </p>
          </div>

          {/* Potency indicator (visual, not percentage) */}
          <div
            className="mt-4 flex items-center gap-4"
            style={{
              opacity: followUpOpacity * 0.8,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs text-white/60">CO₂</span>
              </div>
            </div>
            <div className="text-white/30">vs</div>
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0.2) 100%)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                }}
              >
                <span className="text-sm text-amber-400 font-medium">CH₄</span>
              </div>
              <span className="text-xs text-amber-400/60 mt-1">
                {t.act2?.agriculture?.potencyLabel || '80x mais potente*'}
              </span>
            </div>
          </div>

          <p
            className="text-xs text-white/30 mt-2"
            style={{
              opacity: followUpOpacity * 0.6,
            }}
          >
            {t.act2?.agriculture?.potencyNote || '*em 20 anos'}
          </p>
        </div>
      </div>
    </div>
  );
}
