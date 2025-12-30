import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import ContactForm from "./components/ContactForm";

interface ContactProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ContactPage({ params }: ContactProps) {
  const { locale } = await params as { locale: Locale };
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation locale={locale} showHeader={false} />

      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              {t.contact.title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.contact.subtitle}
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm locale={locale} />
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}

export async function generateMetadata({ params }: ContactProps) {
  const { locale } = await params as { locale: Locale };
  const t = getTranslations(locale);

  return {
    title: t.contact.title,
    description: t.contact.subtitle,
  };
}
