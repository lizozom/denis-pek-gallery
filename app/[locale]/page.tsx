import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import LanguageToggle from "@/app/components/LanguageToggle";
import GalleryClient from "./components/GalleryClient";
import { getGalleryImages } from "@/lib/gallery";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params as { locale: Locale };
  const t = getTranslations(locale);

  // Fetch images from database
  const images = await getGalleryImages();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t.siteTitle}</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                {t.siteDescription}
              </p>
            </div>
            <LanguageToggle currentLocale={locale} />
          </div>
        </div>
      </header>

      <GalleryClient images={images} locale={locale} />

      <footer className="border-t border-gray-100 mt-16 bg-gray-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Denis Pek. {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
