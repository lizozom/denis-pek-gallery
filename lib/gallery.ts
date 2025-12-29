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

// Generate a large set of images for infinite scroll with varied aspect ratios
const categories = ["Landscape", "Portrait", "Urban", "Nature"];
const imageCount = 50;

// Different aspect ratios for variety
const aspectRatios = [
  { width: 800, height: 1200 }, // Portrait 2:3
  { width: 800, height: 600 },  // Landscape 4:3
  { width: 800, height: 800 },  // Square 1:1
  { width: 800, height: 1000 }, // Portrait 4:5
  { width: 800, height: 500 },  // Wide landscape 16:10
  { width: 800, height: 1400 }, // Tall portrait 4:7
];

export const galleryImages: GalleryImage[] = Array.from({ length: imageCount }, (_, i) => {
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

export function getImageBySlug(slug: string): GalleryImage | undefined {
  return galleryImages.find(image => titleToSlug(image.title) === slug);
}
