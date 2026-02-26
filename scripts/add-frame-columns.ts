#!/usr/bin/env tsx

/**
 * Migration script to add passepartout and frame columns to gallery_photos table
 * Run with: npm run db:migrate:frame
 */

import dotenv from 'dotenv';
import { join } from 'path';
import { sql } from '@vercel/postgres';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

const COLUMNS = [
  { name: 'passepartout_color', type: "TEXT NOT NULL DEFAULT 'none'" },
  { name: 'passepartout_thickness', type: "TEXT NOT NULL DEFAULT 'none'" },
  { name: 'frame_color', type: "TEXT NOT NULL DEFAULT 'none'" },
  { name: 'frame_thickness', type: "TEXT NOT NULL DEFAULT 'none'" },
];

async function addFrameColumns() {
  console.log('Adding passepartout and frame columns to gallery_photos table...\n');

  try {
    for (const col of COLUMNS) {
      const { rows } = await sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'gallery_photos' AND column_name = ${col.name}
      `;

      if (rows.length > 0) {
        console.log(`Column "${col.name}" already exists. Skipping.`);
        continue;
      }

      // sql template tag doesn't support dynamic DDL, so we use a raw query
      await sql.query(
        `ALTER TABLE gallery_photos ADD COLUMN ${col.name} ${col.type}`
      );
      console.log(`Added column "${col.name}".`);
    }

    console.log('\nMigration complete! Photos can now have passepartout and frame options.\n');
  } catch (error) {
    console.error('\nError adding frame columns:', error);
    process.exit(1);
  }
}

addFrameColumns();
