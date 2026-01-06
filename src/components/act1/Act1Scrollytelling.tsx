import { useRef, useState, useEffect, useCallback } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

// Import all Act 1 sections
import { Act1Arrival } from './sections/Act1Arrival';
import { Act1TimeBegins } from './sections/Act1TimeBegins';
import { Act1Present } from './sections/Act1Present';
import { Act1Average } from './sections/Act1Average';
import { Act1Impacts } from './sections/Act1Impacts';
import { Act1Landing } from './sections/Act1Landing';
import { Act1Transition } from './sections/Act1Transition';

interface Act1ScrollytellingProps {
  className?: string;
}

// Define section boundaries as percentages of total scroll
// Adjusted for better pacing: longer arrival, dwell in present section
const SECTIONS = {
  arrival: { start: 0, end: 0.10, index: 0 },      // 10% - more breathing room
  timeBegins: { start: 0.10, end: 0.32, index: 1 }, // 22% - with intro fade
  present: { start: 0.32, end: 0.50, index: 2 },    // 18% - includes 8% dwell at end
  average: { start: 0.50, end: 0.60, index: 3 },    // 10%
  impacts: { start: 0.60, end: 0.86, index: 4 },    // 26%
  landing: { start: 0.86, end: 0.94, index: 5 },    // 8%
  transition: { start: 0.94, end: 1.0, index: 6 },  // 6%
} as const;

type SectionName = keyof typeof SECTIONS;

const SECTION_ORDER: SectionName[] = [
  'arrival',
  'timeBegins',
  'present',
  'average',
  'impacts',
  'landing',
  'transition',
];

// Easing function for smooth transitions
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

  // Calculate intro fade for the entire Act 1 (from hero)
  // First 5% of progress = fade in from hero
  const act1IntroOpacity = Math.min(1, progress / 0.05);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        className
      )}
      style={{
        // Total scroll height: sum of all section heights
        // This creates the scroll space for the entire Act 1
        height: '1400vh',
      }}
    >
      {/* Sticky container for all content */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-black"
        style={{
          // Smooth fade from hero section
          opacity: prefersReducedMotion ? 1 : easeOutCubic(act1IntroOpacity),
        }}
      >
        {/* ACT 1.0 - Arrival */}
        {shouldRenderSection('arrival') && (
          <Act1Arrival
            progress={getSectionProgress('arrival')}
            isActive={activeSection === 'arrival'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 1.1 & 1.2 - Time Begins + Warming Over Time */}
        {shouldRenderSection('timeBegins') && (
          <Act1TimeBegins
            progress={getSectionProgress('timeBegins')}
            isActive={activeSection === 'timeBegins'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 1.3 - The Present Moment (with dwell) */}
        {shouldRenderSection('present') && (
          <Act1Present
            progress={getSectionProgress('present')}
            isActive={activeSection === 'present'}
            reducedMotion={prefersReducedMotion}
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

        {/* ACT 1.5 - What This Means in Practice */}
        {shouldRenderSection('impacts') && (
          <Act1Impacts
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
