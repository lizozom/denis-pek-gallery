import { redirect } from "next/navigation";
import { Locale } from "@/lib/i18n";

interface ContactProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ContactPage({ params }: ContactProps) {
  const { locale } = await params as { locale: Locale };

  // Redirect to home page contact section (SPA)
  redirect(`/${locale}#contact`);
}
