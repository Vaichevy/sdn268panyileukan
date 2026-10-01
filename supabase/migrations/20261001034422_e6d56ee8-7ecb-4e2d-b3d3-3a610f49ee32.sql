ALTER TABLE public.gallery_items ADD COLUMN is_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.news_items ADD COLUMN is_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.video_items ADD COLUMN is_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.reel_items ADD COLUMN is_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN is_public boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery_items;
CREATE POLICY "Public can view published gallery"
ON public.gallery_items
FOR SELECT
TO public
USING (is_public = true);

DROP POLICY IF EXISTS "Public can view news" ON public.news_items;
CREATE POLICY "Public can view published news"
ON public.news_items
FOR SELECT
TO public
USING (is_public = true);

DROP POLICY IF EXISTS "Video dapat dilihat semua orang" ON public.video_items;
CREATE POLICY "Public can view published videos"
ON public.video_items
FOR SELECT
TO public
USING (is_public = true);

DROP POLICY IF EXISTS "Reels are viewable by everyone" ON public.reel_items;
CREATE POLICY "Public can view published reels"
ON public.reel_items
FOR SELECT
TO public
USING (is_public = true);

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view active site settings"
ON public.site_settings
FOR SELECT
TO public
USING (is_public = true);