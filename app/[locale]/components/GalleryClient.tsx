"use client";

import { GalleryImage } from "@/lib/gallery";
import { useState, useEffect, useRef } from "react";
import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import GalleryImageComponent from "@/app/components/GalleryImage";
import ImageSkeleton from "@/app/components/ImageSkeleton";
import CategoryNav from "./CategoryNav";

const IMAGES_PER_LOAD = 20; // Number of images to load at a time

interface GalleryClientProps {
  images: GalleryImage[];
  locale: Locale;
}

export default function GalleryClient({ images, locale }: GalleryClientProps) {
  const t = getTranslations(locale);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_LOAD);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  // Calculate category counts
  const categoryCounts = images.reduce((acc, image) => {
    acc[image.category] = (acc[image.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter images by selected category
  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(IMAGES_PER_LOAD);
  }, [selectedCategory]);

  useEffect(() => {
    // Remove initial load state after a short delay
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

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredImages.length]);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const columnCount = 4; // Will be responsive via CSS

  // Distribute images across columns
  const columns: GalleryImage[][] = Array.from({ length: columnCount }, () => []);
  visibleImages.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });

  return (
    <>
      <CategoryNav
        locale={locale}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Show skeletons on initial load */}
        {isInitialLoad && images.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ImageSkeleton key={i} aspectRatio={i % 3 === 0 ? 'portrait' : 'square'} />
          ))}
        </div>
      ) : (
        <>
          {/* Responsive masonry grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-4">
                {column.map((image, imageIndex) => (
                  <GalleryImageComponent
                    key={image.id}
                    image={image}
                    locale={locale}
                    index={columnIndex * columnCount + imageIndex}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={observerRef} className="h-20 w-full" />

          {/* Loading indicator */}
          {visibleCount < filteredImages.length && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">{t.loading}</span>
              </div>
            </div>
          )}
        </>
      )}

        {/* Empty state */}
        {!isInitialLoad && filteredImages.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
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
            <p className="mt-4 text-gray-500">
              {selectedCategory === 'all'
                ? 'No photos available'
                : `No photos in ${selectedCategory} category`}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                View all photos
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
