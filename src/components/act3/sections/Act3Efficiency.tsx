import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3EfficiencyProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  isHighlighted: boolean;
}

/**
 * ACT 3.7 - Energy Efficiency
 *
 * Visual:
 * - Energy meter / gauge showing reduction
 *
 * Text:
 * "Fazer a mesma coisa usando menos energia é uma das formas mais rápidas de reduzir emissões."
 * "A eficiência pode reduzir até 20% das emissões globais."
 */
export function Act3Efficiency({
  progress,
  isActive,
  reducedMotion,
  isHighlighted,
}: Act3EfficiencyProps) {
  const { t } = useTranslation();

  // Text opacity
  const textOpacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.8
      ? 1 - (progress - 0.8) / 0.2
      : 1;

  // Data callout
  const dataOpacity = progress > 0.4
    ? Math.min(1, (progress - 0.4) / 0.2)
    : 0;

  // Source
  const sourceOpacity = progress > 0.7
    ? Math.min(1, (progress - 0.7) / 0.2)
    : 0;

  // Gauge animation
  const gaugeProgress = progress > 0.2
    ? Math.min(1, (progress - 0.2) / 0.4)
    : 0;

  // Blue glow intensity
  const glowIntensity = isHighlighted ? 0.4 : 0.25;

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
          background: `radial-gradient(ellipse at 50% 40%, rgba(59, 130, 246, ${glowIntensity}) 0%, transparent 50%)`,
        }}
      />

      {/* Energy gauge visualization */}
      <div
        className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2"
        style={{
          opacity: gaugeProgress,
          transform: reducedMotion
            ? 'translateX(-50%)'
            : `translateX(-50%) scale(${0.8 + gaugeProgress * 0.2})`,
          transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
        }}
      >
        <svg viewBox="0 0 200 120" className="w-48 md:w-56 h-auto">
          <defs>
            <linearGradient id="efficiency-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Gauge arc background */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Gauge arc filled (animated) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#efficiency-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * 0.8 * gaugeProgress)}
            style={{
              transition: reducedMotion ? 'none' : 'stroke-dashoffset 0.8s ease-out',
            }}
          />

          {/* Needle */}
          <g
            style={{
              transform: `rotate(${-90 + (gaugeProgress * 0.8 * 180)}deg)`,
              transformOrigin: '100px 100px',
              transition: reducedMotion ? 'none' : 'transform 0.8s ease-out',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="8" fill="#3b82f6" />
          </g>

          {/* Efficiency label */}
          <text x="100" y="85" fill="#3b82f6" fontSize="20" fontWeight="bold" textAnchor="middle">
            -20%
          </text>
        </svg>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-40 md:pt-48">
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
          {t.act3?.efficiency?.text || 'Fazer a mesma coisa usando menos energia é uma das formas mais rápidas de reduzir emissões.'}
        </p>

        {/* Data callout */}
        <div
          className="mt-8 px-6 py-4 bg-blue-500/10 border border-blue-500/30 rounded-xl max-w-lg"
          style={{
            opacity: dataOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - dataOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          <p className="text-base md:text-lg text-blue-200 text-center">
            {t.act3?.efficiency?.data || 'A eficiência pode reduzir até 20% das emissões globais.'}
          </p>
        </div>

        {/* Source */}
        <p
          className="text-sm text-white/40 text-center mt-6"
          style={{
            opacity: sourceOpacity,
          }}
        >
          {t.act3?.efficiency?.source || 'IEA / IPCC AR6'}
        </p>
      </div>
    </div>
  );
}
