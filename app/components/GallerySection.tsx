'use client';

import { GalleryImage } from '@/lib/gallery';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import GalleryClient from '@/app/[locale]/components/GalleryClient';

interface GallerySectionProps {
  images: GalleryImage[];
  locale: Locale;
}

export default function GallerySection({ images, locale }: GallerySectionProps) {
  const t = getTranslations(locale);

  return (
    <section id="gallery" style={{ background: 'transparent' }}>
      {/* Hero-style heading — centered in viewport */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight font-heading mb-4">
            Denis Pekerman
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto" />
        </div>
      </div>

      {/* Gallery Grid - full width */}
      <GalleryClient images={images} locale={locale} />
    </section>
  );
}
