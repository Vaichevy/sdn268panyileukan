ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.news_items ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';