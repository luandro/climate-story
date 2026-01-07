import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

// Import all Act 3 sections
import { Act3Entry } from './sections/Act3Entry';
import { Act3Scale } from './sections/Act3Scale';
import { Act3Toolkit } from './sections/Act3Toolkit';
import { Act3Forests } from './sections/Act3Forests';
import { Act3Indigenous } from './sections/Act3Indigenous';
import { Act3Systems } from './sections/Act3Systems';
import { Act3CleanEnergy } from './sections/Act3CleanEnergy';
import { Act3Efficiency } from './sections/Act3Efficiency';
import { Act3Transport } from './sections/Act3Transport';
import { Act3Agriculture } from './sections/Act3Agriculture';
import { Act3Pattern } from './sections/Act3Pattern';
import { Act3BrazilCentral } from './sections/Act3BrazilCentral';
import { Act3Transition } from './sections/Act3Transition';

interface Act3ScrollytellingProps {
  className?: string;
}

/**
 * ACT 3: A Caixa de Ferramentas
 * "O que realmente muda o jogo?"
 *
 * SCROLL-DRIVEN TOOLKIT ARCHITECTURE
 *
 * This act transitions from problem analysis (Act 2) to solution-focused visualization.
 * An interactive toolkit shows how different solutions contribute to emissions reduction.
 *
 * Raw Progress → Visual State:
 * 0.00-0.06  → Entry (the good news - solutions exist)
 * 0.06-0.12  → Scale (not all solutions are equal)
 * 0.12-0.20  → Toolkit (interactive solution tiles)
 * 0.20-0.28  → Forests (biggest climate lever)
 * 0.28-0.38  → Indigenous (critical section)
 * 0.38-0.44  → Systems (extraction vs sustainable)
 * 0.44-0.50  → Clean Energy
 * 0.50-0.56  → Efficiency
 * 0.56-0.62  → Transport
 * 0.62-0.76  → Agriculture (expanded - 3 subsections)
 * 0.76-0.82  → Pattern (combined impact)
 * 0.82-0.90  → Brazil Central (why Brazil matters)
 * 0.90-1.00  → Transition to Act 4
 */

// Section boundaries (raw scroll progress)
const SECTIONS = {
  entry: { start: 0, end: 0.06, index: 0 },           // 6%
  scale: { start: 0.06, end: 0.12, index: 1 },        // 6%
  toolkit: { start: 0.12, end: 0.20, index: 2 },      // 8%
  forests: { start: 0.20, end: 0.28, index: 3 },      // 8%
  indigenous: { start: 0.28, end: 0.38, index: 4 },   // 10% - critical section
  systems: { start: 0.38, end: 0.44, index: 5 },      // 6%
  cleanEnergy: { start: 0.44, end: 0.50, index: 6 },  // 6%
  efficiency: { start: 0.50, end: 0.56, index: 7 },   // 6%
  transport: { start: 0.56, end: 0.62, index: 8 },    // 6%
  agriculture: { start: 0.62, end: 0.76, index: 9 },  // 14% - expanded
  pattern: { start: 0.76, end: 0.82, index: 10 },     // 6%
  brazilCentral: { start: 0.82, end: 0.90, index: 11 }, // 8%
  transition: { start: 0.90, end: 1.0, index: 12 },   // 10%
} as const;

type SectionName = keyof typeof SECTIONS;

const SECTION_ORDER: SectionName[] = [
  'entry',
  'scale',
  'toolkit',
  'forests',
  'indigenous',
  'systems',
  'cleanEnergy',
  'efficiency',
  'transport',
  'agriculture',
  'pattern',
  'brazilCentral',
  'transition',
];

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Solution tile type for interactive toolkit
export type SolutionTile = 'forests' | 'indigenous' | 'cleanEnergy' | 'efficiency' | 'transport' | 'agriculture';

