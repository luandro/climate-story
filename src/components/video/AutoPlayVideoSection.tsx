import { useRef, useEffect, useState } from 'react';
import { useIntersectionObserver, useReducedMotion } from '@/hooks/useIntersectionObserver';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AutoPlayVideoSectionProps {
  src?: string;
  poster?: string;
  onVideoEnd?: () => void;
  className?: string;
}

export function AutoPlayVideoSection({
  src = '/assets/demo/video.mp4',
  poster = '/assets/demo/poster.png',
  onVideoEnd,
  className,
}: AutoPlayVideoSectionProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });
  const reducedMotion = useReducedMotion();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  // Auto-play when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isIntersecting && !hasEnded && !reducedMotion) {
      video.play().catch(() => {
        // Autoplay blocked - that's ok
      });
    } else {
      video.pause();
    }
  }, [isIntersecting, hasEnded, reducedMotion]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setHasEnded(true);
    setIsPlaying(false);
    onVideoEnd?.();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={cn(
        'relative w-full aspect-video rounded-lg overflow-hidden bg-muted',
        className
      )}
    >
      {/* Video placeholder (since we don't have real video) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-background/80 flex items-center justify-center mb-4 mx-auto">
            <Play className="w-8 h-8 text-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t.components.video.loading}</p>
        </div>
      </div>
      
      {/* Actual video element (hidden but functional) */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        playsInline
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      />
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label={isPlaying ? t.components.video.pause : t.components.video.play}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label={isMuted ? t.components.video.unmute : t.components.video.mute}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
