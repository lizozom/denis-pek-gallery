import { Locale } from "@/lib/i18n";
import { getGalleryImages } from "@/lib/gallery";
import Navigation from "@/app/components/Navigation";
import ParallaxBackground from "@/app/components/ParallaxBackground";
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

  const images = await getGalleryImages();

  return (
    <div className="min-h-screen relative">
      <ParallaxBackground />
      <Navigation locale={locale} />

      <main>
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
