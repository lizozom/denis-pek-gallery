-- Gallery Photos Table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT NOT NULL,
  src TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
