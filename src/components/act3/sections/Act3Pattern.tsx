import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3PatternProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  cumulativeImpact: number;
}

/**
 * ACT 3.10 - The Pattern
 *
 * Visual:
 * - All solution tiles connected
 * - Cumulative impact visualization at max
 *
 * Text:
 * "Nenhuma ferramenta resolve tudo sozinha."
 * "Mas juntas, elas mudam completamente o sistema."
 */
export function Act3Pattern({
  progress,
  isActive,
  reducedMotion,
  cumulativeImpact,
}: Act3PatternProps) {
  const { t } = useTranslation();

  // First text
  const text1Opacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.5
      ? Math.max(0.6, 1 - (progress - 0.5) / 0.3)
      : 1;

  // Second text
  const text2Opacity = progress > 0.4
    ? Math.min(1, (progress - 0.4) / 0.25)
    : 0;

  // Connection visualization
  const connectionProgress = progress > 0.2
    ? Math.min(1, (progress - 0.2) / 0.5)
    : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  // Solution icons for the connected visualization
  const solutions = [
    { icon: '🌳', color: 'green' },
    { icon: '🌍', color: 'amber' },
    { icon: '☀️', color: 'yellow' },
    { icon: '⚡', color: 'blue' },
    { icon: '🚗', color: 'cyan' },
    { icon: '🌾', color: 'lime' },
  ];

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
      {/* Central glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%,
            rgba(34, 197, 94, ${0.2 + connectionProgress * 0.2}) 0%,
            transparent 50%)`,
        }}
      />

      {/* Connected solutions visualization */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: connectionProgress,
        }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-64 h-64 md:w-80 md:h-80"
        >
          <defs>
            <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
              <stop offset="50%" stopColor="rgba(34, 197, 94, 0.6)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.3)" />
            </linearGradient>
          </defs>

          {/* Connection lines between all nodes */}
          {solutions.map((_, i) => {
            const angle1 = (i / solutions.length) * Math.PI * 2 - Math.PI / 2;
            const x1 = 150 + Math.cos(angle1) * 100;
            const y1 = 150 + Math.sin(angle1) * 100;

            return solutions.map((_, j) => {
              if (j <= i) return null;
              const angle2 = (j / solutions.length) * Math.PI * 2 - Math.PI / 2;
              const x2 = 150 + Math.cos(angle2) * 100;
              const y2 = 150 + Math.sin(angle2) * 100;

              return (
                <line
                  key={`${i}-${j}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#connection-gradient)"
                  strokeWidth="2"
                  strokeDasharray={reducedMotion ? 'none' : '5 5'}
                  style={{
                    opacity: connectionProgress * 0.6,
                    animation: reducedMotion
                      ? 'none'
                      : `act3-dash ${3 + i * 0.5}s linear infinite`,
                  }}
                />
              );
            });
          })}

          {/* Central impact circle */}
          <circle
            cx="150"
            cy="150"
            r={30 + connectionProgress * 20}
            fill="rgba(34, 197, 94, 0.2)"
            stroke="rgba(34, 197, 94, 0.5)"
            strokeWidth="2"
            style={{
              transition: reducedMotion ? 'none' : 'r 0.5s ease-out',
            }}
          />

          {/* Impact percentage */}
          <text
            x="150"
            y="155"
            fill="#22c55e"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
          >
            {Math.round(cumulativeImpact * 100)}%
          </text>
        </svg>

        {/* Solution icons around the circle */}
        {solutions.map((solution, i) => {
          const angle = (i / solutions.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 42;
          const y = 50 + Math.sin(angle) * 42;

          return (
            <div
              key={i}
              className="absolute w-10 h-10 flex items-center justify-center text-2xl rounded-full bg-white/10 border border-green-500/30"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: connectionProgress,
                animation: reducedMotion
                  ? 'none'
                  : `act3-pulse-node 2s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {solution.icon}
            </div>
          );
        })}
      </div>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 px-6">
        {/* First text */}
        <p
          className="text-lg md:text-xl text-white/70 text-center max-w-md mb-4"
          style={{
            opacity: text1Opacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - text1Opacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.pattern?.text || 'Nenhuma ferramenta resolve tudo sozinha.'}
        </p>

        {/* Second text */}
        <p
          className="text-xl md:text-2xl lg:text-3xl text-green-400 text-center max-w-lg font-medium"
          style={{
            opacity: text2Opacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - text2Opacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.pattern?.followUp || 'Mas juntas, elas mudam completamente o sistema.'}
        </p>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes act3-dash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -20;
          }
        }
        @keyframes act3-pulse-node {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
