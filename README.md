# 🌿 SwapMates

> **Dompet aman, kos nyaman, kuliah lancar tanpa boros.**  
> Marketplace preloved berbasis web untuk membantu mahasiswa menemukan dan menawarkan barang kebutuhan kuliah maupun kos di sekitar kampus.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-swapmates.vercel.app-000000?style=for-the-badge&logo=vercel)](https://swapmates.vercel.app)
![HTML5](https://img.shields.io/badge/HTML5-vanilla-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-vanilla-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow?style=for-the-badge&logo=javascript)

---

## 📌 Tentang Proyek

Mahasiswa sering membutuhkan buku, alat kuliah, elektronik, dan perlengkapan kos dengan harga terjangkau. Pada saat yang sama, banyak barang yang masih layak pakai justru tidak lagi digunakan oleh pemiliknya.

**SwapMates** dibuat sebagai konsep marketplace preloved yang mempertemukan mahasiswa di sekitar kampus. Pengguna dapat melihat katalog barang, membandingkan harga, menyimpan barang incaran, dan melihat informasi area COD.

Proyek ini merupakan **prototipe front-end berbasis browser**. Interaksi katalog dan beberapa data demo berjalan di sisi pengguna tanpa backend atau database.

## ✨ Fitur

- **Katalog barang:** menampilkan produk contoh dari beberapa kategori, seperti buku dan modul, elektronik, perlengkapan kos, serta atribut kampus.
- **Pencarian dan filter:** mencari nama barang serta menyaring berdasarkan kategori, area COD, kondisi, dan batas harga.
- **Detail produk:** melihat deskripsi, harga, estimasi penghematan, kondisi, lokasi, serta informasi penjual.
- **Daftar incaran:** menyimpan atau menghapus barang favorit menggunakan tombol wishlist.
- **Tema terang dan gelap:** mengganti tampilan dan menyimpan preferensi tema di browser.
- **Hematanku:** melihat ringkasan penghematan dan aktivitas transaksi simulasi.
- **Simulasi chat dan transaksi:** mencoba alur percakapan, penawaran harga, dan pembelian tanpa menghubungkan layanan transaksi sungguhan.
- **Halaman informasi:** menyediakan halaman Tentang Kami, Kategori, Area Sekitar, Jual Barang, Privasi, dan Syarat & Ketentuan.
- **Responsive layout:** menyesuaikan tampilan untuk perangkat desktop maupun mobile.

## 🛠️ Teknologi

SwapMates dibuat tanpa framework maupun library UI.

| Teknologi | Penggunaan |
| --- | --- |
| **HTML5** | Struktur halaman dan komponen antarmuka |
| **CSS3** | Styling, layout, animasi, tema, dan responsive design |
| **Vanilla JavaScript** | Manipulasi DOM, event handling, filter katalog, dan interaksi aplikasi |
| **Web Storage API (localStorage)** | Menyimpan preferensi tema, wishlist, dan status transaksi simulasi di browser |
| **Vercel** | Deployment website statis |

## 🏗️ Struktur Proyek

    SwapMates/
    ├── .gitattributes
    ├── .vscode/
    │   └── settings.json
    │
    ├── assets/
    │   ├── icons/
    │   │   ├── notification-icon.png
    │   │   └── profile-icon.png
    │   └── images/
    │       └── vector.png
    │
    ├── css/
    │   └── style.css
    │
    ├── js/
    │   └── script.js
    │
    ├── pages/
    │   ├── .gitkeep
    │   ├── about.html
    │   ├── categories.html
    │   ├── nearby.html
    │   ├── post.html
    │   ├── privacy.html
    │   ├── terms.html
    │   └── pages.css
    │
    ├── index.html
    └── README.md

### Penjelasan Struktur

- **index.html** — halaman utama yang berisi katalog, hero section, kategori, informasi komunitas, dan dialog interaktif aplikasi.
- **css/style.css** — stylesheet utama untuk layout, komponen, responsive design, dan tema.
- **js/script.js** — pusat logika front-end, termasuk data produk contoh, rendering katalog, pencarian, filter, wishlist, dialog, serta simulasi interaksi.
- **pages/** — kumpulan halaman HTML tambahan. File **pages.css** berisi styling khusus untuk halaman-halaman tersebut.
- **assets/** — menyimpan file gambar dan ikon yang digunakan oleh antarmuka.

## ⚙️ Arsitektur Aplikasi

SwapMates menggunakan pendekatan **client-side rendering sederhana dengan Vanilla JavaScript**. Struktur aplikasinya dibagi menjadi beberapa bagian:

1. **Presentation layer** — HTML menyediakan struktur halaman, sedangkan CSS mengatur tampilan dan responsivitas.
2. **Interaction layer** — JavaScript menangani event pengguna, manipulasi DOM, rendering produk, pencarian, filter, dan dialog.
3. **Data layer** — produk contoh didefinisikan langsung dalam **js/script.js**. Status wishlist, transaksi simulasi, dan preferensi tema disimpan pada **localStorage**.
4. **Navigation layer** — halaman utama dan halaman informasi terpisah menggunakan tautan HTML biasa serta query parameter untuk membawa filter kategori atau area ke katalog.

### Alur Aplikasi

    index.html
        │
        ├── css/style.css
        │
        └── js/script.js
              │
              ├── Data produk contoh
              ├── Render katalog ke DOM
              ├── Search dan filter
              ├── Wishlist
              ├── Dialog dan simulasi interaksi
              └── localStorage
                     ├── Wishlist
                     ├── Status transaksi demo
                     └── Preferensi tema

    pages/
        ├── about.html
        ├── categories.html
        ├── nearby.html
        ├── post.html
        ├── privacy.html
        └── terms.html

**Tidak ada backend atau database eksternal.** Data demo disimpan secara lokal pada browser, sehingga tidak otomatis tersinkronisasi antarperangkat atau antar pengguna.

## 🚀 Menjalankan Proyek Secara Lokal

Karena proyek ini berupa website statis, kamu tidak perlu menginstal package atau menjalankan perintah build.

1. **Clone repository**

       git clone https://github.com/kiy0raaaa/SwapMates.git
       cd SwapMates

2. **Jalankan server lokal**

   Jika Python 3 tersedia, jalankan:

       python -m http.server 5500

   Alternatifnya, buka folder proyek menggunakan VS Code dan jalankan melalui ekstensi **Live Server**.

3. **Buka website**

   Akses alamat berikut di browser:

       http://localhost:5500

Tidak ada perintah **npm install**, **npm run dev**, atau **npm run build** yang diperlukan.

## ⚠️ Batasan Prototipe

- Katalog menggunakan data produk contoh yang didefinisikan di JavaScript.
- Wishlist dan status transaksi merupakan data lokal pada browser.
- Chat hanya menampilkan simulasi percakapan dan balasan otomatis.
- Pembelian bukan transaksi sungguhan dan tidak melibatkan pembayaran.
- Lokasi serta jarak produk merupakan informasi contoh, bukan hasil pelacakan GPS atau perhitungan radius secara langsung.
- Belum tersedia autentikasi pengguna, API, backend, maupun database bersama.
- Proses submit form untuk menambahkan produk ke katalog masih dalam tahap pengembangan.

## 🔗 Tautan

- **Live Demo:** [swapmates.vercel.app](https://swapmates.vercel.app)
- **GitHub Repository:** [kiy0raaaa/SwapMates](https://github.com/kiy0raaaa/SwapMates)
