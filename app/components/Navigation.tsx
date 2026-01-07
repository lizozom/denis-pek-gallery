'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';

interface NavigationProps {
  locale: Locale;
  variant?: 'transparent' | 'solid';
}

export default function Navigation({ locale, variant = 'transparent' }: NavigationProps) {
  const t = getTranslations(locale);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // For transparent variant, detect scroll. For solid, always show solid background.
  const isSolid = variant === 'solid' || isScrolled;

  useEffect(() => {
    if (variant === 'solid') return; // No scroll detection needed for solid variant

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'he' : 'en';
    const newDir = newLocale === 'he' ? 'rtl' : 'ltr';
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLocale;

    // Get current path and replace locale
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|he)/, '');
    const hash = window.location.hash;
    window.location.href = `/${newLocale}${pathWithoutLocale}${hash}`;
  };

  // For transparent variant on home page, use smooth scroll
  // For solid variant (detail pages), use regular links
  const isHomePage = variant === 'transparent';

  // Nav link styles - white text on hero, dark text when scrolled
  const navLinkClass = `text-sm font-medium tracking-wider transition-colors ${
    isSolid
      ? 'text-gray-600 hover:text-gray-900'
      : 'text-white/70 hover:text-white'
  }`;

  // Logo styles - hidden on hero (transparent), visible when scrolled (dark text)
  // Use font-display with italic, always in English
  const logoClass = `text-2xl font-light tracking-wide transition-all duration-300 font-display ${
    isSolid
      ? 'opacity-100 text-gray-900'
      : 'opacity-0 pointer-events-none'
  }`;

  // Mobile menu button styles
  const mobileButtonClass = `p-2 transition-colors ${
    isSolid ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'
  }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-white/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - hidden on hero, visible when scrolled, always in English */}
          {isHomePage ? (
            <button onClick={() => scrollToSection('hero')} className={logoClass}>
              Denis Pekerman
            </button>
          ) : (
            <Link href={`/${locale}`} className={logoClass}>
              Denis Pekerman
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <button onClick={() => scrollToSection('hero')} className={navLinkClass}>
                  {t.nav.home}
                </button>
                <button onClick={() => scrollToSection('about')} className={navLinkClass}>
                  {t.nav.about}
                </button>
                <button onClick={() => scrollToSection('contact')} className={navLinkClass}>
                  {t.nav.contact}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}`} className={navLinkClass}>
                  {t.nav.home}
                </Link>
                <Link href={`/${locale}#about`} className={navLinkClass}>
                  {t.nav.about}
                </Link>
                <Link href={`/${locale}#contact`} className={navLinkClass}>
                  {t.nav.contact}
                </Link>
              </>
            )}

            {/* Language Toggle */}
            <button onClick={toggleLanguage} className={navLinkClass}>
              {locale === 'en' ? 'עב' : 'EN'}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className={navLinkClass}>
              {locale === 'en' ? 'עב' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={mobileButtonClass}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 ${
            isSolid
              ? 'bg-white/95 backdrop-blur-sm border-gray-200'
              : 'bg-gray-900/95 backdrop-blur-sm border-white/10'
          }`}>
            <div className="flex flex-col gap-4">
              {isHomePage ? (
                <>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className={`text-sm font-medium tracking-wider px-4 py-2 text-left ${
                      isSolid ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t.nav.home}
                  </button>
                  <button
                    onClick={() => scrollToSection('about')}
                    className={`text-sm font-medium tracking-wider px-4 py-2 text-left ${
                      isSolid ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t.nav.about}
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className={`text-sm font-medium tracking-wider px-4 py-2 text-left ${
                      isSolid ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t.nav.contact}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wider px-4 py-2"
                  >
                    {t.nav.home}
                  </Link>
                  <Link
                    href={`/${locale}#about`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wider px-4 py-2"
                  >
                    {t.nav.about}
                  </Link>
                  <Link
                    href={`/${locale}#contact`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wider px-4 py-2"
                  >
                    {t.nav.contact}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
