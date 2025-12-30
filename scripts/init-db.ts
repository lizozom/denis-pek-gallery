#!/usr/bin/env tsx

/**
 * Database initialization script
 * Run with: npm run db:init
 */

import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function initDatabase() {
  console.log('🔄 Initializing database...\n');

  try {
    // Read schema file
    const schemaPath = join(process.cwd(), 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log(`📋 Executing schema SQL...\n`);

    // Execute the entire schema at once to handle dollar-quoted strings properly
    try {
      await sql.query(schema);
      console.log(`✅ Schema executed successfully\n`);
    } catch (error: any) {
      // Check if it's just "already exists" errors
      if (error.message && (error.message.includes('already exists') || error.message.includes('duplicate'))) {
        console.log(`⚠️  Some objects already exist, continuing...\n`);
      } else {
        throw error;
      }
    }

    // Check if table exists and is empty
    const { rows } = await sql`SELECT COUNT(*) as count FROM gallery_photos`;
    const count = parseInt(rows[0].count);

    console.log(`\n📊 Database initialized successfully!`);
    console.log(`📷 Current photos in database: ${count}\n`);

    if (count === 0) {
      console.log('💡 Tip: Your database is empty. You can:');
      console.log('   1. Add photos via the admin interface at /admin/photos');
      console.log('   2. Run the seed script: npm run db:seed\n');
    }

  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase();
