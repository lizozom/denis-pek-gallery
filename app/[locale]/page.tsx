import { Locale } from "@/lib/i18n";
import { getGalleryImages } from "@/lib/gallery";
import { getHeroPhoto } from "@/lib/db";
import Navigation from "@/app/components/Navigation";
import HeroSection from "@/app/components/HeroSection";
import GallerySection from "@/app/components/GallerySection";
import AboutSection from "@/app/components/AboutSection";
import ContactSection from "@/app/components/ContactSection";
import Footer from "@/app/components/Footer";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params as { locale: Locale };

  // Fetch images and hero photo from database
  const [images, heroImage] = await Promise.all([
    getGalleryImages(),
    getHeroPhoto(),
  ]);

  return (
    <div className="min-h-screen">
      <Navigation locale={locale} />

      <main>
        {/* Hero Section */}
        <HeroSection locale={locale} heroImageUrl={heroImage?.src} />

        {/* Gallery Section */}
        <GallerySection images={images} locale={locale} />

        {/* About Section */}
        <AboutSection locale={locale} />

        {/* Contact Section */}
        <ContactSection locale={locale} />
      </main>

      <Footer locale={locale} />
    </div>
  );
}
