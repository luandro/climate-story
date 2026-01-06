import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act1TransitionProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 1.7 - Transition to Act 2
 *
 * Visual: Thin horizontal line appears at bottom, morphs into flow lines (Sankey hint)
 * Micro-text: "A seguir: De onde isso tudo vem?"
 * Scroll Handoff: Motion logic switches from time-based to flow-based
 * Act 2 begins seamlessly (no cut)
 */
export function Act1Transition({ progress, isActive, reducedMotion }: Act1TransitionProps) {
  const { t } = useTranslation();

  // Line animation
  const lineWidth = Math.min(100, progress * 150);
  const lineOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.3) : 0;

  // Flow lines animation (hint at Sankey)
  const flowLinesOpacity = progress > 0.4 ? Math.min(1, (progress - 0.4) / 0.4) : 0;

  // Text opacity
  const textOpacity = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.3) : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        background: 'linear-gradient(to bottom, #1f1f1f 0%, #171717 100%)',
        opacity: sectionOpacity,
        zIndex: isActive ? 15 : 0,
      }}
    >
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Empty space above */}
        <div className="flex-1" />

        {/* Center content with line animation */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Horizontal line */}
          <div
            className={cn(
              'h-px bg-white/30 transition-all',
              reducedMotion ? '' : 'duration-500'
            )}
            style={{
              width: `${lineWidth}%`,
              opacity: lineOpacity,
            }}
          />

          {/* Flow lines hint (Sankey preview) */}
          <div
            className={cn(
              'mt-8 flex gap-2 transition-all',
              reducedMotion ? '' : 'duration-700'
            )}
            style={{
              opacity: flowLinesOpacity,
            }}
          >
            {/* Multiple flow paths hinting at Act 2's Sankey diagram */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  width: '2px',
                  height: '60px',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 bg-gradient-to-b from-white/30 to-transparent"
                  style={{
                    height: '100%',
                    animation: reducedMotion ? 'none' : `flowDown ${1.5 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Micro-text at bottom */}
        <div
          className={cn(
            'flex-1 flex items-end pb-16 transition-all',
            reducedMotion ? '' : 'duration-500'
          )}
          style={{
            opacity: textOpacity,
          }}
        >
          <p className="text-sm md:text-base text-white/40 text-center">
            {t.act1.transition.microText}
          </p>
        </div>
      </div>

      {/* CSS for flow animation */}
      <style>{`
        @keyframes flowDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
