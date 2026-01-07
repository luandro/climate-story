import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act2TransitionProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 2.10 - Transition to Act 3
 *
 * Visual:
 * - Sankey flows begin to thin
 * - Some flows reverse direction slightly (visual metaphor for solutions)
 *
 * Text: "A seguir: O que realmente muda o jogo."
 *
 * Scroll Handoff:
 * - Motion shifts from flow explanation → interactive comparison
 * - Act 3 begins
 */
export function Act2Transition({
  progress,
  isActive,
  reducedMotion,
}: Act2TransitionProps) {
  const { t } = useTranslation();

  // Flows thin out
  const flowFade = 1 - progress * 0.7;

  // Reverse flow hint (some particles go back)
  const reverseHint = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.4) : 0;

  // Text opacity
  const textOpacity = progress > 0.2 ? Math.min(1, (progress - 0.2) / 0.3) : 0;

  // Bottom line (similar to Act 1 transition)
  const lineWidth = Math.min(100, progress * 120);

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
        background: 'linear-gradient(to bottom, #171717 0%, #0f0f0f 100%)',
      }}
    >
      {/* Fading flows visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-64 h-64 md:w-80 md:h-80"
          style={{
            opacity: flowFade,
            transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
          }}
        >
          <defs>
            <linearGradient id="act2-fade-flow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(156, 163, 175, 0.4)" />
              <stop offset="100%" stopColor="rgba(156, 163, 175, 0.1)" />
            </linearGradient>
          </defs>

          {/* Thinning flows */}
          {[0, 1, 2, 3, 4].map((i) => {
            const startX = 30 + i * 8;
            const baseWidth = 6 - i * 0.8;
            const width = baseWidth * flowFade;

            return (
              <g key={i}>
                <path
                  d={`M ${startX} 180 Q ${startX + 20} 100, ${100 + i * 10} 20`}
                  fill="none"
                  stroke="url(#act2-fade-flow)"
                  strokeWidth={Math.max(1, width)}
                  strokeLinecap="round"
                  style={{
                    transition: reducedMotion ? 'none' : 'stroke-width 0.5s ease-out',
                  }}
                />

                {/* Normal upward particle */}
                {!reducedMotion && flowFade > 0.3 && (
                  <circle r={2} fill="#9CA3AF" opacity={0.5}>
                    <animateMotion
                      dur={`${2 + i * 0.3}s`}
                      repeatCount="indefinite"
                      path={`M ${startX} 180 Q ${startX + 20} 100, ${100 + i * 10} 20`}
                    />
                  </circle>
                )}

                {/* Reverse particle (solution hint) */}
                {!reducedMotion && reverseHint > 0.3 && i % 2 === 0 && (
                  <circle r={2} fill="#22C55E" opacity={reverseHint * 0.6}>
                    <animateMotion
                      dur={`${2.5 + i * 0.2}s`}
                      repeatCount="indefinite"
                      keyPoints="1;0"
                      keyTimes="0;1"
                      path={`M ${startX} 180 Q ${startX + 20} 100, ${100 + i * 10} 20`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Text content */}
      <div
        className="absolute bottom-1/3 left-0 right-0 flex flex-col items-center px-6"
        style={{
          opacity: textOpacity,
          transform: reducedMotion
            ? 'none'
            : `translateY(${(1 - textOpacity) * 15}px)`,
          transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
        }}
      >
        <p className="text-lg md:text-xl text-white/60 text-center max-w-md">
          {t.act2?.transition?.text || ''}
        </p>
      </div>

      {/* Bottom progress line (bridge to Act 3) */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div
          className={cn(
            'h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent',
            reducedMotion ? '' : 'transition-all duration-500'
          )}
          style={{
            width: `${lineWidth}%`,
            opacity: textOpacity,
          }}
        />
      </div>

      {/* Scroll hint */}
      {progress > 0.6 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{
            opacity: Math.min(1, (progress - 0.6) / 0.3),
          }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div
              className={cn(
                'w-1 h-2 bg-white/40 rounded-full mt-2',
                !reducedMotion && 'animate-bounce'
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
