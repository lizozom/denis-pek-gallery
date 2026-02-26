-- Gallery Photos Table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT NOT NULL,
  src TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  hidden BOOLEAN NOT NULL DEFAULT false,
  hero_eligible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add columns if they don't exist (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'hidden') THEN
    ALTER TABLE gallery_photos ADD COLUMN hidden BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'hero_eligible') THEN
    ALTER TABLE gallery_photos ADD COLUMN hero_eligible BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'passepartout_color') THEN
    ALTER TABLE gallery_photos ADD COLUMN passepartout_color TEXT NOT NULL DEFAULT 'none';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'passepartout_thickness') THEN
    ALTER TABLE gallery_photos ADD COLUMN passepartout_thickness TEXT NOT NULL DEFAULT 'none';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'frame_color') THEN
    ALTER TABLE gallery_photos ADD COLUMN frame_color TEXT NOT NULL DEFAULT 'black';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_photos' AND column_name = 'frame_thickness') THEN
    ALTER TABLE gallery_photos ADD COLUMN frame_thickness TEXT NOT NULL DEFAULT 'thick';
  END IF;
END $$;

-- Index for ordering by position
CREATE INDEX IF NOT EXISTS idx_gallery_photos_position ON gallery_photos(position);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_gallery_photos_category ON gallery_photos(category);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_gallery_photos_updated_at
    BEFORE UPDATE ON gallery_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
