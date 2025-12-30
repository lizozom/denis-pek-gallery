import { Locale } from './i18n';

export const translations = {
  en: {
    siteTitle: 'Denis Pekerman - Architectural Photographer Israel',
    siteDescription: 'Professional Architectural Photography in Israel',
    metaDescription: 'Professional architectural photographer in Israel specializing in stunning architectural designs, interior spaces, and real estate photography. Serving Tel Aviv and across Israel.',
    metaKeywords: 'architectural photographer Israel, architectural photography Tel Aviv, interior photography, real estate photography Israel, commercial photography, building photography, architecture photographer, professional architectural photos, Denis Pekerman photographer',
    nav: {
      all: 'All',
      landscape: 'Landscape',
      portrait: 'Portrait',
      urban: 'Urban',
      nature: 'Nature',
    },
    footer: {
      copyright: 'All rights reserved.',
    },
    loading: 'Loading more...',
    notFound: {
      title: 'Photo Not Found',
      description: 'The photo you are looking for does not exist.',
      backToGallery: 'Back to Gallery',
    },
    photo: {
      backToGallery: 'Back to Gallery',
      details: 'Details',
      category: 'Category',
      photographer: 'Photographer',
      moreFrom: 'More from',
      notFoundTitle: 'Photo Not Found',
      notFoundDescription: "Sorry, we couldn't find the photo you're looking for.",
    },
  },
  he: {
    siteTitle: 'דניס פקרמן - צלם אדריכלות בישראל',
    siteDescription: 'צילום אדריכלות מקצועי בישראל',
    metaDescription: 'צלם אדריכלות מקצועי בישראל המתמחה בצילום עיצובים אדריכליים מרהיבים, צילום פנים וצילום נדלן. משרת את תל אביב וכל רחבי ישראל.',
    metaKeywords: 'צלם אדריכלות ישראל, צילום אדריכלות תל אביב, צילום פנים, צילום נדלן ישראל, צילום מסחרי, צילום בניינים, צלם אדריכלות מקצועי, דניס פקרמן צלם, צילום אדריכלי מקצועי',
    nav: {
      all: 'הכל',
      landscape: 'נוף',
      portrait: 'פורטרט',
      urban: 'עירוני',
      nature: 'טבע',
    },
    footer: {
      copyright: 'כל הזכויות שמורות.',
    },
    loading: 'טוען עוד...',
    notFound: {
      title: 'התמונה לא נמצאה',
      description: 'התמונה שאתה מחפש אינה קיימת.',
      backToGallery: 'חזרה לגלריה',
    },
    photo: {
      backToGallery: 'חזרה לגלריה',
      details: 'פרטים',
      category: 'קטגוריה',
      photographer: 'צלם',
      moreFrom: 'עוד מ',
      notFoundTitle: 'התמונה לא נמצאה',
      notFoundDescription: 'מצטערים, לא הצלחנו למצוא את התמונה שאתה מחפש.',
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
