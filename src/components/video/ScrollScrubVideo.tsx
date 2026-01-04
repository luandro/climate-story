import { useRef, useEffect, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useReducedMotion } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface ScrollScrubVideoProps {
  src?: string;
  poster?: string;
  frames?: number;
  className?: string;
}

export function ScrollScrubVideo({
  src = '/assets/demo/scrub-video.mp4',
  poster = '/assets/demo/scrub-poster.png',
  frames = 120,
  className,
}: ScrollScrubVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { progress, isInView } = useScrollProgress(containerRef);
  const reducedMotion = useReducedMotion();
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Update video time based on scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !duration || reducedMotion) return;

    const targetTime = progress * duration;
    video.currentTime = targetTime;
  }, [progress, duration, reducedMotion]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsReady(true);
  };

  // Calculate frame position for placeholder display
  const currentFrame = Math.floor(progress * (frames - 1));
  const progressPercent = (progress * 100).toFixed(0);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-[200vh]', // Extra height for scroll range
        className
      )}
    >
      {/* Sticky video container */}
      <div className="sticky top-0 h-screen flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden bg-muted">
          {/* Placeholder visualization */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10">
            {/* Frame counter */}
            <div className="text-center mb-8">
              <div className="text-6xl font-bold font-display text-foreground/80">
                {currentFrame + 1}
              </div>
              <div className="text-sm text-muted-foreground">
                Frame {currentFrame + 1} of {frames}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-3/4 max-w-md">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Scroll to scrub</span>
                <span>{progressPercent}%</span>
              </div>
            </div>
          </div>
          
          {/* Hidden video element for actual implementation */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-cover opacity-0"
          />
        </div>
      </div>
    </div>
  );
}
