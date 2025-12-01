-- Kuppi Approval System
-- This migration adds individual kuppi approval functionality

-- Add is_approved column to videos table (default false for new kuppis)
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Update existing kuppis: 
-- If the user who added them is approved, mark their kuppis as approved too
UPDATE videos v
SET is_approved = true
FROM users u
WHERE v.added_by_user_id = u.id 
  AND u.is_approved_for_kuppies = true;

-- Also approve kuppis that don't have an added_by_user_id (legacy/admin added)
UPDATE videos
SET is_approved = true
WHERE added_by_user_id IS NULL;

-- Create a function to auto-approve kuppis from approved users
CREATE OR REPLACE FUNCTION auto_approve_kuppi()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user adding the kuppi is approved
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = NEW.added_by_user_id 
    AND is_approved_for_kuppies = true
  ) THEN
    NEW.is_approved := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-approve kuppis from approved users
DROP TRIGGER IF EXISTS trigger_auto_approve_kuppi ON videos;
CREATE TRIGGER trigger_auto_approve_kuppi
  BEFORE INSERT ON videos
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_kuppi();

-- Create a function to approve all kuppis when a user gets approved
CREATE OR REPLACE FUNCTION approve_user_kuppis()
RETURNS TRIGGER AS $$
BEGIN
  -- When user is approved for kuppies, approve all their existing kuppis
  IF NEW.is_approved_for_kuppies = true AND OLD.is_approved_for_kuppies = false THEN
    UPDATE videos
    SET is_approved = true
    WHERE added_by_user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to approve all user's kuppis when they get approved
DROP TRIGGER IF EXISTS trigger_approve_user_kuppis ON users;
CREATE TRIGGER trigger_approve_user_kuppis
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION approve_user_kuppis();

-- Create index for faster queries on approval status
CREATE INDEX IF NOT EXISTS idx_videos_is_approved ON videos(is_approved);
CREATE INDEX IF NOT EXISTS idx_videos_added_by_user_id ON videos(added_by_user_id);

-- Comments for documentation
COMMENT ON COLUMN videos.is_approved IS 'Whether this kuppi is approved to be shown. Auto-set to true if user is_approved_for_kuppies';
