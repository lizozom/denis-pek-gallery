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
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-light text-gray-900 tracking-tight ${isEnglish ? 'italic' : ''} mb-4`}>
            {t.about.title}
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto" />
        </div>

        {/* Bio */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.about.bio}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Expertise */}
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6 tracking-wide uppercase">
              {t.about.expertise.title}
            </h3>
            <ul className="space-y-4">
              {t.about.expertise.areas.map((area, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clients */}
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6 tracking-wide uppercase">
              {t.about.clients.title}
            </h3>
            <ul className="space-y-4">
              {t.about.clients.types.map((type, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span>{type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
