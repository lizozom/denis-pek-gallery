import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './lib/i18n';
import { auth } from './auth';

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!request.auth?.user;

  // Skip API routes entirely (including auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip admin routes from i18n handling
  if (pathname.startsWith('/admin')) {
    // Check auth for admin routes (except login page)
    if (!pathname.startsWith('/admin/login')) {
      if (!isLoggedIn) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Set the pathname header for the root layout to read
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
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
    // Match all paths except static files, _next, and api routes (except auth)
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/(?!auth)).*)',
    // Explicitly include auth API routes
    '/api/auth/:path*',
  ],
};
