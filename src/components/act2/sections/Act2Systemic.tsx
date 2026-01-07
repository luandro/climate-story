import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon, BRAZIL_SOURCES, WORLD_SOURCES } from '../SankeyFlow';

interface Act2SystemicProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  selectedRegion: 'world' | 'brazil';
}

/**
 * ACT 2.8 - Systemic, Not Individual
 *
 * Visual:
 * - Zoom out: entire Sankey visible again
 * - Icons regain equal opacity
 *
 * Text: "Não é sobre escolhas individuais."
 * Follow-up: "É sobre sistemas inteiros de produção e uso da terra."
 *
 * This line is crucial for narrative ethics.
 */
export function Act2Systemic({
  progress,
  isActive,
  reducedMotion,
  selectedRegion,
}: Act2SystemicProps) {
  const { t } = useTranslation();

  const sources = selectedRegion === 'brazil' ? BRAZIL_SOURCES : WORLD_SOURCES;

  // Zoom out effect: all elements return to equal opacity
  const equalizeProgress = Math.min(1, progress * 2);

  // Text opacities
  const mainTextOpacity = progress > 0.2 ? Math.min(1, (progress - 0.2) / 0.3) : 0;
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
      {/* Atmospheric layer (neutral) */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '30%',
          background: `linear-gradient(to bottom,
            rgba(107, 114, 128, 0.2) 0%,
            rgba(75, 85, 99, 0.1) 50%,
            transparent 100%)`,
        }}
      />

      {/* Full Sankey visualization (zoomed out, all equal) */}
      <div className="h-full flex">
        <div className="w-2/5 h-full relative">
          {/* Activity icons - all equal opacity */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2"
                style={{
                  opacity: 0.3 + equalizeProgress * 0.7,
                  transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
                }}
              >
                <ActivityIcon
                  type={source.id}
                  size={28}
                  reducedMotion={reducedMotion}
                />
                <span className="text-xs text-white/50 hidden sm:block">
                  {source.label}
                </span>
              </div>
            ))}
          </div>

          {/* Flows SVG - all visible equally */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="act2-systemic-flow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(156, 163, 175, 0.6)" />
                <stop offset="100%" stopColor="rgba(156, 163, 175, 0.3)" />
              </linearGradient>
            </defs>

            {sources.map((source, index) => {
              const startY = 80 + index * 60;
              const startX = 50;
              const endX = 180;
              const endY = 30 + index * 15;
              const flowWidth = (source.value / 100) * 35 + 3;

              return (
                <g key={source.id}>
                  <path
                    d={`M ${startX} ${startY}
                        Q ${startX + 60} ${startY},
                          ${(startX + endX) / 2} ${(startY + endY) / 2}
                        T ${endX} ${endY}`}
                    fill="none"
                    stroke="url(#act2-systemic-flow)"
                    strokeWidth={flowWidth}
                    strokeLinecap="round"
                    style={{
                      opacity: 0.4 + equalizeProgress * 0.6,
                      transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
                    }}
                  />

                  {!reducedMotion && (
                    <circle
                      r={Math.max(2, flowWidth / 4)}
                      fill="#9CA3AF"
                      opacity={0.6}
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

        {/* Text content - crucial ethical framing */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
          <div
            style={{
              opacity: mainTextOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - mainTextOpacity) * 15}px)`,
              transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 text-center max-w-lg font-medium">
              {t.act2?.systemic?.text || ''}
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
            <p className="text-lg md:text-xl text-white/70 text-center max-w-md">
              {t.act2?.systemic?.followUp || ''}
            </p>
          </div>

          {/* Visual: interconnected system metaphor */}
          <div
            className="mt-6 flex items-center gap-3"
            style={{
              opacity: followUpOpacity * 0.7,
              transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
            }}
          >
            {['energy', 'transport', 'industry', 'agriculture', 'deforestation'].map((type, i) => (
              <div
                key={type}
                className="relative"
              >
                <ActivityIcon
                  type={type as 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation'}
                  size={24}
                  reducedMotion={reducedMotion}
                  className="text-white/50"
                />
                {i < 4 && (
                  <div className="absolute -right-2 top-1/2 w-1 h-px bg-white/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
