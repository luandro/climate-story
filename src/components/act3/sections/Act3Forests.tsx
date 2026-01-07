import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3ForestsProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  isHighlighted: boolean;
}

/**
 * ACT 3.3 - Forests (Biggest Climate Lever)
 *
 * Visual:
 * - Forest silhouette with CO₂ absorption visualization
 * - Comparison: 1.5 billion cars equivalent
 *
 * Text:
 * "Conservar florestas evita bilhões de toneladas de CO₂ todos os anos."
 * Context: "Impacto comparável a retirar mais de 1,5 bilhão de carros das ruas."
 */
export function Act3Forests({
  progress,
  isActive,
  reducedMotion,
  isHighlighted,
}: Act3ForestsProps) {
  const { t } = useTranslation();

  // Text opacity
  const textOpacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.8
      ? 1 - (progress - 0.8) / 0.2
      : 1;

  // Forest visualization
  const forestOpacity = progress > 0.1 ? Math.min(1, (progress - 0.1) / 0.3) : 0;

  // Context text
  const contextOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.2) : 0;

  // Source text
  const sourceOpacity = progress > 0.7 ? Math.min(1, (progress - 0.7) / 0.2) : 0;

  // Green glow for forest
  const glowIntensity = isHighlighted ? 0.4 : 0.2;

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
      {/* Forest visualization background */}
      <div
        className="absolute inset-0 flex items-end justify-center overflow-hidden"
        style={{
          opacity: forestOpacity,
        }}
      >
        {/* Forest silhouette using CSS */}
        <svg
          viewBox="0 0 400 200"
          className="w-full max-w-4xl h-48 md:h-64"
          style={{
            filter: `drop-shadow(0 0 30px rgba(34, 197, 94, ${glowIntensity}))`,
          }}
        >
          <defs>
            <linearGradient id="forest-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#166534" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Tree shapes */}
          {[50, 100, 150, 200, 250, 300, 350].map((x, i) => (
            <g key={i} style={{ opacity: forestOpacity }}>
              <polygon
                points={`${x},200 ${x - 20 - i * 2},${100 + i * 5} ${x + 20 + i * 2},${100 + i * 5}`}
                fill="url(#forest-gradient)"
              />
              <polygon
                points={`${x},${100 + i * 5} ${x - 15 - i},${60 + i * 3} ${x + 15 + i},${60 + i * 3}`}
                fill="url(#forest-gradient)"
                style={{ opacity: 0.9 }}
              />
              <polygon
                points={`${x},${60 + i * 3} ${x - 10},${30 + i * 2} ${x + 10},${30 + i * 2}`}
                fill="url(#forest-gradient)"
                style={{ opacity: 0.8 }}
              />
            </g>
          ))}
        </svg>

        {/* CO₂ absorption particles */}
        {!reducedMotion && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xs text-green-400/50 font-mono"
                style={{
                  left: `${15 + i * 10}%`,
                  bottom: '40%',
                  opacity: forestOpacity * 0.6,
                  animation: `act3-absorb ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                CO₂
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-20">
        {/* Main text */}
        <p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 text-center max-w-2xl font-light"
          style={{
            opacity: textOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - textOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
          }}
        >
          {t.act3?.forests?.text || 'Conservar florestas evita bilhões de toneladas de CO₂ todos os anos.'}
        </p>

        {/* Context (comparison) */}
        <div
          className="mt-8 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-xl max-w-lg"
          style={{
            opacity: contextOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - contextOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          <p className="text-base md:text-lg text-green-300 text-center">
            {t.act3?.forests?.context || 'Impacto comparável a retirar mais de 1,5 bilhão de carros das ruas.'}
          </p>
        </div>

        {/* Source */}
        <p
          className="text-sm text-white/40 text-center mt-6"
          style={{
            opacity: sourceOpacity,
          }}
        >
          {t.act3?.forests?.source || 'WRI / IPCC — Soluções baseadas na natureza'}
        </p>
      </div>

      {/* CSS for absorption animation */}
      <style>{`
        @keyframes act3-absorb {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-80px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
