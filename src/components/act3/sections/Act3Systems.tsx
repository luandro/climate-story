import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3SystemsProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 3.5 - Systems of Life vs Systems of Extraction
 *
 * Visual:
 * - Contrasting flows: extraction (downward, red) vs sustainable (circular, green)
 *
 * Text:
 * "A crise climática não nasce apenas da tecnologia."
 * "Ela nasce de sistemas econômicos baseados em extração contínua."
 * "Outros sistemas organizam identidade, economia e bem-estar
 *  sem destruir a base que os sustenta."
 */
export function Act3Systems({
  progress,
  isActive,
  reducedMotion,
}: Act3SystemsProps) {
  const { t } = useTranslation();

  // First text
  const text1Opacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.4
      ? Math.max(0.5, 1 - (progress - 0.4) / 0.3)
      : 1;

  // Follow-up text (extraction)
  const text2Opacity = progress > 0.25
    ? Math.min(1, (progress - 0.25) / 0.2)
    : 0;

  // Alternative text
  const text3Opacity = progress > 0.55
    ? Math.min(1, (progress - 0.55) / 0.2)
    : 0;

  // Source
  const sourceOpacity = progress > 0.8
    ? Math.min(1, (progress - 0.8) / 0.15)
    : 0;

  // Visual diagram progress
  const diagramProgress = progress > 0.3
    ? Math.min(1, (progress - 0.3) / 0.4)
    : 0;

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
      {/* Systems diagram */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: diagramProgress,
        }}
      >
        <svg
          viewBox="0 0 400 300"
          className="w-full max-w-2xl h-64 md:h-80"
        >
          <defs>
            {/* Extraction gradient (red/brown) */}
            <linearGradient id="extraction-flow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(220, 38, 38, 0.6)" />
              <stop offset="100%" stopColor="rgba(120, 53, 15, 0.4)" />
            </linearGradient>
            {/* Sustainable gradient (green) */}
            <linearGradient id="sustainable-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.6)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.6)" />
            </linearGradient>
          </defs>

          {/* Extraction system (left) - linear downward flow */}
          <g style={{ opacity: Math.min(1, diagramProgress * 1.5) }}>
            {/* Downward arrows */}
            <path
              d="M 80 50 L 80 250"
              stroke="url(#extraction-flow)"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 120 70 L 120 230"
              stroke="url(#extraction-flow)"
              strokeWidth="15"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            {/* Arrow heads */}
            <polygon
              points="80,260 70,240 90,240"
              fill="rgba(220, 38, 38, 0.6)"
            />
            {/* Label */}
            <text x="100" y="280" fill="rgba(220, 38, 38, 0.8)" fontSize="12" textAnchor="middle">
              Extração
            </text>
          </g>

          {/* Sustainable system (right) - circular flow */}
          <g style={{ opacity: diagramProgress }}>
            {/* Circular path */}
            <circle
              cx="300"
              cy="150"
              r="80"
              stroke="url(#sustainable-flow)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={reducedMotion ? 'none' : '20 10'}
            >
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 300 150"
                  to="360 300 150"
                  dur="20s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            {/* Inner glow */}
            <circle
              cx="300"
              cy="150"
              r="60"
              fill="rgba(34, 197, 94, 0.1)"
            />
            {/* Arrows on circle */}
            <polygon
              points="300,65 290,80 310,80"
              fill="rgba(34, 197, 94, 0.8)"
            >
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 300 150"
                  to="360 300 150"
                  dur="20s"
                  repeatCount="indefinite"
                />
              )}
            </polygon>
            {/* Label */}
            <text x="300" y="280" fill="rgba(34, 197, 94, 0.8)" fontSize="12" textAnchor="middle">
              Regeneração
            </text>
          </g>

          {/* VS divider */}
          <text
            x="200"
            y="155"
            fill="rgba(255, 255, 255, 0.3)"
            fontSize="16"
            textAnchor="middle"
          >
            vs
          </text>
        </svg>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 md:pt-24 px-6">
        {/* First text */}
        <p
          className="text-lg md:text-xl text-white/70 text-center max-w-lg"
          style={{
            opacity: text1Opacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - text1Opacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.systems?.text || 'A crise climática não nasce apenas da tecnologia.'}
        </p>

        {/* Extraction text */}
        <p
          className="text-xl md:text-2xl text-red-400/80 text-center max-w-lg mt-4"
          style={{
            opacity: text2Opacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - text2Opacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.systems?.followUp || 'Ela nasce de sistemas econômicos baseados em extração contínua.'}
        </p>

        {/* Alternative text */}
        <p
          className="text-lg md:text-xl text-green-400/80 text-center max-w-lg mt-6"
          style={{
            opacity: text3Opacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - text3Opacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.systems?.alternative || 'Outros sistemas organizam identidade, economia e bem-estar sem destruir a base que os sustenta.'}
        </p>

        {/* Source */}
        <p
          className="text-sm text-white/40 text-center mt-6"
          style={{
            opacity: sourceOpacity,
          }}
        >
          {t.act3?.systems?.source || 'Climate Justice & Indigenous Governance (Springer, 2024)'}
        </p>
      </div>
    </div>
  );
}
