import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

// Import all Act 1 sections
import { Act1Arrival } from './sections/Act1Arrival';
import { Act1TimeBegins } from './sections/Act1TimeBegins';
import { Act1Present } from './sections/Act1Present';
import { Act1Average } from './sections/Act1Average';
import { ImpactSlideshowPinned } from './sections/ImpactSlideshowPinned';
import { Act1Landing } from './sections/Act1Landing';
import { Act1Transition } from './sections/Act1Transition';

interface Act1ScrollytellingProps {
  className?: string;
}

/**
 * CONTINUOUS INTERPOLATION ARCHITECTURE
 *
 * Raw scroll progress is mapped to visual progress with a PLATEAU at peak temperature.
 * This creates a "dead zone" where scrolling continues but visuals stay locked.
 *
 * Raw Progress → Visual State:
 * 0.00-0.08  → Arrival text (fade in/out)
 * 0.08-0.30  → Thermometer rises (0°C → +1.6°C), stripes fill blue→red
 * 0.30-0.50  → PLATEAU - all visuals locked at peak (+1.6°C, full red stripes)
 *              This is 20% of total scroll = significant "heavy" pause
 * 0.50-0.60  → Average section
 * 0.60-0.85  → Impacts section
 * 0.85-0.93  → Landing section
 * 0.93-1.00  → Transition to Act 2
 */

// Section boundaries (raw scroll progress)
const SECTIONS = {
  arrival: { start: 0, end: 0.08, index: 0 },        // 8%
  timeBegins: { start: 0.08, end: 0.30, index: 1 },  // 22% - thermometer rises
  plateau: { start: 0.30, end: 0.50, index: 2 },     // 20% - SCROLL PLATEAU (peak locked)
  average: { start: 0.50, end: 0.60, index: 3 },     // 10%
  impacts: { start: 0.60, end: 0.85, index: 4 },     // 25%
  landing: { start: 0.85, end: 0.93, index: 5 },     // 8%
  transition: { start: 0.93, end: 1.0, index: 6 },   // 7%
} as const;

type SectionName = keyof typeof SECTIONS;

