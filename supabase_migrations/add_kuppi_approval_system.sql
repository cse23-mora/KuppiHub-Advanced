-- Migration: Add Kuppi Approval System
-- Date: 2025-12-01
-- Description: Adds user approval for kuppies and tracks who added each video

-- 1. Add is_approved_for_kuppies column to users table
-- Only approved users' kuppies will be visible on the website
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_approved_for_kuppies BOOLEAN DEFAULT FALSE;

-- 2. Add added_by_user_id column to videos table
-- This tracks which user added the kuppi/video
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS added_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- 3. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_added_by_user_id ON videos(added_by_user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_approved_for_kuppies ON users(is_approved_for_kuppies);

-- 4. Update RLS policies if needed (optional - uncomment if using RLS)
-- ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Videos are viewable by everyone" ON videos FOR SELECT USING (true);
-- CREATE POLICY "Users can insert their own videos" ON videos FOR INSERT WITH CHECK (auth.uid()::text = added_by_user_id::text);

-- Example: Approve a user for kuppies (run manually for each user you want to approve)
-- UPDATE users SET is_approved_for_kuppies = TRUE WHERE id = <user_id>;
-- UPDATE users SET is_approved_for_kuppies = TRUE WHERE email = 'example@email.com';

COMMENT ON COLUMN users.is_approved_for_kuppies IS 'If true, this user''s kuppies will be visible on the website. Manual approval required.';
COMMENT ON COLUMN videos.added_by_user_id IS 'References the user who added this video/kuppi.';
