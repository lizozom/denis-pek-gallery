import { getGalleryPhotos } from './db';

export type MatColor = 'none' | 'black' | 'white';
export type MatThickness = 'none' | 'thin' | 'medium' | 'thick';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  hero_eligible?: boolean;
  passepartout_color?: MatColor;
  passepartout_thickness?: MatThickness;
  frame_color?: MatColor;
  frame_thickness?: MatThickness;
}

const PASSEPARTOUT_PX: Record<string, number> = {
  thin: 8,
  medium: 16,
  thick: 32,
};

const FRAME_PX: Record<string, number> = {
  thin: 2,
  medium: 4,
  thick: 8,
};

const COLOR_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#e6e6e6',
};

export function getFrameStyles(image: GalleryImage): React.CSSProperties | null {
  const hasPassepartout =
    image.passepartout_color && image.passepartout_color !== 'none' &&
    image.passepartout_thickness && image.passepartout_thickness !== 'none';
  const hasFrame =
    image.frame_color && image.frame_color !== 'none' &&
    image.frame_thickness && image.frame_thickness !== 'none';

  if (!hasPassepartout && !hasFrame) return null;

  const styles: React.CSSProperties = {};

  if (hasPassepartout) {
    styles.padding = `${PASSEPARTOUT_PX[image.passepartout_thickness!]}px`;
    styles.backgroundColor = COLOR_MAP[image.passepartout_color!];
  }

  if (hasFrame) {
    styles.border = `${FRAME_PX[image.frame_thickness!]}px solid ${COLOR_MAP[image.frame_color!]}`;
  }

  return styles;
}

/**
 * Like getFrameStyles but colors transition from transparent.
 * Padding/border widths are always set (for stable sizing); colors depend on `visible`.
 */
export function getFrameStylesAnimated(image: GalleryImage, visible: boolean): React.CSSProperties | null {
  const hasPassepartout =
    image.passepartout_color && image.passepartout_color !== 'none' &&
    image.passepartout_thickness && image.passepartout_thickness !== 'none';
  const hasFrame =
    image.frame_color && image.frame_color !== 'none' &&
    image.frame_thickness && image.frame_thickness !== 'none';

  if (!hasPassepartout && !hasFrame) return null;

  const styles: React.CSSProperties = {
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  };

  if (hasPassepartout) {
    styles.padding = `${PASSEPARTOUT_PX[image.passepartout_thickness!]}px`;
    styles.backgroundColor = visible ? COLOR_MAP[image.passepartout_color!] : 'transparent';
  }

  if (hasFrame) {
    const px = FRAME_PX[image.frame_thickness!];
    const color = visible ? COLOR_MAP[image.frame_color!] : 'transparent';
    styles.border = `${px}px solid ${color}`;
  }

  return styles;
}

/**
 * Returns total inset (passepartout + frame thickness) in pixels.
 */
export function getFrameInset(image: GalleryImage): number {
  let inset = 0;
  if (image.passepartout_color && image.passepartout_color !== 'none' &&
      image.passepartout_thickness && image.passepartout_thickness !== 'none') {
    inset += PASSEPARTOUT_PX[image.passepartout_thickness];
  }
  if (image.frame_color && image.frame_color !== 'none' &&
      image.frame_thickness && image.frame_thickness !== 'none') {
    inset += FRAME_PX[image.frame_thickness];
  }
  return inset;
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
