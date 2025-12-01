-- Migration: Add is_hidden column to videos table
-- This allows users to hide their kuppis without deleting them
-- Date: 2025-12-01

-- Add is_hidden column with default value of false
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Create index for faster filtering of hidden videos
CREATE INDEX IF NOT EXISTS idx_videos_is_hidden ON public.videos(is_hidden);

-- Create index for finding user's added videos
CREATE INDEX IF NOT EXISTS idx_videos_added_by_user_id ON public.videos(added_by_user_id);

-- Comment
COMMENT ON COLUMN public.videos.is_hidden IS 'Whether the video is hidden by the user who added it. Hidden videos are not shown in search results or module pages.';
