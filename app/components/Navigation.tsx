'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import LanguageToggle from './LanguageToggle';
import { useState } from 'react';

interface NavigationProps {
  locale: Locale;
  showHeader?: boolean;
}

export default function Navigation({ locale, showHeader = false }: NavigationProps) {
  const pathname = usePathname();
  const t = getTranslations(locale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Left side: Title and Subtitle */}
          {showHeader ? (
            <div className="flex-1 min-w-0">
              <Link href={`/${locale}`} className="group block">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight group-hover:text-gray-600 transition-colors">
                  {t.siteTitle}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {t.siteDescription}
                </p>
              </Link>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <Link
                href={`/${locale}`}
                className="group flex items-center gap-3"
              >
                <div className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors tracking-tight">
                  {t.siteTitle}
                </div>
              </Link>
            </div>
          )}

          {/* Right side: Navigation */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-4">
              <Link
                href={`/${locale}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isHomePage
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t.nav.gallery}
              </Link>

              <Link
                href={`/${locale}/about`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === `/${locale}/about`
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t.nav.about}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === `/${locale}/contact`
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t.nav.contact}
              </Link>

              <LanguageToggle currentLocale={locale} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageToggle currentLocale={locale} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 mt-4 pt-4">
            <div className="space-y-1">
              <Link
                href={`/${locale}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isHomePage
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t.nav.gallery}
              </Link>

              <Link
                href={`/${locale}/about`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === `/${locale}/about`
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t.nav.about}
              </Link>

              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === `/${locale}/contact`
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
