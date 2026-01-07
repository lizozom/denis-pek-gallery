'use client';

import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface HeroSectionProps {
  locale: Locale;
  heroImageUrl?: string;
}

export default function HeroSection({ locale, heroImageUrl }: HeroSectionProps) {
  const t = getTranslations(locale);

  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: heroImageUrl
            ? `url(${heroImageUrl})`
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Title - Serif font, always in English */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight font-serif font-weight-normal">
          Denis Pekerman
        </h1>

        {/* Subtitle - Sans-serif, wide tracking */}
        <p className="text-sm sm:text-base md:text-lg text-white/80 tracking-[0.3em]  uppercase mb-12">
          {t.siteDescription}
        </p>

        {/* View Gallery Button */}
        <button
          onClick={scrollToGallery}
          className="inline-flex items-center justify-center px-8 py-3 border border-white/50 text-white text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-300"
        >
          {t.hero.viewGallery}
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-px h-12 bg-white" />
      </div>
    </section>
  );
}
