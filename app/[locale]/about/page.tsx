import { redirect } from "next/navigation";
import { Locale } from "@/lib/i18n";

interface AboutProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AboutPage({ params }: AboutProps) {
  const { locale } = await params as { locale: Locale };

  // Redirect to home page about section (SPA)
  redirect(`/${locale}#about`);
}
