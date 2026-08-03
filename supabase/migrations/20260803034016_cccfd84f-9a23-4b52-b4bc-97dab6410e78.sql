ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS pembelajaran_eyebrow text NOT NULL DEFAULT 'Pengorganisasian Belajar',
  ADD COLUMN IF NOT EXISTS pembelajaran_heading text NOT NULL DEFAULT 'Pembelajaran di SDN 268 Panyileukan',
  ADD COLUMN IF NOT EXISTS pembelajaran_intro text NOT NULL DEFAULT 'Buku Saku KSP • SDN 268 Panyileukan',
  ADD COLUMN IF NOT EXISTS pembelajaran_fase text NOT NULL DEFAULT 'A|I–II|Literasi & numerasi dasar
B|III–IV|Perluasan konsep + IPAS mulai wajib
C|V–VI|Pemantapan menuju jenjang berikutnya',
  ADD COLUMN IF NOT EXISTS pembelajaran_deep text NOT NULL DEFAULT 'Berkesadaran
Bermakna
Menggembirakan',
  ADD COLUMN IF NOT EXISTS pembelajaran_siklus text NOT NULL DEFAULT 'Siklus belajar 3M: Memahami → Mengaplikasikan → Merefleksikan',
  ADD COLUMN IF NOT EXISTS pembelajaran_dimensi text NOT NULL DEFAULT 'iman-takwa
kewargaan
penalaran kritis
kreativitas
kolaborasi
kemandirian
kesehatan
komunikasi',
  ADD COLUMN IF NOT EXISTS pembelajaran_sesi text NOT NULL DEFAULT '18 rombel dengan 12 ruang kelas → pembelajaran dibagi Sesi Pagi & Sesi Siang, pukul 07.00–17.00 WIB. 1 JP = 35 menit.';