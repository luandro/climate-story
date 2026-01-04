import { ReactNode, useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

export type ActTheme = 'dark' | 'light' | 'neutral';

interface StorySectionProps {
  id: string;
  theme?: ActTheme;
  children: ReactNode;
  className?: string;
}

const themeClasses: Record<ActTheme, string> = {
  dark: 'theme-dark bg-doc-dark-bg text-doc-dark-fg',
  light: 'bg-doc-light-bg text-doc-light-fg',
  neutral: 'theme-neutral bg-doc-neutral-bg text-doc-neutral-fg',
};

export function StorySection({ 
  id, 
  theme = 'dark', 
  children,
  className 
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress, isInView } = useScrollProgress(sectionRef);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        'story-section relative theme-transition',
        themeClasses[theme],
        className
      )}
      data-theme={theme}
      data-progress={progress.toFixed(2)}
      data-in-view={isInView}
      style={{ '--section-progress': progress } as React.CSSProperties}
    >
      {children}
    </section>
  );
}
