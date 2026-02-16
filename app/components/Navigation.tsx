'use client';

import { useEffect, useState, useCallback } from 'react';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';

interface NavigationProps {
  locale: Locale;
  variant?: 'transparent' | 'solid';
}

function interpolateColor(scrollY: number): string {
  // Gradually shift from current color to #E0DEDE over 600px of scrolling
  const progress = Math.min(scrollY / 600, 1);
  const target = { r: 224, g: 222, b: 222 }; // #E0DEDE

  // Start colors: white (transparent) or gray-600 (solid)
  // We'll interpolate from white since the hero starts transparent
  const start = { r: 255, g: 255, b: 255 };

  const r = Math.round(start.r + (target.r - start.r) * progress);
  const g = Math.round(start.g + (target.g - start.g) * progress);
  const b = Math.round(start.b + (target.b - start.b) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function Navigation({ locale, variant = 'transparent' }: NavigationProps) {
  const t = getTranslations(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [textColor, setTextColor] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const isSolid = variant === 'solid' || scrollProgress > 0;

  useEffect(() => {
    if (variant === 'solid') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollProgress(Math.min(scrollY / 400, 1));
      setTextColor(interpolateColor(scrollY));
    };

    handleScroll(); // set initial
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'he' : 'en';
    const newDir = newLocale === 'he' ? 'rtl' : 'ltr';
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLocale;

    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|he)/, '');
    const hash = window.location.hash;
    window.location.href = `/${newLocale}${pathWithoutLocale}${hash}`;
  };

  const isHomePage = variant === 'transparent';

  const logoClass = `text-2xl font-light tracking-wide font-heading ${
    variant === 'solid' ? 'opacity-100' : ''
  } ${scrollProgress === 0 ? 'pointer-events-none' : ''}`;

  // Hamburger button style
  const hamburgerClass = `p-2 transition-colors`;

  // Language toggle style
  const langClass = `text-sm font-medium tracking-wider transition-colors`;

  const renderNavLinks = useCallback(() => {
    const linkClass = 'text-sm font-medium tracking-wider px-4 py-3 text-left transition-colors hover:bg-white/10';

    if (isHomePage) {
      return (
        <>
          <button onClick={() => scrollToSection('hero')} className={linkClass}>
            {t.nav.home}
          </button>
          <button onClick={() => scrollToSection('about')} className={linkClass}>
            {t.nav.about}
          </button>
          <button onClick={() => scrollToSection('contact')} className={linkClass}>
            {t.nav.contact}
          </button>
        </>
      );
    }

    return (
      <>
        <Link href={`/${locale}`} onClick={() => setMenuOpen(false)} className={linkClass}>
          {t.nav.home}
        </Link>
        <Link href={`/${locale}#about`} onClick={() => setMenuOpen(false)} className={linkClass}>
          {t.nav.about}
        </Link>
        <Link href={`/${locale}#contact`} onClick={() => setMenuOpen(false)} className={linkClass}>
          {t.nav.contact}
        </Link>
      </>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHomePage, locale, t]);

  const dynamicStyle = variant === 'transparent' && textColor ? { color: textColor } : undefined;

  const logoStyle = variant === 'transparent'
    ? { ...dynamicStyle, opacity: Math.max(0, (scrollProgress - 0.85) / 0.15) }
    : undefined;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[65]"
      style={variant === 'transparent' ? {
        backgroundColor: `rgba(255, 255, 255, ${0.2 * scrollProgress})`,
        backdropFilter: `blur(${12 * scrollProgress}px)`,
        WebkitBackdropFilter: `blur(${12 * scrollProgress}px)`,
        boxShadow: scrollProgress > 0.1 ? `0 1px 3px rgba(0,0,0,${0.1 * scrollProgress})` : 'none',
      } : {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          {isHomePage ? (
            <button onClick={() => scrollToSection('hero')} className={logoClass} style={logoStyle}>
              Denis Pekerman
            </button>
          ) : (
            <Link href={`/${locale}`} className={logoClass}>
              Denis Pekerman
            </Link>
          )}

          {/* Right side: language toggle + hamburger */}
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className={langClass} style={dynamicStyle}>
              {locale === 'en' ? 'עב' : 'EN'}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={hamburgerClass}
              style={dynamicStyle}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
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

      </div>

      {/* Dropdown Menu — positioned absolutely so it doesn't push the toolbar down */}
      {menuOpen && (
        <div
          className="absolute end-6 lg:end-8 mt-0 w-36 rounded-md overflow-hidden backdrop-blur-md"
          style={{
            backgroundColor: isSolid ? 'rgba(255,255,255,0.1)' : 'rgba(17,24,39,0.15)',
            color: dynamicStyle?.color || (isSolid ? '#4b5563' : 'rgba(255,255,255,0.8)'),
          }}
        >
          <div className="flex flex-col divide-y divide-black/30">
            {renderNavLinks()}
          </div>
        </div>
      )}
    </header>
  );
}
