import { put, list } from '@vercel/blob';
import type { GalleryImage } from './gallery';

const GALLERY_CONFIG_FILENAME = 'gallery-config.json';

export interface GalleryConfig {
  images: GalleryImage[];
  version: number;
  lastUpdated: string;
}

/**
 * Fetches the gallery configuration from Vercel Blob storage
 */
export async function getGalleryConfig(): Promise<GalleryConfig | null> {
  try {
    // List blobs to find our config file
    const { blobs } = await list({ prefix: GALLERY_CONFIG_FILENAME });

    if (blobs.length === 0) {
      console.log('Gallery config not found in blob storage');
      return null;
    }

    // Fetch the blob content
    const response = await fetch(blobs[0].url);

    if (!response.ok) {
      console.log('Failed to fetch gallery config');
      return null;
    }

    const config: GalleryConfig = await response.json();
    return config;
  } catch (error) {
    console.error('Error fetching gallery config from blob:', error);
    return null;
  }
}

/**
 * Saves the gallery configuration to Vercel Blob storage
 */
export async function saveGalleryConfig(config: GalleryConfig): Promise<boolean> {
  try {
    const blob = await put(GALLERY_CONFIG_FILENAME, JSON.stringify(config, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Gallery config saved to blob:', blob.url);
    return true;
  } catch (error) {
    console.error('Error saving gallery config to blob:', error);
    return false;
  }
}

/**
 * Initializes the gallery config with default data if it doesn't exist
 */
export async function initializeGalleryConfig(defaultImages: GalleryImage[]): Promise<GalleryConfig> {
  const existingConfig = await getGalleryConfig();

  if (existingConfig) {
    return existingConfig;
  }

  // Create new config
  const newConfig: GalleryConfig = {
    images: defaultImages,
    version: 1,
    lastUpdated: new Date().toISOString(),
  };

  await saveGalleryConfig(newConfig);
  return newConfig;
}

/**
 * Adds a new image to the gallery
 */
export async function addGalleryImage(image: Omit<GalleryImage, 'id'>): Promise<GalleryImage | null> {
  try {
    const config = await getGalleryConfig();

    if (!config) {
      console.error('Gallery config not found');
      return null;
    }

    // Generate new ID
    const newId = config.images.length > 0
      ? Math.max(...config.images.map(img => img.id)) + 1
      : 1;

    const newImage: GalleryImage = {
      ...image,
      id: newId,
    };

    config.images.push(newImage);
    config.version += 1;
    config.lastUpdated = new Date().toISOString();

    await saveGalleryConfig(config);
    return newImage;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return null;
  }
}

/**
 * Updates an existing image in the gallery
 */
export async function updateGalleryImage(id: number, updates: Partial<GalleryImage>): Promise<boolean> {
  try {
    const config = await getGalleryConfig();

    if (!config) {
      console.error('Gallery config not found');
      return false;
    }

    const imageIndex = config.images.findIndex(img => img.id === id);

    if (imageIndex === -1) {
      console.error('Image not found:', id);
      return false;
    }

    config.images[imageIndex] = {
      ...config.images[imageIndex],
      ...updates,
      id, // Ensure ID doesn't change
    };

    config.version += 1;
    config.lastUpdated = new Date().toISOString();

    await saveGalleryConfig(config);
    return true;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return false;
  }
}

/**
 * Deletes an image from the gallery
 */
export async function deleteGalleryImage(id: number): Promise<boolean> {
  try {
    const config = await getGalleryConfig();

    if (!config) {
      console.error('Gallery config not found');
      return false;
    }

    const imageIndex = config.images.findIndex(img => img.id === id);

    if (imageIndex === -1) {
      console.error('Image not found:', id);
      return false;
    }

    config.images.splice(imageIndex, 1);
    config.version += 1;
    config.lastUpdated = new Date().toISOString();

    await saveGalleryConfig(config);
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }
}

/**
 * Reorders gallery images based on an array of IDs
 */
export async function reorderGalleryImages(newOrder: number[]): Promise<boolean> {
  try {
    const config = await getGalleryConfig();

    if (!config) {
      console.error('Gallery config not found');
      return false;
    }

    // Reorder images based on ID array
    const reorderedImages = newOrder
      .map(id => config.images.find(img => img.id === id))
      .filter((img): img is GalleryImage => img !== undefined);

    // Verify all images were found
    if (reorderedImages.length !== config.images.length) {
      console.error('Reorder failed: not all images were found in new order');
      return false;
    }

    config.images = reorderedImages;
    config.version += 1;
    config.lastUpdated = new Date().toISOString();

    await saveGalleryConfig(config);
    return true;
  } catch (error) {
    console.error('Error reordering gallery images:', error);
    return false;
  }
}
