'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function ParallaxBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  // Capture viewport height once so mobile address-bar resize doesn't cause jumps
  const stableHeightRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!bgRef.current) return;
    if (stableHeightRef.current === 0) {
      stableHeightRef.current = window.innerHeight;
    }
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - stableHeightRef.current;
    if (maxScroll <= 0) return;
    const scrollPercent = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    // Image starts at IMAGE_TOP_OFFSET% so it sits below the heading, then scrolls to 100%
    const IMAGE_TOP_OFFSET = 15;
    const imagePos = IMAGE_TOP_OFFSET + scrollPercent * ((100 - IMAGE_TOP_OFFSET) / 100);
    bgRef.current.style.backgroundPositionY = `${imagePos}%, center`;
  }, []);

  useEffect(() => {
    // Lock the element height on mount so mobile toolbar show/hide doesn't resize it
    if (bgRef.current) {
      bgRef.current.style.height = `${window.innerHeight}px`;
    }

    // Reset stable height on orientation change (genuine viewport change, not address-bar)
    const handleOrientation = () => {
      stableHeightRef.current = 0;
      if (bgRef.current) {
        bgRef.current.style.height = `${window.innerHeight}px`;
      }
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleOrientation);

    // Also observe DOM size changes (e.g. infinite scroll adding content)
    const observer = new ResizeObserver(handleScroll);
    observer.observe(document.documentElement);

    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('orientationchange', handleOrientation);
      observer.disconnect();
    };
  }, [handleScroll]);

  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{
        backgroundColor: '#909090',
        backgroundImage: 'url(/bg-texture-v2.jpg)',
        backgroundSize: 'auto 150%',
        backgroundPositionX: 'center',
        backgroundPositionY: '15%',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
        willChange: 'background-position',
      }}
    />
  );
}
