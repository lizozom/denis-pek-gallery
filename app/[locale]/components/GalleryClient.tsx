"use client";

import { GalleryImage } from "@/lib/gallery";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const imageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const filteredImages = images;

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

  // Escape key handler
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", handleKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  const handleImageClick = useCallback((image: GalleryImage, rect: DOMRect) => {
    setLightbox({ image, originRect: rect });
    setIsAnimatingIn(true);
    setIsOpen(false);
    setIsClosing(false);
    // Trigger the transition to full screen on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
        setIsAnimatingIn(false);
      });
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setIsClosing(true);
    setIsOpen(false);
    // Wait for the closing animation to finish
    setTimeout(() => {
      setLightbox(null);
      setIsClosing(false);
    }, 400);
  }, []);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const columnCount = 3;

  const columns: GalleryImage[][] = Array.from({ length: columnCount }, () => []);
  visibleImages.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });

  // Calculate the starting transform from thumbnail to center
  const getImageStyle = (): React.CSSProperties => {
    if (!lightbox) return {};
    const { originRect } = lightbox;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isAnimatingIn || isClosing) {
      // Position at the thumbnail's location
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
      // Animate to full screen center
      const padding = vw * 0.05; // 5% padding
      return {
        position: 'fixed',
        top: padding,
        left: padding,
        width: vw - padding * 2,
        height: vh - padding * 2,
        transition: 'all 0.5s cubic-bezier(0.05, 0.8, 0.2, 1)',
        zIndex: 68,
      };
    }

    return {};
  };

  return (
    <>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {isInitialLoad && images.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <ImageSkeleton key={i} aspectRatio={i % 3 === 0 ? 'portrait' : 'square'} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map((image, imageIndex) => (
                    <GalleryImageComponent
                      key={image.id}
                      image={image}
                      index={columnIndex * columnCount + imageIndex}
                      onImageClick={handleImageClick}
                    />
                  ))}
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
              backgroundColor: isOpen ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
              transition: 'all 0.5s cubic-bezier(0.05, 0.8, 0.2, 1)',
            }}
          />

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="fixed top-4 right-4 z-[70] p-3 rounded-full bg-black/50 text-white/90 hover:text-white hover:bg-black/70 transition-colors pointer-events-auto"
            style={{
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.3s ease 0.2s',
            }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Animated image container */}
          <div
            ref={imageRef}
            style={getImageStyle()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Instant thumbnail (already cached by browser) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.image.src}
              alt={lightbox.image.alt}
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* High-res version loads on top */}
            <Image
              src={lightbox.image.src}
              alt={lightbox.image.alt}
              fill
              className="object-contain"
              sizes="90vw"
              quality={95}
              priority
            />

            {/* Title — inside image container so it's relative to the image */}
            <div
              className="absolute bottom-3 left-0 right-0 text-center z-10"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease 0.15s',
              }}
            >
              <h3 className="text-white text-xl font-light tracking-wide drop-shadow-lg">
                {lightbox.image.title}
              </h3>
            </div>
          </div>
        </>
      )}
    </>
  );
}
