import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Act3AgricultureProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  isHighlighted: boolean;
}

/**
 * ACT 3.9 - Sustainable Agriculture (EXPANDED VERSION)
 *
 * Three subsections:
 * 3.9.1 - Agroflorestas
 * 3.9.2 - ILPF (Integração Lavoura-Pecuária-Floresta)
 * 3.9.3 - Pastagens Regenerativas
 *
 * Impact Statement:
 * "Com outra ocupação do território, o Brasil pode produzir mais alimentos,
 *  emitir menos carbono e manter florestas em pé."
 */
export function Act3Agriculture({
  progress,
  isActive,
  reducedMotion,
  isHighlighted,
}: Act3AgricultureProps) {
  const { t } = useTranslation();

  // Calculate subsection progress (0-1 for each)
  // 0.00-0.10: Introduction
  // 0.10-0.35: Agroforestry
  // 0.35-0.60: ILPF
  // 0.60-0.85: Regenerative Pastures
  // 0.85-1.00: Impact Statement

  const getSubsectionOpacity = (start: number, end: number) => {
    const fadeInEnd = start + 0.08;
    const fadeOutStart = end - 0.08;

    if (progress < start) return 0;
    if (progress < fadeInEnd) return (progress - start) / 0.08;
    if (progress < fadeOutStart) return 1;
    if (progress < end) return 1 - (progress - fadeOutStart) / 0.08;
    return 0;
  };

  const introOpacity = getSubsectionOpacity(0, 0.15);
  const agroforestryOpacity = getSubsectionOpacity(0.10, 0.38);
  const ilpfOpacity = getSubsectionOpacity(0.35, 0.63);
  const regenerativeOpacity = getSubsectionOpacity(0.60, 0.88);
  const impactOpacity = progress > 0.82 ? Math.min(1, (progress - 0.82) / 0.12) : 0;

  // Background visualization progress
  const bgProgress = Math.min(1, progress * 1.2);

  // Lime/green glow intensity
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
      {/* Background - landscape visualization */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top,
            rgba(22, 101, 52, ${glowIntensity * bgProgress}) 0%,
            rgba(15, 23, 15, 0.8) 40%,
            transparent 70%)`,
        }}
      />

      {/* Landscape elements */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          opacity: bgProgress * 0.5,
        }}
      >
        <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="agri-ground" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#166534" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14532d" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Rolling hills */}
          <path
            d="M 0 80 Q 50 40, 100 60 Q 150 30, 200 50 Q 250 20, 300 55 Q 350 35, 400 60 L 400 80 Z"
            fill="url(#agri-ground)"
          />
        </svg>
      </div>

      {/* Main content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Introduction */}
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: introOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - introOpacity) * 30}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            position: 'absolute',
          }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light">
            {t.act3?.agriculture?.intro || 'A forma como usamos a terra no Brasil pode ser parte do problema — ou da solução.'}
          </p>
        </div>

        {/* Agroforestry */}
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: agroforestryOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - agroforestryOpacity) * 30}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            position: 'absolute',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🌳</span>
            <h3 className="text-lg md:text-xl text-lime-400 font-medium">
              {t.act3?.agriculture?.agroforestry?.title || 'Agroflorestas'}
            </h3>
            <span className="text-3xl">🌾</span>
          </div>
          <p className="text-lg md:text-xl text-white/80 mb-4">
            {t.act3?.agriculture?.agroforestry?.text || 'Agroflorestas combinam árvores, alimentos e renda na mesma paisagem.'}
          </p>
          <div className="px-5 py-3 bg-lime-500/10 border border-lime-500/30 rounded-lg inline-block">
            <p className="text-base text-lime-200">
              {t.act3?.agriculture?.agroforestry?.data || 'Esses sistemas podem aumentar a produtividade total por hectare e sequestrar carbono ao mesmo tempo.'}
            </p>
          </div>
          <p className="text-sm text-white/40 mt-3">
            {t.act3?.agriculture?.agroforestry?.source || 'MDPI Sustainability (2020) / ScienceDirect (2020)'}
          </p>
        </div>

        {/* ILPF */}
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: ilpfOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - ilpfOpacity) * 30}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            position: 'absolute',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🌾</span>
            <span className="text-2xl">🐄</span>
            <span className="text-2xl">🌳</span>
          </div>
          <h3 className="text-lg md:text-xl text-green-400 font-medium mb-3">
            {t.act3?.agriculture?.ilpf?.title || 'Integração Lavoura-Pecuária-Floresta (ILPF)'}
          </h3>
          <p className="text-lg md:text-xl text-white/80 mb-4">
            {t.act3?.agriculture?.ilpf?.text || 'Sistemas integrados recuperam pastagens degradadas e produzem mais sem abrir novas áreas.'}
          </p>
          <div className="px-5 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-base text-green-200 mb-3">
              {t.act3?.agriculture?.ilpf?.data || 'No Brasil, ILPF pode aumentar significativamente a taxa de lotação animal por hectare e reduzir o tempo de abate.'}
            </p>
            {/* Benefits list */}
            <div className="flex flex-wrap justify-center gap-2">
              {['Produtividade pecuária', 'Conforto térmico animal', 'Solo mais fértil'].map((benefit, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300"
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/40 mt-3">
            {t.act3?.agriculture?.ilpf?.source || 'IPEA (TD 2296) / EMBRAPA / Plano ABC+'}
          </p>
        </div>

        {/* Regenerative Pastures */}
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: regenerativeOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - regenerativeOpacity) * 30}px)`,
            transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
            position: 'absolute',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🌿</span>
            <h3 className="text-lg md:text-xl text-emerald-400 font-medium">
              {t.act3?.agriculture?.regenerative?.title || 'Pastagens Regenerativas'}
            </h3>
            <span className="text-3xl">💧</span>
          </div>
          <p className="text-lg md:text-xl text-white/80 mb-4">
            {t.act3?.agriculture?.regenerative?.text || 'Manejo regenerativo melhora o solo, retém água e reduz emissões de metano.'}
          </p>
          <p className="text-base text-emerald-200/80 mb-4">
            {t.act3?.agriculture?.regenerative?.followUp || 'Produzir mais em áreas já abertas reduz a pressão por desmatamento.'}
          </p>
          <p className="text-sm text-white/40">
            {t.act3?.agriculture?.regenerative?.source || 'Reuters / FAO / Insper Agro'}
          </p>
        </div>

        {/* Impact Statement */}
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: impactOpacity,
            transform: reducedMotion
              ? 'none'
              : `translateY(${(1 - impactOpacity) * 20}px) scale(${0.95 + impactOpacity * 0.05})`,
            transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            position: 'absolute',
          }}
        >
          <div
            className="px-8 py-6 bg-gradient-to-r from-lime-500/20 via-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-2xl"
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-green-300 font-medium leading-relaxed">
              {t.act3?.agriculture?.impact || 'Com outra ocupação do território, o Brasil pode produzir mais alimentos, emitir menos carbono e manter florestas em pé.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
