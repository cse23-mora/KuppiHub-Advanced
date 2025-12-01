-- Update videos_search_mv materialized view to include is_hidden and is_approved columns
-- This allows filtering on these columns during search

-- Drop and recreate the materialized view with the new columns
DROP MATERIALIZED VIEW IF EXISTS videos_search_mv;

CREATE MATERIALIZED VIEW videos_search_mv AS
SELECT 
  v.id,
  v.title,
  v.description,
  v.youtube_links,
  v.telegram_links,
  v.material_urls,
  v.onedrive_cloud_video_urls,
  v.gdrive_cloud_video_urls,
  v.is_kuppi,
  v.is_hidden,
  v.is_approved,
  v.language_code,
  v.created_at,
  v.module_id,
  m.code AS module_code,
  m.name AS module_name,
  m.description AS module_description,
  s.name AS student_name,
  s.id AS student_id
FROM videos v
LEFT JOIN modules m ON v.module_id = m.id
LEFT JOIN students s ON v.student_id = s.id;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_videos_search_mv_title ON videos_search_mv USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_videos_search_mv_module_code ON videos_search_mv(module_code);
CREATE INDEX IF NOT EXISTS idx_videos_search_mv_is_hidden ON videos_search_mv(is_hidden);
CREATE INDEX IF NOT EXISTS idx_videos_search_mv_is_approved ON videos_search_mv(is_approved);

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW videos_search_mv;

-- Create a function to refresh the materialized view
-- Call this periodically or after video changes
CREATE OR REPLACE FUNCTION refresh_videos_search_mv()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW videos_search_mv;
END;
$$ LANGUAGE plpgsql;

COMMENT ON MATERIALIZED VIEW videos_search_mv IS 'Materialized view for fast video search with is_hidden and is_approved filters';
