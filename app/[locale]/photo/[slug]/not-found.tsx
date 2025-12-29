"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'he';
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t.photo.notFoundTitle}
        </h2>
        <p className="text-gray-600 mb-8">
          {t.photo.notFoundDescription}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          {t.photo.backToGallery}
        </Link>
      </div>
    </div>
  );
}
