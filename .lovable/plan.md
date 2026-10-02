# Banner header yang dapat diatur

## Hasil
- Foto sekolah yang diunggah menjadi banner lebar di bagian atas Beranda.
- Banner mengikuti lebar halaman dan tetap rapi di layar ponsel maupun desktop.
- Panel admin menyediakan unggah/ganti foto, pratinjau banner, pengaturan tinggi, perbesaran, serta posisi potongan horizontal dan vertikal.
- Pengaturan banner tersimpan dan langsung dipakai pada tampilan publik.

## Implementasi
- Tambahkan pengaturan ukuran dan posisi banner pada data pengaturan situs, tetap memakai aturan publikasi yang sudah ada.
- Simpan foto awal sebagai aset aplikasi dan gunakan sebagai cadangan bila foto admin belum tersedia.
- Ubah area foto utama menjadi banner lebar dengan crop berbasis `object-position` dan skala terkontrol.
- Tambahkan slider tinggi, zoom, posisi X, dan posisi Y pada bagian Header & Identitas di panel admin.
- Periksa tampilan Beranda dan panel admin di desktop serta ponsel, lalu pastikan tidak ada kesalahan aplikasi.
