'use client';

import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface AboutSectionProps {
  locale: Locale;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = getTranslations(locale);
  const isEnglish = locale === 'en';

  return (
    <section id="about" className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-light text-gray-900 tracking-tight ${isEnglish ? 'italic' : ''} mb-4`}>
            {t.about.title}
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto" />
        </div>

        {/* Bio */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-[#1A1A1A] leading-relaxed whitespace-pre-line font-heading">
            {t.about.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
