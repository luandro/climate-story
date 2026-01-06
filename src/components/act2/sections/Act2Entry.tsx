import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act2EntryProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  flowVisibility: number;
}

/**
 * ACT 2.0 - Transition: From Time to Flow
 *
 * Entry State (inherits from Act 1.7):
 * - Flow lines already visible
 * - Dark background
 * - No charts yet
 *
 * Text: "O aquecimento não acontece por acaso."
 * On scroll → lines begin to move upward
 */
export function Act2Entry({ progress, isActive, reducedMotion, flowVisibility }: Act2EntryProps) {
  const { t } = useTranslation();

  // Text opacity: fade in at start, stay visible
  const textOpacity = progress < 0.3
    ? progress / 0.3
    : progress > 0.7
      ? 1 - (progress - 0.7) / 0.3
      : 1;

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
      {/* Flow lines background (inherited from Act 1 transition) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: flowVisibility,
        }}
      >
        {/* Vertical flow lines moving upward */}
        <div className="flex gap-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{
                width: '2px',
                height: '120px',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 bg-gradient-to-t from-white/20 to-transparent"
                style={{
                  height: '100%',
                  animation: reducedMotion
                    ? 'none'
                    : `flowUp ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main text */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{
          opacity: textOpacity,
          transform: reducedMotion
            ? 'none'
            : `translateY(${(1 - textOpacity) * 20}px)`,
          transition: reducedMotion ? 'none' : 'transform 0.5s ease-out',
        }}
      >
        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 text-center max-w-2xl font-light">
          {t.act2?.entry?.text || ''}
        </p>
      </div>

      {/* CSS for flow animation */}
      <style>{`
        @keyframes flowUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
