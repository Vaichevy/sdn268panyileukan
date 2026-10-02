# Perbaikan Popup Pemutar Video

## Perubahan
- Hapus perspektif global pada halaman yang membuat elemen berposisi tetap ikut bergerak saat halaman digulir.
- Pertahankan popup Reels & Stories serta Galeri Video sebagai dialog tetap, terpusat, dan dibatasi ukuran layar.
- Pastikan halaman di belakang popup terkunci selama pemutaran.
- Uji pembukaan dan posisi kedua popup sebelum dan sesudah scroll pada tampilan desktop serta ponsel.

## Detail teknis
- Batasi efek 3D hanya pada elemen interaktif, bukan pada `body` atau portal dialog.
- Gunakan portal dialog Radix yang sudah ada dengan `position: fixed` terhadap viewport.
