/*
  # Create stories table for love story platform

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `couple_names` (text) - Names of the couple
      - `page_title` (text) - Title of their love story page
      - `url_slug` (text, unique) - URL-friendly identifier
      - `cover_photo_url` (text) - Cover photo URL
      - `gallery_photos` (text[]) - Array of gallery photo URLs
      - `music_url` (text) - Background music file URL
      - `digital_letter` (text) - Love letter content
      - `special_date` (timestamptz) - Their special date
      - `puzzle_photo_url` (text) - Jigsaw puzzle image URL
      - `puzzle_message` (text) - Message shown when puzzle is completed
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `stories` table
    - Add policy for authenticated users to manage stories
    - Add policy for public read access to stories (for sharing)
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_names text NOT NULL,
  page_title text NOT NULL,
  url_slug text UNIQUE NOT NULL,
  cover_photo_url text DEFAULT '',
  gallery_photos text[] DEFAULT '{}',
  music_url text DEFAULT '',
  digital_letter text NOT NULL,
  special_date timestamptz NOT NULL,
  puzzle_photo_url text DEFAULT '',
  puzzle_message text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage all stories
CREATE POLICY "Authenticated users can manage stories"
  ON stories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for public read access to stories (for sharing)
CREATE POLICY "Anyone can read stories"
  ON stories
  FOR SELECT
  TO public
  USING (true);

-- Create storage bucket for story assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('story-assets', 'story-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for authenticated users to upload files
CREATE POLICY "Authenticated users can upload story assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'story-assets');

-- Policy for public read access to story assets
CREATE POLICY "Anyone can view story assets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'story-assets');

-- Policy for authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete story assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'story-assets');