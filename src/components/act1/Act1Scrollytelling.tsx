import { useRef, useState, useEffect, useMemo } from 'react';
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
const SECTIONS = {
  arrival: { start: 0, end: 0.08 },
  timeBegins: { start: 0.08, end: 0.30 },
  present: { start: 0.30, end: 0.42 },
  average: { start: 0.42, end: 0.55 },
  impacts: { start: 0.55, end: 0.85 },
  landing: { start: 0.85, end: 0.94 },
  transition: { start: 0.94, end: 1.0 },
};

export function Act1Scrollytelling({ className }: Act1ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0 });

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Calculate section-local progress
  const getSectionProgress = (section: keyof typeof SECTIONS) => {
    const { start, end } = SECTIONS[section];
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };

  // Determine which section is active
  const getActiveSection = () => {
    for (const [name, { start, end }] of Object.entries(SECTIONS)) {
      if (progress >= start && progress < end) return name;
    }
    return 'transition';
  };

  const activeSection = getActiveSection();

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
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ACT 1.0 - Arrival */}
        <Act1Arrival
          progress={getSectionProgress('arrival')}
          isActive={activeSection === 'arrival'}
          reducedMotion={prefersReducedMotion}
        />

        {/* ACT 1.1 & 1.2 - Time Begins + Warming Over Time */}
        <Act1TimeBegins
          progress={getSectionProgress('timeBegins')}
          isActive={activeSection === 'timeBegins'}
          reducedMotion={prefersReducedMotion}
        />

        {/* ACT 1.3 - The Present Moment */}
        <Act1Present
          progress={getSectionProgress('present')}
          isActive={activeSection === 'present'}
          reducedMotion={prefersReducedMotion}
        />

        {/* ACT 1.4 - The Average Hides Reality */}
        <Act1Average
          progress={getSectionProgress('average')}
          isActive={activeSection === 'average'}
          reducedMotion={prefersReducedMotion}
        />

        {/* ACT 1.5 - What This Means in Practice */}
        <Act1Impacts
          progress={getSectionProgress('impacts')}
          isActive={activeSection === 'impacts'}
          reducedMotion={prefersReducedMotion}
        />

        {/* ACT 1.6 - Landing */}
        <Act1Landing
          progress={getSectionProgress('landing')}
          isActive={activeSection === 'landing'}
          reducedMotion={prefersReducedMotion}
        />

        {/* ACT 1.7 - Transition to Act 2 */}
        <Act1Transition
          progress={getSectionProgress('transition')}
          isActive={activeSection === 'transition'}
          reducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  );
}
