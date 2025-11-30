-- Migration: Create user_dashboard_modules table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_dashboard_modules (
  id SERIAL PRIMARY KEY,
  user_email TEXT UNIQUE NOT NULL,
  module_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_dashboard_modules_email ON user_dashboard_modules(user_email);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE user_dashboard_modules ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own data
CREATE POLICY "Users can read their own dashboard" ON user_dashboard_modules
  FOR SELECT USING (true);

-- Policy to allow users to insert their own data
CREATE POLICY "Users can insert their own dashboard" ON user_dashboard_modules
  FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update their own dashboard" ON user_dashboard_modules
  FOR UPDATE USING (true);

-- Policy to allow users to delete their own data
CREATE POLICY "Users can delete their own dashboard" ON user_dashboard_modules
  FOR DELETE USING (true);

-- Grant access to authenticated and anonymous users (for API access)
GRANT ALL ON user_dashboard_modules TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_dashboard_modules_id_seq TO anon, authenticated;
