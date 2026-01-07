import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3IndigenousProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  isHighlighted: boolean;
}

/**
 * ACT 3.4 - Who Really Keeps the Forest Standing
 *
 * CRITICAL SECTION - Indigenous Peoples
 *
 * Visual:
 * - Map silhouette showing protected vs unprotected areas
 * - Deforestation rate comparison visualization
 *
 * Text:
 * "Florestas não se protegem sozinhas."
 * "Onde territórios indígenas são reconhecidos, a floresta permanece em pé."
 *
 * Anchor:
 * "Isso não é uma política climática. É um modo de vida."
 */
export function Act3Indigenous({
  progress,
  isActive,
  reducedMotion,
  isHighlighted,
}: Act3IndigenousProps) {
  const { t } = useTranslation();

  // Introduction text
  const introOpacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.3
      ? 1 - Math.min(1, (progress - 0.3) / 0.1) * 0.3
      : 1;

  // Main text
  const textOpacity = progress > 0.2
    ? Math.min(1, (progress - 0.2) / 0.2)
    : 0;

  // Data callout
  const dataOpacity = progress > 0.45
    ? Math.min(1, (progress - 0.45) / 0.15)
    : 0;

  // Anchor phrase
  const anchorOpacity = progress > 0.7
    ? Math.min(1, (progress - 0.7) / 0.15)
    : 0;

  // Source
  const sourceOpacity = progress > 0.85
    ? Math.min(1, (progress - 0.85) / 0.1)
    : 0;

  // Visual comparison progress
  const comparisonProgress = progress > 0.3
    ? Math.min(1, (progress - 0.3) / 0.3)
    : 0;

  // Amber/gold glow for indigenous section
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
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, rgba(217, 119, 6, ${glowIntensity}) 0%, transparent 50%)`,
        }}
      />

      {/* Comparison visualization */}
      <div
        className="absolute bottom-20 left-0 right-0 flex justify-center items-end gap-8 md:gap-16 px-6"
        style={{
          opacity: comparisonProgress,
          transform: reducedMotion
            ? 'none'
            : `translateY(${(1 - comparisonProgress) * 30}px)`,
          transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
        }}
      >
        {/* Indigenous territory - preserved */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 md:w-32 h-32 md:h-40">
            {/* Green healthy forest */}
            <div
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(to top, #166534, #22c55e)',
                opacity: 0.8,
              }}
            >
              {/* Tree pattern */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {[20, 40, 60, 80].map((x, i) => (
                  <polygon
                    key={i}
                    points={`${x},100 ${x - 10},${50 + i * 5} ${x + 10},${50 + i * 5}`}
                    fill="#16a34a"
                    opacity={0.8 + i * 0.05}
                  />
                ))}
              </svg>
            </div>
            {/* Border indicator */}
            <div className="absolute inset-0 border-2 border-amber-500 rounded-lg" />
          </div>
          <p className="text-sm text-amber-400 mt-3 text-center">Terras Indígenas</p>
          <p className="text-xs text-green-400 mt-1">Floresta preservada</p>
        </div>

        {/* Non-protected area - degraded */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 md:w-32 h-32 md:h-40">
            {/* Brown degraded area */}
            <div
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(to top, #78350f, #a16207)',
                opacity: 0.8,
              }}
            >
              {/* Sparse trees / cleared areas */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {[30, 70].map((x, i) => (
                  <polygon
                    key={i}
                    points={`${x},100 ${x - 8},70 ${x + 8},70`}
                    fill="#854d0e"
                    opacity={0.6}
                  />
                ))}
                {/* Bare ground patches */}
                <rect x="10" y="70" width="20" height="30" fill="#92400e" opacity="0.5" />
                <rect x="60" y="75" width="30" height="25" fill="#92400e" opacity="0.5" />
              </svg>
            </div>
            {/* No border */}
          </div>
          <p className="text-sm text-white/50 mt-3 text-center">Áreas Vizinhas</p>
          <p className="text-xs text-red-400/70 mt-1">Maior desmatamento</p>
        </div>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-48">
        {/* Introduction */}
        <p
          className="text-lg md:text-xl text-white/70 text-center max-w-lg mb-4"
          style={{
            opacity: introOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - introOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.indigenous?.intro || 'Florestas não se protegem sozinhas.'}
        </p>

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
          {t.act3?.indigenous?.text || 'Onde territórios indígenas são reconhecidos, a floresta permanece em pé.'}
        </p>

        {/* Data callout */}
        <div
          className="mt-8 px-6 py-4 bg-amber-500/10 border border-amber-500/30 rounded-xl max-w-lg"
          style={{
            opacity: dataOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - dataOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          <p className="text-base md:text-lg text-amber-200 text-center">
            {t.act3?.indigenous?.data || 'Terras indígenas apresentam taxas de desmatamento significativamente menores do que áreas vizinhas.'}
          </p>
        </div>

        {/* Anchor phrase */}
        <p
          className="text-lg md:text-xl text-amber-400 text-center max-w-md mt-8 font-medium italic"
          style={{
            opacity: anchorOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - anchorOpacity) * 10}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.indigenous?.anchor || 'Isso não é uma política climática. É um modo de vida.'}
        </p>

        {/* Source */}
        <p
          className="text-sm text-white/40 text-center mt-4"
          style={{
            opacity: sourceOpacity,
          }}
        >
          {t.act3?.indigenous?.source || 'Nature Scientific Reports (2023) / FAO / Rainforest Foundation'}
        </p>
      </div>
    </div>
  );
}
