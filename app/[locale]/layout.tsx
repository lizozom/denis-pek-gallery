import type { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { SITE_CONFIG } from "@/lib/config";
import { generateOrganizationSchema } from "@/lib/schema";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const t = getTranslations(locale);

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: t.siteTitle,
      template: `%s | ${t.siteTitle}`,
    },
    description: t.metaDescription,
    keywords: t.metaKeywords.split(', '),
    authors: [{ name: SITE_CONFIG.author.name }],
    creator: SITE_CONFIG.author.name,
    openGraph: {
      type: "website",
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      url: SITE_CONFIG.url,
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
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'he': '/he',
        'x-default': '/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  );
}
