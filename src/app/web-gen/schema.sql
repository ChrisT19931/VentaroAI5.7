-- Schema for Web Generator projects

-- Table for storing user website projects
CREATE TABLE IF NOT EXISTS web_gen_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  html_content TEXT,
  css_content TEXT,
  js_content TEXT,
  thumbnail TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_web_gen_projects_user_id ON web_gen_projects(user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_web_gen_projects_updated_at
BEFORE UPDATE ON web_gen_projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Table for storing project assets (images, etc.)
CREATE TABLE IF NOT EXISTS web_gen_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES web_gen_projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries by project_id
CREATE INDEX IF NOT EXISTS idx_web_gen_assets_project_id ON web_gen_assets(project_id);

-- RLS (Row Level Security) policies
-- Enable RLS on the tables
ALTER TABLE web_gen_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gen_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for web_gen_projects
-- Users can only see their own projects
CREATE POLICY web_gen_projects_select_policy ON web_gen_projects
FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own projects
CREATE POLICY web_gen_projects_insert_policy ON web_gen_projects
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY web_gen_projects_update_policy ON web_gen_projects
FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own projects
CREATE POLICY web_gen_projects_delete_policy ON web_gen_projects
FOR DELETE USING (auth.uid() = user_id);

-- Create policies for web_gen_assets
-- Users can only see assets from their own projects
CREATE POLICY web_gen_assets_select_policy ON web_gen_assets
FOR SELECT USING (
  project_id IN (
    SELECT id FROM web_gen_projects WHERE user_id = auth.uid()
  )
);

-- Users can only insert assets to their own projects
CREATE POLICY web_gen_assets_insert_policy ON web_gen_assets
FOR INSERT WITH CHECK (
  project_id IN (
    SELECT id FROM web_gen_projects WHERE user_id = auth.uid()
  )
);

-- Users can only update assets from their own projects
CREATE POLICY web_gen_assets_update_policy ON web_gen_assets
FOR UPDATE USING (
  project_id IN (
    SELECT id FROM web_gen_projects WHERE user_id = auth.uid()
  )
);

-- Users can only delete assets from their own projects
CREATE POLICY web_gen_assets_delete_policy ON web_gen_assets
FOR DELETE USING (
  project_id IN (
    SELECT id FROM web_gen_projects WHERE user_id = auth.uid()
  )
);