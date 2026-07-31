ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS sekilas_eyebrow text NOT NULL DEFAULT 'Sekilas Tentang Kami',
  ADD COLUMN IF NOT EXISTS sekilas_heading text NOT NULL DEFAULT 'Potret singkat warga dan lingkungan sekolah',
  ADD COLUMN IF NOT EXISTS sekilas_murid text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sekilas_ptk text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sekilas_lingkungan text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sekilas_sarana text NOT NULL DEFAULT '';