import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3BrazilCentralProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 3.11 - Why Brazil is Central
 *
 * Visual:
 * - Brazil silhouette with key indicators
 * - Green glow radiating from the country
 *
 * Text:
 * "Poucos países concentram tanto potencial de mudança em tão poucas frentes."
 * "Por isso o Brasil não é periférico. É central."
 */
export function Act3BrazilCentral({
  progress,
  isActive,
  reducedMotion,
}: Act3BrazilCentralProps) {
  const { t } = useTranslation();

  // First text
  const text1Opacity = progress < 0.2
    ? progress / 0.2
    : progress > 0.5
      ? Math.max(0.5, 1 - (progress - 0.5) / 0.3)
      : 1;

  // Second text (emphasis)
  const text2Opacity = progress > 0.5
    ? Math.min(1, (progress - 0.5) / 0.25)
    : 0;

  // Brazil map visualization
  const mapProgress = progress > 0.1
    ? Math.min(1, (progress - 0.1) / 0.4)
    : 0;

  // Glow intensity
  const glowIntensity = 0.2 + progress * 0.3;

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
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(34, 197, 94, ${glowIntensity}) 0%,
            rgba(22, 163, 74, ${glowIntensity * 0.5}) 30%,
            transparent 60%)`,
        }}
      />

      {/* Brazil map silhouette */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: mapProgress,
          transform: reducedMotion
            ? 'none'
            : `scale(${0.8 + mapProgress * 0.2})`,
          transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
        }}
      >
        <svg
          viewBox="0 0 200 220"
          className="w-48 md:w-64 h-auto"
          style={{
            filter: `drop-shadow(0 0 30px rgba(34, 197, 94, ${glowIntensity}))`,
          }}
        >
          <defs>
            <linearGradient id="brazil-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="brazil-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Simplified Brazil shape */}
          <path
            d="M 90 10
               C 120 15, 150 25, 165 45
               C 175 60, 180 80, 175 100
               C 170 120, 165 140, 150 160
               C 135 175, 115 190, 90 200
               C 70 205, 50 195, 35 180
               C 20 165, 15 145, 20 125
               C 25 105, 35 85, 45 70
               C 55 55, 70 35, 90 10 Z"
            fill="url(#brazil-gradient)"
            stroke="#22c55e"
            strokeWidth="2"
          />

          {/* Inner glow */}
          <circle cx="100" cy="110" r="60" fill="url(#brazil-glow)" />

          {/* Key indicators */}
          {!reducedMotion && (
            <>
              {/* Amazon region pulse */}
              <circle cx="80" cy="80" r="8" fill="#22c55e" opacity="0.6">
                <animate
                  attributeName="r"
                  values="8;12;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.3;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Cerrado region pulse */}
              <circle cx="120" cy="120" r="6" fill="#84cc16" opacity="0.5">
                <animate
                  attributeName="r"
                  values="6;10;6"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.2;0.5"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* South region */}
              <circle cx="100" cy="170" r="5" fill="#10b981" opacity="0.4">
                <animate
                  attributeName="r"
                  values="5;8;5"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}
        </svg>
      </div>

      {/* Key indicators labels */}
      <div
        className="absolute bottom-40 left-0 right-0 flex justify-center gap-4 md:gap-8 px-4"
        style={{
          opacity: mapProgress * text1Opacity,
        }}
      >
        {[
          { label: '60% da Amazônia', icon: '🌳' },
          { label: 'Energia renovável', icon: '☀️' },
          { label: 'Solo agricultável', icon: '🌾' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20"
            style={{
              animation: reducedMotion
                ? 'none'
                : `act3-fadeIn 0.5s ease-out forwards`,
              animationDelay: `${0.3 + i * 0.15}s`,
              opacity: 0,
            }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs text-green-300 text-center whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 md:pt-20 px-6">
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
          {t.act3?.brazilCentral?.text || 'Poucos países concentram tanto potencial de mudança em tão poucas frentes.'}
        </p>

        {/* Second text (emphasis) */}
        <p
          className="text-xl md:text-2xl lg:text-3xl text-green-400 text-center max-w-md mt-6 font-medium"
          style={{
            opacity: text2Opacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - text2Opacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          {t.act3?.brazilCentral?.followUp || 'Por isso o Brasil não é periférico. É central.'}
        </p>
      </div>

      {/* CSS for fade-in animation */}
      <style>{`
        @keyframes act3-fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
