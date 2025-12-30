/**
 * Schema.org JSON-LD generators for SEO
 * Helps search engines understand the content structure
 */

import { SITE_CONFIG, SOCIAL_LINKS } from './config';
import type { GalleryImage } from './gallery';

/**
 * Generate Organization schema
 * Helps Google understand your business
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.behance,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.author.email,
      contactType: 'Customer Service',
    },
  };
}

/**
 * Generate LocalBusiness schema
 * Helps with local SEO in Israel
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.url}/logo.png`,
    url: SITE_CONFIG.url,
    telephone: '+972-XX-XXX-XXXX', // Update with real phone number
    email: SITE_CONFIG.author.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressRegion: 'Tel Aviv District',
      addressLocality: 'Tel Aviv',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '32.0853',
      longitude: '34.7818',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.behance,
    ],
  };
}

/**
 * Generate Person schema
 * For the photographer's professional profile
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}/denis-pekerman.jpg`,
    jobTitle: 'Architectural Photographer',
    description: 'Professional architectural photographer specializing in capturing stunning architectural designs, interior spaces, and real estate photography in Israel.',
    email: SITE_CONFIG.author.email,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.behance,
    ],
    knowsAbout: [
      'Architectural Photography',
      'Interior Photography',
      'Real Estate Photography',
      'Commercial Photography',
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'Photography School', // Update with actual education
    },
  };
}

/**
 * Generate ImageObject schema for a gallery photo
 * Helps Google Images understand the photo
 */
export function generateImageObjectSchema(photo: GalleryImage, locale: string = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${SITE_CONFIG.url}/photo/${photo.id}`,
    contentUrl: photo.src,
    url: `${SITE_CONFIG.url}/photo/${photo.id}`,
    name: photo.title,
    description: photo.alt,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
    },
    creator: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
    },
    copyrightHolder: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
    },
    creditText: SITE_CONFIG.author.name,
    keywords: photo.category,
    inLanguage: locale,
  };
}

/**
 * Generate BreadcrumbList schema
 * Helps Google understand the page hierarchy
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Generate ImageGallery schema
 * For the main gallery page
 */
export function generateImageGallerySchema(photos: GalleryImage[], locale: string = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
    },
    image: photos.slice(0, 10).map((photo) => ({
      '@type': 'ImageObject',
      contentUrl: photo.src,
      name: photo.title,
      description: photo.alt,
    })),
  };
}

/**
 * Generate ProfessionalService schema
 * For photography services
 */
export function generateProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_CONFIG.url}/#service`,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.url}/logo.png`,
    url: SITE_CONFIG.url,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: 'Tel Aviv',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Israel',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Photography Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Architectural Photography',
            description: 'Professional photography of buildings and architectural designs',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Interior Photography',
            description: 'Professional photography of interior spaces',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Real Estate Photography',
            description: 'Professional photography for real estate listings',
          },
        },
      ],
    },
  };
}
