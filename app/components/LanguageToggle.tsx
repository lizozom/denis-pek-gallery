"use client";

import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";

export default function LanguageToggle({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale: Locale = currentLocale === 'en' ? 'he' : 'en';
    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(/^\/(en|he)/, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Toggle language"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    </button>
  );
}
