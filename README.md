# Template Aplikasi Quiz

Template aplikasi quiz sederhana yang dibuat dengan React, TypeScript, Vite, dan Tailwind CSS. Konten soal disimpan di file JSON, jadi Anda bisa mengganti topik dan pertanyaan tanpa mengubah logika aplikasi.

## Menjalankan project

Pastikan Node.js dan npm sudah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal. Perintah lain yang tersedia:

```bash
npm run build    # Membuat build untuk produksi di folder dist/
npm run preview  # Menjalankan preview build produksi
npm run lint     # Memeriksa kode dengan ESLint
```

## Bagian yang bisa diubah

| Yang ingin diubah | File | Keterangan |
| --- | --- | --- |
| Judul quiz, deskripsi, soal, pilihan jawaban, dan kunci jawaban | `public/data/questions.json` | Sumber data quiz yang dibaca aplikasi. |
| Teks antarmuka, alur pengerjaan, dan tampilan komponen quiz | `src/App.tsx` | Termasuk nama aplikasi, tombol, pesan hasil, dan teks footer. |
| Warna, ukuran, jarak, dan gaya tampilan | `src/App.tsx`, `src/index.css` | Sebagian besar tampilan komponen menggunakan kelas Tailwind di `App.tsx`; gaya global ada di `index.css`. |
| Judul tab browser dan ikon situs | `index.html`, `public/favicon.svg` | Ubah metadata halaman dan ganti file ikon sesuai kebutuhan. |
| Path dasar saat deployment | `vite.config.ts` | `base` saat ini disetel ke `/quiz-app/`. Sesuaikan dengan path tempat aplikasi dipublikasikan. |

## Mengubah data quiz

Edit `public/data/questions.json`. Bentuk datanya seperti berikut:

```json
{
  "title": "Quiz Pengetahuan Umum",
  "description": "Uji pengetahuan umum kamu.",
  "questions": [
    {
      "id": 1,
      "question": "Warna apa yang dihasilkan dari campuran biru dan kuning?",
      "options": ["Ungu", "Hijau", "Oranye", "Merah"],
      "answer": 1
    }
  ]
}
```

Ketentuan data:

- `title` dan `description` mengatur judul serta deskripsi yang tampil di halaman quiz.
- Setiap objek dalam `questions` berisi `id`, teks `question`, daftar `options`, dan `answer`.
- `answer` adalah indeks pilihan yang benar, dimulai dari `0`. Pada contoh, `1` berarti pilihan kedua (`"Hijau"`).
- Setiap soal harus memiliki setidaknya dua pilihan, dan nilai `answer` harus menunjuk ke salah satu pilihan yang tersedia.
- Anda dapat menambah, menghapus, atau mengurutkan soal dengan mengubah isi array `questions`.

## Catatan

Saat ini aplikasi memuat quiz dari satu file JSON statis, `public/data/questions.json`; belum ada dashboard admin atau database untuk mengelola soal. Untuk mengganti kalimat antarmuka atau perilaku quiz, edit komponen di `src/App.tsx`.
