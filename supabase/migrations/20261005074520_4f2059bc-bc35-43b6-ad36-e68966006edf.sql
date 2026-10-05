CREATE TABLE public.article_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text,
  cover_url text,
  pdf_url text,
  author text,
  is_public boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.article_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_items TO authenticated;
GRANT ALL ON public.article_items TO service_role;
ALTER TABLE public.article_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published articles" ON public.article_items FOR SELECT TO public USING (is_public = true);
CREATE POLICY "Admins manage articles" ON public.article_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER article_items_updated BEFORE UPDATE ON public.article_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.article_items (title, summary, author, pdf_url, published_at, content) VALUES (
'Menjadi Detektif Jajanan Aman',
'Empat misi seru untuk murid SDN 268 Panyileukan: mengamati, memeriksa, bertanya, dan melapor.',
'Cepi Kunaefi',
'/__l5e/assets-v1/2daee5d6-0c6d-4fa8-b8b1-9d5275ef5188/detektif-jajanan-aman.pdf',
'2026-09-15 08:00:00+07',
$c$## Bel istirahat berbunyi!
Halaman sekolah menjadi ramai. Ada buah potong, kue, bakso, minuman, dan makanan kemasan. Warna serta aromanya mengundang selera. Kamu tentu boleh menikmati jajanan. Namun, sebelum memilih, mari memakai "kacamata detektif": mata yang teliti, pikiran yang tenang, dan kebiasaan bertanya.

Detektif jajanan tidak mencari kesalahan pedagang. Detektif cilik mencari petunjuk agar pilihan makan lebih aman. Banyak penjual sudah menjaga kebersihan dan menyediakan makanan yang baik. Tugasmu adalah mengenali tanda-tanda yang membantu memilih dengan bijak.

## Kode Detektif: AMAN
- A = Amati tempatnya
- M = Mengecek KLIK
- A = Awasi kabarnya
- N = Nyatakan kepada orang dewasa

Slogan kita: "Lihat, Cek, Tanya, Lapor!"

## Misi 1 • Tempat dan Penjual
Lihat area berjualan tanpa mengganggu orang lain. Tempat yang tampak bersih adalah petunjuk awal yang baik.
- Pilih tempat berjualan yang bersih.
- Periksa apakah makanan terlindung dari debu dan lalat, misalnya dengan penutup atau etalase.
- Perhatikan apakah penjepit, sendok, piring, gelas, dan wadah tampak bersih.

Ingat: pengamatan bukan tuduhan. Jika kamu ragu, tanyakan dengan sopan kepada guru atau pilih jajanan lain.

Tantangan 10 Detik: sebelum membeli, temukan tiga petunjuk — tempat bersih, makanan tertutup, dan alat bersih.

## Misi 2 • Cek KLIK
Untuk makanan atau minuman kemasan, BPOM mengajarkan Cek KLIK: Kemasan, Label, Izin Edar, dan Kedaluwarsa.
- Kemasan: tidak sobek, bocor, menggembung, berkarat, atau tampak pernah dibuka.
- Label: tulisannya dapat dibaca. Kenali nama produk, komposisi, cara penyimpanan, dan informasi produsen.
- Izin edar: minta bantuan orang dewasa memeriksanya melalui situs Cek Produk BPOM (https://cekbpom.pom.go.id/) atau aplikasi BPOM Mobile.
- Kedaluwarsa: pastikan tanggalnya belum terlewati.

Catatan penting: tidak semua jajanan harus memiliki nomor izin edar BPOM. Untuk jajanan siap saji, utamakan kebersihan tempat, perlindungan makanan, dan penanganan yang baik.

## Misi 3 • Periksa Kabar Sebelum Percaya
Suatu hari, pesan di media sosial berbunyi, "Permen ini mengandung narkoba!" Detektif cilik tidak langsung panik dan tidak langsung meneruskan pesan. Carilah sumber resmi, tanggal pemeriksaan, nama lembaga, dan hasil laboratorium. Gunakan kata "diduga" jika pemeriksaan belum selesai.

Pada 14 Oktober 2016, BPOM menjelaskan bahwa sampel Permen Jari dari beberapa wilayah diuji di laboratorium dan seluruh hasilnya negatif narkoba. Pada 4 April 2018, BPOM juga menyatakan sampel permen dalam kasus di Kepulauan Meranti hasilnya negatif narkoba.

- FAKTA: informasi yang sudah diperiksa dan didukung hasil resmi.
- DUGAAN: informasi yang masih perlu pemeriksaan.
- OPINI: pendapat seseorang, bukan hasil laboratorium.

Aturan emas: jangan menyebarkan kabar sebelum memeriksa sumber resmi, jangan menuduh tanpa bukti, dan jangan menganggap warna cerah sebagai bukti pasti bahan berbahaya.

## Misi 4 • Berhenti, Simpan, Beri Tahu
Jika makanan terasa atau berbau tidak wajar, berhentilah makan. Tetap tenang. Jika memungkinkan, simpan kemasan serta sisa makanan.
- Segera beri tahu guru, orang tua, atau petugas kesehatan jika kamu merasa sakit.
- Ceritakan apa yang dimakan, kapan dimakan, dan keluhan yang dirasakan.
- Jangan menyelidiki, mencicipi ulang, atau menguji makanan sendiri.

## Kenali Tiga Bahaya Pangan
1. Bahaya biologis — kuman seperti bakteri, virus, atau parasit dapat mencemari makanan.
2. Bahaya kimia — BPOM menyebut boraks, formalin, Rhodamin B, dan kuning metanil sebagai bahan yang dilarang untuk pangan.
3. Bahaya fisik — benda asing seperti rambut, batu kecil, staples, atau pecahan kaca/plastik.

## Lima Langkah Aman
1. Lihat kebersihan tempat, pelindung makanan, dan alat.
2. Cek Kemasan, Label, Izin Edar, dan Kedaluwarsa.
3. Pilih jajanan yang tampak dan berbau wajar.
4. Periksa kabar melalui sumber resmi, jangan asal meneruskan.
5. Berhenti makan dan segera lapor jika ada hal tidak wajar atau keluhan.

## Penutup
Anak yang cerdas tidak mudah takut dan tidak mudah percaya kabar. Detektif jajanan yang hebat selalu memeriksa, bertanya, dan melapor. Dengan kepala tenang dan bantuan orang dewasa, waktu istirahat tetap seru dan teman-teman pun saling menjaga.

## Daftar Sumber Resmi
- BPOM, "Cek KLIK": https://www.pom.go.id/katabpom/cek-klik
- BPOM, "Cek Produk": https://cekbpom.pom.go.id/
- Kemenkes RI, "Bahaya Makanan Tercemar": https://ayosehat.kemkes.go.id/list-perangkat-ajar/bahaya-makanan-tercemar
- Kemenkes RI, "Kenali Pencegahan Keracunan Makanan": https://keslan.kemkes.go.id/view_artikel/3243/kenali-pencegahan-keracunan-makanan
- BPOM, "Bahan Berbahaya yang Dilarang untuk Pangan": https://www.pom.go.id/berita/bahan-berbahaya-yang-dilarang-untuk-pangan$c$
);