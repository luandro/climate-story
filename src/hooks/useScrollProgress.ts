import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollProgress {
  progress: number; // 0 to 1
  isInView: boolean;
  scrollY: number;
  direction: 'up' | 'down' | null;
}

interface UseScrollProgressOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollProgress(
  elementRef: React.RefObject<HTMLElement>,
  options: UseScrollProgressOptions = {}
): ScrollProgress {
  const { threshold = 0, rootMargin = '0px' } = options;
  
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  const calculateProgress = useCallback(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    
    // Calculate how much of the element has been scrolled through
    const scrollStart = rect.top - windowHeight;
    const scrollEnd = rect.bottom;
    const scrollRange = scrollEnd - scrollStart;
    const currentScroll = -scrollStart;
    
    const newProgress = Math.max(0, Math.min(1, currentScroll / scrollRange));
    
    setProgress(newProgress);
    setIsInView(rect.top < windowHeight && rect.bottom > 0);
    
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
    lastScrollY.current = currentScrollY;
  }, [elementRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [calculateProgress]);

  return { progress, isInView, scrollY, direction };
}

export function useGlobalScrollProgress(): { progress: number; scrollY: number } {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      setProgress(docHeight > 0 ? currentScroll / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, scrollY };
}
