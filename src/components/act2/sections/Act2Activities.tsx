import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ActivityIcon } from '../SankeyFlow';

interface Act2ActivitiesProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
  activitiesOpacity: number;
}

const ACTIVITIES = [
  { id: 'energy', labelKey: 'energy' },
  { id: 'transport', labelKey: 'transport' },
  { id: 'industry', labelKey: 'industry' },
  { id: 'agriculture', labelKey: 'agriculture' },
  { id: 'deforestation', labelKey: 'deforestation' },
] as const;

/**
 * ACT 2.1 - Human Activities Appear
 *
 * Visual:
 * - Left side: icons/silhouettes fade in, vertically stacked
 * - Icons feel systemic, not personal (no people, no houses)
 *
 * Text: "Tudo começa com atividades humanas."
 * Motion: Icons gently pulse as if "active"
 */
export function Act2Activities({
  progress,
  isActive,
  reducedMotion,
  activitiesOpacity,
}: Act2ActivitiesProps) {
  const { t } = useTranslation();

  // Staggered icon appearance
  const getIconOpacity = (index: number) => {
    const staggerDelay = index * 0.15;
    const iconProgress = Math.max(0, progress - staggerDelay) / (1 - staggerDelay);
    return Math.min(1, iconProgress * 2);
  };

  // Text opacity
  const textOpacity = progress > 0.3 ? Math.min(1, (progress - 0.3) / 0.3) : 0;

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  const activityLabels = {
    energy: t.act2?.activities?.energy || '',
    transport: t.act2?.activities?.transport || '',
    industry: t.act2?.activities?.industry || '',
    agriculture: t.act2?.activities?.agriculture || '',
    deforestation: t.act2?.activities?.deforestation || '',
  };

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
      <div className="h-full flex">
        {/* Left side: Activity icons */}
        <div
          className="w-1/3 h-full flex flex-col items-center justify-center gap-4 md:gap-6 pl-4 md:pl-8"
          style={{ opacity: activitiesOpacity }}
        >
          {ACTIVITIES.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center gap-3"
              style={{
                opacity: getIconOpacity(index),
                transform: reducedMotion
                  ? 'none'
                  : `translateX(${(1 - getIconOpacity(index)) * -20}px)`,
                transition: reducedMotion ? 'none' : 'all 0.4s ease-out',
              }}
            >
              <ActivityIcon
                type={activity.id}
                size={32}
                pulsing={progress > 0.6}
                reducedMotion={reducedMotion}
                className="md:w-10 md:h-10"
              />
              <span className="text-xs md:text-sm text-white/60 hidden sm:block">
                {activityLabels[activity.id]}
              </span>
            </div>
          ))}
        </div>

        {/* Right side: Text */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div
            style={{
              opacity: textOpacity,
              transform: reducedMotion
                ? 'none'
                : `translateY(${(1 - textOpacity) * 20}px)`,
              transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
            }}
          >
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 text-left max-w-md">
              {t.act2?.activities?.text || ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
