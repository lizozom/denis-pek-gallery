'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function ParallaxBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!bgRef.current) return;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const scrollPercent = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    // Image starts at IMAGE_TOP_OFFSET% so it sits below the heading, then scrolls to 100%
    const IMAGE_TOP_OFFSET = 15;
    const imagePos = IMAGE_TOP_OFFSET + scrollPercent * ((100 - IMAGE_TOP_OFFSET) / 100);
    bgRef.current.style.backgroundPositionY = `${imagePos}%, center`;
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
        backgroundImage: 'url(/bg-texture-v2.jpg), radial-gradient(ellipse at center, #919191 0%, #D1CFCF 70%)',
        backgroundSize: 'auto 150%, cover',
        backgroundPositionX: 'center, center',
        backgroundPositionY: '15%, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        zIndex: -1,
        willChange: 'background-position',
      }}
    />
  );
}
