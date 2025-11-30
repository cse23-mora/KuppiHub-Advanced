-- KuppiHub New Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MODULES TABLE
-- Stores all course/subject information
-- =====================================================
CREATE TABLE public.modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster searches
CREATE INDEX idx_modules_code ON public.modules(code);
CREATE INDEX idx_modules_name ON public.modules(name);

-- =====================================================
-- USERS TABLE
-- Stores both students and tutors
-- Firebase UID is used as the primary identifier
-- =====================================================
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    photo_url TEXT,
    index_number VARCHAR(50), -- Student index number (e.g., 230557T)
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'admin')),
    is_verified_tutor BOOLEAN DEFAULT FALSE, -- Admin verified tutors
    faculty_path TEXT, -- JSON path: faculty/department/semester
    linkedin_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_users_firebase_uid ON public.users(firebase_uid);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_index_number ON public.users(index_number);
CREATE INDEX idx_users_role ON public.users(role);

-- =====================================================
-- KUPPIS TABLE (Videos/Learning Content)
-- Stores all learning content uploaded by tutors
-- =====================================================
CREATE TABLE public.kuppis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Video links stored as JSONB arrays
    youtube_links JSONB DEFAULT '[]'::jsonb,
    telegram_links JSONB DEFAULT '[]'::jsonb,
    material_urls JSONB DEFAULT '[]'::jsonb, -- PDFs, notes, etc.
    
    -- Metadata
    language_code VARCHAR(10) DEFAULT 'si', -- si: Sinhala, en: English, ta: Tamil
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    
    -- Visibility and approval
    is_approved BOOLEAN DEFAULT FALSE, -- Only approved kuppis shown to students
    is_published BOOLEAN DEFAULT TRUE,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_kuppis_module_id ON public.kuppis(module_id);
CREATE INDEX idx_kuppis_uploader_id ON public.kuppis(uploader_id);
CREATE INDEX idx_kuppis_is_approved ON public.kuppis(is_approved);
CREATE INDEX idx_kuppis_language ON public.kuppis(language_code);
CREATE INDEX idx_kuppis_created_at ON public.kuppis(created_at DESC);

-- =====================================================
-- USER_MODULES TABLE
-- Tracks which modules students have added to their dashboard
-- =====================================================
CREATE TABLE public.user_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT FALSE, -- True if auto-assigned based on faculty/dept/sem
    added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Ensure unique user-module combinations
    UNIQUE(user_id, module_id)
);

-- Create indexes
CREATE INDEX idx_user_modules_user_id ON public.user_modules(user_id);
CREATE INDEX idx_user_modules_module_id ON public.user_modules(module_id);

-- =====================================================
-- KUPPI_LIKES TABLE
-- Track which users liked which kuppis
-- =====================================================
CREATE TABLE public.kuppi_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    kuppi_id UUID REFERENCES public.kuppis(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    UNIQUE(user_id, kuppi_id)
);

-- Create indexes
CREATE INDEX idx_kuppi_likes_user_id ON public.kuppi_likes(user_id);
CREATE INDEX idx_kuppi_likes_kuppi_id ON public.kuppi_likes(kuppi_id);

-- =====================================================
-- WATCH_HISTORY TABLE
-- Track user's video watch history
-- =====================================================
CREATE TABLE public.watch_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    kuppi_id UUID REFERENCES public.kuppis(id) ON DELETE CASCADE,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    progress_percentage INTEGER DEFAULT 0, -- 0-100
    
    UNIQUE(user_id, kuppi_id)
);

