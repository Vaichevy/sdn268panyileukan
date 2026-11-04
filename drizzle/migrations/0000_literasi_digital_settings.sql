ALTER TABLE public.site_settings
  ADD COLUMN literasi_digital_heading text NOT NULL DEFAULT 'Literasi Digital'::text,
  ADD COLUMN literasi_digital_url text NOT NULL DEFAULT 'https://fliphtml5.com/bookcase/blozj/'::text;