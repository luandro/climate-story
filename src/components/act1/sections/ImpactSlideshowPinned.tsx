import { useCallback, useMemo } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ImpactSlideshowPinnedProps {
  /** Progress through this section (0-1) */
  progress: number;
  /** Whether this section is currently active */
  isActive: boolean;
  /** User prefers reduced motion */
  reducedMotion: boolean;
}

/**
 * Slide configuration with cue ranges and assets
 * Each slide occupies a portion of the normalized progress (0→1)
 */
interface SlideConfig {
  id: string;
  /** Start of active range (0-1) */
  start: number;
  /** End of active range (0-1) */
  end: number;
  /** Background asset type */
  assetType: 'image' | 'video' | 'gradient';
  /** Background asset URL (or gradient CSS) */
  assetSrc: string;
  /** Icon for the card */
  iconType: 'thermometer' | 'heart' | 'droplets' | 'alert';
  /** Translation key for title */
  titleKey: 'extremeHeat' | 'health' | 'drought' | 'disasters';
  /** Accent color for text/icon */
  accentColor: string;
  /** Whether this is the disaster card with counter */
  hasCounter?: boolean;
}

/**
 * Slide configurations with cue ranges (data-start/data-end)
 *
 * 4 cards + end plateau = 5 segments:
 * - Card 1 (Extreme Heat): 0.00-0.22
 * - Card 2 (Health): 0.22-0.44
 * - Card 3 (Drought): 0.44-0.66
 * - Card 4 (Disasters): 0.66-0.85
 * - End Plateau: 0.85-1.00 (Card 4 stays visible for extra scroll)
 *
 * Images from Unsplash (free to use):
 * - Heat: Urban heat wave / hot city
 * - Health: Hospital/medical environment
 * - Drought: Cracked dry earth
 * - Disasters: Flooding/storm damage
 */
const SLIDES: SlideConfig[] = [
  {
    id: 'extreme-heat',
    start: 0,
    end: 0.22,
    assetType: 'image',
    // Heat wave - scorching sun over city (Unsplash: Matt Palmer)
    assetSrc: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1920&q=80',
    iconType: 'thermometer',
    titleKey: 'extremeHeat',
    accentColor: '#f97316', // orange-500
  },
  {
    id: 'health',
    start: 0.22,
    end: 0.44,
    assetType: 'image',
    // Health impact - hospital corridor (Unsplash: Hush Naidoo Jade Photography)
    assetSrc: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    iconType: 'heart',
    titleKey: 'health',
    accentColor: '#ef4444', // red-500
  },
  {
    id: 'drought',
    start: 0.44,
    end: 0.66,
    assetType: 'image',
    // Drought - cracked dry earth (Unsplash: Redcharlie)
    assetSrc: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80',
    iconType: 'droplets',
    titleKey: 'drought',
    accentColor: '#f59e0b', // amber-500
  },
  {
    id: 'disasters',
    start: 0.66,
    end: 0.85,
    assetType: 'image',
    // Disasters - flooded street (Unsplash: Chris Gallagher)
    assetSrc: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1920&q=80',
    iconType: 'alert',
    titleKey: 'disasters',
    accentColor: '#dc2626', // red-600
    hasCounter: true,
  },
];

// Icon components
function ThermometerIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-12 md:h-12">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-12 md:h-12">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function DropletsIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-12 md:h-12">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}

function AlertTriangleIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-12 md:h-12">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function getIcon(type: SlideConfig['iconType'], color: string) {
  switch (type) {
    case 'thermometer': return <ThermometerIcon color={color} />;
    case 'heart': return <HeartIcon color={color} />;
    case 'droplets': return <DropletsIcon color={color} />;
    case 'alert': return <AlertTriangleIcon color={color} />;
  }
}

/**
 * ACT 1.5 - Impact Slideshow (Full-Viewport Pinned)
 *
 * This component renders a full-viewport slideshow where:
 * - Background images/gradients crossfade as user scrolls
 * - Text overlays crossfade in sync with backgrounds
 * - Only one background and one text block visible at a time
 * - Smooth eased opacity transitions (no abrupt switches)
 *
 * The parent sticky container handles pinning - this component
 * receives progress (0-1) and handles visual transitions.
 *
 * Structure:
 * - imageLayer: 4 absolutely positioned backgrounds with opacity 0→1→0
 * - scrimLayer: Dark gradient for text readability
 * - overlayLayer: 4 text blocks with smooth crossfades
 */
