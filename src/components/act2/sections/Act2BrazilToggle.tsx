import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, WORLD_SOURCES, BRAZIL_SOURCES } from '../SankeyFlow';

interface Act2BrazilToggleProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  selectedRegion: 'world' | 'brazil';
  onRegionToggle: (region: 'world' | 'brazil') => void;
  flowVisibility: number;
  atmosphereThickness: number;
}

/**
 * ACT 2.5 - Brazil Toggle (Critical Moment)
 *
 * Interaction:
 * - A toggle appears: MUNDO | BRASIL
 * - Default: MUNDO
 *
 * When user toggles to BRASIL:
 * - Flows reconfigure smoothly
 * - Agriculture + Desmatamento flows expand dramatically
 * - Fossil fuel flows shrink comparatively
 * - Subtle Amazon aerial texture fades in
 *
 * Text: "No Brasil, a história é diferente."
 * Follow-up: "Aqui, o desmatamento e a agropecuária dividem o protagonismo."
 */
export function Act2BrazilToggle({
  progress,
  isActive,
  reducedMotion,
  selectedRegion,
  onRegionToggle,
  flowVisibility,
  atmosphereThickness,
}: Act2BrazilToggleProps) {
  const { t } = useTranslation();

  const isBrazil = selectedRegion === 'brazil';
  const sources = isBrazil ? BRAZIL_SOURCES : WORLD_SOURCES;

  // Toggle appearance
  const toggleOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.2) : 0;

  // Text opacities (appear after toggle is used or at scroll milestone)
  const textOpacity = isBrazil
    ? Math.min(1, progress / 0.5)
    : progress > 0.6 ? Math.min(1, (progress - 0.6) / 0.2) : 0;

  const followUpOpacity = isBrazil && progress > 0.4
    ? Math.min(1, (progress - 0.4) / 0.3)
    : 0;

  // Amazon texture for Brazil
  const amazonOpacity = isBrazil ? Math.min(0.15, progress * 0.2) : 0;

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
      {/* Amazon texture background (for Brazil) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isBrazil
            ? 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")'
            : 'none',
          opacity: amazonOpacity,
          mixBlendMode: 'overlay',
          transition: reducedMotion ? 'none' : 'opacity 0.8s ease-out',
        }}
      />

      {/* Atmospheric layer */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: `${20 + atmosphereThickness * 25}%`,
          background: `linear-gradient(to bottom,
            rgba(${isBrazil ? '34, 197, 94' : '127, 29, 29'}, ${0.1 + atmosphereThickness * 0.2}) 0%,
            rgba(245, 158, 11, ${0.05 + atmosphereThickness * 0.15}) 40%,
            transparent 100%)`,
          transition: reducedMotion ? 'none' : 'background 0.8s ease-out',
        }}
      />

      {/* Toggle Control */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
        style={{
          opacity: toggleOpacity,
          transform: `translateY(${(1 - toggleOpacity) * -20}px)`,
          transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
        }}
      >
        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => onRegionToggle('world')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              !isBrazil
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80'
            )}
            style={{
              transition: reducedMotion ? 'none' : 'all 0.3s ease-out',
            }}
          >
            {t.act2?.toggle?.world || 'MUNDO'}
          </button>
          <button
            onClick={() => onRegionToggle('brazil')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              isBrazil
                ? 'bg-green-600/80 text-white'
                : 'text-white/60 hover:text-white/80'
            )}
            style={{
              transition: reducedMotion ? 'none' : 'all 0.3s ease-out',
            }}
          >
            {t.act2?.toggle?.brazil || 'BRASIL'}
          </button>
        </div>
      </div>

      {/* Sankey visualization */}
      <div className="h-full flex pt-20">
        <div
          className="w-2/5 h-full relative"
          style={{ opacity: flowVisibility }}
        >
          {/* Activity icons */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {sources.map((source) => {
              const isHighlighted = isBrazil &&
                (source.id === 'deforestation' || source.id === 'agriculture');

              return (
                <div
                  key={source.id}
                  className="flex items-center gap-2"
                  style={{
                    transform: isHighlighted
                      ? 'scale(1.1)'
                      : 'scale(1)',
                    transition: reducedMotion ? 'none' : 'transform 0.5s ease-out',
                  }}
                >
                  <ActivityIcon
                    type={source.id as 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation'}
                    size={28}
                    reducedMotion={reducedMotion}
                    className={isHighlighted ? 'text-white' : ''}
                  />
                  <span
                    className={cn(
                      'text-xs hidden sm:block transition-colors',
                      isHighlighted ? 'text-white/90' : 'text-white/40'
                    )}
                  >
                    {source.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Flows SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="deforestation-br" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(220, 38, 38, 0.9)" />
                <stop offset="100%" stopColor="rgba(220, 38, 38, 0.5)" />
              </linearGradient>
              <linearGradient id="agriculture-br" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.9)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0.5)" />
              </linearGradient>
              <linearGradient id="other-br" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(107, 114, 128, 0.5)" />
                <stop offset="100%" stopColor="rgba(107, 114, 128, 0.2)" />
              </linearGradient>
              <filter id="glow-brazil">
                <feGaussianBlur stdDeviation="4" result="blur" />
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
              const flowWidth = (source.value / 100) * 40 + 2;

              const isHighlighted = isBrazil &&
                (source.id === 'deforestation' || source.id === 'agriculture');

              let gradient = 'url(#other-br)';
              if (source.id === 'deforestation') gradient = 'url(#deforestation-br)';
              if (source.id === 'agriculture') gradient = 'url(#agriculture-br)';

              return (
                <g key={source.id}>
                  <path
                    d={`M ${startX} ${startY}
                        Q ${startX + 60} ${startY},
                          ${(startX + endX) / 2} ${(startY + endY) / 2}
                        T ${endX} ${endY}`}
                    fill="none"
                    stroke={gradient}
                    strokeWidth={flowWidth}
                    strokeLinecap="round"
                    filter={isHighlighted ? 'url(#glow-brazil)' : 'none'}
                    style={{
                      transition: reducedMotion ? 'none' : 'all 0.8s ease-out',
                    }}
                  />

                  {!reducedMotion && (
                    <circle
                      r={Math.max(2, flowWidth / 3)}
                      fill={source.id === 'agriculture' ? '#F59E0B' :
                            source.id === 'deforestation' ? '#DC2626' : '#6B7280'}
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
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          {isBrazil ? (
            <>
              <div
                style={{
                  opacity: textOpacity,
                  transform: reducedMotion
                    ? 'none'
                    : `translateY(${(1 - textOpacity) * 15}px)`,
                  transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
                }}
              >
                <p className="text-xl md:text-2xl text-white/90 text-center max-w-md font-medium">
                  {t.act2?.toggle?.brazilText || 'No Brasil, a história é diferente.'}
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
                <p className="text-base md:text-lg text-white/70 text-center max-w-md">
                  {t.act2?.toggle?.brazilFollowUp || 'Aqui, o desmatamento e a agropecuária dividem o protagonismo.'}
                </p>
              </div>

              {/* Brazil-specific percentages */}
              <div
                className="flex gap-8 mt-4"
                style={{
                  opacity: followUpOpacity,
                  transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">~27%</div>
                  <div className="text-xs text-white/50">{t.act2?.toggle?.deforestationLabel || 'Desmatamento'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">~28%</div>
                  <div className="text-xs text-white/50">{t.act2?.toggle?.agricultureLabel || 'Agropecuária'}</div>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                opacity: textOpacity,
                transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
              }}
            >
              <p className="text-lg text-white/60 text-center max-w-md">
                {t.act2?.toggle?.worldPrompt || 'Toque em "Brasil" para ver a diferença.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
