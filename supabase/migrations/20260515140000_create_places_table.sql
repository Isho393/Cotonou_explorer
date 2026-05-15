/*
  # Create places table for OSM data

  1. New Tables
    - `places`
      - `id` (uuid, primary key)
      - `osm_id` (bigint) - OpenStreetMap ID
      - `osm_type` (text) - node, way, or relation
      - `name` (text) - place name
      - `category` (text) - standardized category
      - `subcategory` (text) - OSM amenity/shop/tourism tag
      - `address` (text) - formatted address
      - `city` (text) - Cotonou, Abomey-Calavi, etc.
      - `description` (text) - generated description
      - `phone` (text) - phone number
      - `website` (text) - website URL
      - `opening_hours` (text) - opening hours
      - `rating` (numeric) - calculated or default rating
      - `lat` (numeric) - latitude
      - `lng` (numeric) - longitude
      - `tags` (jsonb) - all OSM tags
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes
    - Index on name for text search
    - Index on category for filtering
    - Index on city for location filtering
    - Spatial index on coordinates

  3. Security
    - Enable RLS
    - Allow public read access
    - Restrict write access to service role
*/

CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  osm_id bigint UNIQUE,
  osm_type text NOT NULL CHECK (osm_type IN ('node', 'way', 'relation')),
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  address text,
  city text,
  description text,
  phone text,
  website text,
  opening_hours text,
  rating numeric DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  tags jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_places_name ON places USING gin(to_tsvector('french', name));
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_location ON places(lat, lng);
CREATE INDEX idx_places_osm_id ON places(osm_id);

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read places
CREATE POLICY "Anyone can read places"
  ON places FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Service role can manage places"
  ON places FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
