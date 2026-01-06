import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, BRAZIL_SOURCES } from '../SankeyFlow';

interface Act2DeforestationProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  selectedRegion: 'world' | 'brazil';
  focusedSource: 'deforestation' | 'agriculture' | null;
}

/**
 * ACT 2.6 - Focus: Desmatamento
 *
 * Visual emphasis:
 * - Everything dims except Desmatamento → CO₂ flow
 * - Flow pulses slowly, heavier than others
 *
 * Text: "Quando uma floresta cai, o carbono armazenado é liberado."
 * Follow-up: "E a capacidade de absorver CO₂ desaparece."
 *
 * This establishes the "double impact" visually, without jargon.
 */
export function Act2Deforestation({
  progress,
  isActive,
  reducedMotion,
  selectedRegion,
  focusedSource,
}: Act2DeforestationProps) {
  const { t } = useTranslation();

  const sources = BRAZIL_SOURCES;
  const isFocused = focusedSource === 'deforestation';

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
      {/* Atmospheric layer with red tint */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '35%',
          background: `linear-gradient(to bottom,
            rgba(220, 38, 38, 0.25) 0%,
            rgba(127, 29, 29, 0.1) 50%,
            transparent 100%)`,
        }}
      />

      {/* Sankey visualization with deforestation focus */}
      <div className="h-full flex">
        <div className="w-2/5 h-full relative">
          {/* Activity icons */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {sources.map((source) => {
              const isDeforestation = source.id === 'deforestation';
              const opacity = isDeforestation ? 1 : 0.2;

              return (
                <div
                  key={source.id}
                  className="flex items-center gap-2"
                  style={{
                    opacity,
                    transform: isDeforestation ? 'scale(1.15)' : 'scale(1)',
                    transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
                  }}
                >
                  <ActivityIcon
                    type={source.id as 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation'}
                    size={isDeforestation ? 36 : 28}
                    reducedMotion={reducedMotion}
                    className={isDeforestation ? 'text-red-500' : ''}
                  />
                </div>
              );
            })}
          </div>

          {/* Flows SVG with deforestation emphasis */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="deforestation-focus" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(220, 38, 38, 1)" />
                <stop offset="100%" stopColor="rgba(220, 38, 38, 0.6)" />
              </linearGradient>
              <linearGradient id="dimmed-flow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(107, 114, 128, 0.15)" />
                <stop offset="100%" stopColor="rgba(107, 114, 128, 0.05)" />
              </linearGradient>
              <filter id="deforestation-glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {sources.map((source, index) => {
              const startY = 80 + index * 60;
              const startX = 50;
              const endX = 180;
              const endY = 30 + index * 15;

              const isDeforestation = source.id === 'deforestation';
              const flowWidth = isDeforestation
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
                    stroke={isDeforestation ? 'url(#deforestation-focus)' : 'url(#dimmed-flow)'}
                    strokeWidth={flowWidth}
                    strokeLinecap="round"
                    filter={isDeforestation ? 'url(#deforestation-glow)' : 'none'}
                    style={{
                      transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
                    }}
                  >
                    {/* Slow pulse animation for deforestation */}
                    {isDeforestation && !reducedMotion && (
                      <animate
                        attributeName="stroke-width"
                        values={`${flowWidth};${flowWidth * 1.15};${flowWidth}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </path>

                  {/* Animated particles for deforestation only */}
                  {!reducedMotion && isDeforestation && (
                    <>
                      <circle r={6} fill="#DC2626">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={`M ${startX} ${startY}
                                Q ${startX + 60} ${startY},
                                  ${(startX + endX) / 2} ${(startY + endY) / 2}
                                T ${endX} ${endY}`}
                        />
                      </circle>
                      <circle r={4} fill="#EF4444">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          begin="0.5s"
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
              {t.act2?.deforestation?.text || 'Quando uma floresta cai,'}
              <br />
              <span className="text-red-400">
                {t.act2?.deforestation?.textEmphasis || 'o carbono armazenado é liberado.'}
              </span>
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
              {t.act2?.deforestation?.followUp || 'E a capacidade de absorver CO₂ desaparece.'}
            </p>
          </div>

          {/* Visual metaphor: double impact */}
          <div
            className="flex gap-8 mt-4"
            style={{
              opacity: followUpOpacity * 0.8,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            <div className="text-center">
              <div className="text-3xl mb-1">↑</div>
              <div className="text-xs text-red-400/70">{t.act2?.deforestation?.releases || 'Libera CO₂'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">↓</div>
              <div className="text-xs text-red-400/70">{t.act2?.deforestation?.losesAbsorption || 'Perde absorção'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
