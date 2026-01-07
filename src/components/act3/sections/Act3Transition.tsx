import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3TransitionProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 3.12 - Transition to Act 4
 *
 * Visual:
 * - Green glow fades
 * - Forward-looking arrow/path appears
 *
 * Text:
 * "A seguir: o que está sendo prometido — e o que ainda falta fazer."
 */
export function Act3Transition({
  progress,
  isActive,
  reducedMotion,
}: Act3TransitionProps) {
  const { t } = useTranslation();

  // Green glow fades out
  const glowFade = 1 - progress * 0.8;

  // Text opacity
  const textOpacity = progress > 0.2 ? Math.min(1, (progress - 0.2) / 0.3) : 0;

  // Path/arrow visualization
  const pathProgress = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.4) : 0;

  // Bottom line (bridge to Act 4)
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
        background: 'linear-gradient(to bottom, #0f170f 0%, #0f0f0f 100%)',
      }}
    >
      {/* Fading green glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(34, 197, 94, ${glowFade * 0.2}) 0%, transparent 50%)`,
        }}
      />

      {/* Forward path visualization */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: pathProgress,
        }}
      >
        <svg
          viewBox="0 0 200 150"
          className="w-64 h-48 md:w-80 md:h-60"
        >
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
              <stop offset="50%" stopColor="rgba(234, 179, 8, 0.5)" />
              <stop offset="100%" stopColor="rgba(234, 179, 8, 0.3)" />
            </linearGradient>
          </defs>

          {/* Path from solutions to future */}
          <path
            d="M 20 75 Q 60 60, 100 75 Q 140 90, 180 75"
            fill="none"
            stroke="url(#path-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={reducedMotion ? 'none' : '10 5'}
            style={{
              strokeDashoffset: reducedMotion ? 0 : 300 - (pathProgress * 300),
              transition: reducedMotion ? 'none' : 'stroke-dashoffset 1s ease-out',
            }}
          />

          {/* Arrow head */}
          <polygon
            points="175,70 185,75 175,80"
            fill="rgba(234, 179, 8, 0.6)"
            style={{
              opacity: pathProgress,
            }}
          />

          {/* Start point (solutions - green) */}
          <circle cx="20" cy="75" r="8" fill="rgba(34, 197, 94, 0.5)">
            {!reducedMotion && (
              <animate
                attributeName="r"
                values="8;10;8"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* End point (future - yellow/gold) */}
          <circle cx="180" cy="75" r="8" fill="rgba(234, 179, 8, 0.5)">
            {!reducedMotion && (
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* Labels */}
          <text x="20" y="100" fill="rgba(34, 197, 94, 0.7)" fontSize="10" textAnchor="middle">
            Soluções
          </text>
          <text x="180" y="100" fill="rgba(234, 179, 8, 0.7)" fontSize="10" textAnchor="middle">
            Metas
          </text>
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
          {t.act3?.transition?.text || 'A seguir: o que está sendo prometido — e o que ainda falta fazer.'}
        </p>
      </div>

      {/* Bottom progress line (bridge to Act 4) */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div
          className={cn(
            'h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent',
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
