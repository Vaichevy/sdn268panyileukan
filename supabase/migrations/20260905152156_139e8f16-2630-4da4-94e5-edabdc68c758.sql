ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS apps_items text NOT NULL DEFAULT 'Aplikasi Surat|https://surat268panyileukan.lovable.app|Pengelolaan surat masuk & keluar
Aplikasi Perpustakaan|https://perpustakaansdn268.lovable.app/|Katalog & peminjaman buku sekolah';