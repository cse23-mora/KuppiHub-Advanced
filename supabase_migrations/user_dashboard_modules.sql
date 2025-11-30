-- Migration: Create users and user_dashboard_modules tables
-- Run this SQL in your Supabase SQL Editor

-- =============================================
-- 0. DROP EXISTING TABLES (if they exist with old schema)
-- =============================================
DROP TABLE IF EXISTS user_dashboard_modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  auth_provider TEXT DEFAULT 'email', -- 'email' or 'google'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================
-- 2. USER DASHBOARD MODULES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_dashboard_modules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_dashboard_modules_user_id ON user_dashboard_modules(user_id);

-- Ensure one dashboard per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_dashboard_modules_unique_user ON user_dashboard_modules(user_id);

-- =============================================
-- 3. ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow public read of users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert of users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update of users" ON users
  FOR UPDATE USING (true);

-- Enable RLS on user_dashboard_modules table
ALTER TABLE user_dashboard_modules ENABLE ROW LEVEL SECURITY;

-- Policies for user_dashboard_modules table
CREATE POLICY "Users can read their own dashboard" ON user_dashboard_modules
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own dashboard" ON user_dashboard_modules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own dashboard" ON user_dashboard_modules
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own dashboard" ON user_dashboard_modules
  FOR DELETE USING (true);

-- =============================================
-- 4. GRANT PERMISSIONS
-- =============================================
GRANT ALL ON users TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO anon, authenticated;

GRANT ALL ON user_dashboard_modules TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_dashboard_modules_id_seq TO anon, authenticated;
