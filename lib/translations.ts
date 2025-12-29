import { Locale } from './i18n';

export const translations = {
  en: {
    siteTitle: 'Denis Pek Gallery',
    siteDescription: 'Exploring the world through the lens',
    metaDescription: 'Professional photography gallery showcasing the work of Denis Pek. Explore stunning photographs across various categories.',
    metaKeywords: 'photography, gallery, Denis Pek, photos, art, portfolio',
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
    siteTitle: 'גלריית דניס פק',
    siteDescription: 'חוקרים את העולם דרך העדשה',
    metaDescription: 'גלריית צילום מקצועית המציגה את עבודתו של דניס פק. גלו תצלומים מדהימים בקטגוריות שונות.',
    metaKeywords: 'צילום, גלריה, דניס פק, תמונות, אמנות, תיק עבודות',
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
