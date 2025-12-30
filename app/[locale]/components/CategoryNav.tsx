'use client';

import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface CategoryNavProps {
  locale: Locale;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

const CATEGORIES = ['all', 'Landscape', 'Portrait', 'Urban', 'Nature'];

export default function CategoryNav({
  locale,
  selectedCategory,
  onCategoryChange,
  categoryCounts = {}
}: CategoryNavProps) {
  const t = getTranslations(locale);

  const getCategoryLabel = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'all':
        return t.nav.all;
      case 'landscape':
        return t.nav.landscape;
      case 'portrait':
        return t.nav.portrait;
      case 'urban':
        return t.nav.urban;
      case 'nature':
        return t.nav.nature;
      default:
        return category;
    }
  };

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-[104px] sm:top-[96px] z-10">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <ul className="flex gap-4 sm:gap-8 py-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const count = category === 'all'
              ? Object.values(categoryCounts).reduce((sum, c) => sum + c, 0)
              : categoryCounts[category] || 0;

            return (
              <li key={category} className="flex-shrink-0">
                <button
                  onClick={() => onCategoryChange(category)}
                  className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                    isActive
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {getCategoryLabel(category)}
                  {count > 0 && (
                    <span className={`ml-2 text-xs ${
                      isActive ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      ({count})
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