export function Act3Scrollytelling({ className }: Act3ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(containerRef, { threshold: 0 });

  // Active solution tiles for cumulative impact visualization
  const [activeTiles, setActiveTiles] = useState<Set<SolutionTile>>(new Set());

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

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Auto-activate tiles based on scroll progress (when not in toolkit section)
  useEffect(() => {
    // Only auto-activate when scrolling past each solution section
    const newTiles = new Set<SolutionTile>();

    if (progress >= SECTIONS.forests.start) newTiles.add('forests');
    if (progress >= SECTIONS.indigenous.start) newTiles.add('indigenous');
    if (progress >= SECTIONS.cleanEnergy.start) newTiles.add('cleanEnergy');
    if (progress >= SECTIONS.efficiency.start) newTiles.add('efficiency');
    if (progress >= SECTIONS.transport.start) newTiles.add('transport');
    if (progress >= SECTIONS.agriculture.start) newTiles.add('agriculture');

    setActiveTiles(newTiles);
  }, [progress]);

  /**
   * GLOBAL VISUAL STATE for Act 3
   * Controls toolkit visualization and cumulative impact
   */
  const visualState = useMemo(() => {
    // Solution visibility: grows as user scrolls through solutions
    const solutionProgress = progress >= SECTIONS.toolkit.start
      ? Math.min(1, (progress - SECTIONS.toolkit.start) / (SECTIONS.agriculture.end - SECTIONS.toolkit.start))
      : 0;

    // Cumulative impact bar (based on active tiles)
    const cumulativeImpact = activeTiles.size / 6; // 6 total tiles

    // Green accent intensity (hope indicator)
    const hopeIntensity = easeOutCubic(solutionProgress);

    // Background transitions from dark to slightly green-tinted
    const greenTint = Math.min(0.1, solutionProgress * 0.1);

    // Current focused solution (for highlighting)
    let focusedSolution: SolutionTile | null = null;
    if (progress >= SECTIONS.forests.start && progress < SECTIONS.forests.end) {
      focusedSolution = 'forests';
    } else if (progress >= SECTIONS.indigenous.start && progress < SECTIONS.systems.end) {
      focusedSolution = 'indigenous';
    } else if (progress >= SECTIONS.cleanEnergy.start && progress < SECTIONS.cleanEnergy.end) {
      focusedSolution = 'cleanEnergy';
    } else if (progress >= SECTIONS.efficiency.start && progress < SECTIONS.efficiency.end) {
      focusedSolution = 'efficiency';
    } else if (progress >= SECTIONS.transport.start && progress < SECTIONS.transport.end) {
      focusedSolution = 'transport';
    } else if (progress >= SECTIONS.agriculture.start && progress < SECTIONS.agriculture.end) {
      focusedSolution = 'agriculture';
    }

    return {
      solutionProgress,
      cumulativeImpact,
      hopeIntensity,
      greenTint,
      focusedSolution,
    };
  }, [progress, activeTiles]);

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
    return Math.abs(sectionIndex - activeSectionIndex) <= 1;
  }, [activeSectionIndex]);

  // Handle tile toggle (for interactive toolkit)
  const handleTileToggle = useCallback((tile: SolutionTile) => {
    setActiveTiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tile)) {
        newSet.delete(tile);
      } else {
        newSet.add(tile);
      }
      return newSet;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        className
      )}
      style={{
        // Total scroll height for entire Act 3
        height: '1800vh',
      }}
    >
      {/* Sticky container for all content */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: `linear-gradient(to bottom,
            rgba(15, 15, 15, 1) 0%,
            rgba(15, 23, 15, ${1 + visualState.greenTint}) 100%)`,
        }}
      >
        {/* ACT 3.0 - Entry (The Turn) */}
        {shouldRenderSection('entry') && (
          <Act3Entry
            progress={getSectionProgress('entry')}
            isActive={activeSection === 'entry'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 3.1 - Not All Solutions Are Equal */}
        {shouldRenderSection('scale') && (
          <Act3Scale
            progress={getSectionProgress('scale')}
            isActive={activeSection === 'scale'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 3.2 - The Toolkit (Interactive) */}
        {shouldRenderSection('toolkit') && (
          <Act3Toolkit
            progress={getSectionProgress('toolkit')}
            isActive={activeSection === 'toolkit'}
            reducedMotion={prefersReducedMotion}
            activeTiles={activeTiles}
            onTileToggle={handleTileToggle}
            cumulativeImpact={visualState.cumulativeImpact}
          />
        )}

        {/* ACT 3.3 - Forests (Biggest Climate Lever) */}
        {shouldRenderSection('forests') && (
          <Act3Forests
            progress={getSectionProgress('forests')}
            isActive={activeSection === 'forests'}
            reducedMotion={prefersReducedMotion}
            isHighlighted={visualState.focusedSolution === 'forests'}
          />
        )}

        {/* ACT 3.4 - Indigenous Peoples (Critical Section) */}
        {shouldRenderSection('indigenous') && (
          <Act3Indigenous
            progress={getSectionProgress('indigenous')}
            isActive={activeSection === 'indigenous'}
            reducedMotion={prefersReducedMotion}
            isHighlighted={visualState.focusedSolution === 'indigenous'}
          />
        )}

        {/* ACT 3.5 - Systems of Life vs Extraction */}
        {shouldRenderSection('systems') && (
          <Act3Systems
            progress={getSectionProgress('systems')}
            isActive={activeSection === 'systems'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 3.6 - Clean Energy */}
        {shouldRenderSection('cleanEnergy') && (
          <Act3CleanEnergy
            progress={getSectionProgress('cleanEnergy')}
            isActive={activeSection === 'cleanEnergy'}
            reducedMotion={prefersReducedMotion}
            isHighlighted={visualState.focusedSolution === 'cleanEnergy'}
          />
        )}

        {/* ACT 3.7 - Energy Efficiency */}
        {shouldRenderSection('efficiency') && (
          <Act3Efficiency
            progress={getSectionProgress('efficiency')}
            isActive={activeSection === 'efficiency'}
            reducedMotion={prefersReducedMotion}
            isHighlighted={visualState.focusedSolution === 'efficiency'}
          />
        )}

        {/* ACT 3.8 - Electric Transport */}
        {shouldRenderSection('transport') && (
          <Act3Transport
            progress={getSectionProgress('transport')}
            isActive={activeSection === 'transport'}
            reducedMotion={prefersReducedMotion}
            isHighlighted={visualState.focusedSolution === 'transport'}
          />
        )}

        {/* ACT 3.9 - Sustainable Agriculture (Expanded) */}
        {shouldRenderSection('agriculture') && (
          <Act3Agriculture
            progress={getSectionProgress('agriculture')}
            isActive={activeSection === 'agriculture'}
            reducedMotion={prefersReducedMotion}
            isHighlighted={visualState.focusedSolution === 'agriculture'}
          />
        )}

        {/* ACT 3.10 - The Pattern */}
        {shouldRenderSection('pattern') && (
          <Act3Pattern
            progress={getSectionProgress('pattern')}
            isActive={activeSection === 'pattern'}
            reducedMotion={prefersReducedMotion}
            cumulativeImpact={visualState.cumulativeImpact}
          />
        )}

        {/* ACT 3.11 - Why Brazil is Central */}
        {shouldRenderSection('brazilCentral') && (
          <Act3BrazilCentral
            progress={getSectionProgress('brazilCentral')}
            isActive={activeSection === 'brazilCentral'}
            reducedMotion={prefersReducedMotion}
          />
        )}

        {/* ACT 3.12 - Transition to Act 4 */}
        {shouldRenderSection('transition') && (
          <Act3Transition
            progress={getSectionProgress('transition')}
            isActive={activeSection === 'transition'}
            reducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    </div>
  );
}
