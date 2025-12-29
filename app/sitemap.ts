import { MetadataRoute } from 'next'
import { galleryImages, titleToSlug } from '@/lib/gallery'
import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://denispek.com'
  const routes: MetadataRoute.Sitemap = []

  // Add locale-specific home pages
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    })

    // Add photo pages for each locale
    galleryImages.forEach((image) => {
      routes.push({
        url: `${baseUrl}/${locale}/photo/${titleToSlug(image.title)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  })

  return routes
}
