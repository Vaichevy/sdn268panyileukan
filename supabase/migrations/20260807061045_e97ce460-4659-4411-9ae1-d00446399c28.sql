ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS kka_heading text NOT NULL DEFAULT 'Koding & Kecerdasan Artifisial (KKA)',
  ADD COLUMN IF NOT EXISTS kka_intro text NOT NULL DEFAULT 'Mulai TA 2026/2027, murid belajar berpikir komputasional, praktik koding, dan pemanfaatan AI secara bijak, terintegrasi pada mapel Informatika/TIK, didukung Lab Komputer & 14 unit Chromebook.',
  ADD COLUMN IF NOT EXISTS kka_fase text NOT NULL DEFAULT 'A (I–II)|Mengenal urutan langkah/algoritma lewat permainan
B (III–IV)|Koding blok visual & mengenal teknologi pintar
C (V–VI)|Merancang & debugging program sederhana, etika digital',
  ADD COLUMN IF NOT EXISTS kokurikuler_heading text NOT NULL DEFAULT 'Kokurikuler: Projek Profil Lulusan',
  ADD COLUMN IF NOT EXISTS kokurikuler_intro text NOT NULL DEFAULT 'Kolaborasi lintas mapel + Gerakan 7 KAIH (Kebiasaan Anak Indonesia Hebat).',
  ADD COLUMN IF NOT EXISTS kokurikuler_items text NOT NULL DEFAULT 'Bertakwa
Disiplin & Tanggung Jawab
Jujur & Amanah
Santun
Cinta Tanah Air
Rajin & Kreatif
Peduli & Gotong Royong',
  ADD COLUMN IF NOT EXISTS ekskul_heading text NOT NULL DEFAULT 'Pilihan Ekstrakurikuler',
  ADD COLUMN IF NOT EXISTS ekskul_items text NOT NULL DEFAULT 'Pramuka
BTQ
Angklung
Keyboard
Dokcil
TIK
Smart Club
Pansos
Paskibra
Taekwondo
English Club
Qasidah',
  ADD COLUMN IF NOT EXISTS pembiasaan_harian_heading text NOT NULL DEFAULT 'Pembiasaan Harian',
  ADD COLUMN IF NOT EXISTS pembiasaan_harian_items text NOT NULL DEFAULT 'Doa, tilawah Al-Qur''an & Asmaul Husna sebelum belajar
Literasi & numerasi pagi, menyanyikan lagu kebangsaan
Perilaku Hidup Bersih & Sehat (PHBS) + 4S',
  ADD COLUMN IF NOT EXISTS pembiasaan_mingguan_heading text NOT NULL DEFAULT 'Pembiasaan Mingguan',
  ADD COLUMN IF NOT EXISTS pembiasaan_mingguan_items text NOT NULL DEFAULT 'Senin|Upacara
Selasa|SINAR (Literasi Kritis)
Rabu|SERU (Senam)
Kamis|MIBANDA (budaya Sunda)
Jumat|Sholat Dhuha, Infaq/Shodaqoh, Semijel & Gerakan Pungut Sampah (GPS)';