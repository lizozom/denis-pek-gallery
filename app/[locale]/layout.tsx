import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Locale, locales } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale);

  return {
    title: {
      default: t.siteTitle,
      template: `%s | ${t.siteTitle}`,
    },
    description: t.metaDescription,
    keywords: t.metaKeywords.split(', '),
    authors: [{ name: "Denis Pek" }],
    creator: "Denis Pek",
    openGraph: {
      type: "website",
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      url: "https://denispek.com",
      siteName: t.siteTitle,
      title: t.siteTitle,
      description: t.metaDescription,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t.siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.siteTitle,
      description: t.metaDescription,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const dir = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
