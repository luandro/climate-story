import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { GAS_COLORS, WORLD_SOURCES, BRAZIL_SOURCES } from './emissionData';
import type { EmissionSource } from './emissionData';

// Re-export for convenience - used by section components
// eslint-disable-next-line react-refresh/only-export-components
export { WORLD_SOURCES, BRAZIL_SOURCES };
export type { EmissionSource };

export interface SankeyFlowProps {
  sources: EmissionSource[];
  region: 'world' | 'brazil';
  flowVisibility: number;
  focusedSource?: string | null;
  reducedMotion: boolean;
  className?: string;
}

/**
 * SankeyFlow - Animated flow visualization showing emissions from sources to atmosphere
 *
 * Visual design:
 * - Sources on the left (activities)
 * - Flows move upward toward atmosphere
 * - Flow width represents emission percentage
 * - Color coding: CO₂ (red/gray), CH₄ (orange), N₂O (yellow)
 */
export function SankeyFlow({
  sources,
  region,
  flowVisibility,
  focusedSource,
  reducedMotion,
  className,
}: SankeyFlowProps) {
  // Calculate flow paths
  const flows = useMemo(() => {
    const totalHeight = 300; // px height for flow area
    const sourceSpacing = totalHeight / (sources.length + 1);

    return sources.map((source, index) => {
      const startY = sourceSpacing * (index + 1);
      const flowWidth = Math.max(4, (source.value / 100) * 60); // Min 4px, max 60px
      const isFocused = focusedSource === source.id;
      const isDimmed = focusedSource !== null && !isFocused;

      return {
        ...source,
        startY,
        flowWidth,
        isFocused,
        isDimmed,
        opacity: isDimmed ? 0.2 : 1,
      };
    });
  }, [sources, focusedSource]);

  return (
    <div
      className={cn('relative w-full h-full', className)}
      style={{
        opacity: flowVisibility,
        transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
      }}
    >
      {/* SVG Flow Diagram */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient definitions */}
        <defs>
          {Object.entries(GAS_COLORS).map(([gasType, colors]) => (
            <linearGradient
              key={gasType}
              id={`flow-gradient-${gasType}-${region}`}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          ))}

          {/* Glow filter for focused flows */}
          <filter id="flow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Flow paths */}
        {flows.map((flow, index) => {
          const sourceX = 80;
          const targetX = 200 + (index - 2) * 30; // Spread at top
          const targetY = 40;

          // Create curved path from source to atmosphere
          const path = `
            M ${sourceX} ${flow.startY + 100}
            C ${sourceX + 60} ${flow.startY + 100},
              ${targetX - 40} ${targetY + 80},
              ${targetX} ${targetY}
          `;

          return (
            <g key={flow.id}>
              {/* Flow path */}
              <path
                d={path}
                fill="none"
                stroke={`url(#flow-gradient-${flow.gasType}-${region})`}
                strokeWidth={flow.flowWidth * flowVisibility}
                strokeLinecap="round"
                style={{
                  opacity: flow.opacity,
                  filter: flow.isFocused ? 'url(#flow-glow)' : 'none',
                  transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
                }}
              />

              {/* Animated particles (only when not reduced motion) */}
              {!reducedMotion && flowVisibility > 0.5 && (
                <circle
                  r={Math.max(2, flow.flowWidth / 4)}
                  fill={GAS_COLORS[flow.gasType].from}
                  style={{
                    opacity: flow.opacity * 0.8,
                  }}
                >
                  <animateMotion
                    dur={`${3 + index * 0.5}s`}
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * ActivityIcon - System-level icon (not personal)
 */
interface ActivityIconProps {
  type: 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation';
  size?: number;
  className?: string;
  pulsing?: boolean;
  reducedMotion?: boolean;
}

export function ActivityIcon({
  type,
  size = 40,
  className,
  pulsing = false,
  reducedMotion = false,
}: ActivityIconProps) {
  const iconPaths: Record<string, JSX.Element> = {
    energy: (
      // Power plant / factory stack
      <g fill="currentColor">
        <rect x="8" y="20" width="8" height="16" rx="1" />
        <rect x="18" y="16" width="8" height="20" rx="1" />
        <rect x="28" y="12" width="8" height="24" rx="1" />
        <path d="M4 36h36v2H4z" />
        {/* Smoke/emissions */}
        <circle cx="12" cy="14" r="2" opacity="0.5" />
        <circle cx="22" cy="10" r="2" opacity="0.5" />
        <circle cx="32" cy="6" r="2" opacity="0.5" />
      </g>
    ),
    transport: (
      // Vehicle/truck silhouette
      <g fill="currentColor">
        <path d="M4 24h28v8H4z" />
        <path d="M6 18h20l6 6H6z" />
        <circle cx="10" cy="34" r="3" />
        <circle cx="26" cy="34" r="3" />
        {/* Exhaust */}
        <circle cx="36" cy="28" r="1.5" opacity="0.5" />
        <circle cx="38" cy="24" r="1" opacity="0.4" />
      </g>
    ),
    industry: (
      // Industrial building/gear
      <g fill="currentColor">
        <rect x="6" y="14" width="16" height="22" rx="1" />
        <polygon points="6,14 14,6 22,14" />
        <rect x="24" y="20" width="12" height="16" rx="1" />
        <circle cx="30" cy="12" r="6" opacity="0.7" />
        <rect x="28" y="4" width="4" height="4" />
        <rect x="34" y="10" width="4" height="4" />
      </g>
    ),
    agriculture: (
      // Cattle/farm silhouette
      <g fill="currentColor">
        <ellipse cx="20" cy="26" rx="14" ry="8" />
        <circle cx="8" cy="22" r="5" />
        <rect x="6" y="32" width="3" height="6" rx="1" />
        <rect x="12" y="32" width="3" height="6" rx="1" />
        <rect x="24" y="32" width="3" height="6" rx="1" />
        <rect x="30" y="32" width="3" height="6" rx="1" />
        {/* Methane cloud */}
        <ellipse cx="34" cy="18" rx="4" ry="3" opacity="0.4" />
      </g>
    ),
    deforestation: (
      // Tree stump / cut tree
      <g fill="currentColor">
        {/* Stump */}
        <rect x="14" y="24" width="16" height="12" rx="2" />
        <ellipse cx="22" cy="24" rx="10" ry="3" />
        {/* Falling tree */}
        <rect x="26" y="8" width="4" height="20" rx="1" transform="rotate(30 28 18)" opacity="0.6" />
        {/* Axe mark */}
        <path d="M16 20 L22 28 L18 28 Z" fill="currentColor" opacity="0.3" />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      className={cn(
        'text-white/70',
        pulsing && !reducedMotion && 'animate-pulse',
        className
      )}
    >
      {iconPaths[type]}
    </svg>
  );
}
