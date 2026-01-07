import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3TransportProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  isHighlighted: boolean;
}

/**
 * ACT 3.8 - Electric Transport
 *
 * Visual:
 * - Car silhouette comparison (EV vs ICE)
 * - Emissions cloud visualization
 *
 * Text:
 * "Veículos elétricos emitem muito menos ao longo de todo o seu ciclo de vida."
 * "Em média, até 68% menos emissões do que veículos a combustão."
 */
export function Act3Transport({
  progress,
  isActive,
  reducedMotion,
  isHighlighted,
}: Act3TransportProps) {
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

  // Car visualization
  const carProgress = progress > 0.15
    ? Math.min(1, (progress - 0.15) / 0.35)
    : 0;

  // Cyan glow intensity
  const glowIntensity = isHighlighted ? 0.35 : 0.2;

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
          background: `radial-gradient(ellipse at 50% 70%, rgba(6, 182, 212, ${glowIntensity}) 0%, transparent 50%)`,
        }}
      />

      {/* Car comparison visualization */}
      <div
        className="absolute bottom-32 left-0 right-0 flex justify-center items-end gap-8 md:gap-16 px-6"
        style={{
          opacity: carProgress,
          transform: reducedMotion
            ? 'none'
            : `translateY(${(1 - carProgress) * 30}px)`,
          transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
        }}
      >
        {/* ICE Vehicle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Emissions cloud */}
            <div
              className="absolute -top-12 -right-4 flex gap-1"
              style={{ opacity: carProgress * 0.8 }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gray-500/40"
                  style={{
                    animation: reducedMotion
                      ? 'none'
                      : `act3-smoke ${2 + i * 0.3}s ease-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Car silhouette */}
            <svg viewBox="0 0 100 50" className="w-24 md:w-32 h-auto">
              <path
                d="M 10 40 L 15 40 L 20 25 L 35 20 L 65 20 L 80 25 L 85 40 L 90 40 L 90 45 L 10 45 Z"
                fill="#6b7280"
                stroke="#9ca3af"
                strokeWidth="1"
              />
              {/* Windows */}
              <path
                d="M 25 24 L 35 21 L 48 21 L 48 30 L 25 30 Z"
                fill="#374151"
              />
              <path
                d="M 52 21 L 65 21 L 75 26 L 75 30 L 52 30 Z"
                fill="#374151"
              />
              {/* Wheels */}
              <circle cx="25" cy="45" r="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
              <circle cx="75" cy="45" r="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-sm text-white/50 mt-3">Combustão</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-16 h-2 bg-red-500/60 rounded-full" />
            <span className="text-xs text-red-400">100%</span>
          </div>
        </div>

        {/* EV Vehicle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Clean air / minimal emissions */}
            <div
              className="absolute -top-8 -right-2 w-8 h-8"
              style={{ opacity: carProgress * 0.6 }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400/30 animate-ping" />
            </div>

            {/* Car silhouette */}
            <svg viewBox="0 0 100 50" className="w-24 md:w-32 h-auto">
              <path
                d="M 10 40 L 15 40 L 20 25 L 35 20 L 65 20 L 80 25 L 85 40 L 90 40 L 90 45 L 10 45 Z"
                fill="#06b6d4"
                stroke="#22d3ee"
                strokeWidth="1"
              />
              {/* Windows */}
              <path
                d="M 25 24 L 35 21 L 48 21 L 48 30 L 25 30 Z"
                fill="#0e7490"
              />
              <path
                d="M 52 21 L 65 21 L 75 26 L 75 30 L 52 30 Z"
                fill="#0e7490"
              />
              {/* Wheels */}
              <circle cx="25" cy="45" r="8" fill="#164e63" stroke="#22d3ee" strokeWidth="2" />
              <circle cx="75" cy="45" r="8" fill="#164e63" stroke="#22d3ee" strokeWidth="2" />
              {/* Electric indicator */}
              <text x="50" y="38" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">⚡</text>
            </svg>
          </div>
          <p className="text-sm text-cyan-400 mt-3">Elétrico</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-5 h-2 bg-cyan-500/60 rounded-full" />
            <span className="text-xs text-green-400">32%</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-48">
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
          {t.act3?.transport?.text || 'Veículos elétricos emitem muito menos ao longo de todo o seu ciclo de vida.'}
        </p>

        {/* Data callout */}
        <div
          className="mt-8 px-6 py-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl max-w-lg"
          style={{
            opacity: dataOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - dataOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
          }}
        >
          <p className="text-base md:text-lg text-cyan-200 text-center">
            {t.act3?.transport?.data || 'Em média, até 68% menos emissões do que veículos a combustão.'}
          </p>
        </div>

        {/* Source */}
        <p
          className="text-sm text-white/40 text-center mt-6"
          style={{
            opacity: sourceOpacity,
          }}
        >
          {t.act3?.transport?.source || 'ICCT'}
        </p>
      </div>

      {/* CSS for smoke animation */}
      <style>{`
        @keyframes act3-smoke {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-30px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
