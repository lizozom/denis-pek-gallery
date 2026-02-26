import { sql } from '@vercel/postgres';
import type { GalleryImage } from './gallery';

/**
 * Fetches all gallery photos from the database, ordered by position
 * By default, excludes hidden photos (for gallery display)
 * Orders by position DESC to show newest photos first (highest position = most recent)
 */
export async function getGalleryPhotos(includeHidden = false): Promise<GalleryImage[]> {
  try {
    let rows;
    if (includeHidden) {
      const result = await sql<GalleryImage>`
        SELECT id, title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness
        FROM gallery_photos
        ORDER BY position DESC, id DESC
      `;
      rows = result.rows;
    } else {
      const result = await sql<GalleryImage>`
        SELECT id, title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness
        FROM gallery_photos
        WHERE hidden = false
        ORDER BY position DESC, id DESC
      `;
      rows = result.rows;
    }
    return rows;
  } catch (error) {
    console.error('Error fetching gallery photos from database:', error);
    return [];
  }
}

/**
 * Fetches the latest hero-eligible photo for the hero section
 * Returns the most recently added photo with hero_eligible = true
 */
export async function getHeroPhoto(): Promise<GalleryImage | null> {
  try {
    const { rows } = await sql<GalleryImage>`
      SELECT id, title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness
      FROM gallery_photos
      WHERE hero_eligible = true AND hidden = false
      ORDER BY position DESC, id DESC
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching hero photo:', error);
    return null;
  }
}

/**
 * Fetches a single photo by ID
 */
export async function getPhotoById(id: number): Promise<GalleryImage | null> {
  try {
    const { rows } = await sql<GalleryImage>`
      SELECT id, title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness
      FROM gallery_photos
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching photo by ID:', error);
    return null;
  }
}

/**
 * Adds a new photo to the gallery
 */
export async function addGalleryPhoto(
  photo: Omit<GalleryImage, 'id'>
): Promise<GalleryImage | null> {
  try {
    // Get the max position to add new photo at the end
    const { rows: maxRows } = await sql<{ max_position: number }>`
      SELECT COALESCE(MAX(position), -1) as max_position
      FROM gallery_photos
    `;
    const newPosition = (maxRows[0]?.max_position ?? -1) + 1;
    const heroEligible = photo.hero_eligible ?? false;
    const ppColor = photo.passepartout_color ?? 'none';
    const ppThickness = photo.passepartout_thickness ?? 'none';
    const frColor = photo.frame_color ?? 'none';
    const frThickness = photo.frame_thickness ?? 'none';

    const { rows } = await sql<GalleryImage>`
      INSERT INTO gallery_photos (title, alt, category, src, position, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness)
      VALUES (${photo.title}, ${photo.alt}, ${photo.category}, ${photo.src}, ${newPosition}, ${heroEligible}, ${ppColor}, ${ppThickness}, ${frColor}, ${frThickness})
      RETURNING id, title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness
    `;

    return rows[0] || null;
  } catch (error) {
    console.error('Error adding gallery photo:', error);
    return null;
  }
}

/**
 * Updates an existing photo
 */
export async function updateGalleryPhoto(
  id: number,
  updates: Partial<Omit<GalleryImage, 'id'>>
): Promise<boolean> {
  try {
    const { title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness } = updates;

    await sql`
      UPDATE gallery_photos
      SET
        title = COALESCE(${title}, title),
        alt = COALESCE(${alt}, alt),
        category = COALESCE(${category}, category),
        src = COALESCE(${src}, src),
        hero_eligible = COALESCE(${hero_eligible}, hero_eligible),
        passepartout_color = COALESCE(${passepartout_color}, passepartout_color),
        passepartout_thickness = COALESCE(${passepartout_thickness}, passepartout_thickness),
        frame_color = COALESCE(${frame_color}, frame_color),
        frame_thickness = COALESCE(${frame_thickness}, frame_thickness)
      WHERE id = ${id}
    `;

    return true;
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    return false;
  }
}

/**
 * Hides a photo from the gallery (soft delete)
 */
export async function hideGalleryPhoto(id: number): Promise<boolean> {
  try {
    await sql`
      UPDATE gallery_photos
      SET hidden = true
      WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error hiding gallery photo:', error);
    return false;
  }
}

/**
 * Deletes a photo from the gallery permanently (hard delete)
 */
export async function deleteGalleryPhoto(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM gallery_photos
      WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return false;
  }
}

/**
 * Reorders photos by updating their positions
 */
export async function reorderGalleryPhotos(photoIds: number[]): Promise<boolean> {
  try {
    // Update positions sequentially
    for (let i = 0; i < photoIds.length; i++) {
      await sql`
        UPDATE gallery_photos
        SET position = ${i}
        WHERE id = ${photoIds[i]}
      `;
    }

    return true;
  } catch (error) {
    console.error('Error reordering gallery photos:', error);
    return false;
  }
}

/**
 * Initializes the database with seed data (optional)
 */
export async function seedGalleryData(photos: Omit<GalleryImage, 'id'>[]): Promise<boolean> {
  try {
    // Check if table already has data
    const { rows: countRows } = await sql<{ count: number }>`
      SELECT COUNT(*) as count FROM gallery_photos
    `;

    if (countRows[0].count > 0) {
      console.log('Gallery already has data, skipping seed');
      return true;
    }

    // Insert seed data
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      await sql`
        INSERT INTO gallery_photos (title, alt, category, src, position)
        VALUES (${photo.title}, ${photo.alt}, ${photo.category}, ${photo.src}, ${i})
      `;
    }

    console.log(`Seeded ${photos.length} photos into gallery`);
    return true;
  } catch (error) {
    console.error('Error seeding gallery data:', error);
    return false;
  }
}
