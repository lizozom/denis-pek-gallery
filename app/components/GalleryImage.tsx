'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { titleToSlug, GalleryImage as GalleryImageType } from '@/lib/gallery';
import { Locale } from '@/lib/i18n';

interface GalleryImageProps {
  image: GalleryImageType;
  locale: Locale;
  index: number;
}

export default function GalleryImage({ image, locale, index }: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <Link
      href={`/${locale}/photo/${titleToSlug(image.title)}`}
      className="group cursor-pointer block relative overflow-hidden rounded-sm bg-gray-100"
      style={{
        // Stagger fade-in animation
        animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`,
      }}
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
          <p className="text-white/70 text-xs sm:text-sm mt-1 font-light uppercase tracking-wider">
            {image.category}
          </p>
        </div>
      </div>
    </Link>
  );
}
