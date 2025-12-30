/**
 * Site Configuration
 * Central configuration for the Denis Pekerman Photography Gallery
 */

export const SITE_CONFIG = {
  name: 'Denis Pekerman Photography',
  title: 'Denis Pekerman - Architectural Photographer',
  description: 'Professional architectural photography in Israel. Specializing in capturing stunning architectural designs, interior spaces, and real estate photography.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://denispekerman.com',
  locale: {
    default: 'en',
    supported: ['en', 'he'] as const,
  },
  author: {
    name: 'Denis Pekerman',
    email: 'contact@denispekerman.com',
  },
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/denis.pek.architecture/',
  facebook: 'https://facebook.com/denispekerman',
  behance: 'https://behance.net/denispekerman',
} as const;

export const SEO_CONFIG = {
  en: {
    keywords: [
      'architectural photographer',
      'architectural photography Israel',
      'interior photography',
      'real estate photography',
      'commercial photography',
      'building photography',
      'architecture photographer Tel Aviv',
      'professional architectural photos',
      'Denis Pekerman',
      'abstract photographer',
      'artistic photographer',
    ],
    siteName: 'Denis Pekerman Photography',
    ogTitle: 'Denis Pekerman - Professional Architectural Photographer in Israel',
    ogDescription: 'Capturing the beauty of architectural design through professional photography. Specializing in architectural, interior, and real estate photography across Israel.',
  },
  he: {
    keywords: [
      'צלם אדריכלות',
      'צילום אדריכלות ישראל',
      'צילום פנים',
      'צילום נדלן',
      'צילום מסחרי',
      'צילום בניינים',
      'צלם אדריכלות תל אביב',
      'צילום אדריכלות מקצועי',
      'דניס פקרמן',
      'צלם אבסטרקטי',
      'צלם אמנותי',
    ],
    siteName: 'דניס פקרמן צילום',
    ogTitle: 'דניס פקרמן - צלם אדריכלות מקצועי בישראל',
    ogDescription: 'לכידת היופי של עיצוב אדריכלי באמצעות צילום מקצועי. מתמחה בצילום אדריכלות, פנים ונדלן ברחבי ישראל.',
  },
} as const;
