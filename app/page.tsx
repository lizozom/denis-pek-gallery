"use client";

import Image from "next/image";
import Link from "next/link";
import { galleryImages, titleToSlug } from "@/lib/gallery";
import { useState, useEffect, useRef } from "react";

const GRID_GAP = 0; // Default gap between images in pixels
const IMAGES_PER_LOAD = 20; // Number of images to load at a time

export default function Home() {
  const [gap] = useState(GRID_GAP);
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_LOAD);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < galleryImages.length) {
          setVisibleCount((prev) => Math.min(prev + IMAGES_PER_LOAD, galleryImages.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount]);

  const visibleImages = galleryImages.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Denis Pek Gallery</h1>
          <p className="mt-2 text-lg text-gray-600">
            Exploring the world through the lens
          </p>
        </div>
      </header>

      <nav className="border-b border-gray-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <ul className="flex gap-8 py-4">
            <li>
              <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                All
              </button>
            </li>
            <li>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Landscape
              </button>
            </li>
            <li>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Portrait
              </button>
            </li>
            <li>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Urban
              </button>
            </li>
            <li>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Nature
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="w-full">
        <div
          className="flex"
          style={{ gap: `${gap}px` }}
        >
          {/* Create 4 columns */}
          {[0, 1, 2, 3].map((columnIndex) => (
            <div
              key={columnIndex}
              className="flex-1 flex flex-col"
              style={{ gap: `${gap}px` }}
            >
              {visibleImages
                .filter((_, index) => index % 4 === columnIndex)
                .map((image) => (
                  <Link
                    key={image.id}
                    href={`/photo/${titleToSlug(image.title)}`}
                    className="group cursor-pointer block relative overflow-hidden"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={800}
                      height={800}
                      sizes="25vw"
                      className="w-full h-auto block"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-light tracking-wide px-6 text-center">
                        {image.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={observerRef} className="h-20 w-full" />

        {visibleCount < galleryImages.length && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading more...</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Denis Pek. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
