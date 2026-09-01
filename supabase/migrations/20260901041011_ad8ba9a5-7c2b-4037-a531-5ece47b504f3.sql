CREATE TABLE public.video_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  youtube_url TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  event_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.video_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_items TO authenticated;
GRANT ALL ON public.video_items TO service_role;

ALTER TABLE public.video_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video dapat dilihat semua orang" ON public.video_items FOR SELECT USING (true);
CREATE POLICY "Admin dapat menambah video" ON public.video_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin dapat mengubah video" ON public.video_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin dapat menghapus video" ON public.video_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_video_items_updated_at BEFORE UPDATE ON public.video_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();