ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS penilaian_heading text NOT NULL DEFAULT 'Pembelajaran & Penilaian',
  ADD COLUMN IF NOT EXISTS penilaian_intro text NOT NULL DEFAULT 'Buku Saku KSP • SDN 268 Panyileukan',
  ADD COLUMN IF NOT EXISTS penilaian_alur_heading text NOT NULL DEFAULT 'Alur Rencana Pembelajaran',
  ADD COLUMN IF NOT EXISTS penilaian_alur text NOT NULL DEFAULT 'Capaian Pembelajaran (CP)
Alur Tujuan Pembelajaran (ATP)
Modul Ajar
Asesmen',
  ADD COLUMN IF NOT EXISTS penilaian_alur_note text NOT NULL DEFAULT 'Disusun per fase secara kolaboratif oleh guru.',
  ADD COLUMN IF NOT EXISTS penilaian_asesmen_heading text NOT NULL DEFAULT 'Tiga Jenis Asesmen',
  ADD COLUMN IF NOT EXISTS penilaian_asesmen text NOT NULL DEFAULT 'Diagnostik|Mengenali kondisi awal & kebutuhan murid
Formatif|Memantau proses & memberi umpan balik
Sumatif|Di akhir materi/semester/fase, dasar kenaikan kelas & kelulusan',
  ADD COLUMN IF NOT EXISTS penilaian_syarat_heading text NOT NULL DEFAULT 'Syarat Naik Kelas & Lulus',
  ADD COLUMN IF NOT EXISTS penilaian_syarat text NOT NULL DEFAULT 'Kehadiran minimal 80%
Tuntas tujuan pembelajaran tiap mapel
Penilaian sikap baik
(Lulus) Mengikuti asesmen sumatif akhir Fase C',
  ADD COLUMN IF NOT EXISTS evaluasi_heading text NOT NULL DEFAULT 'Evaluasi & Kalender',
  ADD COLUMN IF NOT EXISTS evaluasi_intro text NOT NULL DEFAULT 'Bab V Buku Saku KSP • SDN 268 Panyileukan',
  ADD COLUMN IF NOT EXISTS evaluasi_siklus_heading text NOT NULL DEFAULT 'Siklus Evaluasi Kurikulum',
  ADD COLUMN IF NOT EXISTS evaluasi_siklus text NOT NULL DEFAULT 'Harian
Per Unit Belajar
Per Semester
Per Tahun',
  ADD COLUMN IF NOT EXISTS evaluasi_pendampingan_heading text NOT NULL DEFAULT 'Pendampingan Guru',
  ADD COLUMN IF NOT EXISTS evaluasi_pendampingan text NOT NULL DEFAULT 'Coaching • Mentoring • Pelatihan — didukung strategi manajemen Super Learning Team (SLT) untuk penguatan kepemimpinan & kolaborasi guru.',
  ADD COLUMN IF NOT EXISTS evaluasi_kalender_heading text NOT NULL DEFAULT 'Kalender Pendidikan 2026/2027 (Ringkas)',
  ADD COLUMN IF NOT EXISTS evaluasi_kalender text NOT NULL DEFAULT 'Hari pertama masuk sekolah|13 Juli 2026
Libur akhir Semester I|Des 2026
Perkiraan libur Ramadhan/Idul Fitri|Feb–Mar 2027
Asesmen Akhir Tahun|7–18 Juni 2027
Libur Akhir Tahun Pelajaran|28 Jun–9 Jul 2027',
  ADD COLUMN IF NOT EXISTS evaluasi_kalender_note text NOT NULL DEFAULT 'Semester I: 139 hari efektif • Semester II: 121 hari efektif.';