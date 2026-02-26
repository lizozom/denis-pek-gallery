"use client";

import { GalleryImage, getFrameStyles, getFrameStylesAnimated, getFrameInset } from "@/lib/gallery";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import GalleryImageComponent from "@/app/components/GalleryImage";
import ImageSkeleton from "@/app/components/ImageSkeleton";
import Image from "next/image";

const IMAGES_PER_LOAD = 20;

interface LightboxState {
  image: GalleryImage;
  originRect: DOMRect;
}

interface GalleryClientProps {
  images: GalleryImage[];
  locale: Locale;
}

export default function GalleryClient({ images, locale }: GalleryClientProps) {
  const t = getTranslations(locale);
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_LOAD);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Navigation state — two-phase approach for reliable animation
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'setup' | 'animate'>('idle');
  const [outgoingImage, setOutgoingImage] = useState<GalleryImage | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'prev' | 'next'>('next');
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioningRef = useRef(false);

  // Touch state for mobile swipe
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchDeltaRef = useRef(0);

  const filteredImages = images;

  const currentIndex = useMemo(() => {
    if (!lightbox) return -1;
    return filteredImages.findIndex((img) => img.id === lightbox.image.id);
  }, [lightbox, filteredImages]);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredImages.length - 1;

  // --- Auto-hide controls logic ---
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 1000);
  }, []);

  // Show controls on any mouse movement or touch
  useEffect(() => {
    if (!lightbox || !isOpen) return;

    const onMove = () => resetHideTimer();
    const onTouch = () => resetHideTimer();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });

    // Start the initial hide timer
    resetHideTimer();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [lightbox, isOpen, resetHideTimer]);

  // --- Navigation ---
  // Two-phase transition: 'setup' positions incoming off-screen (no transition),
  // then 'animate' slides/fades both images to their final positions.
  const goToImage = useCallback(
    (direction: 'prev' | 'next') => {
      if (!lightbox || transitioningRef.current) return;
      const idx = filteredImages.findIndex((img) => img.id === lightbox.image.id);
      const nextIdx = direction === 'prev' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= filteredImages.length) return;

      transitioningRef.current = true;
      setTransitionDirection(direction);
      setOutgoingImage(lightbox.image);
      setLightbox({ image: filteredImages[nextIdx], originRect: lightbox.originRect });

      // Phase 1: 'setup' — render both images, incoming positioned off-screen, no transition
      setTransitionPhase('setup');

      // Phase 2: after browser paints the setup frame, enable transitions and animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionPhase('animate');
        });
      });

      // Phase 3: clean up after animation completes
      setTimeout(() => {
        setTransitionPhase('idle');
        setOutgoingImage(null);
        transitioningRef.current = false;
      }, 480);
    },
    [lightbox, filteredImages]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredImages.length) {
          setVisibleCount((prev) => Math.min(prev + IMAGES_PER_LOAD, filteredImages.length));
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredImages.length]);

  // Keyboard + body lock (toolbar hide is handled in handleImageClick/closeLightbox)
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToImage('prev');
      if (e.key === "ArrowRight") goToImage('next');
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, goToImage]);

  // Preload adjacent images
  useEffect(() => {
    if (!lightbox || currentIndex < 0) return;
    const toPreload: string[] = [];
    if (currentIndex > 0) toPreload.push(filteredImages[currentIndex - 1].src);
    if (currentIndex < filteredImages.length - 1) toPreload.push(filteredImages[currentIndex + 1].src);
    toPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [lightbox, currentIndex, filteredImages]);

  const handleImageClick = useCallback((image: GalleryImage, rect: DOMRect) => {
    // Step 1: fade toolbar out first
    document.body.classList.add("lightbox-open");

    // Step 2: start image zoom shortly after toolbar begins fading
    setTimeout(() => {
      setLightbox({ image, originRect: rect });
      setIsAnimatingIn(true);
      setIsOpen(false);
      setIsClosing(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOpen(true);
          setIsAnimatingIn(false);
        });
      });
      // Show frame after zoom-in animation completes (150ms delay + 550ms animation)
      setTimeout(() => setShowFrame(true), 600);
    }, 150);
  }, []);

  const closeLightbox = useCallback(() => {
    setShowFrame(false);
    setIsClosing(true);
    setIsOpen(false);
    // Start toolbar fade-in when image is ~80% back
    setTimeout(() => {
      document.body.classList.remove("lightbox-open");
    }, 300);
    // Clean up lightbox after image finishes animating
    setTimeout(() => {
      setLightbox(null);
      setIsClosing(false);
    }, 400);
  }, []);

  // --- Touch handlers for mobile swipe ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (transitioningRef.current) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    touchDeltaRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || transitioningRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    // Only track horizontal swipes
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      touchDeltaRef.current = dx;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const dx = touchDeltaRef.current;
    const elapsed = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;
    touchDeltaRef.current = 0;

    // Velocity-based or distance-based swipe detection
    const velocity = Math.abs(dx) / elapsed;
    const triggered = Math.abs(dx) > 50 || velocity > 0.4;

    if (triggered) {
      if (dx < 0 && hasNext) goToImage('next');
      else if (dx > 0 && hasPrev) goToImage('prev');
    }
  }, [hasNext, hasPrev, goToImage]);

  const visibleImages = filteredImages.slice(0, visibleCount);

  const getImageStyle = (): React.CSSProperties => {
    if (!lightbox) return {};
    const { originRect } = lightbox;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isAnimatingIn || isClosing) {
      return {
        position: 'fixed',
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
        transition: isClosing ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        zIndex: 68,
      };
    }

    if (isOpen) {
      const padding = vw * 0.05;
      const bottomPadding = padding + 40; // extra space for title
      return {
        position: 'fixed',
        top: padding,
        left: padding,
        width: vw - padding * 2,
        height: vh - padding - bottomPadding,
        transition: 'all 0.55s cubic-bezier(0.25, 0.6, 0.1, 1)',
        zIndex: 68,
      };
    }

    return {};
  };

  // Controls opacity style
  const controlStyle: React.CSSProperties = {
    opacity: controlsVisible ? 1 : 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'auto',
  };

  return (
    <>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {isInitialLoad && images.length === 0 ? (
          <div className="columns-2 lg:columns-4 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <ImageSkeleton aspectRatio={i % 3 === 0 ? 'portrait' : 'square'} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="columns-2 lg:columns-4 gap-4 [column-fill:balance]">
              {visibleImages.map((image, index) => (
                <div key={image.id} className="mb-4 break-inside-avoid">
                  <GalleryImageComponent
                    image={image}
                    index={index}
                    onImageClick={handleImageClick}
                    isActive={!!lightbox && !isClosing && lightbox.image.id === image.id}
                  />
                </div>
              ))}
            </div>

            <div ref={observerRef} className="h-20 w-full" />

            {visibleCount < filteredImages.length && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-gray-500">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">{t.loading}</span>
                </div>
              </div>
            )}
          </>
        )}

        {!isInitialLoad && filteredImages.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-500">No photos available</p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightbox && (
        <>
          {/* Blurred backdrop */}
          <div
            className="fixed inset-0 z-[66]"
            onClick={closeLightbox}
            style={{
              backdropFilter: isOpen ? 'blur(12px)' : 'blur(0px)',
              backgroundColor: isOpen ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
              transition: 'all 0.5s cubic-bezier(0.05, 0.8, 0.2, 1)',
            }}
          />

          {/* Close button — small visual, large touch area, auto-hides */}
          <button
            onClick={closeLightbox}
            className="lightbox-control fixed top-2 right-2 z-[70] flex items-center justify-center"
            style={controlStyle}
            aria-label="Close"
          >
            {/* Large invisible touch area */}
            <span className="absolute inset-0 -m-3" />
            {/* Small visible icon */}
            <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>

          {/* Prev arrow — small visual, large touch area, auto-hides */}
          {hasPrev && (
            <button
              onClick={() => goToImage('prev')}
              className="lightbox-control fixed left-2 top-1/2 -translate-y-1/2 z-[70] hidden md:flex items-center justify-center"
              style={controlStyle}
              aria-label="Previous image"
            >
              <span className="absolute inset-0 -m-4" />
              <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            </button>
          )}

          {/* Next arrow — small visual, large touch area, auto-hides */}
          {hasNext && (
            <button
              onClick={() => goToImage('next')}
              className="lightbox-control fixed right-2 top-1/2 -translate-y-1/2 z-[70] hidden md:flex items-center justify-center"
              style={controlStyle}
              aria-label="Next image"
            >
              <span className="absolute inset-0 -m-4" />
              <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          )}

          {/* Image container */}
          <div
            ref={imageRef}
            style={{ ...getImageStyle(), touchAction: 'pan-y' }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 overflow-hidden">
              {/* Outgoing image — visible during setup, fades/slides out during animate */}
              {transitionPhase !== 'idle' && outgoingImage && (
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: transitionPhase === 'setup' ? 1 : 0,
                    transform: transitionPhase === 'setup'
                      ? 'translateX(0)'
                      : transitionDirection === 'next'
                        ? 'translateX(-8%)'
                        : 'translateX(8%)',
                    transition: transitionPhase === 'animate'
                      ? 'opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), transform 420ms cubic-bezier(0.4, 0, 0.2, 1)'
                      : 'none',
                    ...(getFrameStyles(outgoingImage) ? {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    } : {}),
                  }}
                >
                  {getFrameStyles(outgoingImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={outgoingImage.src}
                      alt={outgoingImage.alt}
                      style={{
                        display: 'block',
                        maxWidth: `calc(100% - ${getFrameInset(outgoingImage) * 2}px)`,
                        maxHeight: `calc(100% - ${getFrameInset(outgoingImage) * 2}px)`,
                        ...getFrameStyles(outgoingImage)!,
                        boxSizing: 'content-box',
                      }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={outgoingImage.src}
                      alt={outgoingImage.alt}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  )}
                </div>
              )}

              {/* Current image — positioned off-screen during setup, slides/fades in during animate */}
              <div
                className="absolute inset-0"
                style={transitionPhase !== 'idle' ? {
                  opacity: transitionPhase === 'setup' ? 0 : 1,
                  transform: transitionPhase === 'setup'
                    ? transitionDirection === 'next'
                      ? 'translateX(8%)'
                      : 'translateX(-8%)'
                    : 'translateX(0)',
                  transition: transitionPhase === 'animate'
                    ? 'opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), transform 420ms cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'none',
                  ...(getFrameStyles(lightbox.image) ? {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  } : {}),
                } : getFrameStyles(lightbox.image) ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                } : undefined}
              >
                {getFrameStyles(lightbox.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lightbox.image.src}
                    alt={lightbox.image.alt}
                    style={{
                      display: 'block',
                      maxWidth: `calc(100% - ${getFrameInset(lightbox.image) * 2}px)`,
                      maxHeight: `calc(100% - ${getFrameInset(lightbox.image) * 2}px)`,
                      ...getFrameStylesAnimated(lightbox.image, showFrame)!,
                      boxSizing: 'content-box',
                    }}
                  />
                ) : transitionPhase !== 'idle' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lightbox.image.src}
                    alt={lightbox.image.alt}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lightbox.image.src}
                      alt={lightbox.image.alt}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <Image
                      src={lightbox.image.src}
                      alt={lightbox.image.alt}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      quality={95}
                      priority
                    />
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Titles — crossfade + slide in sync with images */}
          <div className="fixed left-0 right-0 bottom-3 text-center z-[69]" style={{ overflow: 'hidden' }}>
            {/* Outgoing title */}
            {transitionPhase !== 'idle' && outgoingImage && (
              <h3
                className="text-white text-xl font-light tracking-wide drop-shadow-lg absolute inset-x-0"
                style={{
                  opacity: transitionPhase === 'setup' ? 1 : 0,
                  transform: transitionPhase === 'setup'
                    ? 'translateX(0)'
                    : transitionDirection === 'next'
                      ? 'translateX(-8%)'
                      : 'translateX(8%)',
                  transition: transitionPhase === 'animate'
                    ? 'opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), transform 420ms cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'none',
                }}
              >
                {outgoingImage.title}
              </h3>
            )}

            {/* Current title */}
            <h3
              className="text-white text-xl font-light tracking-wide drop-shadow-lg"
              style={transitionPhase !== 'idle' ? {
                opacity: transitionPhase === 'setup' ? 0 : 1,
                transform: transitionPhase === 'setup'
                  ? transitionDirection === 'next'
                    ? 'translateX(8%)'
                    : 'translateX(-8%)'
                  : 'translateX(0)',
                transition: transitionPhase === 'animate'
                  ? 'opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), transform 420ms cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none',
              } : {
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease 0.15s',
              }}
            >
              {lightbox.image.title}
            </h3>
          </div>
        </>
      )}
    </>
  );
}
