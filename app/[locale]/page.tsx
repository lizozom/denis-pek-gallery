import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation locale={locale} showHeader={true} />

      <main className="flex-grow">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <GalleryClient images={images} locale={locale} />
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
