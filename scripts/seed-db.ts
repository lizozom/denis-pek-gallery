#!/usr/bin/env tsx

/**
 * Database seeding script
 * Run with: npm run db:seed
 */

import dotenv from 'dotenv';
import { join } from 'path';
import { sql } from '@vercel/postgres';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

const samplePhotos = [
  // Landscape photos (7 total)
  {
    title: 'Mountain Sunrise',
    alt: 'Beautiful sunrise over mountain peaks',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/mountain1/800/1200',
  },
  {
    title: 'Coastal Sunset',
    alt: 'Sunset over the ocean with dramatic clouds',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/coast1/800/600',
  },
  {
    title: 'Desert Dunes',
    alt: 'Golden sand dunes at twilight',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/desert1/800/1000',
  },
  {
    title: 'Valley Vista',
    alt: 'Panoramic view of mountain valley',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/valley1/800/500',
  },
  {
    title: 'Lake Reflection',
    alt: 'Mountains reflecting in calm lake water',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/lake1/800/800',
  },
  {
    title: 'Canyon Sunset',
    alt: 'Deep canyon illuminated by setting sun',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/canyon1/800/1400',
  },
  {
    title: 'Rolling Hills',
    alt: 'Green hills under blue sky',
    category: 'Landscape',
    src: 'https://picsum.photos/seed/hills1/800/600',
  },

  // Urban photos (7 total)
  {
    title: 'Urban Nightscape',
    alt: 'City lights reflecting on wet streets',
    category: 'Urban',
    src: 'https://picsum.photos/seed/city1/800/600',
  },
  {
    title: 'Street Photography',
    alt: 'Candid moment on busy city street',
    category: 'Urban',
    src: 'https://picsum.photos/seed/street1/800/1200',
  },
  {
    title: 'Modern Architecture',
    alt: 'Contemporary building with glass facade',
    category: 'Urban',
    src: 'https://picsum.photos/seed/building1/800/1000',
  },
  {
    title: 'City Skyline',
    alt: 'Downtown skyline at dusk',
    category: 'Urban',
    src: 'https://picsum.photos/seed/skyline1/800/600',
  },
  {
    title: 'Urban Bridge',
    alt: 'Modern bridge architecture at night',
    category: 'Urban',
    src: 'https://picsum.photos/seed/bridge1/800/1200',
  },
  {
    title: 'Geometric Facade',
    alt: 'Abstract architectural patterns',
    category: 'Urban',
    src: 'https://picsum.photos/seed/facade1/800/800',
  },
  {
    title: 'Subway Station',
    alt: 'Modern metro station architecture',
    category: 'Urban',
    src: 'https://picsum.photos/seed/metro1/800/1000',
  },

  // Portrait photos (7 total)
  {
    title: 'Portrait in Golden Hour',
    alt: 'Portrait photograph during golden hour',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait1/800/800',
  },
  {
    title: 'Artistic Portrait',
    alt: 'Artistic portrait with creative lighting',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait2/800/1000',
  },
  {
    title: 'Studio Portrait',
    alt: 'Professional studio portrait with soft lighting',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait3/800/1200',
  },
  {
    title: 'Natural Light Portrait',
    alt: 'Portrait using natural window light',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait4/800/800',
  },
  {
    title: 'Urban Portrait',
    alt: 'Environmental portrait in city setting',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait5/800/1000',
  },
  {
    title: 'Black and White Portrait',
    alt: 'Classic monochrome portrait',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait6/800/1200',
  },
  {
    title: 'Creative Portrait',
    alt: 'Experimental portrait with dramatic angles',
    category: 'Portrait',
    src: 'https://picsum.photos/seed/portrait7/800/600',
  },

  // Nature photos (7 total)
  {
    title: 'Forest Path',
    alt: 'Winding path through dense forest',
    category: 'Nature',
    src: 'https://picsum.photos/seed/forest1/800/1000',
  },
  {
    title: 'Wildlife Close-up',
    alt: 'Close-up of wildlife in natural habitat',
    category: 'Nature',
    src: 'https://picsum.photos/seed/wildlife1/800/800',
  },
  {
    title: 'Autumn Colors',
    alt: 'Vibrant fall foliage in the forest',
    category: 'Nature',
    src: 'https://picsum.photos/seed/autumn1/800/1200',
  },
  {
    title: 'Waterfall',
    alt: 'Cascading waterfall in lush greenery',
    category: 'Nature',
    src: 'https://picsum.photos/seed/waterfall1/800/1000',
  },
  {
    title: 'Flower Macro',
    alt: 'Close-up detail of blooming flower',
    category: 'Nature',
    src: 'https://picsum.photos/seed/flower1/800/800',
  },
  {
    title: 'Morning Mist',
    alt: 'Foggy forest at dawn',
    category: 'Nature',
    src: 'https://picsum.photos/seed/mist1/800/1200',
  },
  {
    title: 'Rocky Shore',
    alt: 'Waves crashing on rocky coastline',
    category: 'Nature',
    src: 'https://picsum.photos/seed/shore1/800/600',
  },
];

async function seedDatabase() {
  console.log('🌱 Seeding database with sample photos...\n');

  try {
    // Check if database already has data
    const { rows: countRows } = await sql`SELECT COUNT(*) as count FROM gallery_photos`;
    const count = parseInt(countRows[0].count);

    if (count > 0) {
      console.log(`⚠️  Database already contains ${count} photos.`);
      console.log('🗑️  Clearing existing photos and reseeding...\n');

      // Delete all existing photos
      await sql`DELETE FROM gallery_photos`;
      console.log(`✅ Cleared ${count} existing photos\n`);
    }

    // Insert sample photos
    console.log(`📸 Inserting ${samplePhotos.length} sample photos...\n`);

    for (let i = 0; i < samplePhotos.length; i++) {
      const photo = samplePhotos[i];
      console.log(`   ${i + 1}. ${photo.title} (${photo.category})`);

      await sql`
        INSERT INTO gallery_photos (title, alt, category, src, position)
        VALUES (${photo.title}, ${photo.alt}, ${photo.category}, ${photo.src}, ${i})
      `;
    }

    console.log(`\n✅ Successfully seeded ${samplePhotos.length} photos!`);
    console.log('\n💡 Next steps:');
    console.log('   1. Start your dev server: npm run dev');
    console.log('   2. Visit http://localhost:3000 to see the gallery');
    console.log('   3. Visit http://localhost:3000/admin/photos to manage photos\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();
