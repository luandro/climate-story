import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { SolutionTile } from '../Act3Scrollytelling';

interface Act3ToolkitProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  activeTiles: Set<SolutionTile>;
  onTileToggle: (tile: SolutionTile) => void;
  cumulativeImpact: number;
}

/**
 * ACT 3.2 - The Toolkit
 *
 * Visual:
 * - Interactive tiles (stackable)
 * - Each tile adds to cumulative impact bar
 *
 * Tiles:
 * - Conservação de Florestas
 * - Povos Indígenas e Territórios
 * - Energia Limpa
 * - Eficiência Energética
 * - Transporte Elétrico
 * - Agricultura Sustentável
 */

const TILES: { id: SolutionTile; icon: string; color: string }[] = [
  { id: 'forests', icon: '🌳', color: 'from-green-600 to-green-800' },
  { id: 'indigenous', icon: '🌍', color: 'from-amber-600 to-amber-800' },
  { id: 'cleanEnergy', icon: '☀️', color: 'from-yellow-500 to-orange-600' },
  { id: 'efficiency', icon: '⚡', color: 'from-blue-500 to-blue-700' },
  { id: 'transport', icon: '🚗', color: 'from-cyan-500 to-cyan-700' },
  { id: 'agriculture', icon: '🌾', color: 'from-lime-600 to-green-700' },
];

export function Act3Toolkit({
  progress,
  isActive,
  reducedMotion,
  activeTiles,
  onTileToggle,
  cumulativeImpact,
}: Act3ToolkitProps) {
  const { t } = useTranslation();

  // Title visibility
  const titleOpacity = progress < 0.2
    ? progress / 0.2
    : 1;

  // Tiles stagger appearance
  const getTileOpacity = (index: number) => {
    const staggerStart = 0.2 + index * 0.1;
    if (progress < staggerStart) return 0;
    return Math.min(1, (progress - staggerStart) / 0.15);
  };

  // Impact bar visibility
  const impactBarOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.2) : 0;

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
      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* Title */}
        <h2
          className="text-2xl md:text-3xl lg:text-4xl text-white font-medium text-center mb-2"
          style={{
            opacity: titleOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - titleOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
          }}
        >
          {t.act3?.toolkit?.title || 'A Caixa de Ferramentas'}
        </h2>

        <p
          className="text-base md:text-lg text-white/50 text-center mb-8"
          style={{
            opacity: titleOpacity * 0.8,
          }}
        >
          {t.act3?.toolkit?.instruction || 'Explore as alavancas que mudam o sistema'}
        </p>

        {/* Interactive tiles grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-2xl w-full">
          {TILES.map((tile, index) => {
            const tileOpacity = getTileOpacity(index);
            const isActive = activeTiles.has(tile.id);

            return (
              <button
                key={tile.id}
                onClick={() => onTileToggle(tile.id)}
                className={cn(
                  'relative p-4 md:p-5 rounded-xl border-2 transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-green-500/50',
                  isActive
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                )}
                style={{
                  opacity: tileOpacity,
                  transform: reducedMotion
                    ? 'none'
                    : `translateY(${(1 - tileOpacity) * 20}px) scale(${isActive ? 1.02 : 1})`,
                  transition: reducedMotion ? 'none' : 'all 0.3s ease-out',
                }}
              >
                {/* Icon */}
                <div className="text-2xl md:text-3xl mb-2">{tile.icon}</div>

                {/* Label */}
                <p className="text-sm md:text-base text-white/80 font-medium">
                  {t.act3?.toolkit?.tiles?.[tile.id] || tile.id}
                </p>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Cumulative impact bar */}
        <div
          className="w-full max-w-xl mt-10"
          style={{
            opacity: impactBarOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - impactBarOpacity) * 10}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50 whitespace-nowrap">Impacto combinado</span>
            <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500"
                style={{
                  width: `${cumulativeImpact * 100}%`,
                }}
              />
            </div>
            <span className="text-sm text-green-400 font-medium">
              {Math.round(cumulativeImpact * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
