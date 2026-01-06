import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

// Import all Act 2 sections
import { Act2Entry } from './sections/Act2Entry';
import { Act2Activities } from './sections/Act2Activities';
import { Act2EmissionsFlow } from './sections/Act2EmissionsFlow';
import { Act2AtmosphereFills } from './sections/Act2AtmosphereFills';
import { Act2GlobalPicture } from './sections/Act2GlobalPicture';
import { Act2BrazilToggle } from './sections/Act2BrazilToggle';
import { Act2Deforestation } from './sections/Act2Deforestation';
import { Act2Agriculture } from './sections/Act2Agriculture';
import { Act2Systemic } from './sections/Act2Systemic';
import { Act2BrazilMatters } from './sections/Act2BrazilMatters';
import { Act2Transition } from './sections/Act2Transition';

interface Act2ScrollytellingProps {
  className?: string;
}

/**
 * ACT 2: A Anatomia do Problema
 * "De onde isso tudo vem?"
 *
 * SCROLL-DRIVEN SANKEY ARCHITECTURE
 *
 * This act transitions from time-based (Act 1) to flow-based visualization.
 * A Sankey-style diagram shows how human activities produce emissions.
 *
 * Raw Progress → Visual State:
 * 0.00-0.06  → Entry (inherit flow lines from Act 1)
 * 0.06-0.14  → Activities appear (icons fade in)
 * 0.14-0.24  → Emissions start flowing (Sankey emerges)
 * 0.24-0.32  → Atmosphere fills (layer builds up)
 * 0.32-0.42  → Global picture (fossil fuels dominant)
 * 0.42-0.56  → Brazil toggle (interactive comparison)
 * 0.56-0.64  → Focus: Desmatamento
 * 0.64-0.72  → Focus: Agropecuária
 * 0.72-0.80  → Systemic view (zoom out)
 * 0.80-0.90  → Brazil matters (why decisive)
 * 0.90-1.00  → Transition to Act 3
 */

// Section boundaries (raw scroll progress)
const SECTIONS = {
  entry: { start: 0, end: 0.06, index: 0 },           // 6%
  activities: { start: 0.06, end: 0.14, index: 1 },   // 8%
  emissions: { start: 0.14, end: 0.24, index: 2 },    // 10%
  atmosphere: { start: 0.24, end: 0.32, index: 3 },   // 8%
  global: { start: 0.32, end: 0.42, index: 4 },       // 10%
  toggle: { start: 0.42, end: 0.56, index: 5 },       // 14% - key interactive moment
  deforestation: { start: 0.56, end: 0.64, index: 6 }, // 8%
  agriculture: { start: 0.64, end: 0.72, index: 7 },  // 8%
  systemic: { start: 0.72, end: 0.80, index: 8 },     // 8%
  brazilMatters: { start: 0.80, end: 0.90, index: 9 }, // 10%
  transition: { start: 0.90, end: 1.0, index: 10 },   // 10%
} as const;

type SectionName = keyof typeof SECTIONS;