const SECTION_ORDER: SectionName[] = [
  'arrival',
  'timeBegins',
  'plateau',
  'average',
  'impacts',
  'landing',
  'transition',
];

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Act1Scrollytelling({ className }: Act1ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0 });

  // Dynamic reduced motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * GLOBAL VISUAL STATE - Continuous interpolation
   * These values control the visual appearance across all sections
   * Temperature progress has a PLATEAU where it stays locked at 1.0
   */
  const visualState = useMemo(() => {
    // Temperature progress: 0 = 0°C, 1 = +1.6°C
    // Rises during timeBegins (0.08-0.30), LOCKED at 1.0 during plateau (0.30-0.50)
    let temperatureProgress: number;
    if (progress < SECTIONS.timeBegins.start) {
      temperatureProgress = 0;
    } else if (progress < SECTIONS.timeBegins.end) {
      // Rising from 0 to 1.6°C
      const risingProgress = (progress - SECTIONS.timeBegins.start) /
        (SECTIONS.timeBegins.end - SECTIONS.timeBegins.start);
      temperatureProgress = easeOutCubic(risingProgress);
    } else {
      // At or past peak - locked at 1.0
      temperatureProgress = 1;
    }

    // Climate stripes visibility: fades in during timeBegins, stays full after
    let stripesOpacity: number;
    if (progress < SECTIONS.timeBegins.start) {
      stripesOpacity = 0;
    } else if (progress < SECTIONS.timeBegins.end) {
      const fadeInProgress = (progress - SECTIONS.timeBegins.start) /
        (SECTIONS.timeBegins.end - SECTIONS.timeBegins.start);
      stripesOpacity = easeOutCubic(fadeInProgress) * 0.4;
    } else {
      stripesOpacity = 0.4;
    }

    // Whether we're in the plateau (for UI hints)
    const inPlateau = progress >= SECTIONS.plateau.start && progress < SECTIONS.plateau.end;

    // Plateau progress (0-1 within plateau, for any subtle indicators)
    const plateauProgress = inPlateau
      ? (progress - SECTIONS.plateau.start) / (SECTIONS.plateau.end - SECTIONS.plateau.start)
      : progress >= SECTIONS.plateau.end ? 1 : 0;

    // Arrival text opacity (continuous fade in/out)
    let arrivalOpacity: number;
    if (progress < 0.03) {
      arrivalOpacity = progress / 0.03;
    } else if (progress < 0.06) {
      arrivalOpacity = 1;
    } else if (progress < SECTIONS.timeBegins.start) {
      arrivalOpacity = 1 - (progress - 0.06) / (SECTIONS.timeBegins.start - 0.06);
    } else {
      arrivalOpacity = 0;
    }

    return {
      temperatureProgress,
      stripesOpacity,
      inPlateau,
      plateauProgress,
      arrivalOpacity,
    };
  }, [progress]);

  // Calculate section-local progress with optional easing
  const getSectionProgress = useCallback((section: SectionName, applyEasing = false) => {
    const { start, end } = SECTIONS[section];
    if (progress < start) return 0;
    if (progress > end) return 1;
    const rawProgress = (progress - start) / (end - start);
    return applyEasing ? easeInOutCubic(rawProgress) : rawProgress;
  }, [progress]);

  // Determine which section is active
  const getActiveSection = useCallback((): SectionName => {
    for (const name of SECTION_ORDER) {
      const { start, end } = SECTIONS[name];
      if (progress >= start && progress < end) return name;
    }
    return 'transition';
  }, [progress]);

  const activeSection = getActiveSection();
  const activeSectionIndex = SECTIONS[activeSection].index;

  // Only render active section and adjacent sections for smooth transitions
  const shouldRenderSection = useCallback((section: SectionName): boolean => {
    const sectionIndex = SECTIONS[section].index;
    // Render current section and one before/after for transitions
    return Math.abs(sectionIndex - activeSectionIndex) <= 1;
  }, [activeSectionIndex]);

  // Continuous fade for entire Act 1 (from hero) - no sudden opacity changes
  const act1IntroOpacity = Math.min(1, progress / 0.05);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        className
      )}
      style={{
        // Total scroll height for entire Act 1
        height: '1400vh',
      }}
    >
      {/* Sticky container for all content */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-black"
        style={{
          // Continuous fade from hero section
          opacity: prefersReducedMotion ? 1 : easeOutCubic(act1IntroOpacity),
        }}
      >
        {/* ACT 1.0 - Arrival (continuous fade) */}
        {shouldRenderSection('arrival') && (
          <Act1Arrival
            progress={getSectionProgress('arrival')}
            isActive={activeSection === 'arrival'}
            reducedMotion={prefersReducedMotion}
            continuousOpacity={visualState.arrivalOpacity}
          />
        )}

        {/* ACT 1.1 & 1.2 - Time Begins + Warming Over Time (uses global visual state) */}
        {shouldRenderSection('timeBegins') && (
          <Act1TimeBegins
            progress={getSectionProgress('timeBegins')}
            isActive={activeSection === 'timeBegins'}
            reducedMotion={prefersReducedMotion}
            temperatureProgress={visualState.temperatureProgress}
            stripesOpacity={visualState.stripesOpacity}
          />
        )}

        {/* ACT 1.3 - PLATEAU: Peak temperature locked (uses global visual state) */}
        {shouldRenderSection('plateau') && (
          <Act1Present
            progress={getSectionProgress('plateau')}
            isActive={activeSection === 'plateau'}
            reducedMotion={prefersReducedMotion}
            temperatureProgress={visualState.temperatureProgress}
            stripesOpacity={visualState.stripesOpacity}
            inPlateau={visualState.inPlateau}
            plateauProgress={visualState.plateauProgress}
          />
        )}

        {/* ACT 1.4 - The Average Hides Reality */}
        {shouldRenderSection('average') && (
          <Act1Average
            progress={getSectionProgress('average')}
            isActive={activeSection === 'average'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 1.5 - Impact Cards (Full-viewport pinned slideshow) */}
        {shouldRenderSection('impacts') && (
          <ImpactSlideshowPinned
            progress={getSectionProgress('impacts')}
            isActive={activeSection === 'impacts'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 1.6 - Landing */}
        {shouldRenderSection('landing') && (
          <Act1Landing
            progress={getSectionProgress('landing')}
            isActive={activeSection === 'landing'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 1.7 - Transition to Act 2 */}
        {shouldRenderSection('transition') && (
          <Act1Transition
            progress={getSectionProgress('transition')}
            isActive={activeSection === 'transition'}
            reducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    </div>
  );
}
