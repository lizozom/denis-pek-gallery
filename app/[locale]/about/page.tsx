import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Link from "next/link";

interface AboutProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AboutPage({ params }: AboutProps) {
  const { locale } = await params as { locale: Locale };
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation locale={locale} showHeader={false} />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              {t.about.title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.about.subtitle}
            </p>
          </div>

          {/* Bio Section */}
          <div className="prose prose-lg max-w-none mb-12 sm:mb-16">
            <p className="text-lg text-gray-700 leading-relaxed">
              {t.about.bio}
            </p>
          </div>

          {/* Two Column Layout for Expertise and Clients */}
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Expertise */}
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t.about.expertise.title}
              </h2>
              <ul className="space-y-3">
                {t.about.expertise.areas.map((area, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <svg
                      className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clients */}
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t.about.clients.title}
              </h2>
              <ul className="space-y-3">
                {t.about.clients.types.map((type, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <svg
                      className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {t.contact.subtitle}
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {locale === 'he'
                  ? 'מעוניינים בפרויקט צילום? בואו נדבר על הצרכים שלכם.'
                  : "Interested in a photography project? Let's discuss your needs."}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t.nav.contact}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={locale === 'he' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}

export async function generateMetadata({ params }: AboutProps) {
  const { locale } = await params as { locale: Locale };
  const t = getTranslations(locale);

  return {
    title: t.about.title,
    description: t.about.bio,
  };
}
