-- Run this in your Supabase SQL Editor to set up the database schema

-- Users table (for role management, synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                    -- Clerk user ID
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user'
);

-- User posts (marketplace listings)
CREATE TABLE IF NOT EXISTS user_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  name TEXT,
  description TEXT,
  category TEXT,
  price TEXT,
  address TEXT,
  image TEXT,
  useremail TEXT,
  username TEXT,
  userimage TEXT,
  custom_id TEXT UNIQUE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  formatted_address TEXT,
  city TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  image TEXT
);

-- Sliders (home page banner images)
CREATE TABLE IF NOT EXISTS sliders (
  id BIGSERIAL PRIMARY KEY,
  image TEXT
);

-- Chats
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,                    -- Composite: buyer_seller_postId
  last_message TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  participants TEXT[],
  product_name TEXT,
  product_price TEXT,
  seller_id TEXT,
  doc_id TEXT,
  buyer_id TEXT,
  seller_name TEXT,
  seller_image TEXT,
  buyer_name TEXT,
  buyer_image TEXT,
  title TEXT
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  chat_id TEXT REFERENCES chats(id) ON DELETE CASCADE,
  sender TEXT,
  data TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access for categories, sliders, user_posts, chats, messages
CREATE POLICY "Allow public read access" ON user_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sliders FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON chats FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON messages FOR SELECT USING (true);

-- Allow insert for authenticated users
CREATE POLICY "Allow insert for all" ON user_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all" ON chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all" ON users FOR INSERT WITH CHECK (true);

-- Allow update/delete for owners
CREATE POLICY "Allow update own posts" ON user_posts FOR UPDATE USING (true);
CREATE POLICY "Allow delete own posts" ON user_posts FOR DELETE USING (true);

-- Enable real-time for messages (needed for chat feature)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Create storage bucket for post images (run in Supabase dashboard Storage section)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('community-posts', 'community-posts', true);
