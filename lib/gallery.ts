import { getGalleryPhotos } from './db';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  hero_eligible?: boolean;
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fallback images if database is unavailable
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

/**
 * Fetches gallery images from Vercel Postgres database
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const photos = await getGalleryPhotos();

    if (photos.length > 0) {
      return photos;
    }

    // Fallback to default images if database is empty
    console.warn('Using fallback images - database returned no photos');
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