-- Create indexes
CREATE INDEX idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX idx_watch_history_kuppi_id ON public.watch_history(kuppi_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kuppis_updated_at
    BEFORE UPDATE ON public.kuppis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(kuppi_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.kuppis
    SET view_count = view_count + 1
    WHERE id = kuppi_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update like count (triggered by kuppi_likes table)
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.kuppis SET like_count = like_count + 1 WHERE id = NEW.kuppi_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.kuppis SET like_count = like_count - 1 WHERE id = OLD.kuppi_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_like_count
    AFTER INSERT OR DELETE ON public.kuppi_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_like_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kuppis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kuppi_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Modules: Anyone can read
CREATE POLICY "Modules are viewable by everyone" ON public.modules
    FOR SELECT USING (true);

-- Modules: Only admins can insert/update/delete (via service role)
CREATE POLICY "Modules can be managed by admins" ON public.modules
    FOR ALL USING (auth.role() = 'service_role');

-- Users: Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (true); -- Public profiles

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Kuppis: Everyone can view approved kuppis
CREATE POLICY "Approved kuppis are viewable by everyone" ON public.kuppis
    FOR SELECT USING (is_approved = true AND is_published = true);

-- Kuppis: Uploaders can view their own (even unapproved)
CREATE POLICY "Uploaders can view own kuppis" ON public.kuppis
    FOR SELECT USING (
        uploader_id IN (
            SELECT id FROM public.users 
            WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- User Modules: Users can manage their own
CREATE POLICY "Users can manage own modules" ON public.user_modules
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Kuppi Likes: Users can manage their own likes
CREATE POLICY "Users can manage own likes" ON public.kuppi_likes
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Watch History: Users can manage their own
CREATE POLICY "Users can manage own watch history" ON public.watch_history
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Kuppis with uploader info and module info
CREATE OR REPLACE VIEW public.kuppis_with_details AS
SELECT 
    k.*,
    m.code AS module_code,
    m.name AS module_name,
    u.display_name AS uploader_name,
    u.photo_url AS uploader_photo,
    u.index_number AS uploader_index
FROM public.kuppis k
LEFT JOIN public.modules m ON k.module_id = m.id
LEFT JOIN public.users u ON k.uploader_id = u.id
WHERE k.is_approved = true AND k.is_published = true;

-- View: Tutor stats
CREATE OR REPLACE VIEW public.tutor_stats AS
SELECT 
    u.id,
    u.display_name,
    u.photo_url,
    u.index_number,
    u.is_verified_tutor,
    COUNT(k.id) AS total_kuppis,
    COALESCE(SUM(k.view_count), 0) AS total_views,
    COALESCE(SUM(k.like_count), 0) AS total_likes
FROM public.users u
LEFT JOIN public.kuppis k ON u.id = k.uploader_id AND k.is_approved = true
WHERE u.role IN ('tutor', 'student')
GROUP BY u.id, u.display_name, u.photo_url, u.index_number, u.is_verified_tutor
HAVING COUNT(k.id) > 0
ORDER BY total_kuppis DESC;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert some sample modules
INSERT INTO public.modules (code, name, description) VALUES
    ('CS1033', 'Programming Fundamentals', 'Introduction to programming concepts using Python and C'),
    ('CS2023', 'Data Structures and Algorithms', 'Core data structures and algorithmic techniques'),
    ('CS2043', 'Operating Systems', 'Operating system concepts and design'),
    ('MA1024', 'Methods of Mathematics', 'Advanced mathematical methods for engineering'),
    ('MA2014', 'Differential Equations', 'Ordinary and partial differential equations'),
    ('EE1040', 'Electrical Fundamentals', 'Basic electrical engineering concepts'),
    ('CS3043', 'Database Systems', 'Relational databases and SQL'),
    ('CS3613', 'Introduction to Artificial Intelligence', 'AI fundamentals and machine learning basics')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant access to anon and authenticated users
GRANT SELECT ON public.modules TO anon, authenticated;
GRANT SELECT ON public.kuppis TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
GRANT SELECT ON public.kuppis_with_details TO anon, authenticated;
GRANT SELECT ON public.tutor_stats TO anon, authenticated;

GRANT ALL ON public.user_modules TO authenticated;
GRANT ALL ON public.kuppi_likes TO authenticated;
GRANT ALL ON public.watch_history TO authenticated;
