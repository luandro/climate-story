import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Thermometer, Heart, Droplets, AlertTriangle } from 'lucide-react';

interface Act1ImpactsProps {
  progress: number;
  isActive: boolean;
  reducedMotion: boolean;
}

/**
 * ACT 1.5 - What This Means in Practice
 *
 * Transition: Thermometers slide out, vertical impact cards enter sequentially
 * Each card: Appears on scroll, occupies most of viewport, fades previous card
 *
 * Card 1 - Extreme Heat: Looping video of city under heat, heat distortion
 * Card 2 - Health: Minimal pulse/heartbeat animation
 * Card 3 - Water & Drought: Photo/video of Amazon river low, parallax
 * Card 4 - Disasters: Animated counter (1990s -> Today, 460% increase)
 */
export function Act1Impacts({ progress, isActive, reducedMotion }: Act1ImpactsProps) {
  const { t } = useTranslation();

  // Define 4 cards, each takes 25% of section progress
  const cards = [
    {
      id: 'extreme-heat',
      icon: Thermometer,
      title: t.act1.impacts.extremeHeat.title,
      description: t.act1.impacts.extremeHeat.description,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      id: 'health',
      icon: Heart,
      title: t.act1.impacts.health.title,
      description: t.act1.impacts.health.description,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      id: 'drought',
      icon: Droplets,
      title: t.act1.impacts.drought.title,
      description: t.act1.impacts.drought.description,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'disasters',
      icon: AlertTriangle,
      title: t.act1.impacts.disasters.title,
      description: t.act1.impacts.disasters.description,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
      borderColor: 'border-red-600/20',
      isDisasterCard: true,
    },
  ];

  // Calculate which card is active (0-3) based on progress
  const activeCardIndex = Math.min(3, Math.floor(progress * 4));

  // Calculate local progress within current card
  const cardLocalProgress = (progress * 4) % 1;

  // Get card visibility
  const getCardOpacity = (index: number) => {
    if (index < activeCardIndex) {
      // Previous cards fade out
      return 0.1;
    } else if (index === activeCardIndex) {
      // Current card: fade in during first 20%, stay visible
      if (cardLocalProgress < 0.2) {
        return cardLocalProgress / 0.2;
      }
      return 1;
    }
    return 0;
  };

  const getCardTransform = (index: number) => {
    if (reducedMotion) return 'translateY(0)';

    if (index < activeCardIndex) {
      return 'translateY(-30px) scale(0.95)';
    } else if (index === activeCardIndex) {
      const offset = cardLocalProgress < 0.2 ? (1 - cardLocalProgress / 0.2) * 50 : 0;
      return `translateY(${offset}px)`;
    }
    return 'translateY(50px)';
  };

  // Section opacity
  const sectionOpacity = isActive ? 1 : 0;

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-gray-950 transition-opacity duration-700',
        !isActive ? 'pointer-events-none' : ''
      )}
      style={{
        opacity: sectionOpacity,
        zIndex: isActive ? 25 : 0,
      }}
    >
      {/* Cards container */}
      <div className="h-full flex items-center justify-center px-4 md:px-8">
        <div className="relative w-full max-w-3xl">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const opacity = getCardOpacity(index);
            const transform = getCardTransform(index);

            return (
              <div
                key={card.id}
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all',
                  reducedMotion ? '' : 'duration-500'
                )}
                style={{
                  opacity,
                  transform,
                  zIndex: index === activeCardIndex ? 10 : 0,
                }}
              >
                <div
                  className={cn(
                    'w-full p-8 md:p-12 rounded-2xl border backdrop-blur-sm',
                    card.bgColor,
                    card.borderColor
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6',
                      card.bgColor
                    )}
                  >
                    <Icon className={cn('w-8 h-8 md:w-10 md:h-10', card.color)} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Special content for disaster card */}
                  {card.isDisasterCard && index === activeCardIndex && (
                    <DisasterCounter
                      progress={cardLocalProgress}
                      reducedMotion={reducedMotion}
                      label1990={t.act1.impacts.disasters.label1990}
                      labelToday={t.act1.impacts.disasters.labelToday}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Disaster counter sub-component
interface DisasterCounterProps {
  progress: number;
  reducedMotion: boolean;
  label1990: string;
  labelToday: string;
}

function DisasterCounter({ progress, reducedMotion, label1990, labelToday }: DisasterCounterProps) {
  // Animate from low value to high value
  const baseValue = 10; // Base events in 1990s
  const multiplier = 5.6; // 460% increase = 5.6x
  const currentMultiplier = 1 + (multiplier - 1) * Math.min(1, progress / 0.5);
  const currentValue = Math.round(baseValue * currentMultiplier);

  // Show percentage after counter animation
  const showPercentage = progress > 0.5;

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="flex items-center justify-between gap-4">
        {/* 1990s value */}
        <div className="text-center">
          <span className="block text-sm text-white/50 mb-1">{label1990}</span>
          <span className="text-2xl md:text-3xl font-bold text-white/60 tabular-nums">
            {baseValue}
          </span>
        </div>

        {/* Arrow indicator */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                'absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all',
                reducedMotion ? '' : 'duration-300'
              )}
              style={{ width: `${Math.min(100, progress * 200)}%` }}
            />
          </div>
        </div>

        {/* Today value */}
        <div className="text-center">
          <span className="block text-sm text-white/50 mb-1">{labelToday}</span>
          <span
            className={cn(
              'text-2xl md:text-3xl font-bold tabular-nums transition-colors',
              currentValue > 50 ? 'text-red-500' : 'text-orange-400',
              reducedMotion ? '' : 'duration-300'
            )}
          >
            {currentValue}
          </span>
        </div>
      </div>

      {/* Percentage callout */}
      <div
        className={cn(
          'mt-6 text-center transition-all',
          reducedMotion ? '' : 'duration-500'
        )}
        style={{
          opacity: showPercentage ? 1 : 0,
          transform: showPercentage ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <span className="text-4xl md:text-5xl font-bold text-red-500">+460%</span>
      </div>
    </div>
  );
}
