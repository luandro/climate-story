import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act2BrazilMattersProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  selectedRegion: 'world' | 'brazil';
}

/**
 * ACT 2.9 - Why This Matters for Brazil
 *
 * Visual:
 * - Brazil map outline faintly appears behind Sankey
 * - Forest areas glow softly
 *
 * Text: "Por isso o Brasil é decisivo."
 * Follow-up: "Poucos países concentram tanto impacto em um único fator."
 *
 * Sets up Act 3 without solutions yet.
 */
export function Act2BrazilMatters({
  progress,
  isActive,
  reducedMotion,
  selectedRegion,
}: Act2BrazilMattersProps) {
  const { t } = useTranslation();

  // Map appearance
  const mapOpacity = Math.min(0.3, progress * 0.4);

  // Forest glow
  const forestGlow = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.4) : 0;

  // Text opacities
  const mainTextOpacity = progress > 0.15 ? Math.min(1, (progress - 0.15) / 0.25) : 0;
  const followUpOpacity = progress > 0.45 ? Math.min(1, (progress - 0.45) / 0.3) : 0;

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
      {/* Brazil map outline (simplified SVG) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: mapOpacity,
          transition: reducedMotion ? 'none' : 'opacity 1s ease-out',
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full max-w-2xl max-h-2xl"
          style={{ transform: 'scale(0.8)' }}
        >
          {/* Simplified Brazil outline */}
          <path
            d="M180 80
               C200 70, 250 75, 280 90
               C310 105, 330 130, 340 160
               C350 190, 345 220, 335 250
               C325 280, 300 310, 270 330
               C240 350, 200 355, 170 345
               C140 335, 110 310, 95 280
               C80 250, 75 210, 85 180
               C95 150, 120 120, 150 100
               C165 90, 175 85, 180 80
               Z"
            fill="none"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="2"
          />

          {/* Amazon region (forest glow) */}
          <ellipse
            cx="180"
            cy="180"
            rx="80"
            ry="60"
            fill="rgba(34, 197, 94, 0.1)"
            style={{
              opacity: forestGlow,
              filter: forestGlow > 0.5 ? 'blur(10px)' : 'blur(20px)',
              transition: reducedMotion ? 'none' : 'all 0.8s ease-out',
            }}
          />

          {/* Forest glow pulse */}
          {!reducedMotion && forestGlow > 0.3 && (
            <ellipse
              cx="180"
              cy="180"
              rx="70"
              ry="50"
              fill="rgba(34, 197, 94, 0.2)"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.4;0.2"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="70;80;70"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="50;60;50"
                dur="3s"
                repeatCount="indefinite"
              />
            </ellipse>
          )}
        </svg>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div
          className="text-center max-w-xl"
          style={{
            opacity: mainTextOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - mainTextOpacity) * 20}px)`,
            transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
          }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl text-white/95 font-semibold mb-6">
            {t.act2?.brazilMatters?.text || 'Por isso o Brasil é decisivo.'}
          </p>
        </div>

        <div
          style={{
            opacity: followUpOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - followUpOpacity) * 15}px)`,
            transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
          }}
        >
          <p className="text-lg md:text-xl text-white/70 text-center max-w-md leading-relaxed">
            {t.act2?.brazilMatters?.followUp || 'Poucos países concentram tanto impacto em um único fator.'}
          </p>
        </div>

        {/* Key insight badges */}
        <div
          className="flex flex-wrap justify-center gap-4 mt-8"
          style={{
            opacity: followUpOpacity * 0.8,
            transition: reducedMotion ? 'none' : 'opacity 0.5s ease-out',
          }}
        >
          <div className="px-4 py-2 rounded-full bg-green-600/20 border border-green-500/30">
            <span className="text-sm text-green-400">
              {t.act2?.brazilMatters?.badge1 || '60% da Amazônia'}
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-amber-600/20 border border-amber-500/30">
            <span className="text-sm text-amber-400">
              {t.act2?.brazilMatters?.badge2 || 'Maior rebanho comercial'}
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30">
            <span className="text-sm text-red-400">
              {t.act2?.brazilMatters?.badge3 || 'Top 6 emissor global'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
