import { getGalleryConfig } from './gallery-storage';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fallback images if blob storage is unavailable
const categories = ["Landscape", "Portrait", "Urban", "Nature"];
const imageCount = 50;
const aspectRatios = [
  { width: 800, height: 1200 },
  { width: 800, height: 600 },
  { width: 800, height: 800 },
  { width: 800, height: 1000 },
  { width: 800, height: 500 },
  { width: 800, height: 1400 },
];

const fallbackImages: GalleryImage[] = Array.from({ length: imageCount }, (_, i) => {
  const id = i + 1;
  const category = categories[i % categories.length];
  const aspectRatio = aspectRatios[i % aspectRatios.length];

  return {
    id,
    src: `https://picsum.photos/seed/img${id}/${aspectRatio.width}/${aspectRatio.height}`,
    alt: `${category} photography ${id}`,
    title: `Photo ${id}`,
    category,
  };
});

// Cache for gallery images
let cachedImages: GalleryImage[] | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches gallery images from Vercel Blob storage with caching
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  // Return cached images if still valid
  if (cachedImages && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedImages;
  }

  try {
    const config = await getGalleryConfig();

    if (config && config.images.length > 0) {
      cachedImages = config.images;
      cacheTime = Date.now();
      return config.images;
    }

    // Fallback to default images
    console.warn('Using fallback images - blob storage returned empty config');
    return fallbackImages;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return fallbackImages;
  }
}

// Export for backwards compatibility and server-side rendering
export const galleryImages = fallbackImages;

export async function getImageBySlug(slug: string): Promise<GalleryImage | undefined> {
  const images = await getGalleryImages();
  return images.find(image => titleToSlug(image.title) === slug);
}
