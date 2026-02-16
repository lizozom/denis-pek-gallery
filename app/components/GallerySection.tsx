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
  const isEnglish = locale === 'en';

  return (
    <section id="gallery" className="py-20 md:py-32" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl sm:text-5xl font-light text-gray-900 tracking-tight ${isEnglish ? 'italic' : ''} mb-4`}>
            {t.gallery.title}
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto" />
        </div>
      </div>

      {/* Gallery Grid - full width */}
      <GalleryClient images={images} locale={locale} />
    </section>
  );
}