const SECTION_ORDER: SectionName[] = [
  'entry',
  'activities',
  'emissions',
  'atmosphere',
  'global',
  'toggle',
  'deforestation',
  'agriculture',
  'systemic',
  'brazilMatters',
  'transition',
];

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Act2Scrollytelling({ className }: Act2ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0 });

  // Region state for toggle (persists across sections after toggle)
  const [selectedRegion, setSelectedRegion] = useState<'world' | 'brazil'>('world');

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
   * GLOBAL VISUAL STATE for Act 2
   * Controls the Sankey diagram and related visuals
   */
  const visualState = useMemo(() => {
    // Flow visibility: starts appearing in entry, fully visible by emissions
    let flowVisibility: number;
    if (progress < SECTIONS.entry.start) {
      flowVisibility = 0;
    } else if (progress < SECTIONS.emissions.end) {
      const flowProgress = (progress - SECTIONS.entry.start) /
        (SECTIONS.emissions.end - SECTIONS.entry.start);
      flowVisibility = easeOutCubic(flowProgress);
    } else {
      flowVisibility = 1;
    }

    // Activities opacity: fade in during activities section
    let activitiesOpacity: number;
    if (progress < SECTIONS.activities.start) {
      activitiesOpacity = 0;
    } else if (progress < SECTIONS.activities.end) {
      const actProgress = (progress - SECTIONS.activities.start) /
        (SECTIONS.activities.end - SECTIONS.activities.start);
      activitiesOpacity = easeOutCubic(actProgress);
    } else {
      activitiesOpacity = 1;
    }

    // Atmosphere layer thickness: builds up during atmosphere section
    let atmosphereThickness: number;
    if (progress < SECTIONS.atmosphere.start) {
      atmosphereThickness = 0;
    } else if (progress < SECTIONS.atmosphere.end) {
      const atmProgress = (progress - SECTIONS.atmosphere.start) /
        (SECTIONS.atmosphere.end - SECTIONS.atmosphere.start);
      atmosphereThickness = easeInOutCubic(atmProgress);
    } else {
      atmosphereThickness = 1;
    }

    // Heat shimmer intensity (for atmosphere effect)
    const heatShimmer = atmosphereThickness > 0.5
      ? (atmosphereThickness - 0.5) * 2
      : 0;

    // Focus mode: which emission source is highlighted (null = none)
    let focusedSource: 'deforestation' | 'agriculture' | null = null;
    if (progress >= SECTIONS.deforestation.start && progress < SECTIONS.deforestation.end) {
      focusedSource = 'deforestation';
    } else if (progress >= SECTIONS.agriculture.start && progress < SECTIONS.agriculture.end) {
      focusedSource = 'agriculture';
    }

    // Whether we're past the toggle section (region choice persists)
    const pastToggle = progress >= SECTIONS.toggle.end;

    // Background darkness increases with atmosphere
    const backgroundDarkness = Math.min(0.15, atmosphereThickness * 0.15);

    return {
      flowVisibility,
      activitiesOpacity,
      atmosphereThickness,
      heatShimmer,
      focusedSource,
      pastToggle,
      backgroundDarkness,
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

  // Handle region toggle
  const handleRegionToggle = useCallback((region: 'world' | 'brazil') => {
    setSelectedRegion(region);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        className
      )}
      style={{
        // Total scroll height for entire Act 2
        height: '1600vh',
      }}
    >
      {/* Sticky container for all content */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: `linear-gradient(to bottom,
            rgba(23, 23, 23, ${1 - visualState.backgroundDarkness}) 0%,
            rgba(15, 15, 15, ${1 + visualState.backgroundDarkness}) 100%)`,
        }}
      >
        {/* ACT 2.0 - Entry (transition from Act 1) */}
        {shouldRenderSection('entry') && (
          <Act2Entry
            progress={getSectionProgress('entry')}
            isActive={activeSection === 'entry'}
            reducedMotion={prefersReducedMotion}
            flowVisibility={visualState.flowVisibility}
          />
        )}

        {/* ACT 2.1 - Human Activities Appear */}
        {shouldRenderSection('activities') && (
          <Act2Activities
            progress={getSectionProgress('activities')}
            isActive={activeSection === 'activities'}
            reducedMotion={prefersReducedMotion}
            activitiesOpacity={visualState.activitiesOpacity}
          />
        )}

        {/* ACT 2.2 - Emissions Start Flowing */}
        {shouldRenderSection('emissions') && (
          <Act2EmissionsFlow
            progress={getSectionProgress('emissions')}
            isActive={activeSection === 'emissions'}
            reducedMotion={prefersReducedMotion}
            flowVisibility={visualState.flowVisibility}
            activitiesOpacity={visualState.activitiesOpacity}
          />
        )}

        {/* ACT 2.3 - Atmosphere Fills */}
        {shouldRenderSection('atmosphere') && (
          <Act2AtmosphereFills
            progress={getSectionProgress('atmosphere')}
            isActive={activeSection === 'atmosphere'}
            reducedMotion={prefersReducedMotion}
            flowVisibility={visualState.flowVisibility}
            atmosphereThickness={visualState.atmosphereThickness}
            heatShimmer={visualState.heatShimmer}
          />
        )}

        {/* ACT 2.4 - The Global Picture */}
        {shouldRenderSection('global') && (
          <Act2GlobalPicture
            progress={getSectionProgress('global')}
            isActive={activeSection === 'global'}
            reducedMotion={prefersReducedMotion}
            flowVisibility={visualState.flowVisibility}
            atmosphereThickness={visualState.atmosphereThickness}
          />
        )}

        {/* ACT 2.5 - Brazil Toggle (Critical Moment) */}
        {shouldRenderSection('toggle') && (
          <Act2BrazilToggle
            progress={getSectionProgress('toggle')}
            isActive={activeSection === 'toggle'}
            reducedMotion={prefersReducedMotion}
            selectedRegion={selectedRegion}
            onRegionToggle={handleRegionToggle}
            flowVisibility={visualState.flowVisibility}
            atmosphereThickness={visualState.atmosphereThickness}
          />
        )}

        {/* ACT 2.6 - Focus: Desmatamento */}
        {shouldRenderSection('deforestation') && (
          <Act2Deforestation
            progress={getSectionProgress('deforestation')}
            isActive={activeSection === 'deforestation'}
            reducedMotion={prefersReducedMotion}
            selectedRegion={selectedRegion}
            focusedSource={visualState.focusedSource}
          />
        )}

        {/* ACT 2.7 - Focus: Agropecuária */}
        {shouldRenderSection('agriculture') && (
          <Act2Agriculture
            progress={getSectionProgress('agriculture')}
            isActive={activeSection === 'agriculture'}
            reducedMotion={prefersReducedMotion}
            selectedRegion={selectedRegion}
            focusedSource={visualState.focusedSource}
          />
        )}

        {/* ACT 2.8 - Systemic, Not Individual */}
        {shouldRenderSection('systemic') && (
          <Act2Systemic
            progress={getSectionProgress('systemic')}
            isActive={activeSection === 'systemic'}
            reducedMotion={prefersReducedMotion}
            selectedRegion={selectedRegion}
          />
        )}

        {/* ACT 2.9 - Why Brazil Matters */}
        {shouldRenderSection('brazilMatters') && (
          <Act2BrazilMatters
            progress={getSectionProgress('brazilMatters')}
            isActive={activeSection === 'brazilMatters'}
            reducedMotion={prefersReducedMotion}
            selectedRegion={selectedRegion}
          />
        )}

        {/* ACT 2.10 - Transition to Act 3 */}
        {shouldRenderSection('transition') && (
          <Act2Transition
            progress={getSectionProgress('transition')}
            isActive={activeSection === 'transition'}
            reducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    </div>
  );
}
