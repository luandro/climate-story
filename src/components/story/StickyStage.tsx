import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StickyStageProps {
  children: ReactNode;
  className?: string;
}

export function StickyStage({ children, className }: StickyStageProps) {
  return (
    <div 
      className={cn(
        'sticky-stage',
        'absolute inset-0 h-screen',
        'flex items-center justify-center',
        'overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
