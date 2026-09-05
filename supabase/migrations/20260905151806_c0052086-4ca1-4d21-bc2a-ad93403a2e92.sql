ALTER TABLE public.reel_items
  ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS thumbnail_url text NOT NULL DEFAULT '';