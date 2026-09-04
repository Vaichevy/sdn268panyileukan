CREATE TABLE public.reel_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  caption TEXT,
  event_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reel_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reel_items TO authenticated;
GRANT ALL ON public.reel_items TO service_role;

ALTER TABLE public.reel_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reels are viewable by everyone"
  ON public.reel_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert reels"
  ON public.reel_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reels"
  ON public.reel_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reels"
  ON public.reel_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_reel_items_updated_at
  BEFORE UPDATE ON public.reel_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();