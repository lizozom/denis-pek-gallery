/**
 * Initializes the gallery configuration in Vercel Blob storage
 * Run with: npx tsx scripts/init-gallery-blob.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { galleryImages } from '../lib/gallery';
import { initializeGalleryConfig } from '../lib/gallery-storage';

async function main() {
  console.log('Initializing gallery configuration in Vercel Blob...');
  console.log(`Found ${galleryImages.length} images to upload`);

  const config = await initializeGalleryConfig(galleryImages);

  console.log('\n✓ Gallery configuration initialized successfully!');
  console.log(`Version: ${config.version}`);
  console.log(`Last Updated: ${config.lastUpdated}`);
  console.log(`Total Images: ${config.images.length}`);
}

main().catch((error) => {
  console.error('Error initializing gallery:', error);
  process.exit(1);
});
