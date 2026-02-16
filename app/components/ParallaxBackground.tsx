'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function ParallaxBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!bgRef.current) return;
    const scrollY = window.scrollY;
    // Recalculate maxScroll every frame to handle dynamic content (infinite scroll, etc.)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    // Clamp between 0 and 100 — works on any screen size
    const scrollPercent = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    bgRef.current.style.backgroundPositionY = `${scrollPercent}%`;
  }, []);

  useEffect(() => {
    // Listen for scroll and resize
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Also observe DOM size changes (e.g. infinite scroll adding content)
    const observer = new ResizeObserver(handleScroll);
    observer.observe(document.documentElement);

    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
    };
  }, [handleScroll]);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: 'url(/bg-texture.jpg), radial-gradient(ellipse at center, #919191 0%, #D1CFCF 70%)',
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
        backgroundPositionY: '0%',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
        willChange: 'background-position',
      }}
    />
  );
}
