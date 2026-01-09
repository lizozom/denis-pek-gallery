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

/**
 * Fetches gallery images from Vercel Postgres database
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    return await getGalleryPhotos();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

// Export for backwards compatibility
export const galleryImages: GalleryImage[] = [];

export async function getImageBySlug(slug: string): Promise<GalleryImage | undefined> {
  const images = await getGalleryImages();
  return images.find(image => titleToSlug(image.title) === slug);
}
