'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { GalleryImage as GalleryImageType } from '@/lib/gallery';

interface GalleryImageProps {
  image: GalleryImageType;
  index: number;
  onImageClick: (image: GalleryImageType, rect: DOMRect) => void;
}

export default function GalleryImage({ image, index, onImageClick }: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaded = useRef(false);

  // Toggle class directly on DOM to avoid React batching issues
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('gallery-visible');
          el.classList.remove('gallery-hidden');
        } else {
          el.classList.remove('gallery-visible');
          el.classList.add('gallery-hidden');
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (containerRef.current) {
      onImageClick(image, containerRef.current.getBoundingClientRect());
    }
  };

  // Preload full-size image on hover so it's cached before click
  const handleMouseEnter = useCallback(() => {
    if (preloaded.current) return;
    preloaded.current = true;
    const img = new window.Image();
    img.src = image.src;
  }, [image.src]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="group cursor-pointer block relative overflow-hidden rounded-sm bg-gray-100 gallery-hidden"
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="aspect-square flex items-center justify-center bg-gray-100">
          <svg
            className="w-12 h-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Image */}
      <Image
        src={image.src}
        alt={image.alt}
        width={800}
        height={800}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`w-full h-auto block transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        quality={85}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white text-lg sm:text-xl font-light tracking-wide">
            {image.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
