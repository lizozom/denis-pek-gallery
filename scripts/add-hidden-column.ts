#!/usr/bin/env tsx

/**
 * Migration script to add 'hidden' column to gallery_photos table
 * Run with: npm run db:migrate:hidden
 */

import dotenv from 'dotenv';
import { join } from 'path';
import { sql } from '@vercel/postgres';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function addHiddenColumn() {
  console.log('🔄 Adding "hidden" column to gallery_photos table...\n');

  try {
    // Check if column already exists
    const { rows: columns } = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'gallery_photos' AND column_name = 'hidden'
    `;

    if (columns.length > 0) {
      console.log('✅ Column "hidden" already exists. Skipping migration.\n');
      return;
    }

    // Add the hidden column (default false)
    await sql`
      ALTER TABLE gallery_photos
      ADD COLUMN hidden BOOLEAN NOT NULL DEFAULT false
    `;

    console.log('✅ Successfully added "hidden" column to gallery_photos table\n');

    // Create an index for filtering by hidden status
    await sql`
      CREATE INDEX IF NOT EXISTS idx_gallery_photos_hidden ON gallery_photos(hidden)
    `;

    console.log('✅ Created index on "hidden" column for better query performance\n');

    console.log('💡 Migration complete! Photos can now be hidden instead of permanently deleted.\n');

  } catch (error) {
    console.error('\n❌ Error adding hidden column:', error);
    process.exit(1);
  }
}

// Run the migration
addHiddenColumn();
