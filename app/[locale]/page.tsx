import { Locale } from "@/lib/i18n";
import { getGalleryImages } from "@/lib/gallery";
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

  // Fetch images from database
  const images = await getGalleryImages();

  // Use the first image as hero background, or fallback
  const heroImage = images.length > 0 ? images[0] : null;

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