export function ImpactSlideshowPinned({ progress, isActive, reducedMotion }: ImpactSlideshowPinnedProps) {
  const { t } = useTranslation();

  // Calculate eased opacity for each slide based on progress
  const getSlideOpacity = useCallback((slide: SlideConfig, idx: number) => {
    const { start, end } = slide;

    // Handle end plateau: Last slide stays visible from 0.66 to 1.00
    if (idx === SLIDES.length - 1) {
      if (progress < start) return 0;
      // Fade in
      if (progress < start + 0.05) {
        return easeOutCubic((progress - start) / 0.05);
      }
      // Stay visible through end plateau
      return 1;
    }

    // Before slide range
    if (progress < start) return 0;

    // After slide range
    if (progress >= end) return 0;

    // Within slide range - calculate fade in and fade out
    const rangeLength = end - start;
    const fadeInEnd = start + rangeLength * 0.15;
    const fadeOutStart = end - rangeLength * 0.15;

    // Fade in during first 15% of range
    if (progress < fadeInEnd) {
      return easeOutCubic((progress - start) / (fadeInEnd - start));
    }

    // Fade out during last 15% of range
    if (progress > fadeOutStart) {
      return 1 - easeOutCubic((progress - fadeOutStart) / (end - fadeOutStart));
    }

    // Fully visible
    return 1;
  }, [progress]);

  // Get local progress within current slide (for animations like counter)
  const getLocalProgress = useCallback((slide: SlideConfig) => {
    const { start, end } = slide;
    if (progress < start) return 0;
    // For last slide, extend to end plateau
    const effectiveEnd = slide.id === 'disasters' ? 1.0 : end;
    if (progress > effectiveEnd) return 1;
    return (progress - start) / (effectiveEnd - start);
  }, [progress]);

  // Determine active slide index (highest opacity)
  const activeSlideIndex = useMemo(() => {
    // During end plateau (0.85-1.00), card 4 is active
    if (progress >= 0.85) return 3;

    let maxOpacity = 0;
    let activeIdx = 0;
    SLIDES.forEach((slide, idx) => {
      const opacity = getSlideOpacity(slide, idx);
      if (opacity > maxOpacity) {
        maxOpacity = opacity;
        activeIdx = idx;
      }
    });
    return activeIdx;
  }, [progress, getSlideOpacity]);

  // Section opacity - fade in when entering, continuous throughout
  const sectionOpacity = isActive ? 1 : Math.max(0, 1 - Math.abs(progress - 0.5) * 4);

  if (!isActive && progress <= 0) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-500',
        !isActive && 'pointer-events-none'
      )}
      style={{
        opacity: sectionOpacity,
        zIndex: isActive ? 25 : 0,
      }}
      role="region"
      aria-label={t.act1.impacts.ariaLabel}
    >
      {/* Background Layer - Full viewport backgrounds that crossfade */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, idx) => {
          const opacity = getSlideOpacity(slide, idx);
          const isCurrentlyActive = idx === activeSlideIndex;

          return (
            <div
              key={slide.id}
              className="absolute inset-0 w-full h-full"
              data-start={slide.start}
              data-end={slide.end}
              style={{
                background: slide.assetType === 'gradient' ? slide.assetSrc : undefined,
                opacity: reducedMotion ? (isCurrentlyActive ? 1 : 0) : opacity,
                transition: reducedMotion ? 'opacity 0.3s ease-out' : 'opacity 0.6s ease-out',
                zIndex: isCurrentlyActive ? 2 : 1,
              }}
            >
              {/* Image assets */}
              {slide.assetType === 'image' && (
                <img
                  src={slide.assetSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              )}
              {/* Video assets */}
              {slide.assetType === 'video' && (
                <video
                  src={slide.assetSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dark scrim for text readability over images */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.5) 100%)',
          zIndex: 3,
        }}
      />

      {/* Text Overlay Layer */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 4 }}>
        {SLIDES.map((slide, idx) => {
          const opacity = getSlideOpacity(slide, idx);
          const isCurrentlyActive = idx === activeSlideIndex;
          const localProgress = getLocalProgress(slide);

          // Get translated content
          const impactContent = t.act1.impacts[slide.titleKey];
          const title = impactContent?.title || '';
          const description = impactContent?.description || '';

          return (
            <div
              key={`text-${slide.id}`}
              className={cn(
                'absolute inset-0 flex items-center justify-center px-6 md:px-12',
                !isCurrentlyActive && 'pointer-events-none'
              )}
              data-start={slide.start}
              data-end={slide.end}
              style={{
                opacity: reducedMotion ? (isCurrentlyActive ? 1 : 0) : opacity,
                transition: reducedMotion ? 'opacity 0.3s ease-out' : 'opacity 0.6s ease-out',
                zIndex: isCurrentlyActive ? 10 : 5,
              }}
            >
              <div className="max-w-3xl w-full text-center">
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-6"
                  style={{
                    backgroundColor: `${slide.accentColor}15`,
                    border: `2px solid ${slide.accentColor}30`,
                    transform: reducedMotion ? 'none' : `scale(${0.8 + Math.min(1, opacity) * 0.2})`,
                    transition: 'transform 0.4s ease-out',
                  }}
                >
                  {getIcon(slide.iconType, slide.accentColor)}
                </div>

                {/* Title */}
                <h3
                  className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
                  style={{
                    transform: reducedMotion ? 'none' : `translateY(${(1 - Math.min(1, opacity * 1.5)) * 20}px)`,
                    transition: 'transform 0.5s ease-out',
                  }}
                >
                  {title}
                </h3>

                {/* Description */}
                <p
                  className="text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto"
                  style={{
                    transform: reducedMotion ? 'none' : `translateY(${(1 - Math.min(1, opacity * 1.2)) * 15}px)`,
                    transition: 'transform 0.5s ease-out',
                  }}
                >
                  {description}
                </p>

                {/* Disaster Counter (only for card 4) */}
                {slide.hasCounter && isCurrentlyActive && (
                  <DisasterCounter
                    progress={localProgress}
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

      {/* Progress dots indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
        style={{ zIndex: 5, opacity: 0.7 }}
        aria-hidden="true"
      >
        {SLIDES.map((slide, idx) => (
          <div
            key={`dot-${slide.id}`}
            className="transition-all duration-300"
            style={{
              width: idx === activeSlideIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: idx === activeSlideIndex ? 'white' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Easing function
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Disaster counter sub-component
interface DisasterCounterProps {
  progress: number;
  reducedMotion: boolean;
  label1990: string;
  labelToday: string;
}

function DisasterCounter({ progress, reducedMotion, label1990, labelToday }: DisasterCounterProps) {
  // Animate from low value to high value over first 50% of local progress
  const baseValue = 10;
  const multiplier = 5.6; // 460% increase = 5.6x
  const animProgress = Math.min(1, progress / 0.5);
  const currentMultiplier = 1 + (multiplier - 1) * easeOutCubic(animProgress);
  const currentValue = Math.round(baseValue * currentMultiplier);

  // Show percentage callout after counter animation
  const showPercentage = progress > 0.5;

  return (
    <div className="mt-10 pt-8 border-t border-white/10 max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-6">
        {/* 1990s value */}
        <div className="text-center">
          <span className="block text-sm text-white/50 mb-1">{label1990}</span>
          <span className="text-3xl md:text-4xl font-bold text-white/60 tabular-nums">
            {baseValue}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                'absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full',
                reducedMotion ? '' : 'transition-all duration-300'
              )}
              style={{ width: `${Math.min(100, animProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* Today value */}
        <div className="text-center">
          <span className="block text-sm text-white/50 mb-1">{labelToday}</span>
          <span
            className={cn(
              'text-3xl md:text-4xl font-bold tabular-nums',
              currentValue > 50 ? 'text-red-500' : 'text-orange-400',
              reducedMotion ? '' : 'transition-colors duration-300'
            )}
          >
            {currentValue}
          </span>
        </div>
      </div>

      {/* Percentage callout */}
      <div
        className={cn(
          'mt-8 text-center',
          reducedMotion ? '' : 'transition-all duration-500'
        )}
        style={{
          opacity: showPercentage ? 1 : 0,
          transform: showPercentage ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
        }}
      >
        <span className="text-5xl md:text-6xl font-bold text-red-500">+460%</span>
      </div>
    </div>
  );
}
