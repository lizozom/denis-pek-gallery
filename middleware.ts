import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './lib/i18n';
import { auth } from './auth';

export default auth((request) => {
  const pathname = request.nextUrl.pathname;

  // Skip admin routes from i18n handling
  if (pathname.startsWith('/admin')) {
    // Check auth for admin routes (except login page)
    if (!pathname.startsWith('/admin/login') && !request.auth) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Redirect other paths to default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
});

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next|api|.*\\..*).*)',
  ],
};
