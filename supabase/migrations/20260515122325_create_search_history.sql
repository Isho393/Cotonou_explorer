/*
  # Create search history table

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `query` (text) - the user's search query
      - `results_count` (integer) - number of results returned
      - `created_at` (timestamp)
      - `session_id` (text) - anonymous session identifier

  2. Security
    - Enable RLS
    - Allow inserts and selects for public (anonymous usage)
*/

CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  results_count integer DEFAULT 0,
  session_id text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert search history"
  ON search_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read search history by session"
  ON search_history FOR SELECT
  TO anon, authenticated
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id' OR session_id != '');
